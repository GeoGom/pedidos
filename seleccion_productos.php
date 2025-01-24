<?php
if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && mb_strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest'){

  session_start();

  if (isset($_SESSION['cliente']) && !empty($_SESSION['cliente'])) {
    $cliente = $_SESSION['cliente']['nombre'];
    $direccion = $_SESSION['cliente']['direccion'];
  }else{
    // Generar un script de JavaScript para llamar a la función
    echo "<script>
            pageLoad('seleccion_cliente.php', '#PageMaster');
          </script>";
    exit; // Detener la ejecución del script PHP después de generar el JavaScript
  }
  $itemCount = 0;
  $total = 0;
  $totalventa = 0;
  $totalDescuento = 0;
  $descuento = 0;
  $totalItem = 0;
  if (isset($_SESSION['canastaItems']) && !empty($_SESSION['canastaItems'])) {
    $itemCount = count($_SESSION['canastaItems']);
  }

?>
<a href="#" class="nav-link" style="float: left;" onclick="event.preventDefault();  SelectRecord('assets/procesos/cambiar_cliente.php','seleccion_cliente.php','#PageMaster')">< Cambiar cliente</a>
<a href="#" class="nav-link" style="float: right;" onclick="event.preventDefault();  SelectRecord('assets/procesos/cancelar_pedido.php','seleccion_cliente.php','#PageMaster')">Cancelar ></a>
<br><br>

<h5><?php echo $cliente; ?></h5>
<p><?php echo $direccion; ?></p>



<br>
<p>Agregar productos a canasta:</p>
<form class="d-flex mt-3 mt-lg-0" role="search">
  <input id="buscarproducto" name="buscarproducto" class="form-control me-2" type="search" placeholder="Buscar productos" aria-label="Buscar">
</form>
<br>



<div id="tabla-buscar-producto" name="tabla-buscar-producto"></div>




