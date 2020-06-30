const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'',
    content:'',
    imgArr:[],
    tags:[0,0,0,0,0,0]
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
  titleInput:function(e){
    this.setData({
      title:e.detail.value
    })
  },
  contentInput:function(e){
    this.setData({
      content:e.detail.value
    })
  },
  /** 选择图片 */
  chooseImage: function () {
    var that = this;
    wx.chooseImage({
      count: 9 - that.data.imgArr.length,//最多选择9张图片
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
        var uploadImgCount = 0;
        for (var i = 0, h = tempFilePaths.length; i < h; i++) {
          wx.uploadFile({
            url: app.config.host + 'file/upload?uToken=' + app.globalData.uToken,
            filePath: tempFilePaths[i],
            name: 'uploadfile_ant',
            header: {
              "Content-Type": "multipart/form-data"
            },  
            success:function(res){
              uploadImgCount++;
              var data = JSON.parse(res.data);  
              console.log(res)
              if (uploadImgCount == tempFilePaths.length) {
                wx.hideToast();
              }  
              //显示图片
              var imgArrNow = that.data.imgArr;
              console.log(data.data.url)
              imgArrNow = imgArrNow.concat(data.data.url)
              console.log(imgArrNow);
              that.setData({
                imgArr: that.data.imgArr.concat(data.data.url)
              })
              console.log(that.data.imgArr);
            }
          })
        }
      }
    })
  },

  /** 删除图片 */
  deleteImv: function (e) {
    var imgArr = this.data.imgArr;
    var itemIndex = e.currentTarget.dataset.id;
    imgArr.splice(itemIndex, 1);
    console.log(imgArr);
    this.setData({
      imgArr: imgArr
    })
    
  },

  /** 显示图片 */
  showImage: function (e) {
    // var imgArr = this.data.imgArr;
    // var itemIndex = e.currentTarget.dataset.id;

    // wx.previewImage({
    //   current: imgArr[itemIndex], // 当前显示图片的http链接
    //   urls: imgArr // 需要预览的图片http链接列表
    // })
  },
  toAdd:function(){
    wx.navigateTo({
      url: '/pages/add/add',
    })
  },
  /**
   * 发布精油说
   */
  createOil:function(){
    var title = this.data.title
    if(title == ''){
      wx.showToast({
        title: '请输入标题',
      })
      return
    }
    var content = this.data.content
    if(content == ''){
      wx.showToast({
        title: '请输入内容',
      })
      return
    }
    var imageSize = this.data.imgArr.length
    if(imageSize == 0 ){
      wx.showToast({
        title: '请上传图片',
      })
      return
    }
    var that = this
    wx.request({
      url: app.config.host+'note/save/item',
      method:"POST",
      data:{
        uToken:app.globalData.uToken,
        id:0,
        title:that.data.title,
        content:that.data.content,
        authorName:app.globalData.userInfo.nickName,
        authorHeadImg:app.globalData.userInfo.avatarUrl,
        addImgs:that.data.imgArr
      },
      success:function(res){
        console.log(res)
      }
    })
  }
})