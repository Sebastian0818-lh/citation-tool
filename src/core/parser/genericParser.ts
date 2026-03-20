/**
 * 通用启发式引文解析器
 * 当特定格式解析器无法匹配时使用
 * 置信度较低，建议用户审核
 */

import type { CslItem, ParseResult } from '../types'
import { generateId } from '../constants'
import { parseAuthorName } from '../nameUtils'

export function parseGeneric(text: string): ParseResult {
  const trimmed = text.trim()
  const fieldConfidence: Record<string, number> = {}

  const item: CslItem = {
    id: generateId(),
    type: 'article-journal', // 默认类型
    title: '',
  }

  // 按句号分段
  const segments = trimmed
    .split(/(?<=[.。])\s+/)
    .map(s => s.trim())
    .filter(Boolean)

  // 第一段通常是作者
  if (segments.length >= 1) {
    const firstSeg = segments[0].replace(/[.。]$/, '')
    // 如果第一段较短（<100字符）且不包含大量数字，可能是作者
    if (firstSeg.length < 100 && !/\d{4}/.test(firstSeg)) {
      const authors = firstSeg.split(/[,;，；]\s*/).map(s => parseAuthorName(s.trim())).filter(n => n.family)
      if (authors.length > 0 && authors.length <= 10) {
        item.author = authors
        fieldConfidence['author'] = 0.4
      }
    }
  }

  // 第二段通常是标题
  if (segments.length >= 2) {
    item.title = segments[1].replace(/[.。"'""'']$/g, '').trim()
    fieldConfidence['title'] = 0.4
  } else if (segments.length === 1 && !item.author) {
    // 如果只有一段，整体可能是标题
    item.title = segments[0].replace(/[.。]$/, '').trim()
    fieldConfidence['title'] = 0.3
  }

  // 提取年份
  const yearMatch = trimmed.match(/\b(19|20)\d{2}\b/)
  if (yearMatch) {
    item.issued = { 'date-parts': [[parseInt(yearMatch[0])]] }
    fieldConfidence['issued'] = 0.6
  }

  // 提取 DOI
  const doiMatch = trimmed.match(/(?:https?:\/\/doi\.org\/|doi:\s*)([^\s,;]+)/i)
  if (doiMatch) {
    item.DOI = doiMatch[1].replace(/\.$/, '')
    fieldConfidence['DOI'] = 0.95
  }

  // 提取 URL
  if (!item.DOI) {
    const urlMatch = trimmed.match(/https?:\/\/[^\s,;]+/)
    if (urlMatch) {
      item.URL = urlMatch[0].replace(/[.。]$/, '')
      fieldConfidence['URL'] = 0.9
      item.type = 'webpage'
    }
  }

  // 提取页码
  const pageMatch = trimmed.match(/(?:pp?\.\s*|页\s*)?(\d+)\s*[-–]\s*(\d+)/)
  if (pageMatch) {
    item.page = `${pageMatch[1]}-${pageMatch[2]}`
    fieldConfidence['page'] = 0.5
  }

  // 提取卷期
  const volMatch = trimmed.match(/(?:vol\.\s*)?(\d+)\s*\((\d+)\)/i)
  if (volMatch) {
    item.volume = volMatch[1]
    item.issue = volMatch[2]
    fieldConfidence['volume'] = 0.5
    fieldConfidence['issue'] = 0.5
  }

  const avgConfidence = Object.values(fieldConfidence).length > 0
    ? Object.values(fieldConfidence).reduce((a, b) => a + b, 0) / Object.values(fieldConfidence).length
    : 0.2

  return {
    item,
    confidence: Math.min(avgConfidence, 0.5), // 通用解析器置信度上限 0.5
    detectedFormat: 'unknown',
    fieldConfidence,
  }
}
