// components/subscribe/subscribe.js
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
    show: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    close(){
      this.setData({
        show: 'popup_hide'
      })
      this.triggerEvent('close')
    },
    accept(){
      var template_id = 'EVcqnpRB4Hx1zQupO8yqBG7TpOflHle9oGeaTcsTVJg'
      wx.requestSubscribeMessage({
        // 传入订阅消息的模板id，模板 id 可在小程序管理后台申请
        tmplIds: [ template_id ],
        success(res) {
          console.log('申请订阅 res = ', res)
          // 申请订阅成功
          if (res[template_id] === 'accept') {
            this.close()
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
    testAccess(){
      wx.getSetting({
        withSubscriptions: true,
        success: (res)=>{
          if (res) {
            console.log('res = ', res)
            // 授权了订阅消息
            if (res.subscriptionsSetting && res.subscriptionsSetting.mainSwitch) {
              console.log('is accredit：ok')
              this.setData({
                show: 'popup_hide'
              })
              this.triggerEvent('show')
            }
            else {
              this.setData({
                show: ''
              })
            }
          }
        }
      })
    },
  },
  ready: function (){
    console.log('渲染')
    this.testAccess()
  },
})
