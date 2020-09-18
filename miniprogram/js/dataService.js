// 保存情书
export const saveLoveBook = function (param = {}){
  return wx.cloud.callFunction({
    name: 'kbb_dataApi',
    data:{
      api: 'save_love_book',
      data: {
        ...param
      }
    }
  })
}
/**
 * 获取情书
 * @param { page,rows,love_id }
 * love_id: 不传则是获取创建者的情书列表
*/
export const getLoveBook = function (param = {}){
  return wx.cloud.callFunction({
    name: 'kbb_dataApi',
    data:{
      api: 'get_love_book',
      data: {
        ...param
      }
    }
  })
}
/**
 * 接受或拒绝
 * @param { love_id }
*/
export const acceptLove = function (param = {}){
  return wx.cloud.callFunction({
    name: 'kbb_dataApi',
    data:{
      api: 'accept_love',
      data: {
        ...param
      }
    }
  })
}
/**
 * 删除情书
 * @param { love_id }
*/
export const deleteLoveBook = function (param = {}){
  return wx.cloud.callFunction({
    name: 'kbb_dataApi',
    data:{
      api: 'delete_love_book',
      data: {
        love_id: param.love_id
      }
    }
  })
}
/**
 * 获取音乐列表
 * @param { page,rows }
 * page: 0开始
*/
export const getMusicList = function (param = {}){
  return wx.cloud.callFunction({
    name: 'kbb_dataApi',
    data:{
      api: 'music_list',
      data: {
        page: param.page,
        rows: param.rows
      }
    }
  })
}
/**
 * 获取土味情话列表
 * @param { page,rows }
 * page: 0开始
*/
export const getLovePrattle = function (param = {}){
  return wx.cloud.callFunction({
    name: 'kbb_dataApi',
    data:{
      api: 'love_prattle_list',
      data: {
        page: param.page,
        rows: param.rows
      }
    }
  })
}
/**
 * 获取模板
 * @param { page,rows }
 * page: 0开始
*/
export const getTemplate = function (param = {}){
  return wx.cloud.callFunction({
    name: 'kbb_dataApi',
    data:{
      api: 'template_list',
      data: {
        page: 0,
        rows: 20
      }
    }
  })
}