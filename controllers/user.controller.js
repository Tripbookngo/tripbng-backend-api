/** @format */
import { errorMessage, successMessage } from '../middlewares/util.js';
import Payment from '../models/Payment.js';
import TempPayment from '../models/TempPayment.js';
import Users from '../models/Users.js';
import PayU from 'payu-sdk-node-index-fixed';
import dotenv from 'dotenv';
import Visa from '../models/Visa.js';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import s3Client from '../middlewares/s3Client.js';
import Countries from '../models/Countries.js';
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { BusBooking } from "../models/BusBooking.models.js"
import { flightbookingdata } from "../models/FlightBooking.model.js"
import { Tempvisas } from '../models/TempVisa.js';
import crypto from 'crypto'
import { Transaction } from "../models/Transaction.models.js";
import mongoose from 'mongoose';

dotenv.config();

const getProfile = async (req, res) => {
	try {
		console.log(req.user)
		
		return res.status(200).json(successMessage('Fetched Successfuly!', req.user));
	} catch (err) {
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};

const updateProfile = async (req, res) => {
	try {
		await Users.findByIdAndUpdate(req.user, req.body);

		return res.status(200).json(successMessage('Updated Successfuly!'));
	} catch (err) {
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};



const payUPayment = async (req, res) => {
	try {
		const { amount, name, email, phone, category } = req.body;
		req.body.user = req.user;

		// Store the payment in the database
		const payTxn = await TempPayment.create(req.body);

		const productInfoMap = {
			flight: 'Flight Ticket',
			bus: 'Bus Ticket',
			hotel: 'Hotel Booking',
			holidays: 'Holiday Package',
		};

		const productInfo = productInfoMap[category] || 'Travel Service';

		// PayU key and salt
		const key = process.env.PAYU_KEY;
		const salt = process.env.PAYU_SALT;

		// ✅ Correct hash generation following PayU documentation
		const hashString = `${key}|${payTxn._id}|${amount}|${productInfo}|${name}|${email}|||||||||||${salt}`;
		const hash = crypto.createHash('sha512').update(hashString).digest('hex');

		// Payment data for PayU
		const data = {
			key,
			txnid: payTxn._id.toString(),
			amount: amount.toString(),
			firstname: name,
			email: email,
			phone: phone,
			productinfo: productInfo,
			surl: `${process.env.BackendUrl}/orders/success?txnid=${payTxn._id}`,
			furl: `${process.env.BackendUrl}/orders/failure?txnid=${payTxn._id}`,
			hash,
		};

		return res.status(200).json(successMessage('Payment Initiated!', data));
	} catch (err) {
		return res.status(500).json(errorMessage(err?.message || 'Something went wrong'));
	}
};
const payUsuccess = async (req, res) => {
	try {
		const { txnid, status, amount } = req.query;

		// Validate the payment exists
		const paytxn = await TempPayment.findById(txnid);
		if (!paytxn) {
			return res.redirect(`${process.env.FrontendUrl}/payment-failed`);
		}

		// Ensure status is "success"
		if (status !== 'success') {
			return res.redirect(`${process.env.FrontendUrl}/payment-failed`);
		}

		// Store successful payment
		await Payment.create({ ...paytxn, status: 'Paid', paidAmount: amount });

		// Update booking status based on category
		const updateStatusMap = {
			flight: FlightBooking,
			bus: BusBooking,
			hotel: HotelBooking,
			holidays: HolidayPackage,
		};

		const Model = updateStatusMap[paytxn.category];

		if (!Model) {
			throw new Error('Invalid category: Unable to update booking status');
		}

		await Model.findByIdAndUpdate(paytxn.bookingId, { $set: { status: 'Paid' } });

		return res.redirect(`${process.env.FrontendUrl}/payment-success`);
	} catch (err) {
		return res.status(500).json(errorMessage(err?.message || 'Something went wrong'));
	}
};


const AllCountries = async (req, res) => {
	try {
		const data = await Countries.find();
		return res.status(200).json(successMessage('Fetched Successfully', data));
	} catch (err) {
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};

const UserVisaBookings = async (req, res) => {
	try {
		const data = await Visa.find({ user: req.user });
		return res.status(200).json(successMessage('Fetched Successfully', data));
	} catch (err) {
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};

const VisaBookingById = async (req, res) => {
	try {
		const data = await Visa.findById(req.params.id);
		return res.status(200).json(successMessage('Fetched Successfully', data));
	} catch (err) {
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};

const UploadVisaFile = async (req, res) => {
	try {
		if (req.file) {
			const uploadParams = {
				Bucket: process.env.AWS_S3_BUCKET_NAME,
				Key: `user/visa/${Date.now()}-${req.file.originalname}`,
				Body: req.file.buffer,
			};

			await s3Client.send(new PutObjectCommand(uploadParams));
			const unsignedUrl = `https://${uploadParams.Bucket}.s3.amazonaws.com/${uploadParams.Key}`;

			return res
				.status(200)
				.json(successMessage('Upload Successfully', { data: unsignedUrl }));
		} else {
			return res.status(400).json(errorMessage('File is mising.'));
		}
	} catch (err) {
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};

const getPreSignedUrl = async (req, res) => {
	try {
		const { unsignedUrl } = req.body;

		const bucketName = unsignedUrl
			.split('.s3.amazonaws.com/')[0]
			.split('https://')[1];
		const objectKey = unsignedUrl.split('.s3.amazonaws.com/')[1];

		if (!unsignedUrl || !bucketName || !objectKey) {
			return res.status(400).send('Invalid unsigned URL');
		}

		const getObjectCommand = new GetObjectCommand({
			Bucket: bucketName,
			Key: objectKey,
		});
		const getObjUrl = await getSignedUrl(s3Client, getObjectCommand);
		return res.send({ publicUrl: getObjUrl });
	} catch (err) {
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};

const visaBooking = async (req, res) => {
	try {
		req.body.user = req.user;
		const data = await Visa.create(req.body);
		return res.status(200).json(successMessage('Saved Successfully', data));
	} catch (err) {
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};

const UpdateVisaBooking = async (req, res) => {
	try {
		const data = await Visa.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		});
		return res.status(200).json(successMessage('Updated Successfully', data));
	} catch (err) {
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};

const DeleteVisaBooking = async (req, res) => {
	try {
		await Visa.findByIdAndDelete(req.params.id);
		return res.status(200).json(successMessage('Deleted Successfully'));
	} catch (err) {
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};

const GetDeleteAccoutLink = asyncHandler(async (req, res) => {
	const { username, password } = req.body;
	if (!username) {
		return res.status(400)
			.json(
				new ApiResponse(400, { success: false, data: "Please Enter Username" }, "please Enter username ")
			)
	}
	if (!password) {
		return res.status(400)
			.json(
				new ApiResponse(400, { success: false, data: "Please Enter the password" }, "Please Enter the password")
			)
	}
})

const GetBusBookingHistory = asyncHandler(async (req, res) => {
	const user = req.user;

	const DataOfBusBooking = await BusBooking.findOne({ email: user.email });

	if (!DataOfBusBooking) {
		return res.status(200)
			.json(
				new ApiResponse(200, { success: false, data: "User not book any bus tickit" }, "user not book any bus tickit")
			)
	}

	return res.status(200)
		.json(
			new ApiResponse(200, { sucess: true, data: DataOfBusBooking }, "Fetch Data Successfully")
		)
})

const GetFlightBookingHistroy = asyncHandler(async (req, res) => {
	const user = req.user;

	const flightbookingdatahistroy = await flightbookingdata.find({ UserId: req.user._id })
	if (flightbookingdatahistroy.length == 0) {
		return res.status(200)
			.json(
				new ApiResponse(200, { success: true, data: "use not book any flight tickit" }, "User not book any flight ")
			)
	}


	return res.status(200)
		.json(
			new ApiResponse(200, { success: true, data: flightbookingdatahistroy }, "flight booking data fetch successfuly")
		)

})

const VisaQuiryGenrate = asyncHandler(async(req,res)=>{
	const data = req.body;
	const SaveData = await Tempvisas.create(data)
	if(!SaveData)
	{
		return res.status(400)
		.json(
			new ApiResponse(400,{success:false ,data:"Please Enter the Hole data"},"hmm")
		)
	}
	console.log(req.user)
	return res.status(200)
	.json(
		new ApiResponse(200,{success:true ,data:{username:req.user.name||null , mobile:req.user.mobile ,email:req.user.email || null, ...data}},"Your visa request has been send successfully!")
	)
})

const GetVolateBalance = asyncHandler(async(req,res)=>{
	return res.status(200)
	.json(
		new ApiResponse(200,{success:true , data:req.user.volate},`Your volate amount is ${req.user.volate}`)
	)
})

const AddVolate = asyncHandler(async(req,res)=>{
	try {     
		const { amount } = req.body;  
		
		if (!amount || isNaN(Number(amount))) {
			return res.status(400).json(new ApiResponse(400, { success: false }, "Invalid amount"));
		}
	
	
		const user = req.user;  
		user.volate = (user.volate || 0) + Number(amount);  
		
		console.log(user.volate);  
	
		await user.save();  
	
		return res.status(200).json(
			new ApiResponse(200, { success: true, data: user.volate }, `Your total amount is ${user.volate}`)
		);  
	} catch (error) {     
		return res.status(400).json(
			new ApiResponse(400, { success: false, data: error.message || error }, "Something went wrong")
		);  
	}
	
})

const WithdrawVolate = asyncHandler(async(req,res)=>{
	const {amount} = req.body;
	const user_amount = req.user.volate;
	if(amount>user_amount)
		{
			return res.status(200)
			.json(
				new ApiResponse(200,{success:false , data:"Your Balance is not inuf"},"Your Balance is not inuf")
			)
		} 
	const user = req.user;
	user.volate -= amount;
	user.save();

	return res.status(200)
	.json(
		new ApiResponse(200,{success:false , data:`successfully withdraw! now your balance is ${user.volate}`},`successfully withdraw! now your balance is ${user.volate}`)
	)
})

const GetAllTrasactions = asyncHandler(async(req,res)=>{
	
	const trans = await Transaction.find({user_id:req.user._id})
 
	return res.status(200)
	.json(
		new ApiResponse(200,{success:true , data:trans},"data fetch successfully")
	)
})
export default {
	getProfile,
	updateProfile,
	payUPayment,
	payUsuccess,
	AllCountries,
	visaBooking,
	UserVisaBookings,
	VisaBookingById,
	UpdateVisaBooking,
	DeleteVisaBooking,
	UploadVisaFile,
	getPreSignedUrl,
	VisaQuiryGenrate,
	AddVolate,
	WithdrawVolate,
	GetAllTrasactions,
	GetFlightBookingHistroy
};

//BBB7CEQJ
//6AERP7JV