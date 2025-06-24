

function FormateForApi1(data) {
    console.log("Formatting Data for API1....");
    const Temp = {
        "Auth_Header": {
            "IMEI_Number": process.env.ETRAV_IMEI_NO,
            "IP_Address": process.env.ETRAV_IP,
            "Password": process.env.LIVE_ETRAV_PASS,
            "Request_Id": process.env.ETRAV_REQUESTID,
            "UserId": process.env.LIVE_ETRAV_ID
        },
        "Travel_Type": 0,
        "Booking_Type": 0,
        "TripInfo": [],
        "Adult_Count": "1",
        "Child_Count": "0",
        "Infant_Count": "0",
        "Class_Of_Travel": "0",
        "InventoryType": 0,
        "SrCitizen_Search": false,
        "StudentFare_Search": false,
        "DefenceFare_Search": false,
        "Filtered_Airline": [
            {
                "Airline_Code": ""
            }
        ]
    };


    if (data.Travel.Travel_Date) {
        let date = data.Travel.Travel_Date;
        const dateArray = date.split("-");
        const FormatedDate = `${dateArray[1]}/${dateArray[0]}/${dateArray[2]}`;

        if (data.isReturn) {
            let Returndate = data.Travel.Return_Date;
            const dateArray = Returndate.split("-");
            let ReturnFormate = `${dateArray[1]}/${dateArray[0]}/${dateArray[2]}`;
            Temp.TripInfo = [{
                "Origin": data.Travel.FromCity,
                "Destination": data.Travel.toCity,
                "TravelDate": FormatedDate,
                "Trip_Id": 0
            },
            {
                "Origin": data.Travel.toCity,
                "Destination": data.Travel.FromCity,
                "TravelDate": ReturnFormate,
                "Trip_Id": 0
            }];
        }
        else {
            Temp.TripInfo = [{
                "Origin": data.Travel.FromCity,
                "Destination": data.Travel.toCity,
                "TravelDate": FormatedDate,
                "Trip_Id": 0
            }];
        }

    }

    Temp.Adult_Count = String(Number(data.Traveler.Adult_Count) || 1);
    Temp.Child_Count = String(Number(data.Traveler.Child_Count[0]) || 0);
    Temp.Infant_Count = String(Number(data.Traveler.Infant_Count)|| 0);

    

    Temp.Class_Of_Travel = String(data.Travel.Cabine || 0);
    Temp.Travel_Type = data.Travel.Travel_Type || 0;
    Temp.InventoryType = data.Travel.InventoryType || 0;
    if (data.SrCitizen) {

        Temp.SrCitizen_Search = true;
    }
    if (data.Student) {
        Temp.StudentFare_Search = true;
    }
    if (data.isReturn) {
        Temp['Booking_Type'] = 1;

    }


    
    return Temp;
}

export { FormateForApi1 };
