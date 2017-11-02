    // 灯光动画
    //================================
    var lamp = {
        elem:$('.b_background'),
	    bright: function(){
			this.elem.addClass('lamp-bright')
		},
		dark: function(){
			this.elem.removeClass('lamp-bright')
		}
	};
	function doorAction(left,right,time){
		var $door = $('.door');
		var dl = $('.door-left');
		var dr = $('.door-right');
		var defer = $.Deferred();
		var count = 2; 
		//监听动画，执行第一个回调函数时count减1，当第二个回调执行时，才会执行defer.resolve。

				// 等待开门完成
		var complete = function() {
			if(count == 1) {
				defer.resolve();
				return;
			}
			count--;
		};
		dl.transition({
			'left':left
		},time,complete);
		// dl.transition 函数先返回，因为count为2，complete执行count--，count = 1
		// dr.transition再次返回时 因为count为1，执行defer.resolve(); 
		dr.transition({
			'left':right
		},time,complete);
		return defer;
	};
	//开门
	function openDoor(){
		return doorAction('-50%','100%',2000);
	};
	//关门
	function closeDoor(){
		return doorAction('0%','50%',2000);
	};

	// ==============================================
	//  小孩走路
	// ==============================================
	var instanceX;
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
    var $boyWidth = $boy.width();  
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
    // 走进商店
    function walktoShop(runTime){
    	var defer = $.Deferred();
    	var doorObj = $('.door');
    	// 门的坐标
    	var offsetDoor = doorObj.offset();
    	var setDoorL = offsetDoor.left;
    	// 小孩当前的坐标
    	var offsetBoy = $boy.offset();
    	var setBoyL = offsetBoy.left; 

    	// 当前需要移动的目标
    	instanceX = (setDoorL + doorObj.width()/2)-(setBoyL + $boy.width()/2);

    	// 开始走路
    	var walkPlay = startRun({
    		transform: 'translateX(' + instanceX + 'px),scale(0.3,0.3)', //使用双引号，scale没效果。
    		opacity: 0.1
    	},2000);
    	// 走路完毕
    	walkPlay.done(function(){
    		$boy.css({
    			opacity:0
    		})
    		defer.resolve();
    	})
    	return defer;
    }
    // 走出店
    function walkoutShop(runTime){
        var defer = $.Deferred();
        restoreWalk();
        // 开始走路
        var walkPlay = startRun({
        	transform: 'translateX(' + instanceX + 'px),scale(1,1)',
        	opacity:1
        },runTime);
        // 走路完毕
        walkPlay.done(function(){
        	defer.resolve();
        });
        return defer;
    }
    // 取花
    function takeFlower() {
    	// 增加延迟等待效果
    	var defer = $.Deferred();
    	setTimeout(function(){
    		//取花
    		$boy.addClass('slowFlower');
    		defer.resolve();
    	},1000);
    	return defer;
    };
    return {
        //开始走路
        walkTo : function(time,proportionX,proportionY){
            var distX = calculateDist('x',proportionX)
            var distY = calculateDist('y',proportionY)
            return walkRun(time,distX,distY);
        },
        // 走进商店
        toShop : function(){
        	return walktoShop.apply(null,arguments);
        },
        // 离开商店
        outShop : function(){
        	return walkoutShop.apply(null,arguments);
        },
        //停止走路
        stopWalk : function(){
            pauseWalk();
        },
        setColor : function(value){
            $boy.css('background-color',value)
        },
        takeFlower : function(){
        	return takeFlower();
        }
    };
};