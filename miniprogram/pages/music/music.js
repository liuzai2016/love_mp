// miniprogram/pages/music/music.js
import { getMusicList } from "../../js/dataService.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    play_name: '',
    play_music: ''
  },
  page: 1,
  rows: 20,
  scroll_loader: true,
  // 获取音乐
  getData(){
    wx.showLoading({
      title: '加载中...',
    })
    this.scroll_loader = false
    getMusicList({
      page: this.page,
      rows: this.rows
    })
    .then(({ result })=>{
      wx.hideLoading()
      if(result.status === 1){
        this.scroll_loader = true
        this.setData({
          list: result.data
        })
      }
      else if(this.page == 1) {
        this.setData({
          list: []
        })
      }
    })
    .catch((err)=>{
      wx.hideLoading()
      console.log('error = ', err)
    })
  },
  // 选择试听
  audition(e){
    var n = e.target.dataset.n
    this.setData({
      play_name: n.name,
      play_music: n.url
    })
    this.initMusic()
  },
  // 选择试听
  selected(e){
    var n = e.target.dataset.n
    wx.setStorageSync('select_music', n.url)
    wx.navigateBack()
  },
  // 音乐试听
  player: null,
  initMusic(){
    if(!this.player){
      this.player = this.selectComponent('#playerEl')
    }
    console.log('this.data.play_music = ', this.data.play_music)
    this.player.init({
      music: this.data.play_music
    })
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
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function(){
    if(this.player){
      this.player.destoryPlayer()
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh({
      success: (res) => {
        this.scroll_loader = true
        this.page = 1
        this.getData()
      },
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.scroll_loader){
      this.page ++
      this.getData()
    }
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