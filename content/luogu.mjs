(async function() {
	// 相对于 `manifest.json` 的路径
	const mainSrc = chrome.runtime.getURL("resources/main.mjs");
	const main = await import(mainSrc);
	const searchClasses = ['message', 'am-comment-bd', 'marked', 'content'];
	main.main(node => {
//		console.log(node);
		if (node.classList &&
			searchClasses.some(className =>
				node.classList.contains(className)))
			return NodeFilter.FILTER_ACCEPT;
		return NodeFilter.FILTER_SKIP;
	});
})();
