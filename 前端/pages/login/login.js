// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: "",
    password: "",
    logincard: true,
    registercard: false,
    loginanimation: "",
    registeranimation: "",
    newname: "",
    newpassword: "",
    registeredAccounts: [], // 已注册的账号列表
    isLoggedIn: false // 用户登录状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 页面加载时尝试从本地存储中获取已注册的账号信息
    const registeredAccounts = wx.getStorageSync('registeredAccounts') || [];
    this.setData({
      registeredAccounts: registeredAccounts
    });

    // 检查用户是否已经登录
    const isLoggedIn = wx.getStorageSync('isLoggedIn') || false;
    this.setData({
      isLoggedIn: isLoggedIn
    });
  },

  // 省略其他生命周期函数和方法...

  login() {
    if (this.data.username == "") {
      wx.showToast({
        title: '账号不能为空',
        icon: 'none'
      })
    } else if (this.data.password == "") {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      })
    } else {
      // 发送登录请求到后端
      wx.request({
        url: 'http://127.0.0.1:5000/login', // 替换为你的Flask后端接口地址
        method: 'POST',
        data: {
          username: this.data.username,
          password: this.data.password
        },
        success: (res) => {
          if (res.data.message === 'Login successful') {
            wx.showToast({
              title: '登录成功',
              icon: 'none',
              success: () => {
                // 保存登录状态到本地存储
                wx.setStorageSync('isLoggedIn', true);
                // 跳转到我的页面
                setTimeout(() => {
                  wx.reLaunch({
                    url: '../yolo/yolo',
                  })
                }, 1000);
              }
            })
          } else {
            wx.showToast({
              title: '账号或密码错误',
              icon: 'none'
            })
          }
        }
      });
    }
  },
  

  switchCard() {
    if (this.data.logincard) {
      this.setData({
        loginanimation: 'fade-out-bck',
      })
      setTimeout(() => {
        this.setData({
          logincard: false,
          registercard: true,
          registeranimation: 'fade-in-bck',
          newname: "",
          newpassword: ""
        })
      }, 500);
    } else {
      this.setData({
        registeranimation: 'fade-out-bck'
      })
      setTimeout(() => {
        this.setData({
          registercard: false,
          logincard: true,
          loginanimation: 'fade-in-bck',
          username: "",
          password: ""
        })
      }, 500);
    }
  },

  register() {
    if (this.data.newname == "") {
      wx.showToast({
        title: '新账户不能为空',
        icon: 'none'
      })
    } else if (this.data.newpassword == "") {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      })
    } else {
      // 发送注册请求到后端
      wx.request({
        url: 'http://127.0.0.1:5000/register', // 替换为你的Flask后端接口地址
        method: 'POST',
        data: {
          username: this.data.newname,
          password: this.data.newpassword
        },
        success: (res) => {
          if (res.data.message === 'User registered successfully') {
            wx.showToast({
              title: '注册成功，请登录',
              icon: 'none',
              success: () => { // 使用箭头函数确保正确的上下文
                // 切换到登录界面
                this.switchCard(); // 直接调用 switchCard 方法
              }
            })
          } else {
            wx.showToast({
              title: '注册失败',
              icon: 'none'
            })
          }
        }
      });
    }
  },  
})
