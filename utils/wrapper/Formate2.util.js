function FormateForApi2(data) {
  const Template2 = {
    searchQuery: {
      cabinClass: 'ECONOMY',
      paxInfo: {
        ADULT: '1',
        CHILD: '0',
        INFANT: '0',
      },
      routeInfos: [],
      searchModifiers: {
        isDirectFlight: true,
        isConnectingFlight: true,
        pft: '',
      },
    },
  };

  console.log('Formation Data For Api 2.....');
  if (data) {
    if (data.Travel.Cabine == '0') {
      Template2['searchQuery'].cabinClass = 'ECONOMY';
    } else if (data.Travel.Cabine == '1') {
      Template2['searchQuery'].cabinClass = 'BUSINESS';
    } else if (data.Travel.Cabine == '2') {
      Template2['searchQuery'].cabinClass = 'FIRST';
    } else if (!data.Travel.Cabine) {
      Template2['searchQuery'].cabinClass = 'ECONOMY';
    } else {
      Template2['searchQuery'].cabinClass = 'PREMIUM_ECONOMY';
    }
    if (!data.Direct) {
      Template2['searchQuery'].searchModifiers.isDirectFlight = false;
    }
    if (!data.isConnected) {
      Template2['searchQuery'].searchModifiers.isConnectingFlight = false;
    }
    if (data.Traveler) {
      Template2['searchQuery'].paxInfo.ADULT = data.Traveler.Adult_Count || 1;
      Template2['searchQuery'].paxInfo.CHILD = data.Traveler.Child_Count[0] || 0;
      Template2['searchQuery'].paxInfo.INFANT = data.Traveler.Infant_Count || 0;
    }

    let travelDate = '';
    if (data.Travel.Travel_Date) {
      let date = data.Travel.Travel_Date;
      const dateArray = date.split('-');
      travelDate = `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`;
    } else {
      let TodayData = new Date();
      const Today = TodayData.toLocaleDateString('en-GB'); // DD/MM/YYYY
      const dateArray = Today.split('/');
      travelDate = `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`;
    }

    const routeInfo = {
      fromCityOrAirport: { code: data.Travel.FromCity },
      toCityOrAirport: { code: data.Travel.toCity },
      travelDate: travelDate,
    };
    Template2['searchQuery'].routeInfos.push(routeInfo);

    if (data.isReturn) {
      let Returndate = data.Travel.Return_Date;
      const dateArray = Returndate.split('-');
      let ReturnFormate = `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`;
      const routeInfo2 = {
        fromCityOrAirport: { code: data.Travel.toCity },
        toCityOrAirport: { code: data.Travel.FromCity },
        travelDate: ReturnFormate,
      };
      Template2['searchQuery'].routeInfos.push(routeInfo2);
    }

    if (data.SrCitizen) {
      Template2['searchQuery'].searchModifiers['pft'] = 'SENIOR_CITIZEN';
    }
    if (data.Student) {
      Template2['searchQuery'].searchModifiers['pft'] = 'STUDENT';
    }
  }

  return Template2;
}

export { FormateForApi2 };
