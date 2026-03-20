import { useState, useEffect } from 'react'
import type { CslItem, CslItemType, CslName, CslDate, FieldSchema } from '../../core/types'
import { TYPE_FIELD_SCHEMAS, createEmptyCslItem } from '../../core/constants'
import AuthorListEditor from './AuthorListEditor'

interface CitationFormProps {
  type: CslItemType
  onItemChange: (item: CslItem) => void
}

export default function CitationForm({ type, onItemChange }: CitationFormProps) {
  const [item, setItem] = useState<CslItem>(() => createEmptyCslItem(type))
  const [showOptional, setShowOptional] = useState(false)

  const fields = TYPE_FIELD_SCHEMAS[type] || []
  const requiredFields = fields.filter(f => f.required)
  const optionalFields = fields.filter(f => !f.required)

  useEffect(() => {
    const newItem = createEmptyCslItem(type)
    setItem(newItem)
    onItemChange(newItem)
  }, [type])

  const updateField = (key: string, value: unknown) => {
    const updated = { ...item, [key]: value }
    setItem(updated)
    onItemChange(updated)
  }

  const updateAuthors = (authors: CslName[]) => {
    updateField('author', authors)
  }

  const updateDate = (key: string, dateStr: string) => {
    if (!dateStr) {
      const updated = { ...item }
      delete (updated as Record<string, unknown>)[key]
      setItem(updated)
      onItemChange(updated)
      return
    }
    const parts = dateStr.split('-').map(Number).filter(n => !isNaN(n))
    const dateObj: CslDate = { 'date-parts': [parts as [number, number?, number?]] }
    updateField(key, dateObj)
  }

  const renderField = (field: FieldSchema) => {
    const { key, label, type: fieldType, placeholder, options } = field

    const Label = (
      <label className="text-xs font-bold tracking-widest ml-1" style={{ color: 'var(--color-on-surface-variant)' }}>
        {label}
        {field.required && <span className="ml-1" style={{ color: 'var(--color-primary)' }}>*</span>}
      </label>
    )

    if (fieldType === 'author-list') {
      return (
        <div key={key} className="space-y-2">
          {Label}
          <AuthorListEditor
            authors={(item.author || []) as CslName[]}
            onChange={updateAuthors}
            placeholder={placeholder}
          />
        </div>
      )
    }

    if (fieldType === 'date') {
      const dateValue = (item as Record<string, unknown>)[key] as CslDate | undefined
      const dateStr = dateValue?.['date-parts']?.[0]
        ? dateValue['date-parts'][0].filter(v => v !== undefined).join('-')
        : ''
      return (
        <div key={key} className="space-y-2">
          {Label}
          <input
            type="text"
            value={dateStr}
            onChange={(e) => updateDate(key, e.target.value)}
            placeholder={placeholder || '例：2026 或 2026-03'}
            className="input-field"
          />
        </div>
      )
    }

    if (fieldType === 'select' && options) {
      const currentValue = ((item as Record<string, unknown>)[key] as string) || ''
      return (
        <div key={key} className="space-y-2">
          {Label}
          <select
            value={currentValue}
            onChange={(e) => updateField(key, e.target.value)}
            className="input-field cursor-pointer"
          >
            <option value="">请选择...</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      )
    }

    const currentValue = ((item as Record<string, unknown>)[key] as string) || ''

    if (fieldType === 'textarea') {
      return (
        <div key={key} className="space-y-2">
          {Label}
          <textarea
            value={currentValue}
            onChange={(e) => updateField(key, e.target.value)}
            placeholder={placeholder}
            rows={2}
            className="input-field resize-y min-h-[56px]"
          />
        </div>
      )
    }

    return (
      <div key={key} className="space-y-2">
        {Label}
        <input
          type="text"
          value={currentValue}
          onChange={(e) => updateField(key, e.target.value)}
          placeholder={placeholder}
          className="input-field"
        />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {requiredFields.map(renderField)}

      {optionalFields.length > 0 && (
        <button
          onClick={() => setShowOptional(!showOptional)}
          className="flex items-center gap-2 text-sm font-bold group transition-colors"
          style={{ color: 'var(--color-on-surface-variant)' }}
        >
          <span className="material-symbols-outlined group-hover:rotate-90 transition-transform duration-300">
            add_circle
          </span>
          <span>{showOptional ? '收起选填项' : `添加更多字段 (${optionalFields.length})`}</span>
        </button>
      )}

      {showOptional && (
        <div className="grid grid-cols-1 gap-6 animate-fade-in">
          {optionalFields.map(renderField)}
        </div>
      )}
    </div>
  )
}
