import { ResponseFormat } from './ResponseFormate.js';
import { ADDT1, ADDT2 } from './Additional.js';

const ResponseData = [];

function ResponseCreaterApi2(Data2, ResponseData) {
  let ResponseData2 = [];

  for (let i = 0; i < Data2.length; i++) {
    // Skip if no segment info
    if (!Data2[i].sI || Data2[i].sI.length === 0) continue;

    const segment = Data2[i].sI[0];

    const Origin = {
      Destination: segment.da.cityCode,
      ArrivalTime: segment.at,
      Destination_Terminal: segment.da.terminal,
    };

    const Destination = {
      Origin: segment.aa.cityCode,
      DepartTime: segment.dt,
      Origin_Terminal: segment.aa.terminal,
    };

    const AirlineCode = segment.fD.aI.code;
    const FlightNumber = segment.fD.fN;
    const AirlineImage = `https://tripbng-airline.s3.us-east-1.amazonaws.com/AirlinesLogo/${AirlineCode}.png`;
    const Duration = segment.duration;
    const AirlineName = segment.fD.aI.name;
    const TDate = new Date(segment.dt).toISOString().split('T')[0]; // yyyy-mm-dd
    const Amount = Data2[i].totalPriceList;
    const Additional1 = new ADDT1(null, Data2[i].sI);
    const Additional2 = new ADDT2(
      null,
      null,
      null,
      null,
      null,
      segment.fD.eT,
      Data2[i].totalPriceList[0].fareIdentifier,
      Data2[i].totalPriceList[0].id
    );

    // Format ArrivalTime for duplicate checking
    const at = new Date(segment.at);
    const formattedAT = `${String(at.getDate()).padStart(2, '0')}/${String(at.getMonth() + 1).padStart(2, '0')}/${at.getFullYear()} ${String(at.getHours()).padStart(2, '0')}:${String(at.getMinutes()).padStart(2, '0')}`;

    let isDuplicate = false;

    for (let j = 0; j < ResponseData2.length; j++) {
      const existingAT = ResponseData2[j].Destination?.ArrivalTime;
      if (existingAT === formattedAT) {
        isDuplicate = true;
        break;
      }
    }

    if (isDuplicate) {
      console.log(`Duplicate flight skipped at index ${i}`);
      continue;
    }

    // Create and push ResponseFormat object
    ResponseData2.push(
      new ResponseFormat(
        `${i}/A2`,
        2,
        AirlineCode,
        FlightNumber,
        AirlineImage,
        Duration,
        Destination,
        Origin,
        TDate,
        Amount,
        Additional1,
        Additional2,
        AirlineName
      )
    );
  }

  return ResponseData2;
}

function ResponseCreateApi1(Data1) {
  let ResponseData = [];
  for (let i = 0; i < Data1.length; i++) {
    let Destination = {
      Destination: Data1[i].Segments[0].Destination,
      ArrivalTime: Data1[i].Segments[0].Arrival_DateTime,
      Destination_Terminal: Data1[i].Segments[0].Destination_Terminal,
    };
    let Origin = {
      Origin: Data1[i].Segments[0].Origin,
      DepartTime: Data1[i].Segments[0].Departure_DateTime,
      Origin_Terminal: Data1[i].Segments[0].Origin_Terminal,
    };

    ResponseData.push(
      new ResponseFormat(
        `${i}/A1`,
        1,
        Data1[i].Airline_Code,
        Data1[i].Segments[0].Flight_Number,
        `https://tripbng-airline.s3.us-east-1.amazonaws.com/AirlinesLogo/${Data1[i].Airline_Code}.png`,
        Data1[i].Segments[0].Duration,
        Destination,
        Origin,
        Data1[i].TravelDate,
        Data1[i].Fares, // Ensure Fares is an array
        new ADDT1(null, Data1[i].Segments),
        new ADDT2(
          Data1[i].Fares[0].Fare_Id, // Access Fare_Id correctly
          Data1[i].Fares[0].Fare_Id,
          null,
          Data1[i].Flight_Key,
          Data1[i].Flight_Id,
          null,
          null,
          null
        ),
        Data1[i].Segments[0].Airline_Name // Airline Name
      )
    );
  }
  return ResponseData;
}

function ResponseAdder(Data1, Data2) {
  console.log('Creating Response....');

  let ResponseData = [];

  if (!Data1 && Data2) {
    return ResponseCreaterApi2(Data2);
  }
  if (Data1 && !Data2) {
    return ResponseCreateApi1(Data1);
  }
  if (!Data1 && !Data2) {
    return null;
  }

  // Combined processing of Data1 and Data2
  ResponseData = [...ResponseCreateApi1(Data1), ...ResponseCreaterApi2(Data2)];

  return ResponseData;
}

export { ResponseAdder };
