<?php
header("Content-Type: application/json; charset=UTF-8");

$mysqli = new mysqli("localhost", "root", "", "tls");

if ($mysqli -> connect_error) {
    exit("Не удалось подключиться к базе: " . $mysqli -> connect_error);
}

if (!$mysqli -> set_charset("utf8")) {
    exit();
}

$id = $_GET['id'] ?? NULL;

if ($id === NULL) {
    $query = "SELECT model, gen, gen_id, year, img_small, img_model_small FROM service;";
    
    if ($stmt = $mysqli -> prepare( $query )) {
        $stmt -> execute();
        $stmt -> bind_result(
            $model,
            $gen,
            $gen_id,
            $year,
            $img_small,
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
    echo json_encode($result, JSON_UNESCAPED_UNICODE);
} else {
    $getprice = "SELECT * FROM price";
    $price_list = [];
    
    if ($searchresult = $mysqli->query($getprice)) {
        while ($row = $searchresult->fetch_assoc()) {
            $ids[] = $row["id"];
            $prices[] = $row["price"];
        }
        $searchresult->free();
    }
    
    $query = "SELECT * FROM service WHERE gen_id = '$id'";
    
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
    
    $result = [];
    $opt = [];
    
    while ($stmt -> fetch()) {    
        if (empty($opt[$engine_vol][$transmission][$drive][$service])) { $opt[$engine_vol][$transmission][$drive][$service] = [];}
        $opt[$engine_vol][$transmission][$drive][$service] = [
    
            'Стоимость работ' =>  $prices[0] * str_replace(',', '.', $frs),
            'Моторное масло' =>  $prices[1] * str_replace(',', '.', $oil_qtt),
            'Масляный фильтр' => $prices[array_search($oil_filter, $ids)],
            'Кольцо сливной пробки' => $prices[array_search($oil_ring, $ids)],
            'Фоздушный фильтр' => (array_search($air_filter, $ids) == NULL) ? '' : $prices[array_search($air_filter, $ids)] * str_replace(',', '.', $air_qtt),
            'Топливный фильр' => (array_search($fuel_filter, $ids) == NULL) ? '' : $prices[array_search($fuel_filter, $ids)],
            'Салонный фильтр' => (array_search($cabin_filter, $ids) == NULL) ? '' : $prices[array_search($cabin_filter, $ids)],
            'Тормозная жидкость' => (array_search($brake_fluid, $ids) == NULL) ? '' : $prices[array_search($brake_fluid, $ids)] * str_replace(',', '.', $brake_fluid_qtt),
            'Масло РКПП/МКПП' => (array_search($transmisson_oil, $ids) == NULL) ? '' : $prices[array_search($transmisson_oil, $ids)] * str_replace(',', '.', $transmisson_oil_qtt),
            'Масло дифференциала' => (array_search($diff_fluid, $ids) == NULL) ? '' : $prices[array_search($diff_fluid, $ids)] * str_replace(',', '.', $diff_fluid_qtt),
            'Свечи зажигания' => (array_search($spark_plug, $ids) == NULL) ? '' : $prices[array_search($spark_plug, $ids)] * str_replace(',', '.', $spark_plug_qtt),
            'Кольцо РКПП' => (array_search($transfer_case_ring, $ids) == NULL) ? '' : $prices[array_search($transfer_case_ring, $ids)] * str_replace(',', '.', $transfer_case_ring_qtt),
            'Кольцо дифференциала 1 тип' => (array_search($diff_ring_1, $ids) == NULL) ? '' : $prices[array_search($diff_ring_1, $ids)] * str_replace(',', '.', $diff_ring_1_qtt),
            'Кольцо дифференциала 2 тип' => (array_search($diff_ring_2, $ids) == NULL) ? '' : $prices[array_search($diff_ring_2, $ids)] * str_replace(',', '.', $diff_ring_2_qtt),
            'Охлаждающая жидкость' => (array_search($coolant, $ids) == NULL) ? '' : $prices[array_search($coolant, $ids)] * str_replace(',', '.', $coolant_qtt)
        ];
        $result = [
            'brand' => $brand,
            'model' => $model,
            'gen' => $gen,
            'year' => $year,
            'img' => $img,
            'options' => $opt
        ];
    }    
    echo json_encode($result, JSON_UNESCAPED_UNICODE);
}

$stmt -> close();
$mysqli -> close();
?>