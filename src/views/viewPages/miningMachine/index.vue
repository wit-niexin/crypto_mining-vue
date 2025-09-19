<template>
  <div class="miningMachine">
    <!-- 查询表单 -->
    <div>
      <el-row justify="space-between" align="top">
        <el-col :span="12" :xs="24"><h3 style="margin: 0px; line-height: 32px;">矿机管理</h3></el-col>
        <el-col :span="12" :xs="24">
          <div style="display: flex;justify-content: end;">
            <el-input
                v-model="name"
                placeholder="请输入矿机名称"
                style="width: 300px;"
                clearable
                @clear="handleSearch"
                @keyup.enter="handleSearch"
            >
              <template #append>
                <el-button icon="Search" @click="handleSearch"/>
              </template>
            </el-input>
            <el-button type="primary" @click="openAddDialog" style="margin-left: 20px;"> 新增矿机</el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <el-table :data="tableData" border style="width: 100%;margin-top: 10px;" height="65vh">
      <el-table-column prop="name" label="名称" min-width="70"/>
      <el-table-column prop="model" label="型号" min-width="100"/>
      <el-table-column prop="status" label="状态" min-width="60">
        <template #default="{ row }">
          <el-tag :type="row.status == 0 ? 'success' : 'info'">{{ row.status == 0 ? '在用' : '停用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="manufacturer" label="制造商" min-width="120"/>
      <el-table-column prop="price" label="购买价（￥）" min-width="100"/>
      <el-table-column prop="commissioningDate" label="启用时间" min-width="140"/>
      <el-table-column label="操作" min-width="120" fixed="right">
        <template #default="{ row }">
          <el-button size="small" icon="Edit" type="primary" @click="openEditDialog(row)">编辑</el-button>
          <el-button size="small" icon="Delete" type="danger" @click="openDeleteDialog(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="width: 100%; display: flex; justify-content: flex-end; margin-top: 16px;">
      <div>
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

    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="500px">
      <el-form :model="form" ref="formRef" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" readonly/>
        </el-form-item>
        <el-form-item label="型号" prop="model">
          <el-input v-model="form.model"/>
        </el-form-item>
        <el-form-item label="制造商" prop="manufacturer">
          <el-input v-model="form.manufacturer"/>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择">
            <el-option label="在用" :value="0"/>
            <el-option label="停用" :value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item label="购买价" prop="price">
          <el-input-number v-model='form.price' :min='0' label='描述文字'></el-input-number>
        </el-form-item>

      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>

    <!-- 删除确认弹框 -->
    <el-dialog title="提示" v-model="deleteDialogVisible" width="350px">
      <span>确定要删除该矿机吗？</span>
      <template #footer>
        <el-button @click="deleteDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="confirmDelete">删除</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {addMiningRig, getMiningRigAllPage} from "@/api/miningMachine"
import {ref, reactive} from 'vue'

const tableData = ref([])
const total = ref(0)
const name = ref('')
const pageSize = ref(10)
const currentPage = ref(1)

function handleSearch() {
  getMiningRigAllPage({
    status: 0,
    name: name.value,
    size: pageSize.value,
    current: currentPage.value
  }).then(res => {
    tableData.value = res.data.records
    total.value = res.data.total
  })
}

function handlePageChange(page) {
  currentPage.value = page
  handleSearch()
}

function handleShelfChange(row) {
  // 上架状态变更逻辑
}

const dialogVisible = ref(false)
const dialogTitle = ref('新增矿机')
const form = reactive({
  id: null,
  model: '',
  name: '',
  commissioningDate: '',
  status: 0,
  runDays: 0,
  price: 0,
})
const formRef = ref(null)

function openAddDialog() {
  dialogTitle.value = '新增矿机'
  Object.assign(form, {
    id: null,
    model: '',
    name: '',
    commissioningDate: '',
    status: '0',
    runDays: 0,
    price: 0,
  })
  dialogVisible.value = true
}

function openEditDialog(row) {
  dialogTitle.value = '编辑矿机'
  Object.assign(form, row)
  dialogVisible.value = true
}

function openDetailDialog(row) {
  dialogTitle.value = '矿机详情'
  Object.assign(form, row)
  dialogVisible.value = true
}

function submitForm() {
  if (form.id) {
    // 编辑逻辑
  } else {
    // 新增逻辑
  }
  dialogVisible.value = false
  handleSearch()
}

const deleteDialogVisible = ref(false)
const deleteRow = ref(null)

function openDeleteDialog(row) {
  deleteRow.value = row
  deleteDialogVisible.value = true
}

function confirmDelete() {
  // 删除逻辑
  deleteDialogVisible.value = false
  handleSearch()
}

handleSearch()
</script>


<style lang="scss" scoped>
.miningMachine {
  border-radius: 20px;
  padding: 20px 20px 10px 20px;
  background-color: #ffffff;
}
</style>
