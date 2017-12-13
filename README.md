# ya-cli

Simple CLI for scaffolding Ya projects

## 安装

环境 : [Node.js](https://nodejs.org/en/download/) , npm 3.0+、 [Git](https://git-scm.com/).

```bash
npm install -g yz-cli
```

## 创建项目

在要创建项目的路径执行 ‘ya init’。

```bash
$ ya

  Usage: ya <command> [options]

  Options:

    -V, --version  output the version number
    -h, --help     output usage information

$ ya init

  Usage: ya-init [project-name]


  Options:

    -o, --offline  使用已经下载的本地模板
    --template [value] 选择使用的模板
    -i, --install  下载模板后自动安装依赖
    -h, --help     output usage information

$ ya update
  Usage: ya-update [project-name]

  Options:

    -h, --help          output usage information
    -o, --offline       使用本地模板
    --template [value]  选择使用的模板
    -i, --install       下载模板后自动安装依赖
```

### Examples:

创建 / 更新项目

```
$ ya init project1
```

在当前目录创建 / 更新项目

```
$ ya init
```

更新当前项目

```
$ ya update project1
```

在当前目录更新项目

```
$ ya update
```

使用本地模板 & 自动安装依赖

```
$ ya init project1 -i -o
```

## 默认模板进行开发

[默认模板](https://github.com/q13/ya-spa-vue) 使用如下

#### 开发环境

开启本地服务器开发并热替换。默认开启 eslint(standard)、flow。

```
$ cd [project]
$ npm run dev
```

#### 生产

```
$ npm run build
```

#### mock

使用[mockjs](http://mockjs.com/)规则生成 mock 数据。

```
$ npm run mock
```

开启 mock 服务后即可本地 mock 请求。配置规则参考 tools/config dev.proxyTable。可于/src/mock 文件夹按请求地址创建 js/json 文件并填写符合 mockjs 规则或普通数据。如:

```
c2s('/ya/modules/test')

对应
  \ya
  -- \modules
  ---- \test.json
```

#### flow

```
默认集成在eslint中。
也可以关闭自行使用 $ npm run flow 检测，或 $ npm run flowserver 实时监听。
使用eslint时,如遇到提示模块未发现。可手动执行stopflow关闭flow服务后重新
$ npm run dev
```

## 自定义模板

自定义模板无需发布到 npm，只需上传到 github 并通过 template 参数使用即可

```
$ ya init project1 --template q13/vue-spa-template
```
