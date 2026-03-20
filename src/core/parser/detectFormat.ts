/**
 * 自动检测引文文本的格式
 */

export type DetectedFormat =
  | 'bibtex'
  | 'ris'
  | 'csl-json'
  | 'gb-t-7714'
  | 'apa'
  | 'ieee'
  | 'mla'
  | 'chicago'
  | 'vancouver'
  | 'unknown'

export interface FormatDetection {
  format: DetectedFormat
  confidence: number // 0-1
  label: string
}

const FORMAT_LABELS: Record<DetectedFormat, string> = {
  'bibtex': 'BibTeX',
  'ris': 'RIS',
  'csl-json': 'CSL-JSON',
  'gb-t-7714': 'GB/T 7714',
  'apa': 'APA',
  'ieee': 'IEEE',
  'mla': 'MLA',
  'chicago': 'Chicago',
  'vancouver': 'Vancouver',
  'unknown': '未识别',
}

/**
 * 检测输入文本的引用格式
 */
export function detectFormat(input: string): FormatDetection {
  const trimmed = input.trim()
  if (!trimmed) return { format: 'unknown', confidence: 0, label: '未识别' }

  // BibTeX: 以 @ 开头
  if (/^@\w+\s*\{/.test(trimmed)) {
    return { format: 'bibtex', confidence: 0.95, label: FORMAT_LABELS.bibtex }
  }

  // RIS: 以 "TY  - " 开头
  if (/^TY\s{2}-\s/.test(trimmed)) {
    return { format: 'ris', confidence: 0.95, label: FORMAT_LABELS.ris }
  }

  // CSL-JSON: 以 { 或 [ 开头，包含 "type" 字段
  if (/^\s*[\[{]/.test(trimmed)) {
    try {
      const parsed = JSON.parse(trimmed)
      const items = Array.isArray(parsed) ? parsed : [parsed]
      if (items[0]?.type && items[0]?.title) {
        return { format: 'csl-json', confidence: 0.9, label: FORMAT_LABELS['csl-json'] }
      }
    } catch {
      // 不是 JSON，继续检测
    }
  }

  // GB/T 7714: 包含类型标记 [J], [M], [C] 等
  if (/\[(J|M|C|D|R|N|S|P|EB\/OL)\]/.test(trimmed)) {
    return { format: 'gb-t-7714', confidence: 0.9, label: FORMAT_LABELS['gb-t-7714'] }
  }

  // IEEE: 以 [数字] 开头
  if (/^\[\d+\]\s/.test(trimmed)) {
    return { format: 'ieee', confidence: 0.7, label: FORMAT_LABELS.ieee }
  }

  // APA: 包含 "(年份)." 模式，如 "Author, A. B. (2024)."
  if (/\(\d{4}[a-z]?\)\.\s/.test(trimmed)) {
    return { format: 'apa', confidence: 0.7, label: FORMAT_LABELS.apa }
  }

  // MLA: 作者后紧跟 "标题" 用引号或斜体，以句号结尾
  // MLA 特征：标题用引号括起，末尾有页码或 URL
  if (/^[A-Z][^.]+\.\s*"[^"]+[.?!]"/.test(trimmed)) {
    return { format: 'mla', confidence: 0.6, label: FORMAT_LABELS.mla }
  }

  // Vancouver: 以 "数字." 开头（无方括号），作者名缩写紧凑
  if (/^\d+\.\s+[A-Z][a-z]+\s[A-Z]{1,3}[,;]/.test(trimmed)) {
    return { format: 'vancouver', confidence: 0.6, label: FORMAT_LABELS.vancouver }
  }

  return { format: 'unknown', confidence: 0, label: FORMAT_LABELS.unknown }
}
