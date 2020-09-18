// components/musicPlay/musicPlay.js
import { base_music } from "../../js/common.js"
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    rotateClass: '',
    play: false,
  },
  music: base_music,
  player: null,
  /**
   * 组件的方法列表
   */
  methods: {
    init(param = {}){
      this.music = param.music || base_music
      this.setData({
        play: true,
        rotateClass: 'rotateBackground'
      })
      this.initPlayer()
    },
    initPlayer(){
      if(!this.player){
        this.player = wx.createInnerAudioContext()
      }
      this.player.src = this.music
      this.player.volume = 0.3
      this.player.play()
      this.player.offEnded(()=>{
        this.player.play()
      })
    },
    changePlay(){
      var play = !this.data.play
      this.setData({
        play,
        rotateClass: play ? 'rotateBackground' : ''
      })
      if(play){
        this.play()
      }
      else {
        this.pause()
      }
    },
    play(){
      this.player.play()
      this.setData({
        play: true,
        rotateClass: 'rotateBackground'
      })
    },
    pause(){
      this.player.pause()
      this.setData({
        play: false,
        rotateClass: ''
      })
    },
    destoryPlayer(){
      if(this.player){
        this.player.destroy()
        this.player = null
      }
    },
  }
})
