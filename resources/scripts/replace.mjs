import emojiKeys from './emojiKeys.mjs';
import getImg from './getImg.mjs';

// 转义特殊字符
function escapeHTML(str) {
	var div = document.createElement('div');
	div.appendChild(document.createTextNode(str));
	return div.innerHTML;
}

// 遍历元素子树
function iterateSubtree(root, whatToShow, filter, callback) {
	const walker = document.createTreeWalker(root, whatToShow, filter);
	while (walker.nextNode())
		callback(walker.currentNode);
}

// 替换文本
function replaceText(s) {
	const arr = s.split('/');
	const isFilename = arr.map(a => /^[-\w\.\+\?&@#%~=:|]+$/.test(a));
	var res = '';
	var flg = false;
	for (var i in arr) {
		if (i >= 2 && arr[i - 1] == '' && (/https?:$/.test(arr[i - 2])))
			flg = true;
		if (!isFilename[i])
			flg = false;
		var tmp;
		if (i == 0)
			tmp = escapeHTML(arr[i]);
		else
			tmp = escapeHTML('/' + arr[i]);
		if (!flg && i >= 1) {
			var j = 0;
			while (j < arr[i].length && /\w/.test(arr[i][j]))
				++j;
			const key = arr[i].substring(0, j);
			if (emojiKeys.includes(key))
				tmp = getImg(key, true) +
					escapeHTML(arr[i].substring(j));
		}
		res += tmp;
	}
	return res;
}

// 过滤需要替换的元素
function filter(node) {
	if (window.location.host == 'www.luogu.com.cn' ||
			window.location.host == 'www.luogu.com') {
		const searchClasses =
			['message', 'am-comment-bd', 'marked', 'content'];
		if (node.classList && searchClasses.some(className =>
				node.classList.contains(className)))
			return NodeFilter.FILTER_ACCEPT;
		return NodeFilter.FILTER_SKIP;
	}
	return NodeFilter.FILTER_SKIP;
}

// 替换子树内的所有文本
function replaceSubtree(element) {
	if (!element) return;
	var replaceList = [];
	iterateSubtree(element, NodeFilter.SHOW_ELEMENT, filter, node =>
		iterateSubtree(node, NodeFilter.SHOW_TEXT, null, textNode => {
			var s = textNode.textContent;
			const template = document.createElement('template');
			template.innerHTML = replaceText(s);
			replaceList.push([textNode, template.content]);
		})
	);
	replaceList.forEach(r => r[0].replaceWith(r[1]));
}

replaceSubtree(document.body);
const observer = new MutationObserver(mutations =>
	mutations.forEach(mutation => {
		if (mutation.type === 'childList')
			mutation.addedNodes.forEach(node => {
				if (node.nodeType === Node.ELEMENT_NODE)
					replaceSubtree(node);
			});
	})
);
observer.observe(document.body, { childList: true, subtree: true });
