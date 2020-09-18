// components/login.js
import { randomStr } from "../../js/common.js"
import { addUser } from "../../js/login.js"
const app = getApp()
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
    canIUse: wx.canIUse('button.open-type.getUserInfo'),      //是否为新版本微信
  },

  /**
   * 组件的方法列表
   */
  methods: {
    logined: false,
    // 点击授权按钮
    bindGetUserInfo: function (e) {
      wx.showLoading({
        title: '正在登陆...',
      })
      wx.getUserInfo({
        success: (res) =>{
          wx.setStorageSync('user_info', res.userInfo)
          addUser(res.userInfo)
          .then((e)=>{
            console.log('添加结果 e = ', e)
          })
          this.triggerEvent('loginevent',{ userInfo: res.userInfo,logined: true })
        },
        fail: () => {
          wx.showModal({
            title: "提示",
            content: "要授权了才能使用哦！",
            showCancel: false,
          })
        },
        complete: () =>{
          wx.hideLoading()
        }
      })
    },
  }
})
