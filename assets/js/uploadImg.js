
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

        alert(id);
        var imagefile = $('#image')[0].files[0]; // Obtén el archivo seleccionado
        alert(imagefile);
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
/*
$(document).ready(function() {
    $('#saveImage').click(function() {
        alert('preciono guardar');
        var id = localStorage.getItem("ID_UPLOAD");
        var imagefile = $('#image').val();

        $.ajax({
            type: 'POST',
            url: 'assets/procesos/upload.php',
            data: { ID: id, IMAGE: imagefile },
            success: function(response) {    
                if (response == 1) {
                    $('#captureModal').modal('hide');
                    actualizaBusqueda(id);
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
*/
/*document.addEventListener("DOMContentLoaded", () => {
    const camera = document.getElementById("camera");
    const snapshot = document.getElementById("snapshot");
    const captureButton = document.getElementById("capture");
    const saveButton = document.getElementById("saveImage");
    let stream;
  
    // Abrir la cámara cuando se muestra el modal
    const captureModal = document.getElementById("captureModal");
    captureModal.addEventListener("shown.bs.modal", async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        camera.srcObject = stream;
        camera.play();
      } catch (error) {
        console.error("No se pudo acceder a la cámara: ", error);
        alert("No se pudo acceder a la cámara. Asegúrate de haber otorgado permisos.");
      }
    });
  
    // Detener la cámara cuando se cierra el modal
    captureModal.addEventListener("hidden.bs.modal", () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      resetModal();
    });
  
    // Capturar la imagen
    captureButton.addEventListener("click", () => {
      const context = snapshot.getContext("2d");
      snapshot.width = camera.videoWidth;
      snapshot.height = camera.videoHeight;
      context.drawImage(camera, 0, 0);
      snapshot.classList.remove("d-none");
      saveButton.classList.remove("d-none");
      camera.classList.add("d-none");
      captureButton.classList.add("d-none");
    });
  
    // Guardar la imagen
    saveButton.addEventListener("click", () => {
        var id = localStorage.getItem("ID_UPLOAD");
      const dataURL = snapshot.toDataURL("image/png");
  
      // Subir la imagen al servidor
      fetch("assets/procesos/upload.php", {
        method: "POST",
        body: JSON.stringify({ 
            image: dataURL, // Imagen capturada
            ID: id          // ID adicional
          }),
        headers: { "Content-Type": "application/json" }
      })
        .then(response => response.json())
        .then(data => {
          if (data.status === "success") {
            //alert("Imagen subida correctamente");
            //console.log("Ruta de la imagen en el servidor: ", data.path);
            // Reiniciar el modal
            resetModal();
          } else {
            alert("Error al subir la imagen: " + data.message);
          }
        })
        .catch(error => console.error("Error al subir la imagen: ", error));
    });
  
    function resetModal() {
      snapshot.classList.add("d-none");
      saveButton.classList.add("d-none");
      camera.classList.remove("d-none");
      captureButton.classList.remove("d-none");
      $('#captureModal').modal('hide');
    }
  });
  */


