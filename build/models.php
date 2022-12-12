<?php
header("Content-Type: application/json; charset=UTF-8");

include 'login.php';

$query = "SELECT * FROM service;";

if ($stmt = $mysqli -> prepare( $query )) {
    $stmt -> execute();
    $stmt -> bind_result(
        $brand,
        $model,
        $gen,
        $gen_id,
        $year,
        $engine_vol,
        $transmission,
        $drive,
        $service,
        $frs,
        $oil_qtt,
        $oil_filter,
        $oil_ring,
        $air_filter,
        $air_qtt,
        $fuel_filter,
        $cabin_filter,
        $brake_fluid,
        $brake_fluid_qtt,
        $coolant,
        $coolant_qtt,
        $transmisson_oil,
        $transmisson_oil_qtt,
        $diff_fluid,
        $diff_fluid_qtt,
        $spark_plug,
        $spark_plug_qtt,
        $transfer_case_ring,
        $transfer_case_ring_qtt,
        $diff_ring_1,
        $diff_ring_1_qtt,
        $diff_ring_2,
        $diff_ring_2_qtt,
        $img,
        $img_small,
        $img_model,
        $img_model_small      
    );
}

$models = [];
$gens = [];
$result = [];

while ($stmt -> fetch()) {
    if (!in_array(['model' => $model, 'img' => $img_model_small], $models)) {
        $models[] = [
            'model' => $model,
            'img' => $img_model_small
        ];
    }
    if (empty($gens[$model])) { $gens[$model] = [];}
    if (!in_array([ 'id' => $gen_id, 'number' => $gen, 'img' => $img_small, 'year' => $year ], $gens[$model])) {
        $gens[$model][] = [
            'id' => $gen_id,
            'number' => $gen,
            'img' => $img_small,
            'year' => $year
        ];
    }
}
foreach ($models as $car) {
    foreach ($gens as $key => $value) {
        if ($car['model'] == $key) {
            $result[] = [
                'model' => $car['model'],
                'img' => $car['img'],
                'gen' => $value
            ];
        }
    }
}

$stmt -> close();
$mysqli -> close();


// print_r($result);
echo json_encode($result, JSON_UNESCAPED_UNICODE);
?>