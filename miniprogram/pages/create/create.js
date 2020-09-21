// miniprogram/pages/create/create.js
import { verifyUser,base_music } from "../../js/common.js"
import { saveLoveBook } from "../../js/dataService.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logined: false,
    autoHeight: true,
    detail: {},
    music: base_music,
    content: '你的名字\n是我见过最短的情诗',
    author_name: '爱你的小白兔',
    question: '做我女朋友吧！我们一起去看世界',
    acceptText: '接受',
    refuseText: '婉拒',
  },
  user_info: {},
  /**
   * 自定义事件-----------------------start--------------------------------------
   */
  // 初始化获取基础信息
  init(){
    var detail = wx.getStorageSync('template') || {}
    var music = wx.getStorageSync('select_music')
    var content_obj = wx.getStorageSync('selectPrattle') || {}
    var content = content_obj.content || ''
    wx.setNavigationBarTitle({
      title: detail.title || '快表白',
    })
    wx.setNavigationBarColor({
      backgroundColor: detail.background || "#ffffff",
      frontColor: detail.titleColor || "#000000",
    })
    this.setData({
      detail,
      music: music || detail.music || base_music,
      content: content || detail.content || '你的名字\n是我见过最短的情诗',
      title: detail.title || '默默爱你的人',
      author_name: detail.author_name || '爱你的小白兔',
      question: detail.question || '做我对象吧！我们一起去看世界',
    })
    this.initMusic()
  },
  // 初始化音乐
  player: null,
  initMusic(){
    this.player = this.selectComponent('#playerEl')
    this.player.init({ music: this.data.music })
  },
  // 登录事件
  loginevent(e){
    var detail = e.detail
    this.user_info = detail.user_info || {}
    this.setData({
      logined: detail.logined
    })
  },
  // 跳转音乐列表页
  topMusic(){
    this.updateData()
    wx.navigateTo({
      url: '../music/music',
    })
  },
  //更新填写数据
  updateData(){
    var user_info = wx.getStorageSync('user_info')
    var options = {
      ...this.data.detail,
      title: this.data.title,
      content: this.data.content,
      question: this.data.question,
      author_name: this.data.author_name,
      author_nickName: user_info.nickName,
      music: this.data.music
    }
    wx.setStorageSync('template', options)
  },
  // content输入事件
  max_length: 60,
  contentInput(e){
    var str = e.detail.value
    if(e.detail.value.length > this.max_length){
      str = str.substring(0,this.max_length)
      wx.showModal({
        title: "提示",
        content: "最多"+ this.max_length +"个字符，不能在多了",
        showCancel: false,
      })
    }
    this.setData({
      content: str
    })
  },
  // 内容输入行数改变
  lineChange(e){
    if(e.detail.lineCount > 6){
      var arr = this.data.content.split('\n')
      arr.length = 6
      this.setData({
        content: arr.join('\n')
      })
      wx.showModal({
        title: "提示",
        content: "最多6行，不能在多了",
        showCancel: false,
      })
      return
    }
  },
  // 问题
  questionInput(e){
    var str = e.detail.value
    if(e.detail.value.length > 30){
      str = str.substring(0,30)
      wx.showModal({
        title: "提示",
        content: "问题要简洁！不能超过30个字符",
        showCancel: false
      })
    }
    this.setData({
      question: str
    })
  },
  // 名称输入
  authorInput(e){
    var str = e.detail.value
    if(e.detail.value.length > 10){
      str = str.substring(0,10)
      wx.showModal({
        title: "提示",
        content: "留言名称！不能超过10个字符",
        showCancel: false
      })
    }
    this.setData({
      author_name: str
    })
  },
  // 标题输入
  titleInput(e){
    var str = e.detail.value
    if(e.detail.value.length > 10){
      str = str.substring(0,10)
      wx.showModal({
        title: "提示",
        content: "标题要简洁！不能超过10个字符",
        showCancel: false
      })
    }
    this.setData({
      title: str
    })
    wx.setNavigationBarTitle({
      title: str || '快表白',
    })
  },
  // 保存
  createEvent(){
    if(
      !this.data.title
      ||
      !this.data.content
      ||
      !this.data.question
      ||
      !this.data.author_name
    ){
      wx.showModal({
        title: "提示",
        content: "请先填写完成后在保存"
      })
      return false;
    }
    wx.showModal({
      title: "提示",
      content: "确定保存？",
      success: (e) =>{
        if(e.confirm){
          this.sendSave()
        }
      }
    })
  },
  // 发送保存数据
  sendSave(){
    wx.showLoading({
      title: '保存中...',
    })
    var user_info = wx.getStorageSync('user_info')
    var options = {
      ...this.data.detail,
      title: this.data.title,
      content: this.data.content,
      question: this.data.question,
      author_name: this.data.author_name,
      author_nickName: user_info.nickName,
      music: this.data.music
    }
    saveLoveBook(options)
    .then(({ result })=>{
      wx.hideLoading()
      if(result.status === 1){
        wx.showModal({
          title: "提示",
          content: "情书创建成功",
          showCancel: false,
          success: () =>{
            wx.switchTab({
              url: '../me/me',
            })
          }
        })
      }
      else {
        wx.showModal({
          title: "提示",
          content: result.message || "情书创建失败",
          showCancel: false
        })
      }
    })
    .catch(()=>{
      wx.hideLoading()
    })
  },
  openPrattle(){
    this.updateData()
    wx.navigateTo({
      url: '../prattle/prattle',
    })
  },
  destoryPlayer(){
    if(this.player){
      this.player.destoryPlayer()
    }
  },
  /**
   * 自定义事件-------------------------end------------------------------------
   */
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showShareMenu({
      withShareTicket: true,
      menus:['shareAppMessage','shareTimeline']
    })
    verifyUser({
      callback: (e) => {
        this.user_info = e.user_info || {}
        this.setData({
          logined: e.logined
        })
        if(e.logined){
          this.init()
        }
      }
    })
  },
  onHide: function (){
    this.destoryPlayer()
  },
  onUnload: function(){
    this.destoryPlayer()
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