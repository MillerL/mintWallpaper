
const util = require('../../utils/util.js');

var _monthSwiperId=1;

class monthSwiper{
	constructor(props) {
		this.onFirstView=function(){
			// console.log(arguments," 第一个视图")
		};
		this.onLastView=function(){
			// console.log(arguments,"最后一个视图")
		};
		this.afterViewChange=function(){
			// console.log(arguments,"视图移动之后")
		};
		this.beforeViewChange=function(){
			// console.log(arguments,"视图移动之前")
		};
    this.afterSelectMonth = function () {
      // console.log(arguments,"点击选择月份")
    };
  

		props=props||{}


		//获得当前Page上下文
		const pages=getCurrentPages();

		this.pageCtx = pages[pages.length-1];
		//当前hSwiperId
    this.id = _monthSwiperId++;

		//获取可用屏幕宽度
		this.screenWidth=wx.getSystemInfoSync().windowWidth;

		//使用的视图item模版命名
		this.templateName=props.templateName||"monthSwiperItem";

		//代理的data变量,必要,并且为一级变量
		this.DataVarName=props.varStr;

		//代理滚动容器style属性的变量名
		this.wrapperStyle="monthSwiperConStyle"+this.id;

		this.pageCtx.data[this.DataVarName]=this.pageCtx.data[this.DataVarName]||{};

		//获取page的data代理的变量
		this.data=this.pageCtx.data[this.DataVarName];

		this.data.id=this.id;
		this.data.templateName=this.templateName;

		// this.data.animationName='monthSwiperAnimation'+this.id;

		this.data.wrapperStyle=this.wrapperStyle;

		this.data.wrapperStyleValue={};

		this.data.wrapperStyleValue[this.wrapperStyle]="";

		this.data.itemStyle= "";
    // this.data.itemStyle[] = {};

    this.data.currentItemClass = "currentMonth";

    this.data.viewActive = 5+1;

		//视图元素对应的数据
		this.data.list=props.list||[];

		this.data.swiperAnmiation={};

		//当前视图位置
		this.nowTranX=0;
		//当前是第几个视图
		this.nowView=0;


		// this.reduceDistance=parseInt(props.reduceDistance)||0;//用于计算每个视图元素的宽度 itemAllWidth=windosWidth-reduceDistance;		

		//每个视图元素的宽度
    this.swipeWidth = parseInt(this.screenWidth + this.screenWidth * 0.34);
    this.itemWidth = 0;
    // this.itemWidth = 0;

		//视图过度动画实例
		this.viewAnimation=wx.createAnimation({
			transformOrigin: "50% 50%",
			duration: 300,
			timingFunction: "ease",
			delay: 0
		});

		//视图移动动画实例
		this.moveAnimation=wx.createAnimation({
			transformOrigin: "50% 50%",
			duration: 0,
			timingFunction: "ease",
			delay: 0
		});
    // this.moveAnimation.scale(0.8, 0.8);
    // animation.scale(2, 2).rotate(45).step()

		//和触摸事件相关的属性
		this.startPos=this.endPos=0;

		//注册事件
		this.registerEvent();

		//初始化代理数据变量的结构,只能初始化时调用,否侧此方法可能会出现bug
		this.initData();

		//计算结构
		this.initStruct();

    this.moveViewTo(0);

	}

	initStruct(){
		var count=this.data.list.length;
    this.itemWidth = Math.floor(this.swipeWidth / count);

		//更新容器的宽度，默认
    this.updateConStyle("width", count * this.itemWidth + "px", );
    this.updateItemStyle("width", this.itemWidth + "px");
    // this.updateItemActivStyle();
		// console.log("更新item的结构");
	}

  // 解析js对象为style属性字符串
	styleStringify(styleObj){
		var str="";
		for(var i in styleObj){

			str+=i+":"+styleObj[i]+";";
		}
		return str;
	}

	//同步数据到视图
	updateData(varStr,value){
		var temp={};

		temp[this.DataVarName+"."+varStr]=value;

		this.pageCtx.setData(temp);
	}

