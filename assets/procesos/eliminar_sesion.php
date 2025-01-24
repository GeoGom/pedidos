<?php

session_start();
session_unset(); // Eliminar todas las variables de sesión
session_destroy(); // Destruir la sesión
echo json_encode(['success' => true]); // Respuesta en JSON

?>