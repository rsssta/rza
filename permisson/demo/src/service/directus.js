import {Directus} from '@directus/sdk';

// 初始化 Directus 客户端
const directus = new Directus('directusUrl');

// 登录函数
async function login(email, password) {
  let flag = false;
  await directus.auth
    .login({ email, password })
    .then((res) => {
      if (typeof res.access_token !== 'undefined') {
        flag = true;
      }
    });
  return flag;
}

// 刷新 Token 函数
async function refreshtoken() {
  await directus.auth.refresh();
  console.log(' >================(directus.js:23)', 'fresh token');
}

// 登出函数
async function logout() {
  await directus.auth.logout();
}

// 获取用户信息函数
async function userinfo() {
  const userInfo = await directus.users.me.read();
  return userInfo;
}

// 每 10 分钟刷新一次 Token
setInterval(() => {
  refreshtoken();
}, 600000);

module.exports = { login, refreshtoken, logout, userinfo };
