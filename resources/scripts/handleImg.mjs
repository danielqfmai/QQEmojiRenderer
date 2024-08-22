import './sweetalert2.min.js';
// 要用 Sweetalert2 不要用 Swal


function showToast(key) {
	navigator.clipboard.writeText(key);
	Sweetalert2.fire({
		toast: true,
		position: "top-end",
		showConfirmButton: false,
		timer: 3000,
		timerProgressBar: true,
		didOpen: toast => {
			toast.onmouseenter = Sweetalert2.stopTimer;
			toast.onmouseleave = Sweetalert2.resumeTimer;
		},
		icon: "info",
		title: `已复制emoji(${key})`,
	});
}

// 缩放图片，监听点击
function main() {
	const imgs = document.querySelectorAll('img[emoji-uninitialized]');
	for (var i = 0; i < imgs.length; ++i) {
		imgs[i].removeAttribute('emoji-uninitialized');
		const key = imgs[i].getAttribute('title');
		if (key) imgs[i].addEventListener('click', e => showToast(key));
		const x = window.getComputedStyle(imgs[i])['font-size'];
		const match = x.match(/\d+(\.\d+)?/);
		var y;
		if (match && match.length)
			y = Number(match[0]) * 1.7
					+ x.substring(match[0].length);
		else
			y = x;
		imgs[i].style['width' ] = y;
		imgs[i].style['height'] = y;
	}
}

main();
const observer = new MutationObserver(mutations => main());
observer.observe(document.body, { childList: true, subtree: true });
