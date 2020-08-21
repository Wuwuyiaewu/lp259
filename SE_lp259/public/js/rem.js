function recalc(x,bol) {
	var clientWidth = $(window).width();
	//var clientWidth = document.body.clientWidth;

	if (bol && (!clientWidth || clientWidth > x)) {
		document.documentElement.style.fontSize = "100px";
		return;
	};
	document.documentElement.style.fontSize = 100 * (clientWidth / x) + 'px';
};
var remCompute = function (width,device) {
	if (window.addEventListener) {
		recalc(width,device);
		var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
		window.addEventListener(resizeEvt, function () {recalc(width,device)}, false);
	};
};


// NOTE:
	// html页面body下的最上方引入方法
	// width: 预设宽度/预设响应的时机;
	// device:true(pc)   false(mobile)
	// =ture时  **pc做响应式时只有在小于width时才计算**
	// =false时  **mobile端随时都进行计算**


// 方法: remCompute(640,false);
// 换算方法: 100px = 1rem; 例如20px = 0.2rem;
