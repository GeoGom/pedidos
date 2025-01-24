/*CARGAR PAGIASN CON O SIN VARIABLES 
<button onclick="cargarPagina('pagina.html', 'variable=123')">Cargar Página con Variable</button>
<a href="#" onclick="cargarPagina('otraPagina.html')">Cargar Otra Página con Variable</a>
*/

function cargarPagina(pagina, variable) {
    var url = pagina;

    // Obtener la variable 'ns' desde localStorage
    var ns = localStorage.getItem('NS');

    // Verificar si 'ns' tiene un valor y agregarla como parámetro en la URL
    if (ns) {
        if (variable) {
            url += "?" + variable + "&NsLocal=" + encodeURIComponent(ns);
        } else {
            url += "?NsLocal=" + encodeURIComponent(ns);
        }
    } else if (variable) {
        url += "?" + variable;
    }

    // Intentar acceder al iframe en el documento actual
    var iframe = document.getElementById("mypage");
    
    if (!iframe) {
        // Si no se encuentra, intentar acceder al iframe desde el documento padre
        try {
            iframe = parent.document.getElementById("mypage");
        } catch (e) {
            console.error("Error al intentar acceder al frame en el documento padre:", e);
        }
    }

    if (iframe) {
        iframe.src = url;
    } else {
        console.error("No se pudo encontrar el frame con el id 'mypage'.");
    }
}


function newPage(pagina, variable) {

    var url = pagina;

    if (variable) {
        url = pagina + "?" + variable;
    }
    
    window.open(url, '_blank');
}

function newPopupPage(pagina, formName, width = 600, height = 400) {

    var form = document.forms[formName];
    var ns = localStorage.getItem('NS');

    if (!form) {
        console.error("Formulario con el nombre '" + formName + "' no encontrado.");
        return;
    }

    // Serializa los datos del formulario
    var formData = new FormData(form);
    var serializedData = new URLSearchParams();

    for (var [key, value] of formData.entries()) {
        serializedData.append(key, value);
    }

    // Abre la ventana emergente
    var left = (screen.width - width) / 2;
    var top = (screen.height - height) / 2;

    var popup = window.open(
        '',
        '_blank',
        `width=${width},height=${height},left=${left},top=${top},resizable=no,scrollbars=no,toolbar=no,menubar=no,location=no,status=no`
    );

    // Crear un formulario dinámico en la ventana emergente y enviarlo automáticamente
    var popupDocument = popup.document;
    popupDocument.open();
    popupDocument.write(`
        <html>
            <body>
                <form id="popupForm" action="${pagina}" method="POST" style="display:none;">
                    <input type="hidden" name="NS" value="${ns}" />
                    ${Array.from(serializedData.entries())
                        .map(
                            ([key, value]) =>
                                `<input type="hidden" name="${key}" value="${value}" />`
                        )
                        .join('')}
                        
                </form>
                <script>
                    document.getElementById('popupForm').submit();
                </script>
            </body>
        </html>
    `);
    popupDocument.close();
}


function cerrar(url){
    window.location.href = url;
}


//FUNCIONES PARA VARIABLES PERMANENTES DE localStorage

function loadData() {
    // Recuperar los valores de localStorage
    var ns = localStorage.getItem('NS');
    var nombre = localStorage.getItem('SUCURSAL');
    
    if (ns !== null && nombre !== null) {
        // Mostrar los valores en el div
        document.getElementById('Muestra-Sucursal').innerHTML = nombre;
        if ($('#warning-Sucursal').hasClass('show')) {
            $('#warning-Sucursal').modal('hide');
        }
    } else {
        // Mostrar los valores en el div
        document.getElementById('Muestra-Sucursal').innerHTML = 'No a seleccionado una Sucursal';
        if ($('#warning-Sucursal').hasClass('show')) {
            $('#warning-Sucursal').modal('hide');
        }
    }
}

function saveData(ns,nombre) {

    // Almacenar los valores en localStorage
    localStorage.setItem('NS', ns);
    localStorage.setItem('SUCURSAL', nombre);

    loadData();
}

///////// IMPRECION DE CONTENIDO DE UNA VARIABLE ////////


function printsData(variable) {
    let miVariable = variable
    let ventanaImpresion = window.open("", "_blank"); // Abre una nueva ventana
    ventanaImpresion.document.write(`
        <html>
        <head>
            <title>Impresión</title>
            <style>
                @media print {
                    @page {
                        size: letter portrait;
                        margin: 3mm;
                    }
                }
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                }
                pre {
                    white-space: pre-wrap; 
                }
            </style>
        </head>
        <body>
            <pre>${miVariable}</pre>
        </body>
        </html>
    `);
    ventanaImpresion.document.close(); // Cierra el documento para finalizar su escritura
    ventanaImpresion.print(); // Activa el cuadro de diálogo de impresión
    ventanaImpresion.close(); // Cierra la ventana después de la impresión

}


////////////////////// VALIDAR PRIVILEGIOS -  ///////////////////
// Valida privilegios de usuario segun la sucursal seleccionada y valida los privilegios de inventario 

function modalshow(accion1,accion2,variable) {

    $.ajax({
        type: 'POST',
        url: accion2,
        data: {VARIABLE: variable},
        success: function(response) {
            
            $(accion1).modal('show');
            //cargar datos de response en formato html dentro de una div del modal 
        },
        error: function(error) {
            console.log('Error en proceso: ', error);
        }
    });
}

//Captura el id de la ventan al precionar el boton editar
function validarPrivilegios(funcion, accion1, tipo, atributo, msg, variable = null, accion2 = null) {
    localStorage.setItem('FUNCION', funcion);
    localStorage.setItem('ACCION1', accion1);
    localStorage.setItem('TIPO', tipo);
    localStorage.setItem('ATRIBUTO', atributo);
    localStorage.setItem('MSG', msg);
    
    // Si variable no es nula, la guarda en localStorage
    if (variable !== null) {
        localStorage.setItem('VARIABLE', variable);
    }else{
        localStorage.setItem('VARIABLE', 'null');
    }

    if (accion2 !== null) {
        localStorage.setItem('ACCION2', accion2);
    }else{
        localStorage.setItem('ACCION2', 'null');
    }
    
    

    $('#login-modal').modal('show');
    
}

