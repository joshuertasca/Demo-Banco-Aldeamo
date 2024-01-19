const fetch = require('node-fetch');
const formattedReturn = require('./helpers/formattedReturn');



exports.handler = async (event) => {

    
    const recordsAPI = await fetch(process.env.REACT_APP_URL_AIRTABLE_EVENTOS_LINEA_BOT)
                    .then(response => response.json()).then(data => data)
    

    var posiciontimestampmaximo = 0
    const records = recordsAPI.records

    records.forEach((element, x) => {
        var timestampComparar1 = parseInt(element.fields.timestamp)
        var timestampComparar2 = parseInt(records[posiciontimestampmaximo].fields.timestamp)

        if (timestampComparar1 > timestampComparar2 && element.fields.numero == "593964231931") {
            posiciontimestampmaximo = x
        }
    });

    if (records[posiciontimestampmaximo].fields.texto == "bot funcionando") {

        
    } else {

        const data2 = {
            "from": "573124053714",
            "to": "573114610919",
            "type": "text",
            "recipient_type": "individual",
            "text": {
                "body": "❌❌❌❌❌❌"
            }
    
        }
    
        const enviarMensaje10minutos = await fetch("https://apitellitwa.aldeamo.com/v1/apikey/text/bsp/send", {
            method: 'POST',
            body: JSON.stringify(data2),
            headers: {
                'apiKey': process.env.REACT_APIKEY2,
                'UserId': process.env.REACT_USERID2,
                'Content-Type': 'application/json'
            }
        })



    }



};
