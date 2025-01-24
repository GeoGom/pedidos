<?php

require __DIR__ . '/vendor/autoload.php';

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use Ratchet\App;

class WebSocketServer implements MessageComponentInterface {
    protected $connections = []; // Lista de conexiones activas

    public function onOpen(ConnectionInterface $conn) {
        $this->connections[$conn->resourceId] = $conn;
        //echo "Nueva conexión: {$conn->resourceId}\n";
    }

    public function onMessage(ConnectionInterface $from, $msg) {
        //echo "Mensaje recibido de {$from->resourceId}: $msg\n";
        foreach ($this->connections as $client) {
            if ($from !== $client) {
                $client->send($msg);
            }
        }
    }

    public function onClose(ConnectionInterface $conn) {
        unset($this->connections[$conn->resourceId]);
        //echo "Conexión cerrada: {$conn->resourceId}\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "Error: {$e->getMessage()}\n";
        $conn->close();
    }
}

// Configurar el servidor WebSocket
$app = new App('127.0.0.1', 8081, '0.0.0.0'); // Inicia el servidor en ws://ip_servidor:8080
$app->route('/pedidos', new WebSocketServer(), ['*']); // Define la ruta "/pedidos"

// Mensaje indicando que el servidor está corriendo
echo "Servidor WebSocket corriendo en ws://127.0.0.1:8081/pedidos\n";

// Iniciar el servidor
$app->run();

?>
