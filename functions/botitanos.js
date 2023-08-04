const formattedReturn = require('./helpers/formattedReturn');
const fetch = require('node-fetch');
const { HttpStatusCode } = require('axios');


exports.handler = async (event) => {

    if (event.httpMethod === 'POST') {

        const evento = JSON.parse(event.body);


        if (evento.messages[0].text.body == "hola"||evento.messages[0].text.body == "Hola") {

            const celularBot = evento.messages[0].from

            const body = {
                "from": "573124053714",
                "to": celularBot,
                "type": "template",
                "template": {
                    "namespace": "a6314604_7ff4_432a_9c0b_c3a99a97c3c8",
                    "language": {
                        "policy": "deterministic",
                        "code": "es"
                    },
                    "name": "prueba_bot_itanos",
                    "components": [
                      {
                            "type": "header",
                            "parameters": [
                                {
                                    "type": "image",
                                    "image": {
                                        "link": "https://minio.prod.europe-west1.gc.chatlayer.ai/storage-chatlayer-prod-europe-west1-gc/4493ead4b328cfcb8f0d94a568dbca31120f3d5ed5ff246174a4ab58d7775c67/lcyxneh3/media/itanos.jpg"
                                    }
                                }
                            ]
                        },
                        {
                            "type": "body",
                            "parameters": [
                                {
                                    "type": "text",
                                    "text": "nombreUsuario"
                                }
                            ]
                        }
                    ]
                }
            }


           

            const EnviarMenu = await fetch("https://apitellitwa.aldeamo.com/v1/apikey/template/bsp/send", {

                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'apiKey': process.env.REACT_APIKEY_BOT,
                    'UserId': process.env.REACT_USERID_BOT,
                    'Content-Type': 'application/json'
                }
            })



            setTimeout(function() {
                const EnviarMensaje2 = fetch("https://apitellitwa.aldeamo.com/v1/apikey/text/bsp/send", {

                method: 'POST',
                body: JSON.stringify({
                    "from": "573124053714",
                    "to": celularBot,
                    "type": "text",
                    "recipient_type": "individual",
                    "text": {
                        "body": "Aplican terminos y condiciones (aldm.co/11uPRQlv)"
                    }

                }),
                headers: {
                    'apiKey': process.env.REACT_APIKEY_BOT,
                    'UserId': process.env.REACT_USERID_BOT,
                    'Content-Type': 'application/json'
                }
            })
              }, 1500);



            



        }






        const bodyIngreso = {
            "records": [{
                "fields": {
                    "Respuesta": JSON.stringify(evento.messages[0].text.body),
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
