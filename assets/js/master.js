/// CARGAR PAGINAS ///
function pageLoad(uri,div) {

    $.ajax({
        type: 'POST',
        url: uri,
        success: function(response) {
            
            $(div).html(response);
              
        },
        error: function(error) {
            console.log('Error en la solicitud AJAX: ', error);
        }
    });
}

function eliminarSesion() {
    $.ajax({
        url: 'assets/procesos/eliminar_sesion.php', // Ruta al script PHP
        method: 'POST',
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                location.reload(); // Recargar la página
            } else {
                alert("No se pudo eliminar la sesión.");
            }
        },
        error: function(xhr, status, error) {
            console.error("Error al eliminar la sesión:", error);
        }
    });
}

/// GUARDAR PRODUCTOS DE CANASTA ///
function cargarListaPedidos() {

    // Enviar solicitud AJAX con jQuery
    $.ajax({
       type: 'POST',
       url: 'assets/procesos/update_list_pedidos.php', // Cambia esta ruta según corresponda
       data: {},
       success: function(response) {
           
           $('#resultDiv').html(response);
         
       },
       error: function(error) {
           console.error('Error en la solicitud AJAX: ', error);
       }
   });
   
}