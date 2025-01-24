<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Receptor WebSocket</title>
</head>
<body>
    <h1>Mensajes recibidos:</h1>
    <ul id="messages"></ul>
    <script>
        // Conectar al servidor WebSocket
        var socket = new WebSocket('ws://10.243.141.63:8080/pedidos'); // Cambia a la IP de tu servidor

        // Función que se ejecuta cuando se recibe un mensaje del servidor
        socket.onmessage = function(event) {
            var messagesList = document.getElementById('messages');
            var newMessage = document.createElement('li');
            newMessage.textContent = event.data;
            messagesList.appendChild(newMessage);
        };

        // Opcional: manejo de errores y conexión
        socket.onerror = function(error) {
            console.error("Error en WebSocket:", error);
        };

        socket.onclose = function() {
            console.log("Conexión WebSocket cerrada");
        };
    </script>
</body>
</html>
