localStorage.setItem('QQEmojiRenderer', '');

setInterval(function() {
	if(localStorage.getItem('QQEmojiRenderer') != '') {
		Swal.fire({
			toast: true,
			position: "top-end",
			showConfirmButton: false,
			timer: 3000,
			timerProgressBar: true,
			didOpen: (toast) => {
			  toast.onmouseenter = Swal.stopTimer;
			  toast.onmouseleave = Swal.resumeTimer;
			},
			icon: "info",
			title: localStorage.getItem('QQEmojiRenderer'),
		  });
		localStorage.setItem('QQEmojiRenderer', '');
	}
}, 100);


