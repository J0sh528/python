// pages/index/index.js

Page({
  data: {
    stocks: []
  },
  onLoad: function () {
    console.log("Page loaded, fetching stock data...");
    this.getStockData();
  },
  getStockData: function () {
    const that = this;
    const baseUrl = 'http://127.0.0.1:5000';  // 确保这里是后端服务的正确地址
    wx.request({
      url: baseUrl + '/get_data',
      method: 'GET',
      success: function (res) {
        if (res.statusCode === 200) {
          console.log("Data fetched successfully:", res.data);
          that.setData({
            stocks: res.data
          });
          that.drawChart(res.data);
        } else {
          console.error('Failed to get data:', res);
        }
      },
      fail: function (err) {
        console.error('Request failed:', err);
      }
    });
  },
  drawChart: function (data) {
    const ctx = wx.createCanvasContext('barCanvas');
    const canvasWidth = 320; // 画布宽度
    const canvasHeight = 200; // 画布高度
    const margin = 20; // 边距
    const barWidth = (canvasWidth - 2 * margin) / data.length; // 柱状图宽度
    const maxEmployeeNum = Math.max(...data.map(item => parseInt(item.EmployeeNum))); // 获取最大的员工数量

    // 绘制坐标轴
    ctx.beginPath();
    ctx.moveTo(margin, margin);
    ctx.lineTo(margin, canvasHeight - margin);
    ctx.lineTo(canvasWidth - margin, canvasHeight - margin);
    ctx.stroke();

    // 绘制纵坐标标签（员工数量）
    ctx.setFillStyle('#000000');
    ctx.setFontSize(10);
    ctx.fillText('员工数量', margin - 20, margin);

    

    // 绘制柱状图
    data.forEach((item, index) => {
      const barHeight = canvasHeight * parseInt(item.EmployeeNum) / maxEmployeeNum;
      ctx.setFillStyle('#6196f3');
      ctx.fillRect(margin + index * barWidth, canvasHeight - margin - barHeight, barWidth, barHeight);
      // 在柱状图上方标注员工数量
      ctx.setFillStyle('#000000');
      ctx.setFontSize(10);
      ctx.fillText(item.EmployeeNum, margin + index * barWidth + barWidth / 2-10, canvasHeight - margin - barHeight - 5);
    });
    ctx.fillText('公司名称', canvasWidth - margin + 5, canvasHeight - margin + 15);
    // 绘制柱状图标签（公司名称）
    ctx.setFillStyle('#000000');
    ctx.setFontSize(10);
    data.forEach((item, index) => {
      // 计算公司名称的位置
      const labelX = margin + index * barWidth + barWidth / 2-5;
      const labelY = canvasHeight - margin+10; // 将公司名称整体下移20单位
      // 保存当前绘图上下文状态
      ctx.save();
      // 平移坐标系到标签位置
      ctx.translate(labelX, labelY);
      // 旋转坐标系，使文字竖着显示
      ctx.rotate(Math.PI / 2);
      // 绘制文字
      ctx.fillText(item.CompanyName, -5, 0);
      // 恢复绘图上下文状态
      ctx.restore();
    });
    

    ctx.draw();
}

});
