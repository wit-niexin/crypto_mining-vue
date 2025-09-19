<template>
  <div class="userRevenue">
    <div>
      <el-row justify="space-between" align="top">
        <el-col :span="12" :xs="24"><h3 style="margin: 0px; line-height: 32px">收益管理</h3></el-col>
        <el-col :span="12" :xs="24">
          <div style="display: flex; justify-content: end">
            <el-input
                v-model="searchName"
                placeholder="请输入用户名"
                style="width: 300px"
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

    <el-table
        :data="tableData"
        border
        style="width: 100%; margin-top: 10px"
        height="65vh"
        @selection-change="handleSelectionChange"
    >
      <el-table-column prop="userLegalName" label="用户性名" min-width="50"/>
      <el-table-column prop="miningRigName" label="矿机名称" min-width="60"/>
      <el-table-column prop="status" label="状态" min-width="40">
        <template #default="{row }">
          <el-tag :type="row.status == 0 ? 'success' : 'info'">{{ row.status == 0 ? '在线' : '离线' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="launchDate" label="上线时间" min-width="100"/>
      <el-table-column prop="daysRunning" label="运行天数" min-width="50"/>
      <el-table-column prop="dailyAverageReturn" label="日均收益(U)" min-width="60"/>
      <el-table-column prop="cumulativeReturn" label="累计收益(U)" min-width="60"/>
      <el-table-column prop="annualizedYield" label="年化收益率(%)">
        <template #default="{ row }">
          {{ (row.annualizedYield * 100).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="60" fixed="right">
        <template #default="{ row }">
          <el-button size="small" icon="Edit" type="primary" @click="openEditDialog(row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div
        style="
        width: 100%;
        display: flex;
        justify-content: flex-end;
        margin-top: 10px;
      "
    >
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
  </div>
</template>

<script setup>
import {ref, reactive} from "vue";
import {getBenefitAllPageWithLegalName} from "@/api/reflect";
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
  getBenefitAllPageWithLegalName({
    current: currentPage.value,
    size: pageSize.value,
    name: searchName.value
  }).then((res) => {
    tableData.value = res.data.records
    total.value = res.data.total
  });
}

function handlePageChange(page) {
  currentPage.value = page;
  fetchData();
}

// 详情
const detailVisible = ref(false);
const currentRow = reactive({});
// 多选相关
const multipleSelection = ref([]);

const handleSelectionChange = (val) => {
  multipleSelection.value = val;
};

function showDetail(row) {
  Object.assign(currentRow, row);
  detailVisible.value = true;
}

// 编辑
const editVisible = ref(false);
const editForm = reactive({});

function showEdit(row) {
  Object.assign(editForm, row);
  editVisible.value = true;
}

function submitEdit() {
  // TODO: 保存编辑
  editVisible.value = false;
}

// 删除
function handleDelete(row) {
  // TODO: 删除操作
  ElMessageBox.confirm("你确定要删除该记录吗？", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    // 这里应调用后端接口
    // fetchUsers()
  });
}

// 备注编辑
function updateRemark(row) {
  // TODO: 更新备注
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
  // TODO: 审核操作
  auditVisible.value = false;
}

fetchData();
</script>

<style lang="scss" scoped>
.userRevenue {
  border-radius: 20px;
  padding: 20px 20px 10px 20px;
  background-color: #ffffff;

  .mb-4 {
    margin-bottom: 16px;
  }
}
</style>

