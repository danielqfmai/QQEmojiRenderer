import injectCSS from './injectCSS.mjs';
import emojiKeys from './emojiKeys.mjs';
import getImg from './getImg.mjs';
import './tribute.min.js';

// 为文本框添加自动补全
function doAttach(tribute) {
	const selectors = ['textarea', 'input[type=text]'];
	selectors.forEach(selector => {
		tribute.attach(document.querySelectorAll(
					selector + ':not([data-tribute])'));
		tribute.attach(document.querySelectorAll(
					selector + '[data-tribute=false]'));
	});
}

export default (posMenu) => {
	injectCSS('resources/styles/tribute.css');

	// 生成 tribute
	console.log(Tribute);
	var tribute = new Tribute({
		requireLeadingSpace: false,
		positionMenu: posMenu,
		trigger: '/',
		values: emojiKeys.map(a => {
			var tmp = new Object();
			tmp.key = a;
			tmp.value = a;
			return tmp;
		}),
		menuItemTemplate: item =>
			getImg(item.original.key, false)
					+ `<span>/${item.original.key}</span>`
	});

	doAttach(tribute);
	const observer = new MutationObserver(mutations => doAttach(tribute));
	observer.observe(document.body, { childList: true, subtree: true });
};
