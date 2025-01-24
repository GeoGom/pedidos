<?php
if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && mb_strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest'){
  echo "<script>
  cargarListaPedidos();
</script>";
?>

<div class="my-3 p-3 bg-body rounded shadow-sm">
  <h6 class="border-bottom pb-2 mb-0">Lista de Pediso</h6>
  <audio id="notification-sound" src="audio/campana.mp3" preload="auto"></audio>
  
  <div id="resultDiv"></div>

</div>

<script src="assets/js/route360lite_main.js?v=1.1.17"></script>
<?php  

}

?>