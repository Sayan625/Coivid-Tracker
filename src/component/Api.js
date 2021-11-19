
export const GetCountry = async (country = '') => {
    let url = ''
    let formattedData=''
    if (country !== '') {
        url = `https://disease.sh/v3/covid-19/countries/${country}`
        const rawData = await fetch(url)
        formattedData= await rawData.json()
  
    }
    else {
        url = `https://disease.sh/v3/covid-19/countries`
        const rawData = await fetch(url)
        const data = await rawData.json()
        formattedData = await data.map((element) => ({
            name: element.country,
            lat: element.countryInfo.lat,
            long: element.countryInfo.long,
            cases: element.cases,
            deaths: element.deaths,
            recovered: element.recovered,
            flag: element.countryInfo.flag

        }))
    }

    return formattedData
}

export const GetWorldData = async () => {
    const rawData = await fetch('https://disease.sh/v3/covid-19/all')
    const data = await rawData.json()
    return data
}

export const GetDailyData = async () => {
    const rawData = await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=all')
    const data = await rawData.json()
    const chartData = []
    for (let date in data.cases) {
        if (data.cases[date]  && data.deaths[date] !== 0) {

            const newData = {
                date: date,
                cases: data.cases[date],
                recovered: data.recovered[date],
                deaths: data.deaths[date]

            }
            chartData.push(newData)
        }

    }



    return chartData

}






