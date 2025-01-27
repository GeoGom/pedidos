<?php
if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && mb_strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest'){

    session_start();
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



<a href="#" class="nav-link" style="float: left; " onclick="event.preventDefault();  pageLoad('seleccion_productos.php','#PageMaster')">< Regresar</a>
<a href="#" class="nav-link" style="float: right;" onclick="event.preventDefault();  SelectRecord('assets/procesos/cancelar_pedido.php','seleccion_cliente.php','#PageMaster')">Cancelar ></a>
<br><br>

<div class="py-5 text-center">
    <h2>Finalizar la Venta</h2>
  <!--  <p class="lead">
        Complete los datos del formulario para finalizar el registro de la venta.<br>
        En este punto todabia puede eliminar items de la canasta o regresar a la seleccion de productos para seguir agregando items.
    </p> -->
</div>


 
<?php /*
<div class="">
    <form class="needs-validation" novalidate>

        <div class="col-18">
            <label for="fecha" class="form-label">Fecha de entrega</label>
            <div class="input-group">
                <!-- <input type="text" class="form-control" id="fecha" placeholder="Selecciona una fecha" autocomplete="off"> -->
                <input type="date" id="fecha" name="fecha" class="form-control" placeholder="Selecciona una fecha">
                <span class="input-group-text">
                    <i class="bi bi-calendar3"></i> <!-- Ícono de calendario (opcional) -->
                </span>
            </div>
        </div>

        <hr class="my-4">

    </form>
</div>

*/ 
?>






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
    </span>

    </li>

<?php 
            $cc = 1;     
        }
    }
    
    $totalventa = $_SESSION['totalcanasta']['total'];
    $totalDescuento = $_SESSION['totalcanasta']['descuento'];
    
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

<form class="card p-2">
    <button type="button" onclick="guardarVenta('assets/procesos/guardar_venta.php','seleccion_cliente.php','#PageMaster')" class="btn btn-primary">Aceptar</button>
</form>

    

<br><br>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="/docs/5.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="assets/js/route360lite_main.js?V=1.1.25"></script>
<script src="assets/js/WebSockets.js?V=1.0.3"></script>


<!-- JS de Flatpickr -->
    <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
  <!-- JS para idioma español -->
  <script src="https://cdn.jsdelivr.net/npm/flatpickr/dist/l10n/es.js"></script>



<!-- JS de Bootstrap Datepicker -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap-datepicker@1.9.0/dist/js/bootstrap-datepicker.min.js"></script>

<!-- Traducción opcional para español -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap-datepicker@1.9.0/dist/locales/bootstrap-datepicker.es.min.js"></script>

<script>
    $(document).ready(function () {
      // Inicializar Flatpickr
      flatpickr("#datepicker", {
        locale: "es",            // Configura el idioma español
        dateFormat: "Y-m-d",     // Formato de fecha (ejemplo: 2024-12-31)
        defaultDate: "today",    // Fecha predeterminada: hoy
        altInput: true,          // Mostrar un input alternativo amigable
        altFormat: "F j, Y",     // Formato amigable para el input alternativo
        disableMobile: false     // Permitir compatibilidad con móviles
      });
    });
  </script>
<?php  
} else {
    header("location: nada.php");
}

?>