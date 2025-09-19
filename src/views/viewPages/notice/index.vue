<!-- /**
公告信息表
使用vue3 + elemenetui plus + setup 不使用ts
根据标题查询
新增发布公告
写一个table(公告ID，标题，发布时间，状态（分为已发布和草稿），置顶，推送，操作（按钮：详情编辑删除）)
分页查询位置放在table右下角宽度为450px
表单包含： 
1新增编辑发布公告表单
3删除公告 弹框提示
*/ -->
<template>
  <div class="notice">
    <!-- 查询和新增按钮 --> 
    <div>
      <el-row justify="space-between" align="top">
        <el-col :span="12" :xs="24"><h3 style="margin: 0px; line-height: 32px;">公告管理</h3></el-col>
        <el-col :span="12" :xs="24"> 
          <div style="display: flex;justify-content: end;">
            <el-input
              v-model="searchName"
              placeholder="请输入标题"
              style="width: 300px;"
              clearable
              @clear="fetchNotices"
              @keyup.enter="fetchNotices"
            >
              <template #append>
                <el-button icon="Search" @click="fetchNotices" />
              </template>
            </el-input>
            <el-button type="primary"   @click="openForm('add')" style="margin-left: 20px;">  发布公告</el-button>
          </div>  
        </el-col>
      </el-row> 
    </div> 

    <!-- 公告表格 -->
    <el-table :data="notices" border style="width: 100%;margin-top: 10px;" height="65vh">
      <el-table-column prop="id" label="公告ID" width="80" />
      <el-table-column prop="title" label="标题" min-width="180" />
      <el-table-column prop="publishTime" label="发布时间" min-width="160" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === '已发布' ? 'success' : 'info'">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="top" label="置顶" width="80">
        <template #default="{ row }">
          <el-switch v-model="row.top" disabled />
        </template>
      </el-table-column>
      <el-table-column prop="push" label="推送" width="80">
        <template #default="{ row }">
          <el-switch v-model="row.push" disabled />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220">
        <template #default="{ row }">
          <el-button size="small" @click="openForm('detail', row)">详情</el-button>
          <el-button size="small" type="primary" @click="openForm('edit', row)">编辑</el-button>
          <el-button size="small" type="danger" @click="confirmDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div style="width: 100%; display: flex; justify-content: flex-end; margin-top: 16px;">
      
       <el-pagination  
          layout="prev, pager, next, jumper"
          :total="total"
          v-model:page-size="pageSize"
          v-model:current-page="currentPage"
          @current-change="handlePageChange"
        /> 
    </div>

    <!-- 新增/编辑/详情公告表单 -->
    <el-dialog :title="formModeTitle" v-model="formVisible" width="500px" :close-on-click-modal="false">
      <el-form :model="form" label-width="90px" :disabled="formMode==='detail'">
        <el-form-item label="标题" required>
          <el-input v-model="form.title" maxlength="50" show-word-limit />
        </el-form-item>
        <el-form-item label="内容" required>
          <el-input type="textarea" v-model="form.content" rows="5" maxlength="500" show-word-limit />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="已发布">已发布</el-radio>
            <el-radio label="草稿">草稿</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="置顶">
          <el-switch v-model="form.top" />
        </el-form-item>
        <el-form-item label="推送">
          <el-switch v-model="form.push" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="formVisible = false">取消</el-button>
        <el-button v-if="formMode !== 'detail'" type="primary" @click="submitForm">保存</el-button>
      </template>
    </el-dialog>

    <!-- 删除确认弹框 -->
    <el-dialog title="提示" v-model="deleteVisible" width="350px" :close-on-click-modal="false">
      <span>确定要删除该公告吗？</span>
      <template #footer>
        <el-button @click="deleteVisible = false">取消</el-button>
        <el-button type="danger" @click="deleteNotice">删除</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const notices = ref([
  { id: 1, title: '系统维护', publishTime: '2024-06-01 10:00', status: '已发布', top: true, push: true, content: '系统维护内容' },
  { id: 2, title: '新功能上线', publishTime: '2024-06-02 09:30', status: '草稿', top: false, push: false, content: '新功能内容' }
])
const total = ref(2)
const pageSize = ref(10)
const currentPage = ref(1)
const searchTitle = ref('')

function fetchNotices() {
  // 这里应请求后端接口，演示用本地过滤
  let data = [
    { id: 1, title: '系统维护', publishTime: '2024-06-01 10:00', status: '已发布', top: true, push: true, content: '系统维护内容' },
    { id: 2, title: '新功能上线', publishTime: '2024-06-02 09:30', status: '草稿', top: false, push: false, content: '新功能内容' }
  ]
  if (searchTitle.value) {
    data = data.filter(item => item.title.includes(searchTitle.value))
  }
  notices.value = data
  total.value = data.length
}

function handlePageChange(page) {
  currentPage.value = page
  fetchNotices()
}

// 表单相关
const formVisible = ref(false)
const formMode = ref('add') // add/edit/detail
const form = reactive({
  id: null,
  title: '',
  content: '',
  status: '草稿',
  top: false,
  push: false
})

const formModeTitle = computed(() => {
  if (formMode.value === 'add') return '新增公告'
  if (formMode.value === 'edit') return '编辑公告'
  return '公告详情'
})

function openForm(mode, row = null) {
  formMode.value = mode
  if (row) {
    Object.assign(form, row)
  } else {
    Object.assign(form, { id: null, title: '', content: '', status: '草稿', top: false, push: false })
  }
  formVisible.value = true
}

function submitForm() {
  if (!form.title || !form.content) return
  if (formMode.value === 'add') {
    form.id = Date.now()
    form.publishTime = new Date().toLocaleString()
    notices.value.push({ ...form })
    total.value++
  } else if (formMode.value === 'edit') {
    const idx = notices.value.findIndex(n => n.id === form.id)
    if (idx > -1) notices.value[idx] = { ...form }
  }
  formVisible.value = false
}

// 删除相关
const deleteVisible = ref(false)
const deleteRow = ref(null)
function confirmDelete(row) {
  deleteRow.value = row
  deleteVisible.value = true
}
function deleteNotice() {
  notices.value = notices.value.filter(n => n.id !== deleteRow.value.id)
  total.value--
  deleteVisible.value = false
}

fetchNotices()
</script> 
 
<style lang="scss" scoped>
  .notice{
    border-radius: 20px;
    padding: 20px 20px 10px 20px;
    background-color: #ffffff;
    .mb-4 {
      margin-bottom: 16px;
    }
  }
</style>