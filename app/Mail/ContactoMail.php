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
        return $this->subject('Nueva Solicitud VTC — Embotelladora Caral')
            ->view('emails.contacto');
    }
}