# education-node

## 项目代码规范约定
```
1. 缩进为两个空格
2. js字符串使用单引号
3. 代码末尾不加分号
4. 如果组件会复用，尽量抽取出来
```

## 问题
```
如果新增第三方库的话，请再Jenkins文件中修改如下命令
sh 'npm ci && npm run build'

点击el-image组件 右侧滚动条失效

解决方法：
1.在node_modules 》 element-ui 》 lib 》 element-ui.common.js 》clickHandler函数第一行加入下面代码
  if (!this.preview) return;

2.或者不使用el-image标签[暂时使用此方法]
```

```
el-card 绑定点击事件失效

解决方法：
1. 添加navtive解决
  @click.native=""
```

## Docker 构建项目
```
安装依赖并打包构建到dist文件夹
npm ci
npm run build

项目根目录下执行,获得docker镜像
docker build . -t tp-web

启动容器，【如果已经启动过，请先停止并删除旧的容器】
docker run --name="tp-web" -d -p 80:80 tp-web

注意问题
后端api转发地址配置在nginx.conf里面
vue.config.js里面的devSever只是开发时使用
```

## Project setup
```
这里不使用npm install是因为会修改pack-lock.json文件，理论上包的版本尽量是确定的。
因为不确定引入的第三方包是否会向下支持。

下面这个命令是根据pack-lock文件安装依赖
npm ci
```
