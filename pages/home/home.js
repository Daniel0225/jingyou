// pages/home/home.js
//获取应用实例
const app = getApp()
var utilMd5 = require('../../utils/MD5.js'); 
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getToken();
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
  toSingle:function(){
    wx.navigateTo({
      url: '../single/single',
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
  toOilList:function(){
    wx.navigateTo({
      url: '../search/search',
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
          console.log(app.globalData.token)
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
})