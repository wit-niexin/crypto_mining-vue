<template>
  <div class="my-mining-machine">
    <h3 style="margin: 0; line-height: 32px;">我的矿机</h3>
    <el-table :data="tableData" border style="width: 100%;margin-top: 10px;" height="65vh">
      <el-table-column prop="miningRigName" label="矿机名称"/>
      <el-table-column prop="launchDate" label="上线日期时间"/>
      <el-table-column prop="status" label="状态" width="80">
        <template #default="{ row }">
          <el-tag :type="statusType(row.status)">{{
              statusText(row.status)
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="daysRunning" label="运行天数" width="100"/>
      <el-table-column prop="dailyAverageReturn" label="每日平均收益（U）"/>
      <el-table-column prop="cumulativeReturn" label="累计收益（U）"/>
      <el-table-column prop="annualizedYield" label="年化收益率(%)">
        <template #default="{ row }">
          {{ (row.annualizedYield * 100).toFixed(2) }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        background
        layout="prev, pager, next, jumper"
        :total="total"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handlePageChange"
        style="margin-top: 20px;display: flex;justify-content: end;"
    />
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {getBenefitAllPage} from "@/api/reflect";
import useStore from "@/store";
import {storeToRefs} from "pinia";
const {user} = useStore();
const {username} = storeToRefs(user);

const tableData = ref([])
const total = ref(1);
const pageSize = ref(10);
const currentPage = ref(1);

function fetchData() {
  getBenefitAllPage({
    current: currentPage.value,
    size: pageSize.value,
    name: username.value
  }).then(res => {
    tableData.value = res.data.records
    total.value = res.data.total
  })
}

function handlePageChange(page) {
  currentPage.value = page
  fetchData();
}

function statusText(status) {
  switch (status) {
    case 0:
      return "在线";
    case 1:
      return "离线";
    case 2:
      return "失效";
    default:
      return status;
  }
}

function statusType(status) {
  if (status === 0) return 'success'
  if (status === 1) return 'warning'
  if (status === 2) return 'danger'
    return 'info'
}

fetchData()
</script>

<style lang="scss" scoped>
.my-mining-machine {
  border-radius: 20px;
  padding: 20px 20px 10px 20px;
  background-color: #ffffff;
}
</style>