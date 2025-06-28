<template>
  <a-layout class="layout">
    <!-- 左侧 -->
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo" />
      <a-menu v-model:openKeys="state.openKeys" v-model:selectedKeys="state.selectedKeys" mode="inline" theme="dark"
        :inline-collapsed="state.collapsed">
        <template v-for="item in items">
          <!-- 如果有子菜单，使用 a-sub-menu -->
          <template v-if="item.children">
            <a-sub-menu :key="`submenu-${item.key}`" :icon="item.icon" :title="item.label">
              <a-menu-item v-for="subItem in item.children" :key="`subitem-${subItem.key}`">
                <RouterLink :to="subItem.route">{{ subItem.label }}</RouterLink>
              </a-menu-item>
            </a-sub-menu>
          </template>
          <!-- 如果没有子菜单，直接使用 a-menu-item -->
          <template v-else>
            <a-menu-item :key="`menuitem-${item.key}`">
              <RouterLink :to="item.route">
                <span v-if="item.icon">
                  <component :is="item.icon" />
                </span>
                {{ item.label }}
              </RouterLink>
            </a-menu-item>
          </template>
        </template>
      </a-menu>
    </a-layout-sider>
    <!-- 右侧 -->
    <a-layout>
      <!-- 顶部 -->
      <a-layout-header style="background: '#fff'; padding: 0">
        <menu-unfold-outlined v-if="collapsed" class="trigger" @click="() => (collapsed = !collapsed)" />
        <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
      </a-layout-header>
      <a-layout-content :style="{ margin: '6px', padding: '6px', background: '#fff', minHeight: '280px' }">
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script setup>
import { reactive, h, ref, onMounted, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { PieChartOutlined, MailOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue';
// 左侧菜单和折叠状态
const state = reactive({
  collapsed: false,
  selectedKeys: ['1'],
  openKeys: ['sub1'],
  preOpenKeys: ['sub1'],
});
// 定义菜单项
const items = reactive([
  {
    key: 'sub1',
    icon: () => h(MailOutlined),
    label: '产品管理',
    children: [
      {
        key: '1',
        label: '产品信息',
        route: '/productInfo',  // 设置路由
      },
      {
        key: '2',
        label: 'test',
        route: '/option-6',  // 设置路由
      },
    ],
  },
  {
    key: '3',
    icon: () => h(PieChartOutlined),
    label: '文字提取',
    route: '/textExtract',  // 设置路由
  },
]);
// 动态展开的菜单
watch(
  () => state.openKeys,
  (_val, oldVal) => {
    state.preOpenKeys = oldVal;
  }
);
// 处理折叠菜单
const toggleCollapsed = () => {
  state.collapsed = !state.collapsed;
  state.openKeys = state.collapsed ? [] : state.preOpenKeys;
};
</script>
<style scoped lang="scss">
.layout {
  width: 100vw;
  height: 100vh;
}
.logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.3);
  margin: 16px;
}
.trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
  color: #fff;
  &:hover {
    color: #1890ff;
  }
}
</style>
