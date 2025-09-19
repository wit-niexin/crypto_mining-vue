 <!-- /**
提现信息表
使用vue3 + elemenetui plus + setup 不使用ts
根据名称查询
一排按钮 添加管理员，批量启用、批量禁用、批量删除、导出
写一个table(
姓名
角色
权限
状态（启用、禁用）
创建时间 
操作（按钮：编辑、重置密码、权限分配、操作日志）)
分页查询位置放在table右下角宽度为450px
表单包含： 
1添加编辑管理员表单
2.重置密码表单
3权限分配表单
4操作日志表单
*/ -->

<template>
  <div class="administrators">
    <!-- 搜索栏 --> 
    <div>
      <el-row justify="space-between" align="top">
        <el-col :span="12" :xs="24"><h3 style="margin: 0px; line-height: 32px;">权限管理</h3></el-col>
        <el-col :span="12" :xs="24"> 
          <div style="display: flex;justify-content: end;">
            <el-button @click="showAddDialog" style="margin-right: 10px;"> 下载</el-button>
            <el-button @click="handleBatchEnable" style="margin-right: 10px;">批量启用</el-button>
            <el-button @click="handleBatchDisable" style="margin-right: 10px;">批量禁用</el-button>
            <el-button @click="handleBatchDelete" style="margin-right: 10px;">批量删除</el-button>
            <el-button @click="handleExport" style="margin-right: 10px;">导出</el-button>
            <el-input
              v-model="searchName"
              placeholder="请输入管理员名称"
              style="width: 300px;"
              clearable
              @clear="handleSearch"
              @keyup.enter="handleSearch"
            >
              <template #append>
                <el-button icon="Search" @click="handleSearch" />
              </template>
            </el-input> 
          </div>  
        </el-col>
      </el-row> 
    </div>  

    <!-- 管理员表格 -->
    <el-table
      :data="tableData"
      border
      style="width: 100%;margin-top: 10px;"
      height="65vh"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="role" label="角色" width="120" />
      <el-table-column prop="permission" label="权限" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === '启用' ? 'success' : 'danger'">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column label="操作" width="400">
        <template #default="{ row }">
          <el-button size="small" @click="showEditDialog(row)">编辑</el-button>
          <el-button size="small" @click="showResetPasswordDialog(row)">
            重置密码
          </el-button>
          <el-button size="small" @click="showPermissionDialog(row)">
            权限分配
          </el-button>
          <el-button size="small" @click="showOperationLogDialog(row)">
            操作日志
          </el-button>
          <el-button size="small" type="danger"   @click="showOperationdel(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30, 50]"
        :background="true"
        layout="prev, pager, next, jumper"
        :total="total"
      
      />
    </div>

    <!-- 添加/编辑管理员表单 -->
    <el-dialog
      v-model="addEditDialogVisible"
      :title="isEdit ? '编辑管理员' : '添加管理员'"
      width="30%"
    >
      <el-form :model="adminForm" label-width="100px">
        <el-form-item label="姓名">
          <el-input v-model="adminForm.name" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="adminForm.role" placeholder="请选择角色">
            <el-option
              v-for="item in roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="权限">
          <el-checkbox-group v-model="adminForm.permission">
            <el-checkbox
              v-for="item in permissionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="adminForm.status"
            active-text="启用"
            inactive-text="禁用"
            :active-value="true"
            :inactive-value="false"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addEditDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAddEditSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 重置密码表单 -->
    <el-dialog v-model="resetPasswordDialogVisible" title="重置密码" width="30%">
      <el-form :model="resetPasswordForm" label-width="100px">
        <el-form-item label="新密码">
          <el-input
            v-model="resetPasswordForm.newPassword"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input
            v-model="resetPasswordForm.confirmPassword"
            type="password"
            show-password
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="resetPasswordDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleResetPasswordSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 权限分配表单 -->
    <el-dialog v-model="permissionDialogVisible" title="权限分配" width="40%">
      <el-tree
        :data="permissionTreeData"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :props="defaultProps"
      />
      <template #footer>
        <el-button @click="permissionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handlePermissionSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 操作日志表单 -->
    <el-dialog v-model="operationLogDialogVisible" title="操作日志" width="70%">
      <el-table :data="operationLogData" border style="width: 100%">
        <el-table-column prop="operation" label="操作类型" width="120" />
        <el-table-column prop="content" label="操作内容" />
        <el-table-column prop="operator" label="操作人" width="120" />
        <el-table-column prop="operationTime" label="操作时间" width="180" />
      </el-table>
      <template #footer>
        <el-button @click="operationLogDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

