<?php session_start();
header("Content-Type: application/json; charset=UTF-8");

if (($_GET['logout'] ?? FALSE) == TRUE) {
    unset($_SESSION['user']);
    exit(json_encode(['user' => 'no'], JSON_UNESCAPED_UNICODE));
}

if (empty($_SESSION['user'])) {
    $json = file_get_contents('php://input') ?? NULL;
    if ($json == NULL) {
        exit(json_encode(['user' => 'no'], JSON_UNESCAPED_UNICODE));
    }
    $request = json_decode($json, true);
    $_SESSION['user']['login'] = $request['login'];
    $_SESSION['user']['pass'] = $request['pass'];
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

$search = $_GET['s'] ?? NULL;

$query = "  SELECT * FROM requests WHERE
            client_name LIKE '%$search%' OR 
            phone LIKE '%$search%' OR 
            car LIKE '%$search%'
            ORDER BY time DESC
        ";


if ($stmt = $mysqli -> prepare( $query )) {
    $stmt -> execute();
    $stmt -> bind_result(
        $id,
        $timestamp,
        $phone,
        $client,
        $car,
        $mileage,
        $maintenance,
        $status,
        $date,
        $comments
    );
}

$result['user'] = 'yes';
while ($stmt -> fetch()) {
    $result['requests'][] = [
        'id' => $id,
        'timestamp' => $timestamp,
        'phone' => $phone,
        'client' => $client,
        'car' => $car,
        'mileage' => $mileage,
        'maintenance' => $maintenance,
        'status' => $status,
        'date' => $date,
        'comments' => $comments
    ];
}
$stmt -> close();
$mysqli -> close();

echo json_encode($result, JSON_UNESCAPED_UNICODE);
?>