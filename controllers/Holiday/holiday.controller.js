import  Package  from "../../models/Package.js";
import { asyncHandler } from "../../utils/asyncHandler.js"
import { ApiResponse } from "../../utils/ApiResponse.js"
import { isNull } from "../../utils/formCheck.js"
import {userPackage} from "../../models/UserPackage.js"
import { TempTravel } from "../../models/TempTrav.js";

const searchPackages = asyncHandler(async (req, res) => {
    //This is a atucal logic of this constructure
    // try {
    //     // const {
    //     //     fromCity,
    //     //     toCity,
    //     //     departureDate,
    //     //     returnDate,
    //     //     duration,
    //     //     theme,
    //     //     isFixedDeparture,
    //     //     minPrice,
    //     //     maxPrice,
    //     //     stars,
    //     //     mealPlan
    //     // } = req.body;

    //     // let filter = {};

    //     // // Corrected field paths (removed non-existent 'flights' object)
    //     // if (fromCity) filter.fromCity = fromCity;
    //     // if (toCity) filter.toCity = toCity;
    //     // if (departureDate) filter.departureDate = departureDate;
    //     // if (returnDate) filter.returnDate = returnDate;

    //     // // Duration filter (correct)
    //     // if (duration?.nights) filter["duration.nights"] = duration.nights;
    //     // if (duration?.days) filter["duration.days"] = duration.days;

    //     // // Theme filter (correct)
    //     // if (theme?.length > 0) filter.theme = { $in: theme };

    //     // // Fixed departure filter (correct)
    //     // if (isFixedDeparture !== undefined) filter.isFixedDeparture = isFixedDeparture;

    //     // // Price range filter (updated for array handling)
    //     // if (minPrice || maxPrice) {
    //     //     filter["pricing"] = {
    //     //         $elemMatch: {
    //     //             singleSharing: {}
    //     //         }
    //     //     };
    //     //     if (minPrice) filter.pricing.$elemMatch.singleSharing.$gte = minPrice;
    //     //     if (maxPrice) filter.pricing.$elemMatch.singleSharing.$lte = maxPrice;
    //     // }

    //     // // Corrected hotel filters (fixed field paths)
    //     // if (stars) filter["hotels.stars"] = stars;
    //     // if (mealPlan) filter["hotels.mealPlan"] = mealPlan;

    //     // const packages = await Package.find(filter);

    //     // if (packages.length === 0) {
    //     //     return res.status(404).json(
    //     //         new ApiResponse(404, { success: false, data: [] }, "No packages found")
    //     //     );
    //     // }

    //     // return res.status(200).json(
    //     //     new ApiResponse(200, { success: true, data: packages }, "Filtered packages found")
    //     // );

    //     return res.status(200)
    //     .json(
    //         new ApiResponse(200 , {success:true , data:"Your Quiry generated successfully we contact you as soon as possible"} , "Your Quiry generated successfully we contact you as soon as possible")
    //     )
    // } catch (error) {
    //     return res.status(500).json(
    //         new ApiResponse(500, { success: false, error: error.message }, "Server Error")
    //     );
    // }
    //this is temp logic
    const requestdata = req.body;
    const saveData = await TempTravel.create(requestdata)
    if(!saveData)
    {
        return res.status(400)
        .json(
            new ApiResponse(400,{sucess:false , data:"Please Entet the all data"})
        )
    }
    return res.status(200)
        .json(
            new ApiResponse(200 , {success:true , data:{username:req.user.name,mobile:req.user.mobile,email:req.user.email,...requestdata}} , "Your Holiday request package has been send successfully!"))

});


const createPackages = asyncHandler(async(req,res)=>{
    const {destination,nights,days,hotel_type,discription} = req.body;
    const user = req.user;
    if(isNull([destination,nights ,days,hotel_type,discription]))
    {
        return res.status(400)
        .json(
            new ApiResponse(400,{success:false , data:"Please Enter  the all data"} ,"Please Enter the all data")
        )
    }

    const CreateNewPackages = await userPackage.create(
        {
            // username:user.username || user.agencyName || user.cpName || "testeample",
            username:"example",
            // Usertype:user.Usertype || "User",
            Usertype:"User",
            destination,
            nights,
            days,
            hotel_type,
            discription,
            // email:user.email,
            email:"example@gmail.com",
            // mobile:user.mobile || "Will check letter"
            mobile:"1234567890"
        }
    )

    if(!CreateNewPackages)
    {
        return res.status(400)
        .json(
            new ApiResponse(400 , {success:false ,data:"Sorry packages is not created"},"sorry packages is not created")
        )
    }

    // const SendEmailToDMC = await CreateNewPackages.info("request for travel page" , CreateNewPackages);

    // if(!SendEmailToDMC)
    // {
    //     return res.status(400)
    //     .json(
    //         new ApiResponse(400 , {success:false , data:"We Can't Create a contect with DMCs"},"We Can't Create a contect with DMC's Please Try Again")
    //     )
    // }


    return res.status(200)
    .json(
        new ApiResponse(200,{success:true , data:"Your packages is created we response you in message" },"data padh lo bhai")
    )
     
})


export 
{
    createPackages,
    searchPackages
}