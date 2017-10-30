//index.js
//获取应用实例
// var app = getApp();
const hSwiper = require('../../component/hSwiper/hSwiper.js');
const monthSwiper = require('../../component/monthSwiper/monthSwiper.js');
const util = require('../../utils/util.js');

var info = "“除了文本节点以外的其他节点都无法长按选中。”";
var wpNum = "1";
var monthData = [{ num: 1, en: "Jan", active: true,current:false }, 
  { num: 2, en: 'Feb', active: true, current: false}, 
  { num: 3, en: 'Mar', active: true, current:false},
  { num: 4, en: 'Apr', active: true, current: false}, 
  { num: 5, en: 'May', active: true, current: false }, 
  { num: 6, en: 'Jun', active: true, current: false},
  { num: 7, en: 'Jul', active: true, current: false }, 
  { num: 8, en: 'Aug', active: true, current: false }, 
  { num: 9, en: 'Sep', active: true, current: false},
  { num: 10, en: 'Oct', active: true, current: false }, 
  { num: 11, en: 'Nov', active: true, current: false }, 
  { num: 12, en: 'Dec', active: true, current: false}
  ];


var dataListPath = 'https://api.lichii.cn/wp/getDataList';

var wpDataList = -1;
var Mswiper;
var wpSwiper;
var cMonth;

//跳转传递的参数
var selectDate;
var selectMonth;
var onlyMonth = false;

var option = {
  data: {
    //swiper插件变量
    // month: monthData.reverse(),
    monthSwiperVar: {},
    hSwiperVar: {},
    infoTxt: info,
    wpIndex: wpNum,
    wpTotal:"30"
  },
  onLoad: function () {
    var self = this;
    var currentDay = util.getCurrentDate();
    var currentMonth = util.getCurrentMonth();
    cMonth = currentMonth;

    console.log("当前日期：", currentDay);

    getDataList(currentMonth, self, currentDay);//调用接口方法
    selectDate = currentDay;
    selectMonth = currentMonth;

    Mswiper = new monthSwiper({
      reduceDistance: 335,
      varStr: "monthSwiperVar",
      list: monthData
    });
    //选择月份
    Mswiper.afterSelectMonth = function (index) {
      // console.log(currentMonth);
      
      if (index == currentMonth) {
        getDataList(index, self, currentDay);
        selectDate = currentDay;
        selectMonth = index;
        onlyMonth = false;
      } else {
        getDataList(index, self);
        selectMonth = index;
        onlyMonth = true;
      }
      

    }
    //实例化壁纸滑块插件
    wpSwiper = new hSwiper({
      reduceDistance: 112,
      varStr: "hSwiperVar",
      list: wpDataList
    });

    wpSwiper.onFirstView = function (data, index) {
    };
    wpSwiper.onLastView = function (data, index) {
      // var dataNum;  
    };

    wpSwiper.afterViewChange = function (data, index) {
      console.log(data);
      self.setData({
        wpIndex: data.index + "/",
        wpTotal: data.total,
        infoTxt: data.desc
      })
      if (data.month != cMonth) {
        Mswiper.moveViewTo(data.month - 1);
        cMonth = data.month;
      }
    };
    wpSwiper.selectedViewTap = function (data, index) {
      var picPath = data.pic;
      wx.navigateTo({
        url: '../preview/preview?pic=' + picPath + '&onlyMonth=' + onlyMonth + '&selectDate=' + selectDate + '&selectMonth=' + selectMonth
      })
    };
    wpSwiper.beforeViewChange = function (data, index) {
      // console.log("当前是第" + (index + 1) + "视图", "数据是：" + data);
    };
  },
  onReady: function () {
    // console.log('onReady');

    //更新数据 
    // setTimeout(() => {
    //   console.log("3 s 后更新列表数据");
    //   //3 s 后更新列表数据
    //   this.setData({
    //     // "monthSwiperVar.list[0].num": "222",
    //     // "hSwiperVar.list[0]": "1",
    //     wpNum: "1/22"
    //   });
    // }, 3000);

    // setTimeout(() => {
    //   console.log("5s后更新数据 并且更新视图");

    //   //5s后更新数据 并且更新视图
    //   // var oldList = swiper.getList();
    //   // swiper.updateList(oldList.concat([11, 23, 45]));
    // }, 5000);


  },
  changeMonth: function () {
    var mWidth = 300;

  },

  onShareAppMessage: function () {
    return {
      title: '壁纸是人的第二张脸。——鲁迅',
      path: '/pages/index/index',
    }
  }
};


Page(option);



function getDataList(month, self, today){
  var _data;
  if (today){
    _data={
      today: today,
      month:month
    }
  }else{
    _data = {
      month: month
    }
  };

  //请求接口数据
  wx.request({
    url: dataListPath, //接口地址
    data: _data,
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      // console.log(res.data);
      var data = res.data.data;
      console.log(data);
      wpDataList = data;
      setPageData(data, self, 0);
    }
  });
}


function setPageData(data, currpage,index){
  var _total = data.length;
  currpage.setData({
    wpIndex: data[index].index + "/",
    wpTotal: _total,
    infoTxt: data[index].desc
  });

  var currentMonth = data[0].month - 1;//当前月份
  Mswiper.moveViewTo(currentMonth);
  wpSwiper.updateList(data);
  wpSwiper.moveViewTo(0);

}