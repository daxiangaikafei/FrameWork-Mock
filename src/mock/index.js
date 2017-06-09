import Mock from 'mockjs'

function checkReg(str) {
  if (/^\/.*\/i?g?m?/ig.test(str)) {
    let arr = (str+'').split('/')
    try {
          str = new RegExp(arr[1],arr[2])
      } catch(e) {
          str = str
      }
  } 
  return str
}

export function getMock(json, option) {
  json = json || {
    success: true,
    message: "Ok",
    responseCode: 1000,
    data: {
    }
  }
  if (option.isDynamic) {
    if (option.num !== '' && option.num>=0) {
      const num = option.num    
      const list = [];
      for (let i = 0; i < num; i++) {
        for (let key in json.data) {
          json.data[key] = checkReg(json.data[key])
        }
        list.push(Mock.mock(json.data));
      }
      json.data = list
    } else {
      for (let key in json.data) {
        json.data[key] = checkReg(json.data[key])
      }
      json.data = Mock.mock(json.data)
    }
  }
  return json
}