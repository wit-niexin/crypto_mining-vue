# vue3.3 + vite4 + pinia + element-plus
后台管理项目

## 功能亮点

* 封装axios
* 封装pinia
* 封装dayjs
* 支持主题换肤、深色模式
* 封装远程模糊搜索框
* 封装表格组件，支持数据查询、新增数据、修改数据、删除数据、分页、批量操作
* 封装excel组件，支持数据批量导入与导出

## 开发与运行

### 安装依赖
```
npm install
```
### 开发模式调试
```
npm run dev
```
### 打包项目
```
npm run build
```
### 运行项目
```
docker build -t vue:v1 .
docker run --name vue -d -p 80:80 vue:v1
```