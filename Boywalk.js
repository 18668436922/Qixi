function Boywalk(){

	var container = $('#content'); // 容器div
    // 页面可视区域
    var visualWidth = container.width(); // 获取容器的宽度
    var visualHeight = container.height(); // 获取容器的高度
    
    // 获取数据
    var getValue = function(className) {  //获取目标class的宽高
    	var $elem = $(className);
    	//走路的路线坐标
    	return {
    		height:$elem.height(),
    		top:$elem.position().top
    	};
    };
    // 路的Y轴
    var pathY = function(){  // 定义目标在页面Y轴的位置。
    	var data = getValue(".a_background_middle");
    	return data.top + data.height / 2;
    }();
    var $boy = $("#boy");
    var boyHeight = $boy.height();
    //修正小男孩的正确位置
    //路的中间位置减去小孩的高度，25 是一个修正值
    $boy.css({
    	top:pathY - boyHeight + 25 
    });
    // =======================
    //   动画处理
    // =======================
    //暂停走路
    function pauseWalk(){
        $boy.addClass('pauseWalk');
    }
    // 恢复走路
    function restoreWalk(){
    	$boy.removeClass('pauseWalk'); //删除小男孩的暂停类
    };
    // css3的动作变化
    function slowWalk(){ //添加小男孩的动画类
    	$boy.addClass('slowWalk');
    };
    // 计算移动距离
    function calculateDist(direction,proportion){
    	return (direction == 'x' ? visualWidth : visualHeight) * proportion;
    };//如果方向是x轴，返回容器宽度*比例，如果方向是y轴，返回容器高度*比例。

    // 用transition做运动
    function startRun(options,runTime){
    	var dfdPlay = $.Deferred();
    	//恢复走路
    	restoreWalk();
    	// 运动属性
    	$boy.transition(options,runTime,'linear',function(){
            dfdPlay.resolve(); 
        //按照添加顺序执行通过deferred.then或者deferred.done的回调函数。
        });
    	return dfdPlay;
    };
    // 开始走路
    function walkRun(time,dist,disY){
    	time = time || 3000;
    	// 脚的动作
    	slowWalk();
    	// 开始走路
    	var d1 = startRun({  
    		'left':dist + 'px',
    		'top':disY ? disY :undefined
    	},time);
    	return d1;
    };
    return {
        //开始走路
        walkTo : function(time,proportionX,proportionY){
            var distX = calculateDist('x',proportionX)
            var distY = calculateDist('y',proportionY)
            return walkRun(time,distX,distY);
        },
        //停止走路
        stopWalk : function(){
            pauseWalk();
        },
        setColor : function(value){
            $boy.css('background-color',value)
        }
    };
};