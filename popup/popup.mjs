// 相对于自己的路径
import * as emoji from "../resources/emoji.mjs"

const grid = document.querySelector('#img_grid');

emoji.keys.forEach(key => {
	const div = document.createElement('div');
	div.classList.add('flexible');
	div.title = '/' + key;
	const img = document.createElement('img');
	img.src = emoji.getURL(key);
	div.appendChild(img);
//	const p = document.createElement('p');
//	p.innerText = '/' + key;
//	div.appendChild(p);
	grid.appendChild(div);
});
