<?php
if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && mb_strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest'){

  session_start();

  if (isset($_SESSION['cliente']) && !empty($_SESSION['cliente'])) {
    // Generar un script de JavaScript para llamar a la función
    echo "<script>
            pageLoad('seleccion_productos.php', '#PageMaster');
          </script>";
    exit; // Detener la ejecución del script PHP después de generar el JavaScript
  
  }

?>

<h2>Seleccion del Cliente</h2>
<p>Busque al cliente por su Nombre, Apellido, DUI, NIT o NRC</p>

<form class="d-flex mt-3 mt-lg-0" role="search">
  <input id="buscarcliente" name="buscarcliente" class="form-control me-2" type="search" placeholder="Buscar cliente" aria-label="Buscar">
  <button type="button" onclick="clientesVarios()" class="btn btn-primary">
    Continuar con Clientes Varios
  </button>
</form>

<div id="tabla-buscar-cliente" name="tabla-buscar-cliente"></div>

<p></p>

<script src="assets/js/route360lite_main.js?v=1.1.15"></script>
<?php  
} else {
  echo "<script>
  pageLoad('seleccion_cliente.php', '#PageMaster');
</script>";
}

?>