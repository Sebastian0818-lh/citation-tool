import type { CslItem, CslItemType, GbtTypeCode, CitationStyle, FieldSchema } from './types'

/** GB/T 7714 类型码 → CSL 类型映射 */
export const GBT_TO_CSL: Record<GbtTypeCode, CslItemType> = {
  'J': 'article-journal',
  'M': 'book',
  'C': 'paper-conference',
  'D': 'thesis',
  'R': 'report',
  'N': 'article-newspaper',
  'S': 'legislation',
  'P': 'patent',
  'EB/OL': 'webpage',
}

/** CSL 类型 → GB/T 7714 类型码映射 */
export const CSL_TO_GBT: Record<string, GbtTypeCode> = Object.fromEntries(
  Object.entries(GBT_TO_CSL).map(([k, v]) => [v, k as GbtTypeCode])
) as Record<string, GbtTypeCode>

/** 文献类型显示信息 */
export const REFERENCE_TYPES: Array<{
  code: GbtTypeCode
  cslType: CslItemType
  label: string
  icon: string
}> = [
  { code: 'J', cslType: 'article-journal', label: '期刊文章', icon: '📄' },
  { code: 'M', cslType: 'book', label: '图书', icon: '📕' },
  { code: 'C', cslType: 'paper-conference', label: '会议论文', icon: '🎤' },
  { code: 'D', cslType: 'thesis', label: '学位论文', icon: '🎓' },
  { code: 'R', cslType: 'report', label: '报告', icon: '📊' },
  { code: 'N', cslType: 'article-newspaper', label: '报纸文章', icon: '📰' },
  { code: 'S', cslType: 'legislation', label: '标准', icon: '📐' },
  { code: 'P', cslType: 'patent', label: '专利', icon: '💡' },
  { code: 'EB/OL', cslType: 'webpage', label: '电子资源', icon: '🌐' },
]

/** 引用格式显示信息 */
export const CITATION_STYLES: Array<{
  id: CitationStyle
  label: string
  description: string
}> = [
  { id: 'gb-t-7714-2015-numeric', label: 'GB/T 7714 (顺序编码)', description: '中国国家标准，顺序编码制' },
  { id: 'gb-t-7714-2015-author-date', label: 'GB/T 7714 (著者-年份)', description: '中国国家标准，著者-出版年制' },
  { id: 'apa', label: 'APA', description: '美国心理学会格式，社会科学常用' },
  { id: 'mla', label: 'MLA', description: '美国现代语言协会格式，人文学科常用' },
  { id: 'chicago-notes', label: 'Chicago (注释)', description: '芝加哥格式，注释-书目体系' },
  { id: 'chicago-author-date', label: 'Chicago (作者-日期)', description: '芝加哥格式，作者-日期体系' },
  { id: 'ieee', label: 'IEEE', description: 'IEEE 格式，工程技术领域常用' },
  { id: 'vancouver', label: 'Vancouver', description: '温哥华格式，医学领域常用' },
]

/** CSL 样式文件名映射 */
export const STYLE_FILE_MAP: Record<CitationStyle, string> = {
  'gb-t-7714-2015-numeric': 'chinese-gb7714-2005-numeric.csl',
  'gb-t-7714-2015-author-date': 'chinese-gb7714-2005-author-date.csl',
  'apa': 'apa.csl',
  'mla': 'modern-language-association.csl',
  'chicago-notes': 'chicago-notes.csl',
  'chicago-author-date': 'chicago-author-date.csl',
  'ieee': 'ieee.csl',
  'vancouver': 'vancouver.csl',
}

