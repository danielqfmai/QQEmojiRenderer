// 注入 js
function injectJS(path) {
	return import(chrome.runtime.getURL(path));
}

// 添加样式
const link = document.createElement('link');
link.setAttribute('rel', 'stylesheet');
link.setAttribute('href', chrome.runtime.getURL('resources/content.css'));
document.head.appendChild(link);

// 添加 sweet alert 2
const script = document.createElement('script');
script.setAttribute('src', chrome.runtime.getURL('resources/sweetalert2/sweetalert2.all.mjs'));
document.head.appendChild(script);

const script2 = document.createElement('script');
script2.setAttribute('src', chrome.runtime.getURL('resources/scripts/showToast.mjs'));
document.head.appendChild(script2);

injectJS('resources/scripts/handleImg.mjs');
injectJS('resources/scripts/autoComplete.mjs').then(module => module.default());
injectJS('resources/scripts/replace.mjs');

console.log('%c QQEmojiRenderer %c ae073b3ad %c', 'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff', 'background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff', 'background:transparent'),
console.log('少年，恭喜你囍提彩蛋，我们在做一些腐败(bushi)相关的有趣的事情，如果您对此感兴趣，欢迎访问 https://github.com/danielqfmai/QQEmojiRenderer')
