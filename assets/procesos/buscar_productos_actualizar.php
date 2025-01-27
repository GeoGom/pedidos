<?php
if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && mb_strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest'){

    include("conexion_mysql.php");
    set_time_limit(3000);
    session_start();

    $aplica_mayoreo = 0;

    $filtro = isset($_POST['PRODUCTO']) ? $_POST['PRODUCTO'] : '';

    $ns_select = $_SESSION['Route360Lite']['ns'];
    
    $consulta="SELECT
    c.id_code AS ID,
    ex.id_exist as ID_EXIST,
    pre.id_precio as ID_PRECIO,
    c.descrip AS NOMBRE,
    round(pre.pu1, 2) AS PRECIOU,
    round(pre.pu2, 2) AS PRECIOP1,
    round(pre.pu3, 2) AS PRECIOP2,
    round(pre.pu4, 2) AS PRECIOF,
    c.prec_mayoreo as MAYOREO,
    ifnull((select round(ofer.pu9, 2) from precio_oferta as ofer where ofer.si_hay = 0 and ofer.id_exist = ex.id_exist and ofer.ns = $ns_select and CURDATE() BETWEEN ofer.fecha1 AND ofer.fecha2), 0.00) as PRECIO_OFER,
    pre.df1 AS DESCUENTO,
    truncate(((pre.pu1 * pre.fra1) * (pre.df1 / 100)),2) AS DESCUENTOPU,
	round(pre.pu1 - (truncate((pre.pu1 * (pre.df1 / 100)),3)),2) AS APLICADO,
    pre.med1 as MED1,
    pre.med4 as MED2,
    pre.fra1 AS FRA1,
    pre.fra2 AS FRA2,
    pre.fra3 AS FRA3,
    pre.fra4 AS FRA4,
    c.codigo as CODBARRA
    FROM codigosp c
    inner join existencia ex on c.id_code = ex.id_code
    inner join precios pre on ex.id_precio = pre.id_precio
    left join referencias as r on r.codigo = c.codigo
    WHERE ex.ns = '$ns_select' and c.codigo = '$filtro' and c.nmf = 0
    or ex.ns = '$ns_select' and  r.referencia = '$filtro' and c.nmf = 0
    or ex.ns = '$ns_select' and c.nmf = 0  and  c.descrip like '%".$filtro."%' 
    or ex.ns = '$ns_select' and  c.id_code = '$filtro'  and c.nmf = 0
    group by c.id_code LIMIT 100";

    $data_consulta = mysqli_query($conexion, $consulta);

    if (mysqli_num_rows($data_consulta) > 0 && $filtro != '') {
      
      echo '<div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">';

      while ($row = mysqli_fetch_assoc($data_consulta)) {
          $id = $row['ID'];
          $nombre = $row['NOMBRE'];
          $preciou = $row['PRECIOU'];

?>
<div class="col">
    <div class="card shadow-sm">
         
        <img class="card-img-top" 
             src="http://localhost/pedidos/img/@<?php echo $row['ID']; ?>.jpg" 
             alt="Imagen de <?php echo $row['NOMBRE']; ?>" 
             style="width: 100%; height: 225px; object-fit: cover;" 
             onerror="this.onerror=null; this.src='http://localhost/pedidos/img/imgnull.jpg';">
        <div class="card-body">
            <p class="card-text"><?php echo $row['NOMBRE']; ?></p>
            <p class="card-text"><?php echo $row['CODBARRA'].'['.$row['ID'].']'; ?></p>
            <?php  
                if($row['PRECIO_OFER'] > 0){
            ?>
            <p class="card-text">
                <?php echo 'PRECIO DE PROMOCION: $'.number_format($row['PRECIO_OFER'],2); ?>
                <br>
                Antes: <?php echo '$'.number_format($row['PRECIOU'],2).'p/u'; ?>         
            </p>
            <?php        
                }elseif($row['DESCUENTO'] > 0){
            ?>
            <table class="table">
            <thead>
                <tr>
                <th>PRES.</th>
                <th>P/UNIT.</th>
                <th>% DESC.</th>
                <th>TOTAL</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <td><?php echo $row['MED1'].' ['.$row['FRA1'].']'; ?></td>
                <td><?php echo '$'.number_format($row['PRECIOU'],2); ?></td>
                <td><?php echo $row['DESCUENTO'].'%'; ?></td>
                <td><?php echo number_format(($row['PRECIOU'] - (floor($row['PRECIOU'] * ($row['DESCUENTO'] / 100) * 1000) / 1000))*$row['FRA1'], 2);  ?></td>
                </tr>
                <tr>
                <td><?php echo $row['MED1'].' ['.$row['FRA2'].']'; ?></td>
                <td><?php echo '$'.number_format($row['PRECIOP1'],2); ?></td>
                <td><?php echo $row['DESCUENTO'].'%'; ?></td>
                <td><?php echo number_format(($row['PRECIOP1'] - (floor($row['PRECIOP1'] * ($row['DESCUENTO'] / 100) * 1000) / 1000))*$row['FRA2'], 2); ?></td>
                </tr>
                <tr>
                <td><?php echo $row['MED1'].' ['.$row['FRA3'].']'; ?></td>
                <td><?php echo '$'.number_format($row['PRECIOP2'],2); ?></td>
                <td><?php echo $row['DESCUENTO'].'%'; ?></td>
                <td><?php echo number_format(($row['PRECIOP2'] - (floor($row['PRECIOP2'] * ($row['DESCUENTO'] / 100) * 1000) / 1000))*$row['FRA3'], 2); ?></td>
                </tr>
                <tr>
                <td><?php echo $row['MED2'].' ['.$row['FRA4'].']'; ?></td>
                <td><?php echo '$'.number_format($row['PRECIOF'],2); ?></td>
                <td><?php echo $row['DESCUENTO'].'%'; ?></td>
                <td><?php echo number_format(($row['PRECIOF'] - (floor($row['PRECIOF'] * ($row['DESCUENTO'] / 100) * 1000) / 1000))*$row['FRA4'], 2); ?></td>
                </tr>
            </tbody>
            </table>
            <?php  
                    if($aplica_mayoreo != '0'){
                        echo '<p class="card-text">PRECIO DE MAYOREO: $'.number_format($row['MAYOREO'],2).'</p>';
                    }

                }else{
            ?>
            <table class="table">
            <thead>
                <tr>
                <th>P/U</th>
                <th>P/<?php echo $row['FRA2'].'(+)'; ?></th>
                <th>P/<?php echo $row['FRA3'].'(+)'; ?></th>
                <th>F <?php echo '['.$row['FRA4'].'-'.$row['MED2'].']'; ?></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <td><?php echo '$'.number_format($row['PRECIOU'],2); ?></td>
                <td><?php echo '$'.number_format($row['PRECIOP1'],2); ?></td>
                <td><?php echo '$'.number_format($row['PRECIOP2'],2); ?></td>
                <td><?php echo '$'.number_format($row['PRECIOF']*$row['FRA4'],2); ?></td>
                </tr>
            </tbody>
            </table>
            <?php  
                    if($aplica_mayoreo != '0' && $row['MAYOREO'] > 0){
                        
                        echo '<p class="card-text">PRECIO DE MAYOREO: $'.number_format($row['MAYOREO'],2).'</p>';
                    }        
                }
            ?>
            <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                    <button type="button" 
                        class="btn btn-sm btn-outline-success" 
                        onclick="selectItemsActualizar(
                                            '<?php echo $row['ID']; ?>'
                                            )" >
                        Seleccionar Producto >
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>


<?php

        }
      
        echo '</div>';
    }elseif($filtro == ''){
        echo "<script>
            pageLoad('actualizar_catalogo.php', '#PageMaster');
          </script>";
        exit; // Detener la ejecución del script PHP después de generar el JavaScript
    }else{
?>
<div class="bg-body-tertiary p-3 rounded" id="tabla-search" name="tabla-search">
  <div class="mx-auto">
    Producto no encontrado....
  </div>
</div>
<?php
    }



} else {
    header("location: nada.php");
}

?>