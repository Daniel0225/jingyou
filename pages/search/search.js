const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:0,// 预搜索 0 单方 1复方
    searchWord:"",
    isDefault:true,
    oils : [],
    results:[],
    searchKey:[],
    searchLog:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if(options.toString == {}){
      this.getSearchHot()
    }else{
      this.setData({
        type: parseInt(options.type)
      })
      this.preSearchOil()
    }
    
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
    this.setData({
      oils: [],
      results: []
    })
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
            oils : res.data.data.oils,
            isDefault:true
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
      url: '/pages/single/single?id='+e.currentTarget.dataset.id,
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
            searchKey:res.data.data.searchKey,
            searchLog:res.data.data.searchLog
          })
        } else {

        }
      }
    })
  },
  /**
   * 用户点击热搜 或者 历史搜索
   */
  clickHot:function(e){
    console.log(e)
    var value = e.currentTarget.dataset.word
    this.setData({
      searchWord : value
    })
    this.search(value)
  },
  /**
   * 预搜索 单方精油 复方精油
   */
  preSearchOil:function(){
    wx.showLoading({
      title: '正在请求',
    })
    var that = this
    wx.request({
      url: app.config.host + 'search/completeDefault',
      method:"POST",
      data:{
        uToken:app.globalData.uToken,
        type: that.data.type,
      },
      success:function(res){
        console.log(res)
        wx.hideLoading()
        that.setData({
          oils: res.data.data.oils,
          isDefault: false
        })
        if(that.data.type == 0){
          
        }else{

        }
      },
      fail:function(res){
        wx.hideLoading()
      }
    })
  }
})