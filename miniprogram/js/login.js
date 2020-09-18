import { randomStr } from "./common.js"
// 搜索用户信息
export const searchUser = function (userInfo = {}) {
  return  wx.cloud.callFunction({
            name: 'kbb_dataApi',
            data: {
              api: 'search_user',
            }
          })
}
// 更新用户信息
export const updateUser = function (userInfo = {},update = {}) {
  return  wx.cloud.callFunction({
            name: 'kbb_login',
            data: {
              api: 'update_user',
              param: {
                data: {
                  ...userInfo,
                  ...update,
                }
              },
            }
          });
}
// 添加用户
export const addUser = function (userInfo = {}) {
  return  wx.cloud.callFunction({
            name: 'kbb_dataApi',
            data: {
              api: 'add_user',
              data: {
                ...userInfo,
                issue_num: 0,
                user_id: randomStr(32)
              },
            }
          });
}