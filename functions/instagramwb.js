const formattedReturn = require('./helpers/formattedReturn');
const fetch = require('node-fetch');
const { HttpStatusCode } = require('axios');


exports.handler = async (event) => {

    if (event.httpMethod === 'GET') {

        const hubChallenge = event.queryStringParameters ? event.queryStringParameters['hub.challenge'] : null;

        if (hubChallenge) {
            // Devuelve el valor de hub.challenge como parte de la respuesta
            // return await formattedReturn(200, { "challenge": hubChallenge });
            return {
                statusCode: 200,
                body: hubChallenge,
            };

     
        } else {
            // En caso de que no haya un valor hub.challenge en la cadena de consulta
            return formattedReturn(400, { "error": "Missing hub.challenge in query parameters" });
        }

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
