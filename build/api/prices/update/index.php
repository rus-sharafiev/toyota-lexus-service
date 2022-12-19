<?php session_start();
header("Content-Type: application/json; charset=UTF-8");

if (empty($_SESSION['user'])) {
    exit(json_encode(['status' => 'error'], JSON_UNESCAPED_UNICODE));
}

$json = file_get_contents('php://input') ?? NULL;
if ($json == NULL) {
    exit(json_encode(['status' => 'error'], JSON_UNESCAPED_UNICODE));
}
$request = json_decode($json, true);
$id = $request['id'];
$name = $request['name'];
$price = $request['price'];

try {
    $mysqli = new mysqli("localhost", $_SESSION['user']['login'], $_SESSION['user']['pass'], "tls");
} catch (mysqli_sql_exception $e) {
    exit(json_encode(['status' => 'error', 'error' => $e -> getMessage()], JSON_UNESCAPED_UNICODE));
}

if (!$mysqli -> set_charset("utf8")) {
    exit();
}

$query = "UPDATE price SET name = '$name', price = '$price' WHERE id = '$id'";

if ($mysqli -> query($query) === TRUE) {
    echo json_encode(['status' => 'send'], JSON_UNESCAPED_UNICODE);
  } else {
    echo json_encode(['status' => 'error'], JSON_UNESCAPED_UNICODE);
  }
  
?>