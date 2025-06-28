<template>
  <a-drawer :open="showDrawer" class="custom-class" root-class-name="root-class-name" :root-style="{ color: 'blue' }"
    style="color: red" title="产品添加" placement="right" @after-open-change="afterOpenChange" @close="closeDrawer">
    <a-form :model="formState" v-bind="layout" :validate-messages="validateMessages" :wrapperCol="{ span: 16 }"
      :label-col="{ span: 6 }" ref="formRef" @finish="onFinish">
      <a-form-item name="name" label="产品名称" :rules="[{ required: true, message: '请输入产品名称！' }]">
        <a-input v-model:value="formState.name" />
      </a-form-item>
      <a-form-item name="price" label="价格" :rules="[{ required: true, message: '请输入价格！' }]">
        <a-input v-model:value="formState.price" />
      </a-form-item>
      <a-form-item name="categories" label="类别">
        <a-radio-group v-model:value="formState.categories.id" name="radioGroup">
          <a-radio v-for="(item, index) in categoriesList" :key="index" :value="item.id">{{ item.name }}</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :wrapperCol="{ offset: 8, span: 16 }">
        <a-button class="add" html-type="submit">添加</a-button>
        <a-button class="clear" html-type="reset" @click="onClear">清空</a-button>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>

<script setup>
import { reactive, ref, toRefs, inject, watch } from 'vue';
import { message } from 'ant-design-vue';
import { $categorieslist, $addProduct, $getProduct,$updateProduct } from '../../api/proinfo.js'

const formRef = ref();
let loadData = inject('loadData')
let id = inject('id')
let dataSource = reactive({
  formState: {
    name: '',
    price: '',
    categories: {
       
        // 关联类别的 ID // 如果有多个类别
      
    }  // 用于存储选中的类别ID
  },
  categoriesList: []  // 用于存储类别列表
})

let { showDrawer, no } = defineProps(["showDrawer", "no"]);
let { formState, categoriesList } = toRefs(dataSource);
let emit = defineEmits(['sync-drawer'])

watch(() => id.value, (nval) => {
  $getProduct(nval).then(r => {
    // 更新formState的值
    const product = r[0];  // 假设返回的是一个产品数组
    dataSource.formState.name = product.name;
    dataSource.formState.price = product.price;
    dataSource.formState.id = product.id;
    console.log(r);
    // 选择类别的 ID 和 name
    if (product.categories && product.categories.length > 0) {
      const category = product.categories[0]?.categories_id; // 获取第一个类别
      dataSource.formState.categories = { id: category?.id || '', name: category?.name || '' };
    } else {
      dataSource.formState.categories = { id: '', name: '' };  // 如果没有类别，默认空值
    }
  });
  
});


let afterOpenChange = (val) => {
  if (!val) {
    emit('sync-drawer', val)
    onClear()
  }
}

const closeDrawer = () => {
  emit('sync-drawer', false);
  onClear()
};

let onFinish = async() => {  
  if(id.value){
    const newProduct = {
    name: dataSource.formState.name,
    price: dataSource.formState.price,
    categories: [{categories_id: dataSource.formState.categories }]
           // 关联类别的 ID
   
    
  };
  await $updateProduct(id.value,newProduct)
  message.success("产品更新成功");
  loadData()
  }
 else{
  const newProduct = {
    name: dataSource.formState.name,
    price: dataSource.formState.price,
    categories: {
      create: [
        { categories_id: dataSource.formState.categories },  // 关联类别的 ID
      ]
    }
  };
 await $addProduct(newProduct)
    .then(response => {
      message.success("产品添加成功1");
      onClear()
      console.log(response);
      loadData()
    })
    .catch(error => {
      message.error("产品添加失败1");
        });
 }
}

let loadCate = () => {
  $categorieslist().then(r => {
    dataSource.categoriesList = r.map(item => ({ id: item.id, name: item.name }));
    console.log(dataSource.categoriesList);  // 检查类别列表
  })
}

let onClear = () => {
  formRef.value.resetFields();
}

loadCate();
</script>
