<?php
if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && mb_strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest'){

  include("conexion_mysql.php");
  session_start();
  
  set_time_limit(3000);
  
  date_default_timezone_set("America/El_Salvador"); // Ajusta según tu ubicación
  $fecha = date("Y-m-d");
  $ns_select = $_SESSION['Route360Lite']['ns'];
    
  $consulta="SELECT 
  pg.id_pedido as PEDIDO,
  CASE
    WHEN pg.id_cliente = 1 THEN pg.pg_cliente_vc
    ELSE qc.nomcli
  END AS CLIENTE, 
  pg.total as TOTAL  
  from pedidosg as pg
  inner join qclientes as qc on pg.id_cliente = qc.id_cliente
  where pg.fecha = '$fecha' and pg.ns='$ns_select'
  order by pg.id ASC";

  $data_consulta = mysqli_query($conexion, $consulta);


  if (mysqli_num_rows($data_consulta) > 0 ) {
    while ($row = mysqli_fetch_assoc($data_consulta)) {
?>
      <div class="d-flex text-body-secondary pt-3">
        <div class="pb-3 mb-0 small lh-sm border-bottom w-100">
          <div class="d-flex justify-content-between">
            <strong class="text-gray-dark"> <?php echo $row['CLIENTE']; ?> </strong>
            $ <?php echo $row['TOTAL']; ?>
          </div>
          <span class="d-block">Pedidos #: <?php echo $row['PEDIDO']; ?></span>
        </div>
      </div>
<?php
    }
  }  
} else {
    header("location: nada.php");
}

?>