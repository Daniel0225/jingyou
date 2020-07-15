const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    share:1,//是否公开 1 是 0 否
    title:'',
    content:'',
    imgArr:[],
    tags:[],
    tagIds:[],
    hideAdd:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    
    wx.getStorage({
      key:'oil',
      success(res){
        console.log(res.data)
        var cache = res.data
        wx.showModal({
          title: '',
          content: '草稿箱有未发布的精油说是否进入编辑？',
          success: function (res) {
            if (res.confirm) {
              that.setData({
                title: cache.title,
                content: cache.content,
                imgArr: cache.addImgs,
                share: cache.share,
                tags: cache.tags
              })
              var ids = []
              for (var i = 0; i < that.data.tags.length; i++) {
                ids = ids.concat(that.data.tags[i].id)
              }
              that.setData({
                tagIds: ids
              })
            } else {
              wx.clearStorage('oil')
            }
          }
        })
      }
    })
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
              if (uploadImgCount == tempFilePaths.length) {
                wx.hideToast();
              }  
              //显示图片
              var imgArrNow = that.data.imgArr;
              imgArrNow = imgArrNow.concat(data.data.url)
              that.setData({
                imgArr: that.data.imgArr.concat(data.data.url)
              })
              that.showAddImage()
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
    this.showAddImage()
  },

  /** 显示图片 */
  showAddImage: function (e) {
    var imgArr = this.data.imgArr;
    var isHide = false
    if(imgArr.length == 9){
      isHide = true
    }else{
      isHide = false
    }
    this.setData({
      hideAdd:isHide
    })
  },
  toAdd:function(){
    var that = this
    if(this.data.title == ''){
      wx.showToast({
        title: '请先填写标题',
      })
      return
    }
    if(this.data.content == ''){
      wx.showToast({
        title: '请先填写内容',
      })
      return
    }
    wx.navigateTo({
      url: '/pages/add/add?title='+this.data.title+'&content='+this.data.content,
      events:{
        selectOil:function(data){
          that.setData({
            tags: data
          })
          var ids = []
          for(var i=0;i<that.data.tags.length;i++){
            ids = ids.concat(that.data.tags[i].id)
          }
          that.setData({
            tagIds:ids
          })
        }
      },
      success:function(res){
        res.eventChannel.emit('tags',{
          data:that.data.tags
        })
      }
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
        addImgs:that.data.imgArr,
        share:that.data.share,
        oilIds:that.data.tagIds
      },
      success:function(res){
        console.log(res)
        if(res.data.errNo == 200){
          wx.switchTab({
            url: '/pages/say/say',
          })
        }else{
          wx.showToast({
            title: res.data.errMsg,
          })
        }
      }
    })
  },
  check:function(e){
    var position = parseInt(e.currentTarget.dataset.position)
    console.log(position)
    this.setData({
      share: position
    })
  },
  deleteTag:function(res){
    console.log(res)
    var arr  = []
    for(var i=0;i<this.data.tags.length;i++){
      if(i != res.currentTarget.dataset.index){
        arr = arr.concat(this.data.tags[i])
      }
    }
    this.setData({
      tags:arr
    })
  },
  save:function(e){
    if (this.data.title == '') {
      wx.showToast({
        title: '请先填写标题',
      })
      return
    }
    if (this.data.content == '') {
      wx.showToast({
        title: '请先填写内容',
      })
      return
    }
    var oil = { title: this.data.title, content: this.data.content, share: this.data.share, addImgs: this.data.imgArr,
      tags:this.data.tags}
    wx.setStorageSync('oil', oil)
    wx.showToast({
      title: '保存成功',
    })
  }
})