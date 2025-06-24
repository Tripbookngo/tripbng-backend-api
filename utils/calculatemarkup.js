import { sendGetRequest, sendPostRequest } from './sendRequest.js';

//const datas
const AilineWiseData = [
  'Flat for Full Booking',
  'Flat commision Pax',
  'Flat commision Pax commision Segment',
  'Flat commision Segment Full Booking',
  'commisioncentage(%) for Full Booking',
  'commisioncentage(%) commision Pax',
  'commisioncentage(%) commision Pax commision Segment',
  'commisioncentage(%) commision Segment Full Booking',
];

const FlightMarkupData = [
  'Flat for Full Booking',
  'Flat Per Pax',
  'Flat Per Pax Per Segment',
  'Flat Per Segment Full Booking',
  'Percentage(%) for Full Booking',
  'Percentage(%) Per Pax',
  'Percentage(%) Per Pax Per Segment',
  'Percentage(%) Per Segment Full Booking',
];

const GroupinfMarkupdata = [
  'Flat for Full Booking',
  'Flat Per Pax',
  'Percentage(%) for Full Booking',
  'Percentage(%) Per Pax',
];

//markup types functions
function flatPerBook(amount, type, units) {
  let am = 0;
  if (type == 0) {
    am = (amount * units) / 100;
  } else {
    am += units;
  }

  return am;
}

function flatPerPax(amount, type, units, no_pax) {
  let am = 0;
  if (type == 0) {
    am = ((amount * units) / 100) * no_pax;
  } else {
    am = units * no_pax;
  }

  return am;
}

function sagmentFullBooking(amount, type, units, no_sagment) {
  let am = 0;
  if (type == 0) {
    am = ((amount * units) / 100) * no_sagment;
  } else {
    am = units * no_sagment;
  }
}
//data holder
const Markups = {
  airlinewise: [],
  normal: [],
  group: [],
};

async function dataFiller() {
  const ariline_wise_markup = await sendGetRequest(
    'https://api.tripbng.com/markup/air/airlinewise'
  );
  const normal_markup = await sendGetRequest('https://api.tripbng.com/markup/air/flightMarkup');
  const group_markup = await sendGetRequest(
    'https://api.tripbng.com/markup/air/groupInquiryMarkup'
  );

  Markups.airlinewise = ariline_wise_markup.data.data.data;
  Markups.normal = normal_markup.data.data.data[0];
  Markups.group = group_markup.data.data.data;
}

