// pages/index/index.js
Page({
  data: {
    imageUrl: '',
    resultImageUrl: '',
    detections: [],
    showResultImage: false
  },

  chooseImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        this.setData({ imageUrl: tempFilePath, showResultImage: false, detections: [] });
        this.uploadImage(tempFilePath);
      }
    });
  },

  uploadImage(filePath) {
    wx.uploadFile({
      url: 'http://127.0.0.1:5000/detect', 
      filePath: filePath,
      name: 'file',
      success: (res) => {
        const data = JSON.parse(res.data);
        if (data.image) {
          this.setData({ 
            resultImageUrl: 'data:image/jpeg;base64,' + data.image,
            detections: data.detections 
          });
        } else {
          console.error('No image data in response:', data);
        }
      },
      fail: (err) => {
        console.error('Upload failed:', err);
      }
    });
  },

  showResultImage() {
    this.setData({ showResultImage: true });
    console.log('Detections:', this.data.detections);
  }
});
