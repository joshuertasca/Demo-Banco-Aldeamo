const formattedReturn = require('./helpers/formattedReturn');
const fetch = require('node-fetch');
const { HttpStatusCode } = require('axios');


exports.handler = async (event) => {

    if (event.httpMethod === 'GET') {

       
        return await formattedReturn(1158201444);

    }
  
    if (event.httpMethod === 'POST') {

        const evento = JSON.parse(event.body);


        const bodyIngreso = {
            "records": [{
                "fields": {
                    "Respuesta": JSON.stringify(evento),
                }
            }]
        };
        const EnviarAirtable = await fetch(process.env.REACT_APP_URL_AIRTABLE_EVENTOS_TELEGRAM, {

            method: 'POST',
            body: JSON.stringify(bodyIngreso),
            headers: {
                'Content-Type': 'application/json'
            }
        })


        return await formattedReturn(200, { "status": "1", "reason": "Request Received" });





    } else {
        return formattedReturn(405, { "status": "-5", "reason": "Transacction Error" });
    }
};
