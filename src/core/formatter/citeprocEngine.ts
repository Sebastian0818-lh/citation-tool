import CSL from 'citeproc'
import type { CslItem, CitationStyle } from '../types'
import { loadCslStyle, loadLocale } from './styleLoader'

// 缓存已创建的引擎实例
const engineCache = new Map<string, CSL.Engine>()

/**
 * 创建 citeproc-js 系统适配器
 */
function createSysAdapter(items: CslItem[], locales: Map<string, string>) {
  return {
    retrieveLocale(lang: string): string {
      return locales.get(lang) || locales.get('en-US') || ''
    },
    retrieveItem(id: string): CslItem | undefined {
      return items.find(item => item.id === id)
    },
  }
}

/**
 * 使用 citeproc-js 格式化单条引文
 */
export async function formatWithCiteproc(
  item: CslItem,
  style: CitationStyle
): Promise<string> {
  const [styleXml, zhLocale, enLocale] = await Promise.all([
    loadCslStyle(style),
    loadLocale('zh-CN'),
    loadLocale('en-US'),
  ])

  const locales = new Map<string, string>()
  locales.set('zh-CN', zhLocale)
  locales.set('en-US', enLocale)

  const sys = createSysAdapter([item], locales)
  const engine = new CSL.Engine(sys, styleXml, 'zh-CN')

  engine.updateItems([item.id])

  // makeBibliography 可能返回 false（如 note-only 样式）
  const bibResult = engine.makeBibliography()
  if (bibResult && bibResult[1] && bibResult[1].length > 0) {
    return cleanHtml(bibResult[1][0])
  }

  // 回退：使用 makeCitationCluster 生成完整引用
  const citation = engine.makeCitationCluster([{ id: item.id }])
  if (citation) {
    return cleanHtml(citation)
  }

  throw new Error('citeproc-js 未能生成参考文献')
}

/**
 * 批量格式化：同一条引文，多种格式
 */
export async function formatMultipleStyles(
  item: CslItem,
  styles: CitationStyle[]
): Promise<Record<CitationStyle, string>> {
  const results = await Promise.all(
    styles.map(async (style) => {
      try {
        const formatted = await formatWithCiteproc(item, style)
        return [style, formatted] as const
      } catch (err) {
        console.error(`格式化失败 [${style}]:`, err)
        return [style, `格式化失败: ${err instanceof Error ? err.message : '未知错误'}`] as const
      }
    })
  )
  return Object.fromEntries(results) as Record<CitationStyle, string>
}

/**
 * 清理 citeproc 输出的 HTML
 */
function cleanHtml(html: string): string {
  // Step 1: Convert italic spans to <i> tags before stripping spans
  // citeproc outputs italics as <i>, <span style="font-style:italic;">, or class-based spans
  let result = html
    .replace(/<span\s+style="font-style:\s*italic;?\s*">/gi, '<i>')
    .replace(/<span\s+class="[^"]*italic[^"]*">/gi, '<i>')

  // Step 2: Fix closing tags — each </span> that was converted needs to become </i>
  // Use a simple approach: track opens and replace corresponding closes
  const parts: string[] = []
  let italicDepth = 0
  const tagRegex = /<\/?[^>]+>|[^<]+/g
  let match: RegExpExecArray | null
  while ((match = tagRegex.exec(result)) !== null) {
    const token = match[0]
    if (token === '<i>') {
      italicDepth++
      parts.push(token)
    } else if (token === '</span>' && italicDepth > 0) {
      italicDepth--
      parts.push('</i>')
    } else {
      parts.push(token)
    }
  }
  result = parts.join('')

  return result
    .replace(/<\/?div[^>]*>/g, '')
    .replace(/<b>/g, '').replace(/<\/b>/g, '')
    .replace(/<span[^>]*>/g, '').replace(/<\/span>/g, '')
    .replace(/&#38;/g, '&')
    .replace(/&#60;/g, '<')
    .replace(/&#62;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^\[\d+\]\s*/, '')
    .replace(/^\(\d+\)\s*/, '')
    .replace(/^\d{1,3}\.\s+/, '')
    .replace(/&#38;/g, '&')
    .replace(/&#60;/g, '<')
    .replace(/&#62;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
    // 去除开头的序号，如 [1] 、(1)
    // 注意：不去除纯数字+点（如 "2012. "），只去除短序号（1-3位数字）后紧跟空格的情况
    .replace(/^\[\d+\]\s*/, '')
    .replace(/^\(\d+\)\s*/, '')
    .replace(/^\d{1,3}\.\s+/, '')
}
