import { createDirectus, rest, readSingleton, createItem, deleteItem, readItems,updateItem  } from '@directus/sdk';
const client = createDirectus('http://localhost:8055').with(rest());
export let $categorieslist = async () => {
    let result = await client.request(readSingleton('categories'));
    return result
}
export let $addProduct = async (params) => {
    try {
      let result = await client.request(createItem('products', params));
      // 假设返回的 result 包含插入后的数据或成功标识
      return result; // 返回数据以便进一步判断
    } catch (error) {
      console.error('产品添加失败:', error);
      throw new Error("产品添加失败");
    }
  }

export let $addCate = async (params) => {
    try {
        await client.request(
            createItem('products_categories', params))
        return true;
    } catch (erro) {
        console.error(`添加产品失败: ${error.message}`);
        return false; // 删除失败，返回 false
    }
}

export let $delProduct = async (params) => {
    try {
        await client.request(deleteItem('products', params)); // 发送请求
        return true; // 删除成功，返回 true
    } catch (error) {
        console.error(`删除产品失败: ${error.message}`);
        return false; // 删除失败，返回 false
    }
};

export let $getProduct = async (params) => {
    console.log(params);
    let result = await client.request(readItems('products', {
        filter: {
            id: {
				_eq: params,
			},
        }, 
        fields: [
          '*', 
          'categories.categories_id.*' 
        ]
      })); // 发送请求
      console.log(result);
    // let result = await client.request(readItem('products',params)); // 发送请求
    // console.log(result);
    return result;
};
export let $updateProduct = async (val,params) => {
    console.log(val);
    console.log(params);
const result = await client.request(
	updateItem('products', val,params
    
))}