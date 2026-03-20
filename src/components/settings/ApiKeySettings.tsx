import { useState, useEffect } from 'react'
import { loadAiConfig, saveAiConfig, clearAiConfig, type AiConfig, type AiProvider } from '../../core/ai'
import { PROVIDER_INFO } from '../../core/ai/providers'

interface ApiKeySettingsProps {
  isOpen: boolean
  onClose: () => void
}

const PROVIDERS: AiProvider[] = ['deepseek', 'zhipu', 'moonshot', 'openai', 'anthropic']

export default function ApiKeySettings({ isOpen, onClose }: ApiKeySettingsProps) {
  const [provider, setProvider] = useState<AiProvider>('deepseek')
  const [apiKey, setApiKey] = useState('')
  const [model, setModel] = useState('')
  const [baseUrl, setBaseUrl] = useState('')

  useEffect(() => {
    const config = loadAiConfig()
    if (config) {
      setProvider(config.provider)
      setApiKey(config.apiKey)
      setModel(config.model || '')
      setBaseUrl(config.baseUrl || '')
    }
  }, [isOpen])

  const handleSave = () => {
    const selectedModel = model || PROVIDER_INFO[provider].models[0]?.value || ''
    const config: AiConfig = { provider, apiKey, model: selectedModel, ...(baseUrl && { baseUrl }) }
    saveAiConfig(config)
    // Auto-close after short delay
    setTimeout(() => onClose(), 600)
  }

  const handleClear = () => {
    clearAiConfig()
    setApiKey('')
    setModel('')
    setBaseUrl('')
  }

  if (!isOpen) return null

  const info = PROVIDER_INFO[provider]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 animate-fade-in" style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(12px)' }} onClick={onClose} />
      <div className="glass-card relative w-full max-w-md mx-4 p-8 space-y-5 animate-scale-in shadow-2xl" style={{ background: 'rgba(255,255,255,0.85)' }}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-background)' }}>AI 设置</h2>
          <button onClick={onClose} className="p-2 rounded-full transition-colors" style={{ color: 'var(--color-outline)' }}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <p className="text-xs font-medium leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
          配置 AI API Key 以启用智能引文解析和格式转换。Key 仅存储在浏览器本地，不会上传到任何第三方服务器
        </p>

        {/* Provider 选择 */}
        <div className="space-y-2">
          <label className="text-xs font-bold tracking-widest ml-1" style={{ color: 'var(--color-on-surface-variant)' }}>AI 服务商</label>
          <div className="flex flex-wrap gap-2">
            {PROVIDERS.map(p => {
              const pInfo = PROVIDER_INFO[p]
              return (
                <button key={p} onClick={() => { setProvider(p); setModel('') }}
                  className="px-3 py-2 rounded-xl text-xs font-bold transition-all"
                  style={{
                    background: provider === p ? 'var(--color-primary-10)' : 'var(--color-surface-high)',
                    color: provider === p ? 'var(--color-primary)' : 'var(--color-outline)',
                    boxShadow: provider === p ? 'inset 0 0 0 1px var(--color-primary-20)' : 'none',
                  }}>
                  {pInfo.label}
                </button>
              )
            })}
          </div>
          {info.description && (
            <p className="text-[11px] font-medium ml-1" style={{ color: 'var(--color-outline)' }}>
              {info.description}
            </p>
          )}
        </div>

        {/* API Key */}
        <div className="space-y-2">
          <label className="text-xs font-bold tracking-widest ml-1" style={{ color: 'var(--color-on-surface-variant)' }}>API Key</label>
          <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)}
            placeholder={info.placeholder} className="input-field" />
          <p className="text-[11px] font-medium ml-1" style={{ color: 'var(--color-outline)' }}>
            请确保输入正确的 API Key，保存时不会验证有效性，使用时若出错会提示具体原因
          </p>
        </div>

        {/* 模型 */}
        <div className="space-y-2">
          <label className="text-xs font-bold tracking-widest ml-1" style={{ color: 'var(--color-on-surface-variant)' }}>模型</label>
          <select value={model || info.models[0]?.value || ''} onChange={(e) => setModel(e.target.value)}
            className="input-field cursor-pointer">
            {info.models.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        {/* 自定义端点 */}
        <div className="space-y-2">
          <label className="text-xs font-bold tracking-widest ml-1" style={{ color: 'var(--color-on-surface-variant)' }}>
            自定义端点 <span className="font-normal">（可选，用于代理或自部署）</span>
          </label>
          <input type="text" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="留空使用官方 API" className="input-field" />
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-3 pt-2">
          <button onClick={handleClear} className="glass-button px-5 py-3 rounded-xl text-sm font-bold" style={{ color: 'var(--color-error)' }}>
            清除
          </button>
          <button onClick={handleSave} disabled={!apiKey.trim()}
            className="glass-button-primary flex-1 py-3 rounded-xl font-bold text-sm"
            style={{ opacity: !apiKey.trim() ? 0.4 : 1 }}>
            保存并关闭
          </button>
        </div>
      </div>
    </div>
  )
}
