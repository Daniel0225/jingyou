const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addItems:[],
    results: [],
    recommends:[],
    title:"",
    content:'',
    value:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    let eventChannel = this.getOpenerEventChannel();
    eventChannel.on('tags', function (data) {
      console.log('传递的参数', data);
      that.setData({
        addItems:data.data
      })
    })
    this.setData({
      title:options.title,
      content:options.content
    })
    this.recommend()
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
    const event = this.getOpenerEventChannel()
    event.emit('selectOil', this.data.addItems)
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
   * 获取推荐
   */
  recommend:function(){
    var that = this
    wx.request({
      url: app.config.host + 'note/getoils/findInContent',
      method:'POST',
      data:{
        uToken:app.globalData.uToken,
        title:that.data.title,
        content: that.data.content,

      },
      success:function(res){
        console.log(res)
        if(res.data.errNo == 200){
          //修改已经添加了的数据type = -1 显示已添加
          var arr = res.data.data
          for(var i=0;i<arr.length;i++){
            for(var j=0;j<that.data.addItems.length;j++){
              if(arr[i].id == that.data.addItems[j].id){
                arr[i].type=-1
              }
            }
          }
          that.setData({
            recommends: arr
          })
        }
      }
    })
  },
  /**
   * 搜索
   */
  search: function () {
    this.setData({
      results: []
    })
    var that = this
    wx.request({
      url: app.config.host + 'search/all',
      method: 'POST',
      data: {
        uToken: app.globalData.uToken,
        word: that.data.value
      },
      success: function (res) {
        console.log(res)
        if (res.data.errNo == 200) {
          //修改已经添加了的数据type = -1 显示已添加
          var arr = res.data.data.oils
          for (var i = 0; i < arr.length; i++) {
            for (var j = 0; j < that.data.addItems.length; j++) {
              if (arr[i].id == that.data.addItems[j].id) {
                arr[i].type = -1
              }
            }
          }
          that.setData({
            results: arr
          })
        } else {
          wx.showToast({
            title: res.data.errMsg,
          })
        }
      }
    })
  },
  /**
   * 用户输入监听
   */
  bindInput: function (e) {
    this.setData({
      value: e.detail.value
    })
  },
  add:function(e){
    
    var index = e.currentTarget.dataset.index
    var item = this.data.results[index]
    var contain = false
    for(var i=0;i<this.data.addItems.length;i++){
      if(item.id == this.data.addItems[i].id){
        contain = true
      }
    }
    if(!contain){
      var arr = this.data.results
      arr[index].type = -1
      this.setData({
        addItems: this.data.addItems.concat(item),
        results : arr
      })
    }else{
      var news = []
      var arr = this.data.results
      arr[index].type = 0
      for(var i=0;i<this.data.addItems.length;i++){
        if(this.data.addItems[i].id != item.id){
          news = news.concat(item)
        }
      }
      this.setData({
        addItems: news,
        results: arr
      })
    }
    
  },
  addRec:function(e){
    var index = e.currentTarget.dataset.index
    var item = this.data.recommends[index]
    var contain = false
    for (var i = 0; i < this.data.addItems.length; i++) {
      if (item.id == this.data.addItems[i].id) {
        contain = true
      }
    }
    if (!contain) {
      var arr = this.data.recommends
      arr[index].type = -1
      this.setData({
        addItems: this.data.addItems.concat(item),
        recommends: arr
      })
    } else {
      var news = []
      var arr = this.data.recommends
      arr[index].type = 0
      for (var i = 0; i < this.data.addItems.length; i++) {
        if (this.data.addItems[i].id != item.id) {
          news = news.concat(item)
        }
      }
      this.setData({
        addItems: news,
        recommends: arr
      })
    }
  }
})