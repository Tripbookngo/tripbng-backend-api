/** @format */

import jwt from 'jsonwebtoken';
import DMC from '../models/DMC.js';
import Package from '../models/Package.js';
import nodemailer from 'nodemailer';
import { errorMessage, successMessage } from '../middlewares/util.js';
import {EmailVerification} from '../models/EmailVerification.js';
import { AsnycHandler } from "../utils/AsnycHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const loginDMC = async (req, res) => {
	try {
		const username = req.body.username.toLowerCase();
		const dmcWithEmail = await DMC.findOne({
			email: username,
		});

		if (!dmcWithEmail) {
			const dmcWithMobile = await DMC.findOne({
				mobile: username,
			});
			if (!dmcWithMobile) {
				return res
					.status(400)
					.json(
						errorMessage('Account does not exists. Please register first.')
					);
			} else {
				if (!dmcWithMobile.adminApproved) {
					return res
						.status(400)
						.json(errorMessage('Account is currently under admin approval.'));
				}
				return res.status(200).json(successMessage('OTP Sent Successfully'));
			}
		} else {
			if (!dmcWithEmail.adminApproved) {
				return res
					.status(400)
					.json(errorMessage('Account is currently under admin approval.'));
			}
			var code = Math.floor(1000 + Math.random() * 9000);
			dmcWithEmail.code = code;
			await dmcWithEmail.save();

			var mailOptions = {
				from: process.env.EMAIL_USERNAME,
				to: username,
				subject: 'Verification Code - Tripbookngo',
				html: `
				  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
					<h2 style="text-align: center; color: #4CAF50;">Tripbookngo</h2>
					<p>Dear User,</p>
					<p>Thank you for logging in to Tripbookngo. Please use the verification code below to complete your login process:</p>
					<div style="text-align: center; margin: 20px 0;">
					  <span style="font-size: 24px; font-weight: bold; color: #4CAF50;">${code}</span>
					</div>
					<p>If you did not request this code, please ignore this email or contact our support team if you have concerns.</p>
					<p>Best regards,</p>
					<p><strong>Tripbookngo Team</strong></p>
					<hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
					<p style="font-size: 12px; color: #666;">If you have any questions, contact us at support@tripbookngo.com.</p>
				  </div>
				`,
			};

			let transport = nodemailer.createTransport({
				pool: true,
				host: 'smtp.gmail.com',
				port: 465,
				secure: true,
				auth: {
					user: process.env.EMAIL_USERNAME,
					pass: process.env.EMAIL_PASSWORD,
				},
				tls: {
					rejectUnauthorized: false,
				},
				maxConnections: 1,
				maxMessages: 10,
			});

			await transport.sendMail(mailOptions);
			return res.status(200).json(successMessage('OTP Sent Successfully'));
		}
	} catch (err) {
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};

