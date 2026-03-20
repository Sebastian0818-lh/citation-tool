import { useState } from 'react'
import type { CslName } from '../../core/types'
import { parseAuthorName, formatCslName } from '../../core/nameUtils'

interface AuthorListEditorProps {
  authors: CslName[]
  onChange: (authors: CslName[]) => void
  placeholder?: string
}

export default function AuthorListEditor({ authors, onChange, placeholder }: AuthorListEditorProps) {
  const [inputValue, setInputValue] = useState('')

  const addAuthor = () => {
    const trimmed = inputValue.trim()
    if (!trimmed) return
    const name = parseAuthorName(trimmed)
    onChange([...authors, name])
    setInputValue('')
  }

  const removeAuthor = (index: number) => {
    onChange(authors.filter((_, i) => i !== index))
  }

  const moveAuthor = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= authors.length) return
    const newAuthors = [...authors]
      ;[newAuthors[index], newAuthors[newIndex]] = [newAuthors[newIndex], newAuthors[index]]
    onChange(newAuthors)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addAuthor()
    }
  }

  return (
    <div className="space-y-3">
      {authors.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {authors.map((author, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm group transition-colors"
              style={{ background: 'var(--color-surface-lowest)' }}
            >
              <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => moveAuthor(index, -1)}
                  disabled={index === 0}
                  className="p-0.5 disabled:opacity-20 transition-colors rounded"
                  style={{ color: 'var(--color-outline)' }}
                >
                  <span className="material-symbols-outlined text-sm">expand_less</span>
                </button>
                <button
                  onClick={() => moveAuthor(index, 1)}
                  disabled={index === authors.length - 1}
                  className="p-0.5 disabled:opacity-20 transition-colors rounded"
                  style={{ color: 'var(--color-outline)' }}
                >
                  <span className="material-symbols-outlined text-sm">expand_more</span>
                </button>
              </div>

              <span className="text-xs w-4 text-right" style={{ color: 'var(--color-outline)' }}>{index + 1}.</span>
              <span className="flex-1 font-medium" style={{ color: 'var(--color-on-surface)' }}>
                {formatCslName(author)}
              </span>

              <button
                onClick={() => removeAuthor(index)}
                className="p-1 opacity-0 group-hover:opacity-100 rounded-full transition-all"
                style={{ color: 'var(--color-outline)' }}
                title="删除"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || '输入作者姓名，按回车添加'}
          className="input-field flex-1"
        />
        <button
          onClick={addAuthor}
          disabled={!inputValue.trim()}
          className="glass-button-primary px-5 py-3 rounded-xl text-sm font-bold"
          style={{ opacity: inputValue.trim() ? 1 : 0.4 }}
        >
          添加
        </button>
      </div>
    </div>
  )
}
