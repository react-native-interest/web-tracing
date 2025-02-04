import { AnyFun, AnyObj } from '../types'
import { logError } from './debug'
import { isRegExp, isArray } from './is'

/**
 * 添加事件监听器
 * @param target 对象
 * @param eventName 事件名称
 * @param handler 回调函数
 * @param opitons
 * @returns void
 */
export function on(
  target: Window,
  eventName: string,
  handler: AnyFun,
  opitons = false
) {
  target.addEventListener(eventName, handler, opitons)
}

/**
 * 重写对象上面的某个属性
 * @param source 需要被重写的对象
 * @param name 需要被重写对象的key
 * @param replacement 以原有的函数作为参数，执行并重写原有函数
 * @param isForced 是否强制重写（可能原先没有该属性）
 * @returns void
 */
export function replaceAop(
  source: { [key: string]: any },
  name: string,
  replacement: AnyFun,
  isForced = false
) {
  if (source === undefined) return
  if (name in source || isForced) {
    const original = source[name]
    const wrapped = replacement(original)
    if (typeof wrapped === 'function') {
      source[name] = wrapped
    }
  }
}

/**
 * 格式化对象
 * 小数位数保留最多两位
 * 空值赋 undefined
 */
export function normalizeObj(e: AnyObj) {
  Object.keys(e).forEach(p => {
    const v = e[p]
    if (typeof v === 'number')
      e[p] = v === 0 ? undefined : parseFloat(v.toFixed(2))
  })
  return e
}

/**
 * 获取当前页面的url
 * @returns 当前页面的url
 */
export function getLocationHref(): string {
  if (typeof document === 'undefined' || document.location == null) return ''
  return document.location.href
}

/**
 * 获取当前的时间戳
 * @returns 当前的时间戳
 */
export function getTimestamp(): number {
  return Date.now()
}

/**
 * 函数节流
 * @param fn 需要节流的函数
 * @param delay 节流的时间间隔
 * @param runFirst 是否需要第一个函数立即执行 (每次)
 * @returns 返回一个包含节流功能的函数
 */
export function throttle(func: AnyFun, wait: number, runFirst = false) {
  let timer: NodeJS.Timeout | null = null
  let lastArgs: any[]

  return function (this: any, ...args: any[]) {
    lastArgs = args

    if (timer === null) {
      if (runFirst) {
        func.apply(this, lastArgs)
      }
      timer = setTimeout(() => {
        timer = null
        func.apply(this, lastArgs)
      }, wait)
    }
  }
}

/**
 * 将数组内对象以对象内的属性分类
 * @param arr 数组源 - 格式为 [{}, {}...]
 * @param pop 是否需要在遍历后清除源数组内的数据
 * @param keys 需要匹配的属性名
 */
export function groupArray<T, K extends keyof T>(
  arr: T[],
  ...keys: K[]
): T[][] {
  const groups = new Map<string, T[]>()
  for (const obj of arr) {
    const key = keys
      .filter(k => obj[k])
      .map(k => obj[k])
      .join(':')
    if (!groups.has(key)) {
      groups.set(key, [])
    }
    groups.get(key)!.push(obj)
  }
  return Array.from(groups.values())
}

/**
 * 深度合并对象
 */
export function deepAssign<T>(target: AnyObj, ...sources: AnyObj[]) {
  sources.forEach(source => {
    for (const key in source) {
      if (source[key] !== null && isRegExp(source[key])) {
        target[key] = source[key]
      } else if (source[key] !== null && typeof source[key] === 'object') {
        // 如果当前 key 对应的值是一个对象或数组，则进行递归
        target[key] = deepAssign(
          target[key] || (isArray(source[key]) ? [] : {}),
          source[key]
        )
      } else {
        // 如果当前 key 对应的值是基本类型数据，则直接赋值
        target[key] = source[key]
      }
    }
  })
  return target as T
}

/**
 * 验证选项的类型
 */
export function validateOption(
  target: any,
  targetName: string,
  expectType: string
): boolean | void {
  if (!target || typeofAny(target) === expectType) return true
  logError(
    `TypeError: web-tracing: ${targetName}期望传入${expectType}类型，目前是${typeofAny(
      target
    )}类型`
  )
  return false
}

/**
 * 验证选项的类型 - 针对数组内容类型的验证
 */
export function validateOptionArray(
  target: any[] | undefined,
  targetName: string,
  expectTypes: string[]
): boolean | void {
  if (!target) return true
  let pass = true

  target.forEach(item => {
    if (!expectTypes.includes(typeofAny(item))) {
      logError(
        `TypeError: ${targetName}数组内的值期望传入${expectTypes.join(
          '|'
        )}类型，目前值${item}是${typeofAny(item)}类型`
      )
      pass = false
    }
  })

  return pass
}

export function typeofAny(target: any): string {
  return Object.prototype.toString.call(target).slice(8, -1).toLowerCase()
}

export function isValidKey(
  key: string | number | symbol,
  object: object
): key is keyof typeof object {
  return key in object
}

