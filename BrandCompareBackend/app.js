import fetch from 'node-fetch';
import express from 'express';
import cors from 'cors';


var app = express();

function toTimestamp(strDate) {
    var dt = Date.parse(strDate) + 1;
    //console.log("data este")
    //  console.log(strDate)
    return dt;
}
//get_profile_data
var dataProfile = async function (idInput, typeInput, dataStart, dataEnd) {

    let fans = 0;
    let engagement = 0;
    var startd = toTimestamp(dataStart)
    var endd = toTimestamp(dataEnd)
    console.log("dataaaa")
    console.log(startd)
    console.log(endd)
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
            /* console.log(key)
             console.log(value)
*/
            //verificam daca are fans
            if (value["fans"] != undefined) {
                fans += value.fans
            }
            if (value["engagement"] != undefined) {
                engagement += value.engagement
            }

        }
        /*  console.log("Fans")
              console.log(fans)
              console.log(engagement)*/
        let info = {}
        info.fans = fans
        info.engagement = engagement

        console.log(info)
        return info;
    })
}
/*
dataProfile("44596321012", "facebook_page", "12/25/2020", "12/27/2020")
dataProfile("16913418", "twitter_profile", "12/25/2020", "12/27/2020")
dataProfile("gucci", "instagram_profile", "12/25/2020", "12/27/2020")
*/
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
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer API_KEY_TEST'
    }
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
//console.log(dataBrands.result[1].profiles[1])

//console.log(dataBrands.result)
/*var brands = dataBrands.result
var len = brands.length
var listOfBrands = []
for (let i = 0; i < len; i++) {
    listOfBrands[i] = {
        nameB: brands[i].brandname,
        numberB: brands[i].profiles.length
    }
  //  console.log(brands[i].brandname)
    let fanscount = 0
    let engcount = 0

    for (let j = 0; j < brands[i].profiles.length; j++) {
    //    console.log(brands[i].profiles[j].id)
      //  console.log(brands[i].profiles[j].profile_type)
        let profiless = brands[i].profiles[j]

        var numerofdate = await dataProfile(profiless.id, profiless.profile_type, "12/25/2020", "12/27/2020")

      console.log("numberofdata")

        console.log(numerofdate)

        console.log("here")
        console.log("numerofdate.fans: ", numerofdate.fans)
        console.log("numerofdate.eng: ", numerofdate.engagement)
        console.log("fanscount:", fanscount)
        console.log("engcount:", engcount)
        //verificam daca are fans

        fanscount += numerofdate.fans

        engcount += numerofdate.engagement

       console.log("dupa suma")
        console.log("fanscount:", fanscount)
        console.log("engcount:", engcount)
    }
    let nofansandeng ={}
    nofansandeng.fans = fanscount
    nofansandeng.engagement = engcount
  //  console.log("nofansandeng", nofansandeng)
    listOfBrands[i].fanseng = nofansandeng
  //  console.log("listOfBrands", listOfBrands)
}*/
//console.log(listOfBrands)
//trebuie sa luam id-ul si type-ul fiecare brand
app.get('/info', async function (req, res) {
            //pentru fiecare brand trebuie sa numaram cate profile sunt si sa retinem si numele brandului
            var brands = dataBrands.result
            var len = brands.length
            var listOfBrands = []
            for (let i = 0; i < len; i++) {
                listOfBrands[i] = {
                    nameB: brands[i].brandname,
                    numberB: brands[i].profiles.length
                }
                //  console.log(brands[i].brandname)
                let fanscount = 0
                let engcount = 0

                for (let j = 0; j < brands[i].profiles.length; j++) {
                    let profiless = brands[i].profiles[j]
                    var numerofdate = await dataProfile(profiless.id, profiless.profile_type, req.query.dataStart, req.query.dataEnd)
                    if (numerofdate.fans == "null") {
                        fanscount += 0
                    } else {
                        fanscount += numerofdate.fans

                    }
                    if (numerofdate.fans == "null") {
                        engcount += 0
                    } else {
                        engcount += numerofdate.engagement

                    }
                    let nofansandeng = {}
                    nofansandeng.fans = fanscount
                    nofansandeng.engagement = engcount
                    console.log(nofansandeng)
                    listOfBrands[i].fanseng = nofansandeng
                }}
                console.log(listOfBrands)
                res.json(listOfBrands)
            })
        app.listen(8000, function () {
            console.log('Listening to Port 8000');
        });