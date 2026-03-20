import { useState, useCallback } from 'react'
import BuilderView from './components/builder/BuilderView'
import ConverterView from './components/converter/ConverterView'
import FormatDocsView from './components/docs/FormatDocsView'
import ApiKeySettings from './components/settings/ApiKeySettings'
import { loadAiConfig, isAiConfigured } from './core/ai'
import './App.css'

type Page = 'tool' | 'docs'
type Tab = 'builder' | 'converter'

function App() {
  const [page, setPage] = useState<Page>('tool')
  const [activeTab, setActiveTab] = useState<Tab>('builder')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [, setRefresh] = useState(0)

  // Check AI config status (re-evaluated when settings close)
  const aiConfigured = isAiConfigured(loadAiConfig())

  const handleSettingsClose = useCallback(() => {
    setSettingsOpen(false)
    setRefresh(r => r + 1) // Force re-render to update toggle status
  }, [])

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-page)' }}>
      {/* ── Top Nav ── */}
      <nav
        className="fixed top-0 w-full z-50 h-16 flex justify-between items-center px-8"
        style={{
          background: 'rgba(250, 249, 246, 0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,0,0,0.04)',
        }}
      >
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-background)' }}>
            BibliographIX <span className="font-normal opacity-50">丨</span> <span className="text-sm font-medium opacity-60">参考文献生成助手</span>
          </span>
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => { setPage('tool'); setActiveTab('builder'); }}
              className={page === 'tool' && activeTab === 'builder' ? 'nav-pill' : 'nav-pill nav-pill-inactive'}
            >
              生成
            </button>
            <button
              onClick={() => { setPage('tool'); setActiveTab('converter'); }}
              className={page === 'tool' && activeTab === 'converter' ? 'nav-pill' : 'nav-pill nav-pill-inactive'}
            >
              转换
            </button>
            <button
              onClick={() => setPage('docs')}
              className={page === 'docs' ? 'nav-pill' : 'nav-pill nav-pill-inactive'}
            >
              格式说明
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="api-toggle" title={aiConfigured ? 'AI 已配置' : 'AI 未配置'} onClick={() => setSettingsOpen(true)}>
            <div className={`api-toggle-track ${aiConfigured ? 'active' : ''}`} />
          </div>
          <button
            onClick={() => setSettingsOpen(true)}
            className="nav-pill nav-pill-inactive flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>settings</span>
            AI 设置
          </button>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <main className="pt-16 min-h-screen">
        <div className="animate-fade-in" key={page === 'docs' ? 'docs' : activeTab}>
          {page === 'docs' ? (
            <FormatDocsView />
          ) : activeTab === 'builder' ? (
            <BuilderView />
          ) : (
            <ConverterView />
          )}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer
        className="w-full py-10"
        style={{
          background: 'rgba(250, 249, 246, 0.5)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(0,0,0,0.04)',
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-8 gap-6">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-outline)', fontFamily: "'Times New Roman', 'Noto Serif SC', Georgia, serif" }}>
            © 2026 BibliographIX by Seb Lee
          </p>
        </div>
      </footer>

      {/* Wechat Float */}
      <div className="wechat-float">
        <div className="qr-popup">
          <img src="/images/wechat-qrcode.jpg" alt="微信公众号" />
          <p className="qr-tip">扫码关注公众号</p>
        </div>
        <div className="logo-btn">
          <div className="logo-bg" />
          <div className="logo-inner">
            <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05a6.42 6.42 0 0 1-.248-1.753c0-3.694 3.383-6.713 7.584-6.713.258 0 .507.022.76.042C16.738 4.964 13.106 2.188 8.691 2.188zM5.785 7.033a.96.96 0 1 1 0-1.92.96.96 0 0 1 0 1.92zm5.812 0a.96.96 0 1 1 0-1.92.96.96 0 0 1 0 1.92zM24 14.37c0-3.248-3.143-5.893-7.063-5.893-3.945 0-7.063 2.645-7.063 5.893 0 3.25 3.118 5.893 7.063 5.893.73 0 1.44-.103 2.126-.29a.665.665 0 0 1 .553.074l1.46.854a.252.252 0 0 0 .126.042.226.226 0 0 0 .224-.226c0-.055-.022-.11-.037-.163l-.3-1.137a.456.456 0 0 1 .164-.512C23.02 17.986 24 16.305 24 14.37zm-9.064-1.28a.72.72 0 1 1 0-1.44.72.72 0 0 1 0 1.44zm4.001 0a.72.72 0 1 1 0-1.44.72.72 0 0 1 0 1.44z"/>
            </svg>
          </div>
        </div>
      </div>

      <ApiKeySettings isOpen={settingsOpen} onClose={handleSettingsClose} />
    </div>
  )
}

export default App
