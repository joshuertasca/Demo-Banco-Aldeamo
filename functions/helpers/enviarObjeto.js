
const formattedReturn = require('./formattedReturn');
const fetch = require('node-fetch');
const Airtable = require('airtable');
const { json } = require('react-router-dom');




module.exports = enviar = async (event) => {

    var today = new Date();
    var now = today.toLocaleString("en-US", { timeZone: "America/New_York" });
    // const responseip = await fetch("");
    const dataip = "//"

    const fields = JSON.parse(event.body);
    var urlSend = "";
    var tipo = ""
    if (fields.type == "text") {
        urlSend = "https://apitellitwa.aldeamo.com/v1/apikey/text/bsp/send";
        tipo = "whatsapp"
    } else if (fields.type == "image") {
        urlSend = "https://apitellitwa.aldeamo.com/v1/apikey/imagebyurl/bsp/send";
        tipo = "whatsapp"
    } else if (fields.type == "interactive") {
        urlSend = "https://apitellitwa.aldeamo.com/v1/apikey/interactive/bsp/send";
        tipo = "whatsapp"
    } else if (fields.type == "location") {
        urlSend = "https://apitellitwa.aldeamo.com/v1/apikey/location/bsp/send";
        tipo = "whatsapp"
    } else if (fields.type == "MSM") {
        var body2 = fields.records[0].fields
        var text = fields.records[0].fields.message
        var numeros = fields.records[0].fields.addresseeList
        numeros = numeros.map((obj) => obj.mobile)
        body2 = JSON.stringify(body2)
        tipo = "airtable"
    } else if (fields.type == "Notificacion") {
        var body2 = fields.records
        body2 = JSON.stringify(body2)
        tipo = "Notificacion"
    } else if (fields.type == "ingreso") {

        tipo = "ingreso"
    } else if (fields.type == "ingresoLink") {

        tipo = "ingresoLink"
    } else if (fields.type == "logout") {

        tipo = "logout"
    } else if (fields.type == "navRegistros") {

        tipo = "navRegistros"

    } else if (fields.type == "registroEnvioNotificacion") {

        tipo = "registroEnvioNotificacion"

    } else if (fields.type == "template") {
        urlSend = "https://apitellitwa.aldeamo.com/v1/apikey/template/bsp/send";
        tipo = "whatsapp2"
    } else if (fields.type == "template2") {
        urlSend = "https://apitellitwa.aldeamo.com/v1/apikey/template/bsp/send";
        tipo = "whatsappchatlayer"
    }
    else if (fields.type == "codificacionCodigo") {

        tipo = "CodigoAirtable"
    }
    else if (fields.type == "MSMCodigo") {

        tipo = "CodigoSMS"
    }




    try {

        // Envio codigo whatsapp a administrador

        
        if (tipo == "whatsapp2") {
            const createdCourse = await fetch("https://apitellitwa.aldeamo.com/v1/apikey/template/otp/bsp/send", {
                method: 'POST',
                body: event.body,
                headers: {
                    'apiKey': process.env.REACT_APIKEY,
                    'UserId': process.env.REACT_USERID,
                    'Content-Type': 'application/json'
                }
            }).then(response => response.json()).then(async (data) => {

                const bodyAdmin = {
                    "records": [{
                        "fields": {
                            "mensaje": "Hola " + JSON.stringify(fields.template.components[0].parameters[0].text) + ". Este es tu codigo de acceso xxxxxx. No lo compartas.",
                            "numero": JSON.stringify(fields.to),
                            "respuesta": JSON.stringify(data),
                            "horayfecha": JSON.stringify(new Date().toLocaleString())
                        }
                    }]
                };


                const EnviarAirtable3 = await fetch(process.env.REACT_APP_URL_AIRTABLE_ENVIO_CODIGOS, {

                    method: 'POST',
                    body: JSON.stringify(bodyAdmin),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                return formattedReturn(200, EnviarAirtable3);


            })


            return formattedReturn(200, createdCourse);

        }

        //envio doble autenticación


        if (tipo == "whatsappchatlayer") {
            bodydobleautenticacion = {
                "from": fields.from,
                "to": fields.to,
                "type": "template",
                "template": {
                    "namespace": process.env.REACT_APP_NAMESPACE,
                    "language": {
                        "policy": "deterministic",
                        "code": "es"
                    },
                    "name": "doble_validacion_otp",
                    "components": [
                        {
                            "type": "button",
                            "sub_type": "quick_reply",
                            "index": "0",
                            "parameters": [
                                {
                                    "type": "payload",
                                    "payload": fields.template.components[0].parameters[0].text
                                }
                            ]
                        },
                        {
                            "type": "button",
                            "sub_type": "quick_reply",
                            "index": "1",
                            "parameters": [
                                {
                                    "type": "payload",
                                    "payload": "no validar"
                                }
                            ]
                        }
                    ]
                }
            }
            const createdCourse = await fetch(urlSend, {
                method: 'POST',
                body: JSON.stringify(bodydobleautenticacion),
                headers: {
                    'apiKey': process.env.REACT_APIKEY,
                    'UserId': process.env.REACT_USERID,
                    'Content-Type': 'application/json'
                }
            }).then(response => response.json()).then(async (data) => {

                const bodyAdmin = {
                    "records": [{
                        "fields": {
                            "mensaje": "Hola " + JSON.stringify(fields.template.components[0].parameters[0].text) + ". Este es tu codigo de acceso xxxxxx. No lo compartas.",
                            "numero": JSON.stringify(fields.to),
                            "respuesta": JSON.stringify(data),
                            "horayfecha": JSON.stringify(new Date().toLocaleString())
                        }
                    }]
                };


                const EnviarAirtable3 = await fetch(process.env.REACT_APP_URL_AIRTABLE_ENVIO_CODIGOS, {

                    method: 'POST',
                    body: JSON.stringify(bodyAdmin),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                return formattedReturn(200, EnviarAirtable3);


            })


            return formattedReturn(200, createdCourse);

        }



        //envio codigo codificado a airtable

        else if (tipo == "CodigoAirtable") {

            const body = {
                "records": [{
                    "fields": {
                        "hash": fields.codigo,
                        "id": JSON.stringify(fields.id)

                    }
                }]
            };

            const EnviarAirtable3 = await fetch(process.env.REACT_APP_URL_AIRTABLE_ENVIO_CODIGO_LOGIN, {

                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            return formattedReturn(200, EnviarAirtable3);

        }




    } catch (err) {
        console.error(err);
        return formattedReturn(500, {});
    }
};
