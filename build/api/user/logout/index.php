<?php session_start();
header("Content-Type: application/json; charset=UTF-8");

unset($_SESSION['user']);
exit(json_encode(['user' => 'no'], JSON_UNESCAPED_UNICODE));

?>