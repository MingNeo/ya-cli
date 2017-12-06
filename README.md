# ya-cli
Simple CLI for scaffolding Ya projects

## 安装 
环境: [Node.js](https://nodejs.org/en/download/) , npm  3.0+、 [Git](https://git-scm.com/).

``` bash
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

    -o, --offline  使用本地模板
    --template [value] 选择使用的模板
    -i, --install  下载模板后自动安装依赖
    -h, --help     output usage information

  Examples:

    创建项目 ya init project1

    创建时使用本地模板|自动安装依赖：
    ya init project1 -i -o 
```

## 模板
自定义模板无需发布到npm，只需上传到github并通过template参数使用即可
````
  ya init projiect1 --template q13/vue-spa-template
````
