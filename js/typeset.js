/**** 截取分段 ****/
String.prototype.doSplit = function() {
	const str = '' + this;
	const bm = '\n';
	if (str.length < 1 || str.search(/^　　+/) > -1 || str.search(/^＊{5,}/) > -1) {
		return str + bm;
	}
	const vNum = config.Linenum, cutNum = vNum * 2;
	let linestr = '　　' + str;
	// 小于每行最大字数时直接返回
	if (cutNum >= linestr.len()) {
		return linestr + bm;
	}

	// 查询单字节总数
	const findEngStr = linestr.findCount(/[\x00-\xff]/g),
		// 如果全是单字节
		findAllEngStr = str.search(/^[\x00-\xff]+$/) > -1,
		text = [];

	let oNum = ~~(linestr.length / vNum) + 1;
	while (oNum--) {
		let sublen = 0, FirstLine = true, sinBytes, tmp, i;
		// 如果全是单字节
		if (findAllEngStr) {
			// 如果是首次截取
			if (FirstLine) {
				sublen = vNum - 2;
				FirstLine = false;
			} else sublen = vNum;
		}
		// 如果有英文
		else if (findEngStr > 0) {
			// 预分段
			tmp = linestr.slice(0, vNum);
			// 英文单字节数
			if (sinBytes = tmp.findCount(/[\x00-\xff]/g)) {
				// 预取补齐字符串，如果全是双字节
				if (linestr.slice(vNum, sinBytes).len() === sinBytes * 2) {
					sublen = ~~(sinBytes / 2);
				} else {
					// 预取英文半数
					sublen = Math.round(sinBytes / 2);
					i = sublen;
					while (i--) {
						sublen++;
						if (linestr.slice(0, vNum + sublen).len() > cutNum) {
							sublen--;
							break;
						}
					}
				}
			}
		}
		// 按修正后的字数截取字符串
		tmp = linestr
			.slice(0, vNum + sublen)
			// 防止行尾限制标点，放置到下行
			// 防止英文单词断行，放置到下行
			// ［〔【｛·‘『“「〈《
			//.replace(/[［〔【｛『「〈《]{1,2}$|\b\w+$/, function(m) {
			.replace(/[［〔【｛『「〈《]{1,2}$/, function(m) {
				linestr += m;
				return '';
			});

		// 剩下部分
		linestr = linestr
			.replace(tmp, '')
			// 判断并处理行首限制字符
			// 处理两个字符，因为经过整理过的标点只留两个
			// ，、。：；？！）］〕】｝·’』”」〉》
			.replace(/^[，、。：；？！）］〕】｝』」〉》…～—]{1,2}/, function(m) {
				tmp += m;
				return '';
			});

		text.push(tmp);
	}
	return text.join('\n').replace(/\n+$/, '') + bm;
}

// 分段排版
function onTypeSetSplit(str) {
	// 执行整理
	str = '\n' + str
		// 排版初始化，去空格空行
		.replaceInit()
		// 引号替换
		.convertCNQuote()
		.replace(/作者：.*?\n[\d\/]*[发發]表[于於]：.*?\n是否首[发發]：.*?\n字[数數]：.*?\n/gm, '')
		// 转换半角
		.convertNumberLetter()
		// 修正分隔符号
		.convertSeparator()
		// 分隔符居中
		.replace(('^' + config.Separator + '$').getReg('gm'), function(m) {
			return m.ChapterAlign('', '', 'center');
		})
		// 结尾居中
		.replace(('^[（【“「<]?(?:' + config.endStrs + ')[）】”」>]?$').getReg('gm'), function(m) {
			return m.ChapterAlign('', '', 'center');
		})
		// 书名居中
		.replace(/^《[^》]+》$/m, function(m) {
			return m.ChapterAlign('', '\n', 'center');
		})
		// 作者类居左
		.replace(config.novelAuthor, function(m) {
			return m.trim();
		})
		// 标题居中
		.convertChapter('', '', 'center')
		.mapLine(v => v.doSplit())
		.replace(/\n\n{3,}/g, '\n\n\n')
		.replaceEnd();

	if ( !$('#Check_AddTop').is(':checked') )
		return str;
	// 插入标头
	const headStr = ($('#chinese').html() !== '简') ?
		'作者：{$w}\n{$d}发表于：{$b}\n是否首发：{$y}\n字数：{$n} 字\n' :
		'作者：{$w}\n{$d}發表於：{$b}\n是否首發：{$y}\n字數：{$n} 字\n';
	return headStr.fmt({
		'w': $('#inputAuthor').val().trim() || ' ',
		'b': $('#inputSite').val().trim() || ' ',
		'y': $('#Check_0').is(':checked') ? '是' : '否',
		'd': new Intl.DateTimeFormat('zh-CN', {year: 'numeric', month: '2-digit', day: '2-digit'}).format(new Date()),
		'n': (str.length - str.findCount(/[　\s]/g)).toLocaleString()
	}) + '\n' + str;
}

