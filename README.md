# BibliographIX | 参考文献生成助手

一款开源的学术参考文献格式化与转换工具，帮助研究者快速生成、批量转换多种引用格式。

## 功能特性

### 参考文献生成

填写文献基本信息（作者、标题、期刊、年份等），一键生成多种标准格式的参考文献条目。

**支持的文献类型：**
- 期刊文章 [J]
- 图书 [M]
- 会议论文 [C]
- 学位论文 [D]
- 报告 [R]
- 报纸文章 [N]
- 标准 [S]
- 专利 [P]
- 电子资源 [EB/OL]

**支持的引用格式：**

| 格式 | 说明 | 适用领域 |
|------|------|---------|
| GB/T 7714（顺序编码） | 中国国家标准 2015 版 | 国内高校和期刊 |
| GB/T 7714（著者-年份） | 中国国家标准 2015 版 | 国内高校和期刊 |
| APA 第7版 | 美国心理学会 | 心理学、教育学、社会科学 |
| MLA 第9版 | 现代语言学会 | 文学、语言学、人文学科 |
| Chicago 注释体系 | 芝加哥手册第18版 | 人文学科 |
| Chicago 作者-日期 | 芝加哥手册第18版 | 自然/社会科学 |
| IEEE | 电气电子工程师学会 | 工程、计算机科学 |
| Vancouver | ICMJE/NLM | 生物医学、健康科学 |

### AI 批量格式转换

粘贴整篇论文的参考文献列表，使用 AI 一键批量转换为目标格式。适用于换投期刊时批量修改参考文献格式。

**支持的 AI 服务商：**
- DeepSeek（推荐国内用户）
- 智谱 GLM（GLM-5 / GLM-4 系列）
- Moonshot / Kimi（K2.5 系列）
- OpenAI（GPT-4o 系列）
- Anthropic / Claude（Sonnet / Opus 系列）

> API Key 仅存储在浏览器本地（localStorage），不会上传到任何第三方服务器。所有 AI 请求直接从浏览器发送到对应 AI 服务商。

### 格式说明文档

内置各引用格式的详细说明，包括：
- 完整的著录规范和真实示例
- 文内引用规则
- 双体系对照（GB/T 7714 顺序编码制/著者-出版年制、Chicago 注释/作者-日期）
- 官方文档链接和 PDF

## 技术栈

- **React 19** + **TypeScript** + **Vite 8**
- **Tailwind CSS v4** — 响应式设计
- **citeproc-js** — CSL 标准引用处理引擎（与 Zotero 同源）
- **CSL-JSON** — 结构化引文数据模型
- **Manrope** + **Noto Sans SC** + **Inter** — 字体方案

## 本地开发

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装与运行

```bash
# 克隆仓库
git clone https://github.com/Sebastian0818-lh/BibliographIX.git
cd BibliographIX

# 安装依赖
npm install --legacy-peer-deps

# 启动开发服务器
npm run dev

# 生产构建
npm run build
```

### 项目结构

```
src/
├── core/                  # 核心逻辑
│   ├── types.ts           # CSL-JSON 类型定义
│   ├── constants.ts       # 文献类型、字段 schema、格式配置
│   ├── nameUtils.ts       # 中英文作者姓名解析
│   ├── formatter/         # citeproc-js 格式化引擎
│   ├── parser/            # 引文解析器
│   └── ai/                # AI 辅助解析与批量转换
├── components/
│   ├── builder/           # 生成页面组件
│   ├── converter/         # 转换页面组件
│   ├── docs/              # 格式说明页面
│   ├── settings/          # AI 设置弹窗
│   └── shared/            # 共享组件
├── App.tsx                # 主应用
└── index.css              # 主题样式
public/
├── csl-styles/            # CSL 样式文件（8种格式）
├── csl-locales/           # CSL 语言文件（zh-CN、en-US）
└── *.pdf                  # 各格式官方参考文档
```

## 使用说明

### 生成参考文献

1. 在左侧选择文献类型（如期刊文章 [J]）
2. 填写文献信息（作者、标题、期刊名等）
3. 在下方选择目标格式（可多选）
4. 点击"生成引用"按钮
5. 在右侧查看结果，点击复制即可粘贴到论文中

### 批量格式转换

1. 点击右上角"AI 设置"，配置 AI 服务商的 API Key
2. 切换到"转换"页面
3. 粘贴参考文献列表（每行一条，支持带序号）
4. 选择目标格式
5. 点击"AI 批量转换"
6. 结果支持一键复制，粘贴到 Word 中斜体会自动保留

### 关于斜体

APA、MLA、Chicago、IEEE 等格式要求期刊名、书名使用斜体。本工具的处理方式：
- 在网页中以斜体显示
- 复制到 **Word / Google Docs / WPS** 时，斜体格式自动保留（富文本复制）
- 复制到纯文本编辑器（如记事本）时显示为纯文本

## 参考标准

本项目的格式规范基于以下官方文档：

- **GB/T 7714—2015**《信息与文献 参考文献著录规则》
- **APA** Publication Manual 7th Edition
- **MLA** Handbook 9th Edition
- **Chicago** Manual of Style 18th Edition
- **IEEE** Reference Style Guide (V 3.28.2025)
- **Vancouver** ICMJE Recommendations / NLM Citing Medicine

## 开源协议

MIT License

## 作者

Seb Lee

---

如有问题或建议，欢迎扫码关注微信公众号联系作者：

<p align="center">
  <img src="public/images/wechat-qrcode-readme.jpg" alt="微信公众号" width="200" />
</p>
