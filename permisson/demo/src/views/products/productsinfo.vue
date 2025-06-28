<template>
  <div class="search">
    <a-input-search class="searchText" v-model:value="searchKeyword" placeholder="请输入产品名称" enter-button="查询"
      size="default" @search="onSearch" />
    <a-button type="primary" class="add-a" @click="showDrawer=true">添加</a-button>
  </div>
  <a-table :key="tableDatas.length" :dataSource="tableDatas" :columns="tableColumns">
    <template #bodyCell="{ column, text, record }">
      <template v-if="column.dataIndex === 'operation'">
        <a @click="onEdit(record.id)" class="edit">编辑</a>
        <a-popconfirm title="确定删除吗?" okText="确定" cancelText="取消" @confirm="onDelete(record.id)">
          <a>删除</a>
        </a-popconfirm>
      </template>
    </template>
  </a-table>
  <addpro v-model:id="id" v-model:showDrawer="showDrawer" @sync-drawer="showDrawer=$event"></addpro>
</template>

<script setup>
// import addProduct from '../../components/product/addProduct.vue'
import { reactive, toRefs, ref , provide} from 'vue';
import { createDirectus, rest, readItems } from '@directus/sdk';
import { message } from 'ant-design-vue';
import { $delProduct } from '../../api/proinfo.js'
import addpro from '../../components/product/addProduct.vue'
const searchKeyword = ref('');
const formRef = ref();
let id = ref("");
// 数据源
let dataSource = reactive({
  tableDatas: [],  // 确保 dataSource.tableDatas 一开始是空数组
  tableColumns: [
    {
      title: '产品id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '产品名称',
      dataIndex: 'name'
    },
    {
      title: '价格',
      dataIndex: 'price'
    },
    {
      title: '类别',
      dataIndex: 'categories',
    },
    {
      title: '操作',
      dataIndex: 'operation'
    }
  ],
  formState: {
    name: '',
    price: '',
    categories: {
      create: [
        { categories_id: '' }, // 关联类别的 ID // 如果有多个类别
      ]
    }
  },
  showDrawer:false 
});
// 使用 `toRefs` 解构 `reactive` 数据，方便在模板中直接使用
let { tableDatas, tableColumns, formState,showDrawer } = toRefs(dataSource);
// let onClear = () => {
//   formRef.value.resetFields();
// }
const onDelete = async (id) => {
  try {
    const success = await $delProduct(id); // 等待删除完成
    if (success) {
      message.success("产品删除成功");
      // 使用 requestAnimationFrame 来确保在删除后页面布局被正确更新
      requestAnimationFrame(() => {
        loadData(); // 重新加载数据
      });
    } else {
      message.error("产品删除失败");
    }
  } catch (error) {
    message.error("删除产品时发生错误：" + error.message);
  }
};

let onEdit=(val)=>{
  dataSource.showDrawer=true
  id.value=val
}
const client = createDirectus('http://localhost:8055').with(rest());
let loadData = async (searchKeyword = '') => {
  try {
    const filter = searchKeyword
      ? {
        filter: {
          name: {
            _contains: searchKeyword, // 直接查询包含关键字的产品
          },
        },
      }
      : {};

    const result = await client.request(readItems('products', {
      fields: [
        '*,categories.categories_id.name'
      ], 
      ...filter
    }));
    result.forEach(item => {
      item.categories = item.categories.map(cat => cat.categories_id.name).join(', ');
    });
    tableDatas.value = result
  } catch (error) {
    console.error('Failed to fetch items:', error);
  }
};
loadData()
let onSearch = (value) => {
  searchKeyword.value = value;
  loadData(value);  // 传递搜索内容
}
provide('loadData',loadData)
provide('id',id)
</script>
<style scoped lang="scss">
.edit{
  margin-right: 10px;
}
.search {
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  .searchText {
    width: 300px;
  }

  .add-a {
    background: red;
    border: none;
  }

  .add {
    background: #bacf65;
    border: none;
    color: white
  }

  .clear {
    margin-left: 10px;
  }
}
</style>