//All About The Admin Controller
import { asyncHandler } from "../../utils/asyncHandler.js"
import { ApiResponse } from "../../utils/ApiResponse.js"
import { Admin } from "../../models/Admin.js";
import { SubAdmin } from "../../models/SubAdmin.models.js";
import { isNull } from "../../utils/formCheck.js";
import { generateOTP } from "../../utils/generateOtp.js"
import { sendMail } from "../../utils/sendMail.js"
import { EmailVerification } from "../../models/EmailVerification.js";
import Users from "../../models/Users.js";
import { Cp } from "../../models/Agent_Cp/Cp.models.js";
import { Agent } from "../../models/Agent_Cp/Agent.models.js";
import {flightbookingdata}  from "../../models/FlightBooking.model.js"
import {BusBooking} from "../../models/BusBooking.models.js"
import {Tempvisas} from  "../../models/TempVisa.js"
import {TempTravel} from "../../models/TempTrav.js"
import { LoginDetails } from "../../models/LoginDetails.models.js"
import { ApiFlight } from "../../models/ApiFlights.models.js";

const options = {
    httpOnly: true,
    secure: true
};

//Ignore This, This is for just Test
const CreateSuperAdmin = asyncHandler(async (req, res) => {

   
    const { companyName, username, email, mobile, pincode, address, password } = req.body;
    console.log(companyName, username, email, mobile, pincode, address, password)
    const admin = await Admin.create(
        {
            companyName,
            username,
            email,
            mobile,
            pincode,
            address,
            password
        }
    )
    console.log(admin)
    return res.status(200)
        .json(
            new ApiResponse(200, { admin }, "Admin Create SuccessFully")
        )

})

const LoginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email) {
        return res.status(400)
            .json(
                new ApiResponse(400, { success: false, data: "Please Enter the username" }, "Please Enter The userId")
            )
    }

    if (!password) {
        return res.status(400)
            .json(
                new ApiResponse(400, { success: false, data: "Please Enter The password" }, "Please Enter the password")
            )
    }

    const user = await Admin.findOne({ email })

    if (!user) {
        return res.status(400)
            .json(
                new ApiResponse(400, { success: false, data: "User is not Found" }, "User Is not found")
            )
    }

    const isPasswordCorrect = await user.PassCompare(password);

    if (!isPasswordCorrect) {
        return res.status(400)
            .json(
                new ApiResponse(400, { success: false }, "Please Enter Correct Password")
            )
    }



    const otp = generateOTP();
    await sendMail(user.email, "Validation otp", `your otp is ${otp}`)

    await EmailVerification.create({
        email: user.email,
        code: otp,
    })



    return res.status(200)
        .json(
            new ApiResponse(200, { sucess: true }, "Opt is Sent on your email")
        )


})

const veryfyOTPLogin = asyncHandler(async (req, res) => {
    const { email, code } = req.body;

    if (isNull([email, code])) {
        return res.status(400)
            .json(
                new ApiResponse(400, { success: false, data: "Please Enter the All fields" }, "Please fill the all fields")
            )
    }
    const isOtpCorrect = await EmailVerification.findOne(
        {
            $and: [{ email, code }]
        }
    )
    if (!isOtpCorrect) {
        return res.status(400)
            .json(
                new ApiResponse(400, { sucess: false }, "Please Enter Correct OTP")
            )
    }

    const user = await Admin.findOne({ email })
    if (!user) {
        return res.status(400)
            .json(new ApiResponse(400, { status: false }, "Something went wrong while fetching account"))
    }
    const AccessTocken = user.GenrateAccessTocken();

    if (!AccessTocken) {
        return res.status(500)
            .json(
                new ApiResponse(500, { status: false }, "Something Went wrong while generating AccessTocken")
            )
    }
    const LoginUser = {
        username: user.username,
        cname: user.companyName,
        email: user.email,
        phoneNo: user.mobile
    }
    if (!LoginUser) {
        return res.status(400)
            .json(
                new ApiResponse(400, { success: false, data: "Something went wrong while fetching LoginUser" })
            )
    }

    const delteEmail = await EmailVerification.findByIdAndDelete(isOtpCorrect._id)

    if (!delteEmail) {
        return res.status(400)
            .json(400, { success: false }, "something while wrong When check the otp")
    }


    return res.status(200)
        .cookie("AccessToken", AccessTocken, options)
        .json(
            new ApiResponse(200, { sucess: true, data: {LoginUser,AccessTocken} }, "Otp is Correct")
        )
})