// 阅读排版
function onTypeSetRead(str) {
	return str
		// 排版初始化，去空格空行
		.replaceInit()
		// 半角字母数字
		.convertNumberLetter()
		// 修正章节标题
		.convertChapter('\n\n', '', 'break')
		// 修正分隔符号
		.convertSeparator()
		// 修正作者后面未空行
		.replace(config.novelAuthor, '$1\n')
		.replace(/^/gm, '　　')
		.replace(/(^　　$\n)+/gm, '　　\n')
		.replace(/\n\n{2,}/g, '\n\n')
		.replace(/^\n{2,}/, '\n');
}

// 一键整理
function editorCleanUp(str) {
	// 排版初始化，去空格空行
	str = str.replaceInit();
	['HtmlEntity', 'Unicode', 'Variant', 'SerialNumber',
	'Punctuation', 'NumberLetter', 'Chapter', 'Space',
	'Separator', 'Quote', 'English'].forEach((v, i) => {
		if ($('#Check_' + (i + 1)).is(':checked')) {
			str = str.convert(v);
		}
	})
	// 结束
	return str.replaceEnd();
}

// 特殊整理
function editorCleanUpEx(str) {
	var safeStr = ['\n\u2620', '\u2620\n', '\u2620'],
		endStr = ('^[\\(（【〖“「［<](?:' + config.endStrs + ')[>］」”〗】）\\)]$').getReg('gm'),
		// 其他自定义修正
		Others = [
			[/([^。！？…”」\.\!\?\~\x22\x27\u2620；〗】]$)\n+([^\u2620])/gm, '$1$2'],
			[/([^。！？…”」\.\!\?\~\x22\x27\u2620；〗】]$)\n+([^\u2620])/gm, '$1$2'],
			[/^((?!第[\d一二三四五六七八九十百千]+|\u2620).+[“「][\u4E00-\u9FA5]+[”」]$)\n+/gm, '$1'],
			[/^([^\u2620]*[“「][^，。？！…~～\─]+[”」]$)\n+/gm, '$1'],
			[/…\n([^”]+”)$/gm, '…$1'],
			[/，”\n/g, '，”'],
			// 修正被分隔的标点符号
			[/…\n…/g, '……'],
			[/\n”/g, '”'],
			[/\n^“$/gm, '“'],
			[/\u2620/g, '\n'],
			// 文章中的书名换行
			[/(?=[^。！？…”：\.\!\?\~\x22\x27\u2620；〗】])\n《/g, '《'],
			[/第[\d一二三四五六七八九十百千]+章：/g, '\n$&'],
			// 其他修正
			[/：”/g, '：“'],
			[/(.$)\n+[）\)]([^，。…！？])/gm, '$1）\n$2']
		];

	str = str
		// 排版初始化，去空格空行
		.replaceInit()
		// 去除汉字间的空格
		.convertSpace()
		// 保护无结尾标点的歌词类
		.replace(/(?:^[\u4E00-\u9FA5]+[^，：;。…！？:;\,\.\!\?]\n){3,16}/gm, function(m) {
			return safeStr[0] + m.replace(/\n/g, safeStr[1]) + safeStr[1];
		})
		// 修正章节外加括号
		//.replace('^{$t80}({$e}|$)$'.chapReg(), '$1：$2')
		//.replace('^{$t81}({$s}|{$s}{$e}|$)$'.chapReg(), '$1：$2')
		// 修正章节最后是句号的
		.replace('章[节節]$'.chapReg(), '章')
		.replace('^({$t91}[{$c.2}]{$sn}.{$en})。$'.chapReg(), '$1')
		// 修正章节前面是 `正文` 的
		.replace('^正文 *({$t91}[{$crt}]{$sn}.{$en})$'.chapReg(), '$1')
		// 修正章节标题，加标题保护码
		.convertChapter(safeStr[0], safeStr[1])
		// 修正引号
		.convertQuote()
		// 其他自定义修正
		.replaces(Others)
		.replace(endStr, '');

	return editorCleanUp(str);
}
