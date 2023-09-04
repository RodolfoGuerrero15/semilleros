const ctx = document.getElementById('myChart');
document.addEventListener('DOMContentLoaded', () => {
    const dataForm = document.getElementById('dataForm');
    
    

    dataForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const numero = document.getElementById('numero').value;
        const fecha = document.getElementById('fecha').value;
        const variable = document.getElementById('variable').value;

        try {
            const response = await fetch('/registro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ numero, fecha,variable })
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log(responseData)
                let variable_recibida = []
                let fecha =[]
                responseData.forEach((objeto)=>{
                  switch (variable) {
                    case "temperatura":
                      variable_recibida.push(objeto.temperatura)
                      break;
                    case "humedad_rel":
                      variable_recibida.push(objeto.humedad_rel)
                      break;
                    case "luminosidad":
                      variable_recibida.push(objeto.luminosidad)
                      break;
                    case "humedad_suelo":
                      variable_recibida.push(objeto.humedad_suelo)
                      break;
                    default:
                      console.log("Opción no reconocida");
                  }
                  fecha.push(objeto.fecha_hora)
                })
                ActualizarGrafico(grafico,fecha,variable_recibida,variable)
            } else {
                console.error('Error en la respuesta del servidor');
            }
        } catch (error) {
            console.error('Error en la comunicación con el servidor:', error);
        }
    });

    
});

var grafico = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Grafica",
        data: [],
        borderWidth: 1,
        borderColor: '#009688',
        backgroundColor: '#009688'
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

function ActualizarGrafico(grafico,fecha,variable,nombre){
  grafico.data.datasets[0].label= nombre
  grafico.data.datasets[0].data=[]
  grafico.data.labels= fecha
  let i=0;
  console.log(variable)
  while(i<variable.length){
  grafico.data.datasets.forEach((dataset) => {
    dataset.data.push(variable[i]);
  });
  i++;
}
  grafico.update();
}