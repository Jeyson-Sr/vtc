<!DOCTYPE html>
<html lang="es" xml:lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'Inter', sans-serif;
            background: #f5f5f5;
            color: #1a1a1a;
            -webkit-font-smoothing: antialiased;
            width: 100%;
        }

        .wrap {
            width: 100%;
            background: #fff;
        }

        /* ── HEADER ── */
        .header {
            background: #1a6b3c;
            padding: 32px 48px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 3px solid #25a85e;
            gap: 12px;
        }

        .header-left h1 {
            font-size: 20px;
            font-weight: 600;
            color: #fff;
            letter-spacing: -0.3px;
        }

        .header-left p {
            font-size: 12px;
            color: rgba(255,255,255,0.55);
            margin-top: 4px;
        }

        .vtc-tag {
            background: rgba(255,255,255,0.12);
            border: 1px solid rgba(255,255,255,0.2);
            color: #fff;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            padding: 8px 16px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            align-self: center;
            white-space: nowrap;
        }

        /* ── BODY ── */
        .body {
            padding: 40px 48px;
        }

        .body p.intro {
            font-size: 13.5px;
            color: #555;
            line-height: 1.7;
            margin-bottom: 28px;
        }

        /* ── TABLE ── */
        table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #e4e4e4;
            border-radius: 6px;
            overflow: hidden;
        }

        thead tr {
            background: #1a6b3c;
        }

        th {
            padding: 12px 16px;
            font-size: 10.5px;
            font-weight: 600;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: rgba(255,255,255,0.85);
            text-align: left;
        }

        th:last-child { text-align: right; }

        tbody tr {
            border-bottom: 1px solid #f0f0f0;
        }

        tbody tr:last-child { border-bottom: none; }

        tbody tr:nth-child(even) { background: #f9fdf9; }

        td {
            padding: 13px 16px;
            font-size: 13px;
            color: #333;
            vertical-align: middle;
        }

        td.code {
            font-family: 'Courier New', monospace;
            font-size: 11.5px;
            color: #888;
        }

        td.desc { font-weight: 500; color: #111; }

        td.um {
            font-size: 11px;
            text-transform: uppercase;
            color: #aaa;
            letter-spacing: 0.06em;
        }

        td.qty {
            text-align: right;
            font-weight: 600;
            font-size: 14px;
            color: #1a6b3c;
        }

        /* ── FOOTER ── */
        .footer {
            background: #f8f8f8;
            border-top: 1px solid #e8e8e8;
            padding: 20px 48px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .footer-brand {
            font-size: 12px;
            font-weight: 600;
            color: #1a6b3c;
            letter-spacing: 0.04em;
        }

        .footer-note {
            font-size: 11px;
            color: #bbb;
        }
        .space {
            width: 12px;
        }
    </style>
</head>
<body>
<div class="wrap">

    <div class="header">
        <div class="header-left">
            <h1>Nueva Solicitud VTC</h1>
            <p>{{ date('d/m/Y — H:i') }} hrs · Sistema de Ventas</p>
        </div>
        <div class="space"></div>
        <span class="vtc-tag">Pendiente</span>
    </div>

    <div class="body">
        <p class="intro">Se ha recibido una nueva solicitud con los siguientes productos. Verifique el detalle antes de procesar.</p>

        <table>
            <thead>
                <tr>
                    <th>Cód. Aje</th>
                    <th>Cód. Emb</th>
                    <th>Descripción</th>
                    <th>U.M.</th>
                    <th>Cantidad</th>
                </tr>
            </thead>
            <tbody>
                @foreach($data as $producto)
                <tr>
                    <td class="code">{{ $producto['codAje'] }}</td>
                    <td class="code">{{ $producto['codEmb'] }}</td>
                    <td class="desc">{{ $producto['descripcion'] }}</td>
                    <td class="um">{{ $producto['um'] }}</td>
                    <td class="qty">{{ number_format($producto['cantidad']) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="footer">
        <span class="footer-brand">Embotelladora Caral</span>
        <span class="footer-note">Correo automático · No responder</span>
    </div>

</div>
</body>
</html>