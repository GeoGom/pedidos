///////////////////////////
////                   ////
////    WebSockets     ////
////                   ////
///////////////////////////


// Construir dinámicamente la URL del WebSocket
var wsProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
var wsHost = window.location.hostname; // Obtiene el hostname dinámico (localhost, IP, o dominio)
var wsPort = '8081'; // Puerto del WebSocket
var wsPath = '/pedidos'; // Ruta del WebSocket
var socket = new WebSocket(wsProtocol + wsHost + ':' + wsPort + wsPath);

/// GUARDAR PRODUCTOS DE CANASTA ///
function guardarVenta(proceso,uri,div) {
    //var fecha = $('#fecha').val();


    $.ajax({
        type: 'POST',
        url: proceso,
        //data: {FECHA: fecha},
        success: function(data) {
            if(data == 1){
                
                pageLoad(uri,div);
                socket.send('update');
            }else{
                alert(data);
            }
            
        },
        error: function(error) {
            console.log('Error en la solicitud AJAX: ', error);
        }
    });
    
}

// Función que se ejecuta cuando se recibe un mensaje del servidor
socket.onmessage = function(event) {
   var message = event.data;


   // Verificar si el mensaje contiene la palabra "update"
   if (message.includes("update")) {
       console.log("Mensaje recibido: 'update'. Enviando solicitud AJAX...");
       document.getElementById('notification-sound').play();

       // ejecutamos la funcion que carga los datos 
       cargarListaPedidos();
   }
};