const CreateSubAdmin = asyncHandler(async (req, res) => {
    const { username, email, password, role } = req.body;

    if (isNull([username, email, password, role])) {
        return res.status(400)
            .json(new ApiResponse(400, { success: false }, "Please Enter All Feilds"))
    }

    const isUserNameExist = await SubAdmin.findOne({ username });

    if (isUserNameExist) {
        return res.status(400)
            .json(
                new ApiResponse(400, { success: false }, "Please Choose Other Username This Username is already exist")
            )
    }

    if (!email.includes('@')) {
        return res.status(400)
            .json(
                new ApiResponse(400, { success: false }, "Please Enter Correct Email")
            )
    }

    const CreateUser = await SubAdmin.create(
        {
            username,
            email,
            password,
            role
        }
    )

    if (!CreateUser) {
        return res.status(500)
            .json(
                new ApiResponse(500, { sucess: false }, "something went Wrong While Creating Account")
            )
    }


    const user = {
        username,
        email,
        role
    }

    if (!user) {
        return res.status(400)
            .json(
                new ApiResponse(400, { success: false, data: "Something went wrong while load data" }, "Something went wrong while load data")
            )
    }


    return res.status(200)
        .json(
            new ApiResponse(200, { success: true, data: user }, `Created User for ${role}`)
        )
})

const GetAdminProflile = asyncHandler(async(req,res)=>{
    return res.status(200)
    .json(
        new ApiResponse(200,{success:true , data:req.user},"data fetch successfully")
    )
})

const ChangePassword = asyncHandler(async (req, res) => {
    const { CurrectPass, NewPass } = req.body;
    const user = req.user;

    const PassChangeuser = await Admin.findById(user._id)
    console.log(CurrectPass, NewPass)
    const isCurrentIsCorrect = await PassChangeuser.PassCompare(CurrectPass);
    console.log("Code arrave here 2")
    if (!isCurrentIsCorrect) {
        return res.status(400)
            .json(
                new ApiResponse(400, { success: false }, "Please Enter Correct Current Password")
            )
    }

    if (CurrectPass === NewPass) {
        return res.status(400)
            .json(
                new ApiResponse(400, { success: false }, "Your Currect And New Password is same")
            )
    }

    user.password = NewPass;
    console.log(user.password)
    await user.save()

    return res.status(200)
        .json(
            new ApiResponse(200, { sucess: true }, "password is change")
        )
})

const AdminLogout = asyncHandler(async (req, res) => {
    const user = req.user;

    return res.status(200)
        .clearCookie("AccessToken", options)
        .json(new ApiResponse(200, { user }, "Logout Successfully"))
})

const ForgetPassword = asyncHandler(async (req, res) => {
    const user = req.user;
    const usermail = req.body;

    if (!user) {
        if (!usermail) {
            return res.status(400)
                .json(
                    new ApiResponse(400, { success: false, data: "Please Enter Your mail" }, "Please Enter your mail")
                )
        }
        const code = generateOTP();
        await sendMail(usermail, "Validation otp", `your otp is ${code}`);
        await EmailVerification.create({
            email: usermail,
            code: code
        })
        return res.status(200)
            .json(new ApiResponse(200, { success: true }, "veryfication otp is sent on your register email"))
    }
    const code = generateOTP();
    await sendMail(user.email, "Validation otp", `your otp is ${code}`);
    await EmailVerification.create({
        email: user.email,
        code: code
    })
    return res.status(200)
        .json(new ApiResponse(200, { success: true }, "veryfication otp is sent on your register email"))

})


