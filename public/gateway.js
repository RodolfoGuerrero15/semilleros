const elementosGateway = document.querySelectorAll('[id^="gateway"]');
let id=0;

document.addEventListener('DOMContentLoaded',()=>{
    const numGateways=elementosGateway.length;
    for(i=0;i<numGateways;i++){
        fetch(`/obtenerSemillerosAsociados?id=${i+1}`, {
            method: 'GET',
            // Puedes agregar más opciones, como encabezados, según tus necesidades.
          })
          .then(response => {
            if (response.ok) {
              // La solicitud fue exitosa, puedes realizar acciones adicionales aquí si es necesario.
              console.log('Solicitud GET exitosa');
              return response.json();
            } else {
              console.error('Error en la solicitud GET');
            }
          })
          .then((data)=>{
            console.log(data)
            const idsSeparadosPorComas = data.map(obj => obj.id).join(',');
            elementosGateway[id].innerHTML=idsSeparadosPorComas
            id++;
          })
          .catch(error => {
            console.error('Error en la solicitud GET:', error);
          }); 
    }
})
