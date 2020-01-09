﻿/**
* typesetting for EverEdit
* 注意：本文件需保存为UTF-8 BOM格式
*/
/****** 常用 - 正则设定 ******/
var strCommon = {
	// 英文间隔符
	'enSep': '\\u0027`＇‘’『』',
	// 中文
	'han': '\\u4e00-\\u9fa0',
	// 所有拉丁字母，除去英文
	'latin': '\u00aa\u00ba\u00c0-\u0183\u0186-\u01a6\u01a9-\u01b9\u01ba\u01bf\u01c4-\u01c6\u01c9-\u020b\u0210-\u0240\u0243-\u0293\u0299-\u029f\u02a0\u02a3-\u02ac\u02ae-\u02af\u02b1-\u02b8\u02e0-\u02e3\u036a\u0391-\u03c9\u0401-\u0451\u1d00-\u1dbf\u1e00-\u1eff\u207f\u2090-\u2099\u209c\u211e\u2c60-\u2c7f\ua726-\ua729\ua730-\ua767\ua771-\ua7b7\ua7fb-\ua7ff\uab30-\uab5f\ufb00-\ufb04',
	// 半角标点，无引号
	'hwPun': '\\u0022\\u0021\\u0023-\\u0026\\u0028-\\u002F\\u003A-\\u0040\\u005B-\\u0060\\u007B-\\u007E\\u00A1-\\u00BF',
	// 半角标点，引号
	'qhwPun': "\\u0027",
	// 全角标点，无引号
	'fwPun': '·・–—…、。〈〉《》【】〔〕〖〗〝〞（），．：；？！～￠-￥＆＠＃※',
	// 全角标点，引号
	'qfwPun': '‘’“”「」『』',
	// 称谓单词前缀 或 缩拼
	'honorWord': 'Mrs?|Ms|Doc|Dr|Jr|Rev|Hon|Mmes?|Esq|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sept|Oct|Nov|Dec',
	// 特殊的连续单词 转大写
	'continuouWord': 'aa+|bb+|cc+|dd+|ee+|ff+|gg+|hh+|ii+|jj+|kk+|ll+|mm+|nn+|oo+|pp+|qq+|rr+|ss+|tt+|uu+|vv+|ww+|xx+|yy+|zz+|abcd?e?f?g?|xyz'
}

/****** 标题 - 正则设定 ******/
var strChapter = {
	'space': Space,
	'sep': ' 　，、．·。：—\\.\\,\\:\\-\\|',
	'c': ['卷部', '集篇阙季册闕冊', '章折回话节幕節話'],
	'cf': '[折卷章]',
	's0': '[上中下续终續終]',
	's1': '[0-9０-９零一二三四五六七八九十]',
	'n1': '[0-9０-９]{1,4}',
	'n2': '[0-9０-９]{1,4}(?:[-—.][0-9０-９]{1,4})?',
	'n3': '[0０○〇零一二三四五六七八九十百千壹贰叁肆伍陆柒捌玖拾佰仟两廿卅卌貳叄陸兩]{1,7}',
	'n4': '(?:最?[初前后终尾後終]|[上中下续断續斷])',
	'w0': '(?:[简簡]介|介[绍紹]|[预預]告|自介)'
}

