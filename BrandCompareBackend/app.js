import fetch from 'node-fetch';
import express from 'express';
import cors from 'cors';


var app = express();

function toTimestamp(strDate) {
    var dt = Date.parse(strDate);
    return dt;
}
//get_profile_data
var dataProfile = async function (idInput, typeInput, dataStart, dataEnd) {

    let fans = 0;
    let engagement = 0;
    var startd = toTimestamp(dataStart)
    var endd = toTimestamp(dataEnd)
  //  console.log(startd)
  //  console.log(endd)
    var bodyProfileData = {
        "id": 1,
        "method": "socialinsider_api.get_profile_data",
        "params": {
            "id": idInput,
            "profile_type": typeInput,
            "date": {
                "start": startd,
                "end": endd,
                "timezone": "Europe/London"
            }
        }
    };

    var responseProfileData = await fetch('https://app.socialinsider.io/api', {
        method: 'post',
        body: JSON.stringify(bodyProfileData),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer API_KEY_TEST'
        }
    });


    return await responseProfileData.json().then(function (r) {
/*
        console.log("lungime vector")
        console.log(Object.values(r.resp)[0])
*/
        // valoarea si keya pentru fiecare profil
        for (const [key, value] of Object.entries(Object.values(r.resp)[0])) {
           /*  console.log(key)
            console.log(value)*/

            //verificam daca are fans
            if (value["engagement"] != undefined) {
                fans += value.fans
            }
            if (value["engagement"] != undefined) {
                engagement += value.engagement
            }

        }
    /*    console.log(fans)
        console.log(engagement)*/
        let info = {}
        info.fans = fans
        info.engagement = engagement

        console.log(info)  
        return info;
    })
}

dataProfile("gucci", "instagram_profile", "12/25/2020", "12/27/2020")

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
app.use(cors())

var dataBrands = await responseBrands.json();
//console.log(dataBrands)
/*
app.get('/profiles', function(req, res){
    res.send(dataProfile.resp);
})
app.get('/brands', function(req, res){
    res.send(dataBrands.result);
})*/
console.log(dataBrands.result[1].profiles[1])

   
app.get('/info', function(req, res){
    //pentru fiecare brand trebuie sa numaram cate profile sunt si sa retinem si numele brandului
    var brands = dataBrands.result
    var len = brands.length
    var listOfBrands =[]
    for(let i=0; i< len; i++){
        listOfBrands.nameB = brands[i].brandname
        listOfBrands.numberB = brands[i].profiles.length
        //trebuie sa luam id-ul si type-ul fiecare brand
        var lenB = brands[i].profiles.length
        for(let j=0; j<=lenB; i++){
            var profiles = brands[i].profiles[j]
            var numerofdate = dataProfile(profiles.id, profiles.profile_type,req.query["dataStart"], req.query["dataEnd"] )
        }
        listOfBrands.numerofdate = numerofdate
    }
    //console.log(listOfBrands)

    //formatam dictionarul sa fie de tip json
    res.send(json.stringify(listOfBrands))
})
app.listen(8000, function () {
    console.log('Listening to Port 8000');
});
