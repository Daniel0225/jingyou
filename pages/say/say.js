const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab : 0,
    says:[0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.getOilSayList()
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
  select:function(e){
    var position = parseInt(e.currentTarget.dataset.position)
    this.setData({
      currentTab: position
    })
  },
  toDetail:function(e){
    let index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '/pages/detail/detail?index='+index,
    })
  },
  toCreate:function(e){
    wx.navigateTo({
      url: '/pages/publish/publish',
    })
  },
  /**
   * 获取精油说列表
   */
  getOilSayList:function(){
    wx.request({
      url: app.config.host+'note/get/list',
      method:'POST',
      data:{
        uToken:app.globalData.uToken,
        type: 1,
      },
      success:function(res){
        console.log(res)
      }
    })
  }
})