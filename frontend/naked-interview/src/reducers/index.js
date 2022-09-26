import { combineReducers } from 'redux';
import latLonSlice from './latLonSlice';

const reducers = combineReducers({
    latLonSlice: latLonSlice.reducer
})

export default reducers