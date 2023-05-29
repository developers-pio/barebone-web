<?php

// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Check if it's a preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Get the JSON data from the request body
$requestBody = file_get_contents('php://input');

// Decode the JSON data into an associative array
$data = json_decode($requestBody, true);

// Check if the JSON data is valid
if ($data === null) {
    // Invalid JSON data
    http_response_code(400);
    echo "Invalid JSON data";
    exit;
}

$url = 'https://api.yelp.com/v3/events';

if(isset($data['id'])){
    $url = $url . '/' . $data['id'];
    unset($a->id);
}else{
    $url = $url . '?' . http_build_query($data);
}

// Set up the cURL options
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json','Authorization: Bearer z2gz7rev9-qghQnk-omGiIlWKk3X0ytaHjYN6U1ASxbIJxRDrHsMJtFZkHUobw44N0hgc2K7LxVNglvpiRIVcK3HRyB1gzs8o5w7SBQ8q5TUa8KlImW9dd2wT_JkZHYx'
));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Execute the cURL request
$response = curl_exec($ch);

// Check for cURL errors
if ($response === false) {
    $error = curl_error($ch);
    // Handle the cURL error
    http_response_code(500);
    echo "cURL Error: " . $error;
    exit;
}

// Close the cURL session
curl_close($ch);

// Output the API response
http_response_code(200);
header('Content-Type: application/json');
echo $response;