	updateItemStyle(attr,value){
		var tempWidth=this.parseStyle(this.data.itemStyle)||"";
		tempWidth[attr]=value;
		this.data.itemStyle=this.styleStringify(tempWidth);
    // console.log(this.data);
		this.updateData("itemStyle",this.data.itemStyle);

	}

	updateConStyle(attr,value){
		var tempWidth=this.parseStyle(this.data.wrapperStyleValue[this.wrapperStyle])||"";
		tempWidth[attr]=value;
		this.data.wrapperStyleValue[this.data.wrapperStyle]=this.styleStringify(tempWidth);

		var temp="wrapperStyleValue."+this.data.wrapperStyle;

		this.updateData(temp,this.data.wrapperStyleValue[this.data.wrapperStyle]);

	}
  updateItemActivStyle(currentMonth){
    // console.log(currentMonth)
    var list = this.data.list;
    var ifCurretn;
    var isGreen;
    var currentMonth = parseInt(util.getCurrentMonth());
    // console.log(index, currentMonth);
    for (var i in list) {
        if(this.nowView == i){
          ifCurretn = true;
        }else{
          ifCurretn = false;
        }
        this.updateData('list[' + i + '].current', ifCurretn);

        if (i < currentMonth){
          isGreen = true;
        }else{
          isGreen = false;
        }
        this.updateData('list[' + i + '].isGreen', isGreen);
        // console.log("update"+i);
        // console.log('list[' + i + '].current', ifCurretn);
    }
    // console.log(this.nowView);
    // console.log(list);
  }
	/**
	 * 解析style属性字符串为js对象
	 * @param  {[type]} styleStr [description]
	 * @return {[type]}          [description]
	 */
	parseStyle(styleStr){
		var styleObj={};
		var styleArray=styleStr.split(";");


		styleArray=styleArray.map(function(item){
			var temp=item.split(":");
			if(temp.length===2){
				styleObj[temp[0]]=temp[1];
			}
		});

		return styleObj;
	}
	//注册一些触摸事件，挂载到page下面
	registerEvent(){
		var self=this;
		//触摸开始事件	
    // console.log(self);
    // console.log(this.pageCtx);
		// this.pageCtx["swiperTouchstart"+this.id] = function(e) {
		// 	console.log("触摸开始");			
		// 	self.startPos = e.changedTouches[0].clientX;
		// 	self.touchTime = e.timeStamp;
		// };

		// //触摸移动中的事件
		// this.pageCtx["swiperTouchmove"+this.id] = function(e) {
		// 	self.endPos = e.changedTouches[0].clientX;
		// 	self.movePos(self.endPos - self.startPos);
		// };

		// //触摸结束事件
		// this.pageCtx["swiperTouchend"+this.id] = function(e) {
		// 	// console.log("触摸结束");

		// 	var times = e.timeStamp - self.touchTime,
		// 		distance = Math.abs(e.changedTouches[0].clientX - self.startPos);
		// 	//判断
		// 	if (times < 500 && distance > 1) {
		// 		if (!((e.changedTouches[0].clientX - self.startPos) > 0)) {
		// 			self.nextView();
		// 		} else {
		// 			self.preView();
		// 		}
		// 	} else {
		// 		self.endPos = e.changedTouches[0].clientX;
		// 		self.movePos(self.endPos - self.startPos);

		// 		self.nowTranX += (self.endPos - self.startPos);
		// 		self.moveViewTo(self.getNowView());
		// 	}
		// };
    //
    this.pageCtx['swiperTab' + this.id] = function(e){
      // console.log("点击",this.id,e);
      var offsetx = parseInt(e.currentTarget.offsetLeft);
      var index = offsetx / self.itemWidth;

      // console.log(index, self.nowView);
      var currentMonth = parseInt(util.getCurrentMonth());
      // console.log(index,currentMonth);
      // self.moveViewTo(index);
      self.afterSelectMonth(index + 1);

      //暂时禁掉1234月份，因为没数据
      // console.log(index);
      // console.log(currentMonth);
      // if (index >=4 && index < currentMonth) {
      //   if (index != self.nowView && index < currentMonth) {
      //     self.moveViewTo(index);
      //     self.afterSelectMonth(index + 1);
      //   }
      // }else{
      //   wx.showModal({
      //     title: '提示',
      //     content: '暂时还没有哦！',
      //     showCancel: false,
      //     success: function (res) {
      //       if (res.confirm) {
      //         console.log('用户点击确定');
      //       }
      //     }
      //   });
      // }
      
    }

	}


