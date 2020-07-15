const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    likeImages: ['../../images/unlike.png','../../images/like2.png'],
    currentTab : 0,
    says:[],
    pageNo:1,
    isRequesting:false
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
      currentTab: position,
      pageNo:1,
      says:[]
    })
    this.getOilSayList()
  },
  toDetail:function(e){
    let index = e.currentTarget.dataset.index;
    var id = this.data.says[index].id
    wx.navigateTo({
      url: '/pages/detail/detail?id='+id,
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
    this.setData({
      isRequesting:true
    })
    var that = this
    wx.request({
      url: app.config.host+'note/get/list',
      method:'POST',
      data:{
        uToken:app.globalData.uToken,
        type: that.data.currentTab+1,
        page:that.data.pageNo
      },
      success:function(res){
        console.log(res)
        if(that.data.pageNo == 1){
          that.setData({
            says:[]
          })
        }
        if(res.data.errNo == 200){
          that.setData({
            says: that.data.says.concat(res.data.data.list),
            isRequesting:false
          })
        }
      }
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.isRequesting) {
      var currentPageNo = this.data.pageNo;
      this.setData({
        pageNo: currentPageNo + 1,

      })
      this.getOilSayList();
    }
  },
  loadMore:function(e){
    console.log('loadMore')
    if (!this.data.isRequesting) {
      var currentPageNo = this.data.pageNo;
      this.setData({
        pageNo: currentPageNo + 1,

      })
      this.getOilSayList();
    }
  },
  searchOil: function (e) {
    var that = this
    var keyword = e.detail.keyword
    if(keyword.length < 2){
      wx.showToast({
        title: '关键词太短啦',
      })
      return
    }
    wx.request({
      url: app.config.host +'note/search',
      method:'POST',
      data:{
        uToken:app.globalData.uToken,
        word:keyword,
        page:1,
        pageSize:30
      },
      success:function(res){
        console.log("搜索结果")
        console.log(res)
        if(res.data.errNo == 200){
          that.setData({
            currentTab:0,
            says: res.data.data.searchList
          })
        }else{

        }
      }
    })
  }
})