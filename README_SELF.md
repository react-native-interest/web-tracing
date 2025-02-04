# web-tracing-next

## 本地调试
先 `pnpm install`
```
第一步：初始化所有测试项目仓库
nr test:install

第二步：打包并监听各个sdk
nr watch

第三步：运行js测试项目
nr test:js

nr test:vue2 (也可以运行vue2测试项目)
nr test:vue3 (也可以运行vue3测试项目)
```

## 文档调试
```
nr docs
```

## 粗略版本
### 一期（sdk已有能力）
+ 简单支持 vue2 + vue3
+ 自动采集 + 暴露api给用户手动采集上报
+ 采集功能：【用户事件采集、页面跳转采集、请求采集、错误采集、资源加载采集】
+ 采集上传方法：只提供 sendBeacon(内部自动降级为image)

### 二期已完成功能
+ 整体代码结构更改
+ 文档系统与sdk核心代码融合 (vuepress -> vitepress) 但还未编写文档
+ 所有模块已ts化，下一步添加新功能
+ 解决目前 issues
+ 支持暴露更多变量（例如最大缓存数、延迟上传时间）（dom埋点名称 先不计划自定义，个人认为没多少业务需要）
+ sdk内部的img发送请求不会记录
+ sdk内部的console.error不会记录
+ 支持hook以及自定义hook -【1.放入消息队列的钩子 2.发送时的钩子 3.发送之后的钩子】(1,2返回false会取消放入以及取消发送) (这些钩子目前没有做成动态的，只支持在初始化时挂上去，等做了 exportMethods 后再做)
+ ignoreErrors
+ ignoreErrors 入参格式进行校验，只能是 (string|number|reg)[]
+ ignoreRequest
+ ignoreRequest 入参格式进行校验，只能是 (string|number|reg)[]
+ 支持更多上传方式(此功能放入 beforeSendData 钩子，当返回false则sdk内部不发送请求)
+ 支持抽样发送(tracesSampleRate全局抽样，具体到模块的抽样可以用beforePushEventList来阻止)
+ 支持延迟加载sdk(delayInit)
+ 防止重复init sdk
+ 设置断网情况下不采集任何元素(个人认为断网了不需要再去采集用户的操作了，除非是特别需要，所以加入此限制)
+ 错误过多自动转区间事件，也就是去重(完成，后续再测一下关闭网页是否会及时发送就ok，因为会比不自动转的多出20s延长)

### 二期未完成功能
+ 支持暴露更多sdk内部方法（例如使用者想要拿到此时的硬件数据,用户更改入参的方法,一些钩子也要加到这里，例如上传之前的的钩子，然后组成一个数组，为什么这里需要是因为用户想要在每个页面细致化控制是否上传，例如只想在用户打开某个页面才开始采集,不是这个页面则结束采集）
+ 关于用户信息的重构 - 【1.分为未登录与已登录的场景，登录后进行绑定，机器与用户id进行多对多绑定(更多方案还在确定中) 2.支持动态修改用户信息】
+ 支持区域曝光度采集(放在后面，因为要暴露一下方法来动态采集)
+ 支持数据临时存储本地的形式减少服务端压力(会设定存储的阈值大小，最大5M，先不支持跨域存储，否则内容太大上传慢或者不兼容导致此功能不稳定) - 这个先等sdk内部方法后面在做，因为这里需要暴露方法来供用户手动发送
+ 在初始化的时候报错无法监听，针对事件个数要有个好的测试方法
+ ----------优先级分割线-------------
+ sourcemap 错误跟踪
+ 白屏检测
+ 探索：一些关键性的api能让使用者去替代更改、比如监听网络状态的内部实现支持使用者去重写
+ 探索：插件化（核心功能+其他插件的形式）
+ 探索：错误录屏
+ 为 vue3 提供一系列个性化hooks
+ 更好的兼容 vue2、vue3（react以及小程序优先级靠后一些）(vue内的错误到时候要去重)
+ 支持错误信息去重(目前是做好了自动去重，注意原生和vue是否会重复，sdk这个范围要做好去重，和vue这些的后面再看看是否兼容)
+ 首次首屏数据更精确化 - 这个放在最后研究插件化的时候再搞上去
+ 对入参和出参的ts再次统一化
+ demo官网示例更简单化且提供在线编写能力【例子：1.例如只想在用户打开某个页面才开始采集,不是这个页面则结束采集
+ ----------暂不考虑分割线-------------
+ 支持对特定dom监控事件（例如监控页面button按钮的点击事件，这在大批量埋点场景中比较需要，另提供一些属性来标识特定按钮无需采集）(这个先不做，可以自己过滤)
+ 支持加密传输（加密方式待确定）（这个给用户来做，毕竟钩子已经暴露了）
+ 支持断网续联后发送（这个涉及到数据本地存储，得考虑容量大小，且断网状态下的用户操作是无意义的，暂不考虑做）
+ 支持静默,思考除了错误的场景下什么情况需要静默(如果是想在规定时间内上传，完全可以通过钩子来实现)
+ sendTime err事件 第一个挂载不上(没有复现了，最后再看看是否正常)
+ 支持区间打点，区间采集(记录开始和结束，筛选统计开始和结束之间的事件行为,统计到一个分组中) - 个人认为可以通过钩子来解决，所以暂不处理

