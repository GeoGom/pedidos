<?php
if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && mb_strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest'){

?>

<h2>Actualizar Catalogo</h2>
<p>Busque y seleccone el producto al cual decea agregarle o actualizarle la imagen del catalogo.</p>

<form class="d-flex mt-3 mt-lg-0" role="search">
  <input id="buscarproductoActualizar" name="buscarproductoActualizar" class="form-control me-2" type="search" placeholder="Buscar productos" aria-label="Buscar">
</form>
<br>

<div id="tabla-buscar-producto-Actualizar" name="tabla-buscar-producto-Actualizar"></div>





<script src="assets/js/uploadImg.js"></script>
<?php  
} else {
  echo "<script>
  pageLoad('seleccion_cliente.php', '#PageMaster');
</script>";
}

?>