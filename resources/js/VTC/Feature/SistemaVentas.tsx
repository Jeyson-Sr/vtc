import React, { useState } from 'react';

// --- TIPOS ---
interface Insumo {
  codAje: string;
  codEmb: string;
  descripcion: string;
  um: string;
  cantidad: number;
}

interface Producto {
  sku: string;
  nombre: string;
  insumos: Insumo[];
  tipo: string;
}

// --- MOCK DATA ---
const DB_JARABES: Producto[] = [
  {
    sku: '3000082',
    nombre: 'Jarabe Sporade ',
    insumos: [
      { codAje: '50890', codEmb: 'E-01', descripcion: 'KIT CONCENTRADO PARA BEBIDA CON ADICIÓN DE ELECTROLITOS TROPICA', um: 'UN', cantidad: 1 },
      { codAje: '122',   codEmb: 'E-01', descripcion: 'CITRATO DE SODIO',  um: 'KG', cantidad: 12.5 },
      { codAje: '5299',  codEmb: 'E-01', descripcion: 'CLORURO DE SODIO QP', um: 'KG', cantidad: 12.5 },
      { codAje: '118',   codEmb: 'E-01', descripcion: 'ACIDO CITRICO',     um: 'KG', cantidad: 66.5 },
      { codAje: '5206',  codEmb: 'E-01', descripcion: 'DEXTROSA',          um: 'KG', cantidad: 212.5 },
    ],
    tipo: 'Jarabe',
  },
  {
  sku: '3000084',
  nombre: 'Jarabe Mandarina',
  insumos: [
    { codAje: '50891', codEmb: 'E-01', descripcion: 'BASE PARA BEBIDA CON ADICIÓN DE ELECTROLITOS S 49599', um: 'UN', cantidad: 1 },
    { codAje: '20446', codEmb: 'E-01', descripcion: 'EMULSION MANDARINA SC242290', um: 'KG', cantidad: 23.1 },
    { codAje: '122',   codEmb: 'E-01', descripcion: 'CITRATO DE SODIO', um: 'KG', cantidad: 18.75 },
    { codAje: '5299',  codEmb: 'E-01', descripcion: 'CLORURO DE SODIO QP', um: 'KG', cantidad: 12.5 },
    { codAje: '118',   codEmb: 'E-01', descripcion: 'ACIDO CITRICO', um: 'KG', cantidad: 52 },
    { codAje: '5206',  codEmb: 'E-01', descripcion: 'DEXTROSA', um: 'KG', cantidad: 212.5 }
  ],
  tipo: 'Jarabe',
},
{
  sku: '3000374',
  nombre: 'Jarabe Sporade Apple Ice Sin Azúcar',
  insumos: [
    { codAje: '54469', codEmb: 'E-01', descripcion: 'BASE PARA BEBIDA CON ADICIÓN DE ELECTROLITOS APPLE ICE SIN AZÚC', um: 'UN', cantidad: 2 },
    { codAje: '54468', codEmb: 'E-01', descripcion: 'SABOR APPLE ICE 28284', um: 'KG', cantidad: 10 },
    { codAje: '122',   codEmb: 'E-01', descripcion: 'CITRATO DE SODIO', um: 'KG', cantidad: 12.5 },
    { codAje: '118',   codEmb: 'E-01', descripcion: 'ACIDO CITRICO', um: 'KG', cantidad: 37.5 }
  ],
  tipo: 'Jarabe',
},
{
  sku: '3000266',
  nombre: 'Jarabe Sporade Uva',
  insumos: [
    { codAje: '53332', codEmb: 'E-01', descripcion: 'BASE PARA BEBIDA CON ADICIÓN DE ELECTROLITOS UVA S 49815', um: 'UN', cantidad: 1 },
    { codAje: '53331', codEmb: 'E-01', descripcion: 'SABOR UVA SN 469142', um: 'KG', cantidad: 9.5 },
    { codAje: '122',   codEmb: 'E-01', descripcion: 'CITRATO DE SODIO', um: 'KG', cantidad: 18.75 },
    { codAje: '5299',  codEmb: 'E-01', descripcion: 'CLORURO DE SODIO QP', um: 'KG', cantidad: 12.5 },
    { codAje: '118',   codEmb: 'E-01', descripcion: 'ACIDO CITRICO', um: 'KG', cantidad: 55 },
    { codAje: '5206',  codEmb: 'E-01', descripcion: 'DEXTROSA', um: 'KG', cantidad: 212.5 }
  ],
  tipo: 'Jarabe',
},
{
  sku: '3000086',
  nombre: 'Jarabe Sporade Blueberry',
  insumos: [
    { codAje: '50891', codEmb: 'E-01', descripcion: 'BASE PARA BEBIDA CON ADICIÓN DE ELECTROLITOS S 49599', um: 'UN', cantidad: 1 },
    { codAje: '48035', codEmb: 'E-01', descripcion: 'EMULSION BLUEBERRY EM 73174', um: 'KG', cantidad: 10.26 },
    { codAje: '122',   codEmb: 'E-01', descripcion: 'CITRATO DE SODIO', um: 'KG', cantidad: 18.75 },
    { codAje: '118',   codEmb: 'E-01', descripcion: 'ACIDO CITRICO', um: 'KG', cantidad: 50 },
    { codAje: '5206',  codEmb: 'E-01', descripcion: 'DEXTROSA', um: 'KG', cantidad: 212.5 },
    { codAje: '5299',  codEmb: 'E-01', descripcion: 'CLORURO DE SODIO QP', um: 'KG', cantidad: 12.5 }
  ],
  tipo: 'Jarabe',
},
];

