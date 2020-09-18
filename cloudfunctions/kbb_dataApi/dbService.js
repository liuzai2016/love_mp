const cloud = require('wx-server-sdk')
cloud.init({
  env: 'issue-c29395' // cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

const dbService = {}
/**
 * 插入一条数据
 * @param{ table,data } 必传
 * table: String
 * data: Object
*/
dbService.addData = function (param){
  if(param.data._id){
    delete param.data._id
  }
  return  new Promise((resolve,reject)=>{
          db.collection(param.table)
            .add({
              data: param.data
            })
            .then((e)=>{
              resolve({ code: 0, status: 1, message: '新增成功' })
            })
            .catch((error)=>{
              console.log('error = ', error)
              reject({ code: 501,status: -1 ,message: '出错了' })
            })
  })
}
/**
 * 更新一条数据
 * @param{ table,data,condition } 必传
 * table: String
 * condition: Object
 * data: Object
*/
dbService.updateData = function (param){
  return  new Promise((resolve,reject) => {
          db.collection(param.table)
            .where({ ...param.condition })
            .update({
              data: param.data
            })
            .then(({ stats })=>{
              if(stats && stats.updated == 1){
                resolve({ code: 0, status: 1, message: '更新成功' })
              }
              else {
                reject({ code: 502,status: -1 ,message: '更新失败' })
              }
            })
            .catch((err)=>{
              console.log('error = ', err)
              reject({ code: 501,status: -1 ,message: '出错了' })
            })
  })
}


/**
 * 更新情书数据
 * @param{ table,data,condition } 必传
 * table: String
 * condition: Object
 * data: Object
*/
dbService.updateLoveBookData = function (param){
  return  new Promise((resolve,reject) => {
          db.collection('kbb_love_book')
            .where({ ...param.condition })
            .update({
              data: {
                targets: _.unshift([{ 
                  target_id: param.target_id || '',
                  target_img: param.target_img || '',
                  nickName: param.nickName || '',
                  accept: param.accept || -1,
                  accept_name: param.accept == -1 ? '拒绝' : '同意'
                }])
              }
            })
            .then(({ stats })=>{
              if(stats && stats.updated > 0){
                resolve({ code: 0, status: 1, message: '更新成功' })
              }
              else {
                resolve({ code: 502,status: -1 ,message: '更新失败' })
              }
            })
            .catch((err)=>{
              console.log('error = ', err)
              resolve({ code: 501,status: -1 ,message: '出错了' })
            })
  })
}
/**
 * 获取数据
 * @param{ table,sort,sort_type,page,rows,{ ...condition },fields:{ ... } }
 * sort: 排序字段
 * sort_type: 排序的类型 1升序  默认降序
 * page,rows可以不传
 * page从0开始
 * fields: Object 过滤字段
*/
dbService.getData = function (param) {
  var sort = param.sort || '_id'
  var sort_type = param.sort_type == '1' ? 'asc' : 'desc'  //asc
  var skip = param.page ? Number(param.page) : 0;
  var limit = param.rows ? Number(param.rows) : 10;
  var fields = typeof param.fields === 'object' ? param.fields : {}
  return  new Promise((resolve,reject)=>{
            db.collection(param.table)
              .where({ ...param.condition })
              .orderBy(sort, sort_type)
              .skip(skip)
              .limit(limit)
              .field({ ...fields })
              .get()
              .then(({ data })=>{
                if(data && data.length){
                  resolve({ code: 0, status: 1,data, message: '成功' })
                }
                else{
                  reject({ code: 404,status: -1 ,message: '没有数据了' })
                }
              })
              .catch(()=>{
                reject({ code: 501,status: -1 ,message: '出错了' })
              })
          })
}
/**
 * 获取总数
 * @param { table,condition }  必传
*/
dbService.getCount = function (param = {}){
  return new Promise((resolve,reject)=>{
    db.collection(param.table)
      .where({ ...param.condition })
      .count()
      .then((res)=>{
        resolve({ code: 0,status: 1,data: res, message: '获取成功' })
      })
      .catch(()=>{
        reject({code: 501,status: -1, message: '获取总数失败'})
      })
  })
}
/**
 * 删除数据
 * @param { table,condition } 必传
 * table: String
 * condition: Object
*/
dbService.deleteData = function (param){
  return  new Promise((resolve,reject)=>{
            db.collection(param.table)
              .where({ ...param.condition })
              .remove()
              .then(()=>{
                resolve({ code: 0,status: 1 ,message: '删除成功' })
              })
              .catch(()=>{
                reject({ code: 501,status: -1 ,message: '出错了' })
              })
            })
}

/**
 * 查看接收者是否已经操作过该情书
 * @param { love_id,target_id }
*/
dbService.judgeExistTarget = function (param = {}){
  return  new Promise((resolve,reject)=>{
            db.collection('kbb_love_book')
              .where(
                {
                  ...param.condition
                }
              )
              .get()
              .then(({ data })=>{
                if(data && data.length){
                  resolve({ code: 0, status: 1,data, message: '成功' })
                }
                else{
                  resolve({ code: 404,status: -1 ,message: '没有数据了' })
                }
              })
              .catch(()=>{
                resolve({ code: 501,status: -1 ,message: '出错了' })
              })
          })
}

/**
 * 消息发布
 * @param { access_token,openid,template_id,page,data,love_id, }
 * access_token
 * openid
*/
dbService.sendMessage = function (param) {
  var date = new Date(),
      y = date.getFullYear(),
      m = date.getMonth() + 1,
      d = date.getDate()
  m = m < 10 ? '0'+ m : m
  d = d < 10 ? '0'+ d : d
  return  new Promise((resolve,reject)=>{
    cloud.openapi.subscribeMessage.send({
      touser: param.author,     // 接收openid
      templateId: 'EVcqnpRB4Hx1zQupO8yqBG7TpOflHle9oGeaTcsTVJg',
      emphasisKeyword: 'thing2.value',
      page: 'pages/result/result?author_look=1&love_id='+ param.love_id,
      // 此处字段应修改为所申请模板所要求的字段
      data: {
        thing4: {
          value: param.detail.title,
        },
        time3: {
          value: y+'-'+m+'-'+d
        },
        thing2: {
          value: param.accept == -1 ? '不好意思我们还是做朋友吧' : '没想到我们早就心有灵犀了，我们开始吧！'
        },
        name1: {
          value: param.nickName
        },
      }
    })
    .then(()=>{
      resolve()
    })
    .catch(()=>{
      resolve()
    })
  })
}

module.exports = dbService