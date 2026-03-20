/**
 * GB/T 7714 格式引文解析器
 *
 * GB/T 7714 格式特征：
 * - 包含类型标记 [J], [M], [C], [D], [R], [N], [S], [P], [EB/OL]
 * - 格式：作者. 标题[类型]. 来源信息, 年份, 卷(期): 页码.
 */

import type { CslItem, CslName, CslDate, ParseResult, GbtTypeCode } from '../types'
import { GBT_TO_CSL, generateId } from '../constants'
import { parseAuthorName } from '../nameUtils'

/** 匹配 GB/T 7714 类型标记 */
const TYPE_PATTERN = /\[(J|M|C|D|R|N|S|P|EB\/OL)\]/

export function parseGbt7714(text: string): ParseResult | null {
  const trimmed = text.trim()
  const typeMatch = trimmed.match(TYPE_PATTERN)
  if (!typeMatch) return null

  const typeCode = typeMatch[1] as GbtTypeCode
  const cslType = GBT_TO_CSL[typeCode]
  const fieldConfidence: Record<string, number> = {}

  // 以类型标记分割：标记前是"作者. 标题"，标记后是来源信息
  const typeIndex = trimmed.indexOf(`[${typeCode}]`)
  const beforeType = trimmed.substring(0, typeIndex).trim()
  const afterType = trimmed.substring(typeIndex + typeCode.length + 2).trim()

  // 解析作者和标题：以第一个 "." 分隔
  // GB/T 7714 格式：作者. 标题[类型标识]
  // 中文文献常省略点后空格，写为 "王婉潞,王海媚.21世纪以来..."
  let authors = ''
  let title = ''
  // 查找第一个半角句号的位置
  const dotIndex = beforeType.indexOf('.')
  if (dotIndex > 0) {
    authors = beforeType.substring(0, dotIndex).trim()
    title = beforeType.substring(dotIndex + 1).trim()
    fieldConfidence['author'] = 0.85
    fieldConfidence['title'] = 0.85
  } else {
    title = beforeType
    fieldConfidence['title'] = 0.6
  }

  // 去掉标题末尾的句号
  title = title.replace(/[.．。]$/, '')

  const item: CslItem = {
    id: generateId(),
    type: cslType,
    title,
  }

  // 解析作者
  if (authors) {
    item.author = parseGbtAuthors(authors)
  }

  // 根据类型解析后续信息
  const cleanAfter = afterType.replace(/^[.\s]+/, '').replace(/[.\s]+$/, '')

  switch (typeCode) {
    case 'J':
      parseJournalInfo(cleanAfter, item, fieldConfidence)
      break
    case 'M':
      parseBookInfo(cleanAfter, item, fieldConfidence)
      break
    case 'C':
      parseConferenceInfo(cleanAfter, item, fieldConfidence)
      break
    case 'D':
      parseThesisInfo(cleanAfter, item, fieldConfidence)
      break
    case 'N':
      parseNewspaperInfo(cleanAfter, item, fieldConfidence)
      break
    case 'P':
      parsePatentInfo(cleanAfter, item, fieldConfidence)
      break
    case 'EB/OL':
      parseWebInfo(cleanAfter, item, fieldConfidence)
      break
    default:
      parseGenericInfo(cleanAfter, item, fieldConfidence)
  }

  const avgConfidence = Object.values(fieldConfidence).length > 0
    ? Object.values(fieldConfidence).reduce((a, b) => a + b, 0) / Object.values(fieldConfidence).length
    : 0.5

  return {
    item,
    confidence: avgConfidence,
    detectedFormat: 'gb-t-7714',
    fieldConfidence,
  }
}

/** 解析 GB/T 7714 作者字符串 */
function parseGbtAuthors(str: string): CslName[] {
  // GB/T 7714 作者以逗号分隔，"等" 或 "et al" 表示省略
  const cleaned = str.replace(/,?\s*(等|et\s+al\.?)\.?$/i, '').trim()
  const parts = cleaned.split(/,\s*/)
  return parts.map(p => parseAuthorName(p.trim())).filter(n => n.family)
}