const DB_ENVASADO: Producto[] = [
  {
    sku: '599371',
    nombre: 'Sporade Tropical 500ml L7',
    insumos: [
      { codAje: '55630', codEmb: 'EMB-01', descripcion: 'PREFORMA ASEPTICA 17 GRS CRISTAL (1881) SAN MIGUEL', um: 'UND', cantidad: 12 },
      { codAje: '55860', codEmb: 'EMB-02', descripcion: 'TAPA PLANA 32 MM VERDE ASEPTICA (SAN MIGUEL)',       um: 'UND', cantidad: 12 },
      { codAje: '57166', codEmb: 'EMB-03', descripcion: 'ETIQUETA SPORADE TROPICAL PET 500 ML UNIF - EMB. CARAL', um: 'UND', cantidad: 12 },
      { codAje: '56124', codEmb: 'EMB-03', descripcion: 'LAMINA TERMOCONTRAIBLE 780 MM X 50µm',              um: 'UND', cantidad: 0.012128 },
      { codAje: '57347', codEmb: 'EMB-03', descripcion: 'STRETCH DE ALTO RENDIMIENTO 20',              um: 'UND', cantidad: 0.0012 },
      { codAje: '56123', codEmb: 'EMB-03', descripcion: 'SEPARADOR ONE WAY ONDA 111E - DIMENSION DE 0.98 X 1.18 MTS', um: 'UND', cantidad: 0.041667 },
    ],
    tipo: 'Envasado',
  },
  {
    sku: '499371',
    nombre: 'Sporade Tropical 500ml L4',
    insumos: [
      { codAje: '54083', codEmb: 'EMB-01', descripcion: 'PREFORMA PET 24 GRS CRISTAL HF (SAN MIGUEL) - UNIVERSAL', um: 'UND', cantidad: 12 },
      { codAje: '37582', codEmb: 'EMB-02', descripcion: 'TAPA PLANA 33 MM VERDE ASEPTICA (SAN MIGUEL)',       um: 'UND', cantidad: 12 },
      { codAje: '57166', codEmb: 'EMB-03', descripcion: 'ETIQUETA SPORADE TROPICAL PET 500 ML UNIF - EMB. CARAL', um: 'UND', cantidad: 12 },
      { codAje: '51890', codEmb: 'EMB-03', descripcion: 'LAMINA TERMOCONTRAIBLE 410 MM X 40µm',              um: 'UND', cantidad: 0.012127 },
      { codAje: '57347', codEmb: 'EMB-03', descripcion: 'STRETCH DE ALTO RENDIMIENTO 20',              um: 'UND', cantidad: 0.0012 },
      { codAje: '23961', codEmb: 'EMB-03', descripcion: 'CARTON SEPARADOR PARA ESTIBA',                      um:'UND', cantidad: 0.0417 },
    ],
    tipo: 'Envasado',
  },
  {
  sku: '499370',
  nombre: 'Sporade Mandarina 500ml L4',
    insumos: [
      { codAje: '54083', codEmb: 'EMB-01', descripcion: 'PREFORMA PET 24 GRS CRISTAL HF (SAN MIGUEL) - UNIVERSAL', um: 'UND', cantidad: 12 },
      { codAje: '37582', codEmb: 'EMB-02', descripcion: 'TAPA PLANA 33 MM VERDE ASEPTICA (SAN MIGUEL)',       um: 'UND', cantidad: 12 },
      { codAje: '57168', codEmb: 'EMB-03', descripcion: 'ETIQUETA SPORADE MANDARINA PET 500 ML UNIF - EMB.CARAL', um: 'UND', cantidad: 12 },
      { codAje: '51890', codEmb: 'EMB-03', descripcion: 'LAMINA TERMOCONTRAIBLE 410 MM X 40µm',              um: 'UND', cantidad: 0.012127 },
      { codAje: '57347', codEmb: 'EMB-03', descripcion: 'STRETCH DE ALTO RENDIMIENTO 20',              um: 'UND', cantidad: 0.001562 },
      { codAje: '23961', codEmb: 'EMB-03', descripcion: 'CARTON SEPARADOR PARA ESTIBA',                      um:'UND', cantidad: 0.046875 },
    ],
    tipo: 'Envasado',
  },
  {
  sku: '599370',
  nombre: 'Sporade Mandarina 500ml L7',
  insumos: [
    { codAje: '55630', codEmb: 'EMB-01', descripcion: 'PREFORMA ASEPTICA 17 GRS CRISTAL (1881) SAN MIGUEL', um: 'UND', cantidad: 12 },
    { codAje: '55860', codEmb: 'EMB-02', descripcion: 'TAPA PLANA 32 MM VERDE ASEPTICA (SAN MIGUEL)', um: 'UND', cantidad: 12 },
    { codAje: '57168', codEmb: 'EMB-03', descripcion: 'ETIQUETA SPORADE MANDARINA PET 500 ML UNIF - EMB.CARAL', um: 'UND', cantidad: 12 },
    { codAje: '56124', codEmb: 'EMB-03', descripcion: 'LAMINA TERMOCONTRAIBLE 780 MM X 50µm', um: 'UND', cantidad: 0.016128 },
    { codAje: '57347', codEmb: 'EMB-03', descripcion: 'STRETCH DE ALTO RENDIMIENTO 20', um: 'UND', cantidad: 0.00336 },
    { codAje: '56123', codEmb: 'EMB-03', descripcion: 'SEPARADOR ONE WAY ONDA 111E - DIMENSION DE 0.98 X 1.18 MTS', um: 'UND', cantidad: 0.041667 }
  ],
  tipo: 'Envasado',
},
{
  sku: '522439',
  nombre: 'Sporade Apple Light 500ml ',
  insumos: [
    { codAje: '54083', codEmb: 'EMB-01', descripcion: 'PREFORMA PET 24 GRS CRISTAL HF (SAN MIGUEL) - UNIVERSAL', um: 'UND', cantidad: 12 },
    { codAje: '54684', codEmb: 'EMB-02', descripcion: 'TAPA PLANA 33 MM NEGRO HF (SAN MIGUEL)', um: 'UND', cantidad: 12 },
    { codAje: '57170', codEmb: 'EMB-03', descripcion: 'ETIQUETA SPORADE APPLE LIGHT PET 500 ML UNIF - EMB. CARAL', um: 'UND', cantidad: 12 },
    { codAje: '51890', codEmb: 'EMB-03', descripcion: 'LAMINA TERMOCONTRAIBLE 410 MM X 40µm', um: 'UND', cantidad: 0.015151 },
    { codAje: '57347', codEmb: 'EMB-03', descripcion: 'STRETCH DE ALTO RENDIMIENTO 20', um: 'UND', cantidad: 0.001563},
    { codAje: '23961', codEmb: 'EMB-03', descripcion: 'CARTON SEPARADOR PARA ESTIBA', um: 'UND', cantidad: 0.046875 }
  ],
  tipo: 'Envasado'
},
{
  sku: '523493',
  nombre: 'Sporade Tropical 625ml  (Sport Cap)',
  insumos: [
    { codAje: '54083', codEmb: 'EMB-01', descripcion: 'PREFORMA PET 24 GRS CRISTAL HF (SAN MIGUEL) - UNIVERSAL', um: 'UND', cantidad: 12 },
    { codAje: '55975', codEmb: 'EMB-02', descripcion: 'TAPA SPORT CAP 33 MM VERDE (ZELLER MEX)', um: 'UND', cantidad: 12 },
    { codAje: '57410', codEmb: 'EMB-03', descripcion: 'ETIQUETA SPORADE TROPICAL 625 ML SPORTCAP - EMB CARAL - MOD', um: 'UND', cantidad: 12 },
    { codAje: '51890', codEmb: 'EMB-03', descripcion: 'LAMINA TERMOCONTRAIBLE 410 MM X 40 µ', um: 'UND', cantidad: 0.016128 },
    { codAje: '57347', codEmb: 'EMB-03', descripcion: 'STRETCH DE ALTO RENDIMIENTO 20', um: 'UND', cantidad: 0.00336 },
    { codAje: '23961', codEmb: 'EMB-03', descripcion: 'CARTON SEPARADOR PARA ESTIBA', um: 'UND', cantidad: 0.035714 }
  ],
  tipo: 'Envasado',
},
{
  sku: '421942',
  nombre: 'Sporade Uva 500ml',
  insumos: [
    { codAje: '55630', codEmb: 'EMB-01', descripcion: 'PREFORMA ASEPTICA 17 GRS CRISTAL (1881) SAN MIGUEL', um: 'UND', cantidad: 12 },
    { codAje: '37582', codEmb: 'EMB-02', descripcion: 'TAPA PLANA 32 MM VERDE ASEPTICA (SAN MIGUEL)', um: 'UND', cantidad: 12 },
    { codAje: '57169', codEmb: 'EMB-03', descripcion: 'ETIQUETA SPORADE UVA PET 500 ML UNIF - EMB. CARAL', um: 'UND', cantidad: 12 },
    { codAje: '56124', codEmb: 'EMB-03', descripcion: 'LAMINA TERMOCONTRAIBLE 780 MM X 50µm', um: 'UND', cantidad: 0.016128 },
    { codAje: '57347', codEmb: 'EMB-03', descripcion: 'STRETCH DE ALTO RENDIMIENTO 20', um: 'UND', cantidad: 0.00336 },
    { codAje: '23961', codEmb: 'EMB-03', descripcion: 'CARTON SEPARADOR PARA ESTIBA', um: 'UND', cantidad: 0.041667 }
  ],
  tipo: 'Envasado',
},
{
  sku: '499378',
  nombre: 'Sporade Blueberry 500ml L4',
    insumos: [
      { codAje: '54083', codEmb: 'EMB-01', descripcion: 'PREFORMA PET 24 GRS CRISTAL HF (SAN MIGUEL) - UNIVERSAL', um: 'UND', cantidad: 12 },
      { codAje: '37582', codEmb: 'EMB-02', descripcion: 'TAPA PLANA 33 MM VERDE ASEPTICA (SAN MIGUEL)',       um: 'UND', cantidad: 12 },
      { codAje: '57167', codEmb: 'EMB-03', descripcion: 'ETIQUETA SPORADE BLUEBERRY PET 500 ML UNIF - EMB. CARAL', um: 'UND', cantidad: 12 },
      { codAje: '51890', codEmb: 'EMB-03', descripcion: 'LAMINA TERMOCONTRAIBLE 410 MM X 40µm',              um: 'UND', cantidad: 0.012127 },
      { codAje: '57347', codEmb: 'EMB-03', descripcion: 'STRETCH DE ALTO RENDIMIENTO 20',              um: 'UND', cantidad: 0.0012 },
      { codAje: '23961', codEmb: 'EMB-03', descripcion: 'CARTON SEPARADOR PARA ESTIBA',                      um:'UND', cantidad: 0.041667 },
    ], 
  tipo: 'Envasado',
},
{
  sku: '599378',
  nombre: 'Sporade Blueberry 500ml L7',
  insumos: [
    { codAje: '55630', codEmb: 'EMB-01', descripcion: 'PREFORMA ASEPTICA 17 GRS CRISTAL (1881) SAN MIGUEL', um: 'UND', cantidad: 12 },
    { codAje: '55860', codEmb: 'EMB-02', descripcion: 'TAPA PLANA 32 MM VERDE ASEPTICA (SAN MIGUEL)', um: 'UND', cantidad: 12 },
    { codAje: '57167', codEmb: 'EMB-03', descripcion: 'ETIQUETA SPORADE BLUEBERRY PET 500 ML UNIF - EMB. CARAL', um: 'UND', cantidad: 12 },
    { codAje: '56124', codEmb: 'EMB-03', descripcion: 'LAMINA TERMOCONTRAIBLE 780 MM X 50µm', um: 'UND', cantidad: 0.016128 },
    { codAje: '57347', codEmb: 'EMB-03', descripcion: 'STRETCH DE ALTO RENDIMIENTO 20', um: 'UND', cantidad: 0.00336 },
    { codAje: '56123', codEmb: 'EMB-03', descripcion: 'SEPARADOR ONE WAY ONDA 111E - DIMENSION DE 0.98 X 1.18 MTS', um: 'UND', cantidad: 0.041667 }
  ],
  tipo: 'Envasado',
},
{
  sku: '499376',
  nombre: 'Sporade Tropical 1000ml',
  insumos: [
    { codAje: '50111', codEmb: 'EMB-01', descripcion: 'PREFORMA PET 38.1 GRS CRISTAL HF (SAN MIGUEL)', um: 'UND', cantidad: 6 },
    { codAje: '37582', codEmb: 'EMB-02', descripcion: 'TAPA PLANA 33 MM VERDE HF (SAN MIGUEL)', um: 'UND', cantidad: 6 },
    { codAje: '57178', codEmb: 'EMB-03', descripcion: 'ETIQUETA SPORADE TROPICAL 1000 ML - EMB. CARAL', um: 'UND', cantidad: 6 },
    { codAje: '51890', codEmb: 'EMB-03', descripcion: 'LAMINA TERMOCONTRAIBLE 410 MM X 40 µ', um: 'UND', cantidad: 0.013699 },
    { codAje: '57347', codEmb: 'EMB-03', descripcion: 'STRETCH DE ALTO RENDIMIENTO 20', um: 'UND', cantidad: 0.001329 },
    { codAje: '23961', codEmb: 'EMB-03', descripcion: 'CARTON SEPARADOR PARA ESTIBA', um: 'UND', cantidad: 0.041659 }
  ],
  tipo: 'Envasado',
},
{
  sku: '421790',
  nombre: 'Sporade Tropical 1500ml',
  insumos: [
    { codAje: '38151', codEmb: 'EMB-01', descripcion: 'PREFORMA PET 58 GRS CRISTAL HF', um: 'UND', cantidad: 6 },
    { codAje: '37582', codEmb: 'EMB-02', descripcion: 'TAPA PLANA 33 MM VERDE HF (SAN MIGUEL)', um: 'UND', cantidad: 6 },
    { codAje: '57179', codEmb: 'EMB-03', descripcion: 'ETIQUETA SPORADE TROPICAL 1500 ML - EMB. CARAL', um: 'UND', cantidad: 6 },
    { codAje: '49312', codEmb: 'EMB-03', descripcion: 'LAMINA TERMOCONTRAIBLE 410 MM X 50 µ (BOBINA 30 KG.)', um: 'UND', cantidad: 0.022509 },
    { codAje: '57347', codEmb: 'EMB-03', descripcion: 'STRETCH DE ALTO RENDIMIENTO 20', um: 'UND', cantidad: 0.001817 },
    { codAje: '23961', codEmb: 'EMB-03', descripcion: 'CARTON SEPARADOR PARA ESTIBA', um: 'UND', cantidad: 0.045455 }
  ],
  tipo: 'Envasado',
},
{
  sku: '422908',
  nombre: 'Sporade Blueberry 1500ml',
  insumos: [
    { codAje: '38151', codEmb: 'EMB-01', descripcion: 'PREFORMA PET 58 GRS CRISTAL HF', um: 'UND', cantidad: 6 },
    { codAje: '37582', codEmb: 'EMB-02', descripcion: 'TAPA PLANA 33 MM VERDE HF (SAN MIGUEL)', um: 'UND', cantidad: 6 },
    { codAje: '55762', codEmb: 'EMB-03', descripcion: 'ETIQUETA SPORADE BLUEBERRY PET NO RETORNABLE 1500 ML UNIF', um: 'UND', cantidad: 6 },
    { codAje: '49312', codEmb: 'EMB-03', descripcion: 'LAMINA TERMOCONTRAIBLE 410 MM X 50 µ (BOBINA 30 KG.)', um: 'UND', cantidad: 0.022509 },
    { codAje: '57347', codEmb: 'EMB-03', descripcion: 'STRETCH DE ALTO RENDIMIENTO 20', um: 'UND', cantidad: 0.001817 },
    { codAje: '23961', codEmb: 'EMB-03', descripcion: 'CARTON SEPARADOR PARA ESTIBA', um: 'UND', cantidad: 0.045455 }
  ],
  tipo: 'Envasado',
},
];

