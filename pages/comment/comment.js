// pages/comment/comment.js
var requests = require('../../requests/request.js');
var utils = require('../../utils/util.js');

Page({
  data:{
    storyId : null,
    loading : false,
    toastHidden : true,
    longCommentData : [],
    shortCommentData : null,
    shortCommentCount : 0,
    longCommentCount : 0,
    loadingMsg : '加载中...',
    toastMsg : ''
  },
  //获取传递过来的日报id和评论数目
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var storyId = options['id'];
    var longCommentCount = parseInt(options['lcount']);
    var shortCommentCount = parseInt(options['scount']);
    this.setData({
      storyId: storyId,
      longCommentCount: longCommentCount,
      shortCommentCount: shortCommentCount
    });
  },
  //加载长评列表
  onReady:function(){
    // 页面渲染完成
    var storyId = this.data.storyId;
    var that = this;
    this.setData({
      loading: true,
      toastHidden: true
    });

    //如果长评数量大于0，则加载长评，否则加载短评
    if(this.data.longCommentCount > 0){
      requests.getStoryLongComments(storyId, (data) => {
        that.setData({
          longCommentData : covertData(data.comments)
        }, () => {
          that.setData({toastHidden : false, toastMsg : '请求失败'});
        }, () => {
          taht.setData({loading:false});
        });
      })
    }else{
      loadShortComments.call(this);
    }
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
  //加载短评列表
  loadShortCommentEvent: function(){
    //已经加载过就无需再次加载 判断是否为null
    if(this.data.shortCommentData)
      return;
    loadShortComments.call(this);
  },
  toastChangeEvent: function(){
    this.setData({toastHidden: true});
  }
});

/**
 * 加载短评列表
 */
function loadShortComments(){
  var storyId = this.data.storyId;
  var that = this;
  this.setData({loading : true, toastHidden : true});
  requests.getStoryShortComments(storyId, (data) => {
    that.setData({shortCommentData : covertData(data.comments)});
  }, () => {
    that.setData({toastHidden : false, toastMsg : '请求失败'});
  }, () => {
    that.setData({loading : false});
  });
}

function covertData(comments){
  if(comments)
  {
    for(let i=0, len = comments.length; i < len;i++){
      comments[i]['avatar'] = utils.fixImgPrefix(comments[i]['avatar']);
      comments[i]['time'] = getDateDesc(comments[i]['time']);
    }
  }
  return comments;
}

function getDateDesc(timestamp){
  var date = new Date(timestamp * 1000);
  return (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
}