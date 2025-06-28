import { defineOperationApi } from '@directus/extensions-sdk';
import { optionToObject } from '@directus/utils';
import { bufferFromStream } from '../utils'; // 自定义工具函数：将文件流转为Buffer
const tencentcloud = require("tencentcloud-sdk-nodejs")
﻿
// 导入对应产品模块的client models。
const OcrClient = tencentcloud.ocr.v20181119.Client

export default defineOperationApi({
  id: 'extract-text-from-image',
  name: 'Extract Text from Image',
  description: 'Extracts text from image using Tencent OCR API and updates file description in Directus.',
  handler: async ({ field, api }, { data, env, database, getSchema, services }) => {
    const key = field ?? optionToObject(data['$trigger'])?.key;
    if (!key) {
      throw new Error("Key is empty");
    }
   const schema = await getSchema({ database });
        const { AssetsService } = services;
        const service = new AssetsService({
            schema
        });
        const asset = await service.getAsset(key, { transformationParams: {}, acceptFormat: null });

    if (!asset) {
      throw new Error("Asset not found");
    }

    if (asset.file.type.indexOf('image') === -1) {
      throw new Error("This operation only works for images");
    }

    // 将文件流转为Buffer
    const buffer = await bufferFromStream(asset.stream);

    // 实例化腾讯OCR客户端
    const clientConfig = {
      credential: {
        secretId: env['TENCENT_CLOUD_SECRET_ID'],   // 使用环境变量存储 SecretId 和 SecretKey
        secretKey: env['TENCENT_CLOUD_SECRET_KEY'],
      },
      region: "ap-guangzhou",
      profile: {
        httpProfile: {
          endpoint: "ocr.tencentcloudapi.com",
        },
      },
    };

    const client = new OcrClient(clientConfig);
    const params = {
      ImageBase64: buffer.toString('base64'),
    };

    // 调用 OCR API
    try {
      const response = await client.GeneralBasicOCR(params);
      const textDetected = response.TextDetections?.map((item) => item.DetectedText).join("\n");

      return {
        success: true,
        ocrResult: textDetected, // 返回识别的结果
      };
    } catch (error) {
      console.error('Error during OCR:', error);
      throw new Error('Failed to perform OCR: ' + error.message);
    }
  },
});
