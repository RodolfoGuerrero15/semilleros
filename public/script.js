var client = mqtt.connect('ws://192.168.1.5:9001/mqtt', { // Reemplaza "tu_servidor_mqtt" con la URL de tu servidor MQTT
    port: 9001,
    protocol: 'ws',
    rejectUnauthorized: false, // Opcionalmente, establece a true si no deseas aceptar certificados no confiables
  });

  client.on('connect', () => {
    console.log('Conexión MQTT exitosa');
});

document.addEventListener('DOMContentLoaded', () => {
    const obtenerDatosBtn = document.getElementById('obtenerDatos');
    const listaDatos = document.getElementById('listaDatos');
  
    obtenerDatosBtn.addEventListener('click', async () => {
      try {
        const response = await fetch('/api/ultimos-datos');
        const data = await response.json();
        console.log(data)
  
        listaDatos.innerHTML = ''; // Limpiar la lista antes de añadir los nuevos datos
  
        data.forEach(dato => {
          const li = document.createElement('li');
          li.textContent = `ID: ${dato.id}, Valor: ${dato.temperatura}`;
          listaDatos.appendChild(li);
        });
      } catch (error) {
        console.error(error);
      }
    });
  });

  document.addEventListener('DOMContentLoaded', () => {
    const enviarDatosBtn = document.getElementById('enviarDatos');
    const temperaturaInput = document.getElementById('temperaturaInput');
    const humedadRelInput = document.getElementById('humedadRelInput');
    const humedadSueloInput = document.getElementById('humedadSueloInput');
    const luminosidadInput = document.getElementById('luminosidadInput');
  
  
    enviarDatosBtn.addEventListener('click', () => {
      const datos = {
        temperatura: parseFloat(temperaturaInput.value),
        'humedad-rel': parseFloat(humedadRelInput.value),
        'humedad-suelo': parseFloat(humedadSueloInput.value),
        luminosidad: parseFloat(luminosidadInput.value)
      };
  
      // Publica los datos en el tópico MQTT
      client.publish('datos_semillero1', JSON.stringify(datos));
  
      // Limpia los inputs después de enviar los datos
      temperaturaInput.value = '';
      humedadRelInput.value = '';
      humedadSueloInput.value = '';
      luminosidadInput.value = '';
    });
  
    // ... (código para suscribirse y mostrar datos recibidos en la interfaz de usuario)
  });