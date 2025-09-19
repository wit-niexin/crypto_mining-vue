<template>
  <el-dialog v-model="withdrawVisible" title="申请提款" width="350px" :close-on-click-modal="false">
    <el-form :model="withdrawForm" :rules="withdrawRules" ref="withdrawRef" label-width="80px">
      <el-form-item label="地址" prop="address">
        <el-input v-model="withdrawForm.address" placeholder="请输入钱包地址"/>
      </el-form-item>
      <el-form-item label="网络" prop="network">
        <el-select v-model="withdrawForm.network" placeholder="请选择网络">
          <el-option label="TRC20" value="TRC20"/>
          <el-option label="ERC20" value="ERC20"/>
        </el-select>
      </el-form-item>
      <el-form-item label="数额" prop="amount">
        <el-input v-model="withdrawForm.amount" placeholder="请输入数额" type="number" min="0"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="withdrawVisible = false">取消</el-button>
      <el-button type="primary" @click="submitWithdraw">申请提款</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="detailVisible" title="交易详情" width="450px" :close-on-click-modal="false">
    <div style="margin-bottom: 8px; ">
      <strong style="width: 120px;display: inline-block;text-align: right;">金额：</strong>
      {{ detail.money }}
      <strong style="width: 120px;display: inline-block;">U</strong>
    </div>
    <div style="margin-bottom: 8px; ">
      <strong style="width: 120px;display: inline-block;text-align: right;">手续费：</strong>
      {{ detail.handlingFee }}
      <strong style="width: 120px;display: inline-block;">U</strong>
    </div>
    <div style="margin-bottom: 8px;">
      <strong style="width: 120px;display: inline-block;text-align: right;">转出地址：</strong>
      {{ detail.address }}
    </div>
    <div style="margin-bottom: 8px;">
      <strong style="width: 120px;display: inline-block;text-align: right;">网络：</strong>
      {{ detail.network }}
    </div>
    <div style="margin-bottom: 8px;">
      <strong style="width: 120px;display: inline-block;text-align: right;">UID：</strong>
      {{ detail.walletId }}
    </div>
    <div style="margin-bottom: 8px;">
      <strong style="width: 120px;display: inline-block;text-align: right;">申请时间：</strong>
      {{ detail.applicationTime }}
    </div>
    <div style="margin-bottom: 8px;">
      <strong style="width: 120px;display: inline-block;text-align: right;">审批人：</strong>
      {{ detail.approver }}
    </div>
  </el-dialog>

  <div class="split-wrapper">
    <!-- 左栏：钱包流水 -->
    <div class="left-panel">
      <h3 style="margin: 0; line-height: 32px;">钱包流水</h3>
      <div class="filter-row">
        <el-date-picker
            ref="datePickerRef"
            v-model="dateRange"
            type="daterange"
            range-separator="~"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="YYYY-MM-DD"
            @change="handleFilterTime"
        />
        <el-select v-model="typeFilter" placeholder="全部" style="width: 120px;" @change="handleFilter">
          <el-option label="全部" value=""/>
          <el-option label="收益" value="0"/>
          <el-option label="提现" value="1"/>
          <el-option label="手续费" value="2"/>
        </el-select>
      </div>
      <el-table :data="tableDataL" border style="width: 100%;margin-top: 10px;" height="60vh">
        <el-table-column prop="time" label="时间" width="180"/>
        <el-table-column prop="money" label="金额（U）"/>
        <el-table-column prop="status" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)">{{
                statusText(row.status)
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="90">
          <template #default="scope">
            <el-button type="text" @click="showDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          background
          layout="prev, pager, next"
          :total="totalL"
          :page-size="pageSizeL"
          :current-page="currentPageL"
          @current-change="handlePageChangeL"
          style="margin-top: 16px; display: flex; justify-content: end;"
      />
    </div>
    <!-- 右栏：提现记录 -->
    <div class="right-panel">
      <h3 style="margin: 0; line-height: 32px;">提现记录</h3>
      <el-button type="primary" style="margin-top: 16px;" @click="withdrawVisible = true">提 款</el-button>
      <el-table :data="tableDataR" border style="width: 100%; margin-top: 10px" height="calc(65vh - 40px)">
        <el-table-column prop="approvalTime" label="提现时间" width="180"/>
        <el-table-column prop="money" label="金额（U）" width="100"/>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="withdrawStatusType(row.status)">
              {{ withdrawStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="text" @click="showWithdrawDetail(row)">
              详情
            </el-button>
            <el-button
                v-if="row.status === 0"
                type="text"
                style="color: #f56c6c"
                @click="deleteWithdraw(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          background
          layout="prev, pager, next"
          :total="totalR"
          :page-size="pageSizeR"
          :current-page="currentPageR"
          @current-change="handlePageChangeR"
          style="margin-top: 12px; display: flex; justify-content: end"
      />
    </div>
  </div>
</template>

<script setup>
import {ref, reactive} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import {getUserWallet} from "@/api/wallet";
import {addWithdrawal, delWithdrawal, getWithdrawalAllPage} from "@/api/withdrawal";
import useStore from "@/store";
import {storeToRefs} from "pinia";

const {user} = useStore();
const {username} = storeToRefs(user);

const datePickerRef = ref()
const dateRange = ref([])
const tableDataL = ref([])
const totalL = ref(1)
const pageSizeL = ref(10)
const currentPageL = ref(1)
const typeFilter = ref('')
const status = ref()

const tableDataR = ref([])
const totalR = ref(1);
const pageSizeR = ref(10);
const currentPageR = ref(1);

function fetchDataLeft() {
  getUserWallet({
    current: currentPageL.value,
    size: pageSizeL.value,
    name: username.value,
    status: typeFilter.value
  }).then((res) => {
    tableDataL.value = res.data.records
    totalL.value = res.data.total
  });
}

function fetchDataRight() {
  getWithdrawalAllPage({
    current: currentPageR.value,
    size: pageSizeR.value,
    name: username.value
  }).then(res => {
    tableDataR.value = res.data.records
    totalR.value = res.data.total
  })
}

function handlePageChangeL(page) {
  currentPageL.value = page
  fetchDataLeft()
}

function handlePageChangeR(page) {
  currentPageR.value = page
  fetchDataRight()
}

function handleFilterTime(val) {
    console.log('最终值：', val)
}

function handleFilter() {
  currentPageL.value = 1
  fetchDataLeft()
}

const detailVisible = ref(false)
const detail = ref({})

function showDetail(row) {
  detail.value = {...row}
  detailVisible.value = true
}

function showWithdrawDetail(row) {
  detail.value = {...row}
  detailVisible.value = true
}

function statusText(status) {
  switch (status) {
    case 0:
      return "收益";
    case 1:
      return "提现";
    case 2:
      return "手续费";
    default:
      return status;
  }
}

function statusType(status) {
  switch (status) {
    case 0:
      return "success";
    case 1:
      return "warning";
    case 2:
      return "danger";
    default:
      return "";
  }
}

function withdrawStatusText(status) {
  switch (status) {
    case 0:
      return "待审核";
    case 1:
      return "已通过";
    case 2:
      return "已拒绝";
    default:
      return status;
  }
}

function withdrawStatusType(status) {
  switch (status) {
    case 0:
      return "";
    case 1:
      return "success";
    case 2:
      return "danger";
    default:
      return "";
  }
}

const withdrawVisible = ref(false)
const withdrawForm = reactive({
  address: '',
  network: '',
  amount: ''
})
const withdrawRules = {
  address: [{required: true, message: '请输入钱包地址', trigger: 'blur'}],
  network: [{required: true, message: '请选择网络', trigger: 'change'}],
  amount: [
    {required: true, message: '请输入数额', trigger: 'blur'},
    {
      validator: (rule, value, callback) => {
        if (!value || isNaN(value) || Number(value) <= 0) {
          callback(new Error('请输入大于0的数额'))
        } else {
          callback()
        }
      }, trigger: 'blur'
    }
  ]
}
const withdrawRef = ref()

function submitWithdraw() {
  withdrawRef.value.validate(valid => {
    if (valid) {
      addWithdrawal({
        userName: username.value,
        money: withdrawForm.amount,
        handlingFee: 1,
        walletId: user.user.uid,
        address: withdrawForm.address,
        network: withdrawForm.network
      }).then((res) => {
        if (res.data === true) {
          ElMessage.success('申请提交成功')
          fetchDataRight()
        }
      });
      withdrawVisible.value = false
      Object.assign(withdrawForm, {address: '', network: '', amount: ''})
    }
  })
}

const deleteWithdraw = (row) => {
  ElMessageBox.confirm(
      '确认删除这条提款申请？',
      '提示',
      {type: 'warning'}
  ).then(async () => {
    delWithdrawal({
      id: row.id
    }).then((res) => {
      if (res.data === true) {
        ElMessage.success('删除提交成功')
        fetchDataRight()
      }
    })
  }).catch(() => {
  })
}

fetchDataLeft()
fetchDataRight()
</script>

<style scoped lang="scss">
/* 新增响应式筛选样式 */
.filter-row {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.split-wrapper {
  display: flex;
  margin-top: 0px;
  gap: 16px;
}

.left-panel,
.right-panel {
  flex: 1 1 0;
  min-width: 0;
  border-radius: 20px;
  padding: 20px 20px 10px 20px;
  background-color: #ffffff;
}

@media screen and (max-width: 768px) {
  .split-wrapper {
    flex-direction: column;
  }
  .left-panel .el-table,
  .right-panel .el-table {
    height: auto;
    max-height: 50vh; /* 可选：限制最大高度，防止过长 */
  }
}
</style>