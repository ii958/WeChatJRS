// pages/detail/detail.js
var requests = require('../../requests/request.js');
var utils = require('../../utils/util.js');

Page({
  data:{
    id: "8857042",//当前日报id
    loading: false,//是否加载中
    isTheme: false,
    news: {},//日报详情
    modalHidden: true,
    pageShow: 'none',
    isCollect: false//是否被收藏
  },
  //获取列表传过来的参数id: 
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var id = options.id;
    var isTheme = options['theme'];
    var pageData = wx.getStorageSync('pageData') || []
    for(let i=0;i<pageData.length;i++){
      if(pageData[i].id == id){
        this.setData({isCollect: true});
        break;
      }
    }
    this.setData({id: id, isTheme: isTheme});
  },
  //加载日报数据
  onReady:function(){
    // 页面渲染完成
    loadData.call(this);
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

//加载页面相关数据
function loadData(){
  var that = this;
  var id = this.data.id;
  var isTheme = this.data.isTheme;
  //获取日报详情内容
  that.setData({loading: true});
  requests.getNewsDetail(id, (data) => {
    data['image'] = utils.fixImgPrefix(data['image']);
    data.body = utils.parseStory(data.body, isTheme);
    that.setData({news:data, pageShow:'block'});
    wx.setNavigationBarTitle({
      title: data.title //设置标题      
    })
  }, null, ()=> {
    that.setData({loading: false});
  });

  //请求日报额外信息（主要是评论数和推荐人数）
  requests.getStoryExtraInfo(id, (data) => {
    console.log('extra', data);
    that.setData({extraInfo : data});
  });
}