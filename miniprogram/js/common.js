export const base_music = 'https://6973-issue-c29395-1257603811.tcb.qcloud.la/kbb_music/TFBOYS-%E5%AE%A0%E7%88%B1.mp3'
export const verifyUser = function (param){
  // 获取用户信息
  wx.getSetting({
    success: res => {
      console.log('用户授权信息 res = ', res)
      if (res.authSetting['scope.userInfo']) {
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        wx.getUserInfo({
          success: res => {
            if (param && typeof param.callback === 'function') {
              wx.setStorageSync('user_info', res.userInfo)
              param.callback({
                logined: true,
                userInfo: res.userInfo
              })
            }
          }
        })
      } else {
        if(param && typeof param.callback === 'function'){
          param.callback({
            logined: false
          });
        }
      }
    }
  })
}

export const randomStr = function (len) {
  len = len || 32;
  var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  var maxPos = $chars.length;
  var pwd = '';
  for (var i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}
// 时间戳转yy-mm-dd
export const formatDateTime = function (inputTime,utile) {
  var  date  =  new  Date(inputTime);     
  var  y  =  date.getFullYear();       
  var  m  =  date.getMonth()  +  1;       
  m  =  m  <  10  ?  ('0'  +  m)  :  m;       
  var  d  =  date.getDate();       
  d  =  d  <  10  ?  ('0'  +  d)  :  d;       
  var  h  =  date.getHours();     
  h  =  h  <  10  ?  ('0'  +  h)  :  h;     
  var  minute  =  date.getMinutes();     
  var  second  =  date.getSeconds();     
  minute  =  minute  <  10  ?  ('0'  +  minute)  :  minute;       
  second  =  second  <  10  ?  ('0'  +  second)  :  second;    
  if (!utile) return y + '-' + m + '-' + d;
  else return  y  +  '-'  +  m  +  '-'  +  d + ' ' + h + ':' + minute// + ':' + second;
}
// 图片上传到本地临时目录
export const tempUpload = function (param) {
  wx.chooseImage({
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: chooseResult => {
      wx.showLoading({
        title: '上传中',
      })
      var str = /.\w+/g;
      var type_str = chooseResult.tempFilePaths[0].match(str);
      if (param && typeof param.callback === 'function') {
        param.callback({
          type: type_str[type_str.length - 1],
          chooseResult: chooseResult
        });
      }
    },
    complete: () => {
      wx.hideLoading()
    }
  })
}
//  视频上传到本地临时目录
export const tempUploadVideo = function (param) {
  wx.chooseVideo({
    sizeType: ['compressed'],
    sourceType: ['camera'],//,'album'],
    maxDuration: 20,
    success: chooseResult => {
      wx.showLoading({
        title: '上传中',
      })
      var str = /.(\w|\d)+/g;
      console.log(chooseResult)
      var type_str = chooseResult.tempFilePath.match(str);
      var type_ = type_str[type_str.length - 1]
      var user_ = '' //用户id
      if (app.globalData && app.globalData.openid){
        user_ = app.globalData.openid
      }
      var name_ = user_ + randomStr(32);
      var cataloge = param.cataloge ? param.cataloge : ''   //上传目录
      if(param && typeof param.tempCallback == 'function'){
        param.tempCallback(chooseResult.tempFilePath)
      }
      // 将视频上传至云存储空间
      wx.cloud.uploadFile({
        // 指定上传到的云路径
        cloudPath: cataloge + name_ + type_,
        // 指定要上传的文件的小程序临时文件路径
        filePath: chooseResult.tempFilePath,
        // 成功回调
        success: res => {
          wx.cloud.getTempFileURL({
            fileList: [res.fileID],//['cloud://test-2d83cc.b619-test-2d83cc/img/sZRny4cNAzpkTRFe4SpDzedwb6bZzN8Y.jpg'],
            success: data => {
              // fileList 是一个有如下结构的对象数组
              // [{
              //    fileID: 'cloud://xxx.png', // 文件 ID
              //    tempFileURL: '', // 临时文件网络链接
              //    maxAge: 120 * 60 * 1000, // 有效期
              // }]
              if (param && typeof param.callback === 'function') {
                param.callback({
                  list: data.fileList,
                  fileID: res.fileID
                });
              }
            },
            fail: err => {
              wx.hideLoading()
              wx.showModal({
                title: '小提示',
                content: '上传失败请检查你的网络',
              })
              console.log(err)
            },
            complete: () => {
              console.log('失败', res);
            }
          })
        },
        fail: res => {
          // if (param && typeof param.callback === 'function') {
          //   param.callback(res);
          // }
          wx.hideLoading()
          wx.showModal({
            title: '小提示',
            content: '上传失败请检查你的网络',
          })
          console.log('失败', res);
        },
        complete: () => {
          wx.hideLoading()
        }
      })
    },
    complete: () => {
      wx.hideLoading()
    }
  })
}
// 上传文件
export const uploadFileCloud = function (param) {
  if(param.uploadType === 'video') 
    tempUploadVideo({
      callback: e => {
        wx.showLoading({
          title: '上传中',
        })
        var chooseResult = e.chooseResult;
        var name_ = randomStr(32);
        var type_ = e.type;
        var cataloge = param.cataloge ? param.cataloge : ''   //上传目录
        // 将图片上传至云存储空间
        wx.cloud.uploadFile({
          // 指定上传到的云路径
          cloudPath: cataloge + name_ + type_,
          // 指定要上传的文件的小程序临时文件路径
          filePath: chooseResult.tempFilePaths[0],
          // 成功回调
          success: res => {
            wx.cloud.getTempFileURL({
              fileList: [res.fileID],//['cloud://test-2d83cc.b619-test-2d83cc/img/sZRny4cNAzpkTRFe4SpDzedwb6bZzN8Y.jpg'],
              success: data => {
                // fileList 是一个有如下结构的对象数组
                // [{
                //    fileID: 'cloud://xxx.png', // 文件 ID
                //    tempFileURL: '', // 临时文件网络链接
                //    maxAge: 120 * 60 * 1000, // 有效期
                // }]
                if (param && typeof param.callback === 'function') {
                  param.callback({
                    list: data.fileList
                  });
                }
              },
              fail: console.error,
              complete() {
                wx.hideLoading()
              }
            })
          },
          fail: res => {
            wx.hideLoading()
            // if (param && typeof param.callback === 'function') {
            //   param.callback(res);
            // }
            console.log('失败', res);
          },
          complete: () => {
          }
        })
      }
    });
  else 
    tempUpload({
      callback: e => {
        wx.showLoading({
          title: '上传中',
        })
        var chooseResult = e.chooseResult;
        var name_ = randomStr(32);
        var type_ = e.type;
        var cataloge = param.cataloge ? param.cataloge : ''   //上传目录
        // 将图片上传至云存储空间
        wx.cloud.uploadFile({
          // 指定上传到的云路径
          cloudPath: cataloge + name_ + type_,
          // 指定要上传的文件的小程序临时文件路径
          filePath: chooseResult.tempFilePaths[0],
          // 成功回调
          success: res => {
            wx.cloud.getTempFileURL({
              fileList: [res.fileID],//['cloud://test-2d83cc.b619-test-2d83cc/img/sZRny4cNAzpkTRFe4SpDzedwb6bZzN8Y.jpg'],
              success: data => {
                // fileList 是一个有如下结构的对象数组
                // [{
                //    fileID: 'cloud://xxx.png', // 文件 ID
                //    tempFileURL: '', // 临时文件网络链接
                //    maxAge: 120 * 60 * 1000, // 有效期
                // }]
                console.log(res)
                wx.hideLoading()
                if (param && typeof param.callback === 'function') {
                  param.callback({
                    list: data.fileList
                  });
                }
              },
              fail(e) {
                wx.hideLoading()
                console.log(e)
              },
              complete() {
              }
            })
          },
          fail: res => {
            wx.hideLoading()
            // if (param && typeof param.callback === 'function') {
            //   param.callback(res);
            // }
            console.log('失败', res);
          },
          complete: () => {
          }
        })
      }
    });
}
// 下载文件
export const downloadFile = function (param) {
  var fileID = param.fileID && param.fileID.length > 0 ? param.fileID : [];
  wx.cloud.getTempFileURL({
    fileList: fileID,//['cloud://test-2d83cc.b619-test-2d83cc/img/sZRny4cNAzpkTRFe4SpDzedwb6bZzN8Y.jpg'],
    success: res => {
      // fileList 是一个有如下结构的对象数组
      // [{
      //    fileID: 'cloud://xxx.png', // 文件 ID
      //    tempFileURL: '', // 临时文件网络链接
      //    maxAge: 120 * 60 * 1000, // 有效期
      // }]
      if(typeof param.callback === 'function'){
        param.callback({
          list: res.fileList
        });
      }
    },
    fail: console.error
  })
};
// 获取上传文件地址
export const getFileUrl = function (param) {
  wx.cloud.getTempFileURL({
    fileList: param.idArray,
    success: res => {
      // fileList 是一个有如下结构的对象数组
      // [{
      //    fileID: 'cloud://xxx.png', // 文件 ID
      //    tempFileURL: '', // 临时文件网络链接
      //    maxAge: 120 * 60 * 1000, // 有效期
      // }]
    },
    fail: console.error,
    complete: res => {
    }
  })
}