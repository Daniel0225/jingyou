const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    likes:['关注','取消关注'],
    currentTab:0,
    pageNum:0/0,
    id:0,
    authorInfo:"",
    noteInfo:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    
    this.setData({
      id: parseInt(options.id)
    })
    this.getDetail()
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
  bindChange:function(e){
    this.setData({
      currentTab:e.detail.current,
      pageNum: (e.detail.current + 1) + "/" + this.data.noteInfo.imgs.length
    })
  },
  /**
   * 获取精油说详情
   */
  getDetail:function(){
    const that = this
    app.request(app, {
      url: app.config.host +'note/get/detail',
      method:'POST',
      data:{
        uToken: app.globalData.uToken,
        id:that.data.id
      },
      success:function(res){
        console.log(res)
        if(res.data.errNo == 200){
          that.setData({
            authorInfo:res.data.data.authorInfo,
            noteInfo:res.data.data.noteInfo,
            pageNum: "1/" + res.data.data.noteInfo.imgs.length
          })
        }
      }
    })
  },
  /**
   * 关注作者
   */
  subscribe:function(){
    var that = this
    wx.request({
      url: app.config.host+'note/subscribe',
      method:'POST',
      data:{
        uToken:app.globalData.uToken,
        userId: that.data.authorInfo.userId,
        status:that.data.authorInfo.subscribe == 0 ? 1 : 0
      },
      success:function(res){
        console.log(res)
        if(res.data.errNo == 200){
          that.setData({
            ['authorInfo.subscribe']: that.data.authorInfo.subscribe == 0 ? 1 : 0
          })
        }else{
          wx.showToast({
            title: res.data.errMsg,
          })
        }
      }
    })
  },
  /**
   * 点赞
   */
  like:function(){
    var that = this
    wx.request({
      url: app.config.host+'note/like/item',
      method:'POST',
      data:{
        uToken:app.globalData.uToken,
        id:that.data.id,
        status:that.data.noteInfo.likeStatus == 0?1:0
      },
      success:function(res){
        console.log(res)
        if(res.data.errNo == 200){
          that.setData({
            ['noteInfo.likeStatus']: that.data.noteInfo.likeStatus == 0 ? 1 : 0
          })
        }else{

        }
      }
    })
  },
  /**
   * 收藏
   */
  collect:function(){
    var that = this
    wx.request({
      url: app.config.host+'note/collect/item',
      method:'POST',
      data:{
        uToken:app.globalData.uToken,
        id:that.data.id,
        status: that.data.noteInfo.collectStatus == 0 ? 1 : 0
      },
      success:function(res){
        console.log(res)
        if(res.data.errNo == 200){
          that.setData({
            ['noteInfo.collectStatus']: that.data.noteInfo.collectStatus == 0 ? 1 : 0
          })
        }else{

        }
      }
    })
  }
})