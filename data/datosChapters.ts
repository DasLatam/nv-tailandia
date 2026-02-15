export type DatosSection = {
  /** anchor id */
  id: string
  title: string
  paragraphs: string[]
  bullets?: string[]
  tips?: { title: string; bullets: string[] }[]
}

export type DatosChapter = {
  slug: string
  title: string
  description: string
  sections: DatosSection[]
}

export const DATOS_CHAPTERS: DatosChapter[] = [
  {
    slug: 'budismo',
    title: 'Budismo y Tailandia',
    description:
      'Marco práctico para “leer” un wat: mérito (bun), vida monástica, fiestas sagradas, arquitectura/simbolismo y etiqueta para visitar templos sin meter la pata.',
    sections: [
      {
        id: 'mapa-mental',
        title: 'Mapa mental rápido: qué budismo vas a ver (y qué no)',
        paragraphs: [
          'En Tailandia predomina el budismo Theravada. Para el viajero esto se traduce en algo muy concreto: templos como espacios vivos (no museos), una comunidad monástica visible en la calle, y una cultura donde “hacer mérito” forma parte de la rutina.',
          'Vas a ver, además, una capa popular muy importante: altares domésticos, amuletos, pequeños santuarios de espíritu (spirit houses), rituales locales y supersticiones que conviven sin conflicto con el marco budista. No hace falta estudiar doctrinas: lo útil es entender por qué la gente se comporta como se comporta dentro de un wat.',
          'Idea clave: un wat está diseñado para ordenar conducta (caminar lento, bajar la voz, sentarse de cierta forma) y para guiar la mirada (símbolos repetidos, guardianes, posturas del Buda, circuitos de ofrenda).'
        ],
        bullets: [
          'Theravada = tradición dominante (monjes, disciplina, mérito).',
          'Práctica popular = amuletos, altares, rituales locales (convive con lo anterior).',
          'Wat = conjunto + recorrido (no “un edificio”).'
        ]
      },
      {
        id: 'bun',
        title: 'Mérito (bun): la lógica que organiza casi todo',
        paragraphs: [
          'Si hay un concepto que te cambia la visita a templos es “mérito” (bun). Hacer mérito es realizar acciones consideradas valiosas (donar, sostener a la comunidad monástica, cuidar, respetar, participar de rituales) y acumular un capital moral/espiritual. En la práctica: verás donaciones en cajas (a veces con QR), ofrendas de flores e incienso, familias llevando comida, y gente dando vueltas alrededor de una estupa (chedi) en sentido horario.',
          'Esto explica por qué lo religioso se ve tan “cotidiano”: no es un evento excepcional, es hábito. A veces el wat funciona como centro comunitario (educación, reuniones, ceremonias), y el acto de mérito es la manera socialmente aceptada de “participar” aunque no seas monje.',
          'Regla de oro como visitante: si detectás un acto repetido (ofrenda, vuelta alrededor de una estupa, postura frente al Buda), asumí que no es performance para turistas. Dejá paso, bajá la voz y observá desde un costado.'
        ],
        bullets: [
          'Ofrendas (flores/incienso/velas) frente a imágenes de Buda.',
          'Donaciones para mantenimiento/restauración del templo.',
          'Alimentación a monjes (especialmente temprano).',
          'Circunvalación ritual alrededor de chedis (sentido horario).'
        ],
        tips: [
          {
            title: 'Cómo aportar sin incomodar',
            bullets: [
              'Si querés donar, hacelo rápido y sin bloquear el paso. Billetes chicos son útiles.',
              'Si hay una fila o un patrón de movimiento, respetalo (no “te metas” para sacar la foto).',
              'No hace falta “entender todo”: el respeto se ve en el cuerpo (tono bajo, pasos suaves).'
            ]
          }
        ]
      },
      {
        id: 'vida-monastica',
        title: 'Vida monástica y ordenación temporal (lo que te va a llamar la atención)',
        paragraphs: [
          'En Tailandia es común la “ordenación temporal”: muchos hombres pasan un período como monjes (a veces semanas, a veces meses) en algún momento de su vida. Por eso vas a ver monjes de distintas edades, y también novicios (a menudo con túnicas más claras). No pienses “élite religiosa separada”: la vida monástica está socialmente integrada.',
          'Rutina típica que puede cruzarse con tu viaje: por la mañana temprano algunos monjes realizan ronda de limosnas/alimentos (alms). La gente ofrece comida y recibe bendiciones. Dentro del wat, los espacios reflejan esa rutina: áreas de reunión, salas de recitación, patios, y zonas donde se preparan ofrendas.',
          'Detalle práctico: la relación monje-laico tiene reglas de respeto. En general, la gente evita tocar a un monje; las mujeres suelen mantener más distancia física. Si querés hablar con un monje, buscá momentos tranquilos y hacelo con tono bajo (y sin imponer).'
        ],
        bullets: [
          'Ordenación temporal = común; ver monjes jóvenes es normal.',
          'Mañanas = más actividad “real” (ofrendas, rondas).',
          'Respeto corporal: no tocar, no invadir, no interrumpir rituales.'
        ]
      },
      {
        id: 'fiestas',
        title: 'Fiestas sagradas: qué puede aparecerte (y cómo se ve desde afuera)',
        paragraphs: [
          'Aunque no coincidas con una gran fecha, los wats se leen mejor si entendés el “tipo” de eventos que concentran gente. Hay celebraciones budistas (procesiones con velas, cantos/recitación, circunvalaciones) y celebraciones culturales que mezclan lo religioso con lo social (por ejemplo, festividades nacionales o de calendario).',
          'Las fiestas budistas suelen implicar movimiento ordenado: gente con velas, caminando en sentido horario alrededor de un chedi/prang; ofrendas; monjes recitando. Como visitante, tu rol es mirar sin romper la coreografía: no cruces por el medio del circuito, no uses flash, no hagas selfies invasivas.',
          'En días de evento, el wat pasa de “atracción” a “centro comunitario”: más familias, más puestos, más ritual. Si te toca, tomalo como una oportunidad de ver el templo funcionando de verdad.'
        ],
        bullets: [
          'Makha Bucha: procesiones con velas, recitación (muy visible en templos grandes).',
          'Visakha Bucha: alta concurrencia, ritual nocturno.',
          'Asalha Bucha / Khao Phansa: inicio del retiro de lluvias (énfasis en disciplina).',
          'Ok Phansa / Kathina: cierre del retiro y ofrendas (túnicas/donaciones).'
        ]
      },
      {
        id: 'arquitectura',
        title: 'Arquitectura y simbolismo de wats: cómo leer el conjunto',
        paragraphs: [
          'Un wat es un conjunto: patios + salas + torres/estupas + umbrales. Para no “ver siempre lo mismo”, entrá con una pregunta: ¿qué conducta promueve este espacio? Un patio abierto ordena caminar lento; una sala con imágenes ordena postura y silencio; una estupa ordena movimiento circular.',
          'Piezas típicas: el ubosot (sala de ordenación; suele ser la más sagrada), el viharn (sala de reunión/adoración, más accesible), el chedi/stupa (reliquias y símbolo, para circunvalar), el prang (torre vertical de influencia jemer, muy presente en Bangkok/Ayutthaya) y galerías con murales o filas de budas.',
          'Símbolos recurrentes que te ayudan a “leer”: naga (serpiente protectora en escaleras), yaksha (guardianes, el umbral), garuda (asociado a autoridad/estado), loto (pureza) y motivos de fuego/nubes en remates. Además, fijate en las posturas del Buda (sentado meditando, tocando la tierra, reclinado, etc.).'
        ],
        tips: [
          {
            title: 'Recorrido en capas (para no agotarte)',
            bullets: [
              'Capa 1 (30–90 s): eje principal (entrada → patio → edificio/torre principal).',
              'Capa 2 (3–5 min): simetría, materialidad (ladrillo/estuco/cerámica/dorado), guardianes.',
              'Capa 3 (10–15 min): murales, detalles de puertas/ventanas, patrones repetidos.',
              'Capa 4 (opcional): “ritual en vivo” (ofrendas, recitación) desde un costado.'
            ]
          }
        ]
      },
      {
        id: 'etiqueta',
        title: 'Etiqueta en templos: por qué existen estas reglas (y cómo aplicarlas)',
        paragraphs: [
          'Las reglas no son capricho: buscan evitar que interrumpas prácticas reales. En un wat, tu cuerpo comunica respeto o ruido. Vestimenta y postura son una forma de no imponer tu presencia sobre un espacio sagrado.',
          'Hombros y rodillas cubiertos: no es “moralismo”, es un código de modestia y respeto para edificios principales (ubosot/viharn). Si vas con calor: remera liviana de manga corta y un pañuelo o camisa fina para cubrir; pantalón liviano o falda larga. Zapatos: se dejan afuera de interiores; mirá si hay filas/estantes.',
          'Pies: en Tailandia los pies son “bajos” simbólicamente. Evitá apuntar las plantas hacia imágenes de Buda o hacia personas. Si te sentás en el piso, la postura segura es con piernas hacia un costado o cruzadas sin mostrar plantas hacia adelante. No señales con los pies.',
          'Cabeza: es “alta” simbólicamente. Evitá tocar la cabeza de otros (incluidos niños). Con monjes, evitá contacto físico; si sos mujer, suele haber más distancia por normas internas. Frente al Buda: postura tranquila, no hagas poses graciosas. Fotos: seguí carteles; evitá flash en interiores y no bloquees a gente rezando.'
        ],
        bullets: [
          'Cubrir hombros/rodillas (especialmente en edificios principales).',
          'Zapatos afuera de interiores; observá y copiá la dinámica local.',
          'No apuntar plantas de los pies hacia el Buda; no señalar con pies.',
          'No tocar cabezas; con monjes, evitar contacto físico.',
          'Fotos: sin flash donde se indique; no interrumpir rituales; voz baja.'
        ]
      },
      {
        id: '10-min',
        title: 'Cómo visitar un wat en 10–20 minutos (sin que sea “uno más”)',
        paragraphs: [
          'Si el día está cargado, la clave es tener un guion. La visita corta no es “apurar”: es mirar con intención.',
          'Paso 1: ubicá el eje principal y la pieza dominante (chedi/prang/ubosot). Paso 2: elegí 3 detalles que vas a buscar sí o sí (guardianes, techo, murales, textura). Paso 3: hacé 1 vuelta de orientación sin fotos. Paso 4: hacé 5–10 fotos clave y salí con una idea clara del lugar.',
          'Truco final: elegí un detalle “táctil” (textura de cerámica, ladrillo, dorado, madera tallada) y un detalle “narrativo” (mural/escena/figura). Eso fija memoria mejor que 50 fotos similares.'
        ],
        bullets: [
          'Primero orientate, después fotografiá.',
          '3 detalles > 30 fotos sin foco.',
          'Respetá el flujo: no cruces circuitos rituales.'
        ]
      }
    ]
  },
  {
    slug: 'cultura',
    title: 'Tailandia e idiosincrasia (cómo se comporta la gente y por qué)',
    description:
      'Claves para moverse sin fricción: sanuk, jai yen, kreng jai, jerarquías, wai, lenguaje corporal, idioma/escritura y prudencia con política/realeza.',
    sections: [
      {
        id: 'sanuk',
        title: 'Sanuk, jai yen, kreng jai: tres palabras que explican medio país',
        paragraphs: [
          'Sanuk (que sea disfrutable/divertido) no es “fiesta permanente”: es la idea de que la vida cotidiana debe tener una cuota de ligereza. En turismo se nota en la amabilidad y en la búsqueda de un clima agradable. Si vos elevás tensión, rompés sanuk.',
          'Jai yen (“corazón fresco”) es autocontrol: mantener calma, no explotar, no apurar con agresividad. En la práctica: si algo sale mal (taxi, check-in, fila), el enojo frontal suele ser contraproducente. La insistencia suave funciona mejor.',
          'Kreng jai es consideración/evitar incomodar al otro: no imponer, no confrontar, no hacer que alguien “pierda la cara”. Esto explica el estilo indirecto: a veces te dicen “tal vez” o sonríen aunque sea un “no”. Como viajero, la lectura correcta es observar señales, no solo palabras.'
        ],
        bullets: [
          'Si necesitás algo: pedilo con tono suave + una salida (“si se puede”).',
          'Evitá el “no, estás equivocado” frontal; reformulá (“capaz entendí mal”).',
          'La sonrisa no siempre significa acuerdo: puede ser cortesía.'
        ]
      },
      {
        id: 'jerarquias',
        title: 'Jerarquías y respeto: edad, roles, monjes y espacios',
        paragraphs: [
          'Tailandia es más jerárquica que Argentina en lo cotidiano. Edad, rol (maestro, monje), posición social y uniformes importan. No significa rigidez; significa que hay un orden implícito de deferencia.',
          'Esto se ve en gestos: ceder paso, hablar más bajo, no señalar, no tocar. También se ve en el espacio: hay sectores “más sagrados” (ubosot), y sectores “más comunes” (patios). Si no estás seguro, copiá lo que hacen los locales.',
          'Pies/cabeza: no es chiste; son categorías simbólicas. Los pies son “bajos”, la cabeza es “alta”. Por eso: no señales con pies, no apoyes pies sobre sillas si estás en un lugar tradicional, y evitá tocar cabezas.'
        ]
      },
      {
        id: 'wai',
        title: 'Wai y lenguaje corporal: saludos sin exagerar',
        paragraphs: [
          'El wai (palmas juntas) no es “obligatorio para turistas”, pero entenderlo ayuda. La regla simple: si alguien te hace wai, podés devolverlo con uno suave. En hoteles/restaurantes, a veces el staff hace wai como protocolo; devolverlo está bien.',
          'No hace falta wai a todo el mundo. Con conductores, cajeros o gente en la calle, una sonrisa y “khop khun” (gracias) suele alcanzar. Con monjes, el wai es más formal (pero evitá contacto físico).',
          'Cuerpo: evitá gestos expansivos, el dedo acusador, o invadir el espacio personal. El “modo amable” tailandés es más contenido.'
        ],
        bullets: [
          'Si recibís wai, devolvé uno suave.',
          'En la calle: sonrisa + gracias funciona mejor que teatralizar.',
          'Evitá señalar con el dedo; usá la mano abierta.'
        ]
      },
      {
        id: 'idioma',
        title: 'Idioma y escritura: lo mínimo útil (sin volverse loco)',
        paragraphs: [
          'El tailandés es tonal y su escritura no se parece al alfabeto latino. No vas a “leer” todo, pero podés aprender patrones para moverte mejor: reconocer números en precios, distinguir BTS/MRT, y usar romanización con cuidado.',
          'Romanización: el mismo lugar puede aparecer escrito distinto en inglés (por sonido). Por eso, para taxis/Grab conviene usar el pin del mapa o copiar/pegar el nombre en tailandés cuando puedas (Google Maps lo muestra).',
          'Frases que sirven: “khop khun” (gracias), “mai ao” (no quiero), “tao rai?” (¿cuánto?), “hong nam yu tee nai?” (¿dónde está el baño?). Con una sonrisa, alcanza.'
        ],
        bullets: [
          'Usá pin de mapa para evitar confusión de nombres.',
          'Guardá capturas de direcciones en tailandés de tu hotel.',
          'Aprendé números básicos si te divierte; si no, confiá en apps.'
        ]
      },
      {
        id: 'politica',
        title: 'Política y realeza: prudencia viajera',
        paragraphs: [
          'Tailandia tiene una relación muy sensible con la monarquía y con la política. Como turista, la estrategia inteligente es simple: no opinar, no bromear, no discutir en público. Es un tema que no suma y puede traerte problemas innecesarios.',
          'En espacios públicos, tratá imágenes reales/oficiales con respeto (no fotos ridículas, no comentarios fuertes). Si aparece una situación política (protestas, controles), mantené perfil bajo, evitá zonas calientes y seguí indicaciones locales.',
          'Regla práctica: hablá de comida, templos, paisajes, logística. Evitá comparaciones políticas. No es autocensura moral: es gestión de riesgo.'
        ],
        bullets: [
          'No bromas ni opiniones sobre realeza/política en público.',
          'Si hay protesta: alejate; no te quedes “mirando” para filmar.',
          'En temas sensibles, silencio y cambio de tema.'
        ]
      },
      {
        id: 'mercados',
        title: 'Mercados y negociación: cómo regatear sin incomodar',
        paragraphs: [
          'En mercados turísticos el regateo existe, pero es social, no guerra. Si querés negociar: empezá con una sonrisa, pedí “mejor precio” de forma suave y aceptá un no. Si el precio no te sirve, agradecé y andate: muchas veces te llaman con una oferta; si no, no pasa nada.',
          'Evitá humillar (“esto vale nada”), evitá enojarte, evitá discutir. Eso rompe kreng jai y empeora todo. En general, el mejor “regateo” es comprar 2–3 cosas juntas y pedir un descuento pequeño.',
          'Ojo con estafas clásicas de zonas turísticas: tuk-tuk “barato” que te lleva a tiendas, guías insistentes, joyerías. Si alguien te apura, probablemente no te convenga.'
        ],
        bullets: [
          'Regateo suave + sonrisa + salida elegante.',
          'Compras múltiples = mejor descuento que pelear por una sola.',
          'Si te apuran, cortá: “no gracias” y seguí caminando.'
        ]
      }
    ]
  },
  {
    slug: 'consejos',
    title: 'Consejos generales (salud, transporte, dinero)',
    description:
      'Checklist práctico para el viaje: calor e hidratación, mosquitos, estómago, transporte (Grab/BTS/MRT), dinero/ATM/propinas y conectividad.',
    sections: [
      {
        id: 'calor',
        title: 'Calor, hidratación y electrolitos (esto te define el día)',
        paragraphs: [
          'El calor húmedo tailandés no se parece al “calor seco”: transpirás sin darte cuenta y podés quedar drenado rápido. La trampa es pensar que con agua alcanza. En muchos días, lo que te falta son sales/electrolitos.',
          'Regla práctica: empezá el día con agua + electrolitos si vas a caminar fuerte. Si sentís dolor de cabeza, cansancio raro o calambres, no lo trates como “falta de voluntad”: probablemente sea hidratación.',
          'En 7-Eleven vas a encontrar sobres/polvos de electrolitos (por ejemplo Neo-Lyte) y bebidas listas. Comprá una botella grande de agua y “armá” la hidratación antes de salir.'
        ],
        bullets: [
          'Agua + electrolitos (no solo agua) en días de caminata.',
          'Sombrero + protector + sombra real (paradas) para sostener ritmo.',
          'Aire acondicionado fuerte: llevá una capa fina para BTS/MRT y malls.'
        ]
      },
      {
        id: 'mosquitos',
        title: 'Mosquitos y salud básica: evitar el “viaje arruinado”',
        paragraphs: [
          'En gran parte de Tailandia hay mosquitos; el riesgo más citado por viajeros es dengue. Sin entrar en paranoia: repelente, re-aplicación y horarios son la diferencia entre “unas picaduras” y pasarla mal.',
          'El repelente local típico de 7-Eleven es Soffell (spray/loción). No es magia: funciona si lo usás bien (cobertura + re-aplicación). En selva/trekking, conviene algo con DEET más alto; en ciudad/playa suele alcanzar lo estándar.',
          'Tip: repelente primero, protector solar después (dejá unos minutos entre capas). Y si te pican: no te rasques, hidratá la piel, y usá calmantes locales si te hace falta.'
        ],
        bullets: [
          'Repelente + re-aplicación (sobre todo al atardecer/noche).',
          'Ropa liviana que cubra en zonas con mosquitos fuertes.',
          'Si hay fiebre fuerte: descansá y consultá; no lo tapes “con cafeína”.'
        ]
      },
      {
        id: 'estomago',
        title: 'Comida, picante y estómago (cómo comer rico sin sufrir)',
        paragraphs: [
          'Comer en Tailandia es parte del viaje. La clave no es evitar street food, sino elegir bien: lugares con rotación de gente, comida recién hecha, higiene razonable. El riesgo típico del viajero no es “comida callejera” per se, sino agua/hielo dudoso en lugares raros o comidas que llevan horas expuestas.',
          'Picante: si no estás entrenado, pedí “little spicy” (o directamente “no spicy”) y probá. Muchas veces el picante viene aparte en condimentos. Tené un plan de rescate: yogurt, leche, bebidas, o simplemente parar.',
          'Para acidez/empacho: en 7-Eleven y farmacias hay antiácidos (Gaviscon) y remedios locales. Si tenés algo que ya te funciona (tipo sales de rehidratación), guardalo como “kit”.'
        ],
        bullets: [
          'Elegí lugares con rotación y comida al momento.',
          'Picante: mejor subir de a poco que “morir” el primer día.',
          'Tené un plan (antiácido + electrolitos) para recuperarte rápido.'
        ]
      },
      {
        id: 'transporte',
        title: 'Transporte: Grab, taxis, BTS/MRT (y cómo evitar fricciones)',
        paragraphs: [
          'En Bangkok, Grab es la herramienta más simple para moverse sin negociar: precio estimado, ruta y pago. Cuando funcione, usalo. En taxis tradicionales, pedí “meter” (taxímetro). Si el conductor no quiere, bajate sin discutir y tomá otro: es normal.',
          'BTS/MRT: son excelentes para evitar tráfico. Aprendé 2 cosas y ya está: cómo entrar/salir (tarjeta/QR) y cómo combinar con caminatas cortas. En horas pico, es apretado; guardá paciencia.',
          'Tuk-tuk: para una experiencia puntual, no como transporte base. Si el precio suena demasiado bueno, probablemente te quieran llevar a paradas “obligatorias” (tiendas).'
        ],
        bullets: [
          'Grab cuando puedas (menos fricción).',
          'Taxi: “meter” o bajarte sin pelear.',
          'BTS/MRT = aliado anti-tráfico; evitá horas pico si podés.'
        ]
      },
      {
        id: 'dinero',
        title: 'Dinero: ATM, efectivo, propinas (lo que realmente pasa)',
        paragraphs: [
          'Tailandia sigue siendo muy de efectivo para cosas chicas, pero también hay pagos digitales. Para turistas: vas a usar ATM + efectivo + tarjeta en hoteles/restaurantes grandes. Importante: muchos ATM cobran fee por extracción; asumilo como costo operativo y sacá montos más grandes para reducir frecuencia.',
          'Cambio: en zonas turísticas hay casas de cambio; compará tasas si te interesa optimizar. Para el día a día, no te obsesiones: la energía vale más que el micro-ahorro.',
          'Propinas: no es un país de propina “obligatoria” como en EEUU. En restaurantes puede haber service charge. Si querés dejar, que sea pequeño y natural (redondeo).'
        ],
        bullets: [
          'ATM fee: mejor menos extracciones y más monto.',
          'Efectivo para calle/mercados; tarjeta para grandes.',
          'Propina = opcional; chequeá service charge.'
        ]
      },
      {
        id: 'sim',
        title: 'SIM y conectividad: cómo no perder tiempo',
        paragraphs: [
          'Conectividad te ahorra discusiones: mapas, Grab, traducción y reservas. Podés usar eSIM o SIM física. En aeropuertos suele haber stands, pero también podés resolver en ciudad (malls, tiendas) y muchas veces en 7-Eleven podés comprar SIM/recargas según operador.',
          'Consejo: guardá offline (capturas) la dirección del hotel en tailandés, y ubicaciones críticas (primer alojamiento, puntos de encuentro) por si te quedás sin señal o sin batería.',
          'Batería: powerbank chico + cable corto te salva. El calor también acelera consumo.'
        ],
        bullets: [
          'eSIM/SIM: resolvelo temprano, te simplifica todo.',
          'Guardá direcciones clave en tailandés + capturas de mapa.',
          'Powerbank = seguro de vida urbano.'
        ]
      }
    ]
  },
  {
    slug: '7-eleven',
    title: '7‑Eleven Survival Guide',
    description:
      'Qué comprar (y para qué) en 7‑Eleven: electrolitos, repelente, estómago, SIM, energía y “salvavidas” cotidianos del viaje.',
    sections: [
      {
        id: 'como-usarlo',
        title: 'Cómo usar 7‑Eleven como base logística',
        paragraphs: [
          'En Tailandia, 7‑Eleven suele ser tu “micro-base”: agua fría, hielo, snacks, remedios básicos, recargas, y a veces SIM. La ventaja real es velocidad: entrás 3 minutos, salís con el problema resuelto y seguís el día.',
          'Tip operativo: comprá una botella grande de agua y repetí. Si vas a caminar templos, entrá a 7‑Eleven antes de exponerte al sol y armá hidratación (agua + electrolitos).',
          'El “ice cup” (vaso de hielo) es común: lo comprás y lo llenás con bebida. Útil para sobrevivir al calor.'
        ],
        bullets: [
          '7‑Eleven = agua, hielo, snacks, “farmacia” básica, recargas.',
          'Parada corta preventiva antes del calor (no cuando ya estás roto).',
          'Comprá agua grande y reponé sin pensar demasiado.'
        ]
      },
      {
        id: 'electrolitos',
        title: 'Electrolitos (Neo‑Lyte y similares): tu anti-calor / anti-hangover',
        paragraphs: [
          'Lo más útil para el viaje no es una bebida “energética”: son electrolitos. En 7‑Eleven hay sobres/polvos como Neo‑Lyte (muy popular) que mezclás con agua. También hay bebidas deportivas listas.',
          'Uso práctico: uno por la mañana si vas a caminar mucho, o después de un día de calor/actividad. Si tu día incluye vuelo + deshidratación, es un buen seguro.',
          'Si sos sensible al azúcar, mirá etiquetas y ajustá. La lógica es sales + reposición, no “tomar dulce por deporte”.'
        ],
        bullets: [
          'Neo‑Lyte (sobres) + agua = hidratación real.',
          'Útil en calor y también después de alcohol/calor.',
          'No esperes a estar mal: prevení.'
        ]
      },
      {
        id: 'mosquitos',
        title: 'Repelente (Soffell) y “kit anti-picaduras”',
        paragraphs: [
          'Soffell (spray/loción) es el repelente clásico que muchos compran en 7‑Eleven. Es barato, fácil y suele ser “suficiente” para ciudad y turismo general. Para zonas de selva o si sos imán de mosquitos, considerá un DEET más alto en farmacia.',
          'Aplicación: cubrí áreas expuestas y re-aplicá. Si transpirás mucho o te mojás, re-aplicación antes. Evitá ojos y mucosas.',
          'Para picaduras: buscá gel/calmante local o after-bite. Si no encontrás, hielo y no rascarse ya ayuda mucho.'
        ],
        bullets: [
          'Soffell es el estándar fácil para turistas.',
          'Re-aplicación > marca perfecta.',
          'After-bite/gel calmante: vale la pena tenerlo.'
        ]
      },
      {
        id: 'estomago',
        title: 'Estómago: Gaviscon + Flying Rabbit (y qué hacer cuando te pega)',
        paragraphs: [
          'Para acidez/ardor: Gaviscon es un clásico y suele aparecer en 7‑Eleven y farmacias. Para malestar digestivo o diarrea leve, muchos viajeros buscan remedios locales; uno muy citado es “Flying Rabbit” (medicina local asociada a malestar estomacal).',
          'Regla práctica: si te pega el estómago, bajá la intensidad del día y rehidratá (electrolitos). El peor error es “seguir como si nada” y deshidratarte.',
          'Si hay fiebre alta, sangre, dolor fuerte o decaimiento serio: tratá el tema en serio y buscá ayuda médica. No lo tapes con cafeína.'
        ],
        bullets: [
          'Gaviscon para acidez/ardor.',
          'Flying Rabbit (remedio local) para malestar digestivo leve.',
          'Hidratación y descanso primero; si es serio, consultá.'
        ]
      },
      {
        id: 'energia',
        title: 'Energía y cafeína: Thai Red Bull (Krating Daeng) y amigos',
        paragraphs: [
          'En Tailandia existe el “Thai Red Bull” (Krating Daeng), distinto al Red Bull europeo en sabor y presentación. También vas a ver otras bebidas energéticas locales. Úsalas como herramienta (jet lag, traslado largo), no como reemplazo de dormir.',
          'Si estás con calor, energía + deshidratación es mala mezcla: primero agua/electrolitos, después cafeína si hace falta.',
          'Tip: en 7‑Eleven también hay buen café frío y tés listos. A veces rinde más que una energética.'
        ],
        bullets: [
          'Krating Daeng = “Thai Red Bull”.',
          'Primero hidratación, después cafeína.',
          'Café/té frío es alternativa más suave.'
        ]
      },
      {
        id: 'comida',
        title: 'Comida rápida sin perder tiempo: toasties, onigiri y el “lava cake”',
        paragraphs: [
          '7‑Eleven en Tailandia es famoso por resolver comida rápida. Los “toasties” (sandwich tostado) son un clásico: elegís y te lo calientan. También hay onigiri, ensaladas, frutas cortadas y snacks.',
          'Postre viral típico: el “lava cake” (brownie/torta con centro líquido) que se calienta. No es gastronomía alta, pero es un mini-ritual viajero: útil para un snack dulce sin pensar demasiado.',
          'Regla práctica: si estás apurado, 7‑Eleven te salva. Si estás explorando, comé local. Usalo como herramienta, no como destino.'
        ],
        bullets: [
          'Toasties + bebida = comida de 5 minutos.',
          'Lava cake caliente = postre fácil (si te tienta).',
          'No reemplaza street food; es soporte logístico.'
        ]
      },
      {
        id: 'sim-recargas',
        title: 'SIM, recargas y “cosas de oficina”',
        paragraphs: [
          'Según zona, 7‑Eleven puede vender SIM o al menos recargas. Si ya tenés SIM, podés pedir “top up” y pagar en caja. Guardá el número/operador y preguntá con paciencia.',
          'También vas a encontrar: adaptadores, cargadores básicos, pañuelos, alcohol en gel, curitas, y un montón de “cosas de oficina” que resuelven detalles (cinta, marcador, etc.).',
          'Usalo para reducir fricción: si te falta algo chico, no busques una tienda especial. 7‑Eleven suele ser suficiente.'
        ],
        bullets: [
          'Top up / recargas: se resuelven en caja.',
          'Cargadores/pañuelos/curitas: soporte básico del viaje.',
          'Menos tiempo buscando = más tiempo viajando.'
        ]
      }
    ]
  }
]

export const DATOS_CHAPTER_BY_SLUG = new Map(DATOS_CHAPTERS.map((c) => [c.slug, c] as const))

function wordLikeTokens(text: string) {
  // letras/números + caracteres acentuados
  return text.match(/[\p{L}\p{N}]+/gu) ?? []
}

export function countWords(text: string): number {
  return wordLikeTokens(text).length
}

export function chapterWordCount(chapter: DatosChapter): number {
  const parts: string[] = [chapter.title, chapter.description]
  for (const s of chapter.sections) {
    parts.push(s.title)
    parts.push(...(s.paragraphs ?? []))
    parts.push(...(s.bullets ?? []))
    for (const t of s.tips ?? []) {
      parts.push(t.title)
      parts.push(...t.bullets)
    }
  }
  return countWords(parts.join(' '))
}

export function estimateReadingMinutes(words: number, wpm = 220): number {
  const min = Math.ceil(words / Math.max(1, wpm))
  return Math.max(1, min)
}
