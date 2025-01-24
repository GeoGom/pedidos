<?php
if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && mb_strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest'){

   
  session_start();

  set_time_limit(3000);

  $id = $_POST['DATA1'];
  $nombre = $_POST['DATA2'];
  $direccion = $_POST['DATA3'];
  $mayoreo = $_POST['DATA4'];

  $id_v = $_SESSION['Route360Lite']['id_v'];  

  
  $_SESSION['cliente'] =  [
                          'id_c' => $id,
                          'id_v' => $id_v,
                          'nombre' => $nombre,
                          'direccion' => $direccion,
                          'mayoreo' => $mayoreo
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