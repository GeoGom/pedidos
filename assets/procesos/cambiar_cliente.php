<?php
  session_start();
  
// Eliminar únicamente la sesión 'cliente'
if (isset($_SESSION['cliente'])) {
    unset($_SESSION['cliente']);
}

// Verificar si fue eliminada
if (!isset($_SESSION['cliente'])) {
    echo 1;
} else {
    echo "No se pudo eliminar la sesión 'cliente'.";
}

?>