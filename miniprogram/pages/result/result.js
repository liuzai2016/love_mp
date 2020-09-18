import { verifyUser } from "../../js/common.js"
import { getLoveBook } from "../../js/dataService.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logined: false,
    showContent: false,
    detail: {}
  },
  // 登录事件
  loginevent(e){
    var detail = e.detail
    this.setData({
      logined: detail.logined
    })
  },
  // 获取情书
  getData(){
    wx.showLoading({
      title: '加载中...',
    })
    getLoveBook({
      page: 0,
      rows: 1
    })
    .then(({ result })=>{
      wx.hideLoading()
      if(result.status == 1){
        this.setData({
          showContent: true
        })
        wx.setNavigationBarTitle({
          title: result.data[0].title,
        })
        this.setData({
          detail: result.data[0]
        })
      }
      else {
        this.setData({
          showContent: false
        })
      }
    })
    .catch(()=>{
      wx.hideLoading()
    })
  },
  toLove(){
    wx.navigateTo({
      url: '../love/love?author_look=1&love_id='+ this.data.detail._id,
    })
  },
  toHome(){
    wx.switchTab({
      url: '../index/index',
    })
  },
  init(){
    this.getData()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true,
      menus:['shareAppMessage','shareTimeline']
    })
    verifyUser({
      callback: (e) => {
        this.setData({
          logined: e.logined
        })
        if(e.logined){
          this.init()
        }
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
    wx.stopPullDownRefresh({
      success: (res) => {
        this.getData()
      },
    })
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

  }
})