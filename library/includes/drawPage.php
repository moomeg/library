<?php
require("../includes/conn.php");    //собственно, скрипт передачи данных книг, делает отрисовку элементов на странице
header("Content-Type: application/json", true);
$showItems=$_GET['showItems'];
$currentPage=$_GET['currentPage'];
$highShelf=$showItems*$currentPage; //нижний порог элементов на странице
$lowShelf=$highShelf-$showItems;    //соответственно, верхний
    $result=mysqli_query($conn,"SELECT * FROM books");
    $rows=mysqli_num_rows($result);
    for ($j=0; $j<$lowShelf;$j++){        //Вот тут лютый костыль!!! Непонимаю почему в SQL-запрсе не работает LIMIT... "SELECT * FROM books LIMIT '".$lowShelf."','".$highShelf."'" Из-под PhpMyAdmin работает, а тут - нет... Пришлось выкручиваться
        $row = mysqli_fetch_assoc($result);} //сначала перебираю все до нижнего порога, только потом беру в обработку
    for ($i = 0; $i < $showItems; $i++){
        $row = mysqli_fetch_assoc($result);
        $bookID=$row['BookID']; //вот та самая группа из пяти
        $authorID=$row['AuthorID'];
        $bookname=$row['BookName'];
        $linktobook=$row['linktobook'];
        $synopsis=$row['synopsis'];
        $linktobookface=$row['linktobookface'];
        $authorResult=mysqli_query($conn,"SELECT DISTINCT Author FROM authors WHERE AuthorID = '".$authorID."'");
        $authorName=mysqli_fetch_assoc($authorResult);
        $jsonResult['bookname'.$i] = $bookname;
        $jsonResult['linktobook'.$i] = $linktobook;
        $jsonResult['linktobookface'.$i] = $linktobookface;
        $jsonResult['authorName'.$i] = $authorName['Author'];
        $jsonResult['synopsis'.$i] = $synopsis;
    }
echo json_encode($jsonResult);
