import fetch from 'node-fetch';
import express from 'express';
var app = express();
//get_profile_data
const bodyProfileData = {
    "id" : 1,
    "method" : "socialinsider_api.get_profile_data",
    "params":{
        "id":"44596321012",
        "profile_type": "facebook_page",
        "date": {
            "start": 1608209422374,
            "end": 1639745412436,
            "timezone": "Europe/London"
        }
    }
};

const responseProfileData = await fetch('https://app.socialinsider.io/api', {
	method: 'post',
	body: JSON.stringify(bodyProfileData),
	headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer API_KEY_TEST'}
});


var dataProfile = await responseProfileData.json();

const bodyBrands = {
    "jsonrpc": "2.0", 
    "id": 0,
    "method": "socialinsider_api.get_brands", 
    "params": {
        "projectname": "API_test"
    }
};

const responseBrands = await fetch('https://app.socialinsider.io/api', {
	method: 'post',
	body: JSON.stringify(bodyBrands),
	headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer API_KEY_TEST'}
});


console.log(dataProfile.resp);
console.log("Brands");
var dataBrands = await responseBrands.json();
console.log(dataBrands.result);

app.get('/profiles', function(req, res){
    res.send(dataProfile.resp);
})
app.get('/brands', function(req, res){
    res.send(dataBrands.result);
})
app.listen(8000, function () {
    console.log('Listening to Port 8000');
});