//main function
async function generateMarkup(amount, airline, is_return, travle_type, pax_number) {
  const data = await dataFiller();
  console.log(Markups.normal);

  let markupamount = 0;
  //airline-wise-markup
  for (let i = 0; i < Markups.airlinewise.length; i++) {
    if (airline == Markups.airlinewise[i].carrier) {
      if (is_return && travle_type == 'DOM') {
        if (Markups.airlinewise[i].domestic_round_way.commision != 0) {
          let com_type = Markups.airlinewise[i].domestic_round_way.commision_type;
          let com_unit = Markups.airlinewise[i].domestic_round_way.commision;
          let com_mode = Markups.airlinewise[i].domestic_round_way.commision_mode;

          if (com_type == '0' || com_type == '4') {
            markupamount = flatPerBook(amount, com_mode, com_unit);
          }
          if (com_type == '1' || com_type == '5') {
            markupamount = flatPerPax(amount, com_mode, com_unit, pax_number);
          }
        }
      }
      if (!is_return && travle_type == 'DOM') {
        if (Markups.airlinewise[i].domestic_one_way.commision != 0) {
          let com_type = Markups.airlinewise[i].domestic_one_way.commision_type;
          let com_unit = Markups.airlinewise[i].domestic_one_way.commision;
          let com_mode = Markups.airlinewise[i].domestic_one_way.commision_mode;

          if (com_type == '0' || com_type == '4') {
            markupamount = flatPerBook(amount, com_mode, com_unit);
          }
          if (com_type == '1' || com_type == '5') {
            markupamount = flatPerPax(amount, com_mode, com_unit, pax_number);
          }
        }
      }
      if (is_return && travle_type == 'INT') {
        if (Markups.airlinewise[i].international_round_way.commision != 0) {
          let com_type = Markups.airlinewise[i].international_round_way.commision_type;
          let com_unit = Markups.airlinewise[i].international_round_way.commision;
          let com_mode = Markups.airlinewise[i].international_round_way.commision_mode;

          if (com_type == '0' || com_type == '4') {
            markupamount = flatPerBook(amount, com_mode, com_unit);
          }
          if (com_type == '1' || com_type == '5') {
            markupamount = flatPerPax(amount, com_mode, com_unit, pax_number);
          }
        }
      }
      if (!is_return && travle_type == 'INT') {
        if (Markups.airlinewise[i].international_one_way.commision != 0) {
          let com_type = Markups.airlinewise[i].international_one_way.commision_type;
          let com_unit = Markups.airlinewise[i].international_one_way.commision;
          let com_mode = Markups.airlinewise[i].international_one_way.commision_mode;

          if (com_type == '0' || com_type == '4') {
            markupamount = flatPerBook(amount, com_mode, com_unit);
          }
          if (com_type == '1' || com_type == '5') {
            markupamount = flatPerPax(amount, com_mode, com_unit, pax_number);
          }
        }
      }
    }
  }

  //

  if (is_return && travle_type == 'DOM') {
    if (Markups.normal.domestic_round_way.commision != 0) {
      let com_type = Markups.normal.domestic_round_way.commision_type;
      let com_unit = Markups.normal.domestic_round_way.commision;
      let com_mode = Markups.normal.domestic_round_way.commision_mode;

      if (com_type == '0' || com_type == '4') {
        markupamount += flatPerBook(amount, com_mode, com_unit);
      }
      if (com_type == '1' || com_type == '5') {
        markupamount += flatPerPax(amount, com_mode, com_unit, pax_number);
      }
    }
  }
  if (!is_return && travle_type == 'DOM') {
    if (Markups.normal.domestic_one_way.commision != 0) {
      let com_type = Markups.normal.domestic_one_way.commision_type;
      let com_unit = Markups.normal.domestic_one_way.commision;
      let com_mode = Markups.normal.domestic_one_way.commision_mode;

      if (com_type == '0' || com_type == '4') {
        markupamount += flatPerBook(amount, com_mode, com_unit);
      }
      if (com_type == '1' || com_type == '5') {
        markupamount += flatPerPax(amount, com_mode, com_unit, pax_number);
      }
    }
  }
  if (is_return && travle_type == 'INT') {
    if (Markups.normal.international_round_way.commision != 0) {
      let com_type = Markups.normal.international_round_way.commision_type;
      let com_unit = Markups.normal.international_round_way.commision;
      let com_mode = Markups.normal.international_round_way.commision_mode;

      if (com_type == '0' || com_type == '4') {
        markupamount += flatPerBook(amount, com_mode, com_unit);
      }
      if (com_type == '1' || com_type == '5') {
        markupamount += flatPerPax(amount, com_mode, com_unit, pax_number);
      }
    }
  }
  if (!is_return && travle_type == 'INT') {
    if (Markups.normal.international_one_way.commision != 0) {
      let com_type = Markups.normal.international_one_way.commision_type;
      let com_unit = Markups.normal.international_one_way.commision;
      let com_mode = Markups.normal.international_one_way.commision_mode;

      if (com_type == '0' || com_type == '4') {
        markupamount += flatPerBook(amount, com_mode, com_unit);
      }
      if (com_type == '1' || com_type == '5') {
        markupamount += flatPerPax(amount, com_mode, com_unit, pax_number);
      }
    }
  }

  return markupamount;
}

export { generateMarkup };
