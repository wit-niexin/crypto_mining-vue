<template>
  <div class="account-info-card">
    <h3>账户信息</h3>
    <el-form :model="accountForm" ref="accountref" label-width="90px" class="account-form" label-position="top" :rules="rules1">
      <el-form-item label="账户名">
        <el-input v-model="accountForm.name" disabled class="inputs"/>
      </el-form-item>
      <el-form-item label="用户姓名">
        <el-input v-model="accountForm.username" :disabled="!isEditMode" class="inputs"/>
      </el-form-item>
      <el-form-item label="电子邮箱地址">
        <el-input v-model="accountForm.email" :disabled="!isEditMode" class="inputs"/>
      </el-form-item>
      <el-form-item label="电话号码" prop="phone">
        <el-input v-model="accountForm.phone"  :disabled="!isEditMode" class="inputs"/>
      </el-form-item>
      <el-form-item label="UID">
        <el-input v-model="accountForm.uid"  :disabled="!isEditMode" class="inputs"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleClick">
          {{ isEditMode ? '保存' : '更新个人信息' }}
        </el-button>
      </el-form-item>
    </el-form>

    <!--
    <el-divider/>

    <h3>更新密码</h3>
    <el-form :model="passwordForm" ref="passwordref" label-width="90px" class="password-form" label-position="top"
             :rules="rules2">
      <el-form-item label="当前密码" prop="oldPwd" required>
        <el-input v-model="passwordForm.oldPwd" type="password" show-password class="inputs"/>
      </el-form-item>
      <el-form-item label="新密码" prop="newPwd" required>
        <el-input v-model="passwordForm.newPwd" type="password" show-password class="inputs"/>
      </el-form-item>
      <el-form-item label="确认新密码" prop="confirmPwd" required>
        <el-input v-model="passwordForm.confirmPwd" type="password" show-password class="inputs"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="validatePasswordForm">更新密码</el-button>
      </el-form-item>
    </el-form>
    -->
  </div>
</template>

<script setup>
import {reactive, ref, toRefs} from 'vue'
import useStore from "@/store";
import {storeToRefs} from "pinia";
import {updateUser} from "@/api/user";
import {ElMessage} from "element-plus";

const {user} = useStore();
const {username} = storeToRefs(user);
const isEditMode = ref(false)

const accountForm = reactive({
  name: username.value,
  username: user.user.legalName,
  email: user.user.email,
  phone: user.user.phone,
  uid: user.user.uid
})

const data = reactive({
  rules1: {
    phone: [
      {required: true, message: '请输入手机号', trigger: 'blur'},
      {pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur'}
    ]
  }
})

const {rules1} = toRefs(data)
const accountref = ref()

const handleClick = () => {
  if (!isEditMode.value) {
    // 进入编辑模式
    isEditMode.value = true
  } else {
    // 已在编辑模式，执行保存逻辑
    validateAccountForm()
  }
}

const validateAccountForm = () => {
  accountref.value.validate(valid => {
    if (!valid) return

    updateUser({
      id: user.user.id,
      name: accountForm.name,
      legalName: accountForm.username,
      email: accountForm.email,
      phone: accountForm.phone,
      uid: accountForm.uid
    }).then((res) => {
      if (res.code === 200) {
        ElMessage.success('更新成功')
        // 成功后关闭编辑状态
        isEditMode.value = false
        user.changeUser(res.data);
      } else {
        ElMessage.error('更新失败')
      }
    }).catch(() => ElMessage.error('更新失败'))
  })
}
</script>

<style scoped lang="scss">
.account-info-card {
  border-radius: 20px;
  padding: 20px 20px 10px 20px;
  background-color: #ffffff;
}

.account-form, .password-form {
  margin-top: 16px;
  padding: 20px 0px;
}

.inputs {
  width: 500px;
}
</style>