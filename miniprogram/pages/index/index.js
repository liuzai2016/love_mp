// miniprogram/pages/index/index.js
import { getTemplate } from "../../js/dataService.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    autoplay: true,
    circular: true,           // 是否无缝滚动
    margin: 20,
    current: 1,               // 当前位置
    interval: 40000,           // 切换时间间隔
    duration: 1000,            // 滑动的时间
    easing: 'easeInCubic',    // 动画函数
    list: [
      // {
      //   img: 'https://6973-issue-c29395-1257603811.tcb.qcloud.la/kbb_img/2.png?sign=9e149e15e59b05cc91478cc2f1c8f9c6&t=1599386958',
      //   templet_id: 2,
      //   title: '向小何表白的傻子',
      //   question: '做我对象吧！我们一起去看世界',
      //   active_class: 'group_item_active',
      //   color: '#000000',
      //   titleColor: '#000000',
      //   background: '#ffffff',
      //   content: '你的名字\n是我见过最短的情诗',
      //   author_name: '爱你的傻子'
      // },
    ]
  },
  /**
   * 自定义事件--------------start-----------------------------------------------
  */
  timeOutObj: null,
  getData(){
    wx.showLoading({
      title: '加载中...',
    })
    getTemplate()
    .then(({ result })=>{
      wx.hideLoading()
      if(result.status == 1){
        var list = result.data.map(n => {
          n.content = n.content ? n.content.replace(/\\n/g,'\n') : '--'
          return n
        })
        this.setData({
          list
        })
        const query = this.selectComponent('#textAnimateEl')
        query.init({
          list,
          pageType: 'home'
        })
      }
    })
    .catch((error)=>{
      wx.hideLoading()
      console.log('error = ', error)
    })
  },
  clearTimeOut(){
    if(this.timeOutObj){
      clearInterval(this.timeOutObj)
      this.timeOutObj = null
    }
  },
  // 页面块切换
  changeSwiper(e){
    var list = Array.from(this.data.list)
    var i = e.detail.current
    this.clearTimeOut()
    this.setData({
      current: i,
      list
    })
    // this.timeOutObj = setTimeout(()=>{
    //   this.textAnimate()
    // },500)
    this.textAnimate()
  },
  // 显示预览
  showEvent(e){
    console.log(e)
    wx.setStorageSync('template', e.detail)
    wx.navigateTo({
      url: '../love/love?preview=1',
    })
  },
  // 跳转创建
  createEvent(e){
    wx.setStorageSync('template', e.detail)
    wx.navigateTo({
      url: '../create/create',
    })
  },
  /**
   * 自定义事件---------------end-----------------------------------------------
  */
  onShow: function () {
    wx.showShareMenu({
      withShareTicket: true,
      menus:['shareAppMessage','shareTimeline']
    })
    this.getData()
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh({
      success: (res) => {
        this.getData()
      },
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '快表白',
      path: '/pages/index/index',
      imageUrl: 'https://6973-issue-c29395-1257603811.tcb.qcloud.la/kbb_img/share_img.png'
    }
  }
})