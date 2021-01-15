<h2 align="center">
 DESIGN PORTAL
</h2>

----

## 简介
类似凡科微传单、易企秀、MAKA的可视化H5编辑器(基于Vue2，使用VueCli3.0搭建)

## 预览地址
[www.designportal.cn](http://www.designportal.cn)

## 配套设施
- [服务端](https://github.com/DESIGN-PORTAL/DESIGNPORTAL-BE)
- [预览页](https://github.com/DESIGN-PORTAL/DESIGNPORTAL-VIEWER)

## 开发者文档
- [编辑器迁移指南](./guides/编辑器迁移指南.md)
- [编辑器组件开发指南](./guides/编辑器组件开发指南.md)

## TODO
  + [ ] 组件组合功能
  + [ ] 动画功能
  + [ ] 图片裁剪

----
## 目录结构
```
.
├── src
│   ├── api
│   │   └── axios.js                      // axios请求封装
│   ├── assets
│   │   ├── css                           // css代码
│   │   ├── iconfont                      // iconfont 字体图标
│   ├── components
│   │   ├── advanceForm.vue               // 高阶表单组件
│   │   ├── advanceTable.vue              // 高阶表格组件
│   │   ├── base                          // 基础组件
│   │   ├── editor                        // 编辑器组件
│   │   ├── global                        // 挂载到Vue原型上的组件/插件
│   │   ├── table                         // 表格组件
│   ├── pages
│   │   ├── Editor.vue                    // 编辑器路由页
│   │   ├── Manage                        // 管理页面
│   ├── services                          // 接口
```


