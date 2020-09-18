/**
 * 用户相关
*/
// import { searchUserInof } from './middle.js'
const { 
  addLoveBook,deleteLoveBook,updateLoveBook,getLoveBook,
  getMusicList,getLovePrattle,getTemplate,
  addUser,searchUserInof,updateUserInfo } = require('./middle.js')
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: 'issue-c29395' // cloud.DYNAMIC_CURRENT_ENV
})

/**
 * event 参数包含小程序端调用传入的 data
 * 
 */
exports.main = async (e, context) => {
  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）等信息
  const info = cloud.getWXContext()
  try{
    var req_data = e.data || {}
    switch(e.api){
      // 获取音乐列表
      case "music_list":
        return await getMusicList({
          page: req_data.page || 0,
          rows: req_data.rows || 10,
        })
        break;
      // 获取情话列表
      case "love_prattle_list":
        return await getLovePrattle({
          page: req_data.page || 0,
          rows: req_data.rows || 10,
        })
        break;
      // 添加用户
      case "add_user":
        return await addUser({
          table: 'kbb_user',
          data: {
            ...req_data,
            openid: info.OPENID,
            love_book: 0,
            create_date: Date.now(),
            update_date: Date.now(),
          }
        })
        break;
      // 搜索用户
      case "search_user":
        return await searchUserInof({
          table: 'kbb_user',
          condition: {
            openid: info.OPENID
          }
        })
        break;
      // 更新用户信息
      case "update_user":
        return await updateUserInfo({
          table: 'kbb_user',
          condition: {
            openid: info.OPENID
          },
          data: {
            ...req_data,
            update_date: Date.now(),
          }
        })
        break;
      // 保存情书
      case "save_love_book":
        return await addLoveBook({
          table: 'kbb_love_book',
          data: {
            ...req_data,
            author: info.OPENID,
            author_id: info.OPENID,
            create_date: Date.now(),
            update_date: Date.now(),
          }
        })
        break;
      // 删除情书
      case "delete_love_book":
        return await deleteLoveBook({
          ...req_data,
          table: 'kbb_love_book',
          openid: info.OPENID,
        })
        break;
      // 更新情书
      case "update_love_book":
        return await updateLoveBook({
          ...req_data,
          table: 'kbb_love_book',
          openid: info.OPENID,
        })
        break;
      // 接受或拒绝情书
      case "accept_love":
        if(req_data.author === info.OPENID){
          return { code: 500 , status: -1 ,message: '接受人不能是自己' }
        }
        else {
          return await updateLoveBook({
            ...req_data,
            table: 'kbb_love_book',
            target_id: info.OPENID,
            openid: info.OPENID,
          })
        }
        break;
      // 通过id获取情书
      case "get_love_book":
        return await getLoveBook({
          ...req_data,
          table: 'kbb_love_book',
          openid: info.OPENID,
        })
        break;
      // 获取模板
      case "template_list":
        return await getTemplate({
          ...req_data,
          table: 'kbb_template',
        })
        break;
      default:
        return {
          code: 401,
          message: '没有找到相应服务'
        }
    }
  }
  catch(error){
    return {
      code: 500,
      error,
    }
  }
}

