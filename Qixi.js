function Swipe(container) {
	var container = $('#content');
		//获取第一个子节点
	var swipe = {};
	    //滑动对象
	var element = container.find(':first');
		//li页面数量
	var slides = element.find('li');
		//获取容器尺寸
	var width = container.width();
	var height = container.height();
		//设置li页面总宽度
	element.css({
		width : (slides.length * width)+'px',
		height : height+'px'
	});
		//设置每一个页面li的宽度
	$.each(slides,function(index){
		var slide = slides.eq(index);
		//获取每一个li元素
		slide.css({
			width : width+'px',
			height : height+'px'
		});
	});
	swipe.scrollTo = function(x,speed){
		//执行动画移动
		element.css({
			'-webkit-transition-timing-function':'linear',
			'-webkit-transition-duration':speed + 'ms',
			'-webkit-transform':"translate3d(-"+ x +"px,0px,0px)"
		});
	};
	return swipe;
	
}