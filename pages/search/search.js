const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oils : [],
    results:[],
    searchKey:[],
    searchLog:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSearchHot()
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
  /**
   * 用户输入监听
   */
  bindInput:function(e){
    var value = e.detail.value
    this.preSearch(value)
  },
  /**
   * 点击预览条目
   */
  searchPre:function(e){
    console.log(e)
    var position = e.currentTarget.dataset.position
    this.search(this.data.oils[position].name)
  },
  /**
   * 用户点击键盘搜索按钮
   */
  searchConfirm:function(e){
    var value = e.detail.value
    this.search(value)
  },
  /**
   * 搜索
   */
  search:function(value){
    var that = this
    wx.request({
      url: app.config.host +'search/all',
      method : 'POST',
      data:{
        uToken: app.globalData.uToken,
        word : value
      },
      success : function(res){
        console.log(res)
        if (res.data.errNo == 200) {
          that.setData({
            results: res.data.data.oils
          })
        } else {

        }
      }
    })
  },
  /**
   * 预先搜索
   */
  preSearch:function(keyWords){
    var that = this
    if(keyWords == ""){
      return
    }
    wx.request({
      url: app.config.host+'search/complete',
      method : "POST",
      data:{
        uToken: app.globalData.uToken,
        word: keyWords
      },
      success:function(res){
        console.log(res)
        if (res.data.errNo == 200) {
          that.setData({
            oils : res.data.data.oils
          })
        } else {

        }
      }
    })
  },
  /**
   * 点击搜索结果
   */
  itemClick:function(e){
    wx.navigateTo({
      url: '/pages/single/single',
    })
  },
  /**
   * 获取搜索热词和搜索历史
   */
  getSearchHot: function () {
    var that = this;
    wx.showLoading({
      title: '正在请求',
    })
    wx.request({
      url: app.config.host + 'guest/search/keys',
      method: 'POST',
      data: {
        token: app.globalData.token
      },
      success: function (res) {
        console.log("热搜结果")
        console.log(res)
        wx.hideLoading()
        if (res.data.errNo == 200) {
          that.setData({
            searchKey:res.data.data.searchKey,
            searchLog:res.data.data.searchLog
          })
        } else {

        }
      }
    })
  }
})