const DB_AUXILIARES: Producto[] = [
  {
    sku: '53721',
    nombre: 'AZUCAR BIG BAG',
    insumos: [
      { codAje: '53721', codEmb: 'AX-01', descripcion: 'AZUCAR REFINADA NACIONAL BIG BAG', um: 'kg', cantidad: 1 },
    ],
    tipo: 'Auxiliar',
  },
  {
    sku: '16543',
    nombre: 'AZUCAR SACOS',
    insumos: [
      { codAje: '16543', codEmb: 'AX-01', descripcion: 'AZUCAR REFINADA ESPECIAL IMPORTADA', um: 'kg', cantidad: 1 },
    ],
    tipo: 'Auxiliar',
  },
  {
    sku: '54234',
    nombre: 'AGUA CRUDA',
    insumos: [
      { codAje: '54234', codEmb: 'AX-01', descripcion: 'AGUA CRUDA', um: 'LT', cantidad: 1 },
    ],
    tipo: 'Auxiliar',
  },
];

type Vista = 'INICIO' | 'GENERAR_VTC' | 'RESUMEN_VTC' | 'INGRESO_ATENCION';

// --- COMPONENTE PRINCIPAL ---
export const SistemaVentas: React.FC = () => {
  const [vista, setVista] = useState<Vista>('INICIO');
  const [listaJarabes,    setListaJarabes]    = useState<Insumo[][]>([]);
  const [listaEnvasado,   setListaEnvasado]   = useState<Insumo[][]>([]);
  const [listaAuxiliares, setListaAuxiliares] = useState<Insumo[][]>([]);

  // Explosión de insumos multiplicada por cantidad
  const agregarALista = (
    sku: string,
    cantidad: number,
    db: Producto[],
    setLista: React.Dispatch<React.SetStateAction<Insumo[][]>>,
  ) => {
    if (!sku || isNaN(cantidad) || cantidad <= 0) return;
    const producto = db.find(p => p.sku === sku);
    if (!producto) return;
    const insumosCalculados = producto.insumos.map(ins => ({
      ...ins,
      cantidad: parseFloat((ins.cantidad * cantidad).toFixed(6)),
    }));
    setLista(prev => [...prev, insumosCalculados]);
  };

  const resumenData: Insumo[] = [
    ...listaEnvasado.flat(),
    ...listaJarabes.flat(),
    ...listaAuxiliares.flat(),
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      {vista === 'INICIO' && (
        <div className="flex flex-col items-center justify-center h-[80vh] gap-6">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Sistema de Ventas</h1>
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => setVista('INGRESO_ATENCION')}
              className="border border-gray-300 bg-white text-gray-700 px-8 py-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Ingresar producción
            </button>
            <button
              onClick={() => setVista('GENERAR_VTC')}
              className="bg-gray-900 text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              Generar VTC
            </button>
          </div>
        </div>
      )}

      {vista === 'GENERAR_VTC' && (
        <VistaGenerarVTC
          onBack={() => setVista('INICIO')}
          onNext={() => setVista('RESUMEN_VTC')}
          agregarALista={agregarALista}
          listas={{ jarabes: listaJarabes, envasado: listaEnvasado, auxiliares: listaAuxiliares }}
          setListas={{ setListaJarabes, setListaEnvasado, setListaAuxiliares }}
        />
      )}

      {vista === 'RESUMEN_VTC' && (
        <VistaResumenVTC
          onBack={() => setVista('GENERAR_VTC')}
          data={resumenData}
        />
      )}

      {vista === 'INGRESO_ATENCION' && (
        <VistaIngresoAtencion onBack={() => setVista('INICIO')} />
      )}
    </div>
  );
};

