<?php
if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && mb_strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest'){

   
session_start();

set_time_limit(3000);

$id = $_POST['DATA1'];

// Función para eliminar un producto del array por id_producto
function eliminarProducto($data) {
    $productoEliminado = false; // Indicador para saber si se eliminó un producto
    foreach ($_SESSION['canastaItems'] as $key => $producto) {
        if ($producto['id_code'] == $data) {
            unset($_SESSION['canastaItems'][$key]);
            // Reindexar el array para evitar huecos en los índices
            $_SESSION['canastaItems'] = array_values($_SESSION['canastaItems']);
            $productoEliminado = true; // Marcamos que se eliminó un producto
            break;
        }
    }
    return $productoEliminado; // Retornamos si se eliminó un producto o no
}

// Llamar a la función y verificar si se eliminó el producto
if (eliminarProducto($id)) {
    echo 1; // Producto eliminado exitosamente
} else {
    echo 'El producto no puedo ser eliminado..'; // Producto no encontrado o no eliminado
}
 
} else {
    header("location: nada.php");
}

?>