/** 每种文献类型的字段 schema */
export const TYPE_FIELD_SCHEMAS: Record<CslItemType, FieldSchema[]> = {
  'article-journal': [
    { key: 'author', label: '作者', type: 'author-list', required: true, placeholder: '输入作者姓名，按回车添加' },
    { key: 'title', label: '文章标题', type: 'text', required: true, placeholder: '例：蓝田生物群：一个认识多细胞生物起源和早期演化的新窗口' },
    { key: 'container-title', label: '期刊名称', type: 'text', required: true, placeholder: '例：科学通报' },
    { key: 'issued', label: '出版年份', type: 'date', required: true, placeholder: '例：2012' },
    { key: 'volume', label: '卷号', type: 'text', required: false, placeholder: '例：55' },
    { key: 'issue', label: '期号', type: 'text', required: false, placeholder: '例：34' },
    { key: 'page', label: '页码', type: 'text', required: false, placeholder: '例：3219-3227' },
    { key: 'DOI', label: 'DOI', type: 'text', required: false, placeholder: '例：10.1360/972011-1496' },
  ],
  'book': [
    { key: 'author', label: '作者/编者', type: 'author-list', required: true, placeholder: '输入作者姓名，按回车添加' },
    { key: 'title', label: '书名', type: 'text', required: true, placeholder: '例：系统工程' },
    { key: 'publisher', label: '出版社', type: 'text', required: true, placeholder: '例：机械工业出版社' },
    { key: 'publisher-place', label: '出版地', type: 'text', required: true, placeholder: '例：北京' },
    { key: 'issued', label: '出版年份', type: 'date', required: true, placeholder: '例：2003' },
    { key: 'edition', label: '版次', type: 'text', required: false, placeholder: '例：第3版（第1版不著录）' },
    { key: 'page', label: '引用页码', type: 'text', required: false, placeholder: '例：471-472' },
    { key: 'ISBN', label: 'ISBN', type: 'text', required: false, placeholder: '例：978-7-111-12345-6' },
  ],
  'paper-conference': [
    { key: 'author', label: '作者', type: 'author-list', required: true, placeholder: '输入作者姓名，按回车添加' },
    { key: 'title', label: '论文标题', type: 'text', required: true, placeholder: '例：面向数字素养的高校图书馆数字服务体系研究' },
    { key: 'container-title', label: '会议论文集名', type: 'text', required: true, placeholder: '例：中国图书馆学会年会论文集：2011年卷' },
    { key: 'publisher-place', label: '出版地', type: 'text', required: false, placeholder: '例：北京' },
    { key: 'publisher', label: '出版者', type: 'text', required: false, placeholder: '例：国家图书馆出版社' },
    { key: 'issued', label: '出版年份', type: 'date', required: true, placeholder: '例：2011' },
    { key: 'page', label: '页码', type: 'text', required: false, placeholder: '例：45-52' },
  ],
  'thesis': [
    { key: 'author', label: '作者', type: 'author-list', required: true, placeholder: '输入作者姓名，按回车添加' },
    { key: 'title', label: '论文题目', type: 'text', required: true, placeholder: '例：新闻道德论' },
    { key: 'publisher-place', label: '所在城市', type: 'text', required: false, placeholder: '例：北京' },
    { key: 'publisher', label: '授予单位', type: 'text', required: true, placeholder: '例：中国人民大学' },
    { key: 'issued', label: '年份', type: 'date', required: true, placeholder: '例：2010' },
    { key: 'genre', label: '论文类型', type: 'select', required: false, options: [
      { label: '硕士学位论文', value: '硕士学位论文' },
      { label: '博士学位论文', value: '博士学位论文' },
    ]},
  ],
  'report': [
    { key: 'author', label: '作者/机构', type: 'author-list', required: true, placeholder: '输入作者姓名，按回车添加' },
    { key: 'title', label: '报告题名', type: 'text', required: true, placeholder: '例：第29次中国互联网络发展现状统计报告' },
    { key: 'publisher-place', label: '出版地', type: 'text', required: false, placeholder: '例：北京' },
    { key: 'publisher', label: '出版者/机构', type: 'text', required: true, placeholder: '例：中国互联网络信息中心' },
    { key: 'issued', label: '年份', type: 'date', required: true, placeholder: '例：2012' },
    { key: 'number', label: '报告编号', type: 'text', required: false, placeholder: '例：CNIC-01887' },
  ],
  'article-newspaper': [
    { key: 'author', label: '作者', type: 'author-list', required: true, placeholder: '输入作者姓名，按回车添加' },
    { key: 'title', label: '文章标题', type: 'text', required: true, placeholder: '例：我们的科技一直在追赶' },
    { key: 'container-title', label: '报纸名称', type: 'text', required: true, placeholder: '例：人民日报' },
    { key: 'issued', label: '出版日期', type: 'date', required: true, placeholder: '例：2013-01-12' },
    { key: 'page', label: '版次', type: 'text', required: false, placeholder: '例：2' },
  ],
  'legislation': [
    { key: 'author', label: '发布机构', type: 'text', required: true, placeholder: '例：全国信息与文献标准化技术委员会' },
    { key: 'title', label: '标准名称', type: 'text', required: true, placeholder: '例：信息与文献 都柏林核心元数据元素集' },
    { key: 'number', label: '标准号', type: 'text', required: true, placeholder: '例：GB/T 25100—2010' },
    { key: 'publisher-place', label: '出版地', type: 'text', required: false, placeholder: '例：北京' },
    { key: 'publisher', label: '出版者', type: 'text', required: false, placeholder: '例：中国标准出版社' },
    { key: 'issued', label: '发布年份', type: 'date', required: true, placeholder: '例：2010' },
    { key: 'page', label: '引用页码', type: 'text', required: false, placeholder: '例：2-3' },
  ],
  'patent': [
    { key: 'author', label: '申请人/专利权人', type: 'author-list', required: true, placeholder: '输入作者姓名，按回车添加' },
    { key: 'title', label: '专利名称', type: 'text', required: true, placeholder: '例：全智能节电器' },
    { key: 'number', label: '专利号', type: 'text', required: true, placeholder: '例：200610171314.3' },
    { key: 'issued', label: '公告日期', type: 'date', required: true, placeholder: '例：2006-12-13' },
  ],
  'webpage': [
    { key: 'author', label: '作者/责任者', type: 'author-list', required: false, placeholder: '输入作者姓名，按回车添加' },
    { key: 'title', label: '题名', type: 'text', required: true, placeholder: '例：Origins and concepts of digital literacy' },
    { key: 'container-title', label: '网站名称', type: 'text', required: false, placeholder: '例：OCLC' },
    { key: 'issued', label: '发布/更新日期', type: 'date', required: false, placeholder: '例：2008-05-04' },
    { key: 'accessed', label: '引用日期', type: 'date', required: false, placeholder: '例：2013-03-08' },
    { key: 'URL', label: '网址', type: 'text', required: true, placeholder: '例：https://www.example.com/article.pdf' },
  ],
}

/** 生成唯一 ID */
export function generateId(): string {
  return `ref-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

/** 创建空白 CslItem */
export function createEmptyCslItem(type: CslItemType): CslItem {
  return {
    id: generateId(),
    type,
    title: '',
  }
}
