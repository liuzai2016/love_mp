// components/textAnimate/textAnimate.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    init_list: {
      type: Array,
      default: ()=>{
        return []
      }
    },
    detail: {
      type: Object,
      default: ()=>{
        return {}
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    autoplay: false,
    circular: true,           // 是否无缝滚动
    margin: 20,
    current: 1,               // 当前位置
    interval: 40000,           // 切换时间间隔
    duration: 500,            // 滑动的时间
    easing: 'easeInCubic',    // 动画函数
    list: [],
    pageType: 'home'
  },
  /**
   * 自定义事件参数-------------------start-------------------------------
  */
  timeOutObj: null,
  // 开始文字动画
  tempText: '',
  symbol: 0,
  animateIndex: 0,
  animateTime: null,
  /**
   * 自定义事件参数---------------------end-------------------------------
  */

  /**
   * 组件的方法列表
   */
  methods: {
    // 接受
    accept(e){
      var data = e.target.dataset ? e.target.dataset.n : e.currentTarget.dataset.n
      console.log(data)
    },
    // 拒绝
    refuse(e){
      var data = e.target.dataset ? e.target.dataset.n : e.currentTarget.dataset.n
      console.log(data)
    },
    // 显示预览
    showEvent(e){
      var data = e.target.dataset ? e.target.dataset.n : e.currentTarget.dataset.n
      this.triggerEvent('showEvent', data)
    },
    // 跳转创建
    createEvent(e){
      var data = e.target.dataset ? e.target.dataset.n : e.currentTarget.dataset.n
      this.triggerEvent('createEvent', data)
    },
    clearTimeOut(){
      if(this.timeOutObj){
        clearTimeout(this.timeOutObj)
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
      this.textAnimate()
    },
    
  initTimeObj(){
    this.animateIndex = 0
    if(this.animateTime){
      clearInterval(this.animateTime)
      this.animateTime = null
    }
    var list = this.data.list.map((n,index) =>{
      n.show_question = false
      n.show_author = ''
      if(this.data.current === index){
        n.active_class = 'group_item_active'
      }
      else {
        n.active_class = ''
      }
      return n
    })
    if(!list[this.data.current]){
      this.setData({
        current: 0
      })
    }
    list[this.data.current].show_question = false
    this.setData({
      list
    })
  },
    // initTimeObj(){
    //   this.animateIndex = 0
    //   if(this.animateTime){
    //     clearInterval(this.animateTime)
    //     this.animateTime = null
    //   }
    //   var list = Array.from(this.data.list)
    //   list[this.data.current].show_question = false
    //   this.setData({
    //     list
    //   })
    // },
    textAnimate(){
      this.initTimeObj()
      if(!this.data.list || !this.data.list.length){
        return false;
      }
      // 关闭首页动画
      if(this.data.pageType === 'home'){
        return false;
      }
      var content = this.data.list[this.data.current].content
      var list = Array.from(this.data.list)
      var str = ''
      this.symbol = content.split('\n').length
      this.animateTime = setInterval(()=>{
        str = str.replace(/[\|]/g,'')
        // 还有去除竖线
        if(str.length - 1 > content.length - this.symbol){
          this.initTimeObj()
          this.showAuthor()
        }
        else {
          str += content.charAt(this.animateIndex) + '|'
        }
        this.animateIndex ++
        list[this.data.current].show_content = str
        this.setData({
          list
        })
      },300)
    },
    // 显示发布者
    showAuthor(){
      this.initTimeObj()
      var author = '———— '+ this.data.list[this.data.current].author
      var list = Array.from(this.data.list)
      var str = ''
      this.animateTime = setInterval(()=>{
        str = str.replace(/[\|]/g,'')
        if(str.length > author.length - this.symbol){
          this.initTimeObj()
          list[this.data.current].show_question = true
        }
        else {
          str += author.charAt(this.animateIndex) + '|'
        }
        this.animateIndex ++
        list[this.data.current].show_author = str
        this.setData({
          list
        })
      },200)
    },
    init(param = {}){
      this.setData({
        list: param.list || [],
        pageType: param.pageType
      })
      this.textAnimate()
    },
  },
  // ready(){
  //   this.textAnimate()
  // },
  // observers:{
  //   init_list(l){
  //     this.setData({
  //       list: l
  //     })
  //     this.textAnimate()
  //   }
  // },
})
