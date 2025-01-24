<?php
//CONEXCION galo
/*
$host = "192.168.100.225";
$port = 3306;
$user = "admin";
$pass = "cuenta1234";
$db = "dbf_tn";
*/

//CONEXCION CSIS
$host = "190.62.72.6";
$port = 3306;
$user = "dbu_csruta";
$pass = "mcA#7veFD3";
$db = "dbf_csruta";

$conexion = mysqli_connect($host, $user, $pass, $db, $port);

//recuerda siempre cerrar la conexcion con la base de datos 
//mysqli_close($conexion);


?>