<template>
  <div class="uip">
    <!-- 文件上传框 -->
    <a-upload-dragger
      v-model:fileList="fileList"
      name="file"
      action="/files"
      :multiple="true"
      @change="handleChange"
      @drop="handleDrop"
    >
      <p class="ant-upload-drag-icon">
        <InboxOutlined></InboxOutlined>
      </p>
      <p class="ant-upload-text">Click or drag file to this area to upload</p>
      <p class="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibit from uploading company data or other
        band files
      </p>
    </a-upload-dragger>

    <!-- 上传成功后的图片显示区域 -->
    <div v-if="imageUrl" class="image-container">
      <img :src="imageUrl" alt="Uploaded Image" class="uploaded-image" @click="showDrawer" />
    </div>

    <p id="status">{{ uploadStatus }}</p>
  </div>

  <!-- 提取结果的抽屉 -->
  <a-drawer
    title="提取结果"
    placement="top"
    :closable="true"
    :open="open"
    @close="onClose"
  >
    <a-form :model="formState" ref="formRef" @finish="onFinish">
      <a-form-item name="description" label="提取结果" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
        <!-- 使用 a-textarea 让输入框更大 -->
        <a-textarea v-model:value="formState.description" :auto-size="{ minRows: 3, maxRows: 6 }" />
      </a-form-item>
    </a-form>
  </a-drawer>
</template>

<script setup>
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import { InboxOutlined } from '@ant-design/icons-vue';
import { createDirectus, rest, uploadFiles, readFiles } from '@directus/sdk';
import { $getfile } from '@/api/file';

const imageUrl = ref('');
const id = ref('');
const fileList = ref([]);
let uploadStatus = ref('');
const formState = ref({
  description: ''
});
const client = createDirectus('http://localhost:8055').with(rest());

const open = ref(false);
const showDrawer = () => {
  open.value = true;
  $getfile(id.value).then((response) => {
    console.log(response);
    formState.value.description = response.description;
  }).catch((error) => {
    console.error('Error fetching file:', error);
  });
};
const onClose = () => {
  open.value = false;
};

const handleChange = (info) => {
  const status = info.file.status;
  if (status !== 'uploading') {
    console.log(info.file, info.fileList);
  }
  if (status === 'done') {
    message.success(`${info.file.name} 成功上传.`);
  } else if (status === 'error') {
    message.error(`${info.file.name} 上传失败.`);
  }
};

function handleDrop(e) {
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    const formData = new FormData();
    for (let file of files) {
      formData.append('file', file);
    }
    client.request(uploadFiles(formData))
      .then((response) => {
        console.log('Response:', response);
        const imageUrlPath = `http://localhost:8055/assets/${response.id}`;
        imageUrl.value = imageUrlPath;
        id.value = response.id;
      })
      .catch((error) => {
        uploadStatus.value = 'Upload failed!';
        message.error('File upload failed!');
        console.error(error);
      });
  }
}
</script>

<style>
.uip {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.image-container {
  margin-top: 20px;
}

.uploaded-image {
  width: 200px;
  max-height: 200px;
  border-radius: 10px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
}
</style>
