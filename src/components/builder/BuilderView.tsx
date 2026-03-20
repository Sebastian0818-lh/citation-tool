import { useState, useCallback } from 'react'
import type { CslItem, CslItemType, CitationStyle } from '../../core/types'
import { formatAllStyles } from '../../core/formatter'
import TypeSelector from './TypeSelector'
import CitationForm from './CitationForm'
import FormatSelector from './FormatSelector'
import OutputPanel from './OutputPanel'

const DEFAULT_STYLES: CitationStyle[] = [
  'gb-t-7714-2015-numeric',
  'apa',
  'ieee',
]

export default function BuilderView() {
  const [selectedType, setSelectedType] = useState<CslItemType>('article-journal')
  const [currentItem, setCurrentItem] = useState<CslItem | null>(null)
  const [selectedStyles, setSelectedStyles] = useState<CitationStyle[]>(DEFAULT_STYLES)
  const [results, setResults] = useState<Record<CitationStyle, string>>({} as Record<CitationStyle, string>)
  const [loading, setLoading] = useState(false)
  const [formKey, setFormKey] = useState(0)

  const handleItemChange = useCallback((item: CslItem) => {
    setCurrentItem(item)
  }, [])

  const handleClear = () => {
    setCurrentItem(null)
    setResults({} as Record<CitationStyle, string>)
    setFormKey(k => k + 1)
  }

  const handleGenerate = async () => {
    if (!currentItem || !currentItem.title) return
    setLoading(true)
    try {
      const formatted = await formatAllStyles(currentItem, selectedStyles)
      setResults(formatted)
    } catch (err) {
      console.error('生成失败:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* ── Sidebar: Type Selector ── */}
      <div className="hidden md:block w-64 flex-shrink-0" style={{ borderRight: '1px solid rgba(0,0,0,0.04)', background: 'rgba(250, 249, 246, 0.6)' }}>
        <div className="sticky top-24 p-6">
          <TypeSelector selected={selectedType} onSelect={setSelectedType} />
        </div>
      </div>

      {/* ── Main Content ── */}
      <main className="flex-1 p-8 md:p-12 max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-2" style={{ color: 'var(--color-primary)' }}>
            <span className="material-symbols-outlined text-base">auto_awesome</span>
            <span className="text-sm font-bold tracking-tight">参考文献生成器</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-headline)' }}>
            <span className="text-3xl md:text-5xl font-black tracking-tight" style={{ color: 'var(--color-on-background)' }}>
              参考文献生成
            </span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed font-medium max-w-xl" style={{ color: 'var(--color-on-surface-variant)' }}>
            填写文献信息以生成精准的参考文献条目
          </p>
        </header>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Form */}
          <div className="lg:col-span-7 space-y-8">
            <section className="p-8 rounded-xl" style={{ background: 'var(--color-surface-low)' }}>
              <CitationForm key={formKey} type={selectedType} onItemChange={handleItemChange} />

              {/* Format Selector */}
              <div className="mt-10 pt-8" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                <label className="text-xs font-bold tracking-widest ml-1 block mb-4" style={{ color: 'var(--color-on-surface-variant)' }}>
                  参考文献生成格式
                </label>
                <FormatSelector selected={selectedStyles} onChange={setSelectedStyles} />
              </div>
            </section>

            {/* Generate Button */}
            <div className="mt-8">
              <button
                onClick={handleGenerate}
                disabled={loading || !currentItem?.title || selectedStyles.length === 0}
                className="generate-btn"
              >
                <svg className="gen-icon" width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L14.09 8.26L20 9.27L15.55 13.97L16.91 20L12 16.9L7.09 20L8.45 13.97L4 9.27L9.91 8.26L12 2Z" />
                </svg>
                <span className="gen-text">{loading ? '生成中...' : '生成引用'}</span>
              </button>
            </div>
          </div>

          {/* Right: Preview */}
          <div className="lg:col-span-5 sticky top-24">
            <OutputPanel
              results={results}
              loading={loading}
              selectedStyles={selectedStyles}
              onClear={handleClear}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
