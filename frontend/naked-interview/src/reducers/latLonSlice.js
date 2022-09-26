import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getGraphData } from '../apis/apolloClientInitFetch'
import issCoordinatesApi from '../apis/issCoordinatesApi.js'


export const fetchLatestCoordinates = createAsyncThunk(
    'coordinates/getLatestCoordinates',
    async (param, {getState, requestId}) => {
        const { currentRequestId, loading, coordinates } = getState().latLonSlice
        if(loading !== 'pending' || requestId !== currentRequestId) {
            return
        }
        if(coordinates.length <= 0 ) {
           return handleGraphData()
        } else {
           return handleIssData(coordinates)
       }
    }
  );

  const handleGraphData = async () => {
    const response = await getGraphData();
    const formattedData = []
    response.data.issPos.forEach(latLon => {
        formattedData.push({latLon: [parseInt(latLon.iss_position.latitude), parseInt(latLon.iss_position.longitude)], timestamp: latLon.timestamp});
    });
    formattedData.sort((a,b) => b.timestamp - a.timestamp);
    return formattedData
  }

  const handleIssData = async (coordinates) => {
    const response = await issCoordinatesApi();
    const formattedData = {latLon: [parseInt(response.data.iss_position.latitude), parseInt(response.data.iss_position.longitude)], timestamp: response.data.timestamp}
    return addCoordinates(formattedData, coordinates)
  }

  const addCoordinates = (coordinates, state) => {
    const ONE_HOUR = 60*60;
    const returnArr = [...state]
    const lastCoordinateDate = state.length ? state[state.length - 1].timestamp : coordinates.timestamp;
    const currentcoordinateDate = coordinates.timestamp;
    const timeDiff = currentcoordinateDate - lastCoordinateDate
    if(timeDiff > ONE_HOUR) {
        returnArr.pop();
    }
    returnArr.unshift(coordinates);
    return returnArr;
  }

const latLonSlice = createSlice({
    name: 'latestCoordinates',
    initialState: {
        coordinates: [],
        loading: 'idle',
        currentRequestId: undefined,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchLatestCoordinates.pending, (state, action) => {
            if (state.loading === 'idle') {
              state.loading = 'pending'
              state.currentRequestId = action.meta.requestId
            }
          })
          .addCase(fetchLatestCoordinates.fulfilled, (state, action) => {
            const { requestId } = action.meta
            if (
              state.loading === 'pending' &&
              state.currentRequestId === requestId
            ) {
              state.loading = 'idle'
              state.coordinates = action.payload
              state.currentRequestId = undefined
            }
          })
          .addCase(fetchLatestCoordinates.rejected, (state, action) => {
            const { requestId } = action.meta
            if (
              state.loading === 'pending' &&
              state.currentRequestId === requestId
            ) {
              state.loading = 'error'
              state.error = action.error
              state.currentRequestId = undefined
            }
          })
    }
})
// Later, dispatch the thunk as needed in the app
//dispatch(fetchLatestCoordinates())
export default latLonSlice