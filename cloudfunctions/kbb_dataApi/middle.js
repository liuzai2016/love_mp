/**
 * 数据交互的中间过程
*/

const { getData,getCount,addData,updateData,judgeExistTarget,updateLoveBookData,textAnalysis,sendMessage } = require('./dbService.js')
const middle = {}

/**
 * 添加用户
 * 1、查看用户是否存在
 * 2、选择更新或创建
 * @param { data }
 * data: Object 必填
*/
middle.addUser = function (param = {}){
  return new Promise((resolve,reject)=>{
    getData({
      table: 'kbb_user',
      condition: { openid: param.data.openid },
    })
    .then((e)=>{
      if(e.data && e.data.length){
        resolve(
          updateData({
            table: 'kbb_user',
            condition: { openid: param.data.openid },
            data: param.data
          })
        )
      }
      else {
        resolve(
          addData({
            table: 'kbb_user',
            data: param.data
          })
        )
      }
    })
    .catch((err)=>{
      console.log('error = ', err)
      reject({code: 501,message: '添加失败',error: err})
    })
  })
}
/**
 * 更新用户信息
 * @param { data,condition } 必填
 * data: Object
 * condition: Object
*/
middle.updateUserInfo = function (param = {}){
  return updateData({
    table: 'kbb_user',
    condition: param.condition,
    data: param.data
  })
}
/**
 * 搜索用户
 * @param { table,condition }
 * table 非必填
 * condition: Object 必填
*/
middle.searchUserInof = function (param = {}){
  return getData({
    table: param.table || 'kbb_user',
    condition: { ...param.condition },
    fields: { openid:0 }
  })
}

/**
 * 创建情书
 * @param { openid,detail }
 *  targets: [ { openid,nickName },...],    // 接收者信息
 *  author: 发起者的openid,
 *  music: '',
 *  img: '',
 *  templet_id: 3,
 *  title: '像小何表白的小白兔',
 *  question: '做我对象吧！我们一起去看世界',
 *  color: '#eeeeee',
 *  titleColor: '#ffffff',
 *  background: '#2b5da6',
 *  content: '你的名字\n是我见过最短的情诗',
 *  author: '爱你的小白兔'
*/
middle.addLoveBook = function (param = {}){
  return Promise.all([
    getCount({
      table: 'kbb_love_book',
      condition: {
        author: param.data.author,
        del: -1
      }
    }),
    textAnalysis(
      param.data.content+' '+param.data.author_nickName+' '+ param.data.author_name+' '+ param.data.title+' '+ param.data.question
    )
  ])
  .then((res)=>{
    if(res[0] && res[0].data && res[0].data.total > 0){
      return { code: 0,status: -1,message: '用情专一点，已经有一封情书了，若是需要写新的情书需要先删除之前的情书' }
    }
    else if (res[1] && res[1].status === -1){
      return { code: 0,status: -1, message: res[1].message || '创建失败！文本内容应该健康积极' }
    }
    else {
      return  addData({
        table: 'kbb_love_book',
        data: {
          ...param.data,
          del: -1,
          targets: [],
          create_date: Date.now(),
          update_date: Date.now()
        }
      })
    }
  })
  .catch((error)=>{
    return  addData({
      table: 'kbb_love_book',
      data: {
        ...param.data,
        del: -1,
        targets: [],
        create_date: Date.now(),
        update_date: Date.now()
      }
    })
  })
}
/**
 * 更新情书 不能重复接受和拒绝
 * @param { author,love_id,target_id,nickName,target_img }   必传
 * author: 发起者的openid
 * love_id: 情书id
 * target_id: 接收表白者的openid
 * nickName: 接收表白者的昵称
 * target_img: 接收表白者的头像
*/
middle.updateLoveBook = function (param = {}){
  return Promise.all([
    judgeExistTarget({
        table: 'kbb_love_book',
        condition: {
          _id: param.love_id,
          'targets.target_id': param.target_id
        }
      })
    ])
    .then((e)=>{
      if(e[0] && e[0].status === 1){
        return { code: 0,status: -1,message: '你已经做出了选择，不能再选择了' }
      }
      else {
        sendMessage(param)
        return updateLoveBookData(param)
      }
    })
    .catch((error)=>{
      console.log('error = ', error)
      return { code: 500, status: -1,message: '错误' }
    })
}

/**
 * 获取情书
 * @param { page,rows,love_id,openid }
 * page: 从0开始
 * love_id: 获取详情时必传
 * openid: 发起者获取情书列表时必传
*/
middle.getLoveBook = function (param = {}){
  var condition = param.love_id 
    ? { _id: param.love_id }     // 接收人或预览时
    : { author: param.openid , del: -1 }  // 发布人获取发布列表时
    console.log('condition = ', condition)
  return  getData({
            table: 'kbb_love_book',
            sort: 'update_date',
            sort_type: -1,
            condition,
            // fields: { author: 0 },
            // page: param.page || 0,
            // rows: param.rows || 20
          })
}

/**
 * 删除情书
 * 这里的删除是逻辑删除
 * @param { openid,love_id,detail }
*/
middle.deleteLoveBook = function (param = {}){
  return  updateData({
            table: 'kbb_love_book',
            condition: {
              author: param.openid,
              _id: param.love_id
            },
            data: {
              del: 1
            }
          })
}

/**
 * 获取音乐列表
 * @param { page,rows }
*/
middle.getMusicList = function (param = {}){
  return  getData({
            table: 'kbb_love_music',
            page: param.page,
            rows: param.rows,
          })
}

/**
 * 获取土味情话
 * @param { page,rows }
 * page: 从0开始
*/
middle.getLovePrattle = function (param = {}){
  return  getData({
            table: 'kbb_love_prattle',
            page: param.page || 0,
            rows: param.rows || 20
          })
}

/**
 * 获取模板
 * @param { page,rows }
 * page: 从0开始
*/
middle.getTemplate = function (param = {}){
  return  getData({
            table: 'kbb_template',
            page: param.page || 0,
            rows: param.rows || 20
          })
}
module.exports = middle