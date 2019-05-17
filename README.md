### 安装

```shell
$ npm i -g qwer-cli
```

### 使用

```shell
$ qwer
```
根据提示输入接口名，选择接口安全级别

接口名规则：'group.apiname'

工具会在controller目录下新建`group`文件夹（如果`group`文件夹已存在则不会新建文件夹），然后再`group`文件夹下新建`apiname.js`文件，并写入初始化模板，同时会在`static`目录下的`apiInfo.json`文件中将新增接口的安全级别加入