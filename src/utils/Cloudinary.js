import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
  // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_NAME, 
        api_secret:process.env.CLOUDINARY_API_SECRET
    });
    const uploadOnCloudinary=async (localFilePath)=>{
        try{
            if(!localFilePath) return null
           let res= await cloudinary.uploader.upload(localFilePath,{
                resource_type:"auto"
            })
            console.log(res.url)
            return res

        }catch(error ){
            fs.unlinkSync(localFilePath )
            return null

        }

    }
    export default uploadOnCloudinary;
    //  const uploadResult = await cloudinary.uploader
    //    .upload(
    //        'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
    //            public_id: 'shoes',
    //        }
    //    )
    //    .catch((error) => {
    //        console.log(error);
    //    });
    

    