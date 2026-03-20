import { useState } from 'react'

interface DualSystem {
  nameA: string
  nameB: string
  examplesA: { label: string; text: string }[]
  examplesB: { label: string; text: string }[]
  inTextA?: string[]
  inTextB?: string[]
}

interface FormatDoc {
  id: string
  name: string
  fullName: string
  description: string
  example: string
  examples?: { label: string; text: string }[]
  dualSystem?: DualSystem
  rules: string[]
  inTextCitation?: string[]
  link: string
  links?: { label: string; url: string }[]
}

const FORMAT_DOCS: FormatDoc[] = [
  {
    id: 'gbt',
    name: 'GB/T 7714',
    fullName: 'GB/T 7714—2015《信息与文献 参考文献著录规则》',
    description: '中国国家标准（代替 GB/T 7714—2005），规定了各学科、各类型信息资源的参考文献著录项目、著录顺序、著录用符号、著录用文字、各著录项目的著录方法以及参考文献在正文中的标注法。适用于著者和编辑著录参考文献，是国内高校和期刊最常用的参考文献格式。本标准参考 ISO 690:2010 编制，一致性程度为非等效。',
    example: '陈登原. 国史旧闻: 第1卷[M]. 北京: 中华书局, 2000: 29.',
    examples: [
      { label: '普通图书 [M]', text: '汪应洛. 系统工程[M]. 第3版. 北京: 机械工业出版社, 2003: 471-472.' },
      { label: '期刊文章 [J]', text: '袁训来, 陈哲, 肖书海, 等. 蓝田生物群: 一个认识多细胞生物起源和早期演化的新窗口[J]. 科学通报, 2012, 55(34): 3219.' },
      { label: '会议论文 [C]', text: '贾东琴, 柯平. 面向数字素养的高校图书馆数字服务体系研究[C]//中国图书馆学会. 中国图书馆学会年会论文集: 2011年卷. 北京: 国家图书馆出版社, 2011: 45-52.' },
      { label: '学位论文 [D]', text: '杨保军. 新闻道德论[D]. 北京: 中国人民大学出版社, 2010.' },
      { label: '报告 [R]', text: '中国互联网络信息中心. 第29次中国互联网络发展现状统计报告[R/OL]. (2012-01-16)[2013-03-26]. http://www.cnnic.net.cn/.' },
      { label: '报纸文章 [N]', text: '余建斌. 我们的科技一直在追赶: 访中国工程院院长周济[N]. 人民日报, 2013-01-12(2).' },
      { label: '标准 [S]', text: '全国信息与文献标准化技术委员会. 信息与文献 都柏林核心元数据元素集: GB/T 25100—2010[S]. 北京: 中国标准出版社, 2010: 2-3.' },
      { label: '专利 [P]', text: '邓一刚. 全智能节电器: 200610171314.3[P]. 2006-12-13.' },
      { label: '电子资源 [EB/OL]', text: 'BAWDEN D. Origins and concepts of digital literacy[EB/OL]. (2008-05-04)[2013-03-08]. http://www.soi.city.ac.uk/~dbawden/digital%20literacy%20chapter.pdf.' },
    ],
    rules: [
      '文献类型标识代码：普通图书[M]、会议录[C]、汇编[G]、报纸[N]、期刊[J]、学位论文[D]、报告[R]、标准[S]、专利[P]、数据库[DB]、计算机程序[CP]、电子公告[EB]、档案[A]、舆图[CM]、数据集[DS]、其他[Z]',
      '电子资源载体标识代码：磁带[MT]、磁盘[DK]、光盘[CD]、联机网络[OL]',
      '个人著者姓在前名在后，欧美著者名可缩写为首字母，缩写名后省略缩写点；用汉语拼音书写的人名姓全大写，名可缩写取首字母',
      '责任者不超过 3 个时全部照录，超过 3 个时著录前 3 个，其后加", 等"或", et al."',
      '著录用符号："."用于题名项、版本项、出版项等之前；":"用于其他题名信息、出版者、页码、专利号前；","用于责任者、出版年前；"//"用于析出文献出处项前；"[]"用于文献序号、文献类型标识、引用日期',
      '第 1 版不著录，其他版本需著录（如"第3版"或"5th ed."）',
      '出版项按"出版地: 出版者, 出版年"顺序著录',
      '顺序编码制：参考文献按引文序号排列，序号用方括号标注如 [1]、[2]',
      '著者-出版年制：参考文献按著者字顺和出版年排序，正文标注格式为 (著者, 出版年)',
      '电子资源既要著录文献类型标识，也要著录载体标识，如 [J/OL]、[M/OL]、[EB/OL]',
    ],
    dualSystem: {
      nameA: '顺序编码制',
      nameB: '著者-出版年制',
      examplesA: [
        { label: '期刊文章', text: '[1] 袁训来, 陈哲, 肖书海, 等. 蓝田生物群: 一个认识多细胞生物起源和早期演化的新窗口[J]. 科学通报, 2012, 55(34): 3219.' },
        { label: '图书', text: '[2] 汪应洛. 系统工程[M]. 第3版. 北京: 机械工业出版社, 2003: 471-472.' },
      ],
      examplesB: [
        { label: '期刊文章', text: '袁训来, 陈哲, 肖书海, 等. 2012. 蓝田生物群: 一个认识多细胞生物起源和早期演化的新窗口[J]. 科学通报, 55(34): 3219.' },
        { label: '图书', text: '汪应洛. 2003. 系统工程[M]. 第3版. 北京: 机械工业出版社: 471-472.' },
      ],
      inTextA: [
        '序号置于方括号中，如 [1]、[2]，按引用先后顺序连续编码',
        '也可用脚注方式，序号由计算机自动生成圈码（如 ①②③）',
        '同一处引用多篇文献时，各序号在方括号内全部列出，用","隔开；连续序号用短横线连接，如 [2,4,6] 或 [1-3]',
        '多次引用同一文献时使用首次引用的序号，在"[]"外著录引文页码，如 [2]260 或 [2]326-329',
        '脚注方式多次引用同一文献时，应重复著录，但著录项目可简化为序号及引文页码',
      ],
      inTextB: [
        '标注内容由著者姓氏与出版年构成，置于"( )"内，如 (Crane, 1972)',
        '正文已提及著者姓名时，括号内只著录出版年：如 Stieg (1981) 指出……',
        '中国/韩国/日本著者标注全名：如 (张忠智, 1997)、(王临惠, 2010a)',
        '多著者文献：欧美著者标注第一著者姓 + et al.，如 (Kennedy et al., 1975)；中国著者标注第一著者姓名 + 等，如 (蒋有绪 等, 1998)',
        '同一著者同年多篇在年份后加 a、b、c 区分，如 (Kennedy et al., 1975a)、(王临惠, 2010b)',
        '多次引用同一文献时，在"( )"外以角标形式著录引文页码，如 (中国社会科学院语言研究所词典编辑室, 1996)¹¹⁹⁴',
        '参考文献表按著者字顺和出版年排序，中文可按拼音或笔画排列',
      ],
    },
    link: '/GBT7714-2015.pdf',
  },
  {
    id: 'apa',
    name: 'APA',
    fullName: 'APA 第7版（美国心理学会出版手册）',
    description: 'APA 格式由美国心理学会（American Psychological Association）制定，使用"作者-日期"引用体系，广泛用于心理学、教育学、社会科学、商学等领域。第7版为最新版本，相较第6版有多项更新：出版地不再必须标注、3 名及以上作者在文内直接使用"et al."、DOI 统一使用 https://doi.org/ 格式等。',
    example: 'Cavenagh, N., & Ramadurai, R. (2017). Understanding mean-level and intraindividual variability. Journal of Combinatorial Designs, 25(4), 147–158. https://doi.org/10.1002/jcd.21529',
    examples: [
      { label: '单作者图书', text: 'King, M. (2000). Wrestling with the angel: A life of Janet Frame. Viking.' },
      { label: '双作者图书（含 DOI）', text: 'Bromiley, P., & Rau, D. (2017). Behavioral strategic management. Routledge. https://doi.org/10.4324/9781315232980' },
      { label: '三名及以上作者图书', text: 'Krause, K.-L., Bochner, S., & Duchesne, S. (2006). Educational psychology for learning and teaching (2nd ed.). Thomson.' },
      { label: '期刊文章', text: 'Niepel, C., Hausen, J. E., Weber, A. M., & Möller, J. (2025). Understanding mean-level and intraindividual variability in state academic self-concept. Journal of Educational Psychology, 117(5), 772–788. https://doi.org/10.1037/edu0000946' },
      { label: '编著章节', text: 'Kestly, T. (2010). Group sandplay in elementary schools. In A. A. Drewes & C. E. Shaefer (Eds.), School-based play therapy (2nd ed., pp. 257-282). John Wiley & Sons. https://doi.org/10.1002/9781118269701' },
      { label: '报纸文章', text: 'Gluckman, P., & Hanson, M. (2019, November 30). Are humans too ingenious for our own good? New Zealand Herald. https://www.nzherald.co.nz/...' },
      { label: '网页', text: 'Patel, V. (2019, November 11). Where was "The Mandalorian" filmed? TheCinemaholic. https://www.thecinemaholic.com/where-was-the-mandalorian-filmed/' },
      { label: '学位论文', text: 'Horvath-Plyman, M. (2018). Social media and the college student journey (Publication No. 10937367) [Doctoral dissertation, New York University]. ProQuest Dissertations and Theses Global.' },
      { label: '会议报告', text: 'Davidson, R. J. (2019, August 8–11). Well-being is a skill [Conference session]. APA 2019 Convention, Chicago, IL, United States.' },
    ],
    rules: [
      '作者姓名倒写：姓在前加逗号，名用首字母缩写，保留作者原始顺序；多作者间用逗号隔开，最后一人前用"&"',
      '第7版新规：3 名及以上作者在文内引用时直接用第一作者 et al.（第6版为6名以上才用）',
      '出版年放在作者后的圆括号内，末尾加句号',
      '文章标题仅首字母大写（含副标题首字母），专有名词除外；不加斜体',
      '期刊名所有主要单词大写，加斜体；卷号加斜体，期号在括号内不加斜体',
      '页码使用"–"连接（如 pp. 147–158），末尾加句号',
      '第7版新规：出版地（城市/州/国家）不再需要标注',
      '有 DOI 的文献必须包含 DOI，格式为 https://doi.org/xxxx，末尾不加句号',
      '无 DOI 的学术数据库文献不加 URL；其他网络文献需加 URL',
      '参考文献表按作者姓氏字母顺序排列（不编号）',
    ],
    inTextCitation: [
      '基本格式：(作者姓, 年份)，如 (King, 2000) 或 King (2000) 认为...',
      '双作者：文内用"and"连接，括号内用"&"连接，如 Bromiley and Rau (2017) 或 (Bromiley & Rau, 2017)',
      '第7版新规：3 名及以上作者直接使用第一作者 + et al.，如 (Krause et al., 2006)',
      '直接引用需标注页码，如 (Cohen & Lotan, 2014, p. 151)',
      '间接引用/改写可选择性添加页码',
      '二手资料引用：(原作者, 年份, as cited in 引用来源作者, 年份)，参考文献表只列引用来源',
      '机构作者首次出现可标注缩写：(International Labour Organization [ILO], 2007)，后续用 (ILO, 2007)',
    ],
    link: 'https://apastyle.apa.org/',
    links: [
      { label: 'APA 快速指南（中文版）', url: '/APA-quick-guide-mandarin.pdf' },
      { label: '常见引用示例', url: '/APA-common-reference-examples.pdf' },
      { label: '参考文献格式指南', url: '/APA-reference-guide.pdf' },
    ],
  },
  {
    id: 'mla',
    name: 'MLA',
    fullName: 'MLA 第9版（现代语言学会格式手册）',
    description: 'MLA 格式由美国现代语言学会（Modern Language Association）制定，主要用于文学、语言学、文化研究、哲学等人文学科。第9版（2021）基于"容器"（container）模型和九个核心元素的灵活模板，强调原则而非死板规则。主要更新：出版地不再要求标注、DOI 优先于 URL、使用"Accessed"替代日期缩写等。',
    example: 'Gleick, James. Chaos: Making a New Science. Penguin, 1987.',
    examples: [
      { label: '单作者图书', text: 'Gleick, James. Chaos: Making a New Science. Penguin, 1987.' },
      { label: '双作者图书', text: 'Gillespie, Paula, and Neal Lerner. The Allyn and Bacon Guide to Peer Tutoring. Allyn and Bacon, 2000.' },
      { label: '三名及以上作者', text: 'Wysocki, Anne Frances, et al. Writing New Media: Theory and Applications for Expanding the Teaching of Composition. Utah State UP, 2004.' },
      { label: '学术期刊文章', text: 'Bagchi, Alaknanda. "Conflicting Nationalisms: The Voice of the Subaltern in Mahasweta Devi\'s Bashai Tudu." Tulsa Studies in Women\'s Literature, vol. 15, no. 1, 1996, pp. 41-50.' },
      { label: '杂志文章', text: 'Poniewozik, James. "TV Makes a Too-Close Call." Time, 20 Nov. 2000, pp. 70-71.' },
      { label: '报纸文章', text: 'Brubaker, Bill. "New Health Center Targets County\'s Uninsured Patients." Washington Post, 24 May 2007, p. LZ01.' },
      { label: '编著章节', text: 'Kestly, T. "Group Sandplay in Elementary Schools." School-Based Play Therapy, edited by A. A. Drewes and C. E. Shaefer, 2nd ed., John Wiley & Sons, 2010, pp. 257-82.' },
      { label: '网页', text: 'Patel, V. "Where Was The Mandalorian Filmed?" TheCinemaholic, 11 Nov. 2019, www.thecinemaholic.com/where-was-the-mandalorian-filmed/.' },
    ],
    rules: [
      '核心模板（九个核心元素）：作者、标题、容器标题、其他贡献者、版本、编号（卷/期）、出版者、出版日期、位置（页码/URL/DOI）',
      '作者姓名倒写：姓, 名。双作者第二人用正常顺序（名 姓），用"and"连接；三人及以上只列第一作者 + et al.',
      '文章标题用双引号括起，书名/期刊名用斜体；标题中所有主要单词大写（冠词、介词、连词除外）',
      '"容器"模型：作品所在的出版物视为"容器"，如期刊、文集、网站等。可有多层容器',
      '出版者名称在日期前，用逗号隔开。第9版不再要求标注出版地（1900年前出版物除外）',
      '页码使用 pp.（多页）或 p.（单页），省略重复的前位数字，如 pp. 225-50',
      '有 DOI 优先使用 DOI，否则使用 URL（删除 http://）。DOI 或 URL 为引用最后一个元素',
      '参考文献列表标题为"Works Cited"，居中不加斜体或引号',
      '所有条目按作者姓氏字母顺序排列，使用悬挂缩进（首行顶格，后续行缩进 0.5 英寸）',
      '同一作者多部作品按标题字母排序，第二部起作者名用三短线（---）代替',
    ],
    inTextCitation: [
      '基本格式：(作者姓 页码)，如 (Foulkes 184)，不使用出版年份',
      '作者嵌入句中时括号只标页码：According to Foulkes, dreams express "profound aspects of personality" (184)',
      '双作者：(Gillespie and Lerner 25)；三人及以上：(Wysocki et al. 76)',
      '直接引用（4行以内）：用双引号括起，页码在句末括号内，句号在括号后',
      '长引用（超过4行）：独立成段，不用引号，整段缩进 0.5 英寸，句号在引文末而非括号后',
      '无作者作品：使用标题缩写替代作者，如 ("Business" 82)',
      '引用诗歌标注行号而非页码，用斜线标记换行：(11-12)',
    ],
    link: 'https://owl.purdue.edu/owl/research_and_citation/mla_style/mla_formatting_and_style_guide/mla_formatting_and_style_guide.html',
    links: [
      { label: 'Works Cited 示例集', url: '/MLA-works-cited-sample.pdf' },
      { label: '普渡大学 MLA 格式指南', url: 'https://owl.purdue.edu/owl/research_and_citation/mla_style/mla_formatting_and_style_guide/mla_formatting_and_style_guide.html' },
    ],
  },
  {
    id: 'chicago',
    name: 'Chicago',
    fullName: 'The Chicago Manual of Style 第18版（2024）',
    description: '芝加哥大学出版社制定，历史最悠久、应用最广的英文学术写作指南。第18版（2024年）为最新版本，提供两种引用体系：注释-书目体系（Notes-Bibliography）和作者-日期体系（Author-Date）。主要更新：图书引用不再要求标注出版地（CMOS 14.30）、编著章节书目条目不再要求页码范围（CMOS 14.8）。人文学科通常使用注释-书目体系，自然/社会科学通常使用作者-日期体系。',
    example: 'Yu, Charles. Interior Chinatown. Pantheon Books, 2020.',
    dualSystem: {
      nameA: '注释-书目体系',
      nameB: '作者-日期体系',
      examplesA: [
        { label: '图书', text: 'Binder, Amy J., and Jeffrey L. Kidder. The Channels of Student Activism: How the Left and Right Are Winning (and Losing) in Campus Politics Today. University of Chicago Press, 2022.' },
        { label: '编著章节', text: 'Doyle, Kathleen. "The Queen Mary Psalter." In The Book by Design: The Remarkable Story of the World\'s Greatest Invention, edited by P. J. M. Marks and Stephen Parkin. University of Chicago Press, 2023.' },
        { label: '期刊文章', text: 'Kwon, Hyeyoung. "Inclusion Work: Children of Immigrants Claiming Membership in Everyday Life." American Journal of Sociology 127, no. 6 (2022): 1818–59. https://doi.org/10.1086/720277.' },
        { label: '学位论文', text: 'Blajer de la Garza, Yuna. "A House Is Not a Home: Citizenship and Belonging in Contemporary Democracies." PhD diss., University of Chicago, 2019. ProQuest (13865986).' },
      ],
      examplesB: [
        { label: '图书', text: 'Yu, Charles. 2020. Interior Chinatown. Pantheon Books.' },
        { label: '编著章节', text: 'Doyle, Kathleen. 2023. "The Queen Mary Psalter." In The Book by Design: The Remarkable Story of the World\'s Greatest Invention, edited by P. J. M. Marks and Stephen Parkin. University of Chicago Press.' },
        { label: '期刊文章', text: 'Lindquist, Benjamin. 2023. "The Art of Text-to-Speech." Critical Inquiry 50 (2): 225–51. https://doi.org/10.1086/727651.' },
        { label: '学位论文', text: 'Blajer de la Garza, Yuna. 2019. "A House Is Not a Home: Citizenship and Belonging in Contemporary Democracies." PhD diss., University of Chicago. ProQuest (13865986).' },
      ],
      inTextA: [
        '使用脚注（footnote）或尾注（endnote），首次引用用完整格式，后续用缩略格式',
        '完整注释：Charles Yu, Interior Chinatown (Pantheon Books, 2020), 45.',
        '缩略注释：Yu, Interior Chinatown, 48.',
        '编著章节注释：Kathleen Doyle, "The Queen Mary Psalter," in The Book by Design, ed. P. J. M. Marks and Stephen Parkin (University of Chicago Press, 2023), 64.',
      ],
      inTextB: [
        '格式：(作者姓 年份, 页码)，如 (Yu 2020, 45)',
        '双作者：(Binder and Kidder 2022, 117–18)',
        '三人及以上：第一作者 + et al.，如 (Snyder et al. 2025, 9–10)',
        '无固定页码可引用章节号：(Roy 2008, chap. 6)',
      ],
    },
    rules: [
      '提供两种引用体系：注释-书目体系（Notes-Bibliography，人文学科常用）和作者-日期体系（Author-Date，自然/社会科学常用）',
      '第18版新规：图书引用不再要求标注出版地（CMOS 14.30）',
      '第18版新规：编著章节的书目/参考文献条目不再要求页码范围（CMOS 14.8），但注释/文内引用中仍标注具体页码',
      '注释-书目体系中，书名用斜体，文章/章节标题用双引号；书目条目作者姓名倒写（姓, 名），注释中保持正常顺序',
      '作者-日期体系中，出版年紧跟作者名后；参考文献表按作者姓氏字母排序',
      '期刊引用格式：卷号, no. 期号 (年份): 页码范围。期刊名用斜体',
      '3 名及以上作者：书目/参考文献表中最多列 6 人，超过 6 人列前 3 人 + et al.；注释/文内引用仅列第一作者 + et al.',
      '在线文献优先使用基于 DOI 的 URL（如 https://doi.org/xxxx），否则提供数据库名或 URL',
      '无出版日期的来源用 n.d. 标注，并加访问日期（accessed）',
      '书目/参考文献表按作者姓氏字母排序，同一作者按年份排序',
    ],
    link: 'https://www.chicagomanualofstyle.org/tools_citationguide.html',
  },
  {
    id: 'ieee',
    name: 'IEEE',
    fullName: 'IEEE Reference Style Guide（V 3.28.2025）',
    description: 'IEEE（电气电子工程师学会）制定的参考文献格式，广泛用于电气工程、计算机科学、信息技术、电子工程等领域。采用顺序编码制，参考文献按文中引用顺序编号。作者名缩写在前、姓在后，文章标题加引号，期刊名用斜体且缩写。IEEE 出版物必须列出所有作者（最多6名），超过6名时用第一作者 + "et al."。',
    example: 'M. M. Chiampi and L. L. Zilberti, "Induction of electric field in human bodies moving near MRI: An efficient BEM computational procedure," IEEE Trans. Biomed. Eng., vol. 58, pp. 2787–2793, Oct. 2011.',
    examples: [
      { label: '期刊文章', text: 'M. M. Chiampi and L. L. Zilberti, "Induction of electric field in human bodies moving near MRI: An efficient BEM computational procedure," IEEE Trans. Biomed. Eng., vol. 58, pp. 2787–2793, Oct. 2011, doi: 10.1109/TBME.2011.2158315.' },
      { label: '图书', text: 'B. Klaus and P. Horn, Robot Vision. Cambridge, MA, USA: MIT Press, 1986.' },
      { label: '图书章节', text: 'L. Stein, "Random patterns," in Computers and You, J. S. Brake, Ed., New York, NY, USA: Wiley, 1994, pp. 55–70.' },
      { label: '会议论文', text: 'S. P. Bingulac, "On the compatibility of adaptive controllers," in Proc. 4th Annu. Allerton Conf. Circuit Syst. Theory, New York, NY, USA, 1994, pp. 8–16.' },
      { label: '会议论文（含 DOI）', text: 'G. Veruggio, "The EURON roboethics roadmap," in Proc. Humanoids \'06: 6th IEEE-RAS Int. Conf. Humanoid Robots, 2006, pp. 612–617, doi: 10.1109/ICHR.2006.321337.' },
      { label: '专利', text: 'J. P. Wilkinson, "Nonlinear resonant circuit devices," U.S. Patent 3 624 125, Jul. 16, 1990.' },
      { label: '标准', text: 'IEEE Criteria for Class IE Electric Systems, IEEE Standard 308, 1969.' },
      { label: '学位论文', text: 'J. O. Williams, "Narrow-band analyzer," Ph.D. dissertation, Dept. Elect. Eng., Harvard Univ., Cambridge, MA, USA, 1993.' },
      { label: '报告', text: 'E. E. Reber, R. L. Mitchell, and C. J. Carter, "Oxygen absorption in the earth\'s atmosphere," Aerospace Corp., Los Angeles, CA, USA, Tech. Rep. TR-0200 (4230-46)-3, Nov. 1988.' },
      { label: '网页', text: 'J. Geralds, "Sega Ends Production of Dreamcast," vnunet.com, Jan. 31, 2001. [Online]. Available: http://nl1.vnunet.com/news/1116995.' },
    ],
    rules: [
      '按引用顺序编号，序号用方括号标注 [1], [2], [3]，序号列左对齐形成独立列',
      '作者名缩写在前、姓在后（如 J. K. Author），名字之间不用逗号隔开 Jr./Sr./III',
      'IEEE 出版物必须列出所有作者（最多6名）；超过6名用第一作者 + "et al."；非IEEE出版物如未提供可直接用"et al."',
      '文章标题用双引号括起，仅首字母大写（专有名词除外）',
      '期刊名/书名用斜体，期刊名使用标准缩写（如 IEEE Trans. Biomed. Eng.）；单词期刊名不缩写（如 Science, Nature）',
      '期刊格式：vol. x, no. x, pp. xxx–xxx, Abbrev. Month, year',
      '会议论文格式："Title," in Abbreviated Conf. Name, location (optional), year, pp. xxx–xxx',
      '有 DOI 的文献在末尾加 doi: xxx（DOI 后加句号）；有 URL 的在线文献加 [Online]. Available: URL（URL 后不加句号）',
      '如同时有 DOI/访问日期和 URL，DOI/访问日期在前加句号，URL 在后',
      '所有引用必须包含至少出版年份；无日期用"(n.d.)"标注',
    ],
    inTextCitation: [
      '文内引用在行内用方括号标注序号，如 [1]，置于标点符号之内',
      '可作为名词使用：如 according to [1]; as shown by Brown [4], [5]',
      '多个引用逐个列出：[1], [2], [3], [4]（不使用"–"连接范围）',
      '三名及以上作者在文内用 et al.：如 Wood et al. [7]',
      '引用特定部分：[3, pp. 5–10]; [3, eq. (2)]; [3, Fig. 1]; [3, Thm. 1]; [3, Ch. 2]; [3, Algorithm 5]',
    ],
    link: '/IEEE-Reference-Guide.pdf',
  },
  {
    id: 'vancouver',
    name: 'Vancouver',
    fullName: 'Vancouver 引用格式（ICMJE / NLM）',
    description: 'Vancouver 格式由国际医学期刊编辑委员会（ICMJE）推荐，基于美国国家医学图书馆（NLM）的 NISO Z39.29 标准改编，广泛用于生物医学、健康科学、护理学等领域。采用顺序编码制，参考文献按引用顺序编号。作者姓全拼、名缩写且不加句点，期刊名使用 MEDLINE/PubMed 标准缩写，整体格式紧凑无斜体。',
    example: 'Halpern SD, Ubel PA, Caplan AL. Solid-organ transplantation in HIV-infected patients. N Engl J Med. 2002 Jul 25;347(4):284-7.',
    examples: [
      { label: '标准期刊文章', text: 'Halpern SD, Ubel PA, Caplan AL. Solid-organ transplantation in HIV-infected patients. N Engl J Med. 2002 Jul 25;347(4):284-7.' },
      { label: '超过6位作者', text: 'Rose ME, Huerbin MB, Melick J, Marion DW, Palmer AM, Schiding JK, et al. Regulation of interstitial excitatory amino acid concentrations after cortical contusion injury. Brain Res. 2002;935(1-2):40-6.' },
      { label: '图书', text: 'Murray PR, Rosenthal KS, Kobayashi GS, Pfaller MA. Medical microbiology. 4th ed. St. Louis: Mosby; 2002.' },
      { label: '图书章节', text: 'Meltzer PS, Kallioniemi A, Trent JM. Chromosome alterations in human solid tumors. In: Vogelstein B, Kinzler KW, editors. The genetic basis of human cancer. New York: McGraw-Hill; 2002. p. 93-113.' },
      { label: '会议论文', text: 'Christensen S, Oppacher F. An analysis of Koza\'s computational effort statistic for genetic programming. In: Foster JA, Lutton E, Miller J, Ryan C, Tettamanzi AG, editors. Genetic programming. EuroGP 2002: Proceedings of the 5th European Conference on Genetic Programming; 2002 Apr 3-5; Kinsdale, Ireland. Berlin: Springer; 2002. p. 182-91.' },
      { label: '学位论文', text: 'Borkowski MM. Infant sleep and feeding: a telephone survey of Hispanic Americans [dissertation]. Mount Pleasant (MI): Central Michigan University; 2002.' },
      { label: '专利', text: 'Pagedas AC, inventor; Ancel Surgical R&D Inc., assignee. Flexible endoscopic grasping and cutting device and positioning tool assembly. United States patent US 20020103498. 2002 Aug 1.' },
      { label: '报纸文章', text: 'Tynan T. Medical improvements lower homicide rate: study sees drop in assault rate. The Washington Post. 2002 Aug 12;Sect. A:2 (col. 4).' },
      { label: '在线期刊文章（含 DOI）', text: 'Zhang M, Holman CD, Price SD, Sanfilippo FM, Preen DB, Bulsara MK. Comorbidity and repeat admission to hospital for adverse drug reactions in older adults: retrospective cohort study. BMJ. 2009 Jan 7;338:a2752. doi: 10.1136/bmj.a2752.' },
    ],
    rules: [
      '按引用顺序编号，编号可用上标或括号形式',
      '作者姓全拼，名缩写且不加句点（如 Halpern SD），保留作者原始顺序',
      '列出前6位作者，超过6位后加"et al."（NLM 现列出所有作者）',
      '期刊名使用 MEDLINE/PubMed 标准缩写（如 N Engl J Med），单词期刊名不缩写',
      '期刊格式：期刊缩写. 年 月 日;卷(期):页码. 如连续页码可省略月和期号',
      '图书格式：作者. 书名. 版次. 出版地: 出版者; 年. 页码.',
      '整体格式紧凑，不使用斜体',
      '在线文献加"[Internet]"标识，并标注 [cited 年 月 日] 和 Available from: URL',
      '有 DOI 的文献在末尾加 doi: xxx',
      '文献类型可在标题后方括号标注，如 [dissertation]、[dataset]、[letter]',
    ],
    inTextCitation: [
      '在引文处用数字编号标注，通常为上标形式或方括号内，如 ¹ 或 (1)',
      '按引用顺序编号，同一文献多次引用使用同一编号',
      '多个引用可合并：(1,3,5) 或 (1-3)',
      '引用特定页码：(1, p. 93)',
    ],
    link: 'https://www.ncbi.nlm.nih.gov/books/NBK7256/',
  },
]