## tips
1. 此场景怎么做：用户一直点一个带了埋点的按钮，怎么去重呢，简单的节流去重？
2. 用户行为应该给个id，要不然后台不好快速找特定事件，点击按钮可以自己给id，但是切换事件或者曝光就拿不到id了，得找个办法去定义
3. 全部事件先存本地，等到了一个期限再上传
4. 给用户中途更改参数的函数
5. 考虑一些枚举也给用户可以改


## 技术层面重构点
1. options参数集中管理
2. 事件注册以及事件改写集中管理，其他模块需要的则会去模块存放/获取
3. 后面可以用 proxy 来自动化一些东西吗
4. 受不了了，后面研究下用@的方式引入
5. 在业务中碰到的跳转客服功能，看看能不能在这里用utils包实现
6. error 检测那边，应该再加一个属性标识错误类型，例如 console.error 还是 Error 或者 reject
7. ua-parser-js 这个库调研一下
8. https://juejin.cn/post/7220309530910851130?#heading-5 曝光
9. 针对性能采集需要多调研一下(vue 内部也有，可参考https://juejin.cn/post/7012641316144152589)
10. 多个事件注册会不会紊乱，比如触发 onload事件会将本应该执行的方法也执行了
11. 数据结构不够直观，再优化下
12. hash 和 history 的跳转重复点击都会触发的，是否给用户一个选择来取消这个
13. 可否用 iframe的方式让用户快速体验(https://making.close.com/posts/rendering-untrusted-html-email-safely)
14. 发送的数据类型后面再用ts定义把，可能后面会有改动
15. 引入测试单元

目前无法捕捉一下pv
```
1. window.open 外部网站的url
2. a 标签 href 外部网站url

第一种可以这样，但不通用，先暂定不这样搞，后面用户自己可以封装然后调用sdk就行
const open = window.open
window.open = function(url) {
  console.log('url', url);
  open(url)
}

第二种目前没办法拦截到
```

## 关于 sendBeacon 的问题

`sendBeacon` 方法是浏览器提供的一种用于将数据异步传输到服务器的方法。它的特点是可以在页面关闭时仍然发送请求，是一种比较可靠的数据传输方式。

关于 `sendBeacon` 存在最大发送上限的问题，实际上它是存在的。虽然没有明确说明，但是根据浏览器实现和开发者的经验，使用 `sendBeacon` 发送的数据仍然受到了各种限制。

首先是数据大小的限制。不同浏览器对于 `sendBeacon` 方法发送数据大小的限制不同，一般来说在 2KB-64KB 左右。超过这个范围的数据发送可能会失败或被截断。

其次是发送频率的限制。由于 `sendBeacon` 方法是一种较为稳定的数据传输方式，一些浏览器可能会对其发送频率进行限制，例如 Chrome 在一段时间内只允许发送一次 `sendBeacon` 请求。

最后，关于 `sendBeacon` 方法的返回值，它表示该浏览器是否成功地将数据交给网络传输层处理。由于 `sendBeacon` 通常用于发送数据，不需要获取响应，因此它的返回值通常是布尔型的。如果返回 `true`，表示数据已经被传输成功，否则表示数据传输失败。

需要注意的是，返回值的成功与否只是表明是否成功交给了浏览器的网络层处理，真正的成功与否还需要根据服务器端的响应情况来判断。


## DNS传递信息
这个软件可以将用户信息，通过网页的 DNS 请求传回服务器。注意，不是 HTTP 请求，而是使用查询域名的 DNS 请求夹带额外信息。这种监视用户的方法，很难发现，也很难阻止。
https://github.com/veggiedefender/browsertunnel

后面可以考虑是否引入

## localstorage跨域存储
https://blog.csdn.net/sflf36995800/article/details/53290457

后面可以考虑是否引入(大概率不考虑)

## 关于 sourcemap
https://mp.weixin.qq.com/s/n1_nq7_DagAmdznt5aTvBg