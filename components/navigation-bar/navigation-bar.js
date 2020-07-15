const app = getApp()
Component({
    properties: {
        // defaultData（父页面传递的数据）
        defaultData: {
            type: Object,
            value: {
                title: "我是默认标题"
            },
            observer: function(newVal, oldVal) {}
        }
    },
    data: {
        keyword:"",
        navBarHeight: app.globalData.navBarHeight,
        menuRight: app.globalData.menuRight,
        menuBotton: app.globalData.menuBotton,
        menuHeight: app.globalData.menuHeight,
    },
    attached: function() {

    },
    methods: {
      searchOilFun(){
        const myEventDetail = {} // detail对象，提供给事件监听函数
        myEventDetail.keyword = this.data.keyword
        this.triggerEvent("run", myEventDetail)
      },
      input:function(e){
        console.log(e)
        this.setData({
          keyword:e.detail.value
        })
      },
      confirm:function(e){
        this.searchOilFun()
      }
    }
})