/** 解析年份 */
function extractYear(str: string): CslDate | null {
  const match = str.match(/\b(19|20)\d{2}\b/)
  if (match) {
    return { 'date-parts': [[parseInt(match[0])]] }
  }
  return null
}

/** 期刊 [J]: 期刊名, 年份, 卷(期): 页码 */
function parseJournalInfo(info: string, item: CslItem, fc: Record<string, number>) {
  // 模式: 期刊名, 年, 卷(期): 页码
  const parts = info.split(',').map(s => s.trim())

  if (parts.length >= 1) {
    item['container-title'] = parts[0]
    fc['container-title'] = 0.8
  }

  // 寻找年份
  const yearDate = extractYear(info)
  if (yearDate) {
    item.issued = yearDate
    fc['issued'] = 0.85
  }

  // 卷(期) 模式：支持 42(06)、29(12)、(03) 等
  const volIssueMatch = info.match(/(\d+)\s*\((\d+)\)/)
  if (volIssueMatch) {
    item.volume = volIssueMatch[1]
    item.issue = volIssueMatch[2]
    fc['volume'] = 0.85
    fc['issue'] = 0.85
  } else {
    // 仅有期号无卷号：如 (03) 或 (5)
    const issueOnlyMatch = info.match(/\((\d+)\)/)
    if (issueOnlyMatch) {
      item.issue = issueOnlyMatch[1]
      fc['issue'] = 0.75
    }
  }

  // 页码: 数字-数字 或 数字，支持 111-124+4 这种格式
  const pageMatch = info.match(/:\s*(\d+[\s]*[-–]\s*\d+(?:\+\d+)?|\d+)\s*\.?\s*$/)
  if (pageMatch) {
    item.page = pageMatch[1].replace(/\s/g, '').replace(/\+.*$/, '')
    fc['page'] = 0.8
  }
}

/** 图书 [M]: 出版地: 出版社, 年 */
function parseBookInfo(info: string, item: CslItem, fc: Record<string, number>) {
  // 模式: 出版地: 出版社, 年
  const colonMatch = info.match(/^([^:]+):\s*(.+)/)
  if (colonMatch) {
    item['publisher-place'] = colonMatch[1].trim()
    fc['publisher-place'] = 0.75

    const rest = colonMatch[2]
    const commaIdx = rest.lastIndexOf(',')
    if (commaIdx > 0) {
      item.publisher = rest.substring(0, commaIdx).trim()
      fc['publisher'] = 0.8
    } else {
      item.publisher = rest.replace(/\d{4}.*$/, '').trim()
      fc['publisher'] = 0.6
    }
  }

  const yearDate = extractYear(info)
  if (yearDate) {
    item.issued = yearDate
    fc['issued'] = 0.85
  }

  // 页码
  const pageMatch = info.match(/:\s*(\d+[\s]*[-–]\s*\d+|\d+)\s*\.?\s*$/)
  if (pageMatch) {
    item.page = pageMatch[1].replace(/\s/g, '')
    fc['page'] = 0.7
  }
}

/** 会议 [C]: 会议名. 出版地: 出版者, 年 */
function parseConferenceInfo(info: string, item: CslItem, fc: Record<string, number>) {
  const dotParts = info.split(/\.\s*/)
  if (dotParts.length >= 1) {
    item['container-title'] = dotParts[0].trim()
    fc['container-title'] = 0.7
  }
  parseBookInfo(dotParts.slice(1).join('. '), item, fc)
}

