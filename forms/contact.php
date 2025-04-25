<?php
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