export function randomBoolean(randow: number) {
  return Math.random() <= randow
}

/**
 * 补全字符
 * @param {*} num 初始值
 * @param {*} len 需要补全的位数
 * @param {*} placeholder 补全的值
 * @returns 补全后的值
 */
function pad(num: number, len: number, placeholder = '0') {
  const str = String(num)
  if (str.length < len) {
    let result = str
    for (let i = 0; i < len - str.length; i += 1) {
      result = placeholder + result
    }
    return result
  }
  return str
}

/**
 * 获取一个随机字符串(全局唯一标识符)
 */
function uuid() {
  const date = new Date()

  // yyyy-MM-dd的16进制表示,7位数字
  const hexDate = parseInt(
    `${date.getFullYear()}${pad(date.getMonth() + 1, 2)}${pad(
      date.getDate(),
      2
    )}`,
    10
  ).toString(16)

  // hh-mm-ss-ms的16进制表示，最大也是7位
  const hexTime = parseInt(
    `${pad(date.getHours(), 2)}${pad(date.getMinutes(), 2)}${pad(
      date.getSeconds(),
      2
    )}${pad(date.getMilliseconds(), 3)}`,
    10
  ).toString(16)

  // 第8位数字表示后面的time字符串的长度
  let guid = hexDate + hexTime.length + hexTime

  // 补充随机数，补足32位的16进制数
  while (guid.length < 32) {
    guid += Math.floor(Math.random() * 16).toString(16)
  }

  // 分为三段，前两段包含时间戳信息
  return `${guid.slice(0, 8)}-${guid.slice(8, 16)}-${guid.slice(16)}`
}

/**
 * 获取cookie中目标name的值
 * @param name cookie名
 * @returns
 */
function getCookieByName(name: string) {
  const result = document.cookie.match(new RegExp(`${name}=([^;]+)(;|$)`))
  return result ? result[1] : undefined
}

/**
 * 发送数据方式 - navigator.sendBeacon
 */
export function sendByBeacon(url: string, data: any) {
  return navigator.sendBeacon(url, JSON.stringify(data))
}

export const sendReaconImageList: any[] = []

/**
 * 发送数据方式 - image
 */
export function sendByImage(url: string, data: any): Promise<any> {
  return new Promise(resolve => {
    const beacon = new Image()
    beacon.src = `${url}?v=${encodeURIComponent(JSON.stringify(data))}`
    sendReaconImageList.push(beacon)
    beacon.onload = e => {
      console.log('发送成功')
      resolve({ success: true, msg: e })
    }
    beacon.onerror = function (e) {
      console.log('发送失败')
      resolve({ success: false, msg: e })
      // console.log('e', e)
    }
  })
}

const arrayMap =
  Array.prototype.map ||
  function polyfillMap(this: any, fn) {
    const result = []
    for (let i = 0; i < this.length; i += 1) {
      result.push(fn(this[i], i, this))
    }
    return result
  }

/**
 * map方法
 * @param arr 源数组
 * @param fn 条件函数
 * @returns
 */
function map(arr: any[], fn: AnyFun) {
  return arrayMap.call(arr, fn)
}

const arrayFilter =
  Array.prototype.filter ||
  function filterPolyfill(this: any, fn: AnyFun) {
    const result = []
    for (let i = 0; i < this.length; i += 1) {
      if (fn(this[i], i, this)) {
        result.push(this[i])
      }
    }
    return result
  }

/**
 * filter方法
 * @param arr 源数组
 * @param fn 条件函数
 * @returns
 */
function filter(arr: [], fn: AnyFun) {
  return arrayFilter.call(arr, fn)
}

const arrayFind =
  Array.prototype.find ||
  function findPolyfill(this: any, fn: AnyFun) {
    for (let i = 0; i < this.length; i += 1) {
      if (fn(this[i], i, this)) {
        return this[i]
      }
    }
    return undefined
  }

/**
 * find方法
 * @param arr 源数组
 * @param fn 条件函数
 * @returns
 */
function find(arr: [], fn: AnyFun) {
  return arrayFind.call(arr, fn)
}

/**
 * 去除头部或者尾部的空格
 * @param str 需要去除的字符串
 * @returns 去除后的字符串
 */
function trim(str = '') {
  return str.replace(/(^\s+)|(\s+$)/, '')
}

/**
 * 可以理解为异步执行
 * requestIdleCallback 是浏览器空闲时会自动执行内部函数
 * requestAnimationFrame 是浏览器必须执行的
 * 关于 requestIdleCallback 和  requestAnimationFrame 可以参考 https://www.cnblogs.com/cangqinglang/p/13877078.html
 */
const nextTime =
  window.requestIdleCallback ||
  window.requestAnimationFrame ||
  (callback => setTimeout(callback, 17))

/**
 * 取消异步执行
 */
const cancelNextTime =
  window.cancelIdleCallback || window.cancelAnimationFrame || clearTimeout

export {
  uuid,
  getCookieByName,
  map,
  filter,
  find,
  trim,
  nextTime,
  cancelNextTime
}
