const fetch = require('node-fetch');
const formattedReturn = require('./helpers/formattedReturn');
const Sentry = require("@sentry/node");
const { captureException } = require('@sentry/tracing');
/////////////////////////////////////////////////////////////////
Sentry.init({
    dsn: process.env.REACT_APP_URL_DSN,
    integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Sentry.Integrations.OnUncaughtException(),
        new Sentry.Integrations.OnUnhandledRejection(),
    ],
});


//   Sentry.captureException("error de prueba");
//////////////////////////////////////////////////////////

exports.handler = async (event) => {

    if (event.headers.token == process.env.REACT_APP_PASSWORD) {
        const fields = JSON.parse(event.body);
        var body2 = fields.records[0].fields
        var text = fields.records[0].fields.message
        var numeros = fields.records[0].fields.addresseeList
        numeros = numeros.map((obj) => obj.mobile)
        body2 = JSON.stringify(body2)
        var numeroEnvio = 0;

        const courses = fields.courses;

        //Lectura de Tabla intermedia 

        const tablaIntermedia = await fetch(process.env.REACT_APP_URL_AIRTABLE_TABLA_INTERMEDIA)
            .then(response => response.json()).then(data => data)

        var numerosNombresYMensaje = JSON.parse(tablaIntermedia.records[0].fields.numerosNombresYMensaje)
        //_______________________________________________________________________________________

        var numerosAEnviar1 = courses.map(item => {
            return { Id: item.Id, nombre: item.nombre, mensaje: text };
        });


        var numerosAEnviar = numerosNombresYMensaje.concat(numerosAEnviar1)
        // var numerosAEnviar =numerosAEnviar1

        //envio Tabla intermedia objeto con lista de numeros y 

        await fetch(process.env.REACT_APP_URL_AIRTABLE_TABLA_INTERMEDIA, {

            method: 'PUT',
            body: JSON.stringify({
                "records": [
                    {
                        "id": "rec9Jdl7QIYqrOjGg",
                        "fields": {
                            "estado": "En Cola",
                            "numerosNombresYMensaje": JSON.stringify(numerosAEnviar),
                            "cantidad": JSON.stringify(numerosAEnviar.length)
                        }
                    }
                ]
            }),
            headers: {
                'Content-Type': 'application/json',
                // 'X-Master-Key': "$2b$10$" + process.env.REACT_APP_XMasterKey
                // 'Authorization': 'Basic ' + btoa(`${process.env.USERNAME_MSM}:${process.env.PASSWORD_MSM}`)
            }
        });

        //__________________________________________________________________________________________________

        //Sentry.captureException(numerosAEnviar);

        for (let i = 0; i < numerosAEnviar.length; i++) {
            numeroEnvio++
            const objeto = numerosAEnviar[i];
            var numeroE = objeto.Id;
            numeroE = numeroE.toString();
            numeroE = numeroE.substring(2);
            const MensajeEnviar = objeto.mensaje
            var NombreEnviar = objeto.nombre

            if (NombreEnviar == undefined) {
                NombreEnviar = "";
            }

            // var textoEnviarSMS = MensajeEnviar.replace("[nombre]", NombreEnviar);
            // Sentry.captureMessage("prueba mensaje y nombre separado"+ MensajeEnviar + NombreEnviar);
            // Sentry.captureMessage("prueba mensaje y nombre juntos replace"+ textoEnviarSMS);


            // var EnviarAirtable = await fetch("https://api.jsonbin.io/v3/b/", {
            var EnviarAirtable = await fetch("https://apitellit.aldeamo.com/SmsiWS/smsSendPost/", {

                method: 'POST',
                body: JSON.stringify({
                    "country": "57",
                    "message": NombreEnviar + " " + MensajeEnviar,
                    "encoding": "GSM7",
                    "messageFormat": 1,
                    "addresseeList": [{
                        "mobile": numeroE
                    }]
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': "$2b$10$" + process.env.REACT_APP_XMasterKey,
                    'Authorization': 'Basic ' + btoa(`${process.env.USERNAME_MSM}:${process.env.PASSWORD_MSM}`)
                }
            });
            var data = await EnviarAirtable.json();

            var body5 = {
                "records": [{
                    "fields": {
                        // "mensaje": objeto.nombre + " " + JSON.stringify(text),
                        "mensaje": NombreEnviar + " " + MensajeEnviar,
                        "numeros": JSON.stringify(numeroE),
                        "numerosenviados": JSON.stringify(data),
                    }
                }]
            }

            var EnviarAirtable2 = await fetch(process.env.REACT_APP_URL_AIRTABLE_MENSAJES, {

                method: 'POST',
                body: JSON.stringify(body5),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            //Actualizar TABLA Intermedia cola y enviado

            if (data.status == 1) {

                //Actualizar ENVIADOS
                const tablaIntermedia = await fetch(process.env.REACT_APP_URL_AIRTABLE_TABLA_INTERMEDIA)
                    .then(response => response.json()).then(data => data)
                var numerosNombresYMensaje1 = JSON.parse(tablaIntermedia.records[2].fields.numerosNombresYMensaje)
                const numerosEnviados1 = { Id: numeroE, nombre: objeto.nombre, mensaje: objeto.mensaje }
                var numerosEnviados = numerosNombresYMensaje1.concat(numerosEnviados1)

                await fetch(process.env.REACT_APP_URL_AIRTABLE_TABLA_INTERMEDIA, {

                    method: 'PUT',
                    body: JSON.stringify({
                        "records": [
                            {
                                "id": "recUSP7cXh5rMsoPQ",
                                "fields": {
                                    "estado": "Enviados",
                                    "numerosNombresYMensaje": JSON.stringify(numerosEnviados),
                                    "cantidad": JSON.stringify(numerosEnviados.length)
                                }
                            }
                        ]
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });



                //ACTUALIZAR EN COLA

                const tablaIntermediacola = await fetch(process.env.REACT_APP_URL_AIRTABLE_TABLA_INTERMEDIA)
                    .then(response => response.json()).then(data => data)
                var numerosNombresYMensajecola = JSON.parse(tablaIntermediacola.records[0].fields.numerosNombresYMensaje)

                const numerosEnviadoscola = [{ Id: objeto.Id, nombre: objeto.nombre, mensaje: objeto.mensaje }]

                var numeroscola = numerosNombresYMensajecola.filter(item1 => !numerosEnviadoscola.find(item2 => item1.Id === item2.Id && item1.mensaje === item2.mensaje));
                // var numeroscola = numerosNombresYMensajecola.concat(numerosEnviadoscola)
                await fetch(process.env.REACT_APP_URL_AIRTABLE_TABLA_INTERMEDIA, {

                    method: 'PUT',
                    body: JSON.stringify({
                        "records": [
                            {
                                "id": "rec9Jdl7QIYqrOjGg",
                                "fields": {
                                    "estado": "En Cola",
                                    "numerosNombresYMensaje": JSON.stringify(numeroscola),
                                    "cantidad": JSON.stringify(numeroscola.length)
                                }
                            }
                        ]
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });











            }



        }
        if (fields.tipo != "chatlayer") {

            var today = new Date();
            var now = today.toLocaleString("en-US", { timeZone: "America/New_York" });
            const bodyIngreso = {
                "records": [{
                    "fields": {
                        "usuario": "user",
                        "interaccion": "Envio del mensaje por AppWeb: " + JSON.stringify(text) + ". A: " + courses.length + " usuarios ",
                        "fechayhora": JSON.stringify(now),
                        "ip": "dataip.ip"

                    }
                }]
            };

            const EnviarAirtable3 = await fetch(process.env.REACT_APP_URL_AIRTABLE_MENSAJE_REG, {

                method: 'POST',
                body: JSON.stringify(bodyIngreso),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

        }

    } else {
        return await formattedReturn(401, { message: 'Unauthorized' });
    }




};
