import React, { useState, useRef } from 'react';
// import { useNavigate, Navigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import CryptoJS from 'crypto-js';
// import { NavLink } from "react-router-dom";
import DOMPurify from 'dompurify';


const ingresoLink = async (e) => {


    try {
        await fetch('/.netlify/functions/courses', {
            method: 'POST',
            body: JSON.stringify({
                "type": "ingresoLink"
            }),
            headers: {
                'Content-Type': 'application/json',
                'token': DOMPurify.sanitize(process.env.REACT_APP_PASSWORD)
            }


        });

    } catch (err) {
        console.error(err);
    }
};

function LoginCode() {



    const { pass } = useParams();


    const loginCode = async ({ code }) => {

        console.log(code)

        try {
            const res = await fetch('/.netlify/functions/courses', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'token': process.env.REACT_APP_PASSWORD,
                    'table': 2
                }
            }).then(response => response.json())
                .then(data => {

                    const result = data.find(obj => obj.codigo == code);
                    console.log(data)
                    console.log(result)

                    if (result == undefined) {
                        
                        Swal.fire({
                            position: 'center',
                            icon: 'error',
                            title: 'La clave ingresada es inválida, por favor digitarla de nuevo',
                            showConfirmButton: false,
                            timer: 3500,
                            background: '#f01818',
                            customClass: {
                              title: 'text-white', // Clase para el color del título
                              content: 'text-white', // Clase para el color del texto
                            },
                          });
                          

                        setCode("")
                    } else {


                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Su transacción se ha realizado con exito',
                            showConfirmButton: false,
                            timer: 4000,
                            background: '#22bb33',
                            customClass: {
                                title: 'text-white', // Clase para el color del título
                                content: 'text-white', // Clase para el color del texto
                              },
                        })

                        setClass33('d-none')
                        setCode("")

                    }
                });


        } catch (error) {
            console.error(error);
        }


    };


    const login = (e) => {
        setClass11("d-none");
        setClass22("spinner-border m-0 text-center");
        setClass33('d-block');
      
        setTimeout(() => {
          // Llamar a loginCode dentro de la función de flecha
          loginCode({ code });
        }, 2000);
        setTimeout(() => {
            setClass22("d-none");
            setClass11('btn text-center text-white mt-2 rounded-5 bg-success border-0');
            setClass33('d-none');
        }, 4500);

        
      };
      


    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {

            login();
        }
    };



    const handleSeleccionarOpcion = (event) => {
        setOpcionSeleccionada(event.target.value);
    };













    const [code, setCode] = useState('');

    const inputRefs = useRef([]);

    const handleInputChange = (index, value) => {
        // Asegurarse de que solo se acepten dígitos numéricos y limitar el tamaño a 6
        const sanitizedValue = value.replace(/\D/g, '').slice(0, 1);

        // Actualizar el estado con el código completo
        const newCode = code.split('');
        newCode[index] = sanitizedValue;
        setCode(newCode.join(''));

        // Mover automáticamente el enfoque al siguiente campo después de ingresar un dígito
        if (sanitizedValue && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        } else if (!sanitizedValue && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleInputKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text/plain');
        const sanitizedData = pastedData.replace(/\D/g, '').slice(0, 6);
        const newCode = Array.from({ length: 6 }, (_, index) => sanitizedData[index] || '');
        setCode(newCode.join(''));
    };





    const [class11, setClass11] = useState('btn text-center text-white mt-2 rounded-5 bg-success border-0')
    const [class22, setClass22] = useState(" d-none")
    const [class33, setClass33] = useState(" d-none")




    //Check box



    return (
        <div className=''>

            <div className='container-fluid  me-0 pe-0  h-100'>
                <div className='row  me-3 mt-3 me-0 pe-0 '>
                    <div className='bg-white offset-lg-4 offset-md-1 col-lg-5 offset-sm-1  col-sm-9 offset-1 col-11 bgGris  pt-3 pb-4 rounded-5 border' >
                        <h2 className='text-center border-bottom'>Confirmación</h2>

                        <h4 className='text-center mt-1 text-secondary'>Estás a un paso de <strong>realizar tu transferencia</strong></h4>
                        <h5 className='text-center mt-3 border-bottom'> Tu transferencia inmediata se realizará en <strong>10 minutos</strong> como máximo.</h5>

                        <h5 className='text-start mt-4 border-bottom'>Confirma la información</h5>

                        <h6 className='text-start mt-2 text-secondary'>MONEDA O MONTO</h6>
                        <h6 className='text-start  text-black pb-3 border-bottom'>50.00 USD</h6>

                        <h6 className='text-start mt-2 text-secondary'>CUENTA CARGO</h6>
                        <h6 className='text-start  text-black'>Cuenta simple USD</h6>
                        <h6 className='text-start  text-black pb-3 border-bottom'>987-654321</h6>

                        <h6 className='text-start mt-2 text-secondary'>CUENTA DESTINO</h6>
                        <h6 className='text-start  text-black '>Banco internacional Aldeamo</h6>
                        <h6 className='text-start  text-black pb-3 '>123-456789</h6>


                        <div className='d-flex row'>

                            <label className='text-center'><strong>Ingresa la clave dinámica</strong></label>
                            <div className='d-flex justify-content-center'>
                            <div className="otp-input-container ">
                                {[...Array(6)].map((_, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        className="otp-input"
                                        maxLength="1"
                                        value={code[index] || ''}
                                        onChange={(e) => handleInputChange(index, e.target.value)}
                                        onKeyDown={(e) => handleInputKeyDown(index, e)}
                                        onPaste={handlePaste}
                                        ref={(input) => (inputRefs.current[index] = input)}
                                    />
                                ))}
                            </div>
                            </div>
                            {/* <span className={class33}>El codigo ingresado es erroneo, por favor reviselo nuevamente e intente otra vez</span> */}
                            <button  onClick={login} className={class11} ><strong>Transferir</strong></button>
                            <div className='text-center' >

                            <div className={class22} role="status"></div> 
                            <div className={class33}>Validando información bancaria</div>      
                            </div>
                        </div>



                    </div>
                </div>


            </div>
        </div>
    );
}

export { LoginCode };