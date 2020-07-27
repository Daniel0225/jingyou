//app.js
var utilMd5 = require('./utils/MD5.js'); 
 
App({
  config: {
    host: 'https://test-wapi.jingyoubox.com/' // 这个地方填写你的域名
  },

  onLaunch: function() {
    
    const that = this;
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    // 胶囊按钮位置信息
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    console.log(systemInfo)
    console.log(menuButtonInfo)
    // 导航栏高度 = 状态栏到胶囊的间距（胶囊距上距离-状态栏高度） * 2 + 胶囊高度 + 状态栏高度
    that.globalData.navBarHeight = (menuButtonInfo.top - systemInfo.statusBarHeight) * 2 + menuButtonInfo.height + systemInfo.statusBarHeight;
    that.globalData.menuRight = systemInfo.screenWidth - menuButtonInfo.right;
    that.globalData.menuBotton = menuButtonInfo.top - systemInfo.statusBarHeight;
    that.globalData.menuHeight = menuButtonInfo.height;

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  /**
   * type 0-uToken请求，1-token请求
   */
  request: (options, type = 0, queryNum = 0) => {
    if (queryNum >= 5) { // 防死循环
      return;
    }
    const that = this;
    if (type === 0) { // uToken请求
      const {uToken} = options.data;
      if (! uToken) {
        that.getToken(() => {
          wx.getSetting({
            success: res => {
              if (res.authSetting['scope.userInfo']) {
                wx.login({
                  success: function (res) {
                    that.getUToken(res.code, (uToken) => {
                      Object.assign(options.data, {uToken});
                      wx.request(options);
                    });
                  }
                })
              } else { // 引导去授权 https://blog.csdn.net/qiushi_1990/article/details/97417715

              }
            }
          });
        });
      } else {
        const {seccess} = options;
        options.seccess = (res) => {
          if (res.errNo === 6014) {
            options.data.uToken = '';
            that.request(options, type, queryNum);
          } else {
            seccess(res);
          }
        };
        wx.request(options);
      }
    } else { // token请求
      const {token} = options.data;
      if (! token) {
        that.getToken((token) => {
          Object.assign(options.data, {token});
          wx.request(options);
        });
      } else {
        const {seccess} = options;
        options.seccess = (res) => {
          if (res.errNo === 6004) {
            options.data.token = '';
            that.request(options, type, queryNum);
          } else {
            seccess(res);
          }
        };
        wx.request(options);
      }
    }
    queryNum ++;
  },
  getToken: (fn = null) => {
    var that = this
    var timestamp = Date.parse(new Date());
    wx.request({
      url: that.config.host + 'token',
      method: 'POST',
      data: {
        appid: 1001,
        timestamp: timestamp,
        sign: that.createSign()
      },
      success: (res) => {
        if (res.data.errNo == 200) {
          that.globalData.token = res.data.data.token;
          if (typeof fn === 'function') {
            fn(that.globalData.token);
          }
        } else {
          wx.showToast({
            title: res.data.errMsg,
          })
        }
      },
      fail: (e) => {
        console.error(e);
      }
    })
  },
  getUToken: (code, fn = null) => {
    var that = this
    wx.request({
      url: that.config.host + 'miniprogram/authcode2Session',
      method:'POST',
      data:{
        token: that.globalData.token,
        code: code
      },
      success: (res) => {
        if (res.data.errNo == 200) {
          that.globalData.uToken = res.data.data.uToken;
          if (typeof fn === 'function') {
            fn(that.globalData.uToken);
          }
        } else {
          wx.showToast({
            title: res.data.errMsg,
          })
        }
      }
    })
  },
  /**
   * 生成签名
   */
  createSign: function () {
    var timestamp = Date.parse(new Date());
    var str = 'appid' + 1001 + 'timestamp' + timestamp + '74057b6288f54dfc8f0d8de55ee7fbfe'
    return utilMd5.hexMD5(str)
  },

  globalData: {
    uToken:"",
    token:"",
    navBarHeight: 0, // 导航栏高度
    menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
    menuBotton: 0, // 胶囊距底部间距（保持底部间距一致）
    menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
    userInfo: null
  }
})