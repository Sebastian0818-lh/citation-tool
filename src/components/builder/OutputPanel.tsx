import type { CitationStyle } from '../../core/types'
import { CITATION_STYLES } from '../../core/constants'
import CopyButton from '../shared/CopyButton'

/** Strip HTML tags for plain-text copy */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}

interface OutputPanelProps {
  results: Record<CitationStyle, string>
  loading: boolean
  selectedStyles: CitationStyle[]
  onClear?: () => void
}

export default function OutputPanel({ results, loading, selectedStyles, onClear }: OutputPanelProps) {
  const hasResults = Object.keys(results).length > 0

  return (
    <div>
      {/* Clear button above card */}
      {onClear && (
        <div className="flex justify-end mb-3 relative z-10">
          <button
            onClick={onClear}
            className="action-pill"
            title="一键清除"
          >
            <span className="material-symbols-outlined text-lg action-icon">delete_sweep</span>
            <span className="action-label">一键清除</span>
          </button>
        </div>
      )}

      <div className="relative group">
      {/* Decorative glow */}
      <div
        className="absolute -inset-1 rounded-xl blur opacity-20 group-hover:opacity-35 transition duration-1000 group-hover:duration-200"
        style={{ background: 'linear-gradient(135deg, var(--color-primary-container), rgba(198, 126, 101, 0.3))' }}
      />

      <div className="glass-card relative p-8 rounded-xl shadow-2xl" style={{ border: '1px solid rgba(255,255,255,0.4)' }}>
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <span
            className="text-base font-black tracking-tight"
            style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-background)' }}
          >
            生成结果
          </span>
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(239, 68, 68, 0.3)' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(245, 158, 11, 0.3)' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(16, 185, 129, 0.3)' }} />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full flex items-center justify-center" style={{ background: 'var(--color-primary-10)' }}>
                <span className="material-symbols-outlined animate-pulse" style={{ color: 'var(--color-primary)' }}>pending</span>
              </div>
              <div>
                <p className="font-bold" style={{ color: 'var(--color-on-background)' }}>正在生成引用...</p>
              </div>
            </div>
            <div className="py-6" style={{ borderTop: '1px solid rgba(0,0,0,0.06)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <div className="space-y-3">
                <div className="h-4 rounded-full w-full animate-pulse" style={{ background: 'rgba(0,0,0,0.06)' }} />
                <div className="h-4 rounded-full w-5/6 animate-pulse" style={{ background: 'rgba(0,0,0,0.04)' }} />
                <div className="h-4 rounded-full w-4/6 animate-pulse" style={{ background: 'rgba(0,0,0,0.03)' }} />
              </div>
            </div>
          </div>
        ) : !hasResults ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full flex items-center justify-center" style={{ background: 'var(--color-primary-10)' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)' }}>edit_note</span>
              </div>
              <div>
                <p className="font-bold" style={{ color: 'var(--color-on-background)' }}>等待生成...</p>
              </div>
            </div>
            <div className="py-6" style={{ borderTop: '1px solid rgba(0,0,0,0.06)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <div className="space-y-3">
                <div className="h-4 rounded-full w-full" style={{ background: 'rgba(0,0,0,0.04)' }} />
                <div className="h-4 rounded-full w-5/6" style={{ background: 'rgba(0,0,0,0.03)' }} />
                <div className="h-4 rounded-full w-4/6" style={{ background: 'rgba(0,0,0,0.02)' }} />
              </div>
            </div>
            {/* Disabled action pills */}
            <div className="flex items-center justify-between opacity-40 pointer-events-none">
              <div className="action-pill">
                <span className="material-symbols-outlined text-lg action-icon">content_copy</span>
                <span className="action-label">复制文本</span>
              </div>
              <div className="action-pill">
                <span className="material-symbols-outlined text-lg action-icon">download</span>
                <span className="action-label">RIS / BibTeX</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {selectedStyles.map((styleId) => {
              const style = CITATION_STYLES.find(cs => cs.id === styleId)
              const result = results[styleId]
              if (!result) return null

              return (
                <div key={styleId}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-headline)' }}>
                      {style?.label || styleId}
                    </span>
                    <CopyButton text={stripHtml(result)} html={result} iconOnly />
                  </div>
                  <p className="text-sm leading-relaxed break-all font-medium" style={{ color: 'var(--color-on-background)' }}
                    dangerouslySetInnerHTML={{ __html: result }}
                  />
                  {styleId !== selectedStyles[selectedStyles.length - 1] && (
                    <div className="mt-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }} />
                  )}
                </div>
              )
            })}

            {/* Bottom action pills */}
            <div className="pt-4 flex items-center gap-3" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
              <button
                className="action-pill"
                onClick={async () => {
                  const entries = selectedStyles
                    .filter(s => results[s])
                    .map(s => {
                      const st = CITATION_STYLES.find(cs => cs.id === s)
                      return { label: st?.label || s, html: results[s], text: stripHtml(results[s]) }
                    })
                  const allHtml = entries.map(e => `<p><b>[${e.label}]</b><br/>${e.html}</p>`).join('')
                  const allText = entries.map(e => `[${e.label}]\n${e.text}`).join('\n\n')
                  try {
                    if (typeof ClipboardItem !== 'undefined') {
                      await navigator.clipboard.write([
                        new ClipboardItem({
                          'text/html': new Blob([allHtml], { type: 'text/html' }),
                          'text/plain': new Blob([allText], { type: 'text/plain' }),
                        }),
                      ])
                    } else {
                      await navigator.clipboard.writeText(allText)
                    }
                  } catch { /* fallback */ }
                }}
                title="复制全部"
              >
                <span className="material-symbols-outlined text-lg action-icon">content_copy</span>
                <span className="action-label">复制文本</span>
              </button>
              <button className="action-pill" title="导出 RIS / BibTeX（即将推出）">
                <span className="material-symbols-outlined text-lg action-icon">download</span>
                <span className="action-label">RIS / BibTeX</span>
              </button>
            </div>
          </div>
        )}
      </div>

      </div>

      {/* Pro Tip */}
      <div
        className="mt-6 p-5 rounded-xl flex items-center gap-4"
        style={{
          background: 'var(--color-surface-high)',
          border: '1px solid rgba(255,255,255,0.4)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}
      >
        <div
          className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--color-surface-lowest)', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
        >
          <span className="material-symbols-outlined" style={{ color: 'var(--color-primary-dim)' }}>lightbulb</span>
        </div>
        <div>
          <p className="text-sm font-black mb-2.5" style={{ color: 'var(--color-on-background)' }}>小贴士</p>
          <p className="text-xs leading-relaxed font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>
            1. 选择多种格式可同时生成多个引用版本，方便对比和使用
          </p>
          <p className="text-xs leading-relaxed font-medium mt-1.5" style={{ color: 'var(--color-on-surface-variant)' }}>
            2. 因包含格式较多，如使用过程中有任何问题，请及时通过公众号后台联系作者
          </p>
        </div>
      </div>
    </div>
  )
}
