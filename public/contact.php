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
const CAPTCHA_SECRET     = 'CHANGE_ME_TO_A_LONG_RANDOM_STRING_abc123xyz789';
const HONEYPOT_THRESHOLD = 2;     // honeypot hits before requiring CAPTCHA
const CAPTCHA_TTL        = 600;   // CAPTCHA token valid for 10 minutes
const FLAG_TTL           = 86400; // remember a flagged IP for 24h

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

function client_ip(): string { return $_SERVER['REMOTE_ADDR'] ?? 'unknown'; }

function storage_dir(): string {
    $dir = sys_get_temp_dir() . '/frameitla_rl';
    if (!is_dir($dir)) { @mkdir($dir, 0700, true); }
    return $dir;
}

function ip_flagged(string $ip): bool {
    $f = storage_dir() . '/flag_' . hash('sha256', $ip) . '.txt';
    if (!is_file($f)) { return false; }
    $ts = (int) @file_get_contents($f);
    if ($ts && (time() - $ts) < FLAG_TTL) { return true; }
    @unlink($f);
    return false;
}

function flag_ip(string $ip): void {
    $f = storage_dir() . '/flag_' . hash('sha256', $ip) . '.txt';
    @file_put_contents($f, (string) time());
}

function bump_honeypot(string $ip): int {
    $f = storage_dir() . '/hp_' . hash('sha256', $ip) . '.txt';
    $count = 0;
    $fp = @fopen($f, 'c+');
    if (!$fp) { return 0; }
    try {
        flock($fp, LOCK_EX);
        $count = (int) (stream_get_contents($fp) ?: '0');
        $count++;
        ftruncate($fp, 0); rewind($fp);
        fwrite($fp, (string) $count);
        fflush($fp);
        flock($fp, LOCK_UN);
    } finally {
        fclose($fp);
    }
    return $count;
}

/** Sign "a|b|expiry" with HMAC so the answer can't be forged. */
function captcha_issue(): array {
    $a = random_int(2, 9);
    $b = random_int(2, 9);
    $exp = time() + CAPTCHA_TTL;
    $payload = "$a|$b|$exp";
    $sig = hash_hmac('sha256', $payload, CAPTCHA_SECRET);
    return [
        'question' => "What is $a + $b?",
        'token'    => base64_encode($payload) . '.' . $sig,
    ];
}

function captcha_verify(string $token, string $answer): bool {
    $parts = explode('.', $token, 2);
    if (count($parts) !== 2) { return false; }
    $payload = base64_decode($parts[0], true);
    if ($payload === false) { return false; }
    $expected = hash_hmac('sha256', $payload, CAPTCHA_SECRET);
    if (!hash_equals($expected, $parts[1])) { return false; }
    [$a, $b, $exp] = array_pad(explode('|', $payload, 3), 3, '0');
    if ((int) $exp < time()) { return false; }
    return (int) $answer === ((int) $a + (int) $b);
}

// --- GET: issue a CAPTCHA challenge (only if this IP is flagged) ---
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'GET') {
    $action = $_GET['action'] ?? '';
    if ($action === 'captcha') {
        if (!ip_flagged(client_ip())) {
            respond(200, ['required' => false]);
        }
        respond(200, ['required' => true] + captcha_issue());
    }
    respond(405, ['ok' => false, 'error' => 'Method not allowed']);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(405, ['ok' => false, 'error' => 'Method not allowed']);
}

// --- Basic per-IP rate limiting (file-based, suitable for shared hosting) ---
// Limits: 5 submissions per IP per hour, 20 per IP per day.
(function (): void {
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    // Bucket dir outside web root if possible; fall back to system temp.
    $dir = sys_get_temp_dir() . '/frameitla_rl';
    if (!is_dir($dir)) { @mkdir($dir, 0700, true); }
    $file = $dir . '/' . hash('sha256', $ip) . '.json';

    $now    = time();
    $hour   = 3600;
    $day    = 86400;
    $maxHr  = 5;
    $maxDay = 20;

    $fp = @fopen($file, 'c+');
    if (!$fp) { return; } // fail-open if filesystem unavailable

    try {
        flock($fp, LOCK_EX);
        $raw = stream_get_contents($fp) ?: '';
        $log = json_decode($raw, true);
        if (!is_array($log)) { $log = []; }

        // Drop entries older than a day
        $log = array_values(array_filter($log, fn($t) => is_int($t) && ($now - $t) < $day));

        $inHour = count(array_filter($log, fn($t) => ($now - $t) < $hour));
        $inDay  = count($log);

        if ($inHour >= $maxHr || $inDay >= $maxDay) {
            flock($fp, LOCK_UN);
            fclose($fp);
            header('Retry-After: 3600');
            respond(429, ['ok' => false, 'error' => 'Too many requests. Please try again later.']);
        }

        $log[] = $now;
        ftruncate($fp, 0);
        rewind($fp);
        fwrite($fp, json_encode($log));
        fflush($fp);
        flock($fp, LOCK_UN);
    } finally {
        if (is_resource($fp)) { fclose($fp); }
    }
})();


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