const ChangeForgetPassword = asyncHandler(async (req, res) => {
    const { code, newPassword, email } = req.body; //email send when user is not loggin
    if (!code) {
        return res.status(400).json(new ApiResponse(400, { success: false }, "OTP is required"))
    }
    if (!newPassword) {
        return res.status(400)
            .json(
                new ApiResponse(400, { success: false }, "Please Enter The password")
            )
    }


    const user = req.user;
    if (!user) {
        if (!email) {
            return res.status(400)
                .json(
                    new ApiResponse(400, { success: false, data: "Please Enter Your mail" }, "Please Enter Your mail")
                )
        }
        const otpRecord = await EmailVerification.findOne({ email: email, code: code });

        if (!otpRecord) {
            return res.status(400).json(new ApiResponse(400, { success: false }, "Invalid or expired OTP"));
        }
        const ChangePassUser = await Admin.findOne({ email })
        if (!ChangePassUser) {
            return res.status(400)
                .json(
                    new ApiResponse(400, { success: false, data: "Something problem while fetching data" }, "Something Problem while fetching data")
                )
        }
        ChangePassUser.password = newPassword;
        await ChangePassUser.save();


        return res.status(200)
            .json(
                new ApiResponse(200, { success: true }, "Your Password is SuccessFully Change")
            )

    }
    const otpRecord = await EmailVerification.findOne({ email: user.email, code: code });

    if (!otpRecord) {
        return res.status(400).json(new ApiResponse(400, { success: false }, "Invalid or expired OTP"));
    }


    const ChangePassUser = await Admin.findById(user._id)

    if (!ChangePassUser) {
        return res.status(400)
            .json(
                new ApiResponse(400, { success: false, data: "Something problem while fetching data" }, "Something Problem while fetching data")
            )
    }
    ChangePassUser.password = newPassword;
    await ChangePassUser.save();


    return res.status(200)
        .json(
            new ApiResponse(200, { success: true }, "Your Password is SuccessFully Change")
        )


})

const GetOtpOfLogoutPasswordForget = asyncHandler(async(req,res)=>{
    const {email} = req.body;
    if(!email)
    {
        return res.status(200)
        .json(
            new ApiResponse(400,{success:false , data:"Please Enter the email"},"Please Enter the Email")
        )
    }
    const isUserExist = await Admin.findOne({email});
    if(!isUserExist)
    {
        return res.status(400)
        .json(
            new ApiResponse(400,{success:"user is not exist"},"user is not exist")
        )
    }
    let otp = generateOTP();
    const SaveOtp = await EmailVerification.create({email , code:otp});
    if(!SaveOtp)
    {
        return res.status(400)
        .json(
            new ApiResponse(400,{success:false , data:"Something While Wrong into the Database"},"Something while wrong into the database")
        )
    }

    await sendMail(email,"verification otp",`your otp is ${otp}`);

    return res.status(200)
    .json(
        new ApiResponse(200,{success:true , data:"otp is send successfully"},"otp is send successully")
    )
})

const VeriFyLogOutOtpAndChangePassword = asyncHandler(async(req,res)=>{
    const {otp , email , newPassword} = req.body;
    if(isNull([otp , email , newPassword])){
        return res.status(400)
        .json(
            new ApiResponse(400,{success:false , data:"please enter all the feilds"},"please Enter all the feilds")
            
        )
    }

    const verifyOtp = await EmailVerification.findOne({email , code:otp});
    if(!verifyOtp)
    {
        return res.status(400)
        .json(
            new ApiResponse(400,{success:false , data:"please enter the correct otp"},"please enter the correct otp")
        )
    }
    const user = await Admin.findOne({email});
    user.password = newPassword;
    await user.save()

    return res.status(200)
    .json(
        new ApiResponse(200,{success:true , data:"password is updated"},"password is updated")
    )

})

