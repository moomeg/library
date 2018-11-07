<?php
// вот тут вообще не получилось... Хотя никто и не говорил, что будет легко, еще немного времени, и я бы справился, но отправку лучше сразу делать через фреймворк на виртуальной машине (по большому счету, все лучше через фреймворк...)
$name=$_GET['name'];
$email=$_GET['email'];
$linktobook=$_GET['linktobook'];

$headers =  'Library';


if (isset($name) && filter_var($email, FILTER_VALIDATE_EMAIL)) { //валидация обоих полей сразу... Имя только проверял на существование, особо нечего валидировать, оно ж не в базу пишется
    $result['error'] = 0;
    mail($email, "Book order", "Congratulations on purchase! Here is the download link: ".$linktobook, $headers); //вот тут засада, нужно больше времени
}
    else {
    $result['error'] = 1;
    }

echo json_encode($result);