<p></p>


    <h4 class="d-flex justify-content-between align-items-center mb-3">
      <span class="text-primary">Productos en carrito</span>
      <span class="badge bg-primary rounded-pill"><?php echo $itemCount; ?></span>
    </h4>
    <ul class="list-group mb-3">
    <?php 
    $cc = 1;
    if (isset($_SESSION['canastaItems']) && !empty($_SESSION['canastaItems'])) {
      foreach ($_SESSION['canastaItems'] as $productos) {  
        if($cc == 1){
    ?>
      <li class="list-group-item d-flex justify-content-between lh-sm">
        <div>
          <h6 class="my-0"><?php echo $productos['nombre'];  ?></h6>
          <small class="text-body-secondary">
          <?php
            if ($productos['medida']==1){
              $total = $productos['cunidad'] * ($productos['precioventa']-$productos['descuentoaplicado']);
              $descuento = $productos['cunidad'] * $productos['descuentoaplicado'];
              $totalItem = $productos['cunidad'] * $productos['precioventa'];
              echo 'Cant: '.$productos['cunidad'].' ['.$productos['med1'].'] -- P/U: $'.number_format($productos['precioventa'],2).' -- Total: $'.number_format($totalItem,2).' -- Desc/U: $-'.number_format($productos['descuentoaplicado'],3).' -- Desc/T $-'.number_format($descuento,2);
            }else{
              $descuento = $productos['cunidad'] * $productos['descuentoaplicado'];
              $total = ($productos['cantidad2'] * $productos['precioventa'])-$descuento;
              $totalItem = $productos['cantidad2'] * $productos['precioventa'];
              echo 'Cant: '.$productos['cantidad2'].' ['.$productos['med2'].'] -- P/U: $'.number_format($productos['precioventa'],2).' -- Total: $'.number_format($totalItem,2).' -- Des/U: $-'.number_format($productos['descuentoaplicado'],3).' -- Desc/T $-'.number_format($descuento,2);
            }  
            
          ?>
          </small>
        </div>

        <span class="text-body-secondary">
          <?php echo '$'.number_format($total,2,'.',','); ?>
          <small class="text-body-secondary">
          <a href="#" class="nav-link"  onclick="event.preventDefault();  SelectRecord('assets/procesos/eliminar_ItemsCanasta.php','seleccion_productos.php','#PageMaster','<?php echo $productos['id_code']; ?>')">
            Eliminar 
          </a>
          </small>
        </span>

      </li>

    <?php 
          $cc = 2;
        }else{
    ?>

      <li class="list-group-item d-flex justify-content-between bg-body-tertiary">
        <div class="text-body-secondary">
          <h6 class="my-0">
            <?php echo $productos['nombre'];  ?>
          </h6>
          <small>
          <?php
            if ($productos['medida']==1){
              $total = $productos['cunidad'] * ($productos['precioventa']-$productos['descuentoaplicado']);
              $descuento = $productos['cunidad'] * $productos['descuentoaplicado'];
              $totalItem = $productos['cunidad'] * $productos['precioventa'];
              echo 'Cant: '.$productos['cunidad'].' ['.$productos['med1'].'] -- P/U: $'.number_format($productos['precioventa'],2).' -- Total: $'.number_format($totalItem,2).' -- Desc/U: $-'.number_format($productos['descuentoaplicado'],3).' -- Desc/T $-'.number_format($descuento,2);
            }else{
              $descuento = $productos['cunidad'] * $productos['descuentoaplicado'];
              $total = ($productos['cantidad2'] * $productos['precioventa'])-$descuento;
              $totalItem = $productos['cantidad2'] * $productos['precioventa'];
              echo 'Cant: '.$productos['cantidad2'].' ['.$productos['med2'].'] -- P/U: $'.number_format($productos['precioventa'],2).' -- Total: $'.number_format($totalItem,2).' -- Des/U: $-'.number_format($productos['descuentoaplicado'],3).' -- Desc/T $-'.number_format($descuento,2);
            } 
            
          ?>
          </small>
        </div>

        <span class="text-body-secondary">
          <?php echo '$'.number_format($total,2,'.',','); ?>
          <small class="text-body-secondary">
          <a href="#" class="nav-link"  onclick="event.preventDefault();  SelectRecord('assets/procesos/eliminar_ItemsCanasta.php','seleccion_productos.php','#PageMaster','<?php echo $productos['id_code']; ?>')">
            Eliminar 
          </a>
          </small>
        </span>

      </li>

    <?php 
          $cc = 1;     
        }
        $totalventa += $total;
        $totalDescuento += $descuento;
        $_SESSION['totalcanasta'] =  [
          'total' => $totalventa,
          'descuento' => $totalDescuento
          ];
      }
      if($cc == 1){
      
    ?>
      <li class="list-group-item d-flex justify-content-between lh-sm">
        <div class="text-success">
          <h6 class="my-0">
            Total de Descuentos:
          </h6>
        </div>
        <span class="text-success"><?php echo '$ -'.number_format($totalDescuento,2,'.',','); ?></span>
      </li>
    <?php
      }else{
    ?>

      <li class="list-group-item d-flex justify-content-between bg-body-tertiary">
        <div class="text-success">
          <h6 class="my-0">
            Total Descuentos:
          </h6>
        </div>
        <span class="text-success"><?php echo '$ -'.number_format($totalDescuento,2,'.',','); ?></span>
      </li>

    <?php
      }
    }
    ?>
      

      <li class="list-group-item d-flex justify-content-between">
        <span>Total de la Venta (USD)</span>
        <strong><?php echo '$'.number_format($totalventa,2,'.',','); ?></strong>
      </li>
    </ul>
    <?php 
      if($totalventa > 0){
    ?>
    <form class="card p-2">
        <button type="button" onclick="pageLoad('finalizar_venta.php','#PageMaster')" class="btn btn-primary">Realizar Venta</button>
    </form>
    <?php 
      }
    ?>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="/docs/5.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="assets/js/route360lite_main.js?1.1.15"></script>
<?php  
} else {
  echo "<script>
  pageLoad('seleccion_cliente.php', '#PageMaster');
</script>";
}

?>