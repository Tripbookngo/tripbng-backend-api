import { Coupun } from "../../models/Coupn.models.js";
import { AsnycHandler } from "../../utils/AsnycHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";



const GenerateCoupunCode = () => {
    const numbers = '1234567890';
    const alfabates = 'QWERTYUIOPASDFGHJKLZXCVBNM';
    const smallAlfaBates = 'qwertyuiopasdfghjklzxcvbnm';

    const coupen = (numbers.slice(Math.floor((Math.random() * (5 - 0 + 1)) + 0), Math.floor((Math.random() * (10 - 5 + 1)) + 5))).slice(0, 2) + (alfabates.slice(Math.floor((Math.random() * (13 - 0 + 1)) + 0), Math.floor((Math.random() * (26 - 13 + 1)) + 13))).slice(0, 2) + (smallAlfaBates.slice(Math.floor((Math.random() * (13 - 0 + 1)) + 0), Math.floor((Math.random() * (26 - 13 + 1)) + 13))).slice(0, 2)

    return coupen
}


async function returnFunction() {
    const cop = GenerateCoupunCode();
    const findCoup = await Coupun.findOne({ coupneCode: cop });

    if (findCoup) {
        return await returnFunction();  // Ensure the recursive call returns a value
    } else {
        return cop;
    }
}

const CreateCoupne = AsnycHandler(async (req, res) => {
    const { discount } = req.body;

    const cop = returnFunction();
    const user = req.user;
    const dataSave = await Coupun.create({ user: user._id, coupneCode: cop, discount: discount })

    if (!dataSave) {
        return res.status(200)
            .json(
                new ApiResponse(200, { success: false, data: "Something problem in the Server site" }, "Something Problem At server site")
            )
    }

    return res.status(200)
        .json(
            new ApiResponse(200, { success: true, data: createCoupne }, "coupen code is generated")
        )
})

const UseCoupne = AsnycHandler(async (req, res) => {
    const { coupen_code, amount } = req.body;
    if (!coupen_code) {
        return res.status(400)
            .json(
                new ApiResponse(401, { success: false, data: "please Enter the coupen code" }, "enter the coupen code")
            )
    }

    const isCoupenValid = await Coupun.findOne({ coupneCode: coupen_code, userId: req.user._id })

    if (!isCoupenValid) {
        return res.status(400)
            .json(
                new ApiResponse(401, { sucess: false, data: "please enter the valid coupen code" }, "please enter the valid coupen code")
            )
    }

    if (!isCoupenValid.isUsable) {

        return res.status(400)
            .json(
                new ApiResponse(401, { sucess: false, data: "this coupen is already used" }, "this coupen is already used")
            )

    }

    const finalAmount = amount - (amount * parseFloat(isCoupenValid.discount)) / 100

    if (finalAmount < 0) {
        return res.status(400)
            .json(
                new ApiResponse(401, { success: false, data: "this coupen is not aplicable for this item" }, "this coupen is not aplicable for the item")
            )
    }

    return res.status(200)
        .json(
            new ApiResponse(201, { success: true, data: finalAmount }, "Your final amount discount")
        )


})

const DisableCoupen = AsnycHandler(async (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400)
            .json(
                new ApiResponse(400, { success: false, data: "please enter the id" }, "please enter the id")

            )
    }

    const isCoupenValid = await Coupun.findByIdAndUpdate(id, {
        isUsable: false
    })

    if (!isCoupenValid) {
        return res.status(400)
            .json(
                new ApiResponse(401, { success: false, data: "please enter the valid coupen code" }, "please enter the valid coupen code")
            )
    }
})

const GetAllCoupenCode = AsnycHandler(async(req,res)=>{
    const userid = req.user._id;

    const findcoupen = await Coupun.findById(userid);
    if(findcoupen.length == 0)
    {
        return res.status(200)
        .json(
            new ApiResponse(201 , {success:true , data:"user does't have any coupen"},"user don't have any coupen")
        )
    }

    return res.status(200)
    .json(
        new ApiResponse(201,{success:true , data:findcoupen},"all the coupen data")
        
    )
})

export {
    CreateCoupne,
    UseCoupne,
    DisableCoupen,
    GetAllCoupenCode
}


