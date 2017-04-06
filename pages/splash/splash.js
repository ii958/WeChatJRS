// pages/splash/splash.js
var requests = require('../../requests/request.js');
var util = require('../../utils/util.js');

Page({
  data:{
    splash:{},
    screenHeight:0,
    screenWidth:0
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        // success
        that.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth
        });
      }
    });
  },
  onReady:function(){
    // 页面渲染完成
    var that = this;
    var size = this.data.screenWidth + '*' + this.data.screenHeight;
    requests.getSplashCover(size, (data) => {
      util.fixImgPrefix(data.img);
      that.setData({splash: data});
    }, null, () => {
      toIndexPage.call(that);
    });
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
});

/**
 * 跳转到首页
 */
function toIndexPage(){
  setTimeout(function (){
    wx.redirectTo({
      url: '../index/index',
      success: function(res){
        // success
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    });
  }, 2000);
}