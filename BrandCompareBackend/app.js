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
    /* console.log("dataaaa")
     console.log(startd)
     console.log(endd)*/
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

app.get('/info', function (req, res) {
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
            var numerofdate =  dataProfile(profiless.id, profiless.profile_type, req.query.dataStart, req.query.dataEnd)
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
        }
    }
    console.log(listOfBrands)
    res.json(listOfBrands)
})
app.listen(8000, function () {
    console.log('Listening to Port 8000');
});