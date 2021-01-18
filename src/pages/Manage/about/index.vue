<template>
  <div class="page-about">
    <ul>
      <li>
        <h2>GitHub地址</h2>
        <ol>
          <li>
            <a href="https://github.com/DESIGN-PORTAL/DESIGNPORTAL" target="_blank">前端</a>
          </li>
          <li>
            <a href="https://github.com/DESIGN-PORTAL/DESIGNPORTAL-BE" target="_blank">服务端</a>
          </li>
          <li>
            <a href="https://github.com/DESIGN-PORTAL/DESIGNPORTAL-VIEWER" target="_blank">预览页</a>
          </li>
        </ol>
      </li>
      <li>
        <h2>声明</h2>
        <ol>
          <li>
            这并不是面向客户的产品，没有做用户系统、权限设计等，因此所有人都可以编辑与查看
          </li>
          <li>
            字体、音乐及图片全部由网络上传，若有侵权请<a href="mailto:honlink35@gmail.com">联系我删除</a>
          </li>
        </ol>
      </li>
      <li>
        <h2>适用群体</h2>
        <ol>
          <li style="color: red;">
            想做类似凡科微传单、maka、易企秀等业务的企业或个人，这份源码已经实现了基础功能，可以帮助你快速搭建起来（需要有懂得开发的人员）。
          </li>
          <li>
            想学习Vue开发、想学习Vue高级用法、想学习Vue高阶组件开发或者想指导我前端开发等等。
          </li>
        </ol>
      </li>

      <li>
        <h2>优点</h2>
        <ol>
          <li>
            不依赖任何UI框架，所有UI组件都是手写的，可以任意自定义。
          </li>
          <li>
            架构清晰，命名规范，注释明确，移植简单。
          </li>
        </ol>
      </li>

      <li>
        <h2>作者</h2>
        <ol>
          <li>
            UI：刘*瑜，张*茹
          </li>
          <li>
            架构、主开发：张*刚
          </li>
          <li>
            辅助开发：黄*峰，唐*彬
          </li>
        </ol>
      </li>
    </ul>
  </div>
</template>

<style lang="less" scoped>
.page-about {
  background-color: #ffffff;
  border-radius: 4px;
  padding: 20px;

  ol {
    padding-left: 30px;
    font-size: 16px;
    li {
      line-height: 1.5;
      list-style: decimal;
    }
  }
}
</style>