import {defineStore} from 'pinia'

const initState = () => ({
  count: 0,
  editDialogVisible: false, // 表格编辑表单是否弹窗显示
  addDialogVisible: false, // 表格新增表单是否弹窗显示
  showDialogVisible: false, // 表格查看详情是否弹窗显示
  isCollapse: true, // 侧边栏默认折叠
  showMenu: false, // 默认不显示菜单
})

const useCommonStore = defineStore('Common', {
  state: () => initState(),

  // 计算属性
  getters: {
    // 计算数据翻倍值
    double() {
      return this.count * 2
    },
  },
  // 修改数据
  actions: {
    // 数据加一
    add() {
      this.count++
    },
    // 注销时调用
    reset() {
      // 用 $patch 批量覆盖
      this.$patch(initState())
    },
    // 切换表单编辑弹窗是否显示
    changeEditDialogVisible(value) {
      this.editDialogVisible = value
    },
    // 切换表单新增弹窗是否显示
    changeAddDialogVisible(value) {
      this.addDialogVisible = value
    },
    // 切换表格查看详情弹窗是否显示
    changeShowDialogVisible(value) {
      this.showDialogVisible = value
    },
    // 切换侧边栏折叠模式
    changeCollapse(value) {
      this.isCollapse = value
    },
    // 切换菜单显示
    changeShowMenu(value) {
      this.showMenu = value
    }
  },
  // 开启数据持久化
  persist: {
    // 修改存储中使用的键名称，默认为当前 Store的 id
    key: 'common',
    // 修改为 sessionStorage，默认为 localStorage
    storage: window.sessionStorage,
  }
})

export default useCommonStore