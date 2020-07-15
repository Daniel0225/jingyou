//获取应用实例
const app = getApp()
var utilMd5 = require('../../utils/MD5.js'); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAuth : false,
    searchKey: [],
    searchLog: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getToken();
    this.checkAuth();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  toSingle:function(e){
    wx.navigateTo({
      url: '../search/search?keyWords='+e.currentTarget.dataset.word,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  toSearch:function(){
    wx.navigateTo({
      url: '../search/search',
    })
  },
  toOilList:function(e){
    var type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: '../search/search?type='+type,
    })
  },
  //获取token
  getToken: function (e) {
    var that = this
    var timestamp = Date.parse(new Date());
    wx.request({
      url: app.config.host + 'token',
      method: 'POST',
      data: {
        appid: 1001,
        timestamp: timestamp,
        sign: that.createSign()
      },
      success: function (res) {
        console.log(res)
        if (res.data.errNo == 200) {
          app.globalData.token = res.data.data.token
          that.getguestSearchHot()
        } else {
          wx.showToast({
            title: res.data.errMsg,
          })
        }
      },
      fail: function (e) {

      }
    })
  },
  /**
   * 生成签名
   */
  createSign: function (e) {
    var timestamp = Date.parse(new Date());
    var str = 'appid' + 1001 + 'timestamp' + timestamp + '74057b6288f54dfc8f0d8de55ee7fbfe'
    return utilMd5.hexMD5(str)
  },
  /**
   * 游客
   * 获取搜索热词和搜索历史
   */
  getguestSearchHot:function(){
    console.log('获取游客的热搜')
    var that = this;
    wx.showLoading({
      title: '正在请求',
    })
    var url = 'guest/search/keys'
    wx.request({
      url: app.config.host + url,
      method: 'POST',
      data: {
        token: app.globalData.token
      },
      success: function (res) {
        console.log(res)
        wx.hideLoading()
        if (res.data.errNo == 200) {
          that.setData({
            searchKey: res.data.data.searchKey,
            searchLog: res.data.data.searchLog
          })
        } else {

        }
      }
    })
  },
  /**
   * 登录用户
   * 获取搜索热词和搜索历史
   */
  getSearchHot: function () {
    console.log('获取登陆用户的热搜')
    var that = this;
    wx.showLoading({
      title: '正在请求',
    })
    wx.request({
      url: app.config.host + 'search/keys',
      method: 'POST',
      data: {
        uToken: app.globalData.uToken
      },
      success: function (res) {
        console.log("热搜结果")
        console.log(res)
        wx.hideLoading()
        if (res.data.errNo == 200) {
          that.setData({
            searchKey: res.data.data.searchKey,
            searchLog: res.data.data.searchLog
          })
        } else {

        }
      }
    })
  },
  /**
   * 授权操作
   */
  bindGetUserInfo(res) {
    var that = this
    if (res.detail.userInfo) {
      that.wxLogin();
    } else {
      console.log("点击了拒绝授权");
    }
  },
  /**
   * 判断用户是否已授权
   */
  checkAuth:function(){
    var that = this
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          console.log(res)
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              app.globalData.userInfo = res.userInfo
              that.setData({
                isAuth:true
              })
              that.wxLogin()
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      },
      fail:function(e){
        console.log(e)
      }
    })
  },
  wxLogin:function(){
    var that = this
    wx.login({
      success: function (res) {
        console.log(res);
        that.getUToken(res.code)
      }
    })
  },
  /**
   * 获取uToken
   */
  getUToken:function(code){
    var that = this
    wx.request({
      url: app.config.host + 'miniprogram/authcode2Session',
      method:'POST',
      data:{
        token: app.globalData.token,
        code:code
      },
      success:function(res){
        console.log(res)
        if(res.data.errNo == 200){
          app.globalData.uToken = res.data.data.uToken
          that.getSearchHot()
        }else{
          
        }
      }
    })
  },
  toSay:function(e){
    wx.switchTab({
      url: '/pages/say/say',
    })
  }
})