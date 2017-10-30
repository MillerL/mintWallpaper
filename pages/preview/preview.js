//logs.js
var util = require('../../utils/util.js')

var picUrl="";
var deviceOS;
var currentPic;
var firstLog=0;
// var selectDateOrMonth;

//页面获取的参数
var selectMonth;
var selectDate;
var onlyMonth;

var picArr = [];//PREVIEW列表数据

Page({
  data: {
    src: '',
    iosTime:"00:00",
    iosDate:"Wednesday, 15 June",
    androidTime: "00:00",
    androidDate: "Wednesday, 15 June",
    iconHide: false, 
    iosLockHide: true,
    iosHomeHide: true,
    androidHomeHide: true,
    androidLockHide:true
  },

  onLoad: function (res) {
    var url = res.pic;
    selectMonth = res.selectMonth;
    selectDate = res.selectDate;
    onlyMonth = res.onlyMonth;
    currentPic = url;
    console.log(url);
    console.log(selectMonth, selectDate, onlyMonth);

    picUrl = url;
    var currentTime = util.getCurrentTime();
    var currentDate = util.getCurrentEnDate();

    this.setData({
      src: url,
      iosTime: currentTime,
      iosDate: currentDate,
      androidTime: currentTime,
      androidDate: currentDate
    });
    //获取设备信息
    wx.getSystemInfo({
      success:function(res){
        console.log(res.system);
        //判断操作系统
        if (res.system.indexOf("iOS")>-1){
          deviceOS ="ios";
        }else{
          deviceOS = "android";
        }
      }
    });
  },
  onReady:function(){
    var self = this;
    
    
  },
  //关闭预览
  hideThisView:function(e){
    var self = this;
    var targetName = e.currentTarget.dataset.id;
    console.log(e);

    setMyData('iconHide',false);
    setMyData(targetName, true);
  },
  //分享
  onShareAppMessage: function () {
    return {
      title: '壁纸是人的第二张脸。——鲁迅',
      path: '/pages/preview/preview?pic=' + currentPic + '&onlyMonth=' + onlyMonth + '&selectDate=' + selectDate + '&selectMonth=' + selectMonth,
    }
  },

  //点击下载
  downloadPic:function(){
    console.log(currentPic);
    wx.getSetting({
      success(res) {
        if (!res['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              // 用户已经同意小程序使用相册功能，后续调用 wx.startRecord 接口不会弹窗询问

              wx.downloadFile({ //下载图片到临时路径
                url: currentPic,
                success: function (res) {
                  var filePath = res.tempFilePath;
                  //保存图片到本地相册
                  wx.saveImageToPhotosAlbum({
                    filePath: filePath,
                    fail(res) {

                    }
                  })

                }
              })

            }
          })
        }
      }
    })
    
  },
  // 打开提示1
  openAlert: function () {
    var dataListPath = 'https://api.lichii.cn/wp/getDataList';
    var _data;
    if (onlyMonth == "false"){
      //请求月份加日期
      _data ={
        today: selectDate,
        month: selectMonth
      }
    }else{
      //请求月份加日期
      _data = {
        month: selectMonth
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
        var data = res.data.data;
        console.log(data);
       
        for (var i = 0; i < data.length;i++){
          var pic = data[i].pic;
          picArr.push(pic);
        };
        console.log(picArr);
        //接受数据成功显示preview页
        if (firstLog === 0) {
          wx.showModal({
            title: '提示',
            content: '长按图片保存',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定');
                showPreviewPage();
              }
              firstLog += 1;
            }
          });
        } else {
          showPreviewPage();
        };

      }
    });
    

    function showPreviewPage(){
      wx.previewImage({
        current: currentPic,
        urls: picArr,
        success: function (res) {
          console.log(res);

        },
        fail: function () {
          console.log('fail')
        }
      })
    }
    
  },
  // downloadpic : function(){
  //   // console.log(currentPic);
  //   wx.getSetting({
  //     success(res) {
  //       if (!res['scope.writePhotosAlbum']) {
  //         wx.authorize({
  //           scope: 'scope.writePhotosAlbum',
  //           success() {
  //             // 用户已经同意小程序使用相册功能，后续调用 wx.startRecord 接口不会弹窗询问
              
  //             // wx.saveImageToPhotosAlbum({
  //             //   filePath: currentPic,
  //             //   success(res) {
  //             //     //保存成功
  //             //   }
  //             // })
              
  //           }
  //         })
  //       }
  //     }
  //   })
  // },
  //打开观看方式选择器
  openViewOption: function () {
    wx.showActionSheet({
      itemList: ['锁屏预览', '主屏幕预览'],
      success: function (res) {
        if (!res.cancel) {
          console.log(res.tapIndex)
          if(res.tapIndex == 0){
            setMyData('iconHide', true);
            if (deviceOS == "ios"){
              setMyData('iosLockHide', false);
            }else{
              setMyData('androidLockHide', false);
            }
          }else{
            setMyData('iconHide', true);
            if (deviceOS == "ios") {
              setMyData('iosHomeHide', false);
            } else {
              setMyData('androidHomeHide', false);
            }
          }
        }
      }
    });
  }
})

function setMyData(varStr, value){
  //获得当前Page上下文
  var pages = getCurrentPages();
  var pageCtx = pages[pages.length - 1];

  var temp = {};
  temp[varStr] = value;
  pageCtx.setData(temp);
}