import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { PayData } from "./pay.config.js"
import { Transaction } from "../../models/Transaction.models.js";
import crypto from "crypto"


const payUsuccess = asyncHandler(async (req, res) => {

    const verified_Data = await PayData.payuClient.verifyPayment(req.params.txnid);


    // Check if transaction_details exists and txnid is found
    if (
        verified_Data.status !== 1 ||
        !verified_Data.transaction_details ||
        !verified_Data.transaction_details[req.params.txnid]
    ) {
        return res.status(400).json(
            new ApiResponse(400, null, "Payment verification failed or transaction not found")
        );
    }

    const data = verified_Data.transaction_details[req.params.txnid];

    const isTxnExist = await Transaction.findOne({ txn_id: req.params.txnid });
    req.user.volate += parseFloat(data.amt)
    
    if (!isTxnExist) {
        const for_payment = data.productinfo.replaceAll("quot", "").replaceAll("type", "").replaceAll(" ", "").replaceAll("  ", "").replaceAll("   ", "")
        await Transaction.create({
            user_id: req.user._id,
            txn_id: req.params.txnid,
            for: for_payment,
            status: data.status
        });
        if (for_payment == "userwallet") {
            req.user.volate += parseFloat(data.amt)
            req.user.save();
        }

    }

    res.status(200).json(
        new ApiResponse(200, { success: true, data }, "Payment is done")
    );
});




async function PayUPaymentScrater(amount, product, firstname, lastname, email, mobile) {
    try {
        const txn_id = 'PAYU_MONEY_' + Math.floor(Math.random() * 8888888)
        let udf1 = ''
        let udf2 = ''
        let udf3 = ''
        let udf4 = ''
        let udf5 = ''

        const hashString = `${PayData.payu_key}|${txn_id}|${amount}|${JSON.stringify(product)}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${PayData.payu_salt}`;
        // console.log(hashString);


        // Calculate the hash
        const hash = crypto.createHash('sha512').update(hashString).digest('hex');


        const data = await PayData.payuClient.paymentInitiate({
            isAmountFilledByCustomer: false,
            txnid: txn_id,
            amount: amount,
            currency: 'INR',
            productinfo: JSON.stringify(product),
            firstname: firstname,
            email: email,
            phone: mobile,
            surl: `http://localhost:3000/payments/success/${txn_id}`,
            furl: `http://localhost:3000/payments/failed/${txn_id}`,
            hash


        })
        return data
    } catch (error) {
        return {
            msg: error.message,
            stack: error.stack
        }
    }
}


const payUPayment = asyncHandler(async (req, res) => {
    //amount , {type} , firstname , lastname , email , phone no
    const { amount, type, firstname, lastname, email, phoneno } = req.body
    //    let amount = 900
    //    let type="userwallet"
    //    let firstname="krish"
    //    let lastname = "parmar"
    //    let email = "parmarkrish005@gmail.com"
    //    let phoneno = "9274597537"


    const data = await PayUPaymentScrater(amount, { type: type }, firstname, lastname, email, phoneno)
    res.send(data)


})

export { payUPayment, payUsuccess }








// res.status(200)
// .json(
//     new ApiResponse(200 , {success:true , data:{
//         status:data.status,
//             amt:data.amt,
//             txnid:data.txnid,
//             method:data.mode,
//             error:data.error_Message,
//             created_at:new Date(data.addedon).toLocaleString()}} , "Pyment is done")
// )