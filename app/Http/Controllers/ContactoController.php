<?php

namespace App\Http\Controllers;

use App\Mail\ContactoMail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactoController extends Controller
{
    public function enviarCorreo(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'productos' => 'required|array|min:1',
            'productos.*.codAje' => 'required|string',
            'productos.*.codEmb' => 'required|string',
            'productos.*.cantidad' => 'required|numeric',
            'productos.*.descripcion' => 'required|string',
            'productos.*.um' => 'required|string',
        ]);

        Mail::to('roberto.canales.pe@ecaral.pe')->send(new ContactoMail($validated['productos']));

        return response()->json([
            'ok' => true,
            'message' => 'Correo enviado correctamente',
        ]);
    }
}
