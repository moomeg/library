<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Library</title>
    <!-- Bootstrap core CSS -->
    <link href="../css/custom.css" rel="stylesheet">
</head>
<body>
<?php //отрисовываем блоки с авторами
require("../Classes/authorRecord.php");
$authorRecord = new authorRecord();
$authorRecord->getAuthorInfo($conn);
?>
</body>
</html>

