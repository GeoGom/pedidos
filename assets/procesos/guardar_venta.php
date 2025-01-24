<?php
if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && mb_strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
    include("conexion_mysql.php");

    session_start();
    set_time_limit(3000);
    date_default_timezone_set("America/El_Salvador"); // Ajusta según tu ubicación

    $ns_select = $_SESSION['Route360Lite']['ns'];

    $fecha = date("Y-m-d");
    $hora = date("g:i:A");
    //$fecha_entrega = $_POST['FECHA'];
    //$fecha_entrega = date("Y-m-d", strtotime($fecha_entrega));

    $totalventa = $_SESSION['totalcanasta']['total'];
    $descuento = $_SESSION['totalcanasta']['descuento'];
    $id_v = $_SESSION['cliente']['id_v'];
    $id_c = $_SESSION['cliente']['id_c'];
    $nombre = $_SESSION['cliente']['nombre'];
    $id_e = $_SESSION['Route360Lite']['id_e'];

    // Iniciar transacción
    mysqli_begin_transaction($conexion, MYSQLI_TRANS_START_READ_WRITE);

    try {
        //$sql = "INSERT INTO pedidosg (id_cliente, id_vende, fecha, ns, hora, total, descu, fecha_entrega, pg_cliente_vc) 
        //VALUES ($id_c, $id_v, '$fecha', '$ns_select', '$hora', $totalventa, $descuento, '$fecha_entrega', '$nombre')";
        $sql = "INSERT INTO pedidosg (id_cliente, id_vende, fecha, ns, hora, total, descu, pg_cliente_vc) 
        VALUES ($id_c, $id_v, '$fecha', '$ns_select', '$hora', $totalventa, $descuento, '$nombre')";

        if (!mysqli_query($conexion, $sql)) {
            throw new Exception("Error al insertar en pedidosg: " . mysqli_error($conexion));
        }

        $id = mysqli_insert_id($conexion);
        $id_pedido = $ns_select . $id;

        $actualiza = "UPDATE pedidosg SET id_pedido = $id_pedido WHERE id = $id";

        if (!mysqli_query($conexion, $actualiza)) {
            throw new Exception("Error al actualizar id_pedido en pedidosg: " . mysqli_error($conexion));
        }

        foreach ($_SESSION['canastaItems'] as $productos) {
            $descuentoItem = $productos['cunidad'] * $productos['descuentoaplicado'];

            $query = "INSERT INTO pedidosd (id_exist, id_precio, id_pedido, medida, cantid, preciou, descue, cunidad, hora)
            VALUES ({$productos['id_exist']}, {$productos['id_precio']}, $id_pedido, {$productos['medida']}, {$productos['cantidad2']}, 
            {$productos['precioventa']}, $descuentoItem, {$productos['cunidad']}, '$hora')";

            if (!mysqli_query($conexion, $query)) {
                throw new Exception("Error al insertar en pedidosd: " . mysqli_error($conexion));
            }
        }

        // Si todo salió bien, confirmar la transacción
        mysqli_commit($conexion);
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
        echo 1; // Todo finalizó correctamente
    } catch (Exception $e) {
        // En caso de error, revertir la transacción
        mysqli_rollback($conexion);
        error_log($e->getMessage()); // Registrar el error para depuración
        echo 'Error al procesar los registros de la venta'; // Hubo un problema
    }
} else {
    header("location: nada.php");
}
?>
