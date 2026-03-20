import { REFERENCE_TYPES } from '../../core/constants'
import type { CslItemType } from '../../core/types'

interface TypeSelectorProps {
  selected: CslItemType
  onSelect: (type: CslItemType) => void
}

const TYPE_ICONS: Record<string, string> = {
  J: 'article',
  M: 'book',
  C: 'groups',
  D: 'school',
  R: 'description',
  N: 'newspaper',
  S: 'rule',
  P: 'verified',
  'EB/OL': 'language',
}

export default function TypeSelector({ selected, onSelect }: TypeSelectorProps) {
  return (
    <>
      <div className="mb-5 text-center">
        <h2 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-background)' }}>
          文献类型
        </h2>
      </div>
      <nav className="flex-1 flex flex-col gap-1.5">
        {REFERENCE_TYPES.map(({ code, cslType, label }) => (
          <button
            key={code}
            onClick={() => onSelect(cslType)}
            className="glass-button w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-left"
            style={{
              background: selected === cslType ? 'rgba(255,255,255,0.4)' : undefined,
              color: selected === cslType ? 'var(--color-on-background)' : 'var(--color-outline)',
              fontWeight: selected === cslType ? 700 : 500,
            }}
          >
            <span
              className="material-symbols-outlined text-lg"
              style={{ color: selected === cslType ? 'var(--color-primary-dim)' : 'var(--color-outline)' }}
            >
              {TYPE_ICONS[code] || 'description'}
            </span>
            <span>{label} [{code}]</span>
          </button>
        ))}
      </nav>
    </>
  )
}
