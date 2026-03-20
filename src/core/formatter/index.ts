import type { CslItem, CitationStyle } from '../types'
import { formatWithCiteproc, formatMultipleStyles } from './citeprocEngine'

export { preloadCommonStyles } from './styleLoader'

/**
 * 格式化单条引文为指定格式
 */
export async function formatCitation(
  item: CslItem,
  style: CitationStyle
): Promise<string> {
  return formatWithCiteproc(item, style)
}

/**
 * 格式化单条引文为多种格式
 */
export async function formatAllStyles(
  item: CslItem,
  styles: CitationStyle[]
): Promise<Record<CitationStyle, string>> {
  return formatMultipleStyles(item, styles)
}