//Dashboard controller

const GetAllUser = asyncHandler(async (req, res) => {

    const AllUsers = await Users.find({})
    res.status(200)
        .json(
            new ApiResponse(200, { success: true, data: AllUsers }, "Fetched All User")
        )

})


const GetAllAgents = asyncHandler(async (req, res) => {

    const UnAproveAgents = await Agent.find({ aprove: false }) || null
    const AproveAgents = await Agent.find({ aprove: true }) || null

    return res.status(200)
        .json(
            new ApiResponse(200, {
                success: true, data: {
                    UnAproveAgents,
                    AproveAgents
                }
            }, "Data Fetch SuccessFully")
        )


})

const GiveAgentAprove = asyncHandler(async (req, res) => {
    const { _id } = req.body;
    const user = req.user;

    if (user.Usertype != "Admin") {
        return res.status(400)
            .json(new ApiResponse(400, { success: false, data: "You Can't Aprove This request , you are not Admin" }, "you Can't Aprove This Request Your are not Admin"))
    }
    if (!_id) {
        return res.status(400)
            .json(new ApiResponse(400, { success: false }, "Id is not Geted"))
    }

    const AgentUser = await Agent.findById(_id)
    if (!AgentUser) {
        return res.status(400)
            .json(
                new ApiResponse(400, { success: false }, "Id is wrong")
            )
    }

    AgentUser.aprove = true;
    await AgentUser.save()
    const otp = generateOTP();
    await sendMail(AgentUser.email, "Aprove Success", "Congrts Admin Aprove Your Request")

    return res.status(200)
        .json(
            new ApiResponse(200, { success: true }, "Give Aprove")
        )

})

const GetAllCp = asyncHandler(async (req, res) => {

    const UnAproveCp = await Cp.find({ aprove: false }) || null
    const AproveCp = await Cp.find({ aprove: true }) || null

    return res.status(200)
        .json(
            new ApiResponse(200, {
                success: true, data: {
                    UnAproveCp,
                    AproveCp
                }
            }, "Data Fetch SuccessFully")
        )


})

const GiveCpAprove = asyncHandler(async (req, res) => {
    const { _id } = req.body;
    const user = req.user;

    if (user.Usertype != "Admin") {
        return res.status(400)
            .json(new ApiResponse(400, { success: false, data: "You Can't Aprove This request , you are not Admin" }, "you Can't Aprove This Request Your are not Admin"))
    }
    if (!_id) {
        return res.status(400)
            .json(new ApiResponse(400, { success: false }, "Id is not Geted"))
    }

    const CpUser = await Agent.findById(_id)
    if (!CpUser) {
        return res.status(400)
            .json(
                new ApiResponse(400, { success: false }, "Id is wrong")
            )
    }

    CpUser.aprove = true;
    await CpUser.save()
    await sendMail(CpUser.email, "Aprove Success", "Congrts Admin Aprove Your Request")

    return res.status(200)
        .json(
            new ApiResponse(200, { success: true }, "Congrts Your Request Aprove From the Admin")
        )

})

const BlockCp = asyncHandler(async(req,res)=>{
    const id =  req.parms.id;

    const BlockCp = await Cp.findByIdAndDelete({_id:id});
    if(!BlockCp)
    {
        return res.status(400)
        .json(
            new ApiResponse(400  , {success:false , data:"Please send correct id"} , "Please Send Correct Id")
        )
    }
    return res.status(200)
    .json(
        new ApiResponse(200,{success:true , data:"User is Deleted"} , "User is Deleted")
    )
    
    
})

const BlockAgent = asyncHandler(async(req,res)=>{
    const id =  req.parms.id;

    const BlockedAgent = await Agent.findByIdAndDelete({_id:id});
    if(!BlockedAgent)
    {
        return res.status(400)
        .json(
            new ApiResponse(400  , {success:false , data:"Please send correct id"} , "Please Send Correct Id")
        )
    }
    return res.status(200)
    .json(
        new ApiResponse(200,{success:true , data:"User is Deleted"} , "User is Deleted")
    )
})

