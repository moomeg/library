<?php
require("../includes/conn.php");    //расчет общего количества страниц в пейджере
$showItems=$_GET['showItems'];
$result=mysqli_query($conn,"SELECT * FROM books");
$rows=mysqli_num_rows($result);
$totalPages=intdiv($rows,$showItems); //округляю количество страниц в большую сторону, скорее всего, можно и попроще
if ($rows%$showItems>0){
    $totalPages++;
}
$pages['totalPages'] = $totalPages;
echo json_encode($pages);