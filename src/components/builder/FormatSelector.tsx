import { CITATION_STYLES } from '../../core/constants'
import type { CitationStyle } from '../../core/types'

interface FormatSelectorProps {
  selected: CitationStyle[]
  onChange: (styles: CitationStyle[]) => void
}

export default function FormatSelector({ selected, onChange }: FormatSelectorProps) {
  const toggle = (style: CitationStyle) => {
    if (selected.includes(style)) {
      onChange(selected.filter(s => s !== style))
    } else {
      onChange([...selected, style])
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      {CITATION_STYLES.map(({ id, label, description }) => {
        const isActive = selected.includes(id)
        return (
          <button
            key={id}
            onClick={() => toggle(id)}
            title={description}
            className="px-4 py-3 rounded-xl flex items-center gap-2 transition-all cursor-pointer text-sm"
            style={{
              background: isActive ? 'var(--color-primary-10)' : 'var(--color-surface-high)',
              color: isActive ? 'var(--color-primary)' : 'var(--color-on-surface-variant)',
              boxShadow: isActive ? 'inset 0 0 0 1px var(--color-primary-20)' : 'none',
              opacity: isActive ? 1 : 0.6,
              filter: isActive ? 'none' : 'grayscale(1)',
            }}
          >
            <span className="font-black text-base" style={{ fontFamily: 'var(--font-headline)' }}>{label}</span>
          </button>
        )
      })}
    </div>
  )
}