const inActiveCp = asyncHandler(async(req,res)=>{
    const id =  req.parms.id;

    if(!id)
    {
        return res.status(400)
        .json(
            new ApiResponse(400 ,{success:false , data:"Please Enter the Id"},"Please enter the Id")
        )
    }

    const findCp =  await  Cp.findById(id);

    if(!findCp){
        return res.status(400)
        .json(
            new ApiResponse(400 ,{success:false , data:"Cp is not found"} , "Cp is not found")
        )
    }

     findCp.aprove = false;
     await findCp.save();

     return res.status(200)
     .json(
        new ApiResponse(200,{success:true , data:"we block the Cp"} , "we block the cp")
     )


})

const inActiveAgent = asyncHandler(async(req,res)=>{
    const id =  req.parms.id;

    if(!id)
    {
        return res.status(400)
        .json(
            new ApiResponse(400 ,{success:false , data:"Please Enter the Id"},"Please enter the Id")
        )
    }

    const findAgent =  await  Agent.findById(id);

    if(!findAgent){
        return res.status(400)
        .json(
            new ApiResponse(400 ,{success:false , data:"Cp is not found"} , "Cp is not found")
        )
    }

    findAgent.aprove = false;
     await findAgent.save();

     return res.status(200)
     .json(
        new ApiResponse(200,{success:true , data:"we block the Cp"} , "we block the cp")
     )
     

})

const GetAllBookedFlights = asyncHandler(async(req,res)=>{

    const allBooking = await flightbookingdata.find({});
    if(allBooking.length <1)
    {
        return res.status(200)
        .json(
            new ApiResponse(200,{success:true ,data:"not found any flight book"},"not found any flight book")
        )
    }
    return res.status(200)
    .json(
        new ApiResponse(200 ,{success:true , data:allBooking},"fetch all data")
    )

})

const GetAllBusBooking = asyncHandler(async(req,res)=>{
    const allBooking = await BusBooking.find({});
    if(allBooking.length <1)
    {
        return res.status(200)
        .json(
            new ApiResponse(200,{success:true , data:"not any bus booking found"},"not any bus booking found")
        )
    }

    return res.status(200)
    .json(
        new ApiResponse(200,{success:true , data:allBooking} , "all bus booking data fetch")
    )

})

const GetAllVisaQuery = asyncHandler(async(req,res)=>{
    const allVisaQuery = await Tempvisas.find({});

    if(allVisaQuery.length <=0)
    {
        return res.status(200)
        .json(
            new ApiResponse(200, {success:true , data:"not any record found"},"not any record found")
        )
    }
    return res.status(200)
    .json(
        new ApiResponse(200,{success:true , data:allVisaQuery},"data fetched")
    )
})

const GetAllTravQuery = asyncHandler(async(req,res)=>{
    const allTravQuery = await TempTravel.find({});

    if(allTravQuery.length <=0)
    {
        return res.status(200)
        .json(
            new ApiResponse(200, {success:true , data:"not any record found"},"not any record found")
        )
    }
    return res.status(200)
    .json(
        new ApiResponse(200,{success:true , data:allTravQuery},"data fetched")
    )
})


const GetAllSubAdmin = asyncHandler(async(req,res)=>{
    const allSubAdmins = await SubAdmin.find({});
    if(allSubAdmins.length <1)
    {
        return res.status(200)
        .json(
            new ApiResponse(200,{success:true , data:"not found any subadmin"},"not found any subadmin")
        )
    }
    return res.status(200)
    .json(
        new ApiResponse(200,{success:true , data:allSubAdmins},"Data fetch successfully")
    )
})

