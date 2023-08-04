const formattedReturn = require('./helpers/formattedReturn');
const fetch = require('node-fetch');
const { HttpStatusCode } = require('axios');


exports.handler = async (event) => {

    if (event.httpMethod === 'POST') {
            var orden = 1;
            const evento = JSON.parse(event.body);
            
            if (evento.statuses==null) {
                numeroInteraccion=evento.contacts[0].wa_id;
                tipointeraccion="mensaje recibido"
                textoInteraccion=evento.messages[0].text.body
                timestamp=evento.messages[0].timestamp
            }else if (evento.statuses!=null) {
                if (evento.statuses[0].status=="sent") {
                    numeroInteraccion=evento.statuses[0].recipient_id;
                    tipointeraccion="mensaje enviado"
                    textoInteraccion=""
                    timestamp=evento.statuses[0].timestamp
                }else if (evento.statuses[0].status=="delivered") {
                    numeroInteraccion=evento.statuses[0].recipient_id;
                    tipointeraccion="mensaje Leido"
                    textoInteraccion=""
                    timestamp=evento.statuses[0].timestamp
                }
            }


            const bodyIngreso = {
                "records": [{
                    "fields": {
                        "event": JSON.stringify(evento),
                        "numero": numeroInteraccion,
                        "tipointeraccion": tipointeraccion,
                        "texto": textoInteraccion,
                        "timestamp": timestamp
                    }
                }]
            };
            const EnviarAirtable = await fetch(process.env.REACT_APP_URL_AIRTABLE_EVENTOS_LINEA_BOT, {

                method: 'POST',
                body: JSON.stringify(bodyIngreso),
                headers: {
                    'Content-Type': 'application/json'
                }
            })


            return await formattedReturn(200, {"status":"1", "reason":"Request Received"} );


        

            
    } else {
        return formattedReturn(405, {"status":"-5", "reason":"Transacction Error"});
    }
};
