# desc ----  @fly-rains/cli
微前端一键启动命令

## 全局安装
```
npm install -g @fly-rains/cli
```

### 子应用自定义选择启动 
```
micro start [groupId]
```

启动的主应用以及多选的子应用启动目录会以 <当前目录地址>/packages/<应用名称> 启动
微前端项目结构最好以如下形式安排：
```
---- micros-project
------- packages
--------- main-front
--------- micro-1-front
--------- micro-2-front
```

在micros-project 目录执行 micro start [groupId]

</br>

### 若不按照上面的项目结构安排，需要自定义项目的运行地址
```
config set dir [main|micro-1|micro-2|...] <dir>
```

#### 或者设置全局的根地址：
```
config set root <dir>
```

// 例如 上面的项目文件结构，可设置：
config set root D:/.../micros-project/packages

这样任何目录启动 micro start 选择子应用都能顺利启动


### 当前目录的子应用以及主应用启动
--- 注意：需要先按照上面config命令指定主应用地址，然后
比如：在micri-1-front目录执行如下：

```
micro serve [groupId]
```

