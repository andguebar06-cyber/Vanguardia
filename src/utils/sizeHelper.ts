/**
 * Helper utility to provide descriptive size measurements and guides
 * for apparel, footwear, kids, and home / kitchen objects.
 */

export interface SizeSpecification {
  size: string;
  dimensionLabel: string;
  description: string;
  measurements?: {
    label: string;
    value: string;
  }[];
}

export function getSizeDetails(
  category: string,
  size: string,
  department?: string
): SizeSpecification {
  // Normalize string
  const s = size.trim();

  // OVERSIZE
  if (category === 'oversize') {
    if (s.includes('S')) {
      return {
        size: s,
        dimensionLabel: 'Pecho: 110 cm • Largo: 72 cm',
        description: 'Corte Boxy Fit holgado con hombros caídos de 240g.',
        measurements: [
          { label: 'Pecho contorno', value: '110 cm' },
          { label: 'Largo total', value: '72 cm' },
          { label: 'Caída de hombro', value: '54 cm' },
        ],
      };
    }
    if (s.includes('M')) {
      return {
        size: s,
        dimensionLabel: 'Pecho: 116 cm • Largo: 74 cm',
        description: 'Corte Boxy Fit estándar relajado, silueta urbana amplia.',
        measurements: [
          { label: 'Pecho contorno', value: '116 cm' },
          { label: 'Largo total', value: '74 cm' },
          { label: 'Caída de hombro', value: '56 cm' },
        ],
      };
    }
    if (s.includes('XXL')) {
      return {
        size: s,
        dimensionLabel: 'Pecho: 134 cm • Largo: 82 cm',
        description: 'Corte Super Oversize extra amplio y envolvente.',
        measurements: [
          { label: 'Pecho contorno', value: '134 cm' },
          { label: 'Largo total', value: '82 cm' },
          { label: 'Caída de hombro', value: '62 cm' },
        ],
      };
    }
    if (s.includes('XL')) {
      return {
        size: s,
        dimensionLabel: 'Pecho: 128 cm • Largo: 79 cm',
        description: 'Corte Boxy Fit amplio para máxima comodidad.',
        measurements: [
          { label: 'Pecho contorno', value: '128 cm' },
          { label: 'Largo total', value: '79 cm' },
          { label: 'Caída de hombro', value: '60 cm' },
        ],
      };
    }
    if (s.includes('L')) {
      return {
        size: s,
        dimensionLabel: 'Pecho: 122 cm • Largo: 76 cm',
        description: 'Corte Boxy Fit holgado con excelente caída.',
        measurements: [
          { label: 'Pecho contorno', value: '122 cm' },
          { label: 'Largo total', value: '76 cm' },
          { label: 'Caída de hombro', value: '58 cm' },
        ],
      };
    }
  }

  // INFANTIL (NIÑOS / NIÑAS)
  if (category === 'infantil') {
    if (department === 'Moda Niñas') {
      const dressMap: Record<string, { height: string; chest: string; waist: string; length: string }> = {
        '3-4 Años': { height: '98 - 104 cm', chest: '56 cm', waist: '52 cm', length: '60 cm' },
        '5-6 Años': { height: '110 - 116 cm', chest: '60 cm', waist: '55 cm', length: '66 cm' },
        '7-8 Años': { height: '122 - 128 cm', chest: '65 cm', waist: '58 cm', length: '73 cm' },
        '9-10 Años': { height: '134 - 140 cm', chest: '70 cm', waist: '62 cm', length: '80 cm' },
      };
      if (dressMap[s]) {
        return {
          size: s,
          dimensionLabel: `Estatura: ${dressMap[s].height} • Largo vestido: ${dressMap[s].length}`,
          description: 'Vestido de tul y flores con cuerpo entallado, lazo ajustable y forro interior de algodón suave.',
          measurements: [
            { label: 'Estatura recomendada', value: dressMap[s].height },
            { label: 'Contorno de pecho', value: dressMap[s].chest },
            { label: 'Contorno de cintura', value: dressMap[s].waist },
            { label: 'Largo total vestido', value: dressMap[s].length },
          ],
        };
      }
    }

    if (s.includes('4 Años') || s === '4') {
      return {
        size: s,
        dimensionLabel: 'Estatura: 102-108 cm • Pecho: 56 cm',
        description: 'Diseñado para niños/as de 98 a 108 cm de altura.',
        measurements: [
          { label: 'Estatura', value: '102-108 cm' },
          { label: 'Pecho', value: '56 cm' },
          { label: 'Cintura', value: '53 cm' },
        ],
      };
    }
    if (s.includes('6 Años') || s === '6') {
      return {
        size: s,
        dimensionLabel: 'Estatura: 112-118 cm • Pecho: 60 cm',
        description: 'Diseñado para niños/as de 110 a 118 cm de altura.',
        measurements: [
          { label: 'Estatura', value: '112-118 cm' },
          { label: 'Pecho', value: '60 cm' },
          { label: 'Cintura', value: '55 cm' },
        ],
      };
    }
    if (s.includes('8 Años') || s === '8') {
      return {
        size: s,
        dimensionLabel: 'Estatura: 122-128 cm • Pecho: 64 cm',
        description: 'Diseñado para niños/as de 120 a 128 cm de altura.',
        measurements: [
          { label: 'Estatura', value: '122-128 cm' },
          { label: 'Pecho', value: '64 cm' },
          { label: 'Cintura', value: '58 cm' },
        ],
      };
    }
    if (s.includes('10 Años') || s === '10') {
      return {
        size: s,
        dimensionLabel: 'Estatura: 132-140 cm • Pecho: 70 cm',
        description: 'Diseñado para niños/as de 130 a 140 cm de altura.',
        measurements: [
          { label: 'Estatura', value: '132-140 cm' },
          { label: 'Pecho', value: '70 cm' },
          { label: 'Cintura', value: '62 cm' },
        ],
      };
    }
    if (s.includes('12 Años') || s === '12') {
      return {
        size: s,
        dimensionLabel: 'Estatura: 142-152 cm • Pecho: 76 cm',
        description: 'Diseñado para preadolescentes de 142 a 152 cm.',
        measurements: [
          { label: 'Estatura', value: '142-152 cm' },
          { label: 'Pecho', value: '76 cm' },
          { label: 'Cintura', value: '66 cm' },
        ],
      };
    }
  }

  // CALZADO (NÚMEROS EUROPEOS / LATAM)
  if (category === 'calzado' || /^\d{2}$/.test(s)) {
    const num = parseInt(s, 10);
    const cmMap: Record<number, string> = {
      35: '22.5 cm',
      36: '23.0 cm',
      37: '23.5 cm',
      38: '24.2 cm',
      39: '25.0 cm',
      40: '25.5 cm',
      41: '26.2 cm',
      42: '27.0 cm',
      43: '27.8 cm',
      44: '28.5 cm',
      45: '29.2 cm',
    };
    const length = cmMap[num] || 'Ajuste regular estándar';
    return {
      size: s,
      dimensionLabel: `Plantilla interior: ${length}`,
      description: 'Horma ergonómica con amortiguación anatómica y calce fiel a la talla.',
      measurements: [
        { label: 'Talla EU / ES', value: s },
        { label: 'Largo del pie', value: length },
        { label: 'Ancho de horma', value: 'Estándar D/E' },
      ],
    };
  }

  // CALCETINES & MEDIAS TOBILLERAS
  if (department?.includes('Medias') || department?.includes('Calcetines') || s.includes('35-38') || s.includes('39-42') || s.includes('36-40') || s.includes('41-45') || s.includes('43-46')) {
    if (s.includes('35-38')) {
      return {
        size: s,
        dimensionLabel: 'Calzado 35 a 38 EU (22 - 24.5 cm)',
        description: 'Ajuste elástico anatómico para pies menudos o calzado femenino estándar.',
        measurements: [
          { label: 'Rango de calzado', value: '35 a 38 EU' },
          { label: 'Longitud del pie', value: '22.0 - 24.5 cm' },
          { label: 'Altura de caña', value: 'Corte tobillero bajo / invisible' },
        ],
      };
    }
    if (s.includes('39-42')) {
      return {
        size: s,
        dimensionLabel: 'Calzado 39 a 42 EU (25 - 27 cm)',
        description: 'Talla intermedia universal unisex con elástico antipresión.',
        measurements: [
          { label: 'Rango de calzado', value: '39 a 42 EU' },
          { label: 'Longitud del pie', value: '25.0 - 27.0 cm' },
          { label: 'Altura de caña', value: 'Corte tobillero bajo' },
        ],
      };
    }
    if (s.includes('43-46')) {
      return {
        size: s,
        dimensionLabel: 'Calzado 43 a 46 EU (27.5 - 30 cm)',
        description: 'Talla amplia con talón y puntera reforzados.',
        measurements: [
          { label: 'Rango de calzado', value: '43 a 46 EU' },
          { label: 'Longitud del pie', value: '27.5 - 30.0 cm' },
          { label: 'Altura de caña', value: 'Corte tobillero bajo' },
        ],
      };
    }
    if (s.includes('36-40')) {
      return {
        size: s,
        dimensionLabel: 'Calzado 36 a 40 EU (23 - 25.5 cm)',
        description: 'Ajuste elástico con compresión de arco para deporte y entrenamiento.',
        measurements: [
          { label: 'Rango de calzado', value: '36 a 40 EU' },
          { label: 'Longitud del pie', value: '23.0 - 25.5 cm' },
          { label: 'Sujeción', value: 'Banda elástica de soporte de arco' },
        ],
      };
    }
    if (s.includes('41-45')) {
      return {
        size: s,
        dimensionLabel: 'Calzado 41 a 45 EU (26 - 29 cm)',
        description: 'Talla deportiva grande con acolchado de rizo en la planta.',
        measurements: [
          { label: 'Rango de calzado', value: '41 a 45 EU' },
          { label: 'Longitud del pie', value: '26.0 - 29.0 cm' },
          { label: 'Sujeción', value: 'Banda elástica de soporte de arco' },
        ],
      };
    }
  }

  // HOGAR & MENAJE (MUEBLES, VAJILLAS, ELECTRODOMÉSTICOS, TAZAS, VASOS, BALDOSAS)
  if (category === 'hogar') {
    if (s.includes('3 Plazas')) {
      return {
        size: s,
        dimensionLabel: 'Sofá: 205×90×85 cm • Cama abierta: 140×190 cm',
        description: 'Estructura convertible clic-clac con capacidad para 3 personas sentadas o 2 durmiendo.',
        measurements: [
          { label: 'Dimensiones sofá', value: '205 × 90 × 85 cm' },
          { label: 'Cama extendida', value: '140 × 190 cm' },
          { label: 'Capacidad de peso', value: 'Hasta 300 kg' },
        ],
      };
    }
    if (s.includes('24 Piezas')) {
      return {
        size: s,
        dimensionLabel: 'Servicio para 6 personas (24 cubiertos en total)',
        description: 'Incluye 6 tenedores (20.5 cm), 6 cuchillos (22 cm), 6 cucharas soperas (20.5 cm) y 6 cucharillas (14 cm).',
        measurements: [
          { label: 'Comensales', value: '6 personas' },
          { label: 'Material', value: 'Acero Inox 18/10' },
          { label: 'Acabado', value: 'Satinado mate' },
        ],
      };
    }
    if (s.includes('16 Piezas')) {
      return {
        size: s,
        dimensionLabel: 'Servicio para 4 personas (16 piezas en total)',
        description: 'Incluye 4 platos llanos (27 cm), 4 platos hondos (21 cm), 4 platos postre (19 cm) y 4 cuencos (15 cm).',
        measurements: [
          { label: 'Comensales', value: '4 personas' },
          { label: 'Material', value: 'Cerámica Gres' },
          { label: 'Apto', value: 'Microondas & Lavavajillas' },
        ],
      };
    }
    if (s.includes('Tazas')) {
      return {
        size: s,
        dimensionLabel: '4 Tazas de 280 ml + 4 Platos a juego',
        description: 'Tazas ergonómicas con retención térmica prolongada para café o infusiones.',
        measurements: [
          { label: 'Capacidad individual', value: '280 ml' },
          { label: 'Diámetro taza', value: '8.5 cm' },
          { label: 'Diámetro plato', value: '14 cm' },
        ],
      };
    }
    if (s.includes('Vasos')) {
      return {
        size: s,
        dimensionLabel: 'Set 6 Vasos de 350 ml (Altura 12.5 cm)',
        description: 'Cristal de borosilicato termorresistente con textura acanalada estriada.',
        measurements: [
          { label: 'Cantidad', value: '6 unidades' },
          { label: 'Capacidad c/u', value: '350 ml' },
          { label: 'Resistencia', value: '-20°C a 120°C' },
        ],
      };
    }
    if (s.includes('Depósito')) {
      return {
        size: s,
        dimensionLabel: 'Depósito 1.5 L • Bomba 20 Bares',
        description: 'Dimensiones compactas de 31 × 20 × 28 cm. Ideal para cocinas modernas.',
        measurements: [
          { label: 'Capacidad depósito', value: '1.5 Litros' },
          { label: 'Presión de bomba', value: '20 Bares' },
          { label: 'Tiempo precalentado', value: '25 segundos' },
        ],
      };
    }
    if (s.includes('Baldosas') || s.includes('Caja')) {
      return {
        size: s,
        dimensionLabel: '4 piezas de 60×60 cm (Cubre 1.44 m²)',
        description: 'Porcelánico rectificado con juntas mínimas de 1.5 mm.',
        measurements: [
          { label: 'Formato pieza', value: '60 × 60 cm' },
          { label: 'Cobertura caja', value: '1.44 m²' },
          { label: 'Grosor', value: '9.5 mm' },
        ],
      };
    }
    if (s.includes('Toallas')) {
      return {
        size: s,
        dimensionLabel: '2 Toallas 70×140 cm + 2 Toallas 50×100 cm',
        description: 'Gramaje extra denso de 600 GSM en 100% algodón egipcio peinado.',
        measurements: [
          { label: 'Toallas de baño', value: '70 × 140 cm (2 uds)' },
          { label: 'Toallas de lavabo', value: '50 × 100 cm (2 uds)' },
          { label: 'Densidad', value: '600 GSM' },
        ],
      };
    }
  }

  // BELLEZA & BARBERÍA
  if (category === 'belleza-barberia') {
    if (s.includes('Difusor') || s.includes('Secador')) {
      return {
        size: s,
        dimensionLabel: 'Motor AC 2400W + Difusor + 2 Boquillas',
        description: 'Set profesional con difusor circular para rizos y ondas, y dos boquillas estrechas de concentración magnética.',
        measurements: [
          { label: 'Potencia', value: '2400W Motor AC Profesional' },
          { label: 'Accesorios', value: '1 Difusor de rizos + 2 Boquillas concentradoras' },
          { label: 'Tecnología', value: 'Iónica anti-frizz con sellado de cutícula' },
          { label: 'Temperaturas', value: '3 niveles calor + Ráfaga de frío' },
        ],
      };
    }
    if (s.includes('Peines') || s.includes('Barber')) {
      return {
        size: s,
        dimensionLabel: '4 Peines guía (1.5mm, 3mm, 6mm, 9mm) + Accesorios',
        description: 'Kit completo de corte profesional con cuchilla en T de acero quirúrgico, cepillo limpiador y aceite lubricante.',
        measurements: [
          { label: 'Peines incluidos', value: '1.5 mm, 3 mm, 6 mm, 9 mm' },
          { label: 'Tipo de cuchilla', value: 'Acero quirúrgico T-Blade' },
          { label: 'Batería y autonomía', value: 'Litio 1500mAh (180 min)' },
          { label: 'Carga', value: 'USB Rápida (2 horas)' },
        ],
      };
    }
  }

  // ROPA INTERIOR Y HOMWEAR (BÓXERS Y PIJAMAS)
  if (category === 'ropa-interior') {
    if (department === 'Ropa Interior Masculina') {
      const boxerMap: Record<string, { waist: string; inches: string }> = {
        'S': { waist: '71 - 76 cm', inches: '28 - 30 in' },
        'M': { waist: '81 - 86 cm', inches: '32 - 34 in' },
        'L': { waist: '91 - 97 cm', inches: '36 - 38 in' },
        'XL': { waist: '102 - 107 cm', inches: '40 - 42 in' },
        'XXL': { waist: '112 - 117 cm', inches: '44 - 46 in' },
      };
      if (boxerMap[s]) {
        return {
          size: s,
          dimensionLabel: `Cintura: ${boxerMap[s].waist} (${boxerMap[s].inches})`,
          description: 'Corte bóxer ajustado ergonómico con elástico de sujeción suave que no aprieta.',
          measurements: [
            { label: 'Cintura recomendada', value: boxerMap[s].waist },
            { label: 'Equivalencia en pulgadas', value: boxerMap[s].inches },
            { label: 'Tiro / Largo pierna', value: 'Medio anti-fricción' },
            { label: 'Composición', value: '95% Algodón orgánico / 5% Elastano' },
          ],
        };
      }
    }
    if (department === 'Lencería & Homewear') {
      const pijamaMap: Record<string, { chest: string; waist: string; hips: string }> = {
        'XS': { chest: '80 - 84 cm', waist: '62 - 66 cm', hips: '86 - 90 cm' },
        'S': { chest: '86 - 90 cm', waist: '68 - 72 cm', hips: '92 - 96 cm' },
        'M': { chest: '92 - 96 cm', waist: '74 - 78 cm', hips: '98 - 102 cm' },
        'L': { chest: '98 - 104 cm', waist: '80 - 86 cm', hips: '104 - 110 cm' },
      };
      if (pijamaMap[s]) {
        return {
          size: s,
          dimensionLabel: `Pecho: ${pijamaMap[s].chest} • Cintura: ${pijamaMap[s].waist}`,
          description: 'Conjunto 2 piezas (camisa camisera manga larga + pantalón recto) en satén fluido.',
          measurements: [
            { label: 'Pecho / Busto', value: pijamaMap[s].chest },
            { label: 'Cintura pantalón (elástica)', value: pijamaMap[s].waist },
            { label: 'Caderas', value: pijamaMap[s].hips },
            { label: 'Corte de pantalón', value: 'Recto holgado con cordón' },
          ],
        };
      }
    }
  }

  // BLUSAS FEMENINAS
  if (category === 'jeans-blusas' && department?.includes('Blusas')) {
    const blusasMap: Record<string, { chest: string; shoulder: string; sleeve: string; length: string }> = {
      'XS': { chest: '82 - 86 cm', shoulder: '37 cm', sleeve: '59 cm', length: '62 cm' },
      'S': { chest: '86 - 90 cm', shoulder: '38 cm', sleeve: '60 cm', length: '63 cm' },
      'M': { chest: '90 - 96 cm', shoulder: '39.5 cm', sleeve: '61 cm', length: '64 cm' },
      'L': { chest: '96 - 102 cm', shoulder: '41 cm', sleeve: '62 cm', length: '65 cm' },
      'XL': { chest: '102 - 108 cm', shoulder: '42.5 cm', sleeve: '63 cm', length: '66 cm' },
    };
    if (blusasMap[s.toUpperCase()]) {
      const data = blusasMap[s.toUpperCase()];
      return {
        size: s,
        dimensionLabel: `Busto: ${data.chest} • Largo: ${data.length}`,
        description: 'Corte fluido regular en satén de seda con caída natural y lazada al cuello adaptable.',
        measurements: [
          { label: 'Contorno de busto', value: data.chest },
          { label: 'Ancho de hombros', value: data.shoulder },
          { label: 'Largo de manga', value: data.sleeve },
          { label: 'Largo total prenda', value: data.length },
        ],
      };
    }
  }

  // TRAJES Y SASTRERÍA MASCULINA
  if (category === 'hombre' && department?.includes('Trajes')) {
    const suitMap: Record<string, { chest: string; waist: string; shoulder: string; inseam: string }> = {
      '46 (S)': { chest: '92 cm', waist: '80 cm', shoulder: '44 cm', inseam: '82 cm' },
      '48 (M)': { chest: '96 cm', waist: '84 cm', shoulder: '45 cm', inseam: '83 cm' },
      '50 (L)': { chest: '100 cm', waist: '88 cm', shoulder: '46 cm', inseam: '84 cm' },
      '52 (XL)': { chest: '104 cm', waist: '92 cm', shoulder: '47.5 cm', inseam: '85 cm' },
      '54 (XXL)': { chest: '108 cm', waist: '96 cm', shoulder: '49 cm', inseam: '86 cm' },
    };
    if (suitMap[s]) {
      const d = suitMap[s];
      return {
        size: s,
        dimensionLabel: `Saco Pecho: ${d.chest} • Pantalón Cintura: ${d.waist}`,
        description: 'Conjunto 2 piezas corte slim fit italiano con caída recta impecable.',
        measurements: [
          { label: 'Pecho saco blazer', value: d.chest },
          { label: 'Cintura pantalón', value: d.waist },
          { label: 'Ancho de hombros', value: d.shoulder },
          { label: 'Largo entrepierna', value: d.inseam },
        ],
      };
    }
  }

  // PANTALONES CHINOS HOMBRE
  if (category === 'hombre' && department?.includes('Chinos')) {
    const match = s.match(/^(\d{2})/);
    if (match) {
      const inches = parseInt(match[1], 10);
      const cm = Math.round(inches * 2.54);
      return {
        size: s,
        dimensionLabel: `Cintura: ${cm} cm (${inches} pulgadas)`,
        description: 'Sarga de algodón peinado con 3% elastano para confort diario y tiro medio.',
        measurements: [
          { label: 'Contorno de cintura', value: `${cm} cm` },
          { label: 'Cadera', value: `${cm + 20} cm` },
          { label: 'Tiro medio', value: '26 cm' },
          { label: 'Largo total', value: '104 cm' },
        ],
      };
    }
  }

  // ABRIGOS MUJER
  if (category === 'mujer' && department?.includes('Abrigos')) {
    const coatMap: Record<string, { chest: string; length: string; sleeve: string }> = {
      'XS': { chest: '88 - 92 cm', length: '112 cm', sleeve: '59 cm' },
      'S': { chest: '94 - 98 cm', length: '114 cm', sleeve: '60 cm' },
      'M': { chest: '100 - 104 cm', length: '116 cm', sleeve: '61 cm' },
      'L': { chest: '106 - 112 cm', length: '118 cm', sleeve: '62 cm' },
      'XL': { chest: '114 - 120 cm', length: '120 cm', sleeve: '63 cm' },
    };
    if (coatMap[s.toUpperCase()]) {
      const d = coatMap[s.toUpperCase()];
      return {
        size: s,
        dimensionLabel: `Pecho: ${d.chest} • Largo: ${d.length}`,
        description: 'Abrigo largo envolvente con cinturón de lana ajustable y forro satinado.',
        measurements: [
          { label: 'Contorno pecho con cruce', value: d.chest },
          { label: 'Largo total abrigo', value: d.length },
          { label: 'Largo de manga', value: d.sleeve },
          { label: 'Tipo de corte', value: 'Cruzado con cinturón a juego' },
        ],
      };
    }
  }

  // PANTALONES PALAZZO MUJER
  if (category === 'mujer' && department?.includes('Palazzo')) {
    const palazzoMap: Record<string, { waist: string; hips: string; length: string }> = {
      'XS': { waist: '64 cm', hips: '94 cm', length: '106 cm' },
      'S': { waist: '68 cm', hips: '98 cm', length: '107 cm' },
      'M': { waist: '72 cm', hips: '102 cm', length: '108 cm' },
      'L': { waist: '78 cm', hips: '108 cm', length: '109 cm' },
      'XL': { waist: '84 cm', hips: '114 cm', length: '110 cm' },
    };
    if (palazzoMap[s.toUpperCase()]) {
      const d = palazzoMap[s.toUpperCase()];
      return {
        size: s,
        dimensionLabel: `Cintura: ${d.waist} • Largo: ${d.length}`,
        description: 'Corte palazzo de pierna ancha fluida y talle alto con pinzas favorecedoras.',
        measurements: [
          { label: 'Contorno cintura alta', value: d.waist },
          { label: 'Contorno caderas', value: d.hips },
          { label: 'Ancho bajo de pierna', value: '32 cm (fluido)' },
          { label: 'Largo total pantalón', value: d.length },
        ],
      };
    }
  }

  // TOCADOS Y SOMBRERERÍA / CUBRECABEZAS
  if (category === 'accesorios' && department?.includes('Tocados')) {
    if (s.includes('55-56') || s.startsWith('S')) {
      return {
        size: s,
        dimensionLabel: 'Contorno de cabeza: 55 - 56 cm (Talla S)',
        description: 'Ajuste preciso para cabezas pequeñas o contornos menudos.',
        measurements: [
          { label: 'Circunferencia craneal', value: '55 - 56 cm' },
          { label: 'Equivalencia en pulgadas', value: '21.6 - 22 in' },
          { label: 'Ajuste interior', value: 'Banda antisudor con cinta regulable' },
        ],
      };
    }
    if (s.includes('57-58') || s.startsWith('M')) {
      return {
        size: s,
        dimensionLabel: 'Contorno de cabeza: 57 - 58 cm (Talla M Estándar)',
        description: 'Talla estándar unisex más común para adultos.',
        measurements: [
          { label: 'Circunferencia craneal', value: '57 - 58 cm' },
          { label: 'Equivalencia en pulgadas', value: '22.4 - 22.8 in' },
          { label: 'Ajuste interior', value: 'Banda antisudor acolchada' },
        ],
      };
    }
    if (s.includes('59-60') || s.startsWith('L')) {
      return {
        size: s,
        dimensionLabel: 'Contorno de cabeza: 59 - 60 cm (Talla L Amplia)',
        description: 'Talla grande para contornos anchos o cabellos voluminosos.',
        measurements: [
          { label: 'Circunferencia craneal', value: '59 - 60 cm' },
          { label: 'Equivalencia en pulgadas', value: '23.2 - 23.6 in' },
          { label: 'Ajuste interior', value: 'Banda reforzada de confort' },
        ],
      };
    }
    if (s.includes('54-60') || s.toLowerCase().includes('ajustable')) {
      return {
        size: s,
        dimensionLabel: 'Contorno regulable: 54 - 60 cm (Hebilla metálica)',
        description: 'Correa trasera ajustable con cierre de hebilla metálica personalizada.',
        measurements: [
          { label: 'Circunferencia adaptable', value: '54 - 60 cm' },
          { label: 'Largo de visera curva', value: '7 cm (protección solar)' },
          { label: 'Profundidad de copa', value: '11.5 cm (corte 6 paneles)' },
          { label: 'Sistema de ajuste', value: 'Hebilla deslizante de metal inoxidable' },
        ],
      };
    }
    if (s.toLowerCase().includes('única') || s.toLowerCase().includes('adaptable') || s.toLowerCase().includes('ergonómica')) {
      return {
        size: s,
        dimensionLabel: 'Talla Universal Adaptable (55 - 59 cm)',
        description: 'Estructura flexible, elástica o regulable diseñada para adaptarse a cualquier contorno.',
        measurements: [
          { label: 'Rango de circunferencia', value: '55 - 59 cm' },
          { label: 'Sujeción', value: 'Diadema con memoria / elástico forrado en satén' },
          { label: 'Fijación en peinado', value: 'No daña el cabello ni genera presión' },
        ],
      };
    }
  }

  // JEANS / PANTALONES (CINTURAS NUMÉRICAS 26-38 o W)
  if (/^\d{2}$/.test(s) && (category === 'jeans-blusas' || department?.includes('Pantalones') || department?.includes('Jeans'))) {
    const inches = parseInt(s, 10);
    const cm = Math.round(inches * 2.54);
    return {
      size: s,
      dimensionLabel: `Cintura: ${cm} cm (Talla ${s} US)`,
      description: 'Denim elástico confort fit con tiro medio/alto y elasticidad del 2%.',
      measurements: [
        { label: 'Cintura contorno', value: `${cm} cm` },
        { label: 'Cadera', value: `${cm + 24} cm` },
        { label: 'Largo entrepierna', value: '78 cm' },
      ],
    };
  }

  // STANDARD APPAREL SIZES (XS, S, M, L, XL, XXL)
  switch (s.toUpperCase()) {
    case 'XS':
      return {
        size: s,
        dimensionLabel: 'Pecho: 82-86 cm • Cintura: 64-68 cm',
        description: 'Talla Extra Pequeña, ajuste preciso a la figura.',
        measurements: [
          { label: 'Pecho', value: '82 - 86 cm' },
          { label: 'Cintura', value: '64 - 68 cm' },
          { label: 'Largo aproximado', value: '66 cm' },
        ],
      };
    case 'S':
      return {
        size: s,
        dimensionLabel: 'Pecho: 88-94 cm • Cintura: 70-76 cm',
        description: 'Talla Pequeña, corte estándar cómodo.',
        measurements: [
          { label: 'Pecho', value: '88 - 94 cm' },
          { label: 'Cintura', value: '70 - 76 cm' },
          { label: 'Largo aproximado', value: '69 cm' },
        ],
      };
    case 'M':
      return {
        size: s,
        dimensionLabel: 'Pecho: 96-102 cm • Cintura: 78-84 cm',
        description: 'Talla Mediana estándar, balance perfecto de confort.',
        measurements: [
          { label: 'Pecho', value: '96 - 102 cm' },
          { label: 'Cintura', value: '78 - 84 cm' },
          { label: 'Largo aproximado', value: '72 cm' },
        ],
      };
    case 'L':
      return {
        size: s,
        dimensionLabel: 'Pecho: 104-110 cm • Cintura: 86-92 cm',
        description: 'Talla Grande, corte holgado con amplitud natural.',
        measurements: [
          { label: 'Pecho', value: '104 - 110 cm' },
          { label: 'Cintura', value: '86 - 92 cm' },
          { label: 'Largo aproximado', value: '75 cm' },
        ],
      };
    case 'XL':
      return {
        size: s,
        dimensionLabel: 'Pecho: 112-118 cm • Cintura: 94-100 cm',
        description: 'Talla Extra Grande, máximo espacio y comodidad.',
        measurements: [
          { label: 'Pecho', value: '112 - 118 cm' },
          { label: 'Cintura', value: '94 - 100 cm' },
          { label: 'Largo aproximado', value: '78 cm' },
        ],
      };
    case 'XXL':
      return {
        size: s,
        dimensionLabel: 'Pecho: 120-128 cm • Cintura: 102-110 cm',
        description: 'Talla Doble Extra Grande con silueta espaciosa.',
        measurements: [
          { label: 'Pecho', value: '120 - 128 cm' },
          { label: 'Cintura', value: '102 - 110 cm' },
          { label: 'Largo aproximado', value: '81 cm' },
        ],
      };
    case 'ÚNICA':
    case 'UNICA':
      return {
        size: s,
        dimensionLabel: 'Talla única ajustable / adaptable',
        description: 'Diseño adaptable a múltiples siluetas con ajuste elástico o correas regulables.',
        measurements: [
          { label: 'Tipo', value: 'Unitalla universal' },
          { label: 'Ajuste', value: 'Regulable' },
        ],
      };
    default:
      return {
        size: s,
        dimensionLabel: `Especificación: ${s}`,
        description: 'Dimensiones y proporciones verificadas por control de calidad.',
        measurements: [
          { label: 'Referencia', value: s },
          { label: 'Calidad', value: '100% garantizada' },
        ],
      };
  }
}
