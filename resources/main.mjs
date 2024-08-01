// 相对于自己的路径
import * as emoji from "./emoji.mjs";

function iterateSubtree(callback, root, whatToShow, filter) {
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

// 替换子树内的所有文本
function replaceSubtree(element, filter) {
	if (!element) return;
	var replaceList = [];
	iterateSubtree(
		node => {
//			console.log(node);
			iterateSubtree(
				textNode => {
					var s = textNode.textContent;
					const template =
						document.createElement('template');
					template.innerHTML = replaceText(s);
					replaceList.push(
						[textNode, template.content]);
				},
				node,
				NodeFilter.SHOW_TEXT
			);
		},
		element,
		NodeFilter.SHOW_ELEMENT,
		filter
	);
	replaceList.forEach(r => r[0].replaceWith(r[1]));
}

var div;

function handle(e) {
	var divParent = div.parentNode;
	var p;
	if (e.target)
		p = e.target.parentNode;
	if (divParent && divParent != p) {
		divParent.removeChild(div);
		divParent = undefined;
	}
	if (!e.target) { // || e.target.tagName.toLowerCase() != 'textarea') {
		return;
	}
	if (divParent)
		p.insertBefore(div, e.target);
	if (e.target.selectionStart == e.target.selectionEnd) {
		console.log(1);
		const i = e.target.selectionStart;
		const s = e.target.value;
		var j = i - 1;
		while (j >= 0 && /\w/.test(s[j]))
			--j;
		if (j < 0 || s[j] != '/') return;
		var k = i;
		while (k < s.length && /\w/.test(s[k]))
			++k;
		console.log(s.substring(j, k));
	}
//	const s = window.getSelection();
//	const r = s.getRangeAt(0).cloneRange();
//	const span = document.createElement('span');
//	span.appendChild(document.createTextNode("\u200b"));
//	r.insertNode(span);
//	const rect = span.getClientRects()[0];
//	console.log(rect);
//	div.style['top' ] = rect.top  + 'px';
//	div.style['left'] = rect.left + 'px';
//	const spanParent = span.parentNode;
//	spanParent.removeChild(span);
//	spanParent.normalize();
}

export function main(filter) {
	replaceSubtree(document.body, filter);
	const observer = new MutationObserver(mutations =>
		mutations.forEach(mutation => {
			if (mutation.type === 'childList') {
				mutation.addedNodes.forEach(node => {
					if (node.nodeType === Node.ELEMENT_NODE)
						replaceSubtree(node, filter);
				});
			}
		})
	);
	observer.observe(document.body, { childList: true, subtree: true });

	const link = document.createElement('link');
	link.rel = 'stylesheet';
	link.type = 'text/css';
	link.href = chrome.runtime.getURL('resources/emojiCompletion.css');
	document.head.appendChild(link);

	div = document.createElement('div');
	div.id = 'emojiCompletion';
	div.innerHTML = 'abc';
//	document.body.appendChild(div);

	document.addEventListener('input', handle);
	document.addEventListener('selectionchange', handle);
}
