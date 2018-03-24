
//index.js  
//获取应用实例  
var app = getApp();
Page({
  data: {
    msg_try_connection: "等待中",
    msg2_try_connection: "等待中",
    searchsuccess: 'true',
    status: "",
    sousuo: "",
    time: "",
    data_receive: "",
    connectedDeviceId: "", //已连接设备uuid  
    services: "", // 连接设备的服务
    serviceCharacteristics: "", //储存characteristic的值  
    characteristics: "",   // 连接设备的状态值  
    writeServiceId: "", // 可写服务uuid  
    writeCharacteristicsId: "",//可写特征值uuid  
    readServiceId: "", // 可读服务uuid  
    readCharacteristicsId: "",//可读特征值uuid  
    notifyServiceId: "", //通知服务UUid  
    notifyCharacteristicsId: "", //通知特征值UUID  
    inputValue: "",
    characteristics1: "", // 连接设备的状态值  
  },
  onLoad: function () {
    var that = this;
    if (wx.openBluetoothAdapter) {
      wx.openBluetoothAdapter()
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示  
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  getTimeNow: function () {
    var timenow = Date.now();
    var that = this;
    this.setData({
      time_now: timenow
    })
  },

  lanya00: function () {
    var that = this;
    wx.openBluetoothAdapter({
      success: function (res) {
        that.setData({
          msg: "初始化蓝牙适配器成功！" + JSON.stringify(res),
        })
        //监听蓝牙适配器状态  
        wx.onBluetoothAdapterStateChange(function (res) {
          that.setData({
            sousuo: res.discovering ? "在搜索。" : "未搜索。",
            status: res.available ? "可用。" : "不可用。",
          })
        })
      },
      fail: function (res) {
        console.log('------openBluetoothAdapter failed------');
      }
    })
    wx.getBluetoothAdapterState({
      success: function (res) {
        that.setData({
          msg: "本机蓝牙适配器状态" + "/" + JSON.stringify(res.errMsg),
          sousuo: res.discovering ? "在搜索。" : "未搜索。",
          status: res.available ? "可用。" : "不可用。",
        })
        //监听蓝牙适配器状态  
        wx.onBluetoothAdapterStateChange(function (res) {
          that.setData({
            sousuo: res.discovering ? "在搜索。" : "未搜索。",
            status: res.available ? "可用。" : "不可用。",
          })
        })
      },
      fail: function (res) {
        console.log('------openBluetoothAdapter failed------');
      }
    })
    wx.getBluetoothAdapterState({
      success: function (res) {
        that.setData({
          msg: "本机蓝牙适配器状态" + "/" + JSON.stringify(res.errMsg),
          sousuo: res.discovering ? "在搜索。" : "未搜索。",
          status: res.available ? "可用。" : "不可用。",
        })
        //监听蓝牙适配器状态
        wx.onBluetoothAdapterStateChange(function (res) {
          that.setData({
            sousuo: res.discovering ? "在搜索。" : "未搜索。",
            status: res.available ? "可用。" : "不可用。",
          })
        })
      },
      fail: function (res) {
        console.log('------getState failed------');
      }
    })
    wx.startBluetoothDevicesDiscovery({
      success: function (res) {
        that.setData({
          msg: "搜索设备" + JSON.stringify(res),
        })
        //监听蓝牙适配器状态  
        wx.onBluetoothAdapterStateChange(function (res) {
          that.setData({
            sousuo: res.discovering ? "在搜索。" : "未搜索。",
            status: res.available ? "可用。" : "不可用。",
          })
        })
      },
      fail: function (res) {
        console.log('------StartSearch failed------');
      }
    })
    setTimeout(function () { //
      wx.getBluetoothDevices({
        success: function (res) {
          //是否有已连接设备  
          wx.getConnectedBluetoothDevices({
            success: function (res) {
              console.log(JSON.stringify(res.devices));
              that.setData({
                connectedDeviceId: res.deviceId
              })
            }
          })

          that.setData({
            msg: "搜索设备" + JSON.stringify(res.devices),
            devices: res.devices,
          })
          //监听蓝牙适配器状态  
          wx.onBluetoothAdapterStateChange(function (res) {
            that.setData({
              sousuo: res.discovering ? "在搜索。" : "未搜索。",
              status: res.available ? "可用。" : "不可用。",
            })
          })
        },
        fail: function (res) {
          console.log('------getDevices failed------');
        }
      })
      wx.stopBluetoothDevicesDiscovery({
        success: function (res) {
          that.setData({
            msg: "停止搜索周边设备" + "/" + JSON.stringify(res.errMsg),
            sousuo: res.discovering ? "在搜索。" : "未搜索。",
            status: res.available ? "可用。" : "不可用。",
          })
        },
        fail: function (res) {
          console.log('------stopSearch failed------');
        },
        complete: function (res) {
          console.log("-----Searching finish------")
        }
      })
    }, 1500)
  },
  connectInOne: function () {
    var connected = 'n';
    var searched = 'n';
    var that = this;
    var timePre;
    var wait_interval = 400;
    that.setData({
      msg2_try_connection: "等待中"
    })

    //1初始化 并尝试连接
    wx.openBluetoothAdapter({
      success: function (res) {
        that.setData({
          msg_try_connection: "初始化蓝牙适配器成功"
        })
        //监听蓝牙适配器状态  
        console.log("1---initializing blutooth success---");
        timePre = Date.now();
        while (Date.now() - timePre <= wait_interval) { }
        //2获取适配状态
        wx.getBluetoothAdapterState({
          success: function (res) {
            that.setData({
              msg_try_connection: "获取蓝牙配置器状态成功",
            })
            console.log("2---get bluetooth adapter state success---");
            console.log(res);
            timePre = Date.now();
            while (Date.now() - timePre <= wait_interval) { }
            //2.5首先关闭蓝牙搜索
            wx.stopBluetoothDevicesDiscovery({
              success: function (res) {
                that.setData({
                  msg_try_connection: "已关闭蓝牙搜索"
                })
                console.log("2.5---close BLE searching success---")
              },
              fail: function (res) {
                console.log("2.5---close BLE searching failed---")
                console.log(res)
              }
            })

            timePre = Date.now();
            while (Date.now() - timePre <= wait_interval) { }
            //3搜索设备
            wx.startBluetoothDevicesDiscovery({
              success: function (res) {
                that.setData({
                  msg_try_connection: "搜索周边设备成功",
                })
                console.log("3---start searching success---");
                console.log(res);
                //4获取设备
                timePre = Date.now();
                //在此处设置第一次搜索的时间
                while (Date.now() - timePre <= 4 * wait_interval) { }
                wx.getBluetoothDevices({
                  success: function (res) {
                    //4.1检查是否有已连接设备
                    timePre = Date.now();
                    while (Date.now() - timePre <= wait_interval) { }
                    /*
                    wx.getConnectedBluetoothDevices({
                      success: function (res) {
                        console.log("4.1---device already connected---");
                        console.log(res);
                        console.log(res.deviceId)
                        that.setData({
                          connectedDeviceId: res.deviceId
                        })
                        wx.closeBLEConnection({
                          deviceId: that.data.connectedDeviceId,
                          success: function (res) {
                            that.setData({
                              connectedDeviceId: "",
                            })
                            console.log("4.1.1---close BLE connection success---")
                          },
                          fail: function (res) {
                            console.log("4.1.1---close BLE connection failed---")
                          }
                        })  
                      },
                      fail: function (res) {
                        console.log("4.1---no connected device---");
                      }
                    })
                    */
                    console.log("4---get searched device success---")
                    console.log(res)
                    that.setData({
                      msg_try_connection: "获取搜索设备成功",
                      devices: res.devices,
                    })
                    console.log(res.devices)
                    // 搜索是否有指定蓝牙 第一次尝试
                    var i = 0;
                    var theDevice;
                    for (i = 0; i < res.devices.length; i++) {
                      if (res.devices[i]['name'] == "JDY-10-V2.4") {
                        theDevice = res.devices[i]
                        console.log(theDevice)
                        that.setData({
                          msg2_try_connection: "搜索到JDY-10-V2.4，正在尝试连接，请等待",
                        })
                        searched = 'y';
                      }
                    }
                    // 第二次尝试
                    if (searched == 'n') {
                      that.setData({
                        msg2_try_connection: "未搜索到指定设备，正在尝试第二次搜索，请等待"
                      })
                      timePre = Date.now();
                      //在此处设置第二次搜索等待的时间
                      while (Date.now() - timePre <= 14 * wait_interval) { }
                      for (i = 0; i < res.devices.length; i++) {
                        if (res.devices[i]['name'] == "JDY-10-V2.4") {
                          theDevice = res.devices[i]
                          console.log(theDevice)
                          that.setData({
                            msg2_try_connection: "搜索到JDY-10-V2.4，正在尝试连接，请等待",
                          })
                          searched = 'y';
                          break
                        }
                      }
                    }
                    if (searched == 'n') {
                      that.setData({
                        msg2_try_connection: "未搜索到指定设备，请确定设备在范围内或尝试重新搜索",
                      })
                    }
                    else if (searched == 'y') {
                      //5.2尝试连接
                      wx.createBLEConnection({
                        deviceId: theDevice.deviceId,
                        success: function (res) {
                          console.log("5.2------connection success------");
                          console.log(res);
                          connected = 'y';
                          that.setData({
                            connectedDeviceId: theDevice.deviceId,
                            msg: "已连接" + theDevice.deviceId,
                            msg1: "",
                            msg2_try_connection: "成功连接到指定设备",
                          })
                          //6关闭蓝牙搜索
                          timePre = Date.now();
                          while (Date.now() - timePre <= wait_interval) { }
                          wx.stopBluetoothDevicesDiscovery({
                            success: function (res) {
                              that.setData({
                                msg_try_connection: "已关闭蓝牙搜索"
                              })
                              console.log("6---close BLE searching success---")
                              timePre = Date.now();
                              while (Date.now() - timePre <= wait_interval) { }
                              console.log("6.5---start getting service---")
                              //获取service
                              wx.getBLEDeviceServices({
                                // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取  
                                deviceId: that.data.connectedDeviceId,
                                success: function (res) {
                                  console.log("7------get service success------");
                                  console.log(res);
                                  that.setData({
                                    services: res.services,
                                    msg_try_connection: "获取蓝牙service成功"
                                  })
                                  //获取uuid
                                  timePre = Date.now();
                                  while (Date.now() - timePre <= (wait_interval) ) {}
                                  //8.1首先获取 write 的 characteristics
                                  wx.getBLEDeviceCharacteristics({
                                    // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
                                    deviceId: that.data.connectedDeviceId,
                                    // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取  
                                    // 对于安卓手机成功发送的配置是that.data.services[0].uuid
                                    serviceId: that.data.services[0].uuid,
                                    success: function (res) {
                                      console.log('8.1------get characteristics success------');
                                      //console.log('device getBLEDeviceCharacteristics res:');
                                      console.log(res);
                                      that.setData({
                                        msg_try_connection: "获取蓝牙characteristics成功",
                                        serviceCharacteristics: res.characteristics,
                                      })
                                      that.setData({
                                        writeServiceId: that.data.services[0].uuid,
                                        writeCharacteristicsId: res.characteristics[0].uuid,
                                      });
                                      
                                    },
                                    fail: function () {
                                      console.log("8.1------get characteristics failed------");
                                    }
                                  })
                                  timePre = Date.now();
                                  while (Date.now() - timePre <= (wait_interval)) { }
                                  //8.2然后获取 read 的 characteristics
                                  wx.getBLEDeviceCharacteristics({
                                    deviceId: that.data.connectedDeviceId,
                                    serviceId: that.data.services[1].uuid, //此处的是对于安卓手机的 read 配置
                                    success: function (res) {
                                      console.log('8.2------get characteristics success------');
                                      //console.log('device getBLEDeviceCharacteristics res:');
                                      console.log(res); 
                                      that.setData({
                                        msg_try_connection: "获取蓝牙characteristics成功",
                                        serviceCharacteristics: res.characteristics,
                                      })
                                      //接下来这个很魔幻 我也不知道怎么办
                                      //第一次成功 lhy的安卓 配置为2，1
                                      //配置为1，0：
                                      //  4a44592d31302d56322e340000000
                                      //  发送任意内容后会变成10101010101010101010
                                      //配置为1，1：
                                      //    0000
                                      //    发送后变成10
                                      that.setData({
                                        readServiceId: that.data.services[1].uuid,
                                        readCharacteristicsId: res.characteristics[1].uuid,
                                      }); 
                                    },
                                    fail: function () {
                                      console.log("8.2------get characteristics failed------");
                                    }
                                  })
                                },
                                fail: function (res) {
                                  console.log("7------get service failed------");
                                  console.log(res);
                                }
                              })
                            },
                            fail: function (res) {
                              console.log("6---close BLE searching failed---")
                              console.log(res)
                            }
                          })
                        },
                        fail: function () {
                          console.log("5.2------connection failed------");
                          console.log(res);
                          that.setData({
                            msg2_try_connection: "无法连接到指定设备"
                          })
                        }
                      })
                    }
                    //4.2监听蓝牙适配器状态 
                    timePre = Date.now();
                    while (Date.now() - timePre <= wait_interval) { }
                    wx.onBluetoothAdapterStateChange(function (res) {
                      that.setData({
                        sousuo: res.discovering ? "在搜索。" : "未搜索。",
                        status: res.available ? "可用。" : "不可用。",
                      })
                    })
                  },
                  fail: function (res) {
                    console.log("4----get searched data failed----");
                    console.log(res);
                  }
                })
              },
              fail: function (res) {
                console.log("3---start searching failed---");
                console.log(res);
              }
            })
          },
          fail: function (res) {
            that.setData({
              msg_try_connection: "获取蓝牙配置器状态失败",
            })
            console.log("2---get bluetooth adapter state failed---");
            console.log(res);
          }
        })
      },
      fail: function (res) {
        that.setData({
          msg_try_connection: "初始化蓝牙配置器失败，请检查蓝牙是否开启",
        })
        console.log("1---initializing bluetooth failed---");
        console.log(res);
      }
    });

  },

  // 初始化蓝牙适配器  
  lanya1: function () {
    var that = this;
    wx.openBluetoothAdapter({
      success: function (res) {
        that.setData({
          msg: "初始化蓝牙适配器成功！" + JSON.stringify(res),
        })
        //监听蓝牙适配器状态  
        wx.onBluetoothAdapterStateChange(function (res) {
          that.setData({
            sousuo: res.discovering ? "在搜索。" : "未搜索。",
            status: res.available ? "可用。" : "不可用。",
          })
        })
      }
    })
  },
  // 本机蓝牙适配器状态  
  lanya2: function () {
    var that = this;
    wx.getBluetoothAdapterState({
      success: function (res) {
        that.setData({
          msg: "本机蓝牙适配器状态" + "/" + JSON.stringify(res.errMsg),
          sousuo: res.discovering ? "在搜索。" : "未搜索。",
          status: res.available ? "可用。" : "不可用。",
        })
        //监听蓝牙适配器状态  
        wx.onBluetoothAdapterStateChange(function (res) {
          that.setData({
            sousuo: res.discovering ? "在搜索。" : "未搜索。",
            status: res.available ? "可用。" : "不可用。",
          })
        })
      }
    })
  },
  //搜索设备  
  lanya3: function () {
    var that = this;
    wx.startBluetoothDevicesDiscovery({
      success: function (res) {
        that.setData({
          msg: "搜索设备" + JSON.stringify(res),
        })
        //监听蓝牙适配器状态  
        wx.onBluetoothAdapterStateChange(function (res) {
          that.setData({
            sousuo: res.discovering ? "在搜索。" : "未搜索。",
            status: res.available ? "可用。" : "不可用。",
          })
        })
      },
      fail: function (res) {
        console.log("-----start searching failed------");
        console.log(res);
      }
    })
  },
  // 获取所有已发现的设备  
  lanya4: function () {
    var that = this;
    wx.getBluetoothDevices({
      success: function (res) {
        //是否有已连接设备  
        wx.getConnectedBluetoothDevices({
          success: function (res) {
            console.log(JSON.stringify(res.devices));
            that.setData({
              connectedDeviceId: res.deviceId
            })
          }
        })
        that.setData({
          msg: "搜索设备" + JSON.stringify(res.devices),
          devices: res.devices,
        })
        //监听蓝牙适配器状态  
        wx.onBluetoothAdapterStateChange(function (res) {
          that.setData({
            sousuo: res.discovering ? "在搜索。" : "未搜索。",
            status: res.available ? "可用。" : "不可用。",
          })
        })
      },
      fail: function (res) {
        console.log("----get searched data failed----");
        console.log(res);
      }
    })
  },
  //停止搜索周边设备  
  lanya5: function () {
    var that = this;
    wx.stopBluetoothDevicesDiscovery({
      success: function (res) {
        that.setData({
          msg: "停止搜索周边设备" + "/" + JSON.stringify(res.errMsg),
          sousuo: res.discovering ? "在搜索。" : "未搜索。",
          status: res.available ? "可用。" : "不可用。",
        })
      }
    })
  },
  //连接设备  
  connectTO: function (e) {
    var that = this;
    wx.createBLEConnection({
      deviceId: e.currentTarget.id,
      success: function (res) {
        console.log("------connection success------");
        console.log(res.errMsg);
        that.setData({
          connectedDeviceId: e.currentTarget.id,
          msg: "已连接" + e.currentTarget.id,
          msg1: "",
        })
      },
      fail: function () {
        console.log(res);
        console.log("------connection failed------");
      },
      complete: function () {
        console.log("------connection end------");
      }
    })
    console.log('connectedDeviceId:' + that.data.connectedDeviceId);
  },
  // 获取连接设备的service服务  
  lanya6: function () {
    var that = this;
    wx.getBLEDeviceServices({
      // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取  
      deviceId: that.data.connectedDeviceId,
      success: function (res) {
        console.log("------get service success------");
        console.log(res);
        that.setData({
          services: res.services,
          msg: JSON.stringify(res.services),
        })
      },
      fail: function (res) {
        console.log(res);
        console.log("------get service failed------");
      }
    })
  },
  //获取连接设备的所有特征值  for循环获取不到值  
  lanya7: function () {
    var that = this;
    wx.getBLEDeviceCharacteristics({
      // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取  
      deviceId: that.data.connectedDeviceId,
      // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取  
      // 对于安卓手机成功发送的配置是that.data.services[0].uuid
      serviceId: that.data.services[0].uuid,
      success: function (res) {
        for (var i = 0; i < res.characteristics.length; i++) {
          if (res.characteristics[i].properties.notify) {
            //console.log("Service0:" + that.data.services[0].uuid);
            //console.log("Characteristics0:", res.characteristics[i].uuid);
            that.setData({
              notifyServiceId: that.data.services[0].uuid,
              notifyCharacteristicsId: res.characteristics[i].uuid,
            })
          }
          if (res.characteristics[i].properties.write) {
            //console.log("Characteristics1:", res.characteristics[i].uuid);
            that.setData({
              writeServiceId: that.data.services[0].uuid,
              writeCharacteristicsId: res.characteristics[i].uuid,
            })

          } else if (res.characteristics[i].properties.read) {
            //console.log("Characteristics2:", res.characteristics[i].uuid);
            that.setData({
              readServiceId: that.data.services[0].uuid,
              readCharacteristicsId: res.characteristics[i].uuid,
            })

          }
        }
        console.log('------get characteristics success------');
        console.log('device getBLEDeviceCharacteristics res:');
        console.log(res);
        that.setData({
          msg: JSON.stringify(res.characteristics),
          serviceCharacteristics: res.characteristics,
        })
      },
      fail: function () {
        console.log("------get characteristics failed------");
      },
      complete: function () {
        console.log("------get characteristics finish------");
      }
    })

  },
  //断开设备连接  
  lanya0: function () {
    var that = this;
    wx.closeBLEConnection({
      deviceId: that.data.connectedDeviceId,
      success: function (res) {
        that.setData({
          connectedDeviceId: "",
        })
        console.log("---close BLE connection success---")
      },
      fail: function (res) {
        console.log("---close BLE connection failed---")
      }
    })
  },
  //监听input表单  
  inputTextchange: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  //发送  
  lanya8: function () {
    var that = this;
    // 这里的回调可以获取到 write 导致的特征值改变  
    wx.onBLECharacteristicValueChange(function (characteristic) {
      console.log('characteristic value changed:1', characteristic)
    })
    var buf = new ArrayBuffer(16)
    var dataView = new DataView(buf)
  },

  lanya9: function () {
    var that = this;
    //启用低功耗蓝牙设备特征值变化时的 notify 功能  
    //var notifyServiceId = that.data.notifyServiceId.toUpperCase();  
    //var notifyCharacteristicsId = that.data.notifyCharacteristicsId.toUpperCase();  
    //console.log("11111111", notifyServiceId);  
    //console.log("22222222222222222", notifyCharacteristicsId);  
    wx.notifyBLECharacteristicValueChange({
      state: true, // 启用 notify 功能  
      // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取  
      deviceId: that.data.connectedDeviceId,
      // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取  
      serviceId: that.data.notifyServiceId,
      // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取  
      characteristicId: that.data.notifyCharacteristicsId,
      success: function (res) {
        console.log('notifyBLECharacteristicValueChange success');
        console.log(res.errMsg)
      },
      fail: function () {
        console.log('------open notify failed------');
        console.log(that.data.notifyServiceId);
        console.log(that.data.notifyCharacteristicsId);
      }
    })
  },
  //接收消息  
  lanya10: function () {
    var that = this;
    //首先启用notify功能 好像开启了还收不到？？？
    //在安卓上 由于notify和write属性同时为true
    
    wx.notifyBLECharacteristicValueChange({
      state: true, // 启用 notify 功能
      deviceId: that.data.connectedDeviceId,
      serviceId: that.data.writeServiceId,
      characteristicId: that.data.writeCharacteristicsId,
      success: function (res) {
        console.log('---notify open success---')
        console.log(res)
      },
      fail: function (res) {
        console.log('---notify open failed---')
        console.log(res)
      },
      complete: function(res){
        console.log("---notify open complete---")
      }
    }) 
    // 必须在这里的回调才能获取  
    wx.onBLECharacteristicValueChange(function (characteristic) {
      console.log('characteristic value comed(buf):', characteristic)
      console.log('characteristic value comed(hex):', that.buf2hex(characteristic))
      that.setData({
        data_receive: that.buf2hex(characteristic)
      })
    })
    /*
    wx.readBLECharacteristicValue({
      deviceId: that.data.connectedDeviceId,
      serviceId: that.data.readServiceId,
      characteristicId: that.data.readCharacteristicsId,
      success: function (res) {
        console.log('-1---read data success---');
        console.log(res)
      },
      fail: function (res) {
        console.log('-1---read data failed---')
        console.log(res)
      },
      complete: function (res){
        console.log('serviceId:', that.data.readServiceId)
        console.log('characteristicId:', that.data.readCharacteristicsId)
        console.log('---read finish---')
      }
    })
    */
    var timePre;
    timePre = Date.now();
    while (Date.now() - timePre <= 1000) { }
    that.sendMesA()
  },
  sendMesA: function () {
    var that = this;
    var hex = '01'
    var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
      return parseInt(h, 16)
    }))
    //console.log(typedArray);
    //console.log([0xAA, 0x55, 0x04, 0xB1, 0x00, 0x00, 0xB5]);
    var buffer1 = typedArray.buffer;
    //console.log("Mes:" + buffer1);
    //console.log(that.data.serviceCharacteristics);
    //console.log("sending start")
    
    /*这一部分已经整合到 “一键连接” 中
    对于lhy的安卓手机成功的配置如下
      that.setData({
        writeServiceId: that.data.services[0].uuid,
        writeCharacteristicsId: that.data.serviceCharacteristics[0].uuid,
      });
    其中获取到的service一共有三个 characteris一共有两个
    */
    wx.writeBLECharacteristicValue({
      // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取  
      deviceId: that.data.connectedDeviceId,

      // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
      // 对于write 在bt05中是 data.services[1].uuid 观察否相同
      serviceId: that.data.writeServiceId,

      // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取  
      // 对于之前成功的配置应为 characteristics[0].uuid
      characteristicId: that.data.writeCharacteristicsId,
      value: buffer1,
      success: function (res) {
        // success
        console.log("------sending success------");
        console.log(res);
        that.setData({
          msg_try_connection: "成功发送指令"
        });
      },
      fail: function (res) {
        // fail
        console.log("------sending failed------");
        console.log(res);
      },
      complete: function (res) {
        console.log('serviceId:', that.data.writeServiceId);
        console.log('characterisitcId:', that.data.writeCharacteristicsId);
        console.log("-------sending finish-------");// complete
      }
    })
  },
  sendMesB: function () {
    var that = this;
    var hex = '02'
    var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
      return parseInt(h, 16)
    }))
    //console.log(typedArray);
    //console.log([0xAA, 0x55, 0x04, 0xB1, 0x00, 0x00, 0xB5]);
    var buffer1 = typedArray.buffer;
    //console.log("Mes:" + buffer1);
    //console.log(that.data.serviceCharacteristics);

    /*
    对于lhy的安卓手机成功的配置如下
      that.setData({
        writeServiceId: that.data.services[0].uuid,
        writeCharacteristicsId: that.data.serviceCharacteristics[0].uuid,
      });
    其中获取到的service一共有三个 characteris一共有两个
    */
    wx.writeBLECharacteristicValue({
      // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取  
      deviceId: that.data.connectedDeviceId,

      // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
      // 对于write 在bt05中是 data.services[1].uuid 观察否相同
      serviceId: that.data.writeServiceId,

      // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取  
      // 对于之前成功的配置应为 characteristics[0].uuid
      characteristicId: that.data.writeCharacteristicsId,
      value: buffer1,
      success: function (res) {
        // success
        console.log("------sending success------");
        console.log(res);
        that.setData({
          msg_try_connection: "成功发送指令"
        });
      },
      fail: function (res) {
        // fail
        console.log("------sending failed------");
        console.log(res);
      },
      complete: function (res) {
        console.log('serviceId:', that.data.writeServiceId);
        console.log('characterisitcId:', that.data.writeCharacteristicsId);
        console.log("-------sending finish-------");// complete
      }
    })
  },
  buf2hex: function (buffer) { // buffer is an ArrayBuffer
    return Array.prototype.map.call(new Uint8Array(buffer.value), x => ('00' + x.toString(16)).slice(-2)).join('');
  }
})  