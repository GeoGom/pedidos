function SelectRecord(proceso,uri,div,data1 = null,data2 = null,data3 = null,data4 = null,data5 = null,data6 = null,data7 = null) {

    $.ajax({
        type: 'POST',
        url: proceso,
        data: {DATA1: data1, DATA2: data2, DATA3: data3, DATA4: data4, DATA5: data5, DATA6: data6, DATA7: data7},
        success: function(data) {
            if(data == 1){
                pageLoad(uri,div);
            }else{
                alert(data);
            }
            
        },
        error: function(error) {
            console.log('Error en la solicitud AJAX: ', error);
        }
    });
}


//CLIENTES VARIOS 
function clientesVarios() {
    $('#modal-clientesVarios').modal('show');
    $('#nombre').val('');
}

$(document).ready(function() {
    $('#btn-agregarClientesVarios').click(function() {
        var nombre = $('#nombre').val();
        
        // Validar que la cantidad no esté vacía y sea un número positivo
        if (nombre == '') {
            $('#tabla-msg').html('Debe escribir el nombre del cliente.');
            return; // Salir si la validación falla
        }

        $.ajax({
            type: 'POST',
            url: 'assets/procesos/guardar_clientesVarios.php',
            data: {NOMBRE: nombre},
            success: function(response) {    
                if (response == 1) {
                    $('#modal-clientesVarios').modal('hide');
                    pageLoad('seleccion_productos.php', '#PageMaster');
                }else{
                    $('#tabla-msg').html(response);
                }
            },
            error: function(error) {
                console.error('Error en la solicitud AJAX: ', error);
            }
        });
    });
});

/*BUSCAR CLIENTES*/
$(document).ready(function(){
    $('#buscarcliente').on('input', function(){
        var cliente = $(this).val();
        $.ajax({
            type: 'POST',
            url: 'assets/procesos/buscar_cliente.php',
            data: {CLIENTE: cliente},
            success: function(data){	
                $('#tabla-buscar-cliente').html(data);
                  
            },
            error: function(error) {
                console.error('Error en la solicitud AJAX: ', error);
            }
        });
    });
});

/*BUSCAR PRODUCTOS*/
$(document).ready(function(){
    $('#buscarproducto').on('input', function(){
        var producto = $(this).val();
        $.ajax({
            type: 'POST',
            url: 'assets/procesos/buscar_productos.php',
            data: {PRODUCTO: producto},
            success: function(data){	
                $('#tabla-buscar-producto').html(data);
                  
            },
            error: function(error) {
                console.error('Error en la solicitud AJAX: ', error);
            }
        });
    });
});

/*BUSCAR PRODUCTOS -- con tecla ENTER*/
$(document).ready(function(){	
	$('#buscarproducto').keypress(function(event){
        if(event.which == 13 ) { // 13 es el código de la tecla Enter
            event.preventDefault(); // Evita que se envíe el formulario
              
        
        }
    });
});




/// GUARDAR ID CODE MEIRTAS SE AGREGA PRODUCTO A CANASTA ////
function selectItems(data1,data2,data3,data4,data5,data6,data7,data8,data9,data10,
    data11,data12,data13,data14,data15,data16,data17,data18,data19,aplicaMayoreo) {

    $('#tabla-precio-mayoreo').html('');
    $('#cantidad').val('');
    $('#medida1').prop('checked', true);
    let producto = {
        id_code: data1,
        id_exist: data2,
        id_precio: data3,
        nombre: data4,
        preciou: data5,
        preciop1: data6,
        preciop2: data7,
        preciof: data8,
        mayoreo: data9,
        oferta: data10,
        descuento: data11,
        descuentopu: data12,
        aplicado: data13,
        med1: data14,
        med2: data15,
        fra1: data16,
        fra2: data17,
        fra3: data18,
        fra4: data19
    };
    
    var aplicaDescuento = 0;
    var aplicapromo = 0;
    
    if(data10 > 0){ aplicapromo = 1; }
    if(data11 > 0){ aplicaDescuento = 1; }

    localStorage.setItem('PRODUCTO', JSON.stringify(producto));

    $('#modal-agregarCanasta').modal('show');
    $('#tabla-precio-msg').html('');
    
    if(aplicaMayoreo == 1 && aplicaDescuento == 0 && aplicapromo == 0 && data9 > 0){
        var cargando = "<div class='form-check'><input type='checkbox' class='form-check-input' id='mayoreoActivo' name='mayoreoActivo' value='1'><label class='form-check-label' for='same-address'>Aplicar precio de mayoreo a este producto</label></div>";
        $('#tabla-precio-mayoreo').html(cargando);
    }

    
}

/// AGREGAR EL PRODUCTO A LA CANASTA ///
$(document).ready(function() {
    $('#btn-agregarCanasta').click(function() {
        var cantidad = $('#cantidad').val();
        
        
        // Validar que la cantidad no esté vacía y sea un número positivo
        if (!cantidad || isNaN(cantidad) || parseFloat(cantidad) < 0.01) {
            $('#tabla-precio-msg').html('La cantidad es requerida para continuar.');
            return; // Salir si la validación falla
        }
        
        // Capturar el valor del radio seleccionado
        const medida = $('input[name="medida"]:checked').val();
        const mayoreoActivo = $('#mayoreoActivo').is(':checked') ? 1 : 0; // 1 si está marcado, 0 si no
        let data = JSON.parse(localStorage.getItem("PRODUCTO"));

        $.ajax({
            type: 'POST',
            url: 'assets/procesos/agregar_ItemsCanasta.php',
            data: { DATOS: JSON.stringify(data), CANTIDAD: cantidad, MEDIDA: medida, MAYOREOACTUVO: mayoreoActivo },
            success: function(response) {    
                if (response == 1) {
                    $('#modal-agregarCanasta').modal('hide');
                    pageLoad('seleccion_productos.php', '#PageMaster');
                }else{
                    $('#tabla-precio-msg').html(response);
                }
            },
            error: function(error) {
                console.error('Error en la solicitud AJAX: ', error);
            }
        });
    });
});