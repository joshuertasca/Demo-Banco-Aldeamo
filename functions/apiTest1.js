exports.handler = async function(event, context) {
  // Obtener el parámetro de la URL
  const numero = event.path.split("/").pop();

  // Compara el número recibido y responde con el código correspondiente
  let codigo;
  if (numero === '573114610919') {
    codigo = "12345";
  } else {
    codigo = "00000";
  }

  // Retorna la respuesta en formato JSON
  return {
    statusCode: 200,
    body: JSON.stringify({ codigo: codigo }),
  };
};
