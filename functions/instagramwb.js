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
  
    // if (event.httpMethod === 'POST') {

    //     const evento = JSON.parse(event.body);


    //     const bodyIngreso = evento;
    //     const EnviarAirtable = await fetch(process.env.REACT_APP_URL_AIRTABLE_EVENTOS_TELEGRAM, {

    //         method: 'POST',
    //         body: JSON.stringify(bodyIngreso),
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     })


    //     return await formattedReturn(200, { "status": "1", "reason": "Request Received" });





    // }
    
    if (event.httpMethod === 'POST') {
        try {
            const evento = JSON.parse(event.body);

            const bodyIngreso = evento,
      

            // Enviar el contenido a otro enlace utilizando fetch
            const EnviarAirtable = await fetch('https://script.google.com/macros/s/AKfycbztaW_jC3NIiN8IUUKaL8Rosez9U3Rd_IeznIGhFfNb9no6R-70jgPhHacGfXEKKnAT/exec', {
                method: 'POST',
                body: JSON.stringify(event.body),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Verificar la respuesta de la solicitud a Airtable si es necesario

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
