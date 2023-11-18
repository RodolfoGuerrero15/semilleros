const spanEstado=document.getElementById('estado_sem');
const elementosSemillero = document.querySelectorAll('[id^="estado_sem"]');
const estadohtml= document.querySelectorAll('[id^="estado_html"]');
document.addEventListener("DOMContentLoaded",()=>{
    actualizarEstado();
})
const actualizarEstado=()=>{
    fetch(`/actualizarEstado`, {
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
        elementosSemillero.forEach((elemento=>{
            
            id=parseInt(elemento.id.charAt(elemento.id.length - 1));
            console.log(id)
            estadohtml[id-1].innerHTML=data[id-1].estado_semillero
            if(data[id-1].estado_semillero=='ON'){
                elemento.style.background='green';
                
            }
            else{
                elemento.style.background='red';
            }

        }))
      })
      .catch(error => {
        console.error('Error en la solicitud GET:', error);
      });
}

const intervalo=setInterval(actualizarEstado,30000);