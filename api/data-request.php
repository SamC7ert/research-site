<?php
/**
 * Replication Package Download Request Handler
 *
 * Receives registration form data, logs it, and sends a download link by email.
 * Place this file at: /api/data-request.php on the live server.
 *
 * To switch to SMTP: install PHPMailer via composer, replace the
 * send_email() function body with PHPMailer SMTP calls.
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// --- Configuration ---
$FROM_EMAIL = 'research@syvertsen.com';
$FROM_NAME  = 'Sam Syvertsen — Research';
$SITE_URL   = 'https://research.syvertsen.com';
$FILE_PATH  = '/files/replication_v1.05.zip';
$LOG_FILE   = __DIR__ . '/download_log.json';
// --- End configuration ---

// Parse input
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

$name         = trim($input['name'] ?? '');
$email        = trim($input['email'] ?? '');
$institution  = trim($input['institution'] ?? '');
$intended_use = trim($input['intended_use'] ?? '');

// Validate required fields
if (empty($name) || empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Name and valid email are required']);
    exit;
}

// Log the request
$log_entry = [
    'timestamp'    => date('c'),
    'name'         => $name,
    'email'        => $email,
    'institution'  => $institution,
    'intended_use' => $intended_use,
    'ip'           => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
    'user_agent'   => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
];

$log = [];
if (file_exists($LOG_FILE)) {
    $log = json_decode(file_get_contents($LOG_FILE), true) ?: [];
}
$log[] = $log_entry;
file_put_contents($LOG_FILE, json_encode($log, JSON_PRETTY_PRINT));

// Build download link
$download_url = $SITE_URL . $FILE_PATH;

// Send email
$subject = 'Your Replication Package Download Link';

$body = "Dear {$name},\n\n"
    . "Thank you for your interest in the replication package for:\n\n"
    . "\"How Income Distribution and Sports Participation Cost Shape Olympic Performance\"\n"
    . "by Sam Carsten Syvertsen\n\n"
    . "Download link:\n"
    . "{$download_url}\n\n"
    . "Citation requirement: By downloading this package you agreed to cite this work\n"
    . "in any publication or analysis using the data.\n\n"
    . "Data: CC-BY 4.0 | Code: MIT License\n\n"
    . "If you have questions about the data or methodology, reply to this email.\n\n"
    . "Best regards,\n"
    . "Sam Syvertsen\n"
    . $SITE_URL . "/projects/sport-cost-gradient/\n";

$headers  = "From: {$FROM_NAME} <{$FROM_EMAIL}>\r\n";
$headers .= "Reply-To: {$FROM_EMAIL}\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

$sent = mail($email, $subject, $body, $headers);

if ($sent) {
    echo json_encode(['success' => true, 'message' => 'Download link sent']);
} else {
    // Log the failure but still respond — the log has the request
    error_log("Failed to send download email to {$email}");
    http_response_code(500);
    echo json_encode(['error' => 'Failed to send email. Please try again or contact research@syvertsen.com']);
}
