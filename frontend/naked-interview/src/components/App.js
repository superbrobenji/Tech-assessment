import React from 'react';
import Map from './Map';
import './style.css'

//TODO pull from lambda on page load, store in lambda every minute
//TODO add router
const App = () => {
    return (
        <div className="container" >
            <Map />
        </div>
    )
}

export default App