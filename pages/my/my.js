const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    says: [],
    infos:[],
    userInfo:"",
    type:1,
    pageNo: 1,
    isRequesting: false
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
    this.getUser()
    this.getList()
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
  select: function (e) {
    var position = parseInt(e.currentTarget.dataset.position)
    this.setData({
      currentTab: position,
      type:position+1,
      pageNo:1
    })
    this.getList()
  },
  toDetail: function (e) {
    let index = e.currentTarget.dataset.index;
    var id = this.data.says[index].id
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id,
    })
  },
  toChange:function(e){
    wx.navigateTo({
      url: '/pages/info/info',
    })
  },
  /**
   * 获取个人信息
   */
  getUser:function(){
    var that = this
    wx.request({
      url: app.config.host+'user/get/page',
      method:'POST',
      data:{
        uToken:app.globalData.uToken
      },
      success:function(res){
        console.log(res)
        if(res.data.errNo == 200){
          that.setData({
            userInfo:res.data.data
          })
        }
      }
    })
  },
  /**
   * 获取主页列表数据
   */
  getList:function(){
    this.setData({
      isRequesting: true
    })
    var that = this
    wx.request({
      url: app.config.host+'user/page/list',
      method:'POST',
      data:{
        uToken:app.globalData.uToken,
        type:that.data.type,
        page: that.data.pageNo
      },
      success:function(res){
        console.log(res)
        if(res.data.errNo==200){
          if(that.data.type != 3){
            if (that.data.pageNo == 1) {
              that.setData({
                says: []
              })
            }
            that.setData({
              says: that.data.says.concat(res.data.data.list),
              isRequesting: false
            })
          }else{
            if (that.data.pageNo == 1) {
              that.setData({
                infos: []
              })
            }
            that.setData({
              infos: that.data.infos.concat(res.data.data.list),
              isRequesting: false
            })
          }
        }
      }
    })
  },
  loadMore: function (e) {
    if (!this.data.isRequesting) {
      var currentPageNo = this.data.pageNo;
      this.setData({
        pageNo: currentPageNo + 1,

      })
      this.getList();
    }
  },
  toSingle:function(e){
    wx.navigateTo({
      url: '/pages/single/single?id=' + e.currentTarget.dataset.id,
    })
  }
})