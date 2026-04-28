<?php
/**
 * Frame It LA — Quote form handler
 * Drop this file into Hostinger's public_html alongside your built static site.
 * It accepts JSON POSTs from /contact.php, validates them, and emails the lead.
 *
 * Edit TO_EMAIL / FROM_EMAIL below if needed.
 */

declare(strict_types=1);

const TO_EMAIL   = 'info@frameitla.com';
// FROM_EMAIL must be an address on YOUR domain for Hostinger to deliver reliably.
const FROM_EMAIL = 'no-reply@frameitla.com';
const SITE_NAME  = 'Frame It LA';

// --- CORS (allow your own site; adjust if you serve from a different host) ---
header('Vary: Origin');
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '') {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

header('Content-Type: application/json; charset=utf-8');

function respond(int $status, array $payload): void {
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(405, ['ok' => false, 'error' => 'Method not allowed']);
}

// --- Parse JSON or form-encoded body ---
$raw  = file_get_contents('php://input') ?: '';
$data = json_decode($raw, true);
if (!is_array($data)) {
    $data = $_POST;
}

// --- Honeypot (silently accept bots so they don't retry) ---
if (!empty($data['company'])) {
    respond(200, ['ok' => true]);
}

// --- Validate ---
$name      = trim((string)($data['name']      ?? ''));
$phone     = trim((string)($data['phone']     ?? ''));
$email     = trim((string)($data['email']     ?? ''));
$eventType = trim((string)($data['eventType'] ?? ''));
$notes     = trim((string)($data['notes']     ?? ''));

$errors = [];
if ($name === '' || strlen($name) > 100)                          $errors[] = 'Name is required';
if (strlen($phone) < 7 || strlen($phone) > 30)                    $errors[] = 'Valid phone is required';
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 255) $errors[] = 'Valid email is required';
if (strlen($eventType) > 80)                                      $errors[] = 'Event type too long';
if (strlen($notes) > 1000)                                        $errors[] = 'Notes too long';

if ($errors) {
    respond(422, ['ok' => false, 'error' => $errors[0]]);
}

// --- Reject header injection in any field that might end up in headers ---
foreach ([$name, $email, $phone] as $v) {
    if (preg_match('/[\r\n]/', $v)) {
        respond(400, ['ok' => false, 'error' => 'Invalid input']);
    }
}

// --- Build email ---
$subject = '[' . SITE_NAME . '] New quote request from ' . $name;

$bodyLines = [
    'New quote request received:',
    '',
    'Name:       ' . $name,
    'Email:      ' . $email,
    'Phone:      ' . $phone,
    'Event type: ' . ($eventType !== '' ? $eventType : '—'),
    '',
    'Notes:',
    ($notes !== '' ? $notes : '—'),
    '',
    '---',
    'Submitted: ' . date('Y-m-d H:i:s T'),
    'IP:        ' . ($_SERVER['REMOTE_ADDR'] ?? '—'),
    'UA:        ' . ($_SERVER['HTTP_USER_AGENT'] ?? '—'),
];
$body = implode("\n", $bodyLines);

$headers  = 'From: ' . SITE_NAME . ' <' . FROM_EMAIL . ">\r\n";
$headers .= 'Reply-To: ' . $name . ' <' . $email . ">\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

$sent = @mail(TO_EMAIL, $subject, $body, $headers, '-f' . FROM_EMAIL);

if (!$sent) {
    respond(500, ['ok' => false, 'error' => 'Could not send email. Please try again later.']);
}

respond(200, ['ok' => true]);
