<?php
header("Content-Type: application/json; charset=UTF-8");

$mysqli = new mysqli("localhost", "root", "", "tls");

if ($mysqli -> connect_error) {
    exit("Не удалось подключиться к базе: " . $mysqli -> connect_error);
}

if (!$mysqli -> set_charset("utf8")) {
    exit();
}

$json = file_get_contents('php://input') ?? NULL;

$request = json_decode($json, true);
foreach ($request as $key => $value) {
  if ($key == 'name' && mb_strlen($value) < 20) {
    $client = $value;
  } else if ($key == 'phone' && mb_strlen($value) == 10) {
    $phone = $value;
  } else if ($key == 'mileage' && mb_strlen($value) < 10) {
    $mileage = $value;
  } else if ($key == 'car' && mb_strlen($value) < 50) {
    $car = $value;
  } else if ($key == 'maintenance' && mb_strlen($value) < 1000) {
    $maintenance = $value;
  } else {
    exit(json_encode(['status' => 'error', 'error' => 'ошибка в запросе'], JSON_UNESCAPED_UNICODE));
  }
}

$id = time();
$timestamp = date("d.m.Y h:i:s");

// Регистрация в базе
$array = ['id' => $id, $timestamp, $phone, $client, $car, $mileage, $maintenance];
$comments = 'АКБ 1 - 
АКБ 2 - 
ПТД - 
ПТК - 
ЗТД - 
ЗТК - 
РК - ';

$sql = "INSERT INTO requests (id, phone, client_name, car, mileage, maintenance, comments)
VALUES ($id, '$phone', '$client', '$car', '$mileage', '$maintenance', '$comments')";

if ($mysqli -> query($sql) === TRUE) {
  echo json_encode(['status' => 'send', 'data' => $array], JSON_UNESCAPED_UNICODE);
} else {
  echo json_encode(['status' => 'error'], JSON_UNESCAPED_UNICODE);
}

// Отправка письма
$to = 'zayavka@tlservice-kazan.ru';
$subject = 'Новая заявка #' . $id;
$message = '
<html lang="ru">
<head>
  <title>Заявка №' . $id . '</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
    <table style="border-collapse: collapse;">
        <tr>
            <td style="border: none; padding: 10px" colspan="2">Заявка №' . $id . '</td>
        </tr>
        <tr>
            <td style="padding: 10px;">Клиент</td>
            <td style="padding: 10px;">' . $client . '</td>
        </tr>
        <tr>
            <td style="padding: 10px;">Телефон</td>
            <td style="padding: 10px;">+7' . $phone . '</td>
        </tr>
        <tr>
            <td style="padding: 10px;">Автомобиль</td>
            <td style="padding: 10px;">' . $car . '</td>
        </tr>
        <tr>
            <td style="padding: 10px;">Пробег</td>
            <td style="padding: 10px;">' . $mileage . ' км</td>
        </tr>
        <tr>
            <td style="border: none; padding: 20px 10px 0;" colspan="2">Причина обращения</td>
        </tr>
        <tr>
            <td style="padding: 10px;" colspan="2">' . $maintenance . '</td>
        </tr>
    </table>
</body>
</html>
';
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-type: text/html; charset=utf-8';

mail($to, $subject, $message, implode("\r\n", $headers));

$mysqli -> close();
?>