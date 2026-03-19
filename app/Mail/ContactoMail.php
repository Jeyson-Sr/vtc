<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;

class ContactoMail extends Mailable
{
    public $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function build()
    {
        return $this->subject('Nuevo mensaje de contacto')
            ->view('emails.contacto');
    }
}