//app.js
App({
  onLaunch: function () {
    var that = this;
    //获取应用设置
    var settingData = wx.getStorageSync(that.constant.SETTING);
    if(settingData){
      this.globalData.appSetting = settingData;
    }
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  //更新应用设置
  updateupdateAppSetting: function(data){
    var that = this;
    try{
      wx.setStorageSync(that.constant.SETTING, data);
    }catch(e){
      return false;
    }
    return true;
  },
  //获取缓存
  getCache:function(){
    return wx.getStorageSync(that.constant.CACHE);
  },
  globalData:{
    userInfo:null,
    //应用设置
    appSetting:{
      theme: 'light',//主题
      noPicMode: false//无图模式
    }
  },
  constant:{
    SETTING: 'ZHIHU_SETTING',
    CACHE: 'ZHIHU_CACHE'
  },
  debug: true//调试程序
})