// --- SUB-VISTA: GENERAR VTC ---

interface SeccionVentaProps {
  titulo: string;
  db: Producto[];
  lista: Insumo[][];
  setLista: React.Dispatch<React.SetStateAction<Insumo[][]>>;
  agregarALista: (sku: string, cantidad: number, db: Producto[], setLista: React.Dispatch<React.SetStateAction<Insumo[][]>>) => void;
}

// FIX: cada sección maneja su propio estado local de sku y cantidad,
// eliminando el estado compartido que causaba conflictos entre secciones.
const SeccionVenta: React.FC<SeccionVentaProps> = ({ titulo, db, lista, setLista, agregarALista }) => {
  const [sku,  setSku]  = useState('');
  const [cant, setCant] = useState('');

  const handleAgregar = () => {
    const cantidad = parseFloat(cant);
    if (!sku || isNaN(cantidad) || cantidad <= 0) return;
    agregarALista(sku, cantidad, db, setLista);
    // FIX: resetear campos tras agregar
    setSku('');
    setCant('');
  };

  const handleEliminarUltimo = () => setLista(prev => prev.slice(0, -1));
  const handleLimpiar        = () => setLista([]);
  const insumosFlat          = lista.flat();

  return (
    <div className="flex-1 flex flex-col gap-3 min-w-0">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{titulo}</h3>

      {/* Controles de entrada */}
      <div className="flex gap-2">
        <select
          value={sku}
          onChange={e => setSku(e.target.value)}
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 min-w-0"
        >
          <option value="">Seleccionar...</option>
          {db.map(p => (
            <option key={p.sku} value={p.sku}>{p.nombre}</option>
          ))}
        </select>

        {/* FIX: value controlado con string vacío en lugar de 0,
            evita que el campo muestre "0" al inicio */}
        <input
          type="number"
          min="0"
          step="any"
          placeholder="Cant."
          value={cant}
          onChange={e => setCant(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAgregar()}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-20 focus:outline-none focus:ring-2 focus:ring-gray-300"
        />

        {/* FIX: botón deshabilitado cuando los campos son inválidos */}
        <button
          onClick={handleAgregar}
          disabled={!sku || !cant || parseFloat(cant) <= 0}
          className="bg-green-500 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-green-600 transition-colors"
        >
          + Agregar
        </button>
      </div>

      {/* Lista de insumos */}
      <div className="border border-gray-200 rounded-lg bg-white flex flex-col overflow-hidden" style={{ height: 180 }}>
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 bg-gray-50">
          <span className="text-xs text-gray-400 italic">
            {insumosFlat.length === 0 ? 'Sin insumos agregados' : `${insumosFlat.length} insumo(s)`}
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleEliminarUltimo}
              disabled={lista.length === 0}
              className="text-xs text-gray-400 hover:text-gray-700 disabled:opacity-30 transition-colors px-1"
            >
              Deshacer
            </button>
            <button
              onClick={handleLimpiar}
              disabled={lista.length === 0}
              className="text-xs text-red-400 hover:text-red-600 disabled:opacity-30 transition-colors px-1"
            >
              Limpiar
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {insumosFlat.length === 0 ? (
            <div className="flex items-center justify-center h-full text-xs text-gray-300 italic">
              Aquí aparecerán los insumos...
            </div>
          ) : (
            insumosFlat.map((ins, i) => (
              <div key={i} className="flex justify-between items-start py-1.5 border-b border-gray-50 last:border-0">
                <span className="text-xs text-gray-600 pr-2 leading-tight">{ins.descripcion}</span>
                <span className="text-xs font-semibold text-gray-800 whitespace-nowrap">
                  {Math.round(ins.cantidad).toLocaleString('es-ES', { useGrouping: true }).replace(/\./g, ',')} {ins.um}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

interface VistaGenerarVTCProps {
  onBack: () => void;
  onNext: () => void;
  agregarALista: (sku: string, cantidad: number, db: Producto[], setLista: React.Dispatch<React.SetStateAction<Insumo[][]>>) => void;
  listas: { jarabes: Insumo[][]; envasado: Insumo[][]; auxiliares: Insumo[][] };
  setListas: {
    setListaJarabes:    React.Dispatch<React.SetStateAction<Insumo[][]>>;
    setListaEnvasado:   React.Dispatch<React.SetStateAction<Insumo[][]>>;
    setListaAuxiliares: React.Dispatch<React.SetStateAction<Insumo[][]>>;
  };
}

const VistaGenerarVTC: React.FC<VistaGenerarVTCProps> = ({ onBack, onNext, agregarALista, listas, setListas }) => (
  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
    <div className="flex items-center justify-between mb-6">
      <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
        ← Volver
      </button>
      <h2 className="text-base font-semibold text-gray-700 uppercase tracking-wide">Generar VTC</h2>
      <button onClick={onNext} className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
        Continuar →
      </button>
    </div>

    <div className="flex gap-6 mb-6">
      <SeccionVenta titulo="Jarabe"     db={DB_JARABES}    lista={listas.jarabes}    setLista={setListas.setListaJarabes}    agregarALista={agregarALista} />
      <SeccionVenta titulo="Envasado"   db={DB_ENVASADO}   lista={listas.envasado}   setLista={setListas.setListaEnvasado}   agregarALista={agregarALista} />
      <SeccionVenta titulo="Auxiliares" db={DB_AUXILIARES} lista={listas.auxiliares} setLista={setListas.setListaAuxiliares} agregarALista={agregarALista} />
    </div>

    <div className="flex justify-center pt-2">
      <button
        onClick={onNext}
        className="bg-gray-900 text-white px-10 py-3 rounded-xl font-semibold text-sm hover:bg-gray-700 transition-colors uppercase tracking-wider"
      >
        Realizar VTC
      </button>
    </div>
  </div>
);

// --- SUB-VISTA: RESUMEN VTC ---

const VistaResumenVTC: React.FC<{ onBack: () => void; data: Insumo[] }> = ({ onBack, data }) => {
  const enviarCorreo = () => {
    console.log('Enviando VTC por correo:', dataAgrupada);
    alert('VTC enviado por correo');
    
  };

  // Agrupar por codAje: si hay duplicados, sumar sus cantidades
  const dataAgrupada: Insumo[] = Object.values(
    data.reduce<Record<string, Insumo>>((acc, item) => {
      if (acc[item.codAje]) {
        acc[item.codAje] = {
          ...acc[item.codAje],
          cantidad: parseFloat((acc[item.codAje].cantidad + item.cantidad).toFixed(6)),
        };
      } else {
        acc[item.codAje] = { ...item };
      }
      return acc;
    }, {})
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
          ← Volver
        </button>
        <h2 className="text-base font-semibold text-gray-700 uppercase tracking-wide">Resumen VTC</h2>
      </div>

      {dataAgrupada.length === 0 ? (
        <div className="text-center text-gray-400 py-12 text-sm italic">
          No hay insumos en el resumen.
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-right text-xs">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Cod. AJE', 'Cod. EMB', 'Descripción', 'U.M', 'Cantidad'].map(h => (
                  <th key={h} className="px-3 py-2.5 font-semibold text-gray-600 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(() => {
                // Helper to determine the product type for each item
                const getTipo = (item: Insumo): 'Envasado' | 'Jarabe' | 'Auxiliar' => {
                  if (DB_ENVASADO.some(p => p.insumos.some(i => i.codAje === item.codAje))) return 'Envasado';
                  if (DB_JARABES.some(p => p.insumos.some(i => i.codAje === item.codAje))) return 'Jarabe';
                  return 'Auxiliar';
                };

                // Sort grouped data: Envasado first, then Jarabe, then Auxiliar
                const sorted = [...dataAgrupada].sort((a, b) => {
                  const order: Record<string, number> = { Envasado: 1, Jarabe: 2, Auxiliar: 3 };
                  return order[getTipo(a)] - order[getTipo(b)];
                });

                return sorted.map((item, idx) => {
                  const isEnvasado = getTipo(item) === 'Envasado';
                  const cantidad = isEnvasado ? item.cantidad / 0.997 : item.cantidad;
                  return (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 text-gray-700 font-mono">{item.codAje}</td>
                      <td className="px-3 py-2 text-gray-700 font-mono">{item.codEmb}</td>
                      <td className="px-3 py-2 text-gray-700">{item.descripcion}</td>
                      <td className="px-3 py-2 text-gray-500">{item.um}</td>
                      <td className="px-3 py-2 font-semibold text-gray-800">{Math.round(cantidad).toLocaleString('es-ES', { useGrouping: true }).replace(/\./g, ',')}</td>
                    </tr>
                  );
                });
              })()}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-end mt-6">
        <button
          onClick={enviarCorreo}
          className="border border-gray-900 text-gray-900 px-6 py-2.5 rounded-lg text-sm font-semibold uppercase hover:bg-gray-900 hover:text-white transition-colors"
        >
          Enviar VTC por correo
        </button>
      </div>
    </div>
  );
};

// --- SUB-VISTA: INGRESO DE ATENCIÓN ---

interface ItemAtencion {
  descripcion: string;
  cantidad: number;
}

const VistaIngresoAtencion: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [busqueda, setBusqueda] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [items,    setItems]    = useState<ItemAtencion[]>([]);

  const handleAgregar = () => {
    const cant = parseFloat(cantidad);
    if (!busqueda.trim() || isNaN(cant) || cant <= 0) return;
    setItems(prev => [...prev, { descripcion: busqueda.trim(), cantidad: cant }]);
    // FIX: limpiar campos tras agregar
    setBusqueda('');
    setCantidad('');
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
          ← Volver
        </button>
        <h2 className="text-base font-semibold text-gray-700 uppercase tracking-wide">Ingreso de Atención</h2>
      </div>

      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Buscar por descripción..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAgregar()}
          className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
        <input
          type="number"
          min="0"
          step="any"
          placeholder="Cant."
          value={cantidad}
          onChange={e => setCantidad(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAgregar()}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
        <button
          onClick={handleAgregar}
          disabled={!busqueda.trim() || !cantidad || parseFloat(cantidad) <= 0}
          className="bg-green-500 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors"
        >
          + Agregar
        </button>
      </div>

      <div className="border border-gray-200 rounded-xl bg-gray-50 overflow-hidden mb-4" style={{ minHeight: 200 }}>
        {items.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-sm text-gray-300 italic">
            Aquí se registran las atenciones...
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-white border-b border-gray-200">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Descripción</th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 uppercase">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => (
                <tr key={i} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-2.5 text-gray-700">{it.descripcion}</td>
                  <td className="px-4 py-2.5 text-right font-semibold text-gray-800">{it.cantidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex justify-end">
        <button
          disabled={items.length === 0}
          onClick={() => alert('Atención registrada')}
          className="border border-gray-900 text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed px-6 py-2.5 rounded-lg text-sm font-semibold uppercase hover:bg-gray-900 hover:text-white transition-colors"
        >
          Guardar Atención
        </button>
      </div>
    </div>
  );
};

export default SistemaVentas;