//Validar privilegios - al precionar el boton
$(document).ready(function(){
    $('#btn-validar-password').click(function(){

        var clave = $('#clave_valida').val(); //octine la variable de la password

        var ns = localStorage.getItem('NS'); //octiene el ns actual en el sistema 

        var accion1 = localStorage.getItem('ACCION1'); //octiene url de destino o nombre del modal o pagina de proceso
        var accion2 = localStorage.getItem('ACCION2'); //octiene url de destino o nombre del modal o pagina de proceso - en caso de que haya un segundo url para el modal o proceso
        var tipo = localStorage.getItem('TIPO');
        var atributo = localStorage.getItem('ATRIBUTO');
        var msg = localStorage.getItem('MSG');
        var funcion = localStorage.getItem('FUNCION');
        var variable = localStorage.getItem('VARIABLE');

        /*
        la funcion puede ser 
        modal: para mostrar un modal X si el data de ajax retorna 1
        pagina: para redireccionar a una pagina diferente 
        proceso: ejecuta un ajax con un proceso x usando la variable opcional de la funcion 
        */

        
        $('#clave_valida').val('');

        $.ajax({
            type: 'POST',
            url: 'assets/procesos/validar_password.php',
            data: {CLAVE: clave, NS: ns, TIPO: tipo, ATRIBUTO: atributo},
            success: function(data){

                if (data == 1){
                    switch (funcion) {
                        case 'pagina':
                            cargarPagina(accion1);
                            break;
                        case 'modal':
                         
                            //modalshow(accion1,accion2,variable);
                            break;
                        case 'proceso':
                            $.ajax({
                                type: 'POST',
                                url: accion1,
                                data: {VARIABLE: variable},
                                success: function(response) {
                                    if(response == 1){
                                        $('#success-alert-modal').modal('show');
                                    }else{

                                    }

                                },
                                error: function(error) {
                                    console.log('Error en proceso: ', error);
                                }
                            });
                            
                            break;
                        default:
                            console.log('No se seleccionó ninguna opción válida');
                            break;
                    }
                
                    
                  
                }else{
                    
                    $('#warning-alert-modal').modal('show');
                    $('#msg-warning-alert-modal').html(msg);
                
                }
            }
        }); 
    });
});
//Validar privilegios - al precionar la tecla enter sobre el campo de texto
$(document).ready(function(){	
    $('#clave_valida').keypress(function(event){
        if(event.which == 13 ) { // 13 es el código de la tecla Enter
            event.preventDefault(); // Evita que se envíe el formulario

            $('#login-modal').modal('hide');

            var clave = $('#clave_valida').val(); //octine la variable de la password

            var ns = localStorage.getItem('NS'); //octiene el ns actual en el sistema 

            var accion1 = localStorage.getItem('ACCION1'); //octiene url de destino o nombre del modal o pagina de proceso
            var accion2 = localStorage.getItem('ACCION2'); //octiene url de destino o nombre del modal o pagina de proceso - en caso de que haya un segundo url para el modal o proceso
            var tipo = localStorage.getItem('TIPO');
            var atributo = localStorage.getItem('ATRIBUTO');
            var msg = localStorage.getItem('MSG');
            var funcion = localStorage.getItem('FUNCION');
            var variable = localStorage.getItem('VARIABLE');

            /*
            la funcion puede ser 
            modal: para mostrar un modal X si el data de ajax retorna 1
            pagina: para redireccionar a una pagina diferente 
            proceso: ejecuta un ajax con un proceso x usando la variable opcional de la funcion 
            */

            
            $('#clave_valida').val('');

            $.ajax({
                type: 'POST',
                url: 'assets/procesos/validar_password.php',
                data: {CLAVE: clave, NS: ns, TIPO: tipo, ATRIBUTO: atributo},
                success: function(data){

                    if (data == 1){
                        switch (funcion) {
                            case 'pagina':
                                cargarPagina(accion1);
                                break;
                            case 'modal':
                                alert('se ejecutara ajax para abrir modal con datos de modificacion');
                                //modalshow(accion1,accion2,variable);
                                break;
                            case 'proceso':
                                // Realizar una petición Ajax para la opción 3
                                alert('se ejecutara ajax con proceso');
                                /*
                                $.ajax({
                                    url: accion1,
                                    method: 'POST',
                                    success: function(response) {
                                        //acciones
                                    },
                                    error: function(error) {
                                        console.log('Error en proceso: ', error);
                                    }
                                });
                                */
                                break;
                            default:
                                console.log('No se seleccionó ninguna opción válida');
                                break;
                        }
                    
                        
                    
                    }else{
                        
                        $('#warning-alert-modal').modal('show');
                        $('#msg-warning-alert-modal').html(msg);
                    
                    }
                }
            });


        }
    });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////
////                                        ////
////    INVENTARIO APP - CODIGO PARA APP    ////
////                                        ////
////////////////////////////////////////////////


//GENERAR CODIGO DE INVENTARIO
function codInventario(ns, fecha, tipo, cod) {
    $.ajax({
        type: 'POST',
        url: 'assets/procesos/codInventario.php',
        data:  {
            NS: ns,
            FECHA: fecha,
            TIPO: tipo,
            COD: cod
        },
        success: function(data){	
            //$('#tabla_inventarioApp').html(data);
            
            const button = document.getElementById('btn-inventarioApp');
            button.innerHTML = 'Generar Codigo de Inventario';
            button.disabled = false;
            if (data == 1){
                var msg = 'El codigo fue generado satisfactoriamente.';
                $('#success-alert-modal').modal('show');
                $('#msg-success-alert-modal').html(msg);
            }else if (data == 2){
                var msg = 'Existe un codigo activo para esta sucursal.';
                $('#warning-alert-modal2').modal('show');
                $('#msg-warning-alert-modal2').html(msg);
            }else{
                var msg = 'No se pudo generar el codigo.';
                $('#warning-alert-modal').modal('show');
                $('#msg-warning-alert-modal').html(msg);
            }  
            

        }
    });
}

$(document).ready(function(){
    $('#btn-inventarioApp').click(function(){
        
        var fecha = $('#fecha').val();
        var tipo = $('#tipo').val();
        var ns = localStorage.getItem('NS');
        var cod = ns+tipo+fecha;
    
        if (ns !== null){

            if (fecha !== '' && fecha !== '0000-00-00' && tipo !== 'null'){
                const button = document.getElementById('btn-inventarioApp');
                button.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>Generando Codigo de Inventario...';
                button.disabled = true;
                codInventario(ns, fecha, tipo, cod);
            }else{
                var msg = 'La fecha y el tipo de inventario a realizar son requeridos para generar el codigo';
                $('#warning-alert-modal').modal('show');
                $('#msg-warning-alert-modal').html(msg);
            }
            
        }else{
            if (ns === null){
                var msg = 'Tu acceso es de tipo limitado, pide a alguien con privilegios de administrador que selecciona una sucursal';
                $('#warning-alert-modal').modal('show');
                $('#msg-warning-alert-modal').html(msg);
            }else{

                if (fecha !== '' && fecha !== '0000-00-00' && tipo !== 'null'){
                    const button = document.getElementById('btn-inventarioApp');
                    button.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>Generando Codigo de Inventario...';
                    button.disabled = true;
                    codInventario(ns, fecha, tipo, cod);
                }else{
                    var msg = 'La fecha y el tipo de inventario a realizar son requeridos para generar el codigo';
                    $('#warning-alert-modal').modal('show');
                    $('#msg-warning-alert-modal').html(msg);
                }
                
            }            
        }
        
    });

    
});

//ACTUALIZAR EL ESTADO DEL INVENTARIO 
function actualizarEstado(id, estado) {

    if (estado == 1){
        estado = 0;
    }else{
        estado = 1;
    }

    $.ajax({
        type: 'POST',
        url: 'assets/procesos/actualizarEstado_inventarioApp.php',
        data:  {
            ID: id,
            ESTADO: estado
        },
        success: function(data){	
            if(data == 1){
                cargarPagina('inventarioApp.php');
            }else{
                var msg = 'El estado del inventario no pudo ser actualizado.';
                $('#warning-alert-modal').modal('show');
                $('#msg-warning-alert-modal').html(msg);
            }
        }
    });
}






////////////////////////////////////////////////
////                                        ////
////    RECEPCION DE FACTURAS DE COMPRAS    ////
////                                        ////
////////////////////////////////////////////////


function buscarOrdenCompra(ns) {
    $.ajax({
        type: 'POST',
        url: 'assets/procesos/buscar_orden_compra.php',
        data: {NS: ns},
        success: function(data){	
            $('#tabla-control-factura-compra').html(data);
        }
    });
}

function formularioRegistroFactura(id) {
    $.ajax({
        type: 'POST',
        url: 'assets/procesos/formulario_control_factura_compra.php',
        data: {ID: id},
        success: function(data){	
            $('#tabla-control-factura-compra').html(data);
        }
    });
}


function registroFacturaCompra() {
    var urlPagina = 'control_factura_compra.php';

    // Capturar los valores directamente desde el DOM
    var orden = $('#id_orden').val();
    var serie = $('#serie').val();
    var documento = $('#documento').val();
    var entrega = $('#entrega').val();
    var fecha = $('#fecha').val();

    var ns = localStorage.getItem('NS');

    var hoy = new Date();
    var fechaActual = hoy.getFullYear() + '-' + 
                      ('0' + (hoy.getMonth() + 1)).slice(-2) + '-' + 
                      ('0' + hoy.getDate()).slice(-2);
    
    // Validar que los campos no estén vacíos o solo contengan espacios
    if (serie.trim() === '' || documento.trim() === '') {
        var msg = 'La serie y el número de documento son requeridos.';
        $('#warning-alert-modal').modal('show');
        $('#msg-warning-alert-modal').html(msg);
    } else {
        // Realizar el registro con AJAX
        $.ajax({
            type: 'POST',
            url: 'assets/procesos/resepcion_facturacompra.php',
            data: {ORDEN: orden, SERIE: serie, DOCUMENTO: documento, NS: ns, FECHA: fechaActual, FECHAF: fecha, ENTREGA: entrega},
            success: function(respuesta) {	
                if (respuesta == 1) {
                    cargarPagina(urlPagina);
                } else {

                    //var msg = 'Error inesperado!!. El registro no pudo ser guardado.';
                    var msg = respuesta;
                    $('#warning-alert-modal').modal('show');
                    $('#msg-warning-alert-modal').html(msg);
                }
            }
        });
    }
}




///////////// END   //////////////////////////////////////////////






//////////////////////////////////////////////////
////                                          ////
////    COMPRA/VENTA POR PROVEEDOR            ////
////                                          ////
//////////////////////////////////////////////////



$(document).ready(function(){
    $('#fechac1').on('input', function(){
        $('#fcompra').prop('checked', false);
        
    });
});


$(document).ready(function () {
    $('#fcompra').on('change', function () {
        if (this.checked) {

            var codeSelect = $('#nrc_proveedor');
            var hasOptions = codeSelect.find('option').length > 0; // Verifica si tiene opciones

            if (!hasOptions) {
                var msg = 'Busque y seleccione un proveedor.';
                $('#warning-alert-modal').modal('show');
                $('#msg-warning-alert-modal').html(msg);

                $('#fcompra').prop('checked', false);
                return false;
            }

            var ns = localStorage.getItem('NS');

            var id = $('#nrc_proveedor option:selected').attr('data-id'); // El valor del data-id del proveedor

            if (id === '0') {
                var msg = 'Busque y seleccione un proveedor.';
                $('#warning-alert-modal').modal('show');
                $('#msg-warning-alert-modal').html(msg);
                $('#fcompra').prop('checked', false);
            } else {
                $.ajax({
                    type: 'POST',
                    url: 'assets/procesos/buscar_UltimaCompra_proveedor.php',
                    data: { ID: id, NS: ns },
                    success: function (data) {
                        if (data == 0) {
                            var msg = 'No hay registros de compras de este proveedor';
                            $('#warning-alert-modal').modal('show');
                            $('#msg-warning-alert-modal').html(msg);
                            $('#fcompra').prop('checked', false);
                        } else {
                            const today = new Date();
                            const hoy = today.toISOString().split('T')[0]; // Formato Y-m-d

                            $('#fechac1').val(data);
                            $('#fechac2').val(hoy);
                        }
                    },
                    error: function (xhr, status, error) {
                        console.error('Error en la solicitud AJAX:', error);
                    }
                });
            }
        }
    });
});




function buscarCompraVentas_proveedor(fecha1,fecha2,id,ns, ns_actual) {
    $.ajax({
        type: 'POST',
        url: 'assets/procesos/buscar_CompraVentas_proveedor.php',
        data: {F1: fecha1, F2: fecha2, ID: id, NS: ns, ACTUAL: ns_actual},
        success: function(data){	

            $('#fcompra').prop('checked', false);
            
            $('#tabla-compra-venta-proveedor').html(data);

            const button = document.getElementById('btn-compra-venta-proveedor');
            button.innerHTML = 'Generar Consulta';
            button.disabled = false;
        }
    });
}

/*Mostrar lista de cambios de precio al seleccionar origen de datos*/
$(document).ready(function(){
    $('#btn-compra-venta-proveedor').click(function(){

        var codeSelect = $('#nrc_proveedor');
        var hasOptions = codeSelect.find('option').length > 0; // Verifica si tiene opciones

        if (!hasOptions) {
            var msg = 'Busque y seleccione un proveedor.';
            $('#warning-alert-modal').modal('show');
            $('#msg-warning-alert-modal').html(msg);
            $('#fcompra').prop('checked', false);
            return false;
        }
        

        // Obtener valor del select y el data-id del proveedor seleccionado

        var id = $('#nrc_proveedor option:selected').attr('data-id'); // El valor del data-id del proveedor
        var fecha1 = $('#fechac1').val();
        var fecha2 = $('#fechac2').val();

        var ns = $('#ns_data').val();

        var ns_actual = localStorage.getItem('NS');

        if (id === '0'){
            var msg = 'Busque y seleccione un proveedor.';
            $('#warning-alert-modal').modal('show');
            $('#msg-warning-alert-modal').html(msg);
            $('#fcompra').prop('checked', false);
        }else{
            if (fecha1 <= fecha2){ 

                var cargando = "<div class='col-lg-6'><div class='spinner-grow avatar-md text-secondary m-2' role='status'></div></div>";

                $('#tabla-compra-venta-proveedor').html(cargando);
                
                const button = document.getElementById('btn-compra-venta-proveedor');
                button.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>Cargando...';
                button.disabled = true;

                buscarCompraVentas_proveedor(fecha1,fecha2,id,ns, ns_actual);

            }else{
                var msg = 'El rango de fecha no a sido definido correctamente.';
                $('#warning-alert-modal').modal('show');
                $('#msg-warning-alert-modal').html(msg);
                $('#fcompra').prop('checked', false);
            }
        }

      

    });

    
});


















/*CARGA EL PANEL DE CONTROL CON LOS DATOS DEL ULTIMO CONTRATO QUE SE BUSCO*/
function CargarContrato(clienteId) {
    $.ajax({
        type: 'POST',
        url: 'assets/procesos/buscar_contrato_ampliacion.php',
        data: {cliente2: clienteId},
        success: function(data){	
            $('#tabla').html(data);
        }
    });
}

/*Eliminar contratos, ampliaciones */
function eliminarPanel(ID_cliente, ID_registro) {
    $.ajax({
        type: 'POST',
        url: 'assets/procesos/eliminar_panel.php',
        data: {Eliminar: ID_registro},
        success: function(respuesta){	
            if(respuesta == 1){
                buscarContrato(ID_cliente);
            }else{
                alert(respuesta);
            }
        }
    });

    function buscarContrato(clienteId) {
        $.ajax({
            type: 'POST',
            url: 'assets/procesos/buscar_contrato_ampliacion.php',
            data: {cliente2: clienteId},
            success: function(data){
                $('#tabla').html(data);
            }
        });
    }

}







/*Eliminar PRODUCTOS */
function eliminarProducto(ID_contrato, ID_registro) {
    variable = 'ID=' + ID_contrato;
    urlPagina = 'ver_producto.php';
    $.ajax({
        type: 'POST',
        url: 'assets/procesos/eliminar_producto.php',
        data: {Eliminar: ID_registro},
        success: function(respuesta){	
            if(respuesta == 1){
                cargarPagina(urlPagina, variable);
            }else{
                alert(respuesta);
            }
        }
    });
}


/*ACTUALIZAR PRODUCTOS*/
$(document).ready(function(){	
	$('#btn-actualizar-productos').click(function(){
		var formActualizarProductos = $('#form-editar-producto').serialize();	
		
		$.ajax({url:'assets/procesos/actualizar_productos.php',
			type:'POST',
			dataType:'html',
			data:formActualizarProductos,
			success:function(respuesta){		
				if(respuesta==1){
                    $('#success-alert-modal').modal('show');
				}else{
                    $('#warning-alert-modal').modal('show');
				}
			}
		});
		
		return false;
	});
});


/*Eliminar contratos y ampliaciones completo */
function eliminarPanelCompleto(ID_cliente, ID_registro) {
    $.ajax({
        type: 'POST',
        url: 'assets/procesos/eliminar_contrato_ampleacion_completo.php',
        data: {Eliminar: ID_registro},
        success: function(respuesta){	
            if(respuesta == 1){
                buscarContrato(ID_cliente);
            }else{
                alert(respuesta);
            }
        }
    });

    function buscarContrato(clienteId) {
        $.ajax({
            type: 'POST',
            url: 'assets/procesos/buscar_contrato_ampliacion.php',
            data: {cliente2: clienteId},
            success: function(data){
                $('#tabla').html(data);
            }
        });
    }

}



/*BUSCAR CLIENTES*/
$(document).ready(function(){
    //si avilitamos la funcon de esta forma cargaria todo desde el principio
   // buscarClientes();
    $('#filtrocliente').on('input', function(){
        buscarClientes($(this).val());
    });

    function buscarClientes(filtro = '') {
        $.ajax({
            type: 'POST',
            url: 'assets/procesos/buscar_clientes.php',
            data: {filtroCliente: filtro},
            success: function(data){	
                $('#cliente').html(data);
            }
        });
    }
});







/*BUSCAR BTN*/
$(document).ready(function(){
    $('#btn').on('input', function(){
        buscarTNproductos($(this).val());
    });

    function buscarTNproductos(filtro = '') {
        var ns = localStorage.getItem('NS');
        $.ajax({
            type: 'POST',
            url: 'assets/procesos/buscar_btn.php',
            data: {Btn: filtro, NS: ns},
            success: function(data){	
                $('#code').html(data);
            }
        });
    }
});



/*Actauliza el datos de cantidad en existencia del formulario de productos */
$(document).ready(function(){
    $('#cantidad').on('input', function(){
        $('#existencia').val($(this).val());
    });
});



/*BUSCAR PRODUCTOS DEL CONTRATO*/
$(document).ready(function(){

    // ejecutar la consulta total desde el principio 
    // buscarProductos();

    $('#productoContrato').on('input', function(){
        let IDContrato = $('#contratoID').val();
        buscarProductos($(this).val(), IDContrato);
    });

    function buscarProductos(filtro = '', contrato = '') {
        $.ajax({
            type: 'POST',
            url: 'assets/procesos/buscar_producto_contrato.php',
            data: {Buscar: filtro, Contrato: contrato},
            success: function(data){	
                $('#productoID').html(data);
            }
        });
    }
});


////////////////////////////////////////
////                                ////
////    DEPURACION DE PRODUCTOS     ////
////                                ////
////////////////////////////////////////

/*BUSCAR PROVEEDORESD PARA DEPURACION DE CODIGO*/
$(document).ready(function(){
  
    $('#proveedor').on('input', function(){
        buscarProveedor($(this).val());
    });

    function buscarProveedor(filtro = '') {
        $.ajax({
            type: 'POST',
            url: 'assets/procesos/buscar_proveedor.php',
            data: {proveedor: filtro},
            success: function(data){	
                $('#nrc_proveedor').html(data);
            }
        });
    }
});

/*CARGA LOS PRODUCTOS POR PROVEEDOR PARA SU DEPURACION*/
function buscarDepuracionItems(busca) {
    $.ajax({
        type: 'POST',
        url: 'assets/procesos/depuracion_items.php',
        data: {nrc: busca},
        success: function(data){	
            $('#tabla_depuracion').html(data);
        }
    });
}

/*BUSCAR PRODUCTOS AL SELECCIONAR EL PROVEEDOR */
$(document).ready(function(){
    $('#nrc_proveedor').change(function(){
        var nrc = $(this).val();
        if(nrc) {
            buscarDepuracionItems(nrc);
        } else {
            $('#tabla_depuracion').empty();
        }
    });


});

/*DEPURA LOS PRODDUCTOS CAMBIANDOLO A NO FACTURABLE */
function Depurar(ID,NRC,OPCION,EX) {
    var existencia = EX;
    if(existencia == 0){ 
        $.ajax({
            type: 'POST',
            url: 'assets/procesos/depurador.php',
            data: {codigo: ID, accion: OPCION},
            success: function(data){	
                if(data==1){
                    buscarDepuracionItems(NRC);
                }else{
                    alert(data);
                }
            }
        });
    }else{
        $(document).ready(function(){
            $('#warning-alert-modal').modal('show');

            $('#warning-alert-modal').on('hidden.bs.modal', function () {
                $('#accordion-modal').modal('show');
    
                $.ajax({
                    type: 'POST',
                    url: 'assets/procesos/info_data.php',
                    data: { codigo: ID },
                    success: function(data) {	
                        $('#tabla-InfoData').html(data);
                    }
                });
            });
        });
    }
    

}

/*REACTIVA LOS PRODDUCTOS CAMBIANDOLO A FACTURABLE */
function Reactivar(ID,NRC,OPCION) {
    $.ajax({
        type: 'POST',
        url: 'assets/procesos/reactivador.php',
        data: {codigo: ID, accion: OPCION},
        success: function(data){	
            if(data==1){
                buscarDepuracionItems(NRC);
            }else{
                alert(data);
            }
        }
    });
}

/* VISTA DE INFORMACION EN FORMA DE ACORDION */
function InfoData(ID) {
    $(document).ready(function(){
        $('#accordion-modal').modal('show');
        
        $.ajax({
            type: 'POST',
            url: 'assets/procesos/info_data.php',
            data: {codigo: ID},
            success: function(data){	
                $('#tabla-InfoData').html(data);
            }
        });
    });   
}


////    FIN DE DEPURACION DE CODIGOS    ////////////////////////////////////////////////////////////////






////////////////////////////////////////
////                                ////
////    COTIZACIONES                ////
////                                ////
////////////////////////////////////////

function buscarCotizacion() {
    var nota = $('#nota').val();
    var fecha = $('#fecha').val();
    var valides = $('#valides').val();
    
    var info = $('#info').val();
    var saludo = $('#saludo').val();
    
    var detacliente = $('#cliente').val();

    var remitente = $('#remitente').val();
    var cargo = $('#cargo').val();
    var contacto = $('#contacto').val();

    var fontSize = $('#fontSize').val();

    // Capturar el valor del radio seleccionado
    const seleccion = $('input[name="diceño"]:checked').val();
    
    var ns = localStorage.getItem('NS');
    $.ajax({
        type: 'POST',
        url: 'assets/procesos/buscar_cotizacion.php',
        data: {
            NOTA: nota, 
            FECHA: fecha, 
            VALIDES: valides, 
            INFO: info, 
            datac: detacliente, 
            SALUDO: saludo, 
            NS: ns, 
            REMITENTE: remitente, 
            CARGO: cargo, 
            CONTACTO: contacto,
            DICEÑO: seleccion,
            TEXTSIZE: fontSize
        },
        success: function(data){	
            if(data==0){
                var msg = 'DatalistCotizacion se encuentra vacio o a sido eliminado de la secion.';
                $('#warning-alert-modal').modal('show');
                $('#msg-warning-alert-modal').html(msg);
            }else{
                $('#tabla_cotizacion').html(data);
            }
            
        }
    });
}

$(document).ready(function(){	
	$('#nota').keypress(function(event){
        if(event.which == 13 ) { // 13 es el código de la tecla Enter
            event.preventDefault(); // Evita que se envíe el formulario
        
            var nota = $('#nota').val(); 

            $.ajax({
                type: 'POST',
                url: 'assets/procesos/DataListCotizacion.php',
                data: {NOTA: nota},
                dataType: 'json', // Asegúrate de especificar que esperas JSON
                success: function(data){	
                    if (data.status === 'success') {
                        const datafecha = data.fecha; // El mensaje de error
                        const detacliente = data.cliente; // Detalles adicionales del error
                        $('#fecha').val(datafecha);
                        $('#cliente').val(detacliente);
                        buscarCotizacion();
                        
                    } else if (data.status === 'error') {
                        // Trabajar con el mensaje de error
                        const errorMessage = data.message; // El mensaje de error
                    
                        $('#warning-alert-modal').modal('show');
                        $('#msg-warning-alert-modal').html(errorMessage);
                        $('#nota').value('');
                        $('#cliente').value('');
                        $('#nota').focus();
                    
                        return false;
                    }else {

                        $('#nota').focus();
                    
                        return false;
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                // Manejar errores de la solicitud AJAX
                console.error('AJAX Error:', textStatus, errorThrown);
                alert('Hubo un problema al procesar la solicitud. Intenta de nuevo.');
                }
            });
        }
    });
});


$(document).ready(function(){	
	$('#nota').blur(function(){
        
        var nota = $(this).val(); 
        
        $.ajax({
            type: 'POST',
            url: 'assets/procesos/DataListCotizacion.php',
            data: {NOTA: nota},
            dataType: 'json', // Asegúrate de especificar que esperas JSON
            success: function(data){	
                if (data.status === 'success') {
                    const datafecha = data.fecha; // El mensaje de error
                    const detacliente = data.cliente; // Detalles adicionales del error
                    $('#fecha').val(datafecha);
                    $('#cliente').val(detacliente);
                    buscarCotizacion();
                    
                } else if (data.status === 'error') {
                    // Trabajar con el mensaje de error
                    const errorMessage = data.message; // El mensaje de error
                
                    $('#warning-alert-modal').modal('show');
                    $('#msg-warning-alert-modal').html(errorMessage);
                    $(this).value('');
                    $(this).focus();
                
                    return false;
                }
                else {

                    $(this).focus();
                
                    return false;
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
            // Manejar errores de la solicitud AJAX
            console.error('AJAX Error:', textStatus, errorThrown);
            alert('Hubo un problema al procesar la solicitud. Intenta de nuevo.');
            }
        });
		
	});
});



////////////////////////////////////////
////                                ////
////    CAMBIOS DE PRECIOS          ////
////                                ////
////////////////////////////////////////

/*
function AddDataListCambiosPrecios(f1, f2, id, inicio, fin, codigo, producto, precio, promo, porcentaje) {
    $.ajax({
        type: 'POST',
        url: 'assets/procesos/DataListPromociones.php',
        data:  {
            id: id,
            inicio: inicio,
            fin: fin,
            codigo: codigo,
            producto: producto,
            precio: precio,
            promo: promo,
            porcentaje: porcentaje
        },
        success: function(data){	
            if(data==1){
                var ns = localStorage.getItem('NS');

                buscarPromociones(ns,f1,f2);
            }else{
                var msg = 'La variable de secion no existia o algo mas salio mal';
                $('#warning-alert-modal').modal('show');
                $('#msg-warning-alert-modal').html(msg);
            }
            
        }
    });
}

function AddDataListCambiosPreciosAll(f1, f2) {
    var ns = localStorage.getItem('NS');
    $.ajax({
        type: 'POST',
        url: 'assets/procesos/DataListCambiosPreciosAll.php',
        data:  {f1: f1, f2: f2, ns: ns},
        success: function(data){	
            if(data==1){
                buscarPromociones(ns,f1,f2);
            }else{
                var msg = 'La variable de secion no existia o algo mas salio mal';
                $('#warning-alert-modal').modal('show');
                $('#msg-warning-alert-modal').html(msg);
            }
            
        }
    });
    
}

function SuprDataListCambiosPrecios(f1, f2, id) {
    $.ajax({
        type: 'POST',
        url: 'assets/procesos/SuprDataListPromociones.php',
        data:  {id: id },
        success: function(data){	
            if(data==1){
                var ns = localStorage.getItem('NS');
                
                buscarPromociones(ns,f1,f2);
            }else{
                var msg = 'La variable de secion no existia o algo mas salio mal';
                $('#warning-alert-modal').modal('show');
                $('#msg-warning-alert-modal').html(msg);
            }
            
        }
    });
}

function SuprDataListCambiosPreciosAll(f1, f2) {
    $.ajax({
        type: 'POST',
        url: 'assets/procesos/SuprDataListCambiosPreciosAll.php',
        success: function(data) {	
            if(data == 1) {
                var ns = localStorage.getItem('NS');
                buscarPromociones(ns, f1, f2);
            } else {
                var msg = 'La variable de sesión no existía o algo más salió mal';
                $('#warning-alert-modal').modal('show');
                $('#msg-warning-alert-modal').html(msg);
            }
        }
    });
}

*/

/* duplicar fecha1 en fecha2 */
$(document).ready(function(){
    $('#fecha1').on('input', function(){
        $('#fecha2').val($(this).val());
    });
});

function buscarCambiosPrecio(ns,fecha1,fecha2,origen,vende) {
    $.ajax({
        type: 'POST',
        url: 'assets/procesos/buscar_cambiosPrecio.php',
        data: {NS: ns, F1: fecha1, F2: fecha2, ORIGEN: origen, VENDE: vende},
        success: function(data){	
            $('#tabla_cambiosPrecio').html(data);
            const button = document.getElementById('btn-cambiosPrecio');
            button.innerHTML = 'Generar Consulta';
            button.disabled = false;
        }
    });
}

/*Mostrar lista de cambios de precio al seleccionar origen de datos*/
$(document).ready(function(){
    $('#btn-cambiosPrecio').click(function(){
        const button = document.getElementById('btn-cambiosPrecio');
        button.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>Cargando...';
        button.disabled = true;

        var origen = $('#origen').val();
        var fecha1 = $('#fecha1').val();
        var fecha2 = $('#fecha2').val();
        var ns = localStorage.getItem('NS');
        var vende = $('#codvende').val();
        if (!vende.trim()){
            vende = '0';
        }
        if (fecha1 == '' || fecha2 == ''){
            var msg = 'Fecha de inicio y fin, son requeridos.';
            const button = document.getElementById('btn-cambiosPrecio');
            button.innerHTML = 'Generar Consulta';
            button.disabled = false;
            $('#warning-alert-modal').modal('show');
            $('#msg-warning-alert-modal').html(msg);
            
        }else{

            if (ns !== null){
                if (origen == 'null'){
                    var msg = 'Debe seleccionar un origen de datos valido.';
                    const button = document.getElementById('btn-cambiosPrecio');
                    button.innerHTML = 'Generar Consulta';
                    button.disabled = false;
                    $('#warning-alert-modal').modal('show');
                    $('#msg-warning-alert-modal').html(msg);

                }else{
                    if (fecha1 <= fecha2){
                        buscarCambiosPrecio(ns,fecha1,fecha2,origen,vende);
                    }else{
                        var msg = 'El rango de fecha no a sido definido correctamente.';
                        const button = document.getElementById('btn-cambiosPrecio');
                        button.innerHTML = 'Generar Consulta';
                        button.disabled = false;
                        $('#warning-alert-modal').modal('show');
                        $('#msg-warning-alert-modal').html(msg);
                    }
                }
            }else{
                if (ns === null && origen === 'personalizado'){
                    var msg = 'Tu acceso es de tipo limitado, pide a alguien con privilegios de administrador que selecciona una sucursal';
                    const button = document.getElementById('btn-cambiosPrecio');
                    button.innerHTML = 'Generar Consulta';
                    button.disabled = false;
                    $('#warning-alert-modal').modal('show');
                    $('#msg-warning-alert-modal').html(msg);
                }else{
                    if (origen == 'null'){
                        var msg = 'Debe seleccionar un origen de datos valido.';
                        const button = document.getElementById('btn-cambiosPrecio');
                        button.innerHTML = 'Generar Consulta';
                        button.disabled = false;
                        $('#warning-alert-modal').modal('show');
                        $('#msg-warning-alert-modal').html(msg);
                    }else{
                        if (fecha1 <= fecha2){
                            buscarCambiosPrecio(ns,fecha1,fecha2,origen,vende);
                        }else{
                            var msg = 'El rango de fecha no a sido definido correctamente.';
                            const button = document.getElementById('btn-cambiosPrecio');
                            button.innerHTML = 'Generar Consulta';
                            button.disabled = false;

                            $('#warning-alert-modal').modal('show');
                            $('#msg-warning-alert-modal').html(msg);
                        }
                    }
                }
            }
        }
    });

    
});





////    FIN DE CAMBIOS DE PRECIO    ////////////////////////////////////////////////////////////////









////////////////////////////////////////
////                                ////
////    LISTA DE PROMOCIONES        ////
////                                ////
////////////////////////////////////////


function buscarPromociones(ns,fecha1,fecha2,id) {
    $.ajax({
        type: 'POST',
        url: 'assets/procesos/buscar_promociones.php',
        data: {NS: ns, F1: fecha1, F2: fecha2, ID: id},
        success: function(data){	
            $('#tabla_promociones').html(data);
            const button = document.getElementById('btn-promociones');
            button.innerHTML = 'Generar Consulta';
            button.disabled = false;
            $('#proveedor').val('');
            $('#fecha1').val('');
            $('#fecha2').val('');
           
            $('#nrc_proveedor').empty(); // Limpia todas las opciones existentes

            $('#proveedor').focus();
        }
    });
}

function AddDataListPromociones(f1, f2, id, inicio, fin, codigo, producto, precio, promo, porcentaje, id_prove) {
    $.ajax({
        type: 'POST',
        url: 'assets/procesos/DataListPromociones.php',
        data:  {
            id: id,
            inicio: inicio,
            fin: fin,
            codigo: codigo,
            producto: producto,
            precio: precio,
            promo: promo,
            porcentaje: porcentaje
        },
        success: function(data){	
            if(data==1){
                var ns = localStorage.getItem('NS');

                buscarPromociones(ns,f1,f2,id_prove);
            }else{
                var msg = 'La variable de secion no existia o algo mas salio mal';
                $('#warning-alert-modal').modal('show');
                $('#msg-warning-alert-modal').html(msg);
            }
            
        }
    });
}

function AddDataListPromocionesAll(f1, f2, id) {
    var ns = localStorage.getItem('NS');
    $.ajax({
        type: 'POST',
        url: 'assets/procesos/DataListPromocionesAll.php',
        data:  {f1: f1, f2: f2, ns: ns, ID: id},
        success: function(data){	
            if(data==1){
                buscarPromociones(ns,f1,f2,id);
            }else{
                var msg = 'La variable de secion no existia o algo mas salio mal';
                $('#warning-alert-modal').modal('show');
                $('#msg-warning-alert-modal').html(msg);
            }
            
        }
    });
    
}

function SuprDataListPromociones(f1, f2, id, id_prove) {
    $.ajax({
        type: 'POST',
        url: 'assets/procesos/SuprDataListPromociones.php',
        data:  {id: id },
        success: function(data){	
            if(data==1){
                var ns = localStorage.getItem('NS');
                
                buscarPromociones(ns,f1,f2,id_prove);
            }else{
                var msg = 'La variable de secion no existia o algo mas salio mal';
                $('#warning-alert-modal').modal('show');
                $('#msg-warning-alert-modal').html(msg);
            }
            
        }
    });
}

function SuprDataListPromocionesAll(f1, f2, id) {
    $.ajax({
        type: 'POST',
        url: 'assets/procesos/SuprDataListPromocionesAll.php',
        success: function(data) {	
            if(data == 1) {
                var ns = localStorage.getItem('NS');
                buscarPromociones(ns, f1, f2, id);
            } else {
                var msg = 'La variable de sesión no existía o algo más salió mal';
                $('#warning-alert-modal').modal('show');
                $('#msg-warning-alert-modal').html(msg);
            }
        }
    });
}

/*Mostrar lista de cambios de precio al seleccionar origen de datos*/
$(document).ready(function(){
    $('#btn-promociones').click(function(){
        const button = document.getElementById('btn-promociones');
        button.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>Cargando...';
        button.disabled = true;

        var fecha1 = $('#fecha1').val();
        var fecha2 = $('#fecha2').val();
        var ns = localStorage.getItem('NS');

        var codeSelect = $('#nrc_proveedor');
        var hasOptions = codeSelect.find('option').length > 0; // Verifica si tiene opciones

        if (!hasOptions) {
            var id = 0;
        }else{
            var id = $('#nrc_proveedor option:selected').attr('data-id'); // El valor del data-id del proveedor
        }
        

        if(fecha1.trim() === ''){
            fecha1 = 0;
            fecha2 = 0;
        } 
        
        if (ns !== null){

            if (fecha1 <= fecha2){
                buscarPromociones(ns,fecha1,fecha2,id);
            }else{
                var msg = 'El rango de fecha no a sido definido correctamente.';
                $('#warning-alert-modal').modal('show');
                $('#msg-warning-alert-modal').html(msg);
            }
            
        }else{
            if (ns === null){
                var msg = 'Tu acceso es de tipo limitado, pide a alguien con privilegios de administrador que selecciona una sucursal';
                $('#warning-alert-modal').modal('show');
                $('#msg-warning-alert-modal').html(msg);
            }else{

                if (fecha1 <= fecha2){
                    buscarCambiosPrecio(ns,fecha1,fecha2,id);
                }else{
                    var msg = 'El rango de fecha no a sido definido correctamente.';
                    $('#warning-alert-modal').modal('show');
                    $('#msg-warning-alert-modal').html(msg);
                }
                
            }
        }
    });

    
});



///////////////////////////////////////// NUEVA LISTA DE PROMOCIONES



/*AGREGAR PRODUCTOS AL ARRAY DE PROMOCIONES */
$(document).ready(function(){	
	$('#btn-agregar-promocion').click(function(){
		
        // Obtener el valor del campo 'cantidad'
        var descuento = $('#precio_promo').val().trim(); // .trim() elimina los espacios en blanco
        // Obtener el valor original del precio unitario
        var preciou = parseFloat($('#code option:selected').attr('data-preciou'));
       

        var codeSelect = $('#code');
        var hasOptions = codeSelect.find('option').length > 0; // Verifica si tiene opciones

        if (!hasOptions) {
            var msg = 'Busca y selecciona un producto por su codigo o su descripcion.';
            $('#warning-alert-modal').modal('show');
            $('#msg-warning-alert-modal').html(msg);
            return false;
        }


        var fecha1 = $('#fecha1').val();
        var fecha2 = $('#fecha2').val();
        var code = codeSelect.val();

        var ns_actual = localStorage.getItem('NS');

        // Validar que no esté vacío y sea mayor que cero
        if(descuento !== '' && fecha1.trim() !== '' && fecha2 >= fecha1 && code.trim() !== '' && code !== '0') {

            // Verificar si el descuento termina con '%'
            if (descuento.endsWith('%')) {
                // Quitar el carácter '%' y convertir a número
                var porcentaje = parseFloat(descuento.slice(0, -1));

                if (!isNaN(porcentaje) && porcentaje > 0 && porcentaje <= 100) {

                    // Calcular el descuento en base al porcentaje
                    descuento = (preciou - (preciou * (porcentaje / 100))).toFixed(2); // Formatear con 2 decimales
                } else {
                    var msg = 'Porcentaje de descuento inválido. Debe ser un número entre 1 y 100.';
                    $('#warning-alert-modal').modal('show');
                    $('#msg-warning-alert-modal').html(msg);

                    return false;
                }
            } else {
                // Si no termina con '%', asegurarse de que sea un número válido
                descuento = parseFloat(descuento);
            
                if (isNaN(descuento) || descuento >= preciou) {
                    
                    var msg = 'El descuento debe ser un número mayor que 0.00 y menor al precio unitario del producto.';
                    $('#warning-alert-modal').modal('show');
                    $('#msg-warning-alert-modal').html(msg);

                    return false;
                }
                descuento = descuento.toFixed(2); // Formatear con 2 decimales
            }
        
            var AddListData = $('#form-nueva-promocion').serialize();	

            $.ajax({url:'assets/procesos/add_lista_promociones.php',
                type:'POST',
                dataType:'html',
                data:AddListData + '&descuento_calculado=' + encodeURIComponent(descuento) + '&ACTUAL=' + encodeURIComponent(ns_actual),
                success:function(data){	
                    if (data == 0){
                        var msg = 'El producto que tratas de agregar ya existe como un regsitro de promocion. primeros debes eliminar el registro existente o esperar a que este finalice el periodo de valides de la promocion';
                        $('#warning-alert-modal').modal('show');
                        $('#msg-warning-alert-modal').html(msg);

                        return false;
                    }else{
                        $('#precio_promo').val('');
                        $('#btn').val('');	
                        $('#code').val('');

                        $('#tabla_promociones').html(data);

                        $('#btn').focus();
                    }
                }
            });
            
            return false;
        } else {
            var msg = 'El formulario esta incompleto, asegurate de llenar todos los campos correctamente.';
            $('#warning-alert-modal').modal('show');
            $('#msg-warning-alert-modal').html(msg);
        }
	});
});

/*AGREGAR PRODUCTOS AL ARRAY DE PROMOCIONES --- CUANDO PRECIONAS ENTER EN EL PRECIO DE PROMOCION */
$(document).ready(function(){	
    $('#precio_promo').keypress(function(event){
        if(event.which == 13 ) { // 13 es el código de la tecla Enter
            event.preventDefault(); // Evita que se envíe el formulario
            
           
            // Obtener el valor del campo 'cantidad'
            var descuento = $('#precio_promo').val().trim(); // .trim() elimina los espacios en blanco
            // Obtener el valor original del precio unitario
            var preciou = parseFloat($('#code option:selected').attr('data-preciou'));

            var codeSelect = $('#code');
            var hasOptions = codeSelect.find('option').length > 0; // Verifica si tiene opciones

            if (!hasOptions) {
                var msg = 'Busca y selecciona un producto por su codigo o su descripcion.';
                $('#warning-alert-modal').modal('show');
                $('#msg-warning-alert-modal').html(msg);
                return false;
            }

            var fecha1 = $('#fecha1').val();
            var fecha2 = $('#fecha2').val();
            var code = codeSelect.val();

            var ns_actual = localStorage.getItem('NS');

            // Validar que no esté vacío y sea mayor que cero
            if(descuento !== '' && fecha1.trim() !== '' && fecha2 >= fecha1 && code.trim() !== '' && code !== '0') {

                // Verificar si el descuento termina con '%'
                if (descuento.endsWith('%')) {
                    // Quitar el carácter '%' y convertir a número
                    var porcentaje = parseFloat(descuento.slice(0, -1));

                    if (!isNaN(porcentaje) && porcentaje > 0 && porcentaje <= 100) {

                        // Calcular el descuento en base al porcentaje
                        descuento = (preciou - (preciou * (porcentaje / 100))).toFixed(2); // Formatear con 2 decimales
                    } else {
                        var msg = 'Porcentaje de descuento inválido. Debe ser un número entre 1 y 100.';
                        $('#warning-alert-modal').modal('show');
                        $('#msg-warning-alert-modal').html(msg);

                        return false;
                    }
                } else {
                    // Si no termina con '%', asegurarse de que sea un número válido
                    descuento = parseFloat(descuento);
                
                    if (isNaN(descuento) || descuento >= preciou) {
                        
                        var msg = 'El descuento debe ser un número mayor que 0.00 y menor al precio unitario del producto.';
                        $('#warning-alert-modal').modal('show');
                        $('#msg-warning-alert-modal').html(msg);

                        return false;
                    }
                    descuento = descuento.toFixed(2); // Formatear con 2 decimales
                }

            
                var AddListData = $('#form-nueva-promocion').serialize();	

                $.ajax({url:'assets/procesos/add_lista_promociones.php',
                    type:'POST',
                    dataType:'html',
                    data:AddListData + '&descuento_calculado=' + encodeURIComponent(descuento) + '&ACTUAL=' + encodeURIComponent(ns_actual),
                    success:function(data){	
                        if (data == 0){
                            var msg = 'El producto que tratas de agregar ya existe como un regsitro de promocion. primeros debes eliminar el registro existente o esperar a que este finalice el periodo de valides de la promocion';
                            $('#warning-alert-modal').modal('show');
                            $('#msg-warning-alert-modal').html(msg);
    
                            return false;
                        }else{
                            $('#precio_promo').val('');
                            $('#btn').val('');	
                            $('#code').val('');
    
                            $('#tabla_promociones').html(data);
    
                            $('#btn').focus();
                        }
                    }
                });
                
                return false;
            } else {
                var msg = 'El formulario esta incompleto, asegurate de llenar todos los campos correctamente.';
                $('#warning-alert-modal').modal('show');
                $('#msg-warning-alert-modal').html(msg);
            }
        }
    });
});

/*ELIMINAR PRODUCTOS DEL ARRAY DE LA LISTA DE ENTREGA */
function eliminarItemPromocion(ID) {
    $.ajax({
        type: 'POST',
        url: 'assets/procesos/eliminar_lista_promociones.php',
        data: {Eliminar: ID},
        success: function(data){	
            $('#tabla_promociones').html(data);

            $('#btn').focus();
        }
    });
}

/*GUARDAR LISTA DE PROMOCIONES */
$(document).ready(function(){	
	$('#btn-guardar-lista-promociones').click(function(){
		
        var ns = localStorage.getItem('NS');

		$.ajax({
            type: 'POST',
            url: 'assets/procesos/guardar_lista_promociones.php',
            data: { ACTUAL: ns },
            dataType: 'json', // Asegúrate de especificar que esperas JSON
            success: function (data) {
                if (data.status === 'success') {
                    // Mostrar mensaje de éxito
                    $('#success-alert-modal').modal('show');
                } else if (data.status === 'error') {
                    // Trabajar con el mensaje de error
                    const errorMessage = data.message; // El mensaje de error
                    const detailedError = data.error; // Detalles adicionales del error
        
                    $('#warning-alert-modal').modal('show');
                    $('#msg-warning-alert-modal').html(errorMessage);
                    $('#detalle-warning-alert-modal').html(detailedError);

                    $('#btn').focus();
        
                    return false;
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Manejar errores de la solicitud AJAX
                console.error('AJAX Error:', textStatus, errorThrown);
                alert('Hubo un problema al procesar la solicitud. Intenta de nuevo.');
            }
        });
		
		return false;
	});
});

/* ENVIA EL ENFOQUE DIRECTO ASIA EL PRECIO DE PROMOCION */
$(document).ready(function(){	
	$('#btn').blur(function(){
		$('#precio_promo').focus();
	});
});
/* ENVIA EL ENFOQUE DIRECTO ASIA EL PRECIO DE PROMOCION --- al precionar ENTER */
$(document).ready(function(){	
	$('#btn').keypress(function(event){
        if(event.which == 13 ) { // 13 es el código de la tecla Enter
            event.preventDefault(); // Evita que se envíe el formulario
		    
            $('#precio_promo').focus();
        }
	});
});



///////////////////////////////////////// ADMINISTRAR PROMOCIONES VIGENTES


/*BUSCAR PROMOCIONES VIGENTES */
function buscarPromocionesVigentes() {
    var ns = localStorage.getItem('NS');
    $.ajax({
        type: 'POST',
        url: 'assets/procesos/buscar_promociones_vigentes.php',
        data: {NS: ns},
        success: function(data){	
            $('#tabla_administrar_promociones').html(data);
        }
    });
}

/*BUSCAR PROMOCIONES VIGENTES */
function eliminarPromocionVigente(id) {
    
    $.ajax({
        type: 'POST',
        url: 'assets/procesos/eliminar_promociones_vigentes.php',
        data: {ID: id},
        dataType: 'json', // Asegúrate de especificar que esperas JSON
        success: function(data){	
            if (data.status === 'success') {
                
                buscarPromocionesVigentes();

                $('#success-alert-modal').modal('show');

            } else if (data.status === 'error') {
                // Trabajar con el mensaje de error
                const errorMessage = data.message; // El mensaje de error
                const detailedError = data.error; // Detalles adicionales del error
    
                $('#warning-alert-modal').modal('show');
                $('#msg-warning-alert-modal').html(errorMessage);
                $('#detalle-warning-alert-modal').html(detailedError);

    
                return false;
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Manejar errores de la solicitud AJAX
            console.error('AJAX Error:', textStatus, errorThrown);
            alert('Hubo un problema al procesar la solicitud. Intenta de nuevo.');
        }
    });
}


////    FIN PROMOCIONES   ////////////////////////////////////////////////////////////////



///////////////////////////////////////
////                               ////
////    METAS DE SUCURSALES        ////
////                               ////
///////////////////////////////////////



/*BUSCAR PROMOCIONES VIGENTES */
function metasSucursales() {
    
    var ns = localStorage.getItem('NS');

    if (ns){
        $.ajax({
            type: 'POST',
            url: 'assets/procesos/ver_metas.php',
            data: {NS: ns},
            success: function(data){	
                if(data == 0){
                    $('#signup-modal').modal('show'); //muestra el modal para actualizar el monto de la meta 
                }else{
                    $('#tabla_metas').html(data);
                }
                
            }
        });
    }else{
        $('#tabla_metas').html('El tipo de acceso es limitado, pida al encargado de tienda seleccionar una sucursal para ver el cumplimiento de metas.');
    }
}


//Modificar el comprovante
$(document).ready(function(){
    $('#btn-guardar-meta').click(function(){
        
        var meta = $('#meta').val();
        var ns = localStorage.getItem('NS');

        $.ajax({
            type: 'POST',
            url: 'assets/procesos/actualizar_meta.php',
            data: {META: meta, NS: ns},
            success: function(data){
                if (data == 1){            
                    $('#success-alert-modal').modal('show');
                    metasSucursales();
                }else{
                    var msg = 'La meta de la sucursal no se pudo actualizar correctamente.';
                    $('#warning-alert-modal').modal('show');
                    $('#msg-warning-alert-modal').html(msg);
                }
            }
        });
        
        
        
    });

    
});



///////////////////////////////////////
////                               ////
////    METAS (CONSOLIDADO)        ////
////                               ////
///////////////////////////////////////



/*BUSCAR PROMOCIONES VIGENTES */
function metasConsolidado() {
    var cargando = "<div class='col-lg-6'><div class='spinner-grow avatar-md text-secondary m-2' role='status'></div></div>";

    $('#tabla_metas_consolidado').html(cargando);

    var ns = localStorage.getItem('NS');

    $.ajax({
        type: 'POST',
        url: 'assets/procesos/ver_metas_consolidado.php',
        data: {NS: ns},
        success: function(data){	
            $('#tabla_metas_consolidado').html(data);
        }
    });
}





///////////////////////////////////////
////                               ////
////    VENTAS CONTRA AÑO          ////
////                               ////
///////////////////////////////////////



/*BUSCAR PROMOCIONES VIGENTES */
function ventasContraAño() {
    var cargando = "<div class='col-lg-6'><div class='spinner-grow avatar-md text-secondary m-2' role='status'></div></div>";

    $('#tabla_ventas_contra_año').html(cargando);

    var ns = localStorage.getItem('NS');
    var base = 0;
    var compara = 0;
    if (ns) {
        $.ajax({
            type: 'POST',
            url: 'assets/procesos/ver_ventas_contra_año.php',
            data: { NS: ns, BASE: base, COMPARA: compara},
            success: function(data) {	
                $('#tabla_ventas_contra_año').html(data);
            }
        });
    } else {
        $('#tabla_ventas_contra_año').html('El tipo de acceso es limitado, pida al encargado de tienda seleccionar una sucursal para ver el cumplimiento de metas.');
    }
}

$(document).ready(function(){
    $('#btn-contra-year').click(function(){

        var cargando = "<div class='col-lg-6'><div class='spinner-grow avatar-md text-secondary m-2' role='status'></div></div>";

        $('#tabla_ventas_contra_año').html(cargando);
        var base = $('#year_base').val(); 
        if (base == '') { 
            base = 0; 
        }
        var compara = $('#year_comparar').val(); 
        if (compara == '') { 
            compara = 0; 
        }

        var ns = localStorage.getItem('NS');
        if (compara >= base){
            var msg = 'El año no puede ser menor o igual al año con el que se decea comparar.';
            $('#warning-alert-modal').modal('show');
            $('#msg-warning-alert-modal').html(msg);
            $('#tabla_ventas_contra_año').html('Corriga he intente una ves mas.');
        }else{
            if (ns) {
                $.ajax({
                    type: 'POST',
                    url: 'assets/procesos/ver_ventas_contra_año.php',
                    data: { NS: ns, BASE: base, COMPARA: compara},
                    success: function(data) {	
                        $('#tabla_ventas_contra_año').html(data);
                        $('#year_base').val('');
                        $('#year_comparar').val('');
                    }
                });
            } else {
                $('#tabla_ventas_contra_año').html('El tipo de acceso es limitado, pida al encargado de tienda seleccionar una sucursal para ver el cumplimiento de metas.');
            }
        }

    });
});


////////////////////////////////////
////                            ////
////    OTROS DESCUENTOS        ////
////                            ////
////////////////////////////////////





function buscarDescuentos(ns) {
    $.ajax({
        type: 'POST',
        url: 'assets/procesos/buscar_descuentos.php',
        data: {NS: ns},
        success: function(data){	
            $('#tabla_descuentos').html(data);
            const button = document.getElementById('btn-descuentos');
            button.innerHTML = 'Generar Consulta';
            button.disabled = false;
        }
    });
}


function AddDataListDescuentos(id, cod, descrip, precio, porcentaje, descuento, aplicado) {
    $.ajax({
        type: 'POST',
        url: 'assets/procesos/DataListDescuentos.php',
        data:  {
            id: id,
            cod: cod,
            descrip: descrip,
            precio: precio,
            porcentaje: porcentaje,
            descuento: descuento,
            aplicado: aplicado
        },
        success: function(data){	
            if(data==1){
                var ns = localStorage.getItem('NS');
                buscarDescuentos(ns);
            }else{
                var msg = 'La variable de secion no existia o algo mas salio mal';
                $('#warning-alert-modal').modal('show');
                $('#msg-warning-alert-modal').html(msg);
            }
            
        }
    });
}



function AddDataListDescuentosAll() {
    var ns = localStorage.getItem('NS');
    $.ajax({
        type: 'POST',
        url: 'assets/procesos/DataListDescuentosAll.php',
        data:  {ns: ns},
        success: function(data){	
            if(data==1){
                buscarDescuentos(ns);
            }else{
                var msg = 'La variable de secion no existia o algo mas salio mal';
                $('#warning-alert-modal').modal('show');
                $('#msg-warning-alert-modal').html(msg);
            }
            
        }
    });
}



function SuprDataListDescuentos(id) {
    $.ajax({
        type: 'POST',
        url: 'assets/procesos/SuprDataListDescuentos.php',
        data:  {id: id },
        success: function(data){	
            if(data==1){
                var ns = localStorage.getItem('NS');
                buscarDescuentos(ns);
            }else{
                var msg = 'La variable de secion no existia o algo mas salio mal';
                $('#warning-alert-modal').modal('show');
                $('#msg-warning-alert-modal').html(msg);
            }
            
        }
    });
}



function SuprDataListDescuentosAll() {
    $.ajax({
        type: 'POST',
        url: 'assets/procesos/SuprDataListDescuentosAll.php',
        success: function(data){	
            if(data==1){
                var ns = localStorage.getItem('NS');
                buscarDescuentos(ns);
            }else{
                var msg = 'La variable de secion no existia o algo mas salio mal';
                $('#warning-alert-modal').modal('show');
                $('#msg-warning-alert-modal').html(msg);
            }
            
        }
    });
}




/*Mostrar lista de cambios de precio al seleccionar origen de datos*/
$(document).ready(function(){
    $('#btn-descuentos').click(function(){
        const button = document.getElementById('btn-descuentos');
        button.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>Cargando...';
        button.disabled = true;

        var ns = localStorage.getItem('NS');

        if (ns !== null){

            buscarDescuentos(ns);
   
            
        }else{
            if (ns === null){
                var msg = 'Tu acceso es de tipo limitado, pide a alguien con privilegios de administrador que selecciona una sucursal';
                $('#warning-alert-modal').modal('show');
                $('#msg-warning-alert-modal').html(msg);
            }else{

                buscarDescuentos(ns);
                
            }
        }
    });

    
});





////    FIN OTROS DESCUENTOS   ////////////////////////////////////////////////////////////////










/////////////////////////////////////////
////                                 ////
////        VENTAS POR CAJA          ////
////                                 ////
/////////////////////////////////////////

//Captura el id de la ventan al precionar el boton editar
function selectID(id_relacion) {

    // Almacenar el id en localStorage para poder recuperarlo luego desde cualquieir funcion 
    localStorage.setItem('ID_RELACION', id_relacion);

    $('#login-modal').modal('show');
    
}

//Captura el id de la venta y abre el modal para miostrar los detalles de la misma 
function VerDetalleVentasXCaja(id) {
    $.ajax({
        type: 'POST',
        url: 'assets/procesos/buscar_detalle_ventaXcaja.php',
        data: {ID: id},
        success: function(data){	

            // Mostrar el modal
            var myModalEl = document.getElementById('verDetalleVenta');
            var myModal = new bootstrap.Modal(myModalEl);
            myModal.show();

            //muestra los datos
            $('#tabla-verDetalleVenta').html(data);

        }
    });    
}

//Recive el id_relacion para buscar el comprovante que sera modificado
function verComprovante(id_relacion) {
    $.ajax({
        type: 'POST',
        url: 'assets/procesos/ver_comprovante.php',
        data: {ID: id_relacion},
        success: function(data){
            $('#signup-modal').modal('show'); //muestra el modal para modificacion de comprovantes
            $('#tabla-comprovante').html(data);
        }
    });
}

//Modificar el comprovante
$(document).ready(function(){
    $('#btn-modificar-comprovante').click(function(){
        
        var id_relacion = localStorage.getItem('ID_RELACION'); //octiene el ns actual en el sistema 
        var EFECTIVO = $('#efectivo').val();
        var BITCOIN = $('#bitcoin').val();
        var DAVIVIENDA = $('#davivienda').val();
        var CHEQUE = $('#cheque').val();
        var GIFTCARD = $('#giftcard').val();
        var TRANSFERENCIAS = $('#transferencias').val();
        var LEAL = $('#leal').val();
        var CONSUMO = $('#consumo').val();
        var NICO = $('#nico').val();
        
        // Borra solo la variable 'ID_RELACION' del localStorage
        //localStorage.removeItem('ID_RELACION');

        $.ajax({
            type: 'POST',
            url: 'assets/procesos/modificar_comprovante.php',
            data: {ID: id_relacion, P01: EFECTIVO, P02: BITCOIN, P03: DAVIVIENDA, P04: CHEQUE, P05: GIFTCARD, P06: TRANSFERENCIAS, P07: LEAL, P08: CONSUMO, P09: NICO},
            success: function(data){
                if (data == 1){            
                    $('#success-alert-modal').modal('show');
                }else{
                    var msg = 'El comprovante no pudo ser actualizado';
                    $('#warning-alert-modal').modal('show');
                    $('#msg-warning-alert-modal').html(msg);
                }
            }
        });
        
        
        
    });

    
});

//Validar privilegios
$(document).ready(function(){
    $('#btn-validar-privilegios').click(function(){

        var clave = $('#clave').val(); //octine la variable de la password
        var ns = localStorage.getItem('NS'); //octiene el ns actual en el sistema 
        var id_relacion = localStorage.getItem('ID_RELACION'); //octiene el id_relacion actual en el sistema 
        

        $('#clave').val('');

        $.ajax({
            type: 'POST',
            url: 'assets/procesos/validar_clave.php',
            data: {CLAVE: clave, NS: ns},
            success: function(data){

                if (data == 1){
                
                    verComprovante(id_relacion);
                  
                }else{
                    
                    var msg = 'No cuenta con privilegios para modificacion de comprovantes';
                    $('#warning-alert-modal').modal('show');
                    $('#msg-warning-alert-modal').html(msg);
                
                }
            }
        }); 
    });
});

//Validar privilegios al precionar la tecla enter
$(document).ready(function(){	
    $('#clave').keypress(function(event){
        if(event.which == 13 ) { // 13 es el código de la tecla Enter
            event.preventDefault();
            
            $('#login-modal').modal('hide');

            var clave = $('#clave').val(); //octine la variable de la password
            var ns = localStorage.getItem('NS'); //octiene el ns actual en el sistema 
            var id_relacion = localStorage.getItem('ID_RELACION'); //octiene el ns actual en el sistema 
            
    
            $('#clave').val('');

            
    
            $.ajax({
                type: 'POST',
                url: 'assets/procesos/validar_clave.php',
                data: {CLAVE: clave, NS: ns},
                success: function(data){
    
                    if (data == 1){
                    
                        verComprovante(id_relacion);
                      
                    }else{
                        
                        var msg = 'No cuenta con privilegios para modificacion de comprovantes';
                        $('#warning-alert-modal').modal('show');
                        $('#msg-warning-alert-modal').html(msg);
                    
                    }
                }
            });
            
        }
    });
});

//busca y muestra la informacion de las ventas 
function buscarVentasCaja(fecha1,fecha2,caja,ns) {
    $.ajax({
        type: 'POST',
        url: 'assets/procesos/buscar_ventasCaja.php',
        data: {F1: fecha1, F2: fecha2, CAJA: caja, NS: ns},
        success: function(data){	
            $('#tabla-ventas-caja').html(data);
            const button = document.getElementById('btn-ventas-caja');
            button.innerHTML = 'Generar Consulta';
            button.disabled = false;
        }
    });
}

/*Mostrar lista de cambios de precio al seleccionar origen de datos*/
$(document).ready(function(){
    $('#btn-ventas-caja').click(function(){

        const button = document.getElementById('btn-ventas-caja');
        button.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>Cargando...';
        button.disabled = true;
        var caja_val = $('#caja').val();
        var fecha1 = $('#fecha1').val();
        var fecha2 = $('#fecha2').val();
        var caja = '';
        // Función para verificar si es un número mayor a cero
        function esNumeroValido(valor) {
            // Convertimos el valor a número
            var numero = parseFloat(valor);
            // Verificamos si es un número y mayor a cero
            return !isNaN(numero) && numero > 0;
        }

        if (!caja_val || caja_val.trim() === '' || !esNumeroValido(caja_val)) {
            // Si está vacío, nulo, tiene espacios o no es un número válido
            caja = 0;
        } else if (esNumeroValido(caja_val)) {
            // Si es un número mayor a cero
            caja = caja_val;
        }


        var ns = localStorage.getItem('NS');


        if (fecha1 <= fecha2){ 
            buscarVentasCaja(fecha1,fecha2,caja,ns);
        }else{
            var msg = 'El rango de fecha no a sido definido correctamente.';
            $('#warning-alert-modal').modal('show');
            $('#msg-warning-alert-modal').html(msg);
        }
        
    });

    
});

/*Mostrar lista de cambios de precio al seleccionar origen de datos  #2*/
$(document).ready(function(){
    $('#btn-ventas-caja2').click(function(){

        const button = document.getElementById('btn-ventas-caja');
        button.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>Cargando...';
        button.disabled = true;
        var caja_val = $('#caja').val();
        var fecha1 = $('#fecha1').val();
        var fecha2 = $('#fecha2').val();
        var caja = '';
        // Función para verificar si es un número mayor a cero
        function esNumeroValido(valor) {
            // Convertimos el valor a número
            var numero = parseFloat(valor);
            // Verificamos si es un número y mayor a cero
            return !isNaN(numero) && numero > 0;
        }

        if (!caja_val || caja_val.trim() === '' || !esNumeroValido(caja_val)) {
            // Si está vacío, nulo, tiene espacios o no es un número válido
            caja = 0;
        } else if (esNumeroValido(caja_val)) {
            // Si es un número mayor a cero
            caja = caja_val;
        }


        var ns = localStorage.getItem('NS');


        if (fecha1 <= fecha2){ 
            buscarVentasCaja(fecha1,fecha2,caja,ns);
        }else{
            var msg = 'El rango de fecha no a sido definido correctamente.';
            $('#warning-alert-modal').modal('show');
            $('#msg-warning-alert-modal').html(msg);
        }
        
    });

    
});



////    FIN    ////////////////////////////////////////////////////////////////







/////////////////////////////////////////
////                                 ////
////        ABONOS POR CAJA          ////
////                                 ////
/////////////////////////////////////////



function VerFactura(id_venta2) {
    $.ajax({
        type: 'POST',
        url: 'assets/procesos/buscar_factura_abonos.php',
        data: {ID: id_venta2},
        success: function(data){	

            // Mostrar el modal
            var myModalEl = document.getElementById('detalles-venta');
            var myModal = new bootstrap.Modal(myModalEl);
            myModal.show();

            //muestra los datos
            $('#tabla-ver-factura-abonos').html(data);

        }
    });
    
    

    
}



function buscarAbonos(fecha1,fecha2,caja,ns) {
    $.ajax({
        type: 'POST',
        url: 'assets/procesos/buscar_abonos.php',
        data: {F1: fecha1, F2: fecha2, CAJA: caja, NS: ns},
        success: function(data){	
            $('#tabla-abonos').html(data);
            const button = document.getElementById('btn-abonos');
            button.innerHTML = 'Generar Consulta';
            button.disabled = false;
        }
    });
}

/*Mostrar lista de cambios de precio al seleccionar origen de datos*/
$(document).ready(function(){
    $('#btn-abonos').click(function(){

        const button = document.getElementById('btn-abonos');
        button.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>Cargando...';
        button.disabled = true;
        var caja_val = $('#caja').val();
        var fecha1 = $('#fecha1').val();
        var fecha2 = $('#fecha2').val();
        var caja = '';
        // Función para verificar si es un número mayor a cero
        function esNumeroValido(valor) {
            // Convertimos el valor a número
            var numero = parseFloat(valor);
            // Verificamos si es un número y mayor a cero
            return !isNaN(numero) && numero > 0;
        }

        if (!caja_val || caja_val.trim() === '' || !esNumeroValido(caja_val)) {
            // Si está vacío, nulo, tiene espacios o no es un número válido
            caja = 0;
        } else if (esNumeroValido(caja_val)) {
            // Si es un número mayor a cero
            caja = caja_val;
        }


        var ns = localStorage.getItem('NS');


        if (fecha1 <= fecha2){ 
            buscarAbonos(fecha1,fecha2,caja,ns);
        }else{
            var msg = 'El rango de fecha no a sido definido correctamente.';
            $('#warning-alert-modal').modal('show');
            $('#msg-warning-alert-modal').html(msg);
        }
        
    });

    
});



////    FIN    ////////////////////////////////////////////////////////////////









/////////////////////////////////////////
////                                 ////
////        VENTAS POR CLIENTE       ////
////                                 ////
/////////////////////////////////////////


function buscarVentasCliente(ns,fecha1,fecha2,cliente) {
    $.ajax({
        type: 'POST',
        url: 'assets/procesos/buscar_ventasCliente.php',
        data: {NS: ns, F1: fecha1, F2: fecha2, CLIENTE: cliente},
        success: function(data){	
            $('#tabla-ventas-cliente').html(data);
            const button = document.getElementById('btn-ventas-cliente');
            button.innerHTML = 'Generar Consulta';
            button.disabled = false;
        }
    });
}

/*Mostrar lista de cambios de precio al seleccionar origen de datos*/
$(document).ready(function(){
    $('#btn-ventas-cliente').click(function(){
        const button = document.getElementById('btn-ventas-cliente');
        button.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>Cargando...';
        button.disabled = true;
        var cliente = $('#cliente2').val();
        var fecha1 = $('#fecha1').val();
        var fecha2 = $('#fecha2').val();
        var ns = localStorage.getItem('NS');

        if (ns !== null){
            if (cliente == '0'){
                var msg = 'Busque y seleccione un cliente';
                $('#warning-alert-modal').modal('show');
                $('#msg-warning-alert-modal').html(msg);
            }else{
                if (fecha1 <= fecha2){
                    buscarVentasCliente(ns,fecha1,fecha2,cliente);
                }else{
                    var msg = 'El rango de fecha no a sido definido correctamente.';
                    $('#warning-alert-modal').modal('show');
                    $('#msg-warning-alert-modal').html(msg);
                }
            }
        }else{
            var msg = 'Tu acceso es de tipo limitado, pide a alguien con privilegios de administrador que selecciona una sucursal';
            $('#warning-alert-modal').modal('show');
            $('#msg-warning-alert-modal').html(msg);
        }
    });

    
});





////    FIN     ////////////////////////////////////////////////////////////////




/////////////////////////////////////////
////                                 ////
////        VENTAS POR PRODUCTO      ////
////                                 ////
/////////////////////////////////////////


function buscarVentasProducto(ns,fecha1,fecha2,producto) {
    $.ajax({
        type: 'POST',
        url: 'assets/procesos/buscar_ventasProducto.php',
        data: {NS: ns, F1: fecha1, F2: fecha2, PRODUCTO: producto},
        success: function(data){	
            $('#tabla-ventas-producto').html(data);
            const button = document.getElementById('btn-ventas-producto');
            button.innerHTML = 'Generar Consulta';
            button.disabled = false;
        }
    });
}

/*Mostrar lista de cambios de precio al seleccionar origen de datos*/
$(document).ready(function(){
    $('#btn-ventas-producto').click(function(){
        const button = document.getElementById('btn-ventas-producto');
        button.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>Cargando...';
        button.disabled = true;
        var producto = $('#code').val();
        var fecha1 = $('#fecha1').val();
        var fecha2 = $('#fecha2').val();
        var ns = localStorage.getItem('NS');

        if (ns !== null){
            if (producto == '0'){
                var msg = 'Busque y seleccione un producto';
                $('#warning-alert-modal').modal('show');
                $('#msg-warning-alert-modal').html(msg);
            }else{
                if (fecha1 <= fecha2){
                    buscarVentasProducto(ns,fecha1,fecha2,producto);
                }else{
                    var msg = 'El rango de fecha no a sido definido correctamente.';
                    $('#warning-alert-modal').modal('show');
                    $('#msg-warning-alert-modal').html(msg);
                }
            }
        }else{
            var msg = 'Tu acceso es de tipo limitado, pide a alguien con privilegios de administrador que selecciona una sucursal';
            $('#warning-alert-modal').modal('show');
            $('#msg-warning-alert-modal').html(msg);
        }
    });

    
});





////    FIN     ////////////////////////////////////////////////////////////////



/////////////////////////////////////////
////                                 ////
////        ENTREGA DE PRODUCTOS DE HOSPITALES       ////
////                                 ////
/////////////////////////////////////////

/*GUARDAR PRODUCTOS DEL ARRAY EN LAS TABLAS DE ENTREGA Y DETALLE DE ENTREGA */
$(document).ready(function(){	
	$('#btn-guardar-entrega').click(function(){
		var AddListData = $('#form-entrega').serialize();	

		$.ajax({url:'assets/procesos/guardar_lista_entrega.php',
			type:'POST',
			dataType:'html',
			data:AddListData,
			success:function(data){	
                $('#cantidad').val('');
                $('#productoContrato').val('');	
                $('#productoID').val('');
                $('#previcion').val('');

                $('#tabla_entrega').html(data);
                
                $('#previcion').focus();
			}
		});
		
		return false;
	});
});

/*AGREGAR PRODUCTOS AL ARRAY DE LA LISTA DE ENTREGA */
$(document).ready(function(){	
	$('#btn-agregar-p').click(function(){
		var AddListData = $('#form-entrega').serialize();	

		$.ajax({url:'assets/procesos/add_lista_entrega.php',
			type:'POST',
			dataType:'html',
			data:AddListData,
			success:function(data){	
                $('#cantidad').val('');
                $('#productoContrato').val('');	
                $('#productoID').val('');

                $('#tabla_entrega').html(data);

                $('#productoContrato').focus();
			}
		});
		
		return false;
	});
});

/* ENVIA EL ENFOQUE DIRECTO ASIA LA CANTIDAD */
$(document).ready(function(){	
	$('#productoContrato').blur(function(){
		$('#cantidad').focus();
	});
});

/*AGREGAR PRODUCTOS AL ARRAY DE LA LISTA DE ENTREGA --- CUANDO PRECIONAS ENTER EN LA CANTIDAD */
$(document).ready(function(){	
    $('#cantidad').keypress(function(event){
        if(event.which == 13 ) { // 13 es el código de la tecla Enter
            event.preventDefault(); // Evita que se envíe el formulario
            
           
            // Obtener el valor del campo 'cantidad'
            var cantidad = $('#cantidad').val().trim(); // .trim() elimina los espacios en blanco

            // Validar que no esté vacío y sea mayor que cero
            if(cantidad !== '' && parseFloat(cantidad) > 0) {
                
                var AddListData = $('#form-entrega').serialize();	

                $.ajax({url:'assets/procesos/add_lista_entrega.php',
                    type:'POST',
                    dataType:'html',
                    data:AddListData,
                    success:function(data){	
                        $('#cantidad').val('');
                        $('#productoContrato').val('');	
                        $('#productoID').val('');

                        $('#tabla_entrega').html(data);

                        $('#productoContrato').focus();
                    }
                });
                
                return false;

            } else {
                alert('Por favor ingrese una cantidad válida.');
            }
        }
    });
});

/*ELIMINAR PRODUCTOS DEL ARRAY DE LA LISTA DE ENTREGA */
function eliminarItemEntrega(ID) {
    $.ajax({
        type: 'POST',
        url: 'assets/procesos/eliminar_lista_entrega.php',
        data: {Eliminar: ID},
        success: function(data){	
            $('#tabla_entrega').html(data);

            $('#productoContrato').focus();
        }
    });
}








/*BUSCAR CONTRATO*/
$(document).ready(function(){
    $('#cliente').change(function(){
        var clienteId = $(this).val();
        if(clienteId) {
            buscarContrato(clienteId);
        } else {
            $('#contrato').empty();
        }
    });

    function buscarContrato(clienteId) {
        $.ajax({
            type: 'POST',
            url: 'assets/procesos/buscar_contrato.php',
            data: {cliente: clienteId},
            success: function(data){	
                $('#contrato').html(data);
            }
        });
    }
});


/*BUSCAR CLIENTES PANEL DE EDICION*/
$(document).ready(function(){

    $('#filtrocliente2').on('input', function(){
        buscarClientes($(this).val());
    });

    function buscarClientes(filtro = '') {
        $.ajax({
            type: 'POST',
            url: 'assets/procesos/buscar_clientes.php',
            data: {filtroCliente: filtro},
            success: function(data){	
                $('#cliente2').html(data);
            }
        });
    }
});

/*BUSCAR CONTRATO Y AMPLIACIONES*/
$(document).ready(function(){
    $('#cliente2').change(function(){
        var clienteId = $(this).val();
        if(clienteId) {
            buscarContrato(clienteId);
        } else {
            $('#tabla').empty();
        }
    });

    function buscarContrato(clienteId) {
        $.ajax({
            type: 'POST',
            url: 'assets/procesos/buscar_contrato_ampliacion.php',
            data: {cliente2: clienteId},
            success: function(data){	
                $('#tabla').html(data);
            }
        });
    }
});

/*ACTUALIZAR REGISTROS DE CONTRATO*/
$(document).ready(function(){	
	$('#btn-actualizar-contrato').click(function(){
		var formActualizarContrato = $('#form-actualizar-contrato').serialize();	
		
		$.ajax({url:'assets/procesos/actualizar_contrato.php',
			type:'POST',
			dataType:'html',
			data:formActualizarContrato,
			success:function(respuesta){		
				if(respuesta==1){
                    $('#success-alert-modal').modal('show');
				}else{
					alert(respuesta);
				}
			}
		});
		
		return false;
	});
});

/*GUARDAR NUEVO PRODUCTO*/
$(document).ready(function(){	
    $('#btn-guardar-producto').click(function(){
        
        event.preventDefault();  // Prevenir que el formulario se envíe automáticamente

        var select = $('#code');
        var IDcode = $('#code').val();

        var tieneOpciones = select.find('option').length > 0;
        
        if (IDcode == '0' || !tieneOpciones){
            $('#warning-alert-modal').modal('show');
        }else{

            var formProductos = $('#form-nuevo-producto').serialize();	
            
            $.ajax({url:'assets/procesos/guardar_productos.php',
                type:'POST',
                dataType:'html',
                data:formProductos,
                success:function(respuesta){		
                    if(respuesta==1){
                        
                        $('#success-alert-modal').modal('show');
                    }else{
                        alert(respuesta);
                    }
                }
            });
            
            return false;
        }
	});
});

/*GUARDAR NUEVO CONTRATO*/
$(document).ready(function(){	
    $('#btn-guardar_contrato').click(function(){
        event.preventDefault();  // Prevenir que el formulario se envíe automáticamente

        var $cliente = $('#cliente');
        var IDcliente = $('#cliente').val();
        var monto = $('#monto').val();

        var tieneOpciones = $cliente.find('option').length > 0;
        
        if (monto.trim() === '' || IDcliente == '0' || !tieneOpciones){
            $('#warning-alert-modal').modal('show');
        }else{

            var formContrato = $('#form-nuevo-contrato').serialize();	
            
            $.ajax({url:'assets/procesos/guardar_contrato.php',
                type:'POST',
                dataType:'html',
                data:formContrato,
                success:function(respuesta){		
                    if(respuesta==1){
                        $('#success-alert-modal').modal('show');
                    }else{
                        alert(respuesta);
                    }
                }
            });
            
            return false;
        }
	});
});


/*GUARDAR AMPLIACION*/
$(document).ready(function(){	
	$('#btn-guardar_ampliacion').click(function(){
        event.preventDefault();  // Prevenir que el formulario se envíe automáticamente
        
        var $contrato = $('#contrato');
		var IDcontrato = $('#contrato').val();
        var monto = $('#monto').val();

        var tieneOpciones = $contrato.find('option').length > 0;

        if (monto.trim() === '' || IDcontrato == '0' || !tieneOpciones){
            $('#warning-alert-modal').modal('show');
        }else{
            var formAampliacion = $('#form-ampliacion').serialize();
            
            $.ajax({url:'assets/procesos/guardar_ampliacion.php',
                type:'POST',
                dataType:'html',
                data:formAampliacion,
                success:function(respuesta){		
                    if(respuesta==1){
                        $('#success-alert-modal').modal('show');
                    }else{
                        alert(respuesta);
                    }
                }
            });
            
            return false;
        }
	});
});





/////////////////////////////////////////////
////                                     ////
////        VENTAS POR VENDEDOR          ////
////                                     ////
/////////////////////////////////////////////




function buscarVentasVendedor(fecha1,fecha2,vendedor) {
    $.ajax({
        type: 'POST',
        url: 'assets/procesos/buscar_ventasVendedor.php',
        data: {F1: fecha1, F2: fecha2, VENDE: vendedor},
        success: function(data){	
            $('#tabla-ventas-vendedor').html(data);
            const button = document.getElementById('btn-ventas-vendedor');
            button.innerHTML = 'Generar Consulta';
            button.disabled = false;
        }
    });
}

/*Mostrar lista de cambios de precio al seleccionar origen de datos*/
$(document).ready(function(){
    $('#btn-ventas-vendedor').click(function(){
        const button = document.getElementById('btn-ventas-vendedor');
        button.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>Cargando...';
        button.disabled = true;
        var cod_vende = $('#cod_vende').val();
        var fecha1 = $('#fecha1').val();
        var fecha2 = $('#fecha2').val();

        if (cod_vende == ''){
            var msg = 'Proporcione un codigo de vendedor valido.';
            $('#warning-alert-modal').modal('show');
            $('#msg-warning-alert-modal').html(msg);
        }else{
            if (fecha1 <= fecha2){ 
                buscarVentasVendedor(fecha1,fecha2,cod_vende);
            }else{
                var msg = 'El rango de fecha no a sido definido correctamente.';
                $('#warning-alert-modal').modal('show');
                $('#msg-warning-alert-modal').html(msg);
            }
        }

    });

    
});



////    FIN    ////////////////////////////////////////////////////////////////






/////////////////////////////////////////////
////                                     ////
////        VENTAS POR PROVEEDOR         ////
////                                     ////
/////////////////////////////////////////////




function buscarVentasProveedor(fecha1,fecha2,nrc) {
    $.ajax({
        type: 'POST',
        url: 'assets/procesos/buscar_ventasProveedor.php',
        data: {F1: fecha1, F2: fecha2, NRC: nrc},
        success: function(data){	
            $('#tabla-ventas-proveedor').html(data);
            const button = document.getElementById('btn-ventas-proveedor');
            button.innerHTML = 'Generar Consulta';
            button.disabled = false;
        }
    });
}

/*Mostrar lista de cambios de precio al seleccionar origen de datos*/
$(document).ready(function(){
    $('#btn-ventas-proveedor').click(function(){
        const button = document.getElementById('btn-ventas-proveedor');
        button.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>Cargando...';
        button.disabled = true;

        var nrc = $('#nrc').val();
        var fecha1 = $('#fecha1').val();
        var fecha2 = $('#fecha2').val();

        if (nrc == ''){
            var msg = 'Proporcione un NRC valido.';
            $('#warning-alert-modal').modal('show');
            $('#msg-warning-alert-modal').html(msg);
        }else{
            if (fecha1 <= fecha2){ 
                buscarVentasProveedor(fecha1,fecha2,nrc);
            }else{
                var msg = 'El rango de fecha no a sido definido correctamente.';
                $('#warning-alert-modal').modal('show');
                $('#msg-warning-alert-modal').html(msg);
            }
        }

    });

    
});



////    FIN    ////////////////////////////////////////////////////////////////






//////////////////////////////////////////////////////////
////                                                  ////
////        VENTAS POR PROVEEDOR (CONSOLIDADO)        ////
////                                                  ////
//////////////////////////////////////////////////////////




function buscarVentasProveedorConsolidado(fecha1,fecha2,id,ns, ns_actual) {
    $.ajax({
        type: 'POST',
        url: 'assets/procesos/buscar_ventasProveedor_consolidado.php',
        data: {F1: fecha1, F2: fecha2, ID: id, NS: ns, ACTUAL: ns_actual},
        success: function(data){	
            $('#tabla-ventas-proveedor-consolidado').html(data);
            const button = document.getElementById('btn-ventas-proveedor-consolidado');
            button.innerHTML = 'Generar Consulta';
            button.disabled = false;
        }
    });
}

/*Mostrar lista de cambios de precio al seleccionar origen de datos*/
$(document).ready(function(){
    $('#btn-ventas-proveedor-consolidado').click(function(){
        

        // Obtener valor del select y el data-id del proveedor seleccionado

        var id = $('#nrc_proveedor option:selected').attr('data-id'); // El valor del data-id del proveedor
        var fecha1 = $('#fecha1').val();
        var fecha2 = $('#fecha2').val();

        var ns = $('#ns_data').val();

        var ns_actual = localStorage.getItem('NS');

        if (id === '0'){
            var msg = 'Busque y seleccione un proveedor.';
            $('#warning-alert-modal').modal('show');
            $('#msg-warning-alert-modal').html(msg);
        }else{
            if (fecha1 <= fecha2){ 
                
                const button = document.getElementById('btn-ventas-proveedor-consolidado');
                button.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>Cargando...';
                button.disabled = true;

                buscarVentasProveedorConsolidado(fecha1,fecha2,id,ns, ns_actual);

            }else{
                var msg = 'El rango de fecha no a sido definido correctamente.';
                $('#warning-alert-modal').modal('show');
                $('#msg-warning-alert-modal').html(msg);
            }
        }

    });

    
});



////    FIN    ////////////////////////////////////////////////////////////////





/////////////////////////////////////////
////                                 ////
////        VENTAS POR CODIGO        ////
////                                 ////
/////////////////////////////////////////



/*AGREGAR PRODUCTOS AL ARRAY DEL REPORTE DE VENTAS POR CODIGO */
$(document).ready(function(){	
	$('#btn-agregar-items').click(function(){
       

        var codeSelect = $('#code');
        var hasOptions = codeSelect.find('option').length > 0; // Verifica si tiene opciones

        if (!hasOptions) {
            var msg = 'Busca y selecciona un producto por su codigo o su descripcion.';
            $('#warning-alert-modal').modal('show');
            $('#msg-warning-alert-modal').html(msg);
            return false;
        }


        var fecha1 = $('#fecha1').val();
        var fecha2 = $('#fecha2').val();
        var code = codeSelect.val();


        // Validar que no esté vacío y sea mayor que cero
        if(fecha1.trim() !== '' && fecha2 >= fecha1 && code.trim() !== '' && code !== '0') {
        


            $.ajax({
                url:'assets/procesos/add_lista_ventasXcodigo.php',
                type:'POST',
                data:{CODE: code},
                success:function(data){	
                    if (data == 0){
                        var msg = 'El producto que tratas de agregar ya existe.';
                        $('#warning-alert-modal').modal('show');
                        $('#msg-warning-alert-modal').html(msg);

                        return false;
                    }else{
                        $('#btn').val('');	
                        $('#code').val('');

                        $('#tabla_ventasPorCodigo').html(data);

                        $('#btn').focus();
                    }
                }
            });
            
            return false;
        } else {
            var msg = 'El formulario esta incompleto, asegurate de llenar todos los campos correctamente.';
            $('#warning-alert-modal').modal('show');
            $('#msg-warning-alert-modal').html(msg);
        }
	});
});

/*ELIMINAR PRODUCTOS DEL ARRAY DE VENTAS POR CODIGO */
function eliminarItemVentasXcodigo(ID) {
    $.ajax({
        type: 'POST',
        url: 'assets/procesos/eliminar_lista_ventasXcodigo.php',
        data: {Eliminar: ID},
        success: function(data){	
            $('#tabla_ventasPorCodigo').html(data);

            $('#btn').focus();
        }
    });
}

/*GENERAR REPORTE DE VENTAS POR CODIGO */
$(document).ready(function(){	
	$('#btn-consultar-items').click(function(){
		
        var ns_actual = localStorage.getItem('NS');

        var fecha1 = $('#fecha1').val();
        var fecha2 = $('#fecha2').val();
        var ns = $('#ns').val();

        const button_items = document.getElementById('btn-consultar-items');
        button_items.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>Cargando...';
        button_items.disabled = true;

        const button_agregar = document.getElementById('btn-agregar-items');
        button_agregar.disabled = true;            

		$.ajax({
            type: 'POST',
            url: 'assets/procesos/buscar_ventasXcodigo.php',
            data: { ACTUAL: ns_actual, F1: fecha1, F2: fecha2,  NS: ns },
            success: function (data) {
                if (data == 0){
                    var msg = 'No hay productos agregados a la lista.';
                    $('#warning-alert-modal').modal('show');
                    $('#msg-warning-alert-modal').html(msg);


                    button_items.innerHTML = 'Generar Consulta';
                    button_items.disabled = false;
                    button_agregar.disabled = false;

                    return false;
                }else{
                    $('#btn').val('');	
                    $('#code').val('');

                    $('#tabla_ventasPorCodigo').html(data);

                    $('#btn').focus();

                    button_items.innerHTML = 'Generar Consulta';
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                
                const button_items = document.getElementById('btn-consultar-items');
                button_items.disabled = false;

                const button_agregar = document.getElementById('btn-agregar-items');
                button_agregar.disabled = false;   

                // Manejar errores de la solicitud AJAX
                console.error('AJAX Error:', textStatus, errorThrown);
                alert('Hubo un problema al procesar la solicitud. Verifique los datos del formulario he intenta de nuevo.');
            }
        });
		
		return false;
	});
});

/*EDITAR CONSULTA */
function editarConsulta_ventasXcodigo() {

    $.ajax({
        type: 'POST',
        url: 'assets/procesos/eliminar_lista_ventasXcodigo.php',
        data: {DATA: 'data'},
        success: function(data){	
            $('#tabla_ventasPorCodigo').html(data);

            const button_items = document.getElementById('btn-consultar-items');
            button_items.disabled = false;

            const button_agregar = document.getElementById('btn-agregar-items');
            button_agregar.disabled = false;    


            $('#btn').focus();
        }
    });
}






/////////////////////////////////////////////////////
////                                             ////
////        CONSULTAR DATOS DE CLIENTES          ////
////                                             ////
/////////////////////////////////////////////////////


/*BUSCAR CONTRATO Y AMPLIACIONES*/
$(document).ready(function(){
    $('#cliente2').change(function(){
        var clienteId = $(this).val();
        if(clienteId) {
            buscarDatosCliente(clienteId);
        } else {
            $('#tabla-datos-cliente').empty();
        }
    });

    function buscarDatosCliente(clienteId) {
        $.ajax({
            type: 'POST',
            url: 'assets/procesos/buscar_datos_cliente.php',
            data: {cliente2: clienteId},
            success: function(data){	
                $('#tabla-datos-cliente').html(data);
            }
        });
    }
});


////    FIN    ////////////////////////////////////////////////////////////////






/////////////////////////////////////////////////////
////                                             ////
////        DEUDAS PENDIENTES - CLIENTES         ////
////                                             ////
/////////////////////////////////////////////////////




function buscarDeudasPendientesClientes(fecha1,fecha2,cliente,ns) {
    $.ajax({
        type: 'POST',
        url: 'assets/procesos/buscar_deudas_pendientes_clientes.php',
        data: {F1: fecha1, F2: fecha2, CLIENTE: cliente, NS: ns},
        success: function(data){	
            $('#tabla-deudas-pendientes-clientes').html(data);
            const button = document.getElementById('btn-deudas-pendientes-clientes');
            button.innerHTML = 'Generar Consulta';
            button.disabled = false;
        }
    });
}

/*Mostrar lista de cambios de precio al seleccionar origen de datos*/
$(document).ready(function(){
    $('#btn-deudas-pendientes-clientes').click(function(){
        const button = document.getElementById('btn-deudas-pendientes-clientes');
        button.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>Cargando...';
        button.disabled = true;
        
        var cliente = $('#cliente2').val();
        if (cliente == null){ cliente = '0'; }
        var ns = $('#ns_deuda').val();
        var fecha1 = $('#fecha1').val();
        var fecha2 = $('#fecha2').val();
        if (fecha1 != '') {    
            if (fecha1 <= fecha2){ 
                buscarDeudasPendientesClientes(fecha1,fecha2,cliente,ns);
            }else{
                var msg = 'El rango de fecha no a sido definido correctamente.';
                $('#warning-alert-modal').modal('show');
                $('#msg-warning-alert-modal').html(msg);
            }
        } else {
            var fecha1 = '0';
            var fecha2 = '0';
            buscarDeudasPendientesClientes(fecha1,fecha2,cliente,ns);
        }

    });

    
});



////    FIN    ////////////////////////////////////////////////////////////////








/////////////////////////////////////////////////////
////                                             ////
////        CIERRES DE CAJAS (corte z)           ////
////                                             ////
/////////////////////////////////////////////////////




function buscarCierresdeCaja(fecha,ns) {
    $.ajax({
        type: 'POST',
        url: 'assets/procesos/buscar_cierres_caja.php',
        data: {F1: fecha, NS: ns},
        success: function(data){	
            $('#tabla-cierres-caja').html(data);
            const button = document.getElementById('btn-cierres-caja');
            button.innerHTML = 'Generar Consulta';
            button.disabled = false;
        }
    });
}

/*Mostrar lista de cambios de precio al seleccionar origen de datos*/
$(document).ready(function(){
    $('#btn-cierres-caja').click(function(){
        

        var ns = $('#ns_cierre').val();
        var fecha = $('#fecha_cierre').val();


        if (fecha.trim() != '') {    
            const button = document.getElementById('btn-cierres-caja');
            button.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>Cargando...';
            button.disabled = true;            
            buscarCierresdeCaja(fecha,ns);
        } else {
            var msg = 'La fecha es necesaria para generar el reporte.';
            $('#warning-alert-modal').modal('show');
            $('#msg-warning-alert-modal').html(msg);
        }

    });

    
});





/////////////////////////////////////
////                             ////
////        COLECTORES           ////
////                             ////
/////////////////////////////////////




function buscarColectores(ns,fecha1,fecha2,colector,caja) {
    $.ajax({
        type: 'POST',
        url: 'assets/procesos/buscar_colectores.php',
        data: {F1: fecha1, F2: fecha2, NS: ns, COLECTOR: colector, CAJA: caja},
        success: function(data){	
            $('#tabla-colectores').html(data);
            const button = document.getElementById('btn-colectores');
            button.innerHTML = 'Generar Consulta';
            button.disabled = false;
        }
    });
}

/*al precionar el boton de generar consulta */
$(document).ready(function(){
    $('#btn-colectores').click(function(){
        
        var ns = localStorage.getItem('NS');
        var colector  = $('#colector').val();
        var fecha1 = $('#fecha1').val();
        var fecha2 = $('#fecha2').val();
        var caja = $('#ncajacolector').val();

        if (caja == ''){
            caja = 0;
        }

        if (colector != '0') {    
            const button = document.getElementById('btn-colectores');
            button.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>Cargando...';
            button.disabled = true;            
            buscarColectores(ns,fecha1,fecha2,colector,caja);
        } else {
            var msg = 'Seleccione un colector para generar la consulta.';
            $('#warning-alert-modal').modal('show');
            $('#msg-warning-alert-modal').html(msg);
        }

    });

    
});

/*Al precionar enter sobre campo de numero de caja */
$(document).ready(function(){	
    $('#ncajacolector').keypress(function(event){
        if(event.which == 13 ) { // 13 es el código de la tecla Enter
            event.preventDefault(); // Evita que se envíe el formulario
        
            var ns = localStorage.getItem('NS');
            var colector  = $('#colector').val();
            var fecha1 = $('#fecha1').val();
            var fecha2 = $('#fecha2').val();
            var caja = $('#ncajacolector').val();

            if (caja == ''){
                caja = 0;
            }

            if (colector != '0') {    
                const button = document.getElementById('btn-colectores');
                button.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>Cargando...';
                button.disabled = true;            
                buscarColectores(ns,fecha1,fecha2,colector,caja);
            } else {
                var msg = 'Seleccione un colector para generar la consulta.';
                $('#warning-alert-modal').modal('show');
                $('#msg-warning-alert-modal').html(msg);
            }

        }
    });
});

function recargarColectores(){

    var ns = localStorage.getItem('NS');
    var colector  = $('#colector').val();
    var fecha1 = $('#fecha1').val();
    var fecha2 = $('#fecha2').val();
    var caja = $('#ncaja').val();

    if (caja == ''){
        caja = 0;
    }

    if (colector != '0') {    
        const button = document.getElementById('btn-colectores');
        button.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>Cargando...';
        button.disabled = true;            
        buscarColectores(ns,fecha1,fecha2,colector,caja);
    } else {
        var msg = 'Seleccione un colector para generar la consulta.';
        $('#warning-alert-modal').modal('show');
        $('#msg-warning-alert-modal').html(msg);
    }

}






/////////////////////////////////////////////////////
////                                             ////
////   FACTURAS ELIMINADAS EN SUCURSALES         ////
////                                             ////
/////////////////////////////////////////////////////




function buscarFacturasEliminadas(fecha1,fecha2,ns) {
    $.ajax({
        type: 'POST',
        url: 'assets/procesos/buscar_facturas_eliminadas.php',
        data: {F1: fecha1, F2: fecha2,  NS: ns},
        success: function(data){	
            $('#tabla-facturas-eliminadas').html(data);
            const button = document.getElementById('btn-facturas-eliminadas');
            button.innerHTML = 'Generar Reporte';
            button.disabled = false;
        }
    });
}

/*Mostrar lista de cambios de precio al seleccionar origen de datos*/
$(document).ready(function(){
    $('#btn-facturas-eliminadas').click(function(){
        const button = document.getElementById('btn-facturas-eliminadas');
        button.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>Cargando...';
        button.disabled = true;
        
   
        var ns = $('#ns').val();
        var fecha1 = $('#fecha1').val();
        var fecha2 = $('#fecha2').val();
        if (fecha1 !== '' && fecha1 !== '0000-00-00') {    
            if (fecha1 <= fecha2){ 
                buscarFacturasEliminadas(fecha1,fecha2,ns);
            }else{
                var msg = 'El rango de fecha no a sido definido correctamente.';
                $('#warning-alert-modal').modal('show');
                $('#msg-warning-alert-modal').html(msg);
            }
        } else {
            var msg = 'La fecha de inicio y fin son nesesarias para generar el reporte.';
            $('#warning-alert-modal').modal('show');
            $('#msg-warning-alert-modal').html(msg);
        }

    });

    
});



////    FIN    ////////////////////////////////////////////////////////////////




///////////////////////////////////
////                           ////
////        UTILIDADES         ////
////                           ////
///////////////////////////////////


function categoriaUtilidades(cat) {
    $.ajax({
        type: 'POST',
        url: 'assets/procesos/Utilidad_categoria.php',
        data: {CAT: cat},
        success: function(data){
            
            // Mostrar el modal
            var myModalEl = document.getElementById('Categoria-Utilidad');
            var myModal = new bootstrap.Modal(myModalEl);
            myModal.show();

            //muestra los datos
            $('#tabla-categorias').html(data);
        }
    });    
}




function VerDetalleUtilidad(f1,f2,ns,id,tup) {
    $.ajax({
        type: 'POST',
        url: 'assets/procesos/buscar_detalle_utilidad.php',
        data: {F1: f1, F2: f2, NS: ns, ID: id, TUP: tup},
        success: function(data){	

            // Mostrar el modal
            var myModalEl = document.getElementById('detalles-venta');
            var myModal = new bootstrap.Modal(myModalEl);
            myModal.show();

            //muestra los datos
            $('#tabla-ver-detalle-utilidad').html(data);

        }
    });    
}


function buscarUtilidades(fecha1,fecha2,ns) {
    $.ajax({
        type: 'POST',
        url: 'assets/procesos/buscar_utilidades.php',
        data: {F1: fecha1, F2: fecha2, NS: ns},
        success: function(data){	
            $('#tabla-utilidades').html(data);
            const button = document.getElementById('btn-utilidades');
            button.innerHTML = 'Generar Consulta';
            button.disabled = false;
        }
    });
}

$(document).ready(function(){
    $('#btn-utilidades').click(function(){
        
        var ns = $('#ns').val();
        var fecha1 = $('#fecha1').val().trim(); 
        var fecha2 = $('#fecha2').val().trim(); 

        if (fecha1 !== '' && fecha1 !== '0000-00-00') {    
            if (fecha1 <= fecha2){ 
                // Convertir las fechas a objetos Date
                var date1 = new Date(fecha1);
                var date2 = new Date(fecha2);

                // Calcular la diferencia en meses
                var diffYears = date2.getFullYear() - date1.getFullYear();
                var diffMonths = (diffYears * 12) + (date2.getMonth() - date1.getMonth());

                if (diffMonths > 3) {
                    var msg = 'El rango de fechas no debe ser mayor a 3 meses.';
                    $('#warning-alert-modal').modal('show');
                    $('#msg-warning-alert-modal').html(msg);
                }else{
                    buscarUtilidades(fecha1,fecha2,ns);
                    const button = document.getElementById('btn-utilidades');
                    button.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>Cargando...';
                    button.disabled = true;
                    
                }
            }else{
                var msg = 'El rango de fecha no a sido definido correctamente.';
                $('#warning-alert-modal').modal('show');
                $('#msg-warning-alert-modal').html(msg);
            }
        } else {
            var msg = 'La fecha es obligatoria para generar el reporte.';
            $('#warning-alert-modal').modal('show');
            $('#msg-warning-alert-modal').html(msg);
        }

    });

    
});



////    FIN    ////////////////////////////////////////////////////////////////

