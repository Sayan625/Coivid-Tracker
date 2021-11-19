import React, { useEffect, useState } from 'react'
import './App.css'
import Chart from './component/Chart'
import Loading from './component/Loading'
import { GetCountry, GetWorldData } from './component/Api'
import { MapContainer, TileLayer, Circle } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import Leaflet from 'leaflet'

const App = () => {

    const [stat, setStat] = useState({})
    const [countries, setCountries] = useState([])
    const [countryInfo, setCountryInfo] = useState([])
    const [toggle, setToggle] = useState('map')
    const [mapVisible, setMapVisible] = useState(true)
    const [chartVisible, setChartVisible] = useState(false)
    const [loading, setLoading] = useState(false)

    const corner1 = Leaflet.latLng(-90, -180)
    const corner2 = Leaflet.latLng(90, 180)
    const bounds = Leaflet.latLngBounds(corner1, corner2)


    useEffect(() => {
        async function GetData() {
            setLoading(true)
            const data = await GetWorldData()
            const countryData = await GetCountry()
            setStat(data)
            setCountries(countryData)
            setCountryInfo(countryData[0])
            setLoading(false)
            
        }
        GetData()
    }, [])




    function setMarkers() {
        const obj = countries?.map((element) => (
            <Circle
                center={[element.lat, element.long]}
                fillOpacity='0.4'
                color='#FF0000'
                fillColor='#FF0000'
                radius={(element?.cases /
                    stat?.cases) * 7000000}
            >
            </Circle>
        ))
        return obj
    }


    function handleValue(value) {
        if (value >= 0) {

            if (value < 1000)
                return value
            if (value >= 1000 && value < 1000000) {
                let modifiedvalue = value / 1000
                return modifiedvalue.toFixed(1) + 'K'
            }
            if (value >= 1000000 && value < 1000000000) {
                let modifiedvalue = value / 1000000
                return modifiedvalue.toFixed(1) + 'M'
            }
            if (value >= 1000000000) {
                let modifiedvalue = value / 1000000000
                return modifiedvalue.toFixed(1) + 'B'
            }
        }
    }
    return (
        <>
        {loading? <Loading/>:
            <div className="app">
                <div className="top">
                    <h3>Covid Dashboard</h3>
                    <p>(for mobile and pc view only) </p> 
                </div>
                <div className="header">
                    <div className="globalIcon">
                        <i class="fas fa-globe"></i>
                    </div>
                    <div className="card">
                        <div className="flex">
                            <h3>Cases Today</h3>
                            <p>{handleValue(stat?.todayCases)}</p>
                        </div>
                        <div className="flex">
                            <h3>Total</h3>
                            <p>{handleValue(stat?.cases)}</p>
                        </div>
                    </div>
                    <div className="card">
                        <div className="flex">
                            <h3>Recovered Today</h3>
                            <p>{handleValue(stat?.todayRecovered)}</p>
                        </div>
                        <div className="flex">
                            <h3>Total</h3>
                            <p>{handleValue(stat?.recovered)}</p>
                        </div>
                    </div>
                    <div className="card">
                        <div className="flex">
                            <h3>Deaths Today</h3>
                            <p>{handleValue(stat?.todayDeaths)}</p>
                        </div>
                        <div className="flex">
                            <h3>Total</h3>
                            <p>{handleValue(stat?.deaths)}</p>
                        </div>
                    </div>
                    <div className="affected card">
                        <h3>Country affected</h3>
                        <p>{handleValue(stat?.affectedCountries)}</p>
                    </div>
                </div>
                <div className='container'>
                    <div className="other">
                        <div className=" card">
                            <div className="countries">
                                {countries?.map((element) => (
                                    <div className="country" onClick={() => {
                                        setCountryInfo(element)
                                    }} >{element.name}</div>
                                ))}
                            </div>
                        </div>
                        <div className="info card">
                            <div className="countryName">
                                <img src={countryInfo?.flag} alt="" />
                                <h2>{countryInfo?.name}</h2>
                            </div>
                            <div className="flex">
                                <h3>Cases</h3>
                                <p>{countryInfo?.cases?.toLocaleString()}</p>
                            </div>
                            <div className="flex">
                                <h3>Recovered</h3>
                                <p>{countryInfo?.cases?.toLocaleString()}</p>
                            </div>
                            <div className="flex">
                                <h3>Deaths</h3>
                                <p>{countryInfo?.deaths?.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                    <div className="mapcontainer card">
                        <div className="flex">
                            <div className={mapVisible ? 'button visible' : 'button'} onClick={() => {
                                setToggle('map')
                                setMapVisible(true)
                                setChartVisible(false)
                            }}><h3>Map</h3></div>
                            <div className={chartVisible ? 'button visible' : 'button'} onClick={() => {
                                setToggle('chart')
                                setMapVisible(false)
                                setChartVisible(true)
                            }}><h3>All time data</h3></div>
                        </div>
                        <div className="map">
                            {toggle === 'map' ?
                                (
                                    <MapContainer center={[20.5937, 78.9629]} zoom={3} minZoom={2.45} wheelPxPerZoomLevel={100} maxBounds={bounds} maxBoundsViscosity={1.0}  >
                                        <TileLayer
                                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                        {setMarkers()}
                                    </MapContainer>) : (<Chart />)}

                        </div>
                    </div>

                </div>
            </div >}
        </>
    )
}

export default App
