<?php
/*
// Verificar si se envió el formulario
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Verificar si se seleccionó un archivo
    if (isset($_FILES['image']) && isset($_POST['imageName'])) {
        $image = $_FILES['image'];
        $imageName = basename($_POST['imageName']);

        // Validar que el nombre del archivo no esté vacío y tenga extensión válida
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
        $fileExtension = strtolower(pathinfo($imageName, PATHINFO_EXTENSION)); // Convertir la extensión a minúsculas
        if (!in_array($fileExtension, $allowedExtensions)) {
            die("Error: Extensión de archivo no permitida.");
        }

        // Validar que el archivo subido sea una imagen válida
        $check = getimagesize($image['tmp_name']);
        if ($check === false) {
            die("Error: El archivo no es una imagen.");
        }

        // Definir el directorio de destino
        $targetDir = "img/";
        $targetFile = $targetDir . $imageName;

        // Mover el archivo subido al directorio destino
        if (move_uploaded_file($image['tmp_name'], $targetFile)) {
            echo "Imagen subida con éxito. <a href='$targetFile'>Ver Imagen</a>";
        } else {
            echo "Error al subir la imagen.";
        }
    } else {
        echo "Error: No se seleccionó un archivo o no se proporcionó un nombre.";
    }
} else {
    echo "Método no permitido.";
}



este funciona pero no en esta estructura 

// Verificar si se envió el formulario
if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && mb_strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
    
    // Verificar si se seleccionó un archivo
    if (isset($_FILES['IMAGE']) && isset($_POST['ID'])) {
        $image = $_FILES['IMAGE'];
        $imageName = basename($_POST['ID']);

        // Validar que el nombre del archivo no esté vacío y tenga extensión válida
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
        $fileExtension = strtolower(pathinfo($imageName, PATHINFO_EXTENSION)); // Convertir la extensión a minúsculas
        if (!in_array($fileExtension, $allowedExtensions)) {
            die("Error: Extensión de archivo no permitida.");
        }

        // Validar que el archivo subido sea una imagen válida
        $check = getimagesize($image['tmp_name']);
        if ($check === false) {
            die("Error: El archivo no es una imagen.");
        }

        // Definir el directorio de destino
        $targetDir = "img/";
        $targetFile = $targetDir . $imageName;

        // Obtener tamaño de la imagen original
        list($width, $height) = $check;

        // Establecer dimensiones máximas
        $maxDim = 800;
        if ($width > $maxDim || $height > $maxDim) {
            // Calcular nuevas dimensiones manteniendo proporción
            $ratio = $width / $height;
            if ($ratio > 1) {
                $newWidth = $maxDim;
                $newHeight = $maxDim / $ratio;
            } else {
                $newHeight = $maxDim;
                $newWidth = $maxDim * $ratio;
            }

            // Redimensionar imagen
            $newImage = imagecreatetruecolor($newWidth, $newHeight);
            switch ($fileExtension) {
                case 'jpg':
                case 'jpeg':
                    $source = imagecreatefromjpeg($image['tmp_name']);
                    break;
                case 'png':
                    $source = imagecreatefrompng($image['tmp_name']);
                    imagealphablending($newImage, false);
                    imagesavealpha($newImage, true);
                    break;
                case 'gif':
                    $source = imagecreatefromgif($image['tmp_name']);
                    break;
                default:
                    die("Error: Formato de archivo no compatible.");
            }

            imagecopyresampled($newImage, $source, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

            // Guardar la imagen redimensionada
            switch ($fileExtension) {
                case 'jpg':
                case 'jpeg':
                    imagejpeg($newImage, $targetFile, 80);
                    break;
                case 'png':
                    imagepng($newImage, $targetFile, 8);
                    break;
                case 'gif':
                    imagegif($newImage, $targetFile);
                    break;
            }

            imagedestroy($newImage);
            imagedestroy($source);
        } else {
            // Si no necesita redimensionarse, mover el archivo directamente
            if (!move_uploaded_file($image['tmp_name'], $targetFile)) {
                die("Error al subir la imagen.");
            }
        }

        echo "Imagen subida con éxito. <a href='$targetFile'>Ver Imagen</a>";
    } else {
        echo "Error: No se seleccionó un archivo o no se proporcionó un nombre.";
    }
} else {
    echo "Método no permitido.";
}
*/

// Verificar si se envió el formulario vía AJAX
if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
    if (isset($_FILES['IMAGE']) && isset($_POST['ID'])) {
        $image = $_FILES['IMAGE'];
        $id = $_POST['ID'];

        // Validar extensión y tipo de archivo
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
        $fileExtension = strtolower(pathinfo($image['name'], PATHINFO_EXTENSION));
        if (!in_array($fileExtension, $allowedExtensions)) {
            die("Error: Extensión de archivo no permitida.");
        }

        // Validar tamaño del archivo
        $maxFileSize = 2 * 1024 * 1024; // 2 MB
        if ($image['size'] > $maxFileSize) {
            die("Error: El archivo es demasiado grande. Máximo 2 MB.");
        }

        // Generar un nombre único
        $imageName = '@' . $id . '.' . $fileExtension;

        // Validar que el archivo sea una imagen
        $check = getimagesize($image['tmp_name']);
        if ($check === false) {
            die("Error: El archivo no es una imagen.");
        }

        // Directorio de destino
        $targetDir = "img/";
        $targetFile = $targetDir . $imageName;

        // Obtener dimensiones originales
        list($width, $height) = $check;
        $maxDim = 800;

        // Redimensionar si es necesario
        if ($width > $maxDim || $height > $maxDim) {
            $ratio = $width / $height;
            $newWidth = ($ratio > 1) ? $maxDim : $maxDim * $ratio;
            $newHeight = ($ratio > 1) ? $maxDim / $ratio : $maxDim;

            $newImage = imagecreatetruecolor($newWidth, $newHeight);
            switch ($fileExtension) {
                case 'jpg':
                case 'jpeg':
                    $source = imagecreatefromjpeg($image['tmp_name']);
                    break;
                case 'png':
                    $source = imagecreatefrompng($image['tmp_name']);
                    imagealphablending($newImage, false);
                    imagesavealpha($newImage, true);
                    break;
                case 'gif':
                    $source = imagecreatefromgif($image['tmp_name']);
                    break;
                default:
                    die("Error: Formato de archivo no compatible.");
            }
            imagecopyresampled($newImage, $source, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

            // Guardar imagen redimensionada
            switch ($fileExtension) {
                case 'jpg':
                case 'jpeg':
                    imagejpeg($newImage, $targetFile, 80);
                    break;
                case 'png':
                    imagepng($newImage, $targetFile, 8);
                    break;
                case 'gif':
                    imagegif($newImage, $targetFile);
                    break;
            }

            imagedestroy($newImage);
            imagedestroy($source);
        } else {
            // Si no necesita redimensionar, guardar directamente
            if (!move_uploaded_file($image['tmp_name'], $targetFile)) {
                die("Error al mover el archivo.");
            }
        }

        echo 1;
    } else {
        echo "Error: No se seleccionó un archivo o no se proporcionó un ID.";
    }
} else {
    echo "Método no permitido.";
}



?>
