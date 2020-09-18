// miniprogram/pages/love/love.js
import { verifyUser } from "../../js/common.js"
import { getLoveBook,acceptLove } from "../../js/dataService.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logined: false,
    preview: true,   // true预览 false查看
    detail: {},
    show_question: false
  },
  love_id: '',
  template_id: 'EVcqnpRB4Hx1zQupO8yqBG7TpOflHle9oGeaTcsTVJg',
  /**
   * 自定义事件-------------------start-------------------------------
  */
  // 初始化音乐
  player: null,
  initMusic(){
    this.player = this.selectComponent('#playerEl')
    this.player.init({ ...this.data.detail })
  },
  // 开始创建
  createEvent(e){
    wx.setStorageSync('template', this.data.detail)
    wx.navigateTo({
      url: '../create/create',
    })
  },
  initTimeObj(){
    this.animateIndex = 0
    if(this.animateTime){
      clearInterval(this.animateTime)
      this.animateTime = null
    }
  },
  // 开始文字动画
  tempText: '',
  symbol: 0,
  animateIndex: 0,
  animateTime: null,
  textAnimate(){
    var detail = { ...this.data.detail }
    var content = detail.content
    var str = ''
    this.symbol = content.split('\n').length
    this.initTimeObj()
    this.animateTime = setInterval(()=>{
      str = str.replace(/[\|]/g,'')
      if(str.length - 1> content.length - this.symbol){
        this.initTimeObj()
        this.showAuthor()
      }
      else {
        str += content.charAt(this.animateIndex) + '|'
      }
      this.animateIndex ++
      detail.show_content = str
      this.setData({
        detail
      })
    },300)
  },
  // 显示发布者
  showAuthor(){
    this.initTimeObj()
    var detail = { ...this.data.detail }
    var author = '———— '+ detail.author_name
    var str = ''
    this.animateTime = setInterval(()=>{
      str = str.replace(/[\|]/g,'')
      if(str.length > author.length - this.symbol){
        this.initTimeObj()
        this.setData({
          show_question: true
        })
      }
      else {
        str += author.charAt(this.animateIndex) + '|'
      }
      this.animateIndex ++
      detail.show_author = str
      this.setData({
        detail
      })
    },200)
  },
  init(detail){
    detail = detail || wx.getStorageSync('template')
    this.setData({
      detail
    })
    wx.setNavigationBarTitle({
      title: detail.title,
    })
    wx.setNavigationBarColor({
      backgroundColor: detail.background,
      frontColor: detail.titleColor,
    })
    this.initMusic()
    this.textAnimate()
  },
  getCloudData(){
    wx.showLoading({
      title: '加载中...',
    })
    getLoveBook({
      love_id: this.love_id
    })
    .then(({ result })=>{
      wx.hideLoading()
      this.init(result.data[0])
    })
    .catch((error)=>{
      wx.hideLoading()
      console.log('error = ', error)
    })
  },
  // 接受或拒绝
  sendIdea(e){
    var type = e.currentTarget.dataset.type
    var text = type == -1 ? '拒绝' : '接受'
    if(this.love_id){
      var user_info = wx.getStorageSync('user_info')
      acceptLove({
        love_id: this.love_id,
        author: this.data.detail.author,
        accept: type,
        target_img: user_info.avatarUrl,
        nickName: user_info.nickName,
        detail: this.data.detail
      })
      .then(({ result })=>{
        if(result.status == 1){
          wx.showModal({
            title: "提示",
            content: "你"+ text +this.data.detail.author_nickName
          })
        }
        else {
          wx.showModal({
            title: "提示",
            content: result.message || '异常',
            showCancel: false
          })
        }
      })
      .catch((error)=>{
        console.log(error)
      })
    }
  },
  // 销毁播放器
  destoryPlayer(){
    if(this.player){
      this.player.destoryPlayer()
    }
  },
  /**
   * 自定义事件--------------------end-------------------------------
  */
  loginTest(){
    verifyUser({
      callback: (e) => {
        this.setData({
          logined: e.logined
        })
        if(e.logined){
          if(this.love_id){
            this.getCloudData()
          }
          else {
            this.init()
          }
        }
      }
    })
  },
  
  // 登录事件
  loginevent(e){
    var detail = e.detail
    this.setData({
      logined: detail.logined
    })
    if(this.love_id){
      this.getCloudData()
    }
    else {
      this.init()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  acceptMessage(){
    wx.requestSubscribeMessage({
      // 传入订阅消息的模板id，模板 id 可在小程序管理后台申请
      tmplIds: [ this.template_id ],
      success(res) {
        console.log('申请订阅 res = ', res)
        // 申请订阅成功
        if (res[this.template_id] === 'accept') {
          wx.showToast({
            title: '授权成功',
            icon: 'success'
          })
        }
        else {
          wx.showModal({
            title: '提示',
            content: '授权了之后可以及时接收对方的回复哦',
            showCancel: false,
            success: (res) =>{
              console.log(res)
            }
          })
        }
      },
      fail: (error) =>{
        console.log(error)
        wx.showModal({
          title: '提示',
          content: '授权了之后可以及时接收对方的回复哦',
          showCancel: false,
          success: (res) =>{
            console.log(res)
          }
        })
      }
    });
  },
  onLoad: function (options) {
    this.love_id = options.love_id
    if(options.author_look == 1){
      wx.showShareMenu({
        withShareTicket: true,
        menus:['shareAppMessage','shareTimeline']
      })
    }
    else {
      wx.hideShareMenu()
    }
    this.setData({
      preview: options.preview == 1 ? true : false
    })
    this.loginTest()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(this.data.logined && Object.keys(this.data.detail).length){
      this.initMusic()
    }
  },
  onHide: function () {
    this.destoryPlayer()
  },
  onUnload: function () {
    this.destoryPlayer()
  },
  onPullDownRefresh: function () {
    this.loginTest()
  },
  onShareAppMessage: function () {
    return {
      title: this.data.detail.title || '快表白',
      path: '/pages/love/love?love_id='+ this.data.detail._id,
      imageUrl: 'https://6973-issue-c29395-1257603811.tcb.qcloud.la/kbb_img/share_img.png'
    }
  }
})