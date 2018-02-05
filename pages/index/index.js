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

var currentYear;

var option = {
  data: {
    //swiper插件变量
    // month: monthData.reverse(),
    monthSwiperVar: {},
    hSwiperVar: {},
    infoTxt: info,
    wpIndex: wpNum,
    wpTotal:"30",
    yearsArray: ['2017','2018'],
    defaultIndex:1
  },
  // 切换年份
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      defaultIndex: e.detail.value
    })
    var currentDay = util.getCurrentDay();
    var currentMonth = util.getCurrentMonth();
    var self = this;

    if (e.detail.value==0){
      //2017
      currentYear =2017;
      getDataList(currentYear, 8, self, function (data) {
        console.log(data);
        wpDataList = data;
        setPageData(data, self, 0);
        selectMonth = 8;
      })
    } else if (e.detail.value == 1){
      //2018
      currentYear = 2018;
      getDataList(currentYear, currentMonth, self, function (data) {
        // console.log(data);
        wpDataList = data;
        setPageData(data, self, currentDay);
        selectMonth = currentMonth;
        })
    }
  },
  onLoad: function () {
    var self = this;
    currentYear = util.getCurrentYear();
    var currentDay = util.getCurrentDay();
    var currentMonth = util.getCurrentMonth();
    // console.log(currentMonth);
    cMonth = currentMonth;
    console.log("当前日期：", currentDay);

    getDataList(currentYear,currentMonth, self,function(data){
      // console.log(data);
      wpDataList = data;
      setPageData(data, self, currentDay);
    });//调用接口方法
    selectDate = currentDay;
    selectMonth = currentMonth;

    Mswiper = new monthSwiper({
      reduceDistance: 335,
      varStr: "monthSwiperVar",
      list: monthData
    });
    //选择月份

    Mswiper.afterSelectMonth = function (month) {
      // console.log(currentMonth);
      // console.log(index);
      // console.log(selectMonth);
      if (month != selectMonth) {
        getDataList(currentYear,month, self, function (data) {
          console.log(data);
          if (data.length<=0){
              //没有数据
              alertInfo("再等等。。");
          }else{
            wpDataList = data;
           
            if (currentYear == 2018){
              if (currentMonth != month) {
                setPageData(data, self, 0);
                selectDate = 0;
              } else {
                setPageData(data, self, currentDay);
                Mswiper.moveViewTo(currentDay);
                selectDate = currentDay;
              }
            }else{
              setPageData(data, self, 0);
              selectDate = 0;
            }
            selectMonth = month;
          }
        });
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
      console.log('afterViewChange');
      console.log(index);
      selectDate = index;
      
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
      console.log(picPath);
      wx.navigateTo({
        url: '../preview/preview?pic=' + picPath + '&onlyMonth=' + onlyMonth + '&selectDate=' + selectDate + '&selectYear=' + currentYear +'&selectMonth=' + selectMonth
      })
    };
    wpSwiper.beforeViewChange = function (data, index) {
      // console.log("当前是第" + (index + 1) + "视图", "数据是：" + data);
    };
  },
  onReady: function () {
    // console.log('onReady');

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


function getDataList(year,month, self,onGetData){
  var _data;
  _data = {
    year: year,
    month: month
  }

  //请求接口数据
  wx.request({
    url: dataListPath, //接口地址
    data: _data,
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      onGetData(res.data.data);
    }
  });
}


function setPageData(data, currpage,index){
  // console.log(data[index].desc);
  console.log(index);
  var _index;
  if(index==0){
    _index =0
  }else{
    _index = index - 1
  }
  var _total = data.length;
  currpage.setData({
    wpIndex: data[_index].index + "/",
    wpTotal: _total,
    infoTxt: data[_index].desc
  });
  console.log(data);

  var currentMonth = data[0].month - 1;//当前月份
  Mswiper.moveViewTo(currentMonth);
  wpSwiper.updateList(data);
  wpSwiper.moveViewTo(_index);

}

function alertInfo(title){
  wx.showModal({
    title: '提示',
    content: title,
    showCancel: false,
    success: function (res) {
      if (res.confirm) {
        console.log('用户点击确定');
      }
    }
  });
}