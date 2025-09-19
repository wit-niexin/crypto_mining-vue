<template>
  <div class="withdrawal">
    <div>
      <el-row justify="space-between" align="top">
        <el-col :span="12" :xs="24"><h3 style="margin: 0px; line-height: 32px;">提现管理</h3></el-col>
        <el-col :span="12" :xs="24">
          <div style="display: flex;justify-content: end;">
            <el-input
                v-model="searchName"
                placeholder="请输入用户名"
                style="width: 300px;"
                clearable
                @clear="fetchData"
                @keyup.enter="fetchData"
            >
              <template #append>
                <el-button icon="Search" @click="fetchData"/>
              </template>
            </el-input>
          </div>
        </el-col>
      </el-row>
    </div>


    <el-table :data="tableData" border style="width: 100%;margin-top: 10px;" height="65vh"
              @selection-change="handleSelectionChange">
      <!--      <el-table-column type="selection" width="55" />-->
      <el-table-column prop="userName" label="用户名" width="120"/>
      <el-table-column prop="applicationTime" label="申请时间" width="190"/>
      <el-table-column prop="money" label="金额（U）"  width="100"/>
      <el-table-column prop="handlingFee" label="手续费（U）"  width="120"/>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="statusType(row.status)">{{
              statusText(row.status)
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="approvalTime" label="审批时间" width="190"/>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button size="small" type="success" @click="showDetail(row)">
            详情
          </el-button>
          <el-button size="small" type="primary" @click="handleAgree(row)" v-if="row.status === 0">
            批准
          </el-button>
          <el-button size="small" type="danger" @click="handleRefuse(row)" v-if="row.status === 0">
            拒绝
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="width: 100%; display: flex; justify-content: flex-end; margin-top: 10px;">
      <div>
        <el-pagination
            layout="prev, pager, next, jumper"
            :total="total"
            v-model:page-size="pageSize"
            v-model:current-page="currentPage"
            @current-change="handlePageChange"
        />
      </div>
    </div>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" title="提现详情" width="500px">
      <el-form :model="currentRow" label-width="100px">
        <el-form-item label="用户名">{{ currentRow.userName }}</el-form-item>
        <el-form-item label="申请时间">{{ currentRow.applicationTime }}</el-form-item>
        <el-form-item label="提现金额">{{ currentRow.money }}</el-form-item>
        <el-form-item label="手续费">{{ currentRow.handlingFee }}</el-form-item>
        <el-form-item label="状态">{{
            statusText(currentRow.status)
          }}
        </el-form-item>
        <el-form-item label="通过时间">{{ currentRow.approvalTime }}</el-form-item>
        <el-form-item label="钱包ID">{{ currentRow.walletId }}</el-form-item>
        <el-form-item label="转出钱包地址">{{
            currentRow.address
          }}
        </el-form-item>
        <el-form-item label="网络">{{ currentRow.network }}</el-form-item>
        <!--        <el-form-item label="备注">{{ currentRow.remark }}</el-form-item>-->
      </el-form>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 编辑弹窗 -->
    <el-dialog v-model="editVisible" title="编辑提现信息" width="500px">
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="备注">
          <el-input v-model="editForm.remark"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEdit">保存</el-button>
      </template>
    </el-dialog>

    <!-- 审核弹窗 -->
    <el-dialog
        v-model="auditVisible"
        :title="auditType === 'pass' ? '通过审核' : '拒绝审核'"
        width="400px"
    >
      <el-form :model="auditForm" label-width="100px">
        <el-form-item label="备注">
          <el-input v-model="auditForm.remark"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="auditVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAudit">{{
            auditType === "pass" ? "通过" : "拒绝"
          }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {ref, reactive} from "vue";
import {getWithdrawalAllPage, updateWithdrawal} from "@/api/withdrawal";
import {ElMessage, ElMessageBox} from "element-plus";
import useStore from "@/store";
import {storeToRefs} from "pinia";

const {user} = useStore();
const {legalname} = storeToRefs(user);

const searchName = ref("");
const tableData = ref([]);
const total = ref(1);
const pageSize = ref(10);
const currentPage = ref(1);

function fetchData() {
  getWithdrawalAllPage({
    current: currentPage.value,
    size: pageSize.value,
    name: searchName.value
  }).then(res => {
    tableData.value = res.data.records
    total.value = res.data.total
  })
}

function handlePageChange(page) {
  currentPage.value = page;
  fetchData();
}

function statusText(status) {
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

function statusType(status) {
  switch (status) {
    case 0:
      return "info";
    case 1:
      return "success";
    case 2:
      return "danger";
    default:
      return "info";
  }
}

const detailVisible = ref(false);
const currentRow = reactive({});
const multipleSelection = ref([])

const handleSelectionChange = (val) => {
  multipleSelection.value = val
}

function showDetail(row) {
  Object.assign(currentRow, row);
  detailVisible.value = true;
}

const editVisible = ref(false);
const editForm = reactive({});

function submitEdit() {
  // TODO: 保存编辑
  editVisible.value = false;
}

const handleAgree = (row) => {
  ElMessageBox.confirm(
      '确认同意这条提款申请？',
      '提示',
      {type: 'warning'}
  ).then(async () => {
    updateWithdrawal({
      id: row.id,
      status: 1,
      approver: legalname.value
    }).then((res) => {
      if (res.data === true) {
        ElMessage.success('已同意提现')
        fetchData()
      }
    })
  }).catch(() => {
  })
}

const handleRefuse = (row) => {
  ElMessageBox.confirm(
      '确认拒绝这条提款申请？',
      '提示',
      {type: 'warning'}
  ).then(async () => {
    updateWithdrawal({
      id: row.id,
      status: 2,
      approver: legalname.value
    }).then((res) => {
      if (res.data === true) {
        ElMessage.success('已拒绝提现')
        fetchData()
      }
    })
  }).catch(() => {
  })
}

// 审核
const auditVisible = ref(false);
const auditType = ref("pass");
const auditForm = reactive({remark: ""});

function showAudit(row, type) {
  auditType.value = type;
  Object.assign(auditForm, {remark: ""});
  auditVisible.value = true;
}

function submitAudit() {
  auditVisible.value = false;
}

fetchData()
</script>

<style lang="scss" scoped>
.withdrawal {
  border-radius: 20px;
  padding: 20px 20px 10px 20px;
  background-color: #ffffff;
  .mb-4 {
    margin-bottom: 16px;
  }
}
</style>

