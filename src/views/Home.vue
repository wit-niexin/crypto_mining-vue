<template>
  <el-container>
    <el-aside>
      <Aside></Aside>
    </el-aside>
    <el-container>
      <el-header>
        <Header @changePassword="changePassword"></Header>
      </el-header>
      <el-main>
        <el-card shadow="never">
          <div class="routerMode">
            <router-view/>
          </div>
        </el-card>
      </el-main>
    </el-container>
  </el-container>
  <el-dialog v-model="dialogFormVisible" title="修改密码" width="30%">
    <el-form :model="form" label-width="100px" ref="formRef" :rules="rules">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input v-model="form.oldPassword" placeholder="请输入旧密码" type="password" show-password/>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword1">
        <el-input v-model="form.newPassword1" placeholder="请输入新密码" type="password" show-password/>
      </el-form-item>
      <el-form-item label="确认密码" prop="newPassword2">
        <el-input v-model="form.newPassword2" placeholder="请再次输入新密码" type="password" show-password/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submitPassword(formRef)">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import Aside from '@/components/common/Aside.vue'
import Header from '@/components/common/Header.vue'
import {ElMessage} from 'element-plus'
import {reactive, ref} from "vue";
import {storeToRefs} from "pinia";
import {modifyPassword} from "@/api/user";
import useStore from "@/store";
import {useRouter} from "vue-router";
import CryptoJS from 'crypto-js'

const AES_KEY = import.meta.env.VITE_AES_KEY;
const encryptPwd = (pwd) => {
  return CryptoJS.AES.encrypt(
      pwd,
      CryptoJS.enc.Hex.parse(AES_KEY),
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      }
  ).toString()
}

const {user} = useStore()
const {username} = storeToRefs(user)
const router = useRouter()
const dialogFormVisible = ref(false)
const changePassword = () => {
  dialogFormVisible.value = true
}
const formRef = ref(null)
const form = reactive({
  oldPassword: '',
  newPassword1: '',
  newPassword2: '',
})

const checkPasswordSame = (rule, value, callback) => {
  if (value && form.newPassword1 === form.newPassword2) {
    callback()
  } else {
    return callback(new Error("新密码与确认密码不一致！"))
  }
}

const rules = reactive({
  oldPassword: [
    {required: true, message: '请输入旧密码', trigger: 'blur'},
    {min: 6, max: 16, message: '密码长度为6-16位', trigger: 'blur'},
  ],
  newPassword1: [
    {required: true, message: '请输入新密码', trigger: 'blur'},
    {min: 6, max: 16, message: '密码长度为6-16位', trigger: 'blur'},
  ],
  newPassword2: [{validator: checkPasswordSame, required: true, message: '确认密码与新密码不一致', trigger: 'blur'}]
})

const submitPassword = async (formRef) => {
  await formRef.validate((valid) => {
    if (valid) {
      modifyPassword({
        name: username.value,
        oldPassword: encryptPwd(form.oldPassword),
        newPassword: encryptPwd(form.newPassword1)
      }).then((response) => {
        if (response.data === true) {
          ElMessage({
            message: '密码修改成功，即将跳转至登录页！',
            type: 'success',
          })
          setTimeout(() => {
            router.replace('/login');    // 修改密码成功后，强制用户重新登录
          }, 1500)
        }
      }).catch(response => {
        if (response.status === 400) {
          ElMessage.error(response.data.msg)
        }
      })
    } else {
      ElMessage.error('请检查表单填写项，然后再提交')
    }
  })
}
</script>

<style scoped lang="scss">
.el-main {
  background-color: var(--el-bg-color-page);
}

.el-aside {
  width: auto !important;
}

.el-header {
  display: flex;
  align-items: center;
  background: #ffffff;
}

::v-deep(.el-card__body) {
  padding: 0;
  background: #f2f3f5;
  border: none;
}

::v-deep(.el-card) {
  --el-card-border-color: none
}

.routerMode {
  overflow: auto;
}
</style>
