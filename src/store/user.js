import {defineStore} from 'pinia'

const useUserStore = defineStore('user', {
  state: () => ({
    user:{},
    userid: '',
    token: '',
    username: '',
    legalname: '',
  }),
  // 修改数据
  actions: {
    // 更改用户信息
    changeUser(value) {
      this.userid =  value.user.id
      this.token = value.token
      this.username = value.user.name
      this.legalname = value.user.legalName
      this.user = value.user
    }
  },
  // 持久化存储插件其他配置
  persist: {
    key: 'useStore',
    storage: window.sessionStorage,
  }
})

export default useUserStore