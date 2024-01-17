<?php
$servername = "your_database_server";
$username = "your_database_username";
$password = "your_database_password";
$dbname = "admission_portal";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$name = $_POST['name'];
$photoPath = 'uploads/' . basename($_FILES['photo']['name']);
$signaturePath = 'uploads/' . basename($_FILES['signature']['name']);

move_uploaded_file($_FILES['photo']['tmp_name'], $photoPath);
move_uploaded_file($_FILES['signature']['tmp_name'], $signaturePath);

$sql = "INSERT INTO admission_data (name, photo_path, signature_path) VALUES ('$name', '$photoPath', '$signaturePath')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(['message' => 'Data submitted successfully']);
} else {
    echo json_encode(['message' => 'Error: ' . $sql . '<br>' . $conn->error]);
}

$conn->close();
?>
