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
        try {
            const evento = JSON.parse(event.body);

            // const bodyIngreso = {
            //     "records": [{
            //         "fields": {
            //             "Respuesta": JSON.stringify(evento),
            //         }
            //     }]
            // };

            // Enviar el contenido a otro enlace utilizando fetch
            const EnviarAirtable = await fetch('https://app-integrations.chatlayer.ai/api/v1/subscriptions/65b16765a50796b78ad80bba/events', {
                method: 'POST',
                body: JSON.stringify(evento),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Verificar la respuesta de la solicitud a Airtable si es necesario

             const googlesheets = await fetch('https://script.google.com/macros/s/AKfycbztaW_jC3NIiN8IUUKaL8Rosez9U3Rd_IeznIGhFfNb9no6R-70jgPhHacGfXEKKnAT/exec', {
                method: 'POST',
                body: JSON.stringify(evento),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            
            return {
                statusCode: 200,
                body: JSON.stringify({ "status": "1", "reason": "Request Received" }),
            };
        } catch (error) {
            console.error("Error:", error);
            return {
                statusCode: 500,
                body: JSON.stringify({ "status": "-1", "reason": "Internal Server Error" }),
            };
        }
    }else {
        return formattedReturn(405, { "status": "-5", "reason": "Transacction Error" });
    }
};
