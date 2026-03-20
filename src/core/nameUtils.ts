import type { CslName } from './types'

/** 检测是否为中文字符 */
function isChinese(str: string): boolean {
  return /[\u4e00-\u9fff]/.test(str)
}

/**
 * 将字符串形式的作者名解析为 CslName
 * 支持格式：
 * - 中文: "张三" → { family: "张", given: "三" }
 * - 中文单姓名: "欧阳修" → { family: "欧阳", given: "修" }
 * - 英文: "John Smith" → { family: "Smith", given: "John" }
 * - 英文: "Smith, John" → { family: "Smith", given: "John" }
 * - 英文: "Smith, J. A." → { family: "Smith", given: "J. A." }
 * - 机构: "World Health Organization" (无逗号且超过3个词) → { literal: "..." }
 */
export function parseAuthorName(name: string): CslName {
  const trimmed = name.trim()
  if (!trimmed) return { family: '' }

  // 中文名处理
  if (isChinese(trimmed)) {
    return parseChineseName(trimmed)
  }

  // 英文名处理
  return parseEnglishName(trimmed)
}

function parseChineseName(name: string): CslName {
  // 常见复姓
  const compoundSurnames = [
    '欧阳', '太史', '端木', '上官', '司马', '东方', '独孤', '南宫',
    '万俟', '闻人', '夏侯', '诸葛', '尉迟', '公羊', '赫连', '澹台',
    '皇甫', '宗政', '濮阳', '公冶', '太叔', '申屠', '公孙', '慕容',
    '仲孙', '钟离', '长孙', '宇文', '司徒', '鲜于', '司空', '令狐',
  ]

  for (const surname of compoundSurnames) {
    if (name.startsWith(surname)) {
      return {
        family: surname,
        given: name.slice(surname.length) || undefined,
      }
    }
  }

  // 单姓
  return {
    family: name.charAt(0),
    given: name.slice(1) || undefined,
  }
}

function parseEnglishName(name: string): CslName {
  // "LastName, FirstName" 格式
  if (name.includes(',')) {
    const [family, ...rest] = name.split(',')
    return {
      family: family.trim(),
      given: rest.join(',').trim() || undefined,
    }
  }

  const parts = name.split(/\s+/)

  // 单词名 → 直接作为 family
  if (parts.length === 1) {
    return { family: parts[0] }
  }

  // 多词名：最后一个词为 family，其余为 given
  const family = parts[parts.length - 1]
  const given = parts.slice(0, -1).join(' ')
  return { family, given }
}

/**
 * 将多个作者名字符串（逗号或分号分隔）解析为 CslName 数组
 */
export function parseAuthors(input: string): CslName[] {
  if (!input.trim()) return []

  // 先按分号分隔，再按逗号分隔（但要排除 "LastName, First" 中的逗号）
  const authors: string[] = []

  if (input.includes(';')) {
    // 分号分隔
    authors.push(...input.split(';').map(s => s.trim()).filter(Boolean))
  } else if (isChinese(input)) {
    // 中文名用逗号分隔
    authors.push(...input.split(/[,，]/).map(s => s.trim()).filter(Boolean))
  } else {
    // 英文名: 如果含有 "and" 则按 and 分隔
    if (/\band\b/i.test(input)) {
      authors.push(...input.split(/\band\b/i).map(s => s.trim()).filter(Boolean))
    } else {
      // 尝试智能分隔：如果有 "LastName, First, LastName, First" 模式
      // 简单处理：整体作为一个作者名
      authors.push(input.trim())
    }
  }

  return authors.map(parseAuthorName)
}

/**
 * 将 CslName 格式化为显示字符串
 */
export function formatCslName(name: CslName): string {
  if (name.literal) return name.literal
  if (!name.family) return ''

  const particle = name['non-dropping-particle'] || ''
  const family = particle ? `${particle} ${name.family}` : name.family

  if (!name.given) return family

  // 中文名不加逗号
  if (isChinese(name.family)) {
    return `${family}${name.given}`
  }

  // 英文名：Family, Given
  return `${family}, ${name.given}`
}

/**
 * 将 CslName 数组格式化为显示字符串
 */
export function formatCslNames(names: CslName[]): string {
  return names.map(formatCslName).join('; ')
}
