<?php
  session_start();
  
// Eliminar únicamente la sesión 'cliente'
if (isset($_SESSION['cliente'])) {
    unset($_SESSION['cliente']);
}

// Eliminar únicamente la sesión 'canastaItems'
if (isset($_SESSION['canastaItems'])) {
    unset($_SESSION['canastaItems']);
}

// Eliminar únicamente la sesión 'totalcanasta'
if (isset($_SESSION['totalcanasta'])) {
    unset($_SESSION['totalcanasta']);
}




// Verificar si fue eliminada
if (!isset($_SESSION['cliente'])&&!isset($_SESSION['canastaItems'])&&!isset($_SESSION['totalcanasta'])) {
    echo 1;
} else {
    echo "No se pudo canclar el pedido.";
}

?>