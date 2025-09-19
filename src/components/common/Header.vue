<template>
  <div style="display: flex; align-items: center;">
    <el-icon :size="24" color="color" @click="showbtn" style="margin-right: 10px;">
      <Fold v-show="common.showMenu"/>
      <Expand v-show="!common.showMenu"/>
    </el-icon>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-for="item in location">{{ item }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </div>
  <!-- 右侧头像 + 下拉 -->
  <div style="display: flex; align-items: center; margin-left: auto;">
    <el-dropdown trigger="click" @command="handle">
      <!-- 触发器：头像 + 用户名 -->
      <div style="display: flex; align-items: center; cursor: pointer;">
        <el-avatar :src="user.user.avatar" :size="32" style="margin-right: 6px;"/>
        <span>{{ legalname }}</span>
      </div>

      <!-- 下拉菜单 -->
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="password">修改密码</el-dropdown-item>
          <el-dropdown-item command="logout">注销登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import {onBeforeRouteUpdate, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import useStore from "@/store";
import {storeToRefs} from "pinia";
import {ElMessage} from "element-plus";

const {common, user} = useStore();
const {legalname} = storeToRefs(user);
const router = useRouter()
const emits = defineEmits(['changePassword'])
// 当前位置
const location = ref([])
// 注销登录
const handle = (value) => {
  if (value === 'logout') {
    ElMessage.success({
      message: '注销成功，正在跳转至登录页！',
      type: 'success',
    })
    window.localStorage.clear()
    window.sessionStorage.clear()
    common.reset()
    router.replace('/login')
  } else {
    emits('changePassword')
  }
}
const showbtn = () => {
  common.changeShowMenu(!common.showMenu)
}
onMounted(() => {
  location.value = router.currentRoute.value.meta.location
  let type = user.user.roles.find(v => v.name === 'ADMIN')
  if (type) {
    common.showMenu = true
    common.isCollapse = false
  }
})
onBeforeRouteUpdate((to) => {
  console.log(to.meta)
  location.value = to.meta.location
})
</script>

<style scoped lang="scss">
div:nth-child(1) {
  flex: 1;
}
</style>
