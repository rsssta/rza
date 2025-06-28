import { createDirectus, rest, uploadFiles,readFile } from '@directus/sdk';

const client = createDirectus('http://localhost:8055').with(rest());
export let $upload=async(params)=>{
    const formData = new FormData();
    formData.append('title', params.title);
    formData.append('file', params.file,params.fileName);    
    const result = await client.request(uploadFiles(formData));
}
export let $getfile=async(params)=>{
    const result = await client.request(readFile(params, {
        fields: [
          '*'
        ]
      }));  
      return result
}