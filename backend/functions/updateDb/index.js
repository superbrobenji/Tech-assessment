const aws = require('aws-sdk');
const axios = require('axios');

aws.config.update({region: "us-west-2" });
const dynamo = new aws.DynamoDB.DocumentClient();

const getCoordinates = async () => {
    const res = await axios.get('http://api.open-notify.org/iss-now.json')
    await storeData(formatData(res.data));
    await deleteOldData();
    return {statusCode: 200}
}

const formatData = (data) => {
  return {latitude: data.iss_position.latitude, longitude: data.iss_position.longitude, timestamp: data.timestamp}
}
const deleteOldData = async () => {
  const now = Date.now()/1000;
  const ONE_HOUR = 60*60;
  const response = await dynamo.scan({
    TableName: "iss-coordinates",
  }).promise();
  response.Items.forEach(async item => {
    const diff = now - item.timestamp
    if(diff >= ONE_HOUR){
      await dynamo.delete({
        TableName: "iss-coordinates",
        Key: {
          ID: item.ID
        }
      }).promise()
    }
  })
}

const storeData = async (formattedData) => {
  //TODO store data to dynamoDB
  await dynamo.put({
    TableName: "iss-coordinates",
    Item: {
      ID: Math.random().toString(),
      iss_position: {
        latitude: formattedData.latitude,
        longitude: formattedData.longitude,
      },
      timestamp: formattedData.timestamp
    }
  }).promise();
}

exports.issLatLonFetch = getCoordinates