/** 学位论文 [D]: 城市: 授予单位, 年  或  授予单位, 年 */
function parseThesisInfo(info: string, item: CslItem, fc: Record<string, number>) {
  // 学位论文可能省略出版地，格式为 "授予单位,年"
  if (info.includes(':')) {
    parseBookInfo(info, item, fc)
  } else {
    // 无冒号：直接解析 "授予单位,年"
    const parts = info.split(',').map(s => s.trim())
    if (parts.length >= 1) {
      item.publisher = parts[0]
      fc['publisher'] = 0.8
    }
    const yearDate = extractYear(info)
    if (yearDate) {
      item.issued = yearDate
      fc['issued'] = 0.85
    }
  }
}

/** 报纸 [N]: 报纸名, 日期(版次) */
function parseNewspaperInfo(info: string, item: CslItem, fc: Record<string, number>) {
  const parts = info.split(',').map(s => s.trim())
  if (parts.length >= 1) {
    item['container-title'] = parts[0]
    fc['container-title'] = 0.8
  }

  // 日期匹配: 2024-03-15
  const dateMatch = info.match(/(\d{4})-(\d{1,2})-(\d{1,2})/)
  if (dateMatch) {
    item.issued = {
      'date-parts': [[parseInt(dateMatch[1]), parseInt(dateMatch[2]), parseInt(dateMatch[3])]],
    }
    fc['issued'] = 0.9
  } else {
    const yearDate = extractYear(info)
    if (yearDate) {
      item.issued = yearDate
      fc['issued'] = 0.7
    }
  }

  // 版次: (数字)
  const editionMatch = info.match(/\((\d+)\)\s*\.?\s*$/)
  if (editionMatch) {
    item.page = editionMatch[1]
    fc['page'] = 0.7
  }
}

/** 专利 [P]: 专利号, 日期 */
function parsePatentInfo(info: string, item: CslItem, fc: Record<string, number>) {
  const parts = info.split(',').map(s => s.trim())
  if (parts.length >= 1) {
    item.number = parts[0]
    fc['number'] = 0.8
  }

  const dateMatch = info.match(/(\d{4})-(\d{1,2})-(\d{1,2})/)
  if (dateMatch) {
    item.issued = {
      'date-parts': [[parseInt(dateMatch[1]), parseInt(dateMatch[2]), parseInt(dateMatch[3])]],
    }
    fc['issued'] = 0.85
  }
}

/** 电子资源 [EB/OL]: (日期)[引用日期]. URL */
function parseWebInfo(info: string, item: CslItem, fc: Record<string, number>) {
  // URL
  const urlMatch = info.match(/(https?:\/\/[^\s]+)/)
  if (urlMatch) {
    item.URL = urlMatch[1].replace(/[.。]$/, '')
    fc['URL'] = 0.9
  }

  // 发布日期: (2024-01-01)
  const pubDateMatch = info.match(/\((\d{4}(?:-\d{1,2}(?:-\d{1,2})?)?)\)/)
  if (pubDateMatch) {
    const parts = pubDateMatch[1].split('-').map(Number)
    item.issued = { 'date-parts': [parts as [number, number?, number?]] }
    fc['issued'] = 0.8
  }

  // 引用日期: [2024-01-01]
  const accessMatch = info.match(/\[(\d{4}-\d{1,2}-\d{1,2})\]/)
  if (accessMatch) {
    const parts = accessMatch[1].split('-').map(Number)
    item.accessed = { 'date-parts': [parts as [number, number?, number?]] }
    fc['accessed'] = 0.8
  }
}

/** 通用解析（报告、标准等） */
function parseGenericInfo(info: string, item: CslItem, fc: Record<string, number>) {
  const yearDate = extractYear(info)
  if (yearDate) {
    item.issued = yearDate
    fc['issued'] = 0.7
  }

  const colonMatch = info.match(/^([^:]+):\s*(.+)/)
  if (colonMatch) {
    item['publisher-place'] = colonMatch[1].trim()
    item.publisher = colonMatch[2].replace(/,\s*\d{4}.*$/, '').trim()
    fc['publisher-place'] = 0.6
    fc['publisher'] = 0.6
  }
}
