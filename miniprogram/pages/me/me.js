// miniprogram/pages/me/me.js
import { verifyUser } from "../../js/common.js"
import { getLoveBook,deleteLoveBook } from "../../js/dataService.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logined: false,
    user_info: {},
    list: [],
  },
  // 登录事件
  loginevent(e){
    var detail = e.detail
    this.setData({
      logined: detail.logined
    })
    this.init()
  },
  init(){
    var user_info = wx.getStorageSync('user_info')
    this.setData({
      user_info
    })
    this.getData()
  },
  // 获取情书
  getData(){
    wx.showLoading({
      title: '加载中...',
    })
    getLoveBook({
      page: 1,
      rows: 20
    })
    .then(({ result })=>{
      wx.hideLoading()
      if(result.status == 1){
        this.setData({
          list: result.data
        })
      }
      else {
        this.setData({
          list: []
        })
      }
    })
    .catch(()=>{
      wx.hideLoading()
    })
  },
  // 删除情书
  delete(){
    wx.showModal({
      title: "提示",
      content: "确定要删除该情书？删除之后无法再查看该情书回复",
      cancelText: '算了',
      confirmText: '删除',
      success: (e)=>{
        if(e.confirm){
          this.sendDelete()
        }
      }
    })
  },
  sendDelete(){
    if(!this.data.list[0]){
      return false;
    }
    deleteLoveBook({
      love_id: this.data.list[0]._id
    })
    .then(({result})=>{
      if(result.status == 1){
        this.setData({
          list: []
        })
        wx.showToast({
          title: '删除成功',
          icon: "success"
        })
      }
      else {
        wx.showToast({
          title: '删除失败',
          icon: "none"
        })
      }
    })
    .catch(()=>{
      wx.showToast({
        title: '删除失败',
        icon: "none"
      })
    })
  },
  // 打开情书
  openDetail(e){
    var _id = this.data.list && this.data.list[0] ? this.data.list[0]._id : ''
    if(!_id){
      return false
    }
    wx.navigateTo({
      url: '../love/love?author_look=1&love_id='+ _id,
    })
  },
  // 跳转首页
  toHome(){
    wx.switchTab({
      url: '../index/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
  },
  onShow: function () {
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh({
      success: (res) => {
        if(this.data.logined){
          this.getData()
        }
      },
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})