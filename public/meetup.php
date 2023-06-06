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

// Set up the cURL options
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://api.meetup.com/gql');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $requestBody);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
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
