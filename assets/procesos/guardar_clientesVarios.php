<?php
if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && mb_strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest'){

   
  session_start();

  set_time_limit(3000);

  $nombre = $_POST['NOMBRE'];
  $nombre = strtoupper($nombre);

  $id_v = $_SESSION['Route360Lite']['id_v'];  

  
  $_SESSION['cliente'] =  [
                          'id_c' => '1',
                          'id_v' => $id_v,
                          'nombre' => $nombre,
                          'direccion' => '',
                          'mayoreo' => '0'
                          ];
    
  if (isset($_SESSION['cliente'])) {
    echo 1;
  } else {
      echo "Error al seleccionar el cliente.";
  }                      
 
} else {
    header("location: nada.php");
}

?>