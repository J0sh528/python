Page({
  data: {
    companyName: '',
    companyInfo: null
  },
  onInput: function (e) {
    this.setData({
      companyName: e.detail.value
    });
  },
  onSearch: function () {
    if (this.data.companyName === '') {
      wx.showToast({
        title: '请输入想要查询的公司名称',
        icon: 'none'
      });
      return;
    }
    wx.request({
      url: 'http://127.0.0.1:5000/company', // 确保URL正确
      method: 'GET',
      data: {
        name: this.data.companyName
      },
      success: (res) => {
        if (res.data.length === 0) {
          wx.showToast({
            title: '未找到公司信息',
            icon: 'none'
          });
        } else {
          this.setData({
            companyInfo: res.data[0]
          });
        }
      },
      fail: (error) => {
        console.error('Failed to fetch data', error);
        wx.showToast({
          title: '查询失败',
          icon: 'none'
        });
      }
    });
  }
});
