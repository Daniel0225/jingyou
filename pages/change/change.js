const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sign : ""
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
  inputSign:function(e){
    console.log(e)
    this.setData({
      sign : e.detail.value
    })
    

  },
  /**
   * 修改签名
   */
  change:function(){
    var that = this
    wx.request({
      url: app.config.host+'user/save/signature',
      method:"POST",
      data:{
        uToken:app.globalData.uToken,
        content: that.data.sign
      },
      success:function(res){
        console.log(res)
        if(res.data.errNo == 200){
          wx.showToast({
            title: '修改成功',
          })
          wx.navigateBack({})
        }
      }
    })
  }
  
})