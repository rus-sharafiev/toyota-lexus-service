<?php session_start();
header("Content-Type: application/json; charset=UTF-8");

if (empty($_SESSION['user'])) {
    exit(json_encode(['user' => 'no'], JSON_UNESCAPED_UNICODE));
}

try {
    $mysqli = new mysqli("localhost", $_SESSION['user']['login'], $_SESSION['user']['pass'], "tls");
} catch (mysqli_sql_exception $e) {
    unset($_SESSION['user']);
    exit(json_encode(['user' => 'unauthorized', 'error' => $e->getMessage()], JSON_UNESCAPED_UNICODE));
}

echo json_encode(['user' => 'yes'], JSON_UNESCAPED_UNICODE);
?>