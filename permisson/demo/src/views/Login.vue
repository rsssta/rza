<template>
    <div class="login">
        <div class="content">
            <a-form :model="formState" name="basic" :label-col="{ span: 4 }" :wrapper-col="{ span: 19 }"
                autocomplete="off" @finish="onFinish">
                <a-form-item label="账号" name="username"
                    :rules="[{ required: true, message: '请输入账号!' }]">
                    <a-input v-model:value="formState.username" />
                </a-form-item>

                <a-form-item label="密码" name="password"
                    :rules="[{ required: true, message: '请输入密码!' }]">
                    <a-input-password v-model:value="formState.password" />
                </a-form-item>

                <a-form-item name="remember" :wrapper-col="{ offset: 4, span: 16 }">
                    <a-checkbox v-model:checked="formState.remember">记住我</a-checkbox>
                </a-form-item>

                <a-form-item :wrapper-col="{ offset: 11, span: 16 }">
                    <a-button type="primary" html-type="submit">登录</a-button>
                </a-form-item>
            </a-form>       </div>
    </div>
</template>

<script setup>
import axios from 'axios'
import { reactive } from 'vue';
const formState = reactive({
    username: '',
    password: '',
    remember: false,
});
const onFinish = values => {
    let {username,password,remember}=values
    axios.post('https://rza.example.com/auth',{
        username,password}).then(({data})=>{
            console.log(data);
        })
};
</script>

<style lang="scss" scoped>
.login {
    width: 100vw;
    height: 100vh;
    background: linear-gradient(to bottom, rgb(5, 57, 79), rgb(200, 235, 250));
    display: flex;
    justify-content: center;
    align-items: center;
}

.content {
    width: 500px;
    border: 1px solid #fff;
    border-radius: 6px;
    padding: 20px;
}
</style>