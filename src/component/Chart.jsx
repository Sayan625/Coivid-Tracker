import React, { useEffect, useState } from 'react'
import { GetDailyData } from './Api'
import { Line } from 'react-chartjs-2'


const Chart = () => {
    const [chartData, setChartData] = useState([])

    useEffect(() => {
        async function GetData() {
            const data = await GetDailyData()
            setChartData(data)
        }
        GetData()

    }, [])

    const option = {
        plugins: {
            legend: {
                labels: {
                  color: 'rgb(255,255,255)'
                }
              },
            title: {
                color: 'white',
                display: true,
                text: 'Covid-19 Progression so far',
                font:{
                    size:24,
                    weight:'bold'
                },
            },
        },

        scales: {
            y: {

                ticks: {
                    color: 'white',
                    maxTicksLimit: 6,
                    callback: function (value) {
                        const Lvalue = value.toString()
                        if (Lvalue.length === 1)
                            return Lvalue
                        if (Lvalue.length > 3 && Lvalue.length < 6)
                            return Lvalue.slice(0, -3) + 'K'
                        if (Lvalue.length > 6 && Lvalue.length < 10)
                            return Lvalue.slice(0, -6) + 'M'
                    }
                }
            },
            x:{
                grid:{
                    display:false,
                },
                ticks:{
                    maxTicksLimit: 7,
                    color: 'white',
                }
            }
        }, responive: true, maintainAspectRatio:false,
    }
    const LineChart = (
        chartData.length > 0 ? (
            <Line

                data={{

                    datasets: [{
                        data: chartData.map((element) => ({
                            x: element.date,
                            y: element.cases
                        })),
                        borderColor: 'rgb(0,225,255)',
                        backgroundColor: 'rgba(0,225,255,0.5)',
                        label: 'cases',
                        tension: 0,
                        fill: true,
                        pointRadius: 0,
                    },
                    {
                        data: chartData.map((element) => ({
                            x: element.date,
                            y: element.deaths
                        })),
                        borderColor: 'rgba(255,0,255,1)',
                        backgroundColor: 'rgba(255,0,255,0.5)',
                        label: 'Deaths',
                        tension: 0,
                        fill: true,
                        pointRadius: 0,
                    }]

                }} options={option} 

            />
        ) : null
    )


    return (
        <>
            {LineChart}
        </>
    )
}

export default Chart
