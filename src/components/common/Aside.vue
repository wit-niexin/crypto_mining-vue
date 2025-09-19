<template>
  <div v-show="showMenu" class="aside-root">
    <el-menu
        :default-active="menuName"
        class="el-menu-vertical"
        background-color="#1e263b"
        text-color="#fff"
        :collapse="isCollapse"
    >
      <div class="logo" @click="changeCollapse">
        <img src="@/assets/logo.png" alt="logo" style="width: 30px; height: 30px; vertical-align: middle;"/>
        <span v-if="!isCollapse">HashBox</span>
      </div>
      <div v-if="userType === 'ADMIN'">
        <el-menu-item index="index" @click="router.push('/index')">
          <el-icon>
            <home-filled/>
          </el-icon>
          <template #title><span>首页</span></template>
        </el-menu-item>
        <el-menu-item index="notice" @click="router.push('/notice')">
          <el-icon>
            <BellFilled/>
          </el-icon>
          <template #title><span>公告管理</span></template>
        </el-menu-item>
        <el-menu-item index="user" @click="router.push('/user')">
          <el-icon>
            <User/>
          </el-icon>
          <template #title><span>用户管理</span></template>
        </el-menu-item>
        <el-menu-item index="miningMachine" @click="router.push('/miningMachine')">
          <el-icon>
            <DataLine/>
          </el-icon>
          <template #title><span>矿机管理</span></template>
        </el-menu-item>
        <el-menu-item index="userRevenue" @click="router.push('/userRevenue')">
          <el-icon>
            <CreditCard/>
          </el-icon>
          <template #title><span>收益管理</span></template>
        </el-menu-item>
        <el-menu-item index="reflect" @click="router.push('/reflect')">
          <el-icon>
            <CreditCard/>
          </el-icon>
          <template #title><span>提现管理</span></template>
        </el-menu-item>

        <el-menu-item index="configuration" @click="router.push('/configuration')">
          <el-icon>
            <Tools/>
          </el-icon>
          <template #title><span>网站配置</span></template>
        </el-menu-item>

        <el-menu-item index="administrators" @click="router.push('/administrators')">
          <el-icon>
            <Avatar/>
          </el-icon>
          <template #title><span>权限管理</span></template>
        </el-menu-item>

      </div>
      <div v-else>
        <el-menu-item index="indexUser" @click="router.push('/indexUser')">
          <el-icon>
            <home-filled/>
          </el-icon>
          <template #title><span>主页</span></template>
        </el-menu-item>
        <el-menu-item index="myMiningmachine" @click="router.push('/myMiningmachine')">
          <el-icon>
            <DataLine/>
          </el-icon>
          <template #title><span>我的矿机</span></template>
        </el-menu-item>
        <el-menu-item index="wallet" @click="router.push('/wallet')">
          <el-icon>
            <CreditCard/>
          </el-icon>
          <template #title><span>我的钱包</span></template>
        </el-menu-item>
        <el-menu-item index="setAccount" @click="router.push('/setAccount')">
          <el-icon>
            <Avatar/>
          </el-icon>
          <template #title><span>账户设置</span></template>
        </el-menu-item>
      </div>
    </el-menu>
  </div>
</template>

<script setup>
import {onMounted, ref, watchEffect} from "vue";
import {useRouter} from "vue-router";
import {
  HomeFilled,
  TrendCharts,
  ElemeFilled,
  User,
  BellFilled,
  DataLine,
  CreditCard,
  Tools,
  Avatar
} from "@element-plus/icons-vue"
import useStore from "@/store";
import {storeToRefs} from "pinia";

const router = useRouter()
const {common, user} = useStore()
// 导航栏默认不折叠
const {isCollapse} = storeToRefs(common);
// 导航栏折叠事件
const changeCollapse = () => {
  common.changeCollapse(!isCollapse.value)
};
// 当前激活的菜单名称
const menuName = ref('')
const userType = ref('')
const showMenu = ref(true)
watchEffect(() => {
  showMenu.value = common.showMenu
  if (common.showMenu) {
    //changeCollapse()
  }
})
onMounted(() => {
  menuName.value = router.currentRoute.value.name
  if (user.user) {
    let type = user.user.roles.find(v => v.name === 'ADMIN')
    if (type) {
      userType.value = 'ADMIN'
    }
  }
})
</script>

<style scoped lang="scss">
.aside-root {
  height: 100%; // 占满整个视口高度
  min-height: 100vh; // 最小高度也是整个视口高度
  background: #1e263b;
}

.logo {
  padding-left: 15px;
  height: 60px;
  color: white;
  background-color: #171d23;
  display: flex;
  align-items: center;
  cursor: pointer;

  i {
    font-size: 35px;
  }

  span {
    margin-left: 10px;
  }
}

.el-menu {
  height: 100%; // 占满整个视口高度
  min-height: 100vh;
  background: #1e263b;
}

.el-icon {
  font-size: 20px;
  margin-right: 5px;
}

.el-menu-vertical:not(.el-menu--collapse) {
  width: 220px;
  min-height: 400px;
}
</style>
