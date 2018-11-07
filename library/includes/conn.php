<?php
define("DB_SERVER", "localhost"); //файл с подключением к БД, скорее всего, можно проще
define("DB_USER", "root");
define("DB_PASS", "");
define("DB_NAME", "library");

$conn = mysqli_connect(DB_SERVER,DB_USER, DB_PASS, DB_NAME);