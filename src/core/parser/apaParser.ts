/**
 * APA 格式引文解析器
 *
 * APA 格式特征：
 * - Author, A. B., & Author, C. D. (2024). Title. Journal, Volume(Issue), Pages. DOI
 * - Author, A. B. (2024). Book title (Edition). Publisher.
 */

import type { CslItem, CslName, ParseResult } from '../types'
import { generateId } from '../constants'
import { parseAuthorName } from '../nameUtils'

export function parseApa(text: string): ParseResult | null {
  const trimmed = text.trim()
  const fieldConfidence: Record<string, number> = {}

  // APA 核心特征: 作者 (年份). 标题
  const mainMatch = trimmed.match(/^(.+?)\s*\((\d{4}[a-z]?)\)\.\s*(.+)$/)
  if (!mainMatch) return null

  const [, authorStr, yearStr, rest] = mainMatch

  const item: CslItem = {
    id: generateId(),
    type: 'article-journal', // 默认，后续可能调整
    title: '',
  }

  // 解析作者
  item.author = parseApaAuthors(authorStr)
  fieldConfidence['author'] = item.author.length > 0 ? 0.85 : 0.4

  // 解析年份
  const year = parseInt(yearStr)
  item.issued = { 'date-parts': [[year]] }
  fieldConfidence['issued'] = 0.9

  // 解析标题和来源信息
  // 期刊模式: Title. Journal, Vol(Issue), Pages. DOI
  // 书籍模式: Title (edition). Publisher.
  const italicSplit = rest.split(/\.\s+/)

  if (italicSplit.length >= 1) {
    item.title = italicSplit[0].replace(/[.。]$/, '').trim()
    fieldConfidence['title'] = 0.8
  }

  if (italicSplit.length >= 2) {
    const sourceInfo = italicSplit.slice(1).join('. ')

    // 检测是否有卷期信息 → 期刊
    const journalMatch = sourceInfo.match(/^([^,]+),\s*(\d+)\s*(?:\((\d+)\))?\s*,?\s*(\d+[-–]\d+)?/)
    if (journalMatch) {
      item.type = 'article-journal'
      item['container-title'] = journalMatch[1].trim()
      item.volume = journalMatch[2]
      if (journalMatch[3]) item.issue = journalMatch[3]
      if (journalMatch[4]) item.page = journalMatch[4].replace('–', '-')
      fieldConfidence['container-title'] = 0.8
      fieldConfidence['volume'] = 0.85
    } else {
      // 可能是书籍
      item.type = 'book'
      // 提取出版社（最后一个句号前的内容）
      const publisherMatch = sourceInfo.replace(/\.$/, '').trim()
      if (publisherMatch) {
        item.publisher = publisherMatch
        fieldConfidence['publisher'] = 0.6
      }
    }
  }

  // DOI
  const doiMatch = trimmed.match(/https?:\/\/doi\.org\/([^\s]+)|doi:\s*([^\s]+)/i)
  if (doiMatch) {
    item.DOI = (doiMatch[1] || doiMatch[2]).replace(/\.$/, '')
    fieldConfidence['DOI'] = 0.95
  }

  // URL
  if (!item.DOI) {
    const urlMatch = trimmed.match(/https?:\/\/[^\s]+/)
    if (urlMatch) {
      item.URL = urlMatch[0].replace(/\.$/, '')
      fieldConfidence['URL'] = 0.9
    }
  }

  const avgConfidence = Object.values(fieldConfidence).length > 0
    ? Object.values(fieldConfidence).reduce((a, b) => a + b, 0) / Object.values(fieldConfidence).length
    : 0.5

  return {
    item,
    confidence: avgConfidence,
    detectedFormat: 'apa',
    fieldConfidence,
  }
}

/** 解析 APA 作者字符串 */
function parseApaAuthors(str: string): CslName[] {
  // APA: "Author, A. B., & Author, C. D." 或 "Author, A. B., Author, C. D., & Author, E. F."
  const cleaned = str.replace(/\s*&\s*/g, ', ').trim()

  // 按 ", " 分隔，但需要把 "LastName, Initials" 对合并
  const tokens = cleaned.split(/,\s*/)
  const authors: CslName[] = []
  let i = 0

  while (i < tokens.length) {
    const current = tokens[i].trim()
    if (!current) { i++; continue }

    // 如果下一个 token 看起来像缩写（如 "A. B."），合并
    if (i + 1 < tokens.length && /^[A-Z]\./.test(tokens[i + 1].trim())) {
      authors.push(parseAuthorName(`${current}, ${tokens[i + 1].trim()}`))
      i += 2
    } else {
      authors.push(parseAuthorName(current))
      i++
    }
  }

  return authors.filter(n => n.family)
}
