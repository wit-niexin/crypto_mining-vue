<template>
  <div class="relative min-h-screen flex">
    <div class="flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-auto min-w-0 bg">
      <div class="sm:w-1/2 xl:w-3/5 h-full hidden md:flex flex-auto items-center justify-center p-10 overflow-hidden bg-purple-900 text-white bg-no-repeat bg-cover relative bgi">
        <div class="absolute bg-gradient-to-b from-indigo-600 to-blue-500 opacity-75 inset-0 z-0"/>
        <div class="w-full max-w-lg z-10">
          <div class="sm:text-5xl xl:text-5xl font-bold leading-tight mb-6">
            Web3.0 矿机管理系统
          </div>
          <div class="sm:text-1xl xl:text-md text-gray-200 font-normal mb-3">
            USDT
          </div>
        </div>
        <ul class="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
      <div class="md:flex md:items-center md:justify-center w-full sm:w-auto md:h-full w-2/5 xl:w-2/5 p-8 md:p-10 lg:p-14 sm:rounded-lg md:rounded-none auto-bg">
        <div class="max-w-md w-full mx-auto space-y-8">
          <div>
            <div class="logo">
              <img src="@/assets/logo.png" alt="" style="width: 40px;height: 40px;">
              <span class=" font-bold text-2xl logoText">HashBox</span>
            </div>
          </div>

          <el-form ref="ruleFormRef" :model="loginForm" :rules="rules" label-width="auto">
            <el-form-item prop="name">
              <el-input v-model="loginForm.name" placeholder="用户名"/>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" v-model="loginForm.password" placeholder="密码不能为空"/>
            </el-form-item>
            <el-button type="primary" round @click="login2" style="width: 100%; background-color: #409EFF;color: #ffffff;height: 45px;">登 录
            </el-button>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {reactive, toRefs, ref} from "vue";
import {useRouter} from "vue-router";
import {ElMessage} from 'element-plus';
import CryptoJS from 'crypto-js'
import useStore from "@/store";
import {login} from "@/api/home";

const {user} = useStore();
const router = useRouter();
const ruleFormRef = ref();
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

// 登录表单与验证规则
const data = reactive({
  loginForm: {
    name: '',
    password: '',
  },
  rules: {
    name: [{required: true, message: '用户名不能为空', trigger: 'blur'},],
    password: [{required: true, message: '密码不能为空', trigger: 'blur'},],
  },
})
const {loginForm, rules} = toRefs(data)
// 登录表单验证规则
const login2 = () => {
  ruleFormRef.value.validate((valid) => {
    if (valid) {
      loginSubmit()
    } else {
      return false;
    }
  });
}

const loginSubmit = async () => {
  try {
    const response = await login({
      name: loginForm.value.name,
      password: encryptPwd(loginForm.value.password)
    });

    // Check if login was successful
    if (response.code === 200 && response.data.token) {
      user.changeUser(response.data);

      ElMessage.success({
        message: "登录成功，正在跳转至平台主页！",
        type: "success",
      });

      const isAdmin = response.data.user.roles.some(v => v.name === 'ADMIN');
      router.push(isAdmin ? "/index" : "/indexUser");

    } else {
      // Invalid token or code not 200
      ElMessage.error({
        message: "账号或密码错误！",
        type: "error",
      });
    }

  } catch (error) {
    console.error("Login failed:", error);
    ElMessage.error("服务器错误，请稍后重试！");
  }
};

</script>

<style scoped lang="scss">
@import "/src/assets/style/tailwind.min.css";
@import "/src/assets/style/login.css";

.logoText {
  color: #303133;
  margin-left: 20px;
}

.bgi {
  // background-image: url("/src/assets/images/login.jpg");
}

.logo {
  display: flex;
  justify-content: center;
  align-items: center;

  .auto-bg {
    background-color: var(--el-bg-color-page);
  }
}

::v-deep(.el-input__wrapper) {
  border-radius: 50px;
  height: 45px;
  margin-bottom: 10px;
}
</style>