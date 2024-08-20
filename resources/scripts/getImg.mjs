// 获取图片标签
export default (key, withTitle) => {
	const url = chrome.runtime.getURL(`resources/images/${key}.gif`);
	const img = document.createElement('img');
	img.setAttribute('src', url);
	if (withTitle)
		return `<img src="${url}" emoji-uninitialized title="/${key}">`;
	else
		return `<img src="${url}" emoji-uninitialized>`;
};
