<?php
require("includes/conn.php");
class authorRecord //класс записи автора, с книгами не получилось, AJAX не хотел передавать запрос в объект, так бы точно так же сделал, но времени не хватало разбираться, нужно было сделать так, чтоб работало
{
    function getAuthorInfo($conn){  //функция получает инфо об авторе
        $result_author=mysqli_query($conn,"SELECT * FROM authors");
        $rows_author=mysqli_num_rows($result_author);
        for ($i = 0; $i < $rows_author; $i++){
            $row = mysqli_fetch_assoc($result_author);
            $authorID=$row['AuthorID'];
            $author=$row['Author'];
            $authorphoto=$row['linktophoto'];
            $linktopage=$row['linktopage'];
            $this->drawRecord($conn,$author,$authorID,$authorphoto,$linktopage);
        }
    }

    function drawRecord($conn, $author, $authorID, $authorphoto){  //функция рисует блок с инфо об авторе
        echo "<div class='author_block'>
                <table>
                    <tr>
                        <td>";
        echo $author;
        echo "</td>
                <td rowspan='3' valign='bottom'>Bibliography
                    <div class='block'><ul>";
        echo $this->getBooklist($conn,$authorID);
        echo "<ul></div></td>
                    </tr>
                    <tr>
                        <td valign='bottom'><img height='300px' width='auto' src=\"";
        echo $authorphoto;
        echo "\"></td>
                    </tr>
                </table>    
            </div>
            <br>
            <br>
            <br>
            <br>";
    }

    function getBooklist($conn, $authorID){ //функция получает список книг
        $result_books=mysqli_query($conn,"SELECT * FROM books WHERE authorID='".$authorID."'");
        $rows_books=mysqli_num_rows($result_books);
        for ($i = 0; $i < $rows_books; $i++) {
            $row = mysqli_fetch_assoc($result_books);
            echo "<li>" .$row['BookName']."</li>";
        }
    }
}