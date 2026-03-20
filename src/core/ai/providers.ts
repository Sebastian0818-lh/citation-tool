/**
 * LLM Provider 适配层
 * 支持 OpenAI、Anthropic、DeepSeek、智谱GLM、Moonshot/Kimi
 * 国内模型均兼容 OpenAI API 格式
 */

export type AiProvider = 'openai' | 'anthropic' | 'deepseek' | 'zhipu' | 'moonshot'

export interface AiConfig {
  provider: AiProvider
  apiKey: string
  model?: string
  baseUrl?: string
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

/** 默认模型 */
const DEFAULT_MODELS: Record<AiProvider, string> = {
  openai: 'gpt-4o-mini',
  anthropic: 'claude-sonnet-4-6',
  deepseek: 'deepseek-chat',
  zhipu: 'glm-5',
  moonshot: 'kimi-k2.5',
}

/** 默认 API 端点 */
const DEFAULT_URLS: Record<AiProvider, string> = {
  openai: 'https://api.openai.com/v1/chat/completions',
  anthropic: 'https://api.anthropic.com/v1/messages',
  deepseek: 'https://api.deepseek.com/v1/chat/completions',
  zhipu: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
  moonshot: 'https://api.moonshot.cn/v1/chat/completions',
}

/** Provider 显示信息 */
export const PROVIDER_INFO: Record<AiProvider, { label: string; placeholder: string; description: string; models: { value: string; label: string }[] }> = {
  deepseek: {
    label: 'DeepSeek', placeholder: 'sk-...', description: '',
    models: [
      { value: 'deepseek-chat', label: 'DeepSeek-V3.2（推荐）' },
      { value: 'deepseek-reasoner', label: 'DeepSeek-R1（深度推理）' },
    ],
  },
  zhipu: {
    label: '智谱 GLM', placeholder: '...', description: '',
    models: [
      { value: 'glm-5', label: 'GLM-5（最新）' },
      { value: 'glm-5-turbo', label: 'GLM-5-Turbo' },
      { value: 'glm-4.7', label: 'GLM-4.7' },
      { value: 'glm-4.7-flash', label: 'GLM-4.7-Flash（免费）' },
      { value: 'glm-4-flash-250414', label: 'GLM-4-Flash（免费）' },
    ],
  },
  moonshot: {
    label: 'Moonshot', placeholder: 'sk-...', description: '',
    models: [
      { value: 'kimi-k2.5', label: 'Kimi K2.5（最新，推荐）' },
      { value: 'kimi-k2-0905-preview', label: 'Kimi K2（增强编程）' },
      { value: 'kimi-k2-turbo-preview', label: 'Kimi K2 Turbo（高速）' },
      { value: 'moonshot-v1-8k', label: 'Moonshot-v1-8K' },
      { value: 'moonshot-v1-32k', label: 'Moonshot-v1-32K' },
    ],
  },
  openai: {
    label: 'OpenAI', placeholder: 'sk-...', description: '',
    models: [
      { value: 'gpt-4o-mini', label: 'GPT-4o-mini（推荐）' },
      { value: 'gpt-4o', label: 'GPT-4o' },
      { value: 'gpt-4.1-mini', label: 'GPT-4.1-mini' },
      { value: 'gpt-4.1', label: 'GPT-4.1' },
    ],
  },
  anthropic: {
    label: 'Anthropic', placeholder: 'sk-ant-...', description: '',
    models: [
      { value: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6（推荐）' },
      { value: 'claude-opus-4-6', label: 'Claude Opus 4.6（最强）' },
      { value: 'claude-haiku-4-5', label: 'Claude Haiku 4.5（最快）' },
    ],
  },
}

/**
 * 调用 LLM API
 */
export async function callLlm(
  config: AiConfig,
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  const { provider, apiKey, model, baseUrl } = config

  if (provider === 'anthropic') {
    return callAnthropic(apiKey, model || DEFAULT_MODELS.anthropic, baseUrl || DEFAULT_URLS.anthropic, systemPrompt, userMessage)
  }

  // OpenAI、DeepSeek、智谱、Moonshot 均兼容 OpenAI API 格式
  const url = baseUrl || DEFAULT_URLS[provider] || DEFAULT_URLS.openai
  const modelName = model || DEFAULT_MODELS[provider] || DEFAULT_MODELS.openai
  return callOpenAiCompatible(apiKey, modelName, url, systemPrompt, userMessage)
}

async function callOpenAiCompatible(
  apiKey: string,
  model: string,
  url: string,
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMessage },
  ]

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, messages, temperature: 0.1 }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`API 错误 (${response.status}): ${error}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || ''
}

async function callAnthropic(
  apiKey: string,
  model: string,
  url: string,
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Anthropic API 错误 (${response.status}): ${error}`)
  }

  const data = await response.json()
  return data.content?.[0]?.text || ''
}
