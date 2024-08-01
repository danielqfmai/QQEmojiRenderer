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
}
