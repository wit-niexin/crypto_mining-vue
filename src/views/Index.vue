<template>
  <div class="home">
    <div class="titleName">欢迎进入后台管理系统</div>
    <el-row :gutter="20" style="margin: 0;padding: 0;">
      <el-col :span="6" :xs="12">
        <div class="box">
          <div class="title">用户总数</div>
          <div class="num">{{ totalUsers }} 人</div>
        </div>
      </el-col>
      <el-col :span="6" :xs="12">
        <div class="box">
          <div class="title">矿机总数</div>
          <div class="num">{{ totalMiners }} 台</div>
        </div>
      </el-col>
      <el-col :span="6" :xs="12">
        <div class="box">
          <div class="title">今日收益</div>
          <div class="num">{{ todayEarnings }} USDT</div>
        </div>
      </el-col>
      <el-col :span="6" :xs="12">
        <div class="box">
          <div class="title">待审核提现</div>
          <div class="num">{{ pendingWithdrawals }} 笔</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted, watch, computed} from 'vue'
import {getAdminAllData} from "@/api/dashboard"

const totalUsers = ref(0)
const totalMiners = ref(0)
const todayEarnings = ref(0)
const pendingWithdrawals = ref(0)

function handleSearch() {
  getAdminAllData().then(res => {
    totalUsers.value = res.data.totalUsers
    totalMiners.value = res.data.totalMiners
    todayEarnings.value = res.data.todayEarnings
    pendingWithdrawals.value = res.data.pendingWithdrawals
  })
}

handleSearch()
</script>

<style scoped lang="scss">
.home {
  width: 100%;

  .titleName {
    font-size: 20px;
    color: #000000;
    padding: 30px 0 20px 0;
  }

  .box {
    text-align: center;
    border-radius: 8px;
    background: #ffffff;
    min-height: 120px;
    display: flex;
    justify-content: space-evenly;
    flex-direction: column;
    margin-bottom: 20px;

    .title {
      font-size: 16px;
      color: #909399;
    }

    .num {
      font-size: 24px;
      color: #303133;
      font-weight: 600;
    }
  }
}
</style>