// 标题正则
var regChapter = __fmts({
	// 标题无用的外框
	'b': ['〖【\\[', '\\]】〗'],
	// 标题行首空格 regStart
	'f': '[{$space}]*',
	// 标题间隔符（严格限定）regSeparator
	's': '[{$sep}]{1,4}',
	// 标题间隔符 regSeparatorNull
	'sn': '[{$sep}]{0,4}',
	// 行尾 regEnd
	'e': '.{0,40}[^。：;；\\n]',
	// 行尾（严格限定） regStrictEnd ’”』」
	'es': '.{0,40}[^，。：;；、…？！’”』」?!\\n]',
	/****** 非常规标题·无后续主体 ******/
	't0': '[首小节自次節]序|[题題][注记註記跋]|[题題开開][卷篇头场頭場][诗词语詩詞語]|文案|卷[首后後][语語]|(?:作者)?前言|[全本下][{$c.0}{$c.1}]{$w0}|(?:作品|作者|人物|内容)?{$w0}|篇[后後]|(?:完本|作者)感言|作者的[话話]',
	/****** 非常规标题·可有后续主体 ******/
	't1': [
		'楔子|引[言子]|序篇?章|序[言幕目曲传傳卷]?|[后後][记话記話序]|尾[声记聲記]|[附目][录錄][0-9]{0,2}|正文',
		'同人[续續]?|[前后外里续後裏續间間][番传篇傳章]|[续續]{$s1}{1,3}[{$c.2}]?|[番篇]外[篇卷]?{$s1}{0,3}',
		'外{$s1}{0,3}[{$c.2}]'
	],
	/****** 01章/第02章/第02-18章/03章：标题/第０９章：标题 ******/
	/****** 一章/第一章/一章：标题/第一章：标题 ******/
	/****** 终卷/终章 ******/
	't2': '((?:第?{$n2}|第?{$n3}|{$n4})[{$c}])',
	/****** （01）/（02）标题/（一）/（一）标题 ******/
	't3': '([\\(（](?:{$n2}|{$n3})[\\)）])',
	
	/****** 卷一/卷一：标题 ******/
	't4': '({$cf})({$n2}|{$n3})',
	/****** chapter 22 ******/
	't5': '(?:chapter|chap|ch|part|☆|★|○|●|◎|◇|◆|□|■|△|▲|※|＃)[ \\.]*(\\d+)',
	/****** 01/01./01.标题/一/一、标题 ******/
	't6': '({$n2}|{$n3})',
	/****** 其他标题 ******/
	// 修正括号类标题（一） --> 第一章
	't80': '[\\[\\(（〖【〈［]({$n2}|{$n3})[\\]\\)）〗】〉］]',
	// 松散标题
	't90': '(?:第?{$n2}|第?{$n3}|{$n4})',
	// 严格标题
	't91': '(?:第{$n2}|第{$n3}|{$n4})'
}, strChapter)

