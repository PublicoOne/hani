const soap = require('soap');

// URL del WSDL de la API de CFE (deberías obtener el WSDL específico o la URL correcta)
const url = 'https://www.cfe.mx/_vti_bin/search.asmx?WSDL';

// Definición de los parámetros necesarios para la solicitud SOAP (en este caso, el queryXml)
const args = {
  queryXml: '<query>tu_consulta_aqui</query>'
};

// Crear el cliente SOAP
soap.createClient(url, function (err, client) {
  if (err) {
    console.log('Error al crear cliente SOAP:', err);
    return;
  }

  // Llamar a la operación GetQuerySuggestions con los parámetros definidos
  client.GetQuerySuggestions(args, function (err, result) {
    if (err) {
      console.log('Error al realizar la solicitud SOAP:', err);
      return;
    }

    // Mostrar la respuesta
    console.log('Respuesta de la API:', result);
  });
});
