// miniprogram/pages/prattle/prattle.js
import { getLovePrattle } from "../../js/dataService.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      { content: '你的名字\n是我见过最短的情诗', type_name: '追女生' },
      { content: '你的名字\n是我见过最短的情诗', type_name: '追男生' },
    ]
  },
  scroll_flag: true,
  page: 0,
  rows: 20,
  // 获取数据
  getData(){
    wx.showLoading({
      title: '加载中...',
    })
    this.scroll_flag = false
    getLovePrattle({
      page: this.page,
      rows: this.rows
    })
    .then(({ result })=>{
      wx.hideLoading()
      if(result.code === 0 ){
        this.scroll_flag = true
        var data = result.data.map(n => {
          var content = n.content ? n.content.replace(/[\\n]{1,}/gi,'\n') : ''
          return { ...n,content }
        })
        this.setData({
          list: data
        })
      }
    })
    .catch((error)=>{
      wx.hideLoading()
      console.log(error)
    })
  },
  // 点击获取该数据
  selcetItem(e){
    var data = e.target.dataset ? e.target.dataset.n : e.currentTarget.dataset.n
    wx.setStorageSync('selectPrattle', data)
    wx.navigateBack()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true,
      menus:['shareAppMessage','shareTimeline']
    })
    this.getData()
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh({
      success: (res) => {
        this.page = 1
        this.getData()
      },
    })
  },
  onReachBottom: function () {
    if(this.scroll_flag){
      this.page ++
      this.getData()
    }
  },
  onShareAppMessage: function () {
    return {
      title: '快表白',
      path: '/pages/index/index',
      imageUrl: 'https://6973-issue-c29395-1257603811.tcb.qcloud.la/kbb_img/share_img.png'
    }
  }
})