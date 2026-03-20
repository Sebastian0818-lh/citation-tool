import { useState } from 'react'
import type { CitationStyle } from '../../core/types'
import { loadAiConfig, isAiConfigured, batchConvertWithAi, type AiConfig } from '../../core/ai'
import { CITATION_STYLES } from '../../core/constants'
import CopyButton from '../shared/CopyButton'

type Step = 'input' | 'output'

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}

export default function ConverterView() {
  const [step, setStep] = useState<Step>('input')
  const [inputText, setInputText] = useState('')
  const [targetStyle, setTargetStyle] = useState<CitationStyle>('apa')
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const splitEntries = (text: string): string[] => {
    return text
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => s.replace(/^\[\d+\]\s*/, '').replace(/^\d{1,3}\.\s+/, '').trim())
      .filter(Boolean)
  }

  const aiConfig = loadAiConfig()
  const aiAvailable = isAiConfigured(aiConfig)
  const entries = inputText.trim() ? splitEntries(inputText) : []

  const handleConvert = async () => {
    if (!aiAvailable || entries.length === 0) return
    setLoading(true)
    setError('')

    try {
      const styleInfo = CITATION_STYLES.find(s => s.id === targetStyle)
      const formatted = await batchConvertWithAi(entries, styleInfo?.label || targetStyle, aiConfig as AiConfig)
      setResults(formatted)
      setStep('output')
    } catch (err) {
      const msg = err instanceof Error ? err.message : '未知错误'
      if (msg.includes('401') || msg.includes('Unauthorized') || msg.includes('invalid')) {
        setError(`转换失败：API Key 无效或已过期，请在"AI 设置"中检查并重新配置`)
      } else if (msg.includes('403') || msg.includes('Forbidden')) {
        setError(`转换失败：API 访问被拒绝，请检查 API Key 权限或账户余额`)
      } else if (msg.includes('429') || msg.includes('rate')) {
        setError(`转换失败：请求频率过高，请稍后重试`)
      } else if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('CORS')) {
        setError(`转换失败：网络连接失败。可能原因：1) 网络不通；2) 该 AI 服务商不支持浏览器直接调用（CORS 限制），请尝试配置自定义代理端点`)
      } else {
        setError(`转换失败: ${msg}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleReformat = async (newStyle: CitationStyle) => {
    setTargetStyle(newStyle)
    if (!aiAvailable || entries.length === 0) return
    setLoading(true)
    setError('')

    try {
      const styleInfo = CITATION_STYLES.find(s => s.id === newStyle)
      const formatted = await batchConvertWithAi(entries, styleInfo?.label || newStyle, aiConfig as AiConfig)
      setResults(formatted)
    } catch (err) {
      const msg = err instanceof Error ? err.message : '未知错误'
      if (msg.includes('401') || msg.includes('Unauthorized')) {
        setError(`转换失败：API Key 无效或已过期，请检查"AI 设置"`)
      } else if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
        setError(`转换失败：网络连接失败，请检查网络或尝试配置代理端点`)
      } else {
        setError(`转换失败: ${msg}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setStep('input')
    setInputText('')
    setResults([])
    setError('')
  }

  const allResultsHtml = results.map((r, i) => `[${i + 1}] ${r}`).join('<br/>')
  const allResultsText = results.map((r, i) => `[${i + 1}] ${stripHtml(r)}`).join('\n')

  return (
    <div className="min-h-[calc(100vh-64px)]">
      <div className="max-w-5xl mx-auto p-8 md:p-12 space-y-6">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-2" style={{ color: 'var(--color-primary)' }}>
            <span className="material-symbols-outlined text-base">swap_horiz</span>
            <span className="text-sm font-bold tracking-tight">AI 批量格式转换</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-headline)' }}>
            <span className="text-3xl md:text-5xl font-black tracking-tight" style={{ color: 'var(--color-on-background)' }}>
              参考文献格式转换
            </span>
          </h1>
          <p className="mt-4 text-base leading-relaxed font-medium max-w-2xl" style={{ color: 'var(--color-on-surface-variant)' }}>
            粘贴整篇论文的参考文献列表，使用 AI 一键批量转换为目标格式
          </p>
        </header>

        {error && (
          <div className="p-4 text-sm rounded-xl animate-scale-in" style={{ background: 'rgba(159, 64, 61, 0.06)', color: 'var(--color-error)' }}>
            {error}
          </div>
        )}

        {/* AI not configured warning */}
        {!aiAvailable && (
          <div className="p-6 rounded-xl flex items-center gap-4" style={{ background: 'var(--color-primary-10)', border: '1px solid var(--color-primary-20)' }}>
            <span className="material-symbols-outlined text-2xl" style={{ color: 'var(--color-primary)' }}>key</span>
            <div>
              <p className="text-sm font-bold" style={{ color: 'var(--color-on-background)' }}>需要配置 AI API Key</p>
              <p className="text-xs mt-1 font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>
                格式转换功能依赖 AI 进行精准解析与转换。请点击右上角"AI 设置"按钮，配置任一 AI 服务商的 API Key（支持 DeepSeek、智谱GLM、Moonshot/Kimi、OpenAI、Anthropic）
              </p>
            </div>
          </div>
        )}

        {/* Step 1: Input */}
        {step === 'input' && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-8 rounded-xl space-y-5" style={{ background: 'var(--color-surface-low)' }}>
              <div>
                <h2 className="text-lg font-bold" style={{ color: 'var(--color-on-background)', fontFamily: 'var(--font-headline)' }}>
                  粘贴参考文献列表
                </h2>
                <p className="text-sm mt-1 font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>
                  每行一条参考文献，支持任意格式，AI 会自动识别并转换
                </p>
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={'粘贴参考文献列表，每行一条...\n\n例：\n[1] 汪应洛. 系统工程[M]. 第3版. 北京: 机械工业出版社, 2003: 471-472.\n[2] 袁训来, 陈哲, 肖书海, 等. 蓝田生物群[J]. 科学通报, 2012, 55(34): 3219.\n[3] King, M. (2000). Wrestling with the angel. Viking.'}
                rows={10}
                className="input-field resize-y"
                style={{ minHeight: '200px', fontFamily: 'var(--font-body)', lineHeight: '1.8' }}
              />

              {entries.length > 0 && (
                <p className="text-xs font-medium" style={{ color: 'var(--color-outline)' }}>
                  检测到 {entries.length} 条参考文献
                </p>
              )}
            </div>

            {/* Target format */}
            <div className="p-8 rounded-xl space-y-4" style={{ background: 'var(--color-surface-low)' }}>
              <label className="text-xs font-bold tracking-widest ml-1 block" style={{ color: 'var(--color-on-surface-variant)' }}>
                目标转换格式
              </label>
              <div className="flex flex-wrap gap-3">
                {CITATION_STYLES.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setTargetStyle(id)}
                    className="px-4 py-3 rounded-xl flex items-center gap-2 transition-all cursor-pointer text-sm"
                    style={{
                      background: targetStyle === id ? 'var(--color-primary-10)' : 'var(--color-surface-high)',
                      color: targetStyle === id ? 'var(--color-primary)' : 'var(--color-on-surface-variant)',
                      boxShadow: targetStyle === id ? 'inset 0 0 0 1px var(--color-primary-20)' : 'none',
                      opacity: targetStyle === id ? 1 : 0.6,
                      filter: targetStyle === id ? 'none' : 'grayscale(1)',
                    }}
                  >
                    <span className="font-black text-base" style={{ fontFamily: 'var(--font-headline)' }}>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Convert button */}
            <button
              onClick={handleConvert}
              disabled={!aiAvailable || entries.length === 0 || loading}
              className="generate-btn"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                  <span className="gen-text">AI 转换中... ({entries.length} 条)</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg gen-icon" style={{ fill: 'currentColor' }}>auto_awesome</span>
                  <span className="gen-text">AI 批量转换</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Step 2: Output */}
        {step === 'output' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold" style={{ color: 'var(--color-on-background)', fontFamily: 'var(--font-headline)' }}>
                  转换结果
                </h2>
                <p className="text-sm mt-1 font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>
                  共 {results.length} 条，已转换为 {CITATION_STYLES.find(s => s.id === targetStyle)?.label} 格式
                </p>
              </div>
              <button onClick={handleReset} className="glass-button px-5 py-2.5 rounded-xl text-sm font-bold" style={{ color: 'var(--color-on-surface-variant)' }}>
                重新转换
              </button>
            </div>

            {/* Switch format */}
            <div className="p-5 rounded-xl" style={{ background: 'var(--color-surface-low)' }}>
              <label className="text-xs font-bold tracking-widest ml-1 block mb-3" style={{ color: 'var(--color-on-surface-variant)' }}>
                切换目标格式（AI 重新转换）
              </label>
              <div className="flex flex-wrap gap-3">
                {CITATION_STYLES.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => handleReformat(id)}
                    disabled={loading}
                    className="px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer text-sm"
                    style={{
                      background: targetStyle === id ? 'var(--color-primary-10)' : 'var(--color-surface-high)',
                      color: targetStyle === id ? 'var(--color-primary)' : 'var(--color-on-surface-variant)',
                      boxShadow: targetStyle === id ? 'inset 0 0 0 1px var(--color-primary-20)' : 'none',
                      opacity: targetStyle === id ? 1 : (loading ? 0.3 : 0.6),
                      filter: targetStyle === id ? 'none' : 'grayscale(1)',
                    }}
                  >
                    <span className="font-black text-sm" style={{ fontFamily: 'var(--font-headline)' }}>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Results */}
            <div className="relative group">
              <div className="absolute -inset-1 rounded-xl blur opacity-20 group-hover:opacity-35 transition duration-1000 group-hover:duration-200"
                style={{ background: 'linear-gradient(135deg, var(--color-primary-container), rgba(198, 126, 101, 0.3))' }} />
              <div className="glass-card relative p-8 rounded-xl shadow-2xl" style={{ border: '1px solid rgba(255,255,255,0.4)' }}>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-base font-black tracking-tight" style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-background)' }}>
                    {CITATION_STYLES.find(s => s.id === targetStyle)?.label} 格式
                  </span>
                  <CopyButton text={allResultsText} html={allResultsHtml} label="全部复制" />
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-12 gap-3">
                    <span className="material-symbols-outlined animate-spin text-xl" style={{ color: 'var(--color-primary)' }}>progress_activity</span>
                    <span className="text-sm font-medium" style={{ color: 'var(--color-outline)' }}>AI 转换中...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {results.map((result, i) => (
                      <div key={i} className="flex gap-3 group/item">
                        <span className="text-xs font-black shrink-0 w-8 h-6 flex items-center justify-center rounded"
                          style={{ background: 'var(--color-primary-10)', color: 'var(--color-primary)', fontFamily: 'var(--font-headline)' }}>
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm leading-relaxed break-all font-medium" style={{ color: 'var(--color-on-background)' }}
                            dangerouslySetInnerHTML={{ __html: result }} />
                        </div>
                        <div className="opacity-0 group-hover/item:opacity-100 transition-opacity shrink-0">
                          <CopyButton text={stripHtml(result)} html={result} iconOnly />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
