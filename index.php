<php
    // backend.php - Start of PHP script for processing the payment
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $paymentMethod = $_POST['paymentMethod']; // Payment type: 'card', 'paypal', 'googlePay'
        $isValid = true;
    
        // Simulate card validation
        if ($paymentMethod === 'card') {
            $cardNumber = $_POST['cardNumber'];
            $cardName = $_POST['cardName'];
            $cardExpiry = $_POST['cardExpiry'];
            $cardCVC = $_POST['cardCVC'];
    
            // Example validation
            if (strlen($cardNumber) !== 16 || empty($cardName) || empty($cardExpiry) || strlen($cardCVC) !== 3) {
                $isValid = false;
            }
        }
    
        // Simulate PayPal validation
        if ($paymentMethod === 'paypal') {
            $paypalEmail = $_POST['paypalEmail'];
            $paypalPassword = $_POST['paypalPassword'];
    
            // Example validation (you would use PayPal's API for real validation)
            if (!filter_var($paypalEmail, FILTER_VALIDATE_EMAIL) || empty($paypalPassword)) {
                $isValid = false;
            }
        }
    
        // Simulate Google Pay validation
        if ($paymentMethod === 'googlePay') {
            $googlePayEmail = $_POST['googlePayEmail'];
    
            // Example validation
            if (!filter_var($googlePayEmail, FILTER_VALIDATE_EMAIL)) {
                $isValid = false;
            }
        }
    
        // Respond based on validation
        if ($isValid) {
            echo json_encode(["status" => "success", "message" => "Payment processed successfully!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Invalid payment details"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid request method"]);
    }
    exit;
</php>