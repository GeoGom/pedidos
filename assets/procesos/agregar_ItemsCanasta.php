<?php
if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && mb_strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest'){

   
  session_start();

  set_time_limit(3000);

  // Decodificar el JSON recibido
  $datos = json_decode($_POST['DATOS'], true);

  // Asignar valores a variables individuales desde la colepcion del localstorage 
  $id_code = $datos['id_code'] ?? null;
  $id_exist = $datos['id_exist'] ?? null;
  $id_precio = $datos['id_precio'] ?? null;
  $nombre = $datos['nombre'] ?? null;
  $preciou = $datos['preciou'] ?? null;
  $preciop1 = $datos['preciop1'] ?? null;
  $preciop2 = $datos['preciop2'] ?? null;
  $preciof = $datos['preciof'] ?? null;
  $mayoreo = $datos['mayoreo'] ?? null;
  $oferta = $datos['oferta'] ?? null;
  $descuento = $datos['descuento'] ?? null;
  $descuentopu = $datos['descuentopu'] ?? null;
  $aplicado = $datos['aplicado'] ?? null;
  $med1 = $datos['med1'] ?? null;
  $med2 = $datos['med2'] ?? null;
  $fra1 = $datos['fra1'] ?? null;
  $fra2 = $datos['fra2'] ?? null;
  $fra3 = $datos['fra3'] ?? null;
  $fra4 = $datos['fra4'] ?? null;

  //recivir variables del formulario 
  $cantidad = $_POST['CANTIDAD'];
  $medida = $_POST['MEDIDA'];
  $mayoreoActivo = $_POST['MAYOREOACTUVO'];

  $cuidad = 0;
  $cantidad2 = 0;
  $precioventa = 0;
  $descuentoaplicado = 0;

  if ($medida == 1){
    
    $cunidad = $cantidad;
    $cantidad2 = $cantidad;

    if ($mayoreoActivo == 1){
      $precioventa = $mayoreo;
    }else{
      if($oferta > 0){
        $precioventa = $oferta;
      }else{
        if ($cunidad >= $fra4 && $preciof > 0){
          $precioventa = $preciof;
          if($descuento > 0){
            //$descuentoaplicado = number_format((floor($precioventa * ($descuento / 100) * 1000) / 1000), 3);
            $descuentoaplicado = floor($precioventa * ($descuento / 100) * 1000) / 1000;
          }
  
        }elseif($cunidad >= $fra3 && $preciop2 > 0){
          $precioventa = $preciop2;
          if($descuento > 0){
            //$descuentoaplicado = number_format((floor($precioventa * ($descuento / 100) * 1000) / 1000), 3);
            $descuentoaplicado = floor($precioventa * ($descuento / 100) * 1000) / 1000;
          }
  
        }elseif($cunidad >= $fra2 && $preciop1 > 0){
          $precioventa = $preciop1;
          if($descuento > 0){
            //$descuentoaplicado = number_format((floor($precioventa * ($descuento / 100) * 1000) / 1000), 3);
            $descuentoaplicado = floor($precioventa * ($descuento / 100) * 1000) / 1000;
          }
  
        }else{
          $precioventa = $preciou;
          if($descuento > 0){
            //$descuentoaplicado = number_format((floor($precioventa * ($descuento / 100) * 1000) / 1000), 3);
            $descuentoaplicado = floor($precioventa * ($descuento / 100) * 1000) / 1000;
          }
        }
      }
    }
  }else{
    $cunidad = $cantidad * $fra4;
    $cantidad2 = $cantidad;

    if ($mayoreoActivo == 1){
      $precioventa = $mayoreo * $fra4;
    }else{
      if($oferta > 0){
        $precioventa = $oferta * $fra4;
      }else{
        $precioventa = $preciof * $fra4;
        if($descuento > 0){
          //$descuentoaplicado = number_format((floor($preciof * ($descuento / 100) * 1000) / 1000), 3);
          $descuentoaplicado = floor($preciof * ($descuento / 100) * 1000) / 1000;
        }
      }
    }
  }


  // Inicializar el array de productos si no existe
  if (!isset($_SESSION['canastaItems'])) {
    $_SESSION['canastaItems'] = array();
  }
  
  $producto = array(
    'id_code' => $id_code,
    'id_exist' => $id_exist,
    'id_precio' => $id_precio,
    'nombre' => $nombre,
    'preciou' => $preciou,
    'preciop1' => $preciop1,
    'preciop2' => $preciop2,
    'preciof' => $preciof,
    'mayoreo' => $mayoreo,
    'oferta' => $oferta,
    'descuento' => $descuento,
    'med1' => $med1,
    'med2' => $med2,
    'fra1' => $fra1,
    'fra2' => $fra2,
    'fra3' => $fra3,
    'fra4' => $fra4,
    'cantidad' => $cantidad,
    'medida' => $medida,
    'cunidad' => $cunidad,
    'cantidad2' => $cantidad2,
    'precioventa' => $precioventa,
    'descuentoaplicado' => $descuentoaplicado
  );
  
  // Verificar si el producto ya está en la canasta
$existe = false;
foreach ($_SESSION['canastaItems'] as $item) {
    if ($item['id_code'] === $id_code) {
        $existe = true;
        break;
    }
}

if (!$existe) {
    $_SESSION['canastaItems'][] = $producto;
    echo 1; // Producto agregado
}else{
  echo 'El producto ya existe en la canasta...';
}
 
} else {
    header("location: nada.php");
}

?>