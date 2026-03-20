import { STYLE_FILE_MAP } from '../constants'
import type { CitationStyle } from '../types'

const styleCache = new Map<string, string>()
const localeCache = new Map<string, string>()

/**
 * 按需加载 CSL 样式 XML
 */
export async function loadCslStyle(style: CitationStyle): Promise<string> {
  const fileName = STYLE_FILE_MAP[style]
  if (!fileName) throw new Error(`未知的引用格式: ${style}`)

  if (styleCache.has(fileName)) {
    return styleCache.get(fileName)!
  }

  const url = `${import.meta.env.BASE_URL}csl-styles/${fileName}`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`无法加载样式文件: ${fileName} (${response.status})`)
  }

  const xml = await response.text()
  styleCache.set(fileName, xml)
  return xml
}

/**
 * 加载 CSL locale XML
 */
export async function loadLocale(lang: string): Promise<string> {
  if (localeCache.has(lang)) {
    return localeCache.get(lang)!
  }

  const url = `${import.meta.env.BASE_URL}csl-locales/locales-${lang}.xml`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`无法加载语言文件: ${lang} (${response.status})`)
  }

  const xml = await response.text()
  localeCache.set(lang, xml)
  return xml
}

/**
 * 预加载常用样式和语言文件
 */
export async function preloadCommonStyles(): Promise<void> {
  await Promise.all([
    loadLocale('zh-CN'),
    loadLocale('en-US'),
  ])
}
