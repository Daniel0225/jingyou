const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    insenceImages: ['../../images/unincense.png','../../images/incense.png'],
    applyImages: ['../../images/unapply.png','../../images/apply.png'],
    edibleImages: ['../../images/unedible.png','../../images/edible.png'],
    stars: ['../../images/like.png','../../images/star.png'],
    types:['单方','复方'],
    showOne : false,
    showTwo:false,
    showThree: false,
    showFour: false,
    showFive: false,
    showMulty:false,
    id: 0,
    oil:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      id: parseInt(options.id)
    })
    this.getOilDetail()
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
  hideOne:function(){
    this.setData({
      showOne : !this.data.showOne
    })
  },
  hideTwo:function(){
    this.setData({
      showTwo: !this.data.showTwo
    })
  },
  hideThree:function(){
    this.setData({
      showThree: !this.data.showThree
    })
  },
  hideFour: function () {
    this.setData({
      showFour: !this.data.showFour
    })
  },
  hideFive: function () {
    this.setData({
      showFive: !this.data.showFive
    })
  },
  hideMulty: function () {
    this.setData({
      showMulty: !this.data.showMulty
    })
  },
  createSay:function(){
    wx.navigateTo({
      url: '/pages/publish/publish',
    })
  },
  /**
   * 获取精油详情
   */
  getOilDetail: function () {
    var that = this
    wx.request({
      url: app.config.host + 'oil/detail',
      method: "POST",
      data: {
        uToken: app.globalData.uToken,
        id:that.data.id
      },
      success:function(res){
        console.log(res)
        if (res.data.errNo == 200) {
          that.setData({
            oil: res.data.data
          })
        }else{
          wx.showToast({
            title: '获取数据出错',
          })
        }
      }
    })
  },
  collect:function(e){
    var that = this
    wx.request({
      url: app.config.host+'oil/collect/item',
      method:'POST',
      data:{
        uToken:app.globalData.uToken,
        id:that.data.oil.id,
        status: that.data.oil.collectStatus == 0 ? 1 : 0
      },
      success:function(res){
        console.log(res)
        if (res.data.errNo == 200) {
          that.setData({
            ["oil.collectStatus"] : that.data.oil.collectStatus == 0 ? 1 : 0
          })
          
        }else{

        }
      }
    })
  },
  share:function(e){
    wx.showToast({
      title: '分享',
    })
  }
})