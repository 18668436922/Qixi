window.onload = function init(){
	var container = $('#content');
	var swipe = Swipe(container);
	var visualWidth = container.width();
	var visualHeight = container.height();

	//页面滚动到指定位置。
	function scrollTo(time,proportionX){
		var distX = container.width() * proportionX;
		swipe.scrollTo(distX,time)
	};

	// 飞鸟
	var bird = {
		elem: $('.bird'),
		fly : function(){
			this.elem.addClass('birdFly')
			this.elem.transition({
				right: container.width()
			},15000,'linear');
		}
	};

	// 获取数据
	var getValue = function(className) {  //获取目标class的宽高
    	var $elem = $(className);
    	//走路的路线坐标
    	return {
    		height:$elem.height(),
    		top:$elem.position().top
    	};
    };

	var bridgeY = function() {
		var data = getValue('.c_background_middle');
		return data.top;
	}();
    

	var girl = {
		elem: $('.girl'),
		getHeight: function(){
			return this.elem.height();
		},
		setOffset: function(){
			this.elem.css({
				left: visualWidth / 2,
				top: bridgeY - this.getHeight()
			});
		},
		// 转身动作
		rotate : function(){
			this.elem.addClass('girl-rotate');
		},
		getOffset : function(){
			return this.elem.offset();
		},
		getWidth : function (){
			return this.elem.width();
		}
	};
	// 修正小女孩的位置
	 girl.setOffset();

	//====================
	// 小孩走路
	//====================
	var boy = Boywalk();
		// 太阳公转
		$('#sun').addClass('rotation');

		// 飘云
		$('.cloud1').addClass('cloud1Anim');
		$('.cloud2').addClass('cloud2Anim');

		// 开始第一次走路
		boy.walkTo(6000,0.6)
		.then(function(){
			// 第一次走路完成
			// 页面开始滚动
			scrollTo(6500,1) // 6.5s 时间滚动1张画面。
		})
		.then(function(){
			// 第二次走路
			return boy.walkTo(6500,0.5);
		})
		.then(function(){
			//暂停走路
			boy.stopWalk();
		})
		.then(function(){
			//开门
			return openDoor();
		})
		.then(function(){
			//开灯
			lamp.bright();
		})
		.then(function(){
			//进商店
			return boy.toShop(1500);
		})
		.then(function(){
			//取花
			return boy.takeFlower();
		})
		.then(function(){
			 //飞鸟
			bird.fly();
		})
		.then(function(){
			//离开商店
			return boy.outShop(1500);
		})
		.then(function(){
			//关灯
			lamp.dark();
		})
		.then(function(){
			 scrollTo(6500,2)
		})
		.then(function(){
			return boy.walkTo(6500,0.15)
		})
		.then(function(){
    		//第二次走到桥上left,top
    	return boy.walkTo(2000,0.25,(bridgeY - girl.getHeight()) / visualHeight);
    	})
    	.then(function(){
    		//实际走路的比例
    		var proportionX = (girl.getOffset().left - boy.getWidth() - instanceX + 
    			girl.getWidth() / 5) / visualWidth;
    		//第三次上桥直走到女孩面前
    		return boy.walkTo(1500,proportionX);
    	})
    	.then(function(){
    		//图片原地还原停止状态
    		boy.resetOriginal();
    	})
    	.then(function(){
    		//增加转身动作
    		setTimeout(function(){
    			girl.rotate();
    			boy.rotate();
    		},850);
    	})
    	.then(function(){
    		snowflake();
    	});

	//=============
	// 飘雪花
	//=============
	var snowflakeURL = [
	    'images/snowflake/snowflake1.png',
	    'images/snowflake/snowflake2.png',
	    'images/snowflake/snowflake3.png',
	    'images/snowflake/snowflake4.png',
	    'images/snowflake/snowflake5.png',
	    'images/snowflake/snowflake6.png'
	]
	function snowflake(){
		//雪花容器
		var $flakeContainer = $('#snowflake');
		// 随机6张图片
		function getImagesName(){
			return snowflakeURL[[Math.floor(Math.random()*6)]];
		}
		//创建一个雪花元素
		function createSnowBox(){
			var url = getImagesName();
			return $('<div class="snowbox" />').css({
				'width':41,
				'height':41,
				'position':'absolute',
				'backgroundSize':'cover',
				'zIndex':10000,
				'top':'-41px',
				'backgroundImage':'url(' + url + ')'
			}).addClass('snowRoll');
		}
		//开始飘花
		setInterval(function(){
			//运动的轨迹
			var startPositionLeft = Math.random() * visualWidth-100,
			startOpacity = 1,
			endPositionTop = visualHeight-40,
			endPositionLeft = startPositionLeft-100 + Math.random() * 500,
			duration = visualHeight * 10 + Math.random() * 5000;
			//随机透明度不小于0.5
			var randomStart = Math.random();
			randomStart = randomStart < 0.5 ?
			startOpacity : randomStart;
			//创建一个雪花
			var $flake = createSnowBox();
			//设计起点位置
			$flake.css({
				left: startPositionLeft,
				opacity: randomStart
			});
			//加入到容器
			$flakeContainer.append($flake);
			//开始执行动画
			$flake.transition({
				top: endPositionTop,
				left: endPositionLeft,
				opacity: 0.7
			},duration,'ease-out',function(){
				//结束后删除
				$(this).remove()
			});
		},200)
	};
	//动画结束
    var animationEnd = (function(){
    	var explorer = navigator.userAgent;
    	if(~explorer.indexOf('WebKit')){
    		return 'webkitAnimationEnd';
    	}
    	return 'animationEnd';
    })();

	// 音乐配置
	var audioConfig = {
		enable :true, //是否开启音乐
		playURL: 'music/happy.wav', // 正常播放地址
		cycleURL: 'music/circulation.wav' //正常循环播放地址
	};
	//===================
	// 背景音乐
	//===================
	function Html5Audio(url,isloop){
		var audio = new Audio(url);
		audio.autoPlay = true;
		audio.loop = isloop || false;
		audio.play();
		return {
			end: function(callback){
				audio.addEventListener('ended',function(){
					callback();
				},false);
			}
		};
	};
	if (audioConfig.enable) { //自动播放音乐设置
		var audio1 = Html5Audio(audioConfig.playURL);
		audio1.end(function(){
			Html5Audio(audioConfig.cycleURL,true)
		})
	}
	Boywalk();
};
