/**
 * AI 辅助引文解析
 */

import type { CslItem, ParseResult } from '../types'
import { generateId } from '../constants'
import type { AiConfig } from './providers'
import { callLlm } from './providers'
import { CITATION_PARSE_SYSTEM_PROMPT, buildParsePrompt, BATCH_CONVERT_SYSTEM_PROMPT, buildBatchConvertPrompt } from './prompts'

export type { AiConfig, AiProvider } from './providers'

/**
 * 使用 AI 解析引文文本
 */
export async function parseWithAi(
  text: string,
  config: AiConfig
): Promise<ParseResult> {
  const userPrompt = buildParsePrompt(text)
  const response = await callLlm(config, CITATION_PARSE_SYSTEM_PROMPT, userPrompt)

  // 从回复中提取 JSON
  const item = extractJsonFromResponse(response)

  if (!item) {
    throw new Error('AI 返回的内容无法解析为有效的引文数据')
  }

  // 确保有 id
  if (!item.id) {
    item.id = generateId()
  }

  // 验证必要字段
  if (!item.type || !item.title) {
    throw new Error('AI 解析结果缺少必要字段（type 或 title）')
  }

  return {
    item,
    confidence: 0.8, // AI 解析置信度固定为 0.8
    detectedFormat: 'ai-parsed',
    fieldConfidence: buildAiFieldConfidence(item),
  }
}

/**
 * 从 AI 回复中提取 JSON 对象
 */
function extractJsonFromResponse(response: string): CslItem | null {
  // 尝试直接解析
  try {
    return JSON.parse(response.trim()) as CslItem
  } catch {
    // 忽略
  }

  // 尝试从 markdown 代码块中提取
  const codeBlockMatch = response.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/)
  if (codeBlockMatch) {
    try {
      return JSON.parse(codeBlockMatch[1].trim()) as CslItem
    } catch {
      // 忽略
    }
  }

  // 尝试找到第一个 { 和最后一个 }
  const firstBrace = response.indexOf('{')
  const lastBrace = response.lastIndexOf('}')
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    try {
      return JSON.parse(response.substring(firstBrace, lastBrace + 1)) as CslItem
    } catch {
      // 忽略
    }
  }

  return null
}

/**
 * 为 AI 解析结果生成字段置信度
 */
function buildAiFieldConfidence(item: CslItem): Record<string, number> {
  const fc: Record<string, number> = {}
  const fields = ['title', 'author', 'issued', 'container-title', 'publisher',
    'publisher-place', 'volume', 'issue', 'page', 'DOI', 'URL', 'ISBN', 'number']

  for (const field of fields) {
    const value = (item as Record<string, unknown>)[field]
    if (value !== undefined && value !== '' && value !== null) {
      fc[field] = 0.8
    }
  }

  return fc
}

/**
 * 使用 AI 批量转换参考文献格式
 */
export async function batchConvertWithAi(
  citations: string[],
  targetFormatLabel: string,
  config: AiConfig
): Promise<string[]> {
  const userPrompt = buildBatchConvertPrompt(citations, targetFormatLabel)
  const response = await callLlm(config, BATCH_CONVERT_SYSTEM_PROMPT, userPrompt)

  // 按空行分隔结果
  const results = response
    .split(/\n\s*\n/)
    .map(s => s.trim())
    .filter(Boolean)

  // 如果结果数量和输入不匹配，尝试按单行分隔
  if (results.length !== citations.length) {
    const lineResults = response
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)
      // 去掉可能的序号
      .map(s => s.replace(/^\d{1,3}[\.\)]\s*/, ''))

    if (lineResults.length === citations.length) {
      return lineResults
    }
  }

  return results
}

/**
 * 检查 AI 配置是否有效
 */
export function isAiConfigured(config: AiConfig | null): boolean {
  return !!config && !!config.apiKey && !!config.provider
}

/**
 * 从 localStorage 读取 AI 配置
 */
export function loadAiConfig(): AiConfig | null {
  try {
    const raw = localStorage.getItem('biblio-ai-config')
    if (!raw) return null
    return JSON.parse(raw) as AiConfig
  } catch {
    return null
  }
}

/**
 * 保存 AI 配置到 localStorage
 */
export function saveAiConfig(config: AiConfig): void {
  localStorage.setItem('biblio-ai-config', JSON.stringify(config))
}

/**
 * 清除 AI 配置
 */
export function clearAiConfig(): void {
  localStorage.removeItem('biblio-ai-config')
}
