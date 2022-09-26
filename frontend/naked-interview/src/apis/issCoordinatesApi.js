import axios from 'axios';
  const getCoordinates = () => {
    return axios.get('http://api.open-notify.org/iss-now.json')
  }

export default getCoordinates