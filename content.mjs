// 注入 js
function injectJS(path) {
	return import(chrome.runtime.getURL(path));
}

injectJS('resources/scripts/injectCSS.mjs').then(module => {
	module.default('resources/styles/content.css');
	module.default('resources/styles/sweetalert2.min.css');
});
injectJS('resources/scripts/handleImg.mjs');
injectJS('resources/scripts/autoComplete.mjs')
	.then(module => module.default(true));
injectJS('resources/scripts/replace.mjs');

console.log('%c QQEmojiRenderer %c ae073b3ad %c', 'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff', 'background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff', 'background:transparent'),
console.log('少年，恭喜你囍提彩蛋，我们在做一些腐败(bushi)相关的有趣的事情，如果您对此感兴趣，欢迎访问 https://github.com/danielqfmai/QQEmojiRenderer')
