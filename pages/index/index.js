//index.js
var utils = require('../../utils/util.js');
var requests = require('../../requests/request.js');

var weekdayStr = ['日','一','二','三','四','五','六'];

Page({
  data: {
    pageData: {},//列表数据
    themeData: {},//主题菜单数据
    sliderData: {},//轮播图数据
    currentDateStr: '',
    currentDate: new Date(),
    refreshAnimation: {},//加载更多旋转动画数据
    loadingMode: false,//是否正在加载
    avatarUrl: '',//当前开发者头像
    nickName: '',//当前开发者名字

    loading: false,
    loadingMsg: '加载中...',
    pageShow: 'none',

    maskDisplay: 'none',
    slideHeight: 0,
    slideRight : 0,
    slideWidth : 0,
    slideDisplay: 'block',
    screenHeight : 0,
    screenWidth : 0,
    slideAnimation: {},

    ballBottom: 20,
    ballRight: 30,
    ballOpacity: '8',
    modalMsgHidden: true,
    themeId: 0,//当前主题Id

    id: null,
    background: '',
    editorData: [],//主编数据
    description: ''
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  //获取设备信息，屏幕的高度宽度
  onLoad: function () {    
    var that = this
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
          slideHeight: res.windowHeight,
          slideWidth: res.windowWidth * 0.7,
          slideRight: res.windowWidth
        });
      }
    });
    var app = getApp();
    app.getUserInfo(function (data){
      that.setData({
        avatarUrl: data.avatarUrl,
        nickName: data.nickName
      });
    });
  },
  //从详细页面返回时刷新
  onShow: function(){
    if(this.data.themeId == -1)
    {
      var pageData = wx.getStorageSync('pageData') || []
      this.setData({pageData: pageData});
    }
  },
  onReady: function(){
    var date = utils.getCurrentDate();
    this.setData({
      loading:true
    });

    var that = this;

    requests.getNewsLatest((data) => {
      data = utils.correctData(data);
      that.setData({
        sliderData: data.top_stories,
        pageData : data.stories
      });
      that.setData({pageShow: 'block'});
    }, null, () => {
      that.setData({loading: false});
    });

    //获取主题日报列表
    requests.getTheme((data) => {
      that.setData({themeData: data.others});
    });
  }
})
