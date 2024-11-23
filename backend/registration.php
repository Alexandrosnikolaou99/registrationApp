<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["answer" => "Invalid request method."]);
    exit;
}

$jsonFilePath = 'users.json';
$json = file_get_contents($jsonFilePath);

if ($json) {
    $users = json_decode($json, true);
} 
else {
    $users = [];
}

foreach ($users as $user) {
    if ($user['email'] === trim($data['email']) ) {
        echo json_encode(["answer" => "User already exists with this email ' " . $data['email'] . " '."]);
        exit;
    }
    if ($user['username'] === trim($data['username']) ) {
        echo json_encode(["answer" => "This username ' ". $data['username'] ." ' is already taken."]);
        exit;
    }
    if ($user['phone'] === trim($data['phone']) ) {
        echo json_encode(["answer" => "User already exists with this phone number ' " . $data['phone'] . " '."]);
        exit;
    }
}

$hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);

$newUser = [
    'username' => $data['username'],
    'gender' => $data['gender'],
    'phone' => str_replace(' ', '', $data['phone']),
    'birthdate' => $data['birthdate'],
    'email' => $data['email'],
    'password' => $hashedPassword
];

$users[] = $newUser;

file_put_contents($jsonFilePath, json_encode($users, JSON_PRETTY_PRINT));

echo json_encode([
    "result" => true,
    "answer" =>"Thank you ".$data['username']." for creating an account on our platform. You will receive more details at ".$data['email']."."
]);
?>
