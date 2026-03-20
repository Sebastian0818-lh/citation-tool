import { useState } from 'react'

interface CopyButtonProps {
  text: string
  html?: string
  className?: string
  iconOnly?: boolean
  label?: string
}

/**
 * Copy as rich text (HTML) so italics are preserved when pasting into Word/Google Docs.
 * Falls back to plain text if ClipboardItem API is not available.
 */
async function copyRichText(html: string, plainText: string) {
  if (typeof ClipboardItem !== 'undefined') {
    const htmlBlob = new Blob([html], { type: 'text/html' })
    const textBlob = new Blob([plainText], { type: 'text/plain' })
    await navigator.clipboard.write([
      new ClipboardItem({
        'text/html': htmlBlob,
        'text/plain': textBlob,
      }),
    ])
  } else {
    await navigator.clipboard.writeText(plainText)
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}

export default function CopyButton({ text, html, className = '', iconOnly = false, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      const plainText = html ? stripHtml(html) : text
      const richHtml = html || text
      await copyRichText(richHtml, plainText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const textarea = document.createElement('textarea')
      textarea.value = html ? stripHtml(html) : text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-2 text-sm font-bold transition-all ${className}`}
      style={{
        color: copied ? 'var(--color-primary)' : 'var(--color-outline)',
        cursor: 'pointer',
        background: 'none',
        border: 'none',
        padding: iconOnly ? '4px' : undefined,
      }}
      title="复制"
    >
      <span className="material-symbols-outlined text-lg">
        {copied ? 'check_circle' : 'content_copy'}
      </span>
      {!iconOnly && <span>{copied ? '已复制' : (label || '复制')}</span>}
    </button>
  )
}
