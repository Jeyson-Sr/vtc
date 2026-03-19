<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Mail\ContactoMail;
use Illuminate\Support\Facades\Mail;


class ContactoController extends Controller
{


    public function enviarCorreo(Request $request)
{
    $request->validate([
        'productos' => 'required|array',
        'productos.*.codAje' => 'required',
        'productos.*.codEmb' => 'required',
        'productos.*.cantidad' => 'required',
        'productos.*.descripcion' => 'required',
        'productos.*.um' => 'required',
        // ... repite para los otros campos
    ]);

    Mail::to('roberto.canales.pe@ecaral.pe')->send(new ContactoMail($request->productos));

    return response()->json([
        'ok' => true,
        'message' => 'Correo enviado correctamente',
    ]);
}
}
