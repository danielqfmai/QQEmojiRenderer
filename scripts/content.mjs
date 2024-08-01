(async function () {
// 导入 scripts/emoji.mjs
const emojiSrc = chrome.runtime.getURL("scripts/emoji.mjs");
const emoji = await import(emojiSrc);

// 要搜索的 class 列表
const searchClasses = ['message', 'am-comment-bd', 'marked', 'content'];

function iterateSubtree(callback, root, whatToShow, filter) {
	const walker = document.createTreeWalker(root, whatToShow, filter);
	while (walker.nextNode())
		callback(walker.currentNode);
}

function replaceText(s) {
	const arr = s.split('/');
	const isFilename = arr.map(a => /^[-\w\.\+\?&@#%~=:|]+$/.test(a));
//	console.log(isFilename);
	var res = '';
	var flg = false;
	for (var i in arr) {
		if (i >= 2 && arr[i - 1] == '' &&
			(/https?:$/.test(arr[i - 2])))
			flg = true;
		if (!isFilename[i])
			flg = false;
		var tmp = arr[i];
		if (i >= 1)
			tmp = '/' + tmp;
		if (!flg && i >= 1) {
			var j = 0;
			while (j < arr[i].length && /\w/.test(arr[i][j]))
				++j;
			const key = arr[i].substring(0, j);
			if (emoji.keys.includes(key)) {
				tmp = `<img src="${emoji.getURL(key)}">` +
					arr[i].substring(j);
			}
		}
		res += tmp;
	}
	return res;
}

// 替换 QQ 表情
function main(element) {
	if (!element) return;

	var replaceList = [];
	iterateSubtree(
		node => {
			iterateSubtree(
				textNode => {
					var s = textNode.textContent;
//		//			// 排除包含 "https://" 或 "http://" 的文本
//		//			if (s.includes('https://') || s.includes('http://'))
//		//				continue;
//					// 遍历表情列表
//					emoji.keys.forEach(key => {
//						const regex = new RegExp('/' + key, 'g');
//						s = s.replace(regex,
//							`<img src=${emoji.getURL(key)}>`);
//					});
					const template = document.createElement('template');
					template.innerHTML = replaceText(s);
					replaceList.push([textNode, template.content]);
				},
				node,
				NodeFilter.SHOW_TEXT
			);
		},
		element,
		NodeFilter.SHOW_ELEMENT,
		{ acceptNode : node => {
			// 只搜索指定 class 的节点
			if (node.classList &&
				searchClasses.some(className =>
					node.classList.contains(className)))
				return NodeFilter.FILTER_ACCEPT;
			return NodeFilter.FILTER_SKIP;
		} }
	);

	replaceList.forEach(r => r[0].replaceWith(r[1]));
}

// 初始页面替换
main(document.body);

// 监听 DOM 变化，实时替换表情
const observer = new MutationObserver(mutations =>
	mutations.forEach(mutation => {
		if (mutation.type === 'childList') {
			mutation.addedNodes.forEach(node => {
				if (node.nodeType === Node.ELEMENT_NODE)
					main(node);
			});
		}
	})
);

// 开始观察 DOM 变化
observer.observe(document.body, { childList: true, subtree: true });
})();
