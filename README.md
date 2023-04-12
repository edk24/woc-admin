## 项目简介 😈

`woc-admin` 是基于 [naive-ui-admin](https://github.com/jekip/naive-ui-admin) 改造的个人后台项目模板

## 开发环境要求 👻

- nodejs >= 14
- pnpm

## 跑起来 😄

```bash
# 安装依赖
$ pnpm install

# 运行
$ npm run serve

# 打包
$ npm run build

# 部署到测试环境 (在 package.json 中配置服务器ip)
$ npm run deploy:stg
```

> tip: 网站配置: src/config/website.config.ts

## 集成指令 🐴

- v-copy: 复制内容
- v-debounce: 防抖
- v-throttle: 节流
- v-draggable: 拖拽
- v-permission: 权限验证
- v-longpress: 长按

> tip: 指令代码所在位置在 src/directives*

## 目录结构 📂

```bash
.
├── build
│   ├── script
│   └── vite
├── public            # 公开静态文件
├── src               # 项目源代码
│   ├── api           # 接口
│   ├── assets        # 静态资源 svg / image / font 等等
│   ├── components    # 公共组件
│   ├── config        # 网站配置
│   ├── dict          # 公共字典
│   ├── directives    # 指令
│   ├── enums         # 枚举
│   ├── hooks
│   ├── layout        # 后台布局
│   ├── plugins       # 插件
│   ├── router        # 路由
│   ├── settings      # 主题 / 接口信息配置
│   ├── store         # pinia🍍
│   ├── styles        # 公共样式
│   ├── utils         # 工具库
│   └── views         # 页面
└── types               # ts 类型
```
