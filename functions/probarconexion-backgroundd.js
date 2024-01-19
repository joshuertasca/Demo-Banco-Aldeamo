const fetch = require('node-fetch');
const formattedReturn = require('./helpers/formattedReturn');
/////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////

exports.handler = async (event) => {

    
    const data = {
        "from": "573124053714",
        "to": "593964231931",
        "type": "text",
        "recipient_type": "individual",
        "text": {
            "body": "Han pasado 10 minutos"
        }

    }

    const enviarMensaje10minutos = await fetch("https://apitellitwa.aldeamo.com/v1/apikey/text/bsp/send", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'apiKey': process.env.REACT_APIKEY2,
            'UserId': process.env.REACT_USERID2,
            'Content-Type': 'application/json'
        }
    })





};
