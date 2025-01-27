
/*ACTUALIZAR IMAGEN*/
$(document).ready(function(){
    $('#buscarproductoActualizar').on('input', function(){
        var producto = $(this).val();
        $.ajax({
            type: 'POST',
            url: 'assets/procesos/buscar_productos_actualizar.php',
            data: {PRODUCTO: producto},
            success: function(data){	
                $('#tabla-buscar-producto-Actualizar').html(data);
                  
            },
            error: function(error) {
                console.error('Error en la solicitud AJAX: ', error);
            }
        });
    });
});


$(document).ready(function(){	
	$('#buscarproductoActualizar').keypress(function(event){
        if(event.which == 13 ) { // 13 es el código de la tecla Enter
            event.preventDefault(); // Evita que se envíe el formulario
              
        
        }
    });
});

function selectItemsActualizar(data1) {
    localStorage.setItem('ID_UPLOAD', data1);
    //$('#srcimagen').val('');
    $('#captureModal').modal('show');
    //$('#tabla-msg').html('');
    //$('#tabla-mayoreo').html(cargando);  
}

function actualizaBusqueda(id) {
    $.ajax({
        type: 'POST',
        url: 'assets/procesos/buscar_productos_actualizar.php',
        data: {PRODUCTO: id},
        success: function(data){	
            $('#tabla-buscar-producto-Actualizar').html(data);
              
        },
        error: function(error) {
            console.error('Error en la solicitud AJAX: ', error);
        }
    });
}


$(document).ready(function () {
    $('#saveImage').click(function () {

        var id = localStorage.getItem("ID_UPLOAD");

       
        var imagefile = $('#image')[0].files[0]; // Obtén el archivo seleccionado
       
        // Verifica si se seleccionó un archivo
        if (!imagefile) {
            alert('Por favor selecciona una imagen antes de guardar.');
            return;
        }

        // Crea un objeto FormData para enviar los datos
        var formData = new FormData();
        formData.append('ID', id); // Agrega el ID al FormData
        formData.append('IMAGE', imagefile); // Agrega el archivo al FormData

        // Realiza la solicitud AJAX para subir el archivo
        $.ajax({
            type: 'POST',
            url: 'assets/procesos/upload.php', // Ruta a tu script PHP
            data: formData,
            processData: false, // Evita que jQuery procese los datos
            contentType: false, // Evita que jQuery configure el tipo de contenido
            success: function (response) {
                if (response == 1) {
                    $('#captureModal').modal('hide');
                    actualizaBusqueda(id);
                } else {
                   alert(response);
                }
            },
            error: function (error) {
                console.error('Error en la solicitud AJAX: ', error);
            }
        });
    });
});


