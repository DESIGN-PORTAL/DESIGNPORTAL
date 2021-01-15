// 简易深拷贝
export function deepCopy(object) {
  return JSON.parse(JSON.stringify(object))
}

/**
 * base64转file
 * @param {String}} dataurl
 * @param {String} filename
 */
export function dataURLtoFile(dataurl, filename) {
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

//将base64转换为blob
export function dataURLtoBlob(dataurl) {
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

//将blob转换为file
export function blobToFile(theBlob, fileName) {
  theBlob.lastModifiedDate = new Date()
  theBlob.name = fileName
  return theBlob
}

// 将file转换为blob
export function fileToBlob(file) {
  const reader = new FileReader()
  return new Promise((resolve) => {
    reader.onload = function (e) {
      resolve(e.target.result)
    }
    reader.readAsDataURL(file)
  })
}

// 获取图片 宽度高度
export function getImageInfo(data) {
  const image = new Image()
  return new Promise((resolve) => {
    image.onload = () => {
      resolve({
        width: image.width,
        height: image.height,
      })
    }

    image.src = data
  })
}

/**
 * Unit8数组转文件
 * @param {Unit8Array} array Unit8数组
 * @param {String} filename 文件名
 * @param {String} type 文件类型
 */
export function unit8ArrayToFile(array, filename, type) {
  return new File([array], filename, { type })
} 


/**
 * 节流函数
 */
let throttleTimer = null
let throttleStartTime = null
export function throttle(func, delay) {
  const curTime = Date.now()
  let remaining = null;
  if (throttleStartTime) {
    remaining = delay - (curTime - throttleStartTime)
  } else {
    throttleStartTime = Date.now();
  }
  return function() {
    const context = this
    const args = arguments
    clearTimeout(throttleTimer)
    if (remaining && remaining <= 0) {
      console.log('remaining', remaining)
      func.apply(context, args)
      throttleStartTime = Date.now()
    } else {
      throttleTimer = setTimeout(() => {
        func.apply(context, args)
        throttleStartTime = null;
      }, remaining || delay)
    }
  }
}

/**
 * 防抖函数
 */
let debounceTimer = null;
export function debounce(func, delay) {
  let startTime = Date.now()
  return function() {
    const curTime = Date.now()
    const remaining = delay - (curTime - startTime)
    const context = this
    const args = arguments

    clearTimeout(debounceTimer)
    if (remaining <= 0) {
      startTime = Date.now()
    } else {
      debounceTimer = setTimeout(() => {
        func.apply(context, args)
      }, remaining)
    }
  }
}
