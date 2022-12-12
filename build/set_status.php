<?php session_start();
header("Content-Type: application/json; charset=UTF-8");
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

if (empty($_SESSION['user'])) {
    exit(json_encode(['status' => 'error'], JSON_UNESCAPED_UNICODE));
}


$json = file_get_contents('php://input') ?? NULL;
if ($json == NULL) {
    exit(json_encode(['status' => 'error'], JSON_UNESCAPED_UNICODE));
}
$request = json_decode($json, true);
$id = $request['id'];
$status = $request['status'];
$comments = $request['comments'];

try {
    $mysqli = new mysqli("localhost", $_SESSION['user']['login'], $_SESSION['user']['pass'], "tls");
} catch (mysqli_sql_exception $e) {
    exit(json_encode(['status' => 'error', 'error' => $e->getMessage()], JSON_UNESCAPED_UNICODE));
}

$query = "UPDATE requests SET status = '$status', comments = '$comments' WHERE id = $id";

if ($mysqli -> query($query) === TRUE) {
    echo json_encode(['status' => 'send'], JSON_UNESCAPED_UNICODE);
  } else {
    echo json_encode(['status' => 'error'], JSON_UNESCAPED_UNICODE);
  }
  
?>