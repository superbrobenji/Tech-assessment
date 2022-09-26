import React, { useEffect, useState, useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {MapContainer } from 'react-leaflet'
import {fetchLatestCoordinates} from '../../reducers/latLonSlice';
// eslint-disable-next-line import/no-webpack-loader-syntax
import WorkerISS from 'worker-loader!../../iss.worker';
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapContent from './MapContent'
import './style.css'


const Map = () => {
    const dispatch = useDispatch();
    const { coordinates, loading, error } = useSelector((state) => state.latLonSlice)
    const [eventCreated, setEventCreated] = useState(false);
    const workerIss = useRef();
    useEffect(() => {
        const eventType = 'message';
        const fetchCoordinates = async () => {
            if(loading === 'idle' && error === null) {
                try{
                  await dispatch(fetchLatestCoordinates());
                } catch (err) {
                    console.error(err)
                }
        }
        if(error) {
            console.error(error);
            return;
        }
    }
    if(!eventCreated){
        fetchCoordinates()
        workerIss.current = new WorkerISS();
        workerIss.current.addEventListener(eventType, fetchCoordinates)
        setEventCreated(true);
    }
    return () => {
        if(eventCreated) {
            workerIss.current.removeEventListener(eventType, fetchCoordinates)
            workerIss.current.terminate();
            setEventCreated(false);
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    const renderData = () => {
        if(loading === 'pending' && coordinates.length <= 0) {
            return <div className="loader"><div className="lds-heart"><div></div></div></div>
        }
        return  <MapContainer style={{ width: '100%', height: '100vh' }}  zoom={2} center={coordinates[0]?.latLon}>
                    <MapContent />
                </MapContainer>
    }

    return (
        <div className="mapContainer">
        {renderData()}
        </div>
    )
}

export default Map