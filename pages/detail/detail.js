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
    extraInfo: {},
    modalMsgHidden: true,
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
  },
  reloadEvent: function(){
    loadData.call(this);
  },
  showModalEvent: function(){
    this.setData({modalHidden:false});
  },
  hideModalEvent: function(){
    this.setData({modalHidden: true});
  },
  //现在图片预览不支持调试显示，看不到效果
  //图片预览【当前是当前图片，以后会考虑整篇日报的图片预览】
  previewImgEvent: function(e){
    var src = e.currentTarget.dataset.src;
    if(src && src.length > 0){
      wx.previewImage({
        // current: 'String', // 当前显示图片的链接，不填则默认为 urls 的第一张
        urls: [src]
      });
    }
  },
  //跳转到评论页面
  toCommentPage: function(e){
    var storyId = e.currentTarget.dataset.id;
    var longCommentCount = this.data.extraInfo ? this.data.extraInfo.long_comments : 0;//长评论数
    var shortCommnetCount = this.data.extraInfo ? this.data.extraInfo.short_comments : 0;//短评论数
    //跳转到评论页面，并传递评论数目信息
    wx.navigateTo({
      url: '../comment/comment?lcount=' + longCommentCount + '&scount=' + shortCommnetCount + '&id=' + storyId
    });
  },
  //收藏
  collectOrNot: function(){
    var pageData = wx.getStorageSync('pageData') || []
    console.log(pageData);
    if(this.data.isCollect){
      for(let i=0;i<pageData.length;i++){
        if(pageData[i].id == this.data.id){
          pageData.splice(i,1);
          this.setData({isCollect: false});
          break;
        }
      }
    }else{
      var images = new Array(this.data.news.image);
      var item = {id : this.data.id, title: this.data.news.title, images : images};
      console.log(item);
      pageData.unshift(item);
      this.setData({isCollect:true});
    }
    try{
      wx.setStorageSync('pageData', pageData);
    }catch(e){

    }
    console.log(pageData);
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