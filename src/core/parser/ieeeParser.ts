/**
 * IEEE 格式引文解析器
 *
 * IEEE 格式特征：
 * - [1] A. B. Author, "Title," Journal, vol. X, no. Y, pp. Z-W, Mon. Year.
 * - [1] A. B. Author, Book Title. City: Publisher, Year.
 */

import type { CslItem, CslName, ParseResult } from '../types'
import { generateId } from '../constants'
import { parseAuthorName } from '../nameUtils'

export function parseIeee(text: string): ParseResult | null {
  const trimmed = text.trim()
  const fieldConfidence: Record<string, number> = {}

  // 去掉开头的编号 [1], [2] 等
  const cleaned = trimmed.replace(/^\[\d+\]\s*/, '')
  if (!cleaned) return null

  const item: CslItem = {
    id: generateId(),
    type: 'article-journal',
    title: '',
  }

  // IEEE 核心模式: Authors, "Title," Source info
  // 标题在引号内
  const quotedTitleMatch = cleaned.match(/^(.+?),\s*"([^"]+),"?\s*(.*)$/)

  if (quotedTitleMatch) {
    const [, authorStr, title, sourceInfo] = quotedTitleMatch

    // 作者
    item.author = parseIeeeAuthors(authorStr)
    fieldConfidence['author'] = item.author.length > 0 ? 0.8 : 0.4

    // 标题
    item.title = title.trim()
    fieldConfidence['title'] = 0.85

    // 解析来源信息
    parseIeeeSource(sourceInfo, item, fieldConfidence)
  } else {
    // 尝试无引号模式（书籍等）
    // Authors, Title. City: Publisher, Year.
    const bookMatch = cleaned.match(/^(.+?),\s+([^.]+)\.\s*(.*)$/)
    if (bookMatch) {
      item.type = 'book'
      item.author = parseIeeeAuthors(bookMatch[1])
      item.title = bookMatch[2].trim()
      fieldConfidence['author'] = 0.7
      fieldConfidence['title'] = 0.7

      parseBookSource(bookMatch[3], item, fieldConfidence)
    } else {
      return null
    }
  }

  const avgConfidence = Object.values(fieldConfidence).length > 0
    ? Object.values(fieldConfidence).reduce((a, b) => a + b, 0) / Object.values(fieldConfidence).length
    : 0.5

  return {
    item,
    confidence: avgConfidence,
    detectedFormat: 'ieee',
    fieldConfidence,
  }
}

/** 解析 IEEE 作者字符串 */
function parseIeeeAuthors(str: string): CslName[] {
  // IEEE: "A. B. Last, C. D. Last, and E. F. Last"
  const cleaned = str.replace(/,?\s*and\s+/i, ', ').trim()
  const parts = cleaned.split(/,\s*/).filter(Boolean)
  return parts.map(p => parseAuthorName(p.trim())).filter(n => n.family)
}

/** 解析 IEEE 期刊来源信息 */
function parseIeeeSource(info: string, item: CslItem, fc: Record<string, number>) {
  if (!info) return

  // 期刊名: 直到 "vol." 或 ","
  const journalMatch = info.match(/^([^,]+?)(?:,\s*vol\.|,\s*\d)/)
  if (journalMatch) {
    item['container-title'] = journalMatch[1].trim()
    fc['container-title'] = 0.8
  } else {
    // 第一个逗号前为期刊名
    const firstComma = info.indexOf(',')
    if (firstComma > 0) {
      item['container-title'] = info.substring(0, firstComma).trim()
      fc['container-title'] = 0.6
    }
  }

  // vol. X
  const volMatch = info.match(/vol\.\s*(\d+)/i)
  if (volMatch) {
    item.volume = volMatch[1]
    fc['volume'] = 0.9
  }

  // no. Y
  const noMatch = info.match(/no\.\s*(\d+)/i)
  if (noMatch) {
    item.issue = noMatch[1]
    fc['issue'] = 0.9
  }

  // pp. Z-W
  const ppMatch = info.match(/pp?\.\s*(\d+\s*[-–]\s*\d+)/i)
  if (ppMatch) {
    item.page = ppMatch[1].replace(/\s/g, '').replace('–', '-')
    fc['page'] = 0.9
  }

  // 年份
  const yearMatch = info.match(/\b(19|20)\d{2}\b/)
  if (yearMatch) {
    item.issued = { 'date-parts': [[parseInt(yearMatch[0])]] }
    fc['issued'] = 0.85
  }

  // DOI
  const doiMatch = info.match(/doi:\s*([^\s,]+)/i)
  if (doiMatch) {
    item.DOI = doiMatch[1].replace(/\.$/, '')
    fc['DOI'] = 0.95
  }
}

/** 解析 IEEE 书籍来源信息 */
function parseBookSource(info: string, item: CslItem, fc: Record<string, number>) {
  // City: Publisher, Year
  const colonMatch = info.match(/^([^:]+):\s*(.+)/)
  if (colonMatch) {
    item['publisher-place'] = colonMatch[1].trim()
    fc['publisher-place'] = 0.75

    const rest = colonMatch[2]
    const commaIdx = rest.lastIndexOf(',')
    if (commaIdx > 0) {
      item.publisher = rest.substring(0, commaIdx).trim()
      fc['publisher'] = 0.75
    }
  }

  const yearMatch = info.match(/\b(19|20)\d{2}\b/)
  if (yearMatch) {
    item.issued = { 'date-parts': [[parseInt(yearMatch[0])]] }
    fc['issued'] = 0.85
  }
}
