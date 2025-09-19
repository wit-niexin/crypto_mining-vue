<template>
  <div class="user">
    <div>
      <el-row justify="space-between" align="top">
        <el-col :span="12" :xs="24"><h3 style="margin: 0px; line-height: 32px;">用户管理</h3></el-col>
        <el-col :span="12" :xs="24">
          <div style="display: flex;justify-content: end;">
            <el-input
                v-model="searchName"
                placeholder="请输入用户名"
                style="width: 300px;"
                clearable
                @clear="fetchUsers"
                @keyup.enter="fetchUsers"
            >
              <template #append>
                <el-button icon="Search" @click="fetchUsers"/>
              </template>
            </el-input>
          </div>
        </el-col>
      </el-row>
    </div>

    <el-table :data="users" style="width: 100%; margin-top: 10px;" border height="65vh">
      <!-- <el-table-column prop="id" label="用户ID" width="80" /> -->
      <el-table-column prop="legalName" label="用户名"/>
      <el-table-column prop="name" label="账户名"/>
      <el-table-column prop="gender" label="性别">
        <template #default="{ row }">
          <el-tag :type="row.gender == 0 ? 'success' : 'danger'">{{ row.gender == 0 ? "男" : "女" }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱"/>
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="row.status == 0 ? 'success' : 'danger'">{{ row.status == 0 ? '正常' : '禁用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createDate" label="注册时间" width="180"/>
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button size="small" icon="Edit" type="primary" @click="openFreezeDialog(row)">编辑</el-button>
          <el-button size="small" icon="Delete" type="danger" @click="openResetDialog(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="width: 100%; display: flex; justify-content: flex-end; margin-top: 10px;">
      <div >
        <el-pagination
           v-if="total > 0"
            layout="prev, pager, next, jumper"
            :total="total"
            v-model:page-size="pageSize"
            v-model:current-page="currentPage"
            @current-change="handlePageChange"
        />
      </div>
    </div>

    <el-dialog title="编辑用户" v-model="freezeDialogVisible" width="400px">
      <el-form label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="selectedUser.legalName" readonly />
        </el-form-item>
        <el-form-item label="账号名">
          <el-input v-model="selectedUser.name" readonly />
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model='selectedUser.gender'>
            <el-radio label='男' :value="0"></el-radio>
            <el-radio label='女' :value="1"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="selectedUser.email"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model='selectedUser.status'>
            <el-radio label='正常' :value="0"></el-radio>
            <el-radio label='禁用' :value="1"></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="freezeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="freezeUser">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {getUserAllPage} from "@/api/user";
import {ref, reactive} from 'vue'

const users = ref([])
const total = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)
const searchName = ref('')

const freezeDialogVisible = ref(false)
// const resetDialogVisible = ref(false)
const selectedUser = reactive({id: '', name: ''})
const freezeReason = ref('')
const newPassword = ref('')
const confirmPassword = ref('')


function fetchUsers() {
  getUserAllPage({
    current: currentPage.value,
    size: pageSize.value,
    name: searchName.value,
    status: 0
  }).then(res => {
    users.value = res.data.records
    total.value = res.data.total
  })
}

function handlePageChange(page) {
  currentPage.value = page
  fetchUsers()
}

function openFreezeDialog(row) {
  selectedUser.id = row.id
  selectedUser.name = row.name
  selectedUser.legalName = row.legalName
  selectedUser.gender = row.gender
  selectedUser.email = row.email
  selectedUser.status = row.status
  freezeReason.value = ''
  freezeDialogVisible.value = true
}

function freezeUser() {
  // 这里应调用后端接口
  freezeDialogVisible.value = false
  fetchUsers()
}

function openResetDialog(row) {
  selectedUser.id = row.id
  selectedUser.name = row.name
  newPassword.value = ''
  confirmPassword.value = ''
  // resetDialogVisible.value = true
  ElMessageBox.confirm('你确定要删除该用户吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    // 这里应调用后端接口
    // fetchUsers()
  })
}

// function resetPassword() {
//   if (newPassword.value !== confirmPassword.value) {
//     ElMessage.error('两次输入的密码不一致')
//     return
//   }
//   // 这里应调用后端接口
//   resetDialogVisible.value = false
// }
fetchUsers()
</script>
<style lang="scss" scoped>
.user {
  border-radius: 20px;
  padding: 20px 20px 10px 20px;
  background-color: #ffffff;
}
</style>