// 表格数据
const tableData = ref([
  {
    id: 1,
    name: '管理员1',
    role: '超级管理员',
    permission: '全部权限',
    status: '启用',
    createTime: '2023-01-01 10:00:00'
  },
  {
    id: 2,
    name: '管理员2',
    role: '普通管理员',
    permission: '用户管理,内容管理',
    status: '禁用',
    createTime: '2023-01-02 11:00:00'
  }
])

// 搜索相关
const searchName = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 表单相关
const addEditDialogVisible = ref(false)
const resetPasswordDialogVisible = ref(false)
const permissionDialogVisible = ref(false)
const operationLogDialogVisible = ref(false)
const isEdit = ref(false)
const adminForm = reactive({
  name: '',
  role: '',
  permission: [],
  status: true
})
const resetPasswordForm = reactive({
  newPassword: '',
  confirmPassword: ''
})

// 选项数据
const roleOptions = [
  { value: 'super', label: '超级管理员' },
  { value: 'normal', label: '普通管理员' }
]
const permissionOptions = [
  { value: 'user', label: '用户管理' },
  { value: 'content', label: '内容管理' },
  { value: 'system', label: '系统设置' }
]
const permissionTreeData = [
  {
    id: 1,
    label: '系统管理',
    children: [
      { id: 11, label: '用户管理' },
      { id: 12, label: '角色管理' }
    ]
  },
  {
    id: 2,
    label: '内容管理',
    children: [
      { id: 21, label: '文章管理' },
      { id: 22, label: '评论管理' }
    ]
  }
]
const operationLogData = ref([
  {
    operation: '新增',
    content: '添加了管理员"测试用户"',
    operator: '管理员1',
    operationTime: '2023-01-01 10:00:00'
  }
])
const defaultProps = {
  children: 'children',
  label: 'label'
}

// 多选相关
const multipleSelection = ref([])

// 方法定义
const handleSearch = () => {
  console.log('搜索:', searchName.value)
  // 这里应该调用API进行搜索
}

const handleSelectionChange = (val) => {
  multipleSelection.value = val
}

const showAddDialog = () => {
  isEdit.value = false
  Object.assign(adminForm, {
    name: '',
    role: '',
    permission: [],
    status: true
  })
  addEditDialogVisible.value = true
}

const showEditDialog = (row) => {
  isEdit.value = true
  Object.assign(adminForm, {
    name: row.name,
    role: row.role,
    permission: row.permission.split(','),
    status: row.status === '启用'
  })
  addEditDialogVisible.value = true
}

const showResetPasswordDialog = (row) => {
  resetPasswordForm.newPassword = ''
  resetPasswordForm.confirmPassword = ''
  resetPasswordDialogVisible.value = true
}

const showPermissionDialog = (row) => {
  permissionDialogVisible.value = true
}

const showOperationLogDialog = (row) => {
  operationLogDialogVisible.value = true
}

const showOperationdel = (row) =>{

}
const handleAddEditSubmit = () => {
  console.log('提交表单:', adminForm)
  addEditDialogVisible.value = false
}

const handleResetPasswordSubmit = () => {
  console.log('重置密码:', resetPasswordForm)
  resetPasswordDialogVisible.value = false
}

const handlePermissionSubmit = () => {
  console.log('权限分配提交')
  permissionDialogVisible.value = false
}

const handleBatchEnable = () => {
  console.log('批量启用:', multipleSelection.value)
}

const handleBatchDisable = () => {
  console.log('批量禁用:', multipleSelection.value)
}

const handleBatchDelete = () => {
  console.log('批量删除:', multipleSelection.value)
}

const handleExport = () => {
  console.log('导出数据')
}
 
// onMounted(() => {
//   // 这里可以加载初始数据
// }) 
</script>

<style lang="scss" scoped>
.administrators { 
  border-radius: 20px;
  padding: 20px 20px 10px 20px;
  background-color: #ffffff;
  .operation-buttons {
    margin-bottom: 20px;
  }
  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}

</style>