const formattedReturn = require('./helpers/formattedReturn');
const fetch = require('node-fetch');
const { HttpStatusCode } = require('axios');

exports.handler = async (event) => {
    if (event.httpMethod === 'POST') {

        const authHeader = event.headers.authorization || '';
        const encodedCredentials = authHeader.split(' ')[1] || '';
        const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8');
      
        const [username, password] = decodedCredentials.split(':');

        // if (username === process.env.USERNAME_MSM  && password === process.env.PASSWORD_MSM ) {
        if (1 == 1 ) {
            
            const evento = JSON.parse(event.body);
            JSON.stringify()
            const bodyIngreso = {
                "records": [{
                    "fields": {
                        "userName":  "JSON.stringify(evento.userName)" ,
                        "event": JSON.stringify(evento),
                        "eventDate": "JSON.stringify(evento.eventDate)",
                        "detail": "JSON.stringify(evento.detail)"

                    }
                }]
            };


            const EnviarAirtable = await fetch(process.env.REACT_APP_URL_AIRTABLE_EVENTOS_SMS, {

                method: 'POST',
                body: JSON.stringify(bodyIngreso),
                headers: {
                    'Content-Type': 'application/json'
                }
            })



            return await formattedReturn(200, {"status":"1", "reason":"Request Received"} );


        }else{
            return await formattedReturn(401,  {"status":"-1", "reason":"Authentication Error"} );
        }
        
    } else {
        return formattedReturn(405, {"status":"-5", "reason":"Transacction Error"});
    }
};
