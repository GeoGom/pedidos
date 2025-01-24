<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Chat WebSocket</title>
</head>
<body>
    <input type="text" id="message" placeholder="Escribe un mensaje...">
    <button onclick="sendMessage()">Enviar</button>
    <script>
        var socket = new WebSocket('ws://10.243.141.63:8080/pedidos');

        socket.onmessage = function(event) {
            console.log("Mensaje del servidor: ", event.data);
        };

        function sendMessage() {
            var message = document.getElementById('message').value;
            socket.send(message);
        }
    </script>
</body>
</html>
