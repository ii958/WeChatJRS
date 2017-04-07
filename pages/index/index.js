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
    loadingMore: false,//是否正在加载
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
      currentDateStr: date.year+'.'+date.month+'.'+date.day+' ' + '星期' + weekdayStr[date.weekday]
    });

    var that = this;
    that.setData({loading:true});
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
  },

  //列表加载更多
  loadingMoreEvent: function(e){
    if(this.data.loadingMore)
      return;
    console.log(this.date.currentDate);
    var date = new Date(Date.parse(this.date.currentDate) - 1000 * 60 * 60 * 24);
    var that = this;
    var pageData = [];

    this.setData({loadingMore: true});
    updateRefreshIcon.call(this);

    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    m = m>9 ? m : '0'+m;
    d = d>9 ? d : '0'+d;
    var dateStr = [y,m,d].join('');
    requests.getBeforeNews(dateStr, (data) => {
      data = utils.correctData(data);
      console.log(data);
      pageData = that.data.pageData;
      pageData.push({type:'3',title:([y,m,d].join('.') + ' 星期' + weekdayStr[date.getDay()])});
      pageData = pageData.concat(data.stories);

      that.setData({currentDate:date,pageData:pageData});
    }, null, () => {
      that.setData({loadingMore:false});
    });
  },

  //浮动球移动事件
  ballMoveEvent: function(e){
    var touchs = e.touches[0];
    var pageX = touchs.pageX;
    var pageY = touchs.pageY;
    if(pageX < 25) return;
    if(pageX > this.data.screenWidth - 25) return;
    if(this.data.screenHeight - pageY <= 25) return;
    if(pageY<=25) return;
    var x = this.data.screenWidth - pageX - 25;
    var y = this.data.screenHeight - pageY - 25;
    this.setData({
      ballBottom: y,
      ballRight: x
    });
  },

  //浮动球点击 侧栏展开
  ballClickEvent: function(){
    slideUp.call(this);
  },
  //遮罩点击 侧栏关闭
  slideCloseEvent: function(){
    slideDown.call(this);
  },
  authorShowEvent: function(){
    this.setData({modalMsgHidden: false});
  },
  modalMsgHiddenEvent: function(){
    this.setData({modalMsgHidden: true});
  },
  onPullDownRefresh: function(e){
    console.log(1);
  }
});

//侧栏展开
function slideUp(){
  var animation = wx.createAnimation({
    duration: 600
  });
  this.setData({maskDisplay: 'block'});
  animation.translateX('100%').step();
  this.setData({
    slideAnimation: animation.export()
  });
}

//侧栏关闭
function slideDown(){
  var animation = wx.createAnimation({
    duration: 800
  });
  animation.translateX('-100%').step();
  this.setData({slideAnimation:animation.export()});
  this.setData({maskDisplay:'none'});
}

/**
 * 旋转上拉加载图标
 */
function updateRefreshIcon(){
  var deg = 360;
  var that = this;

  var animation = wx.createAnimation({
    duration: 1000
  });

  var timer = setInterval(function(){
    if(!that.data.loadingMore)
      clearInterval(timer);
    animation.rotateZ(deg).step();
    deg += 360;
    that.setData({
      refreshAnimation: animation.export()
    })
  }, 1000);
}