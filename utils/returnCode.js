import { AsnycHandler } from "./AsnycHandler.js";
import { ApiResponse } from "./ApiResponse.js";
import { sendPostRequest } from "./sendRequest.js";

function returnCode (url , header , void_fail_message , fail_message , success_message)
{
    return AsnycHandler(async(req,res)=>{
          const data = req.body;
          
          if(!data)
          {
            return res.status(400)
            .json(
                new ApiResponse(401,{success:false , data:void_fail_message},void_fail_message)
            )
          }
          
          
          const result =  await sendPostRequest(url,header,data);
          console.log(result)   
          if(result.errors)
          {
            return res.status(400)
            .json(
              new ApiResponse(400 ,{success:false , data:result.errors},"something went wrong")
            )
          }

          if(!result)
          {
            return res.status(400)
            .json(
                new ApiResponse(401,{success:false , data:fail_message},fail_message)
            )
          }
          return res.status(200)
          .json(
            new ApiResponse(201,{success:true , data:result.data},success_message)
          )
    })
}

export {returnCode};