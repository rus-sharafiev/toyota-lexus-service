<?php session_start();
header("Content-Type: application/json; charset=UTF-8");

if (empty($_SESSION['user'])) {
    exit(json_encode(['status' => 'error'], JSON_UNESCAPED_UNICODE));
}

try {
    $mysqli = new mysqli("localhost", $_SESSION['user']['login'], $_SESSION['user']['pass'], "tls");
} catch (mysqli_sql_exception $e) {
    unset($_SESSION['user']);
    exit(json_encode(['status' => 'error', 'error' => $e->getMessage()], JSON_UNESCAPED_UNICODE));
}

$query = "DELETE FROM requests WHERE status='delete'";

if ($mysqli -> query($query) === TRUE) {
    echo json_encode(['status' => 'send'], JSON_UNESCAPED_UNICODE);
  } else {
    echo json_encode(['status' => 'error'], JSON_UNESCAPED_UNICODE);
  }

?>