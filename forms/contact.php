<?php
// contact.php
session_start();

// 1) Honeypot check – immediate exit on spam
if (!empty($_POST['hp'])) {
  http_response_code(400);
  exit('Spam detected.');
}

// 2) CSRF protection
if (
  empty($_POST['csrf'])
  || !hash_equals($_SESSION['csrf_token'] ?? '', $_POST['csrf'])
) {
  http_response_code(403);
  exit('Invalid CSRF token.');
}

// 3) Simple per-IP rate limiting (5 submissions per 60 seconds)
$ip      = $_SERVER['REMOTE_ADDR'];
$window  = 60;  // seconds
$limit   = 5;   // max submissions in window
$_SESSION['submits'][$ip] = array_filter(
  $_SESSION['submits'][$ip] ?? [],
  fn($t) => $t > time() - $window
);
if (count($_SESSION['submits'][$ip]) >= $limit) {
  http_response_code(429);
  exit('Too many submissions. Please wait a moment and try again.');
}
$_SESSION['submits'][$ip][] = time();

// 4) Validate email syntax
$email = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL);
if (!$email) {
  http_response_code(400);
  exit('Invalid email address.');
}

// 5) Check MX record on domain
$domain = substr(strrchr($email, "@"), 1);
if (!checkdnsrr($domain, 'MX')) {
  http_response_code(400);
  exit('Email domain does not accept mail.');
}

// 6) Block disposable domains (add your own as desired)
$disposables = [
  'mailinator.com',
  '10minutemail.com',
  'tempmail.com',
  // …etc…
];
foreach ($disposables as $badDomain) {
  if (stripos($domain, $badDomain) !== false) {
    http_response_code(403);
    exit('Disposable email addresses are not allowed.');
  }
}

// ——— at this point, we consider the submission “clean” ———


// Load Composer’s autoloader
$autoload = __DIR__ . '/../assets/vendor/autoload.php';
if (!file_exists($autoload)) {
    die("Composer autoloader missing: $autoload");
}
require $autoload;

// Load PHP Email Form library
$lib = __DIR__ . '/../assets/vendor/php-email-form/email-form.php';
if (!file_exists($lib)) {
    die("PHP Email Form library missing: $lib");
}
include $lib;

  // Replace contact@example.com with your real receiving email address
  $receiving_email_address = 'mbarchitects10@gmail.com';

  $contact = new PHP_Email_Form;
  $contact->ajax = true;
  $contact->to = $receiving_email_address;
  $contact->from_name = $_POST['name'];
  $contact->from_email = $_POST['email'];
  $contact->subject = $_POST['subject'];

  // Uncomment below code if you want to use SMTP to send emails. You need to enter your correct SMTP credentials
  
  $contact->smtp = array(
    'host' => 'smtp.gmail.com',
    'username' => $receiving_email_address,
    'password' => 'dqjdlwpvcavqjmls',
    'port' => '587',
    'secure'=> 'tls'
  );
  

  $contact->add_message( $_POST['name'], 'From');
  $contact->add_message( $_POST['email'], 'Email');
  if(isset($_POST['phone'])) {
    $contact->add_message( $_POST['phone'], 'Phone');
  }
  $contact->add_message( $_POST['message'], 'Message', 10);

  echo $contact->send();
?>
