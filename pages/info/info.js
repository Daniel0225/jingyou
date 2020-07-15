const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: ""
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
  toChange: function (e) {
    wx.navigateTo({
      url: '/pages/change/change',
    })
  },
  /**
   * 获取个人信息
   */
  getUser: function () {
    var that = this
    wx.request({
      url: app.config.host + 'user/get/page',
      method: 'POST',
      data: {
        uToken: app.globalData.uToken
      },
      success: function (res) {
        console.log(res)
        if (res.data.errNo == 200) {
          that.setData({
            userInfo: res.data.data
          })
        }
      }
    })
  },
  /** 选择图片 */
  chooseImage: function () {
    var that = this;
    wx.chooseImage({
      count: 1,//最多选择9张图片
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        console.log(res);
        if (res.tempFilePaths.count == 0) {
          return;
        }
        //上传图片
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 10000
        })
        wx.uploadFile({
          url: app.config.host + 'user/save/headImg?uToken=' + app.globalData.uToken,
          filePath: tempFilePaths[0],
          name: 'uploadfile_ant',
          header: {
            "Content-Type": "multipart/form-data"
          },
          success: function (res) {
            var data = JSON.parse(res.data);
            console.log(res)
            wx.hideToast()
            //显示图片
            that.setData({
              ['userInfo.headImg']: tempFilePaths[0]
            })
          }
        })
      }
    })
  }
})