// 注入 css
export default path => {
	const link = document.createElement('link');
	link.setAttribute('rel', 'stylesheet');
	link.setAttribute('href', chrome.runtime.getURL(path));
	document.head.appendChild(link);
};
