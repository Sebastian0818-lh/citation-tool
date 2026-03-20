/**
 * 统一引文解析入口
 * 分层解析策略：结构化格式 → 已知格式模式匹配 → 启发式兜底
 */

import type { ParseResult } from '../types'
import { detectFormat } from './detectFormat'
import { parseGbt7714 } from './gbtParser'
import { parseApa } from './apaParser'
import { parseIeee } from './ieeeParser'
import { parseGeneric } from './genericParser'

export { detectFormat, type FormatDetection, type DetectedFormat } from './detectFormat'

/**
 * 解析引文文本为结构化 CslItem
 * 返回解析结果及置信度
 */
export function parseCitation(text: string): ParseResult {
  const trimmed = text.trim()
  if (!trimmed) {
    return parseGeneric(trimmed)
  }

  // 第一步：检测格式
  const detection = detectFormat(trimmed)

  // 第二步：根据检测结果选择对应解析器
  let result: ParseResult | null = null

  switch (detection.format) {
    case 'gb-t-7714':
      result = parseGbt7714(trimmed)
      break

    case 'apa':
      result = parseApa(trimmed)
      break

    case 'ieee':
      result = parseIeee(trimmed)
      break

    case 'bibtex':
    case 'ris':
    case 'csl-json':
      // 结构化格式暂用通用解析器，后续集成 Citation.js
      result = parseGeneric(trimmed)
      if (result) {
        result.detectedFormat = detection.format
      }
      break

    default:
      // 未识别格式：依次尝试各解析器
      result = parseGbt7714(trimmed)
        || parseApa(trimmed)
        || parseIeee(trimmed)
      break
  }

  // 兜底：通用解析器
  if (!result) {
    result = parseGeneric(trimmed)
  }

  return result
}

/**
 * 批量解析多条引文
 * 自动按空行分隔
 */
export function parseCitations(text: string): ParseResult[] {
  const entries = text
    .split(/\n\s*\n/)
    .map(s => s.trim())
    .filter(Boolean)

  return entries.map(parseCitation)
}
