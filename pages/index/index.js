//index.js
//获取应用实例
// var app = getApp();
const hSwiper = require('../../component/hSwiper/hSwiper.js');
const monthSwiper = require('../../component/monthSwiper/monthSwiper.js');
const util = require('../../utils/util.js');

var info = "“除了文本节点以外的其他节点都无法长按选中。”";
var wpNum = "1/30";
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

var currentDay = util.getCurrentDate();
console.log(currentDay);

var listNum = 10;//默认10条，以次增加
var wpDataList = -1;


var option = {
  data: {
    //swiper插件变量
    // month: monthData.reverse(),
    monthSwiperVar: {},
    hSwiperVar: {},
    infoTxt: info,
    wpNum: wpNum
  },
  onLoad: function () {
  },
  onReady: function () {
    // console.log('onReady');
    var self = this;

    var Mswiper = new monthSwiper({
      reduceDistance: 335,
      varStr: "monthSwiperVar",
      list: monthData
    });
    Mswiper.moveViewTo(8 - 1);
    //实例化壁纸滑块插件
    var wpSwiper = new hSwiper({
      reduceDistance: 112,
      varStr: "hSwiperVar",
      list: wpDataList
    });

    //请求接口数据
    wx.request({
      url: dataListPath, //接口地址
      data: {
        today: currentDay,
        num: listNum
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        // console.log(res.data);
        var data = res.data.data;
        console.log(data);
        var currentMonth = data[0].month -1;//当前月份
        var index = data[0].index + "/" + data[0].total;//当前序列

        self.setData({
          "monthSwiperVar.list[0].num": data[0].month,
          wpNum: index,
          infoTxt: data[0].desc
        });
        Mswiper.moveViewTo(currentMonth);
        wpSwiper.updateList(data);


      }
    });

    wpSwiper.onFirstView = function (data, index) {
      console.log("当前是第" + (index + 1) + "视图", "数据是：" + data);
    };
    wpSwiper.onLastView = function (data, index) {
      console.log("当前是第" + (index + 1) + "视图", "数据是：" + data);
    };
    wpSwiper.afterViewChange = function (data, index) {
      console.log("当前是第" + (index + 1) + "视图", "数据是：" + data);
    };
    wpSwiper.beforeViewChange = function (data, index) {
      console.log("当前是第" + (index + 1) + "视图", "数据是：" + data);
    };

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
      title: '自定义转发标题',
      path: '/page/user?id=123'
    }
  }
};


Page(option);

