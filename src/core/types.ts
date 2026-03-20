/**
 * CSL-JSON 兼容的引文数据模型
 * 参考: https://github.com/citation-style-language/schema/blob/master/schemas/input/csl-data.json
 */

export interface CslName {
  family: string
  given?: string
  literal?: string
  'non-dropping-particle'?: string
  suffix?: string
}

export interface CslDate {
  'date-parts': Array<[number, number?, number?]>
  literal?: string
}

export type CslItemType =
  | 'article-journal'
  | 'book'
  | 'paper-conference'
  | 'thesis'
  | 'report'
  | 'article-newspaper'
  | 'legislation' // 用于标准 [S]
  | 'patent'
  | 'webpage'
  | 'chapter'
  | string

export interface CslItem {
  id: string
  type: CslItemType
  title: string
  author?: CslName[]
  editor?: CslName[]
  translator?: CslName[]
  issued?: CslDate
  accessed?: CslDate
  'container-title'?: string
  'collection-title'?: string
  publisher?: string
  'publisher-place'?: string
  volume?: string
  issue?: string
  page?: string
  'number-of-pages'?: string
  edition?: string
  DOI?: string
  URL?: string
  ISBN?: string
  ISSN?: string
  number?: string // 专利号、标准号等
  genre?: string // 论文类型（硕士/博士）
  abstract?: string
  language?: string // "zh-CN" | "en-US"
}

/** GB/T 7714 文献类型标记 */
export type GbtTypeCode = 'J' | 'M' | 'C' | 'D' | 'R' | 'N' | 'S' | 'P' | 'EB/OL'

/** 支持的引用格式 */
export type CitationStyle =
  | 'gb-t-7714-2015-numeric'
  | 'gb-t-7714-2015-author-date'
  | 'apa'
  | 'mla'
  | 'chicago-notes'
  | 'chicago-author-date'
  | 'ieee'
  | 'vancouver'

/** 表单字段类型 */
export type FieldType = 'text' | 'author-list' | 'date' | 'textarea' | 'select'

/** 表单字段 schema */
export interface FieldSchema {
  key: string
  label: string
  type: FieldType
  required: boolean
  placeholder?: string
  options?: { label: string; value: string }[]
}

/** 解析结果及置信度 */
export interface ParseResult {
  item: CslItem
  confidence: number // 0-1
  detectedFormat: string
  fieldConfidence: Record<string, number> // 每个字段的置信度
}
