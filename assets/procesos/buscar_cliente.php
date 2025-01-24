<?php
if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && mb_strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest'){

    include("conexion_mysql.php");

    set_time_limit(3000);

    $cliente = isset($_POST['CLIENTE']) ? $_POST['CLIENTE'] : '';
    
    $consulta="SELECT
    id_cliente AS ID,
    nomcli AS NOMBRE,
    concat(trim(dir2),' ',trim(depart),', ',trim(munici)) as DIRECCION,
    p_mayoreo_ruta as MAYOREO
    FROM qclientes
    WHERE nomcli like '%".$cliente."%' LIMIT 50";

    $data_consulta = mysqli_query($conexion, $consulta);


    if (mysqli_num_rows($data_consulta) > 0 && $cliente != '') {
        while ($row = mysqli_fetch_assoc($data_consulta)) {
            $id = $row['ID'];
            $nombre = $row['NOMBRE'];
            $direccion = $row['DIRECCION'];
            $mayoreo = $row['MAYOREO'];

?>

<div onclick="SelectRecord('assets/procesos/guardar_cliente.php','seleccion_cliente.php','#PageMaster','<?php echo $id; ?>','<?php echo $nombre; ?>','<?php echo $direccion; ?>','<?php echo $mayoreo; ?>')" class="bg-body-tertiary p-3 rounded" id="tabla-search" name="tabla-search" style="margin: 5px; padding: 5px;">
  <div class="mx-auto" >
    <?php echo $nombre; ?>
    <br><?php echo $direccion; ?>
  </div>
</div>
<?php
        }
    }elseif($cliente == ''){

    }else{
      ?>
      <div class="bg-body-tertiary p-3 rounded" id="tabla-search" name="tabla-search">
        <div class="mx-auto">
          Cliente no encontrado....
        </div>
      </div>
      <?php
    }
} else {
    header("location: nada.php");
}

?>