	//初始化
	initData(){
		var temp={};
		temp[this.DataVarName]=this.data;
		this.pageCtx.setData(temp);
	}	


	movePos(x){
		// console.log("移动位置");
		var tempPos=this.nowTranX+x,
			count=this.data.list.length>0?(this.data.list.length):1,
			minPos=-this.itemWidth*(count-1)-40,
			maxPos=40;

		// console.log("最大的位置",minPos);
		//最大的位置
		if(tempPos>maxPos){
			tempPos=maxPos;
		}

		if(tempPos<minPos){
			tempPos=minPos;
		}

		this.updateMoveAnimation(tempPos);
	}

	/**
	 * 更新触摸位移动画
	 * @param  {[type]} x [description]
	 * @return {[type]}   [description]
	 */
	updateMoveAnimation(x){
		this.moveAnimation.translateX(x).translate3d(0).step();
		var temp={};
		this.updateData("swiperAnmiation",this.moveAnimation.export());
	}

	/**
	 * 移动到指定视图，以视图的宽度为单位
	 * @return {[type]} [description]
	 */
	moveViewTo(viewIndex){
		// if(viewIndex==this.nowView){
		// 
		this.beforeViewChange(this.data.list[this.nowView],this.nowView);
		this.nowView=viewIndex;

    this.nowTranX = -(this.itemWidth) * (viewIndex + 1) + this.itemWidth/2 + this.screenWidth/2;
		this.updateViewAnimation(this.nowTranX);


		this.afterViewChange(this.data.list[this.nowView],this.nowView);

    this.updateItemActivStyle();

		if(viewIndex===0){
			this.onFirstView(this.data.list[this.nowView],this.nowView);
		}else if(viewIndex===(this.data.list.length-1)){
			this.onLastView(this.data.list[this.nowView],this.nowView);
		}
	}

	updateViewAnimation(x){
    // console.log(x);
		this.viewAnimation.translateX(x).translate3d(0).step();
		this.updateData("swiperAnmiation",this.viewAnimation.export());
	}
	/**
	 * 获取当前是第几个视图，从0开始计数
	 * @return {[type]} [description]
	 */
	getNowView(){
		var maxIndex=this.data.length-1;

		var indexView=Math.abs(Math.round(this.nowTranX/this.itemWidth));


		if(this.nowTranX>0){
			return 0;
		}


		// console.log("现在的位置",this.nowTranX);
		// console.log("现在的元素宽度",this.itemWidth);
		// console.log("得出的试图",indexView);
		// console.log("最大的 index",maxIndex);

		// console.log("当前计算的 index",indexView);
		indexView=indexView>0?indexView:0;
		indexView=indexView>maxIndex?maxIndex:indexView;
		// console.log("闲杂的 视图" ,indexView);
		return indexView;
	}	

	nextView(){
		// console.log("跳转下一个视图");

		var index=this.nowView+1;

		index=index>(this.data.list.length-1)?this.data.list.length-1:index;
		this.nowView=index;
		this.moveViewTo(index);
		// console.log("切换到页",this.nowView);
		return index;

	}	

	preView(){
		// console.log("跳转上一个视图");
		var index=this.nowView-1;
		index=index<0?0:index;
		this.nowView=index;		
		this.moveViewTo(index);

		return index;
	}

	updateList(list){
		//更新list
		this.data.list=list;
		this.updateData("list",list);
		this.initStruct();
	}

	updateListItem(index,varStr,value){
		var tempStr='list['+index+'].'+varStr;
		console.log(tempStr);
		this.updateData(tempStr,value);
	}

	getList(){
		return this.data.list;
	}
}

module.exports = monthSwiper;