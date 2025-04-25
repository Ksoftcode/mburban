<?php
/**
 * PHP Email Form library with optional SMTP via PHPMailer
 */

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// require __DIR__ . '/../autoload.php';  // adjust path if needed
// Load Composer autoloader from assets/vendor/autoload.php
$autoload = __DIR__ . '/../autoload.php'; 
if (! file_exists($autoload)) {
  die("Could not find Composer autoloader at: $autoload");
}
require $autoload;

class PHP_Email_Form {
  public $to;
  public $from_name;
  public $from_email;
  public $subject;
  public $messages = [];
  public $ajax = false;
  public $smtp = false;  // set to array to invoke SMTP

  public function add_message($message, $label = '', $maxLength = false) {
    $msg = strip_tags($message);
    if ($maxLength && strlen($msg) > $maxLength) {
      $msg = substr($msg, 0, $maxLength);
    }
    $this->messages[] = $label ? "$label: $msg" : $msg;
  }

  public function send() {
    $body = implode("\n", $this->messages);

    // If SMTP config provided, use PHPMailer
    if ($this->smtp && is_array($this->smtp)) {
      $mail = new PHPMailer(true);
      try {
        // Server settings
        $mail->isSMTP();
        $mail->Host       = $this->smtp['host'];
        $mail->SMTPAuth   = true;
        $mail->Username   = $this->smtp['username'];
        $mail->Password   = $this->smtp['password'];
        // You can switch to 'ssl' and port 465 if your provider requires it
        $mail->SMTPSecure = $this->smtp['secure'] ?? 'tls';
        $mail->Port       = $this->smtp['port'];

        // Recipients
        $mail->setFrom($this->from_email, $this->from_name);
        $mail->addAddress($this->to);

        $mail->isHTML(true);
        // Create Content HTML body
            $html  = '<!DOCTYPE html><html><head><meta charset="utf-8">';
            $html .= '<style>
                        body { font-family: Arial,sans-serif; color: #333; }
                        h2 { background:#0056b3; color:#fff; padding:10px; }
                        .field { margin: 10px 0; }
                        .label { font-weight: bold; width:100px; display:inline-block; }
                    </style>';
            $html .= '<img src="assets/img/logo.webp" alt="MB Urban" style="max-height:50px;margin-bottom:20px;">';
            $html .= '</head><body>';
            $html .= '<h2>New Contact Form Submission</h2>';
            $html .= '<div class="field"><span class="label">Name:</span> '   . htmlentities($this->from_name)  . '</div>';
            $html .= '<div class="field"><span class="label">Email:</span> '  . htmlentities($this->from_email) . '</div>';
if (!empty($this->messages)) {
  // Assuming you stored phone and message via add_message()
  foreach ($this->messages as $msg) {
    // messages are like “Phone: 1234” or “Message: Hello”
    list($label, $value) = explode(': ', $msg, 2);
    $html .= '<div class="field"><span class="label">'. htmlentities($label) .':</span> '. htmlentities($value) .'</div>';
  }
}
$html .= '</body></html>';
       // Assign to PHPMailer
$mail->Subject = $this->subject;
$mail->Body    = $html;
$mail->AltBody = strip_tags($html);
        // $mail->Subject = $this->subject;
        // $mail->Body    = $body;
        // $mail->AltBody = $body;

        $mail->send();
        return 'OK';
      } catch (Exception $e) {
        return "SMTP Error: " . $e->getMessage(); // Explicit error
        // return "Mailer Error: {$mail->ErrorInfo}";
      }
    }

    // Fallback to PHP mail()
    $headers  = "From: {$this->from_name} <{$this->from_email}>\r\n";
    $headers .= "Reply-To: {$this->from_email}\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    if (mail($this->to, $this->subject, $body, $headers)) {
      return 'OK';
    } else {
      return 'Failed to send email. Please try again later.';
    }
  }
}