export default function FormatDocsView() {
  const [activeFormat, setActiveFormat] = useState<string>('gbt')
  const current = FORMAT_DOCS.find(f => f.id === activeFormat) || FORMAT_DOCS[0]

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <div className="hidden md:block w-64 flex-shrink-0" style={{ borderRight: '1px solid rgba(0,0,0,0.04)', background: 'rgba(250, 249, 246, 0.6)' }}>
        <div className="sticky top-24 p-6">
          <div className="mb-5 text-center">
            <h2 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-background)' }}>引用格式</h2>
          </div>
          <nav className="flex flex-col gap-1.5">
            {FORMAT_DOCS.map(doc => (
              <button key={doc.id} onClick={() => setActiveFormat(doc.id)}
                className="glass-button w-full text-left px-4 py-3 rounded-xl text-sm"
                style={{
                  background: activeFormat === doc.id ? 'rgba(255,255,255,0.4)' : undefined,
                  color: activeFormat === doc.id ? 'var(--color-on-background)' : 'var(--color-outline)',
                  fontWeight: activeFormat === doc.id ? 700 : 500,
                }}>
                {doc.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 p-8 md:p-12">
        <div className="max-w-4xl mx-auto">
        <div className="animate-fade-in space-y-8" key={activeFormat}>
          <header>
            <div className="flex items-center gap-2 mb-2" style={{ color: 'var(--color-primary)' }}>
              <span className="material-symbols-outlined text-base">menu_book</span>
              <span className="text-sm font-bold tracking-tight">格式指南</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-headline)' }}>
              <span className="text-3xl md:text-5xl font-black tracking-tight" style={{ color: 'var(--color-on-background)' }}>{current.name}</span>
            </h1>
            <p className="mt-2 text-sm font-medium" style={{ color: 'var(--color-outline)' }}>{current.fullName}</p>
          </header>

          <p className="text-base leading-relaxed font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>{current.description}</p>

          {/* Dual System: side-by-side examples + in-text */}
          {current.dualSystem ? (
            <>
              <div className="space-y-3">
                <h3 className="text-xs font-bold tracking-widest" style={{ color: 'var(--color-outline)' }}>参考文献格式示例</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* System A */}
                  <div className="p-5 rounded-xl space-y-3" style={{ background: 'var(--color-surface-low)' }}>
                    <h4 className="text-sm font-bold" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-headline)' }}>
                      {current.dualSystem.nameA}
                    </h4>
                    {current.dualSystem.examplesA.map((ex, i) => (
                      <div key={i}>
                        <p className="text-[11px] font-bold mb-1" style={{ color: 'var(--color-on-surface-variant)' }}>{ex.label}</p>
                        <p className="text-sm leading-relaxed font-medium" style={{ color: 'var(--color-on-surface)', borderLeft: '3px solid var(--color-primary)', paddingLeft: '12px' }}>
                          {ex.text}
                        </p>
                      </div>
                    ))}
                  </div>
                  {/* System B */}
                  <div className="p-5 rounded-xl space-y-3" style={{ background: 'var(--color-surface-low)' }}>
                    <h4 className="text-sm font-bold" style={{ color: 'var(--color-secondary)', fontFamily: 'var(--font-headline)' }}>
                      {current.dualSystem.nameB}
                    </h4>
                    {current.dualSystem.examplesB.map((ex, i) => (
                      <div key={i}>
                        <p className="text-[11px] font-bold mb-1" style={{ color: 'var(--color-on-surface-variant)' }}>{ex.label}</p>
                        <p className="text-sm leading-relaxed font-medium" style={{ color: 'var(--color-on-surface)', borderLeft: '3px solid var(--color-secondary)', paddingLeft: '12px' }}>
                          {ex.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dual in-text citation */}
              {(current.dualSystem.inTextA || current.dualSystem.inTextB) && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold tracking-widest" style={{ color: 'var(--color-outline)' }}>文内引用规则</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {current.dualSystem.inTextA && (
                      <div className="p-5 rounded-xl space-y-2" style={{ background: 'var(--color-surface-low)' }}>
                        <h4 className="text-sm font-bold mb-2" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-headline)' }}>
                          {current.dualSystem.nameA}
                        </h4>
                        {current.dualSystem.inTextA.map((rule, i) => (
                          <p key={i} className="flex gap-2 text-sm font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>
                            <span className="shrink-0 w-5 h-5 flex items-center justify-center rounded text-[10px] font-black"
                              style={{ background: 'var(--color-primary-10)', color: 'var(--color-primary)' }}>{i + 1}</span>
                            <span className="leading-relaxed">{rule}</span>
                          </p>
                        ))}
                      </div>
                    )}
                    {current.dualSystem.inTextB && (
                      <div className="p-5 rounded-xl space-y-2" style={{ background: 'var(--color-surface-low)' }}>
                        <h4 className="text-sm font-bold mb-2" style={{ color: 'var(--color-secondary)', fontFamily: 'var(--font-headline)' }}>
                          {current.dualSystem.nameB}
                        </h4>
                        {current.dualSystem.inTextB.map((rule, i) => (
                          <p key={i} className="flex gap-2 text-sm font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>
                            <span className="shrink-0 w-5 h-5 flex items-center justify-center rounded text-[10px] font-black"
                              style={{ background: 'rgba(70, 99, 112, 0.1)', color: 'var(--color-secondary)' }}>{i + 1}</span>
                            <span className="leading-relaxed">{rule}</span>
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Single system examples */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold tracking-widest" style={{ color: 'var(--color-outline)' }}>格式示例</h3>
                {current.examples ? (
                  <div className="space-y-3">
                    {current.examples.map((ex, i) => (
                      <div key={i}>
                        <p className="text-xs font-bold mb-1.5" style={{ color: 'var(--color-primary)' }}>{ex.label}</p>
                        <div className="p-4 rounded-xl text-sm leading-relaxed font-medium"
                          style={{ background: 'var(--color-surface-low)', borderLeft: '3px solid var(--color-primary)', color: 'var(--color-on-surface)' }}>
                          {ex.text}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-5 rounded-xl text-sm leading-relaxed font-medium"
                    style={{ background: 'var(--color-surface-low)', borderLeft: '3px solid var(--color-primary)', color: 'var(--color-on-surface)' }}>
                    {current.example}
                  </div>
                )}
              </div>

              {/* Single system in-text citation */}
              {current.inTextCitation && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold tracking-widest" style={{ color: 'var(--color-outline)' }}>文内引用规则</h3>
                  <ul className="space-y-3">
                    {current.inTextCitation.map((rule, i) => (
                      <li key={i} className="flex gap-3 text-sm font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>
                        <span className="shrink-0 w-6 h-6 flex items-center justify-center rounded-lg text-xs font-black"
                          style={{ background: 'rgba(70, 99, 112, 0.1)', color: 'var(--color-secondary)' }}>{i + 1}</span>
                        <span className="leading-relaxed">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {/* Rules (always shown) */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold tracking-widest" style={{ color: 'var(--color-outline)' }}>核心规则</h3>
            <ul className="space-y-3">
              {current.rules.map((rule, i) => (
                <li key={i} className="flex gap-3 text-sm font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>
                  <span className="shrink-0 w-6 h-6 flex items-center justify-center rounded-lg text-xs font-black"
                    style={{ background: 'var(--color-primary-10)', color: 'var(--color-primary)' }}>{i + 1}</span>
                  <span className="leading-relaxed">{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Document links */}
          <div className="pt-6" style={{ borderTop: '1px solid var(--color-surface-high)' }}>
            {current.links ? (
              <div className="flex flex-wrap gap-4">
                {current.links.map((lnk, i) => (
                  <a key={i} href={lnk.url} target="_blank" rel="noopener noreferrer"
                    className="text-sm font-bold inline-flex items-center gap-2 transition-opacity hover:opacity-70"
                    style={{ color: 'var(--color-primary)' }}>
                    {lnk.label}
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                  </a>
                ))}
              </div>
            ) : (
              <a href={current.link} target="_blank" rel="noopener noreferrer"
                className="text-sm font-bold inline-flex items-center gap-2 transition-opacity hover:opacity-70"
                style={{ color: 'var(--color-primary)' }}>
                查看官方文档
                <span className="material-symbols-outlined text-sm">open_in_new</span>
              </a>
            )}
          </div>
        </div>
        </div>
      </main>
    </div>
  )
}
