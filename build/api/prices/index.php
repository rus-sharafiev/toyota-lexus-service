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

if (!$mysqli -> set_charset("utf8")) {
    exit();
}

$query = "SELECT * FROM price";

if ($stmt = $mysqli -> prepare( $query )) {
    $stmt -> execute();
    $stmt -> bind_result(
        $id,
        $name,
        $price
    );
}

$result['user'] = 'yes';
while ($stmt -> fetch()) {
    $result['prices'][] = [
        'id' => $id,
        'name' => $name,
        'price' => $price
    ];
}
$stmt -> close();
$mysqli -> close();

echo json_encode($result, JSON_UNESCAPED_UNICODE);
?>