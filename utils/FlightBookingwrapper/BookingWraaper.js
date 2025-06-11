const Api1BookingConverter = (data) => {
    const Template1 = {
        "Customer_Mobile": "6789828347",
        "Passenger_Mobile": "6789828347",
        "WhatsAPP_Mobile": null,
        "Passenger_Email": "demo@outlook.com",
        "PAX_Details": [],
        "GST": false,
        "GST_Number": "",
        "GST_HolderName": "GST Holder Name",
        "GST_Address": "GST Address",
        "BookingFlightDetails": [
            {
                "Search_Key": "",
                "Flight_Key": "",
                "BookingSSRDetails": [

                ]
            }
        ],
        "CostCenterId": 0,
        "ProjectId": 0,
        "BookingRemark": "MAA-TCR  18-Oct-2021  Test API With GST",
        "CorporateStatus": 0,
        "CorporatePaymentMode": 0,
        "MissedSavingReason": null,
        "CorpTripType": null,
        "CorpTripSubType": null,
        "TripRequestId": null,
        "BookingAlertIds": null
    }
    Template1.BookingFlightDetails = data.BookingFlightDetails

    if (Array.isArray(data.pax_details)) {
        for (let i = 0; i < data.pax_details.length; i++) {
            console.log("Pax details:", data.pax_details[i]);
            Template1.PAX_Details.push(data.pax_details[i]);
        }

    } else {
        console.error("pax_details is not an array!");
    }

    console.log(Template1)
    return Template1;
};


const Api2BookingConverter = (data) => {
    const Template2 = {
        
        "bookingId": "",
        "paymentInfos": [
            {
                "amount": data.amount || ""
            }
        ],
        "travellerInfo": [],
        "gstInfo": {
            "gstNumber": data.GstDetails?.gst_number || "07ZZAS7YY6XXZF",
            "email": data.email || "apitest@apitest.com",
            "registeredName": data.GstDetails?.gst_holder_name || "XYZ Pvt Ltd",
            "mobile": data.mobile_number || "9728408906",
            "address": data.GstDetails?.address || "Delhi"
        },
        "deliveryInfo": {
            "emails": [data.email],
            "contacts": [data.mobile_number]
        }
    };

   

    if (Array.isArray(data.pax_details)) { // Ensure pax_details is an array
        for (let i = 0; i < data.pax_details.length; i++) { // Use .length
            console.log("Pax details:", data.pax_details[i]);
            Template2.travellerInfo.push(data.pax_details[i]);
        }
    } else {
        console.error("pax_details is not an array!");
    }

    return Template2;
};


export { Api1BookingConverter, Api2BookingConverter }