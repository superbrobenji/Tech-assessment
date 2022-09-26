import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { TileLayer, Marker, useMap, Tooltip } from 'react-leaflet';
import {Polyline as WrappedPolyline } from 'leaflet.antimeridian';
// eslint-disable-next-line import/no-webpack-loader-syntax

const MapContent = () => {
    const map = useMap();
    
    const { coordinates } = useSelector((state) => state.latLonSlice)
    const [currentDistance, setCurrentDistance] = useState([]);
    useEffect(() => {
        map.locate().once('locationfound', (e) => getDistance(e, coordinates[0]?.latLon));
        map.panTo(coordinates[0]?.latLon);
        const route = new WrappedPolyline(createLine(coordinates), 
            {
                wieght: 2,
                color: 'blue',
                opacity: 1,
                fillColor: 'blue',
                fillOpacity: 0.5,
            }
        );
        route.addTo(map);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[coordinates]);

    const getDistance = (event, iss) => {
        setCurrentDistance(Math.round(map.distance(event.latlng, iss)/1000));
    }

    const createLine = (coordinates) => {
        const multiLine = []
        multiLine.push(coordinates.map((coordinate) => {
            return coordinate.latLon
        }))
        return multiLine
    }

    return (
        <>
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
        <Marker position={coordinates[0]?.latLon}>
            <Tooltip>The ISS is currently {currentDistance}km from you.</Tooltip>
        </Marker>
        </>
    )
}

export default MapContent