const DeleteSubAdmin = asyncHandler(async(req,res)=>{
    const {id} = req.body;
    if(!id)
    {
        return res.status(400)
        .json(
            new ApiResponse(400,{success:false , data:"Please Enter All the Id"},"Please Enter the Id")
        )
    }

    const Subadminuser = await SubAdmin.findByIdAndDelete(id);
    
    if(!Subadminuser)
    {
        return res.status(400)
        .json(
            new ApiResponse(400,{success:false , data:"Subadmin of this Id is not exists"},"Subadmin ozf this Id is not exists")
        )
    }
    return res.status(200)
    .json(
        new ApiResponse(200,{success:true , data:"SubAdmin is delete successfully"},"Subadmin is delete successfully")
    )
})

const GetLoginIpDetails = asyncHandler(async(req,res)=>{
    const loginIps = await LoginDetails.find({});
    if(loginIps.length == 0)
    {
        return res.status(200)
        .json(
            new ApiResponse(200,{success:false , data:"not any user login data found"},"not any user login data is found")
        )
    }

    return res.status(200)
    .json(
        new ApiResponse(200,{success:true , data:loginIps},"all data fetch successfully")
    )
})

const CreateApiFlights = asyncHandler(async(req,res)=>{
    const {apiname ,apiid,apifavour,status} = req.body;

    const createobject = await ApiFlight.create({apiname ,apiid , apifavour , status});
    if(!createobject)
    {
        return res.status(500)
        .json(
            new ApiResponse(500,{success:false ,data:"Something error while creating object"} ,"something error while creating object")
        )
    }

    return res.status(200)
    .json(
        new ApiResponse(201 , {success:true , data:createobject},"object created successfully")
    )

})

const UpdateApiFlight = asyncHandler(async(req,res)=>{
    const {id , changes} = req.body;

    if(!id || !changes){
        return res.status(400)
        .json(
            new ApiResponse(400,{success:false , data:"please enter all things"},"please enter all the things")
        )
    }

    const findobject = await ApiFlight.findByIdAndUpdate(id,changes);
    if(!findobject)

        {
            return res.status(400)
            .json(
                new ApiResponse(400,{success:false , data:"can't find given object"},"can't find given object")
            )
        }
    
    return res.status(200)
        .json(
            new ApiResponse(200,{success:true , data:findobject},"object update successfully")
        )
})

const DeleteApiFlight = asyncHandler(async(req,res)=>{
    const {id} = req.body;
    if(!id)
    {
        return res.status(400)
        .json(
            new ApiResponse(400,{success:false , data:"please enter the id"},"please enter the id")
        )
    }

    const deleteobject = await ApiFlight.findByIdAndDelete(id);

    if(!deleteobject)
    {
        return res.status(400)
        .json(
            new ApiResponse(400,{success:false , data:"something problem while the deleting object"},"something problem while the deleting object")
        )
    }

    return res.status(200)
    .json(
        new ApiResponse(201 , {success:true , data:deleteobject},"object create successfully")
    )
})

const GetAllApiFlight = asyncHandler(async(req,res)=>{

    const AllApiFlight = await ApiFlight.find({})

    return res.status(200)
    .json(
        new ApiResponse(201,{success:true , data:AllApiFlight},"fetch all ApiFlight Data")
    )

})

export {
    CreateSuperAdmin,
    LoginAdmin,
    CreateSubAdmin,
    ChangePassword,
    AdminLogout,
    veryfyOTPLogin,
    ForgetPassword,
    ChangeForgetPassword,
    GetAllUser,
    GetAllAgents,
    GiveAgentAprove,
    GetAllCp,
    GiveCpAprove,
    BlockAgent,
    BlockCp,
    inActiveAgent,
    inActiveCp,
    GetAllBookedFlights,
    GetAllBusBooking,
    GetAllTravQuery,
    GetAllVisaQuery,
    GetAdminProflile,
    GetAllSubAdmin,
    DeleteSubAdmin,
    GetOtpOfLogoutPasswordForget,
    VeriFyLogOutOtpAndChangePassword,
    GetLoginIpDetails,
    CreateApiFlights,
    UpdateApiFlight,
    DeleteApiFlight,
    GetAllApiFlight

}