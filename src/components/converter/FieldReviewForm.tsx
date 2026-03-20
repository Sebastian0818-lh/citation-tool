import { useState, useEffect } from 'react'
import type { CslItem, CslDate, CslItemType } from '../../core/types'
import { REFERENCE_TYPES, TYPE_FIELD_SCHEMAS } from '../../core/constants'
import AuthorListEditor from '../builder/AuthorListEditor'

interface FieldReviewFormProps {
  item: CslItem
  fieldConfidence: Record<string, number>
  onChange: (item: CslItem) => void
}

function confidenceColor(score: number | undefined): string {
  if (score === undefined) return 'transparent'
  if (score >= 0.8) return 'var(--color-success)'
  if (score >= 0.5) return 'var(--color-warning)'
  return 'var(--color-error)'
}

function confidenceLabel(score: number | undefined): string {
  if (score === undefined) return ''
  if (score >= 0.8) return '高'
  if (score >= 0.5) return '中'
  return '低'
}

export default function FieldReviewForm({ item, fieldConfidence, onChange }: FieldReviewFormProps) {
  const [editItem, setEditItem] = useState<CslItem>({ ...item })

  useEffect(() => { setEditItem({ ...item }) }, [item])

  const update = (key: string, value: unknown) => {
    const updated = { ...editItem, [key]: value }
    setEditItem(updated)
    onChange(updated)
  }

  const updateType = (type: CslItemType) => {
    const updated = { ...editItem, type }
    setEditItem(updated)
    onChange(updated)
  }

  const updateDate = (key: string, dateStr: string) => {
    if (!dateStr) {
      const updated = { ...editItem }
      delete (updated as Record<string, unknown>)[key]
      setEditItem(updated)
      onChange(updated)
      return
    }
    const parts = dateStr.split('-').map(Number).filter(n => !isNaN(n))
    update(key, { 'date-parts': [parts as [number, number?, number?]] })
  }

  const dateToStr = (date: CslDate | undefined): string => {
    if (!date?.['date-parts']?.[0]) return ''
    return date['date-parts'][0].filter(v => v !== undefined).join('-')
  }

  const fields = TYPE_FIELD_SCHEMAS[editItem.type] || []

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest ml-1" style={{ color: 'var(--color-on-surface-variant)' }}>文献类型</label>
        <select value={editItem.type} onChange={(e) => updateType(e.target.value as CslItemType)} className="input-field cursor-pointer">
          {REFERENCE_TYPES.map(({ cslType, label, code }) => (
            <option key={cslType} value={cslType}>{label} [{code}]</option>
          ))}
        </select>
      </div>

      <FieldRow label="标题" confidence={fieldConfidence['title']}>
        <input type="text" value={editItem.title || ''} onChange={(e) => update('title', e.target.value)} className="input-field" />
      </FieldRow>

      <FieldRow label="作者" confidence={fieldConfidence['author']}>
        <AuthorListEditor authors={editItem.author || []} onChange={(authors) => update('author', authors)} />
      </FieldRow>

      {fields.filter(f => !['author', 'title'].includes(f.key)).map(field => {
        if (field.type === 'date') {
          const dateVal = (editItem as Record<string, unknown>)[field.key] as CslDate | undefined
          return (
            <FieldRow key={field.key} label={field.label} confidence={fieldConfidence[field.key]}>
              <input type="text" value={dateToStr(dateVal)} onChange={(e) => updateDate(field.key, e.target.value)} placeholder="例：2024" className="input-field" />
            </FieldRow>
          )
        }
        if (field.type === 'select' && field.options) {
          const val = ((editItem as Record<string, unknown>)[field.key] as string) || ''
          return (
            <FieldRow key={field.key} label={field.label} confidence={fieldConfidence[field.key]}>
              <select value={val} onChange={(e) => update(field.key, e.target.value)} className="input-field cursor-pointer">
                <option value="">请选择</option>
                {field.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </FieldRow>
          )
        }
        const val = ((editItem as Record<string, unknown>)[field.key] as string) || ''
        return (
          <FieldRow key={field.key} label={field.label} confidence={fieldConfidence[field.key]}>
            <input type="text" value={val} onChange={(e) => update(field.key, e.target.value)} placeholder={field.placeholder} className="input-field" />
          </FieldRow>
        )
      })}
    </div>
  )
}

function FieldRow({ label, confidence, children }: { label: string; confidence: number | undefined; children: React.ReactNode }) {
  return (
    <div className="space-y-2 pl-3" style={{ borderLeft: `3px solid ${confidenceColor(confidence)}` }}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-on-surface-variant)' }}>{label}</label>
        {confidence !== undefined && (
          <span className="text-xs px-2 py-0.5 rounded-full font-bold"
            style={{ background: confidence >= 0.8 ? 'rgba(92,184,92,0.1)' : confidence >= 0.5 ? 'rgba(232,168,56,0.1)' : 'rgba(159,64,61,0.1)', color: confidenceColor(confidence) }}>
            {confidenceLabel(confidence)}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}