var configs = {
	/****** 标题忽略 - 正则设定 ******/
	regSkipTitle: {
		//'t0': /[。…—！？][」”]$/,
		't0': /[。—]$/,
		't1': /^(?:序[长词战兴常稿歌秩次传述長詞戰興傳]|[上下]回|[\-—]{1,4}|断章取义)/,
		't2': /^第?[0-9０-９零一二三四五六七八九十百两]{1,9}(?:部[分]|季[度]|篇[篇文]|幕[幕]|话[没不沒]|回[生首头合家頭閤]|[部集](戏|戲|电[影视視])|部好莱坞)/,
		't6': [
			// 忽略日期格式 2010.10.10, 17.10.10, 17/10/10
			/([\d０-９]{2,4})[\.\-\/。\—][\d０-９]{1,2}[\.\-\/。\—][\d０-９]{1,2}/,
			// 忽略日期格式 2010年10月10日, 五时十二分
			/^[\d０-９一二三四五六七八九十]{1,4}[年月日点时分秒點時]([\d０-９一二三四五六七八九十]|$)/,
			// 忽略时间格式 20:22:21
			/^[\d０-９]{1,2}[\:：][\d０-９]{1,2}[\:：][\d０-９]{1,2}/,
			// 其他不规则格式 100%, 60°
			/^[\d０-９]{1,6}[\%％‰℃°]$/,
			// 比分类格式 3:0
			/^[\d０-９]{1,2}[\:：][\d０-９]{1,2}/,
			// 10元！20。
			/^([\d０-９一二三四五六七八九十百千万]{1,12})(元|块|次|多)?([！？。…]){1,3}$/,
			// 2.3亿
			/^([\d０-９\.\-\—\至]{1,12})([百千万亿])/,
			// 排比数字 一、二、三……
			/([、，：][0-9二三四五六七八九十]{1,6})+([！？。…]){1,3}$/,
			// 排比数字 1、2、3……
			/^[0-9]{1,3}[、，：][0-9]{1,3}/
		]
	},
	/****** 英文处理 - 正则设定 ******/
	// 英文间单引号样式
	//'enSep': '(?=[a-z])[{$enSep}]|[{$enSep}](?=[ a-z])'.fmtReg(strCommon, 'gi'),
	'enSepF': '([a-z])[{$enSep}]'.fmtReg(strCommon, 'gi'),
	'enSepE': '[{$enSep}](?=[ a-z])'.fmtReg(strCommon, 'gi'),
	'enSep': '([a-z])[{$enSep}]|[{$enSep}]([ a-z])'.fmtReg(strCommon, 'gi'),
	// 英文间单引号样式替换
	'enSepQ': '\\b([a-z]+)[{$enSep}]( |[a-z]+\\b)'.fmtReg(strCommon, 'gi'),
	// 汉字间空格
	'hanSpace': ' +(?=[{$han}{$fwPun}{$qfwPun}])'.fmtReg(strCommon),
	// 英文间空格
	'engSpace': '([{$han}{$fwPun}{$qfwPun}]) +(?=[0-9a-zA-Z])'.fmtReg(strCommon),
	// 英文单独一行
	'findEngLine': '^[\\w {$hwPun}{$qhwPun}{$fwPun}{$qfwPun}]{2,}$'.fmtReg(strCommon, 'gm'),
	'findEngLineSkip': '[\\d {$hwPun}{$qhwPun}{$fwPun}{$qfwPun}]'.fmtReg(strCommon),
	// 引用中的英文
	'findEngQuote': '[（〈《【〔〖“‘「『]([\\w {$hwPun}{$qhwPun}{$fwPun}]{2,})[』」’”〗〕】》〉）]'.fmtReg(strCommon, 'gm'),
	'findEngQuoteTest': '[，。！？]'.fmtReg(strCommon),
	// 称谓单词前缀
	'honorWord': '\\b({$honorWord})。(?!$)'.fmtReg(strCommon, 'gmi'),
	// 括号中的英文
	'findEngBracket': /[（〈《【〔〖][a-z ]+[〗〕】》〉）]/gi,
	// 网址
	'findUrl': /(?:[0-9a-z]+[。\.])?[\w—\-]+[。\.](?:com|net|org|gov)/gi,
	// 特殊的连续单词 转大写
	'continuouWord': '\\b(?:{$continuouWord})\\b'.fmtReg(strCommon, 'gi'),
	// 所有除英文外的拉丁字母
	'findLatin': '[{$latin}][a-z]'.fmtReg(strCommon, 'gi'),
	
	/***** 用户部分 *****/
	// 分隔符样式
	'Separator': '＊＊＊　　＊＊＊　　＊＊＊',
	// 排版输出时的分隔符样式
	'outSeparator': '＊＊＊　　＊＊＊　　＊＊＊',
	// 章节与标题分隔符
	'Divide': '：',
	// 排版输出时的章节与标题分隔符
	'outDivide': '：',
	// 排版时每行最大字数（按双字节计算）
	'Linenum': 35,
	// 段落最大字数换行
	'maxLinenum': 200,
	// 约定英语，用|分隔
	'pWord': 'SexInSex|iPhone|iPhoneSE|iPhoneX|iPhoneXR|iPhoneXRMax|iPhoneXR|iPad|iPadPro|iPadAir|iMac|iTv|iPod|ing|BiuBiu',
	// 约定英语大写，用|分隔
	'pWordUpper': 'SIS|OMG|MTV|SUV|TV|ID|CIA|FBI|VIP|CEO|CFO|CTO|COO|CIO|OA|PC|OEM|SOS|SOHO|PS|ISO|APEC|WTO|USA|GPS|GSM|NASDAQ|MBA|ATM|GDP|AIDS|CD|VCD|DVD|CDMA|DIY|EMS|EQ|IQ|PDA|DJ|SARS|DNA|RNA|UFO|AV|WTF|TMD|IC|SM|TM|OK|NTR|QQ|DP|KTV|OL|PK|NDE|XXOO|OOXX|PM|CAA|CNN|CBS|BBS|ICM|IMAX|AMC|DC|NG|ABC|VS|SPA|VR|AR|ICU|IPO|IMDB|SWAT|IPTV|GPA|UI|LOL|IP|PVP|PVE|BBC|CCTV|TVB|NHK|PPT|NBC|NBA|ESPN|SEGA',
	// 结尾的标识语，用于排版输出时居中，用|分隔
	'endStrs': '待续|未完|未完待续|完|完结|全文完|全书完|待續|未完待續|完結|全書完',
	/***** 广告插入部分 *****/
	// 多少字数插入（文字）
	'insert_word_len': 500,
	// 多少字数插入（段落）
	'insert_line_len': 1000,
	// 插入的广告字符
	'insert_ads': [],
	/***** 标头插入部分 *****/
	'insert_header': {
		// 作者
		'writer': '张三',
		// 论坛
		'bbsname': 'SIS论坛',
		// 是否首发
		'yesno': '是'
	},
	/***** 自定义广告部分 *****/
	'ads_user': [],
	/****** 文章标题 - 正则设定 ******/
	'novelTitle': /^[ 　]*(《([^》]+)》(.*[^。？！…]|$)|[书書]名[：\:](.+))$/m,
	'novelAuthor': /^[ 　]*(([作编译編譯]者|排版|整理)[：\:](.*))$/gm,
	// 全角数字标题
	regSBCNumberTitle: '[第\\(（][０-９]{1,9}[{$c}\\)）]'.fmtReg(strChapter),
	// 半角标点符号
	halfSymbol: [
		[/[‘’『』]/g, '\''],
		[/[“”「」]/g, ' \u0022 '],
		[/[。]/g, '.'],
		[/[，\,](?=[a-z0-9])/gi, ', '],
		[/[，\,]/gi, ','],
		[/[：:]/g, ': '],
		[/[；;]/g, '; '],
		[/[？\?]/g, '? '],
		[/[！\!]/g, '! '],
		[/[–\—\-─－]/g, '-'],
		[/[（\(]/g, ' ('],
		[/[）\)]/g, ') '],
		[/[＆&]/g, ' & '],
		// fix
		//[/([^\d])[。\.]/g, '$1. '],
		[/\" *([^"]*[…,.!?~]) *\" */g, ' "$1" '],
		[/\" *([^"]*) *\"/g, '"$1"'],
		[/ +\" +/g, '" '],
		[/ +(?=[…\!\?\.])/g, ''],
		[/([\.\?\!]) *(?=[》】'"])/g, '$1'],
		[/([A-Z]) *& *(?=[A-Z])/g, '$1&'],
		[/\. *(?=[》】'"])/g, '.'],
		[/\.(?=[a-z])/gi, '. '],
		[/(\w)……/g, '$1...'],
		[/  +/g, ' ']
	],
	// 法式引号 fr：'‘’“”'
	// 中式引号 cn：'『』「」'
	cnQuotes: ['‘’“”', '『』「」'],
	frQuotes: ['『』「」', '‘’“”'],
	// 引号修正
	rQuotes: [
		//[this.enSep, '※@※'],
		//['[{$enSep}]([a-z])'.fmtReg(strCommon, 'gi'), '※@※$1'],
		// 修正单引号
		[/[`＇‘’『』]/g, '\''],
		[/'([^\'\n]+)'/g, '‘$1’'],
		[/^([ 　]*)'/gm, '$1‘'],
		[/'/g, '’'],
		[/’([^‘’]+)’/g, '’$1‘'],
		[/^([ 　]*)’/gm, '$1‘'],
		//[/‘$/g, '’'],
		[/：’/g, '：‘'],
		//[/※@※([a-z]+)※@※/gi, '‘$1’'],
		//[/※@※/g, '\''],
		// 修正双引号
		// \[\]
		[/[〝〞［］＂″｢｣“”「」]/g, '\"'],
		[/"([^\"\n]+)"/g, '“$1”'],
		[/^([ 　]*)"/gm, '$1“'],
		[/"/g, '”'],
		[/”([^“”]+)”/g, '”$1“'],
		[/^([ 　]*)”/gm, '$1“'],
		//[/“$/g, '”'],
		[/：”/g, '：“']
	],
	// 修正分隔符
	// !@!@!@!@! 注释符
	// @@@@ 分隔符
	rSeparator: [
		// 注释标记※
		[/＊{35,}/g, '\n!@!@!@!@!\n'],
		// 处理分隔符
		[/[ ]+(?=[＊#＃§☆★○●◎◇◆□■△▲※〓＝﹡＋@\*×\—\-\+－─=~～])/g, ''],
		[/[☆★`&]{5,}/g, '@@@@'],
		[/[#＃§○●◎◇◆□■△▲※〓＝﹡＋@]{3,}/g, '@@@@'],
		// 星号特殊处理
		[/([。！？…—”」’』])[*＊×xX]{4,}/gm, '$1\n@@@@\n'],
		//[/[`＊&×xX]{5,}/g, '@@@@'],
		[/^[＊×]{3,}/gm, '@@@@'],
		[/^\*{4,}/gm, '@@@@'],
		[/\*{4,}$/gm, '@@@@'],
		[/^[\—\-－─=\+]{4,}/gm, '@@@@'],
		[/[\—\-－─=\+]{4,}$/gm, '@@@@'],
		[/^.*分割线$/gm, '@@@@'],
		[/^[—]*分割线[—]{2,}$/gm, '@@@@'],
		[/^[\—\-－─=~～\+]{2,}$/gm, '@@@@'],
		[/^\*\*{2,}$/gm, '@@@@'],
		// 修正车牌号
		[/([a-z])[\-—]@@@@/gi, '$1-XXXXX'],
		// 修正数字和某些标点后的*号
		[/([\w：，；]$)\n?@@@@\n?/gm, '$1****'],
		[/@@@@\n?([，。！？…’”』」])/gm, '****$1'],
		[/\n*@@@@\n*/gm, '\n@@@@\n'],
		[/(^@@@@$\n+)+/gm, '@@@@\n'],
		// 还原注释标记
		[/!@!@!@!@!/g, '＊'.times(35)]
	],
	/****** 其他替换设定 ******/
	// 变体字母
	sVariants: [
		'ÀÁÂÃÄÅĀАǍⱭàáâãäåāǎɑаßЬЪьъÇçÐÈÉÊËĒĚèéêëēěΗんÌÍÎÏĪǏΙìíîïīǐιМмΝÑŃŇИñńňиηÒÓÔÕÖŌǑØОòóôõöōðǒøоÞΡþρΤτÙÚÛÜŪǓǕǗǙǛυùúûüūǔǖǘǚǜⅤⅴνЩщωΥÝŸγýÿ',
		'AAAAAAAAAaaaaaaaaaaaBbbbbCcDEEEEEEeeeeeeHhIIIIIIIiiiiiiiMmmNNNNNnnnnnOOOOOOOOOooooooooooPPppTtUUUUUUUUUUuuuuuuuuuuuVvvWwwYYYyyy'
	],
	// 变体序号
	sSerialNumber: [
		'⓪⓿⒈①➀⓵➊❶⑴⒉②⓶➁➋❷⑵⒊③⓷➂➌❸⑶⒋④⓸➃➍❹⑷⒌⑤⓹➄➎❺⑸⒍⓺⑥➅➏❻⑹⒎⓻⑦➆➐❼⑺⒏⓼⑧➇➑❽⑻⒐⑨➈⓽➒❾⑼⒑⑩➉⓾➓❿⑽⒒⑪⑾⒓⑫⑿⒔⑬⒀⒕⑭⒁⒖⑮⒂⒗⑯⒃⒘⑰⒄⒙⑱⒅⒚⑲⒆⒛⑳⒇㊀㊁㊂㊃㊄㊅㊆㊇㊈㊉㈠㈡㈢㈣㈤㈥㈦㈧㈨㈩',
		'00|00|01|01|01|01|01|01|01|02|02|02|02|02|02|02|03|03|03|03|03|03|03|04|04|04|04|04|04|04|05|05|05|05|05|05|05|06|06|06|06|06|06|06|07|07|07|07|07|07|07|08|08|08|08|08|08|08|09|09|09|09|09|09|09|10|10|10|10|10|10|10|11|11|11|12|12|12|13|13|13|14|14|14|15|15|15|16|16|16|17|17|17|18|18|18|19|19|19|20|20|20|一|二|三|四|五|六|七|八|九|十|一|二|三|四|五|六|七|八|九|十'
	],
	// HTML 字符实体
	regHtmlEntity: /[&＆] ?[a-z]{2,7}[;；]/gi,
	sHtmlEntity : {
		// 带有实体名称的 ASCII 实体
		'quot': '"', 'apos': "'", 'amp': '&', 'lt': '<', 'gt': '>',
		// ISO 8859-1 符号实体
		'nbsp': ' ', 'shy': '', 'copy': '©', 'reg': '®', 'trade': '™',
		'yen': '¥', 'cent': '¢', 'pound': '£', 'times': '×', 'divide': '÷',
		// 特殊转义字符
		'iexcl': '¡', 'curren': '¤', 'brvbar': '¦', 'sect': '§', 'uml': '¨',
		'ordf': 'ª', 'laquo': '«', 'not': '¬', 'macr': '¯', 'deg': '°',
		'plusmn': '±', 'sup1': '¹', 'sup2': '²', 'sup3': '³', 'acute': '´',
		'micro': 'µ', 'para': '¶', 'middot': '·', 'cedil': '¸', 'ordm': 'º',
		'raquo': '»', 'frac14': '¼', 'frac12': '½', 'frac34': '¾', 'iquest': '¿',
		// ISO 8859-1 字符实体
		'agrave': 'à', 'aacute': 'á', 'acirc': 'â', 'atilde': 'ã', 'auml': 'ä', 'aring': 'å', 'aelig': 'æ',
		'Agrave': 'À', 'Aacute': 'Á', 'Acirc': 'Â', 'Atilde': 'Ã', 'Auml': 'Ä', 'Aring': 'Å', 'AElig': 'Æ',
		'THORN': 'Þ', 'thorn': 'þ', 'szlig': 'ß',
		'ccedil': 'ç','Ccedil': 'Ç', 
		'ETH': 'Ð',
		'egrave': 'è', 'eacute': 'é', 'ecirc': 'ê', 'euml': 'ë',
		'Egrave': 'È', 'Eacute': 'É', 'Ecirc': 'Ê', 'Euml': 'Ë',
		'igrave': 'ì', 'iacute': 'í', 'icirc': 'î', 'iuml': 'ï',
		'Igrave': 'Ì', 'Iacute': 'Í', 'Icirc': 'Î', 'Iuml': 'Ï',
		'ntilde': 'ñ', 'Ntilde': 'Ñ',
		'eth': 'ð', 'ograve': 'ò', 'oacute': 'ó', 'ocirc': 'ô', 'otilde': 'õ', 'ouml': 'ö', 'oslash': 'ø',
		'Ograve': 'Ò', 'Oacute': 'Ó', 'Ocirc': 'Ô', 'Otilde': 'Õ', 'Ouml': 'Ö', 'Oslash': 'Ø',
		'ugrave': 'ù', 'uacute': 'ú', 'ucirc': 'û', 'uuml': 'ü',
		'Ugrave': 'Ù', 'Uacute': 'Ú', 'Ucirc': 'Û', 'Uuml': 'Ü',
		'yacute': 'ý', 'yuml': 'ÿ', 'Yacute': 'Ý'
	},
	// 异体标点
	// 角分′
	// 角秒″
	// 连接符–
	// 圆点．
	// 省略号⋯ \u2026
	// 间隔号•、●、・
	punSymbol: [
		// 按键盘顺序 ﹏﹋﹌ˇ
		'｀‐━―─－ーˉ﹣﹦~﹗!﹫＠﹟＃﹩＄﹪％﹠＆﹡(﹙﹚)﹐,.．﹒∶﹕︰:﹔;﹑﹖?⋯┅¨▪•‧●・︳﹛{﹜}〝｢″〃｣‴﹤﹥︿﹀﹢＋／︱¦＂′＇',
		'`———————－＝～！！@@##$$%%&&＊（（）），，。。。：：：：；；、？？………·····〉｛｛｝｝““””””＜＞∧∨++/\u007c\u007c\u0022\u0027\u0027'
	],
	// 标点符号修正
	amendSymbols: [
		[/\-/g, '—'],
		// 中文破折号 ──
		//[/([\u4e00-\u9fa0])——+/g, '$1──'],
		//[/——+([\u4e00-\u9fa0])/g, '──$1'],
		// 连接号 — —— ～
		//[/\﹝/g, '［'], // 左方括号
		//[/\﹞/g, '］'], // 右方括号
		// 两个标点以上留一 「」『』“”‘’
		[/——+/g, '——'],
		[/：：+/g, '：'],
		[/，，+/g, '，'],
		[/；；+/g, '；'],
		[/（（+/g, '（'],
		[/））+/g, '）'],
		[/［［+/g, '［'],
		[/］］+/g, '］'],
		[/｛｛+/g, '｛'],
		[/｝｝+/g, '｝'],
		[/%%+/g, '%'],
		[/∧∧+/g, '∧'],
		[/∨∨+/g, '∨'],
		[/〈〈+/g, '〈'],
		[/〉〉+/g, '〉'],
		// 波折号处理
		[/～～+/g, '～～'],
		[/。～～$/gm, '。\n～～'],
		[/？～～$/gm, '？\n～～'],
		[/！～～$/gm, '！\n～～'],
		[/”～～$/gm, '”\n～～'],
		[/」～～$/gm, '」\n～～'],
		[/…～～$/gm, '…\n～～'],
		// 省略号处理
		//[/[·、，`°]{2,}/g, '…'],
		[/··+/g, '…'],
		[/、、+/g, '…'],
		[/，，+/g, '…'],
		[/``+/g, '…'],
		[/°°+/g, '…'],
		[/。…/g, '…'],
		[/…[。，`\—]+/g, '…'],
		[/。。+/g, '…'],
		[/…{1,}/g, '……'],
		[/^……\n……$/gm, '……'],
		// 去错误和相联标点
		//[/。[，。]/g, '。'],
		//[/，。/g, '。'],
		[/“：/g, '：“'],
		[/：“”/g, '：“'],
		[/：「」/g, '：「'],
		//[/([…。，！？])”，/g, '$1”'],
		[/…”[，。！？]/g, '…”'],
		[/。”[，。！？]/g, '。”'],
		[/，”[，。！？]/g, '，”'],
		[/！”[，。！？]/g, '！”'],
		[/？”[，。！？]/g, '？”'],
		//[/([…。，！？])」，/g, '$1」'],
		[/…」[，。！？]/g, '…」'],
		[/。」[，。！？]/g, '。」'],
		[/，」[，。！？]/g, '，」'],
		[/！」[，。！？]/g, '！」'],
		[/？」[，。！？]/g, '？」'],
		[/：[·`]/g, '：'],
		//[/([：、，])[；：、？！]/g, '$1'],
		[/、[；：？！]/g, '、'],
		[/：[；：、？！]/g, '：'],
		[/，[；：、？！]/g, '，'],
		// 修正问号和感叹号
		[/？！[？！]+/g, '？！'],
		[/！？[？！]+/g, '？！'],
		[/！！？+/g, '？！'],
		[/？？！+/g, '？！'],
		[/！！{2,}/g, '！！！'],
		[/？？{2,}/g, '？？？']
	],
	// 修正所有数字和英文字母间的标点和空格·
	nwSymbol: [
		// 修正数字间的全角
		[/(\d)[。·] ?(?=\d)/g, '$1.'],
		[/(\d)\. (?=\d)/g, '$1.'],
		[/(\d)：(?=\d)/g, '$1:'],
		[/(\d)〉(?=\d)/g, '$1>'],
		[/(\d)〈(?=\d)/g, '$1<'],
		[/(\d)＝(?=\d)/g, '$1='],
		[/(\d)＊(?=\d)/g, '$1*'],
		[/(?:\d{1,3}[,，]){1,3}\d{1,3}(?:[。\.]\d{1,3})?(?:[韩美日]?元|英镑|港币|新?台币|法郎|比索|人)/g, function(m){
			return m.replace(/，/g, ',')
		}],
		// 时间 00:00:05，150
		[/(\d{1,2}[:：]\d{1,2}[:：]\d{1,2})，(?=\d{1,4})/g, '$1,'],
		// 2018年9月6日4:11PM
		[/(\d{1,2}日) *(\d{1,2}[\u003A：]\d{1,2}) *(AM|PM)/gi, '$1 $2$3'],
		[/ (\d{1,2}\:\d{1,2}(AM|PM))(?=[^。，\n])/gi, ' $1\n'],
		// 英文连接符–，暂弃用
		//[/([^-—～─])[-—～─]([\d\.a-z]+)/gi, '$1-$2'],
		[/[-—～─](?=[\d\.a-z]+)/gi, '-'],
		[/[-—～─]{2,}(?=[\d\.a-z]+)/gi, '——'],
		//[/([\d\.a-z]+)[-—～─]([^-—～─])/gi, '$1-$2'],
		[/(?=[\d\.a-z]+)[-—～─]/gi, '-'],
		[/(?=[\d\.a-z]+)[-—～─]{2}/gi, '——'],
		// 处理 Sid·Meier -> Sid Meier
		[/([a-z]{2,})·(?=[a-z]{2,})/gi, '$1 '],
		// 处理 Up / Down -> Up/Down
		[/ *\/ *(?=[a-z]+)/gi, '/'],
		// 处理 No。1 -> NO.1
		[/\bno[。\.](?=\d{1,2})/gi, 'NO.'],
		// 处理 E。T。 -> E.T.
		[/\b([a-z])。(\b[a-z]|。)/gi, '$1.$2'],
		// 处理单字间空格 K a r -> Kar
		[/\b(?:[a-z] ){2,}/gi, function(m) {
			return m.replace(/ /g, '')
		}]
	],
	rEnd: [
		// 纬度/时间 11’44”
		[/(\d{1,2}(?:\.\d{1,2})?)[‘’『』\'] *(\d{1,2}(?:\.\d{1,2})?)(?:[“”「」\"]|[‘’『』\']{2})/g, '$1\'$2"'],
		[/(\d{1,2}(?:\.\d{1,2})?)[‘’『』\']{2}/g, '$1"'],
		[/° *(\d{1,2}(?:\.\d{1,2})?)[‘’『』\']/g, '°$1\''],
		// 修正箭头
		[/ *[—\-]{1,2}> */g, ' --> '],
		[/ *[＝=]{1,2}> */g, ' => '],
		// 公司简称
		[/ ?co[。\.][，\,]? ?ltd[。\.]?/gi, ' Co.,Ltd.'],
		// 处理特殊情况
		[/[。\.](avi|jpg|bmp|png|com|net|org|gov|edu|ac|uk|ru|cn|jp)\b/gi, function(m, m1) {
			return '.' + m1.toLowerCase()
		}]
	]
}