const verifyOTP = async (req, res) => {
	try {
		const username = req.body.username.toLowerCase();
		const dmcWithEmail = await DMC.findOne({
			email: username,
		});

		if (!dmcWithEmail) {
			const dmcWithMobile = await DMC.findOne({
				mobile: username,
			});
			if (!dmcWithMobile) {
				return res
					.status(400)
					.json(
						errorMessage('Account does not exists. Please register first.')
					);
			} else {
				if (!dmcWithMobile.adminApproved) {
					return res
						.status(400)
						.json(errorMessage('Account is currently under admin approval.'));
				}
				if (dmcWithEmail.code !== '1234') {
					return res.status(400).json(errorMessage('Invalid code.'));
				}
				const token = jwt.sign(
					{ id: dmcWithMobile._id },
					process.env.JWT_SECRET
				);
				return res
					.status(200)
					.json(successMessage('OTP Verified', { token, data: dmcWithMobile }));
			}
		} else {
			if (!dmcWithEmail.adminApproved) {
				return res
					.status(400)
					.json(errorMessage('Account is currently under admin approval.'));
			}

			if (dmcWithEmail.code !== req.body.code) {
				return res.status(400).json(errorMessage('Invalid code.'));
			}

			const token = jwt.sign({ id: dmcWithEmail._id }, process.env.JWT_SECRET);
			return res
				.status(200)
				.json(successMessage('OTP Verified', { token, data: dmcWithEmail }));
		}
	} catch (err) {
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};

const sendVerificationEmail = async (req, res) => {
	try {
		var code = Math.floor(1000 + Math.random() * 9000);
		await EmailVerification.findOneAndDelete({ email: req.body.email });
		await EmailVerification.create({
			email: req.body.email,
			code: code,
		});

		var mailOptions = {
			from: process.env.EMAIL_USERNAME,
			to: req.body.email,
			subject: 'Verify Your Email - Tripbookngo',
			html: `
			  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
				<h2 style="text-align: center; color: #4CAF50; margin-bottom: 20px;">Welcome to Tripbookngo!</h2>
				<p style="font-size: 16px; color: #333;">Hi there,</p>
				<p style="font-size: 16px; color: #333;">Thank you for signing up with Tripbookngo. To complete your registration, please use the verification code below:</p>
				<div style="text-align: center; margin: 30px 0;">
				  <span style="font-size: 28px; font-weight: bold; color: #4CAF50; padding: 10px 20px; border: 1px solid #4CAF50; border-radius: 5px; display: inline-block;">${code}</span>
				</div>
				<p style="font-size: 16px; color: #333;">If you did not request this, please ignore this email or contact our support team.</p>
				<p style="font-size: 16px; color: #333; margin-bottom: 30px;">We’re here to help you make the most of your trips!</p>
				<p style="font-size: 16px; color: #333;">Cheers,</p>
				<p style="font-size: 16px; font-weight: bold; color: #4CAF50;">The Tripbookngo Team</p>
				<hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
				<p style="font-size: 14px; color: #666;">Need help? Contact us at <a href="mailto:support@tripbookngo.com" style="color: #4CAF50; text-decoration: none;">support@tripbookngo.com</a></p>
			  </div>
			`,
		};

		let transport = nodemailer.createTransport({
			pool: true,
			host: 'smtp.gmail.com',
			port: 465,
			secure: true,
			auth: {
				user: process.env.EMAIL_USERNAME,
				pass: process.env.EMAIL_PASSWORD,
			},
			tls: {
				rejectUnauthorized: false,
			},
			maxConnections: 1,
			maxMessages: 10,
		});

		await transport.sendMail(mailOptions);

		return res.status(200).json(successMessage('Send Successfully'));
	} catch (err) {
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};

const verifyEmail = async (req, res) => {
	try {
		const email = req.body.email.toLowerCase();
		const data = await EmailVerification.findOne({
			email: email,
			code: req.body.code,
		});
		if (!data) {
			return res
				.status(400)
				.json(errorMessage('Invalid OTP, Request a new one.'));
		}

		return res.status(200).json(successMessage('Verified Successfully'));
	} catch (err) {
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};

const registerDMC = async (req, res) => {
	try {
		req.body.email = req.body.email.toLowerCase();
		const data = await DMC.create(req.body);
		return res
			.status(200)
			.json(successMessage('Registered Successfully', data));
	} catch (err) {
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};

const createPackage = AsnycHandler(async (req, res) => {
    try {
        const {
            name, destination, fromCity, toCity, departureDate, returnDate, duration, currency, theme,
            isFixedDeparture, pricing, hotels, activities, transfers, itinerary, inclusions, exclusions
        } = req.body;

        // Convert stringified JSON objects to actual arrays
        // const pricingArray = JSON.parse(pricing);
        // const hotelsArray = JSON.parse(hotels);
        // const activitiesArray = JSON.parse(activities);
        // const transfersArray = JSON.parse(transfers);
        // const itineraryArray = JSON.parse(itinerary);
        // const inclusionsArray = JSON.parse(inclusions);
        // const exclusionsArray = JSON.parse(exclusions);

        // Handle uploaded images
        const coverImages = req.files ? req.files.map(file => file.path) : [];

        const newPackage = new Package({
            name,
            destination,
            fromCity,
            toCity,
            departureDate,
            returnDate,
            duration,
            currency,
            theme,
            isFixedDeparture,
            pricing,
            hotels,
            activities,
            transfers,
            itinerary,
            inclusions,
            exclusions,
            coverImages: coverImages || ['example.png']
        });

        await newPackage.save();

        return res.status(201).json(new ApiResponse(201, { success: true, data: newPackage }, "Package created successfully"));

    } catch (error) {
        console.error("Error creating package:", error);
        return res.status(500).json(new ApiResponse(500, { success: false, error: error.message }, "Internal Server Error"));
    }
});

const updatePackage = async (req, res) => {
	try {
		const data = await Package.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		});

		return res.status(200).json(successMessage('Updated Successfully', data));
	} catch (err) {
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};

const getPackageById = async (req, res) => {
	try {
		const data = await Package.findById(req.params.id);

		return res.status(200).json(successMessage('Updated Successfully', data));
	} catch (err) {
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};

const getPackages = async (req, res) => {
	try {
		const data = await Package.find({});

		return res.status(200).json(successMessage('Fetched Successfully', data));
	} catch (err) {
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};

export default {
	loginDMC,
	verifyOTP,
	sendVerificationEmail,
	verifyEmail,
	registerDMC,
	createPackage,
	updatePackage,
	getPackages,
	getPackageById,
};
