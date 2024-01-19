const formattedReturn = require('./helpers/formattedReturn');
const fetch = require('node-fetch');
const { HttpStatusCode } = require('axios');


exports.handler = async (event) => {

    if (event.httpMethod === 'POST') {

        const evento = JSON.parse(event.body);

        var numeros = []

        // evento = {
        //     "urlGS":"https://script.google.com/macros/s/AKfycbzoNmR16brKU0lJknqBBpmkjkkw_Lje5jRpO5Q-pbYzJLZjopjCXcnHOqU712y84jjj/exec?action=addUser",
        //     "botID":"lesjdiym",
        //     "version":"DRAFT",
        //     "token":"Token ",
        //      "page":1
        // }

        const urlGS = evento.urlGS
        const botID = evento.botID
        const version = evento.version
        const token = evento.token
        var page = evento.page
        var numeroID = 0

        numeroID = ((page - 1) * 10)

        for (let xx = 0; xx < 100; xx++) {

            page = page + xx

            //leer numeros de API 1
            // const urlnumeros = `https://api.chatlayer.ai/v1/bots/${botID}/conversations/?version=${version}&limit=100&page=${page}` 
            const urlnumeros = `https://api.chatlayer.ai/v1/bots/${botID}/conversations/?version=${version}&page=${page}`

            const numerosAPI = await fetch(urlnumeros, {

                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }).then(response => response.json()).then(data => data)

            const numerosAPI1 = numerosAPI.data

            for (let y = 0; y < numerosAPI1.length; y++) {
                var nuevoNumero = numerosAPI1[y].user.id
                numeros.push(nuevoNumero)

            }




            for (let index = 0; index < numeros.length; index++) {


                const urlConversacion = "https://api.chatlayer.ai/v1/bots/" + botID + "/conversations/" + numeros[index] + "/messages?version=" + version + "&limit=100"

                const conversacion = await fetch(urlConversacion, {

                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }).then(response => response.json()).then(data => data)

                const mensajes = conversacion.data

                //PROCESAMIENTO DE MENSAJES

                const celular = numeros[index]

                for (let x = 1; x < mensajes.length + 1; x++) {

                    const posicionmensaje = mensajes.length - x
                    const menssage = mensajes[posicionmensaje]
                    var mensaje = ""

                    //Mensaje
                    if (menssage.message.messageType) {
                        mensaje = menssage.message.text
                    } else if (menssage.message.attachment) {
                        mensaje = menssage.message.attachment.payload.text
                    } else if (menssage.message.message) {
                        mensaje = menssage.message.message.body
                    } else if (menssage.message.text) {
                        mensaje = menssage.message.text
                    }




                    const conversacionHojaCalculo = {
                        "id": numeroID,
                        "Celular": celular,
                        "Fecha": menssage.timestamp,
                        "Conversación": mensaje,
                        "Actor": menssage.actor
                    }
                    const EnviarAirtable = await fetch(urlGS, {

                        method: 'POST',
                        body: JSON.stringify(conversacionHojaCalculo),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })

                }

                numeroID = numeroID + 1

            }


            //prueba numeros
            numeros = []





        }






        return await formattedReturn(200, { "status": "1", "reason": "Usuario subido correctamente" });
    } else {
        return formattedReturn(405, { "status": "-5", "reason": "Transacction Error" });
    }
};
