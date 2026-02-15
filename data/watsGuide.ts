export type WatGuideSectionKey = 'historia' | 'arquitectura' | 'diseno' | 'observar' | 'curiosidades'

export type WatGuide = {
  slug: string
  name: string
  city: string
  mapsQuery?: string
  aka?: string[]
  sections: Record<WatGuideSectionKey, string[]>
}

// Nota de estilo:
// - Cada sección es intencionalmente larga (para lectura offline en avión).
// - “Observar” es una checklist visual (qué mirar sí o sí).
// - “Curiosidades/Detalles” son puntos para fijar memoria y contexto.

export const WATS: WatGuide[] = [
  {
    slug: 'wat-arun',
    name: 'Wat Arun',
    city: 'Bangkok',
    aka: ['Temple of Dawn'],
    sections: {
      historia: [
        'Wat Arun está en la ribera oeste del Chao Phraya y se volvió uno de los íconos visuales de Bangkok por su prang (torre) central. El templo tiene raíces antiguas, pero su imagen “clásica” se consolidó en el período Rattanakosin (cuando Bangkok se convirtió en capital), y el complejo fue creciendo con reformas y embellecimientos sucesivos.',
        'Más que una “postal”, Wat Arun funciona como un marcador de ciudad: desde el río, la torre actúa como faro simbólico. En muchas visitas la sensación es esa: estar ante un templo que dialoga con el agua, los barcos y el skyline. Si lo mirás desde la otra orilla, entendés por qué aparece en tantas fotos.',
        'Para el viajero, la clave histórica no es memorizar reyes y fechas, sino captar la función: un templo ribereño (flujo, comercio, tránsito) con una torre vertical que se ve desde lejos, y que organiza el recorrido hacia arriba con escalones pronunciados.'
      ],
      arquitectura: [
        'El corazón arquitectónico es el prang central (estilo influenciado por el mundo jemer/khmer), rodeado por prangs menores. La composición es vertical: el ojo sube. Eso lo diferencia de otros wats donde manda la horizontalidad del techo del ubosot/viharn.',
        'El exterior está cubierto por mosaicos y piezas de porcelana/cerámica (muchas en forma de “fragmentos” decorativos) que crean textura con luz fuerte. Es un templo que se disfruta en el detalle cercano y también en el plano general desde el río.',
        'Los accesos y escaleras son parte de la arquitectura: empinadas, obligan a moverte lento y con atención. Ese diseño cambia tu conducta de visita: menos “paseo”, más ascenso cuidadoso y pausado.'
      ],
      diseno: [
        'Diseño como experiencia: Wat Arun está hecho para que alternes entre vistas amplias (río y ciudad) y micro-detalles (mosaicos, relieves, figuras). No te apures: si solo buscás la “foto del prang”, te perdés lo mejor.',
        'El contraste funciona por materiales: blanco/dorado, cerámica y sombras duras. A mediodía la luz puede ser brutal; si vas temprano o al atardecer, el relieve se lee mejor.',
        'La “coreografía” típica: acercarte, rodear el prang, mirar guardianes/figuras, subir donde esté permitido, y volver a mirar el conjunto desde una distancia media. Eso te da una visita completa sin agotarte.'
      ],
      observar: [
        'El prang central: textura de mosaicos/porcelana y cómo cambia con la luz.',
        'Prangs menores y simetría: cómo enmarcan al prang principal.',
        'Figuras mitológicas (guardianes, criaturas) integradas al relieve.',
        'Escaleras empinadas: mirá cómo “disciplinan” el movimiento del visitante.',
        'Vistas al Chao Phraya: buscá el ángulo donde el río “explica” el templo.',
        'Detalles de cerámica: patrones repetidos, flores y fragmentos, no solo el “macro”.',
        'Si hay recitación/ritual, observá desde el costado (sin cruzar circuitos).'
      ],
      curiosidades: [
        'El apodo “Temple of Dawn” suele confundir: no es “solo para amanecer”. El templo cambia con la luz, pero su potencia visual está todo el día.',
        'La decoración con porcelana/cerámica es parte del carácter: fijate cómo el “brillo” no es uniforme; es una piel irregular que vibra con el sol.',
        'Es un wat donde conviene hacer “dos miradas”: una cerca (texturas) y otra lejos (silueta).'
      ]
    }
  },
  {
    slug: 'wat-pho',
    name: 'Wat Pho',
    city: 'Bangkok',
    aka: ['Temple of the Reclining Buddha'],
    sections: {
      historia: [
        'Wat Pho es uno de los complejos templarios más importantes de Bangkok: enorme, muy visitado y con una vida interna que supera lo turístico. Es famoso por el Buda reclinado, pero en realidad es un “campus” de patios, chedis, salas y detalles.',
        'Se asocia fuertemente a la tradición del masaje tailandés y a la preservación de conocimientos (sobre todo en su rol histórico como centro de enseñanza). Por eso, además de ver arte religioso, vas a ver un templo que también comunica “saber práctico”.',
        'Para visitarlo bien, conviene pensar en capas: 1) el Buda reclinado, 2) los patios/chedis, 3) galerías con filas de budas y detalles de azulejos/cerámica.'
      ],
      arquitectura: [
        'Arquitectónicamente, Wat Pho mezcla escala (espacios amplios) con densidad de detalles (mosaicos, dorados, azulejos). El Buda reclinado está dentro de un edificio alargado, diseñado para contener esa figura monumental y el flujo de gente alrededor.',
        'Los chedis (estupas) y patios internos son un gran “museo al aire libre”: caminás entre estructuras que funcionan como hitos. La repetición de motivos y la simetría ayudan a orientarte.',
        'El conjunto está pensado para ser recorrido: entradas, patios, umbrales, salas. No intentes ver todo de una: elegí un recorrido y sostenelo.'
      ],
      diseno: [
        'Diseño de visita: entrá con un plan para no quedarte solo con el “impacto” del Buda reclinado. Lo mejor de Wat Pho suele aparecer después, cuando bajás el ritmo y empezás a mirar texturas y patrones.',
        'Dentro del edificio del Buda reclinado, la experiencia es “pasillo”: mucha gente, circulación lenta. Aprovechá para observar sin apurar: la escala se entiende mejor cuando la comparás con el flujo humano.',
        'Fuera, en patios, recuperás aire. Ahí es donde el conjunto se vuelve disfrutable: sombras, geometría, y una sensación de “ciudad dentro de la ciudad”.'
      ],
      observar: [
        'Buda reclinado: proporción y serenidad del rostro; no solo “tamaño”.',
        'Plantas de los pies del Buda: decoración y patrones (muy fotografiable).',
        'Patios con chedis: buscá diferentes texturas y colores, no solo el dorado.',
        'Filas de budas en galerías: repetición hipnótica (ideal para fotos con perspectiva).',
        'Puertas/ventanas: tallas y marcos dorados, cómo enmarcan el interior.',
        'Zonas de enseñanza/masaje (si aplica): el templo como espacio de conocimiento.',
        'Señalética de conducta: copiá a locales (zapatos, postura, silencio).'
      ],
      curiosidades: [
        'Wat Pho es “más que el reclinado”: si lo tratás como un único punto, te perdés el 70% del lugar.',
        'La repetición de budas y chedis tiene un efecto psicológico: te baja el ritmo. Eso es parte del diseño del espacio.',
        'Si te sentís saturado por la multitud, salí a patios internos: cambian completamente la experiencia.'
      ]
    }
  },
  {
    slug: 'wat-traitmit',
    name: 'Wat Traimit',
    city: 'Bangkok',
    aka: ['Temple of the Golden Buddha'],
    sections: {
      historia: [
        'Wat Traimit es conocido por el Buda de oro macizo (Golden Buddha). La visita suele ser más directa que en otros complejos: el “punto” principal es esa imagen y la historia de cómo se redescubrió su verdadera naturaleza.',
        'El relato más repetido (y útil para el viajero) es el del “Buda oculto”: durante años se pensó que era una estatua común (cubierta), hasta que un accidente reveló el oro. Independientemente de detalles finos, la idea cultural es potente: valor escondido, revelación, y mito urbano religioso.',
        'Es un templo que conecta bien con la zona de Chinatown: funciona como una parada cultural compacta dentro de un recorrido urbano más amplio.'
      ],
      arquitectura: [
        'La arquitectura del edificio que aloja al Golden Buddha está enfocada en enmarcar la figura: acceso, escalera y sala principal. No es tanto “paisaje de patios” como Wat Pho, sino una experiencia más vertical y focal.',
        'La sala principal tiende a estar más “curada” para visitantes: buena visibilidad del Buda, espacios para circular y observar, y señalética clara.',
        'Como templo urbano, tiene una relación más fuerte con el barrio que con el “gran complejo” monumental: lo ves como parte del tejido de calles y mercados cercanos.'
      ],
      diseno: [
        'Diseño de visita: lo mejor es entrar con calma, mirar la figura desde distintos ángulos, y buscar detalles del acabado (cómo refleja la luz, cómo cambia el dorado según posición).',
        'Evita quedarte con la foto frontal solamente. Un par de fotos laterales y una del contexto (sala, gente) cuentan mejor la escala real.',
        'Si hay información histórica in situ, leé lo mínimo para entender “por qué este Buda es especial”. En 10–20 minutos podés tener una visita completa.'
      ],
      observar: [
        'El Golden Buddha: reflejos y tono del oro (no siempre se ve igual en cámara).',
        'Rostro y postura: serenidad, gesto, proporción.',
        'Cómo la sala enmarca la figura (ángulos, altura, distancia).',
        'Detalles decorativos del altar y ofrendas.',
        'Transición del exterior urbano a interior sagrado (umbral).',
        'Conexión con Chinatown: saliendo, mirá el cambio de atmósfera del barrio.'
      ],
      curiosidades: [
        'La historia del “Buda oculto” funciona como mito moderno: es parte del encanto del lugar.',
        'Por ser una visita más corta, es ideal para encajarla entre recorridos urbanos (mercados/Chinatown).',
        'El dorado en foto puede “quemarse”: bajá exposición o buscá luz más suave.'
      ]
    }
  },
  {
    slug: 'wat-paknam',
    name: 'Wat Paknam',
    city: 'Bangkok',
    aka: ['Wat Paknam Phasi Charoen (MRT)'],
    sections: {
      historia: [
        'Wat Paknam (Phasi Charoen) se volvió muy popular en la última década por su enorme imagen de Buda y por espacios interiores de estética muy contemporánea (en particular, una pagoda con un “techo galaxia”). Es un buen ejemplo de cómo lo tradicional y lo nuevo conviven en el budismo tailandés.',
        'Más allá de la “foto viral”, sigue siendo un wat activo: vas a ver devoción real, ofrendas y movimiento comunitario. El contraste con wats más antiguos (Ayutthaya) ayuda a entender continuidad cultural: no es “ruina”, es religión viva.',
        'Como punto urbano, se visita relativamente fácil si lo combinás con transporte público (de ahí la referencia a MRT en muchos itinerarios).' 
      ],
      arquitectura: [
        'Arquitectura de impacto: la gran estatua de Buda domina el skyline local. La escala está pensada para ser vista desde lejos y para funcionar como punto de orientación.',
        'El complejo incluye una pagoda/estructura vertical donde el interior es parte de la experiencia. No es solo exterior: el recorrido interior (pisos, salas) tiene “momentos” diseñados para sorprender.',
        'La mezcla de superficies (mármol, dorado, pintura) y la iluminación interior lo vuelven un templo “muy fotografiable”, pero también requiere respeto: no bloquear, no usar flash donde no corresponde, y no invadir espacios de oración.'
      ],
      diseno: [
        'Diseño de visita: primero ubicá el Buda grande (foto-contexto), después reservá tiempo para el interior de la pagoda. Es fácil quedarse solo con lo exterior y perder lo más distintivo.',
        'Si vas con mucha gente, el interior puede tener flujo en escaleras/ascensores. Tomalo como “museo religioso” con ritmo: paciencia y desplazamiento suave.',
        'Con luz fuerte, el exterior blanco/dorado se ve muy brillante. El interior, en cambio, suele ser más amable para cámara. Balanceá el tiempo entre ambos.'
      ],
      observar: [
        'Gran imagen de Buda: cómo se ve desde diferentes distancias del complejo.',
        'Pagoda/interior: el techo “galaxia” (si está accesible) y cómo cambia al moverte.',
        'Altares y ofrendas: mezcla de tradición y estética moderna.',
        'Secuencias de salas: cómo el recorrido “te lleva” hacia arriba.',
        'Detalles de iluminación: ambiente interior vs exterior.',
        'Respeto en espacios activos: dónde se reza, dónde se circula.'
      ],
      curiosidades: [
        'Es un wat “moderno” que muestra que el budismo tailandés no está congelado en el pasado.',
        'La estética interior (galaxia) suele disparar reacciones: sirve para hablar de cómo lo sagrado puede ser también “espectacular”.',
        'Buen contraste con wats históricos: mismo código cultural, distinto lenguaje visual.'
      ]
    }
  },
  {
    slug: 'wat-saket',
    name: 'Wat Saket',
    city: 'Bangkok',
    aka: ['Golden Mount'],
    sections: {
      historia: [
        'Wat Saket es famoso por el “Golden Mount” (Phu Khao Thong), una colina/estructura elevada coronada por una estupa dorada. La experiencia es tanto templo como mirador: el ascenso es parte de la visita.',
        'La relevancia histórica para el viajero se lee en su rol urbano: es un punto alto en una ciudad relativamente plana, y por eso ofrece una lectura distinta de Bangkok (no desde rascacielos, sino desde un “alto tradicional”).',
        'Si coincidís con época de festivales, el Golden Mount puede ser un punto de procesión. Aun sin evento, la idea de “subir” para acercarte a lo sagrado está muy presente.'
      ],
      arquitectura: [
        'La arquitectura combina escalera/recorrido con la estupa final. No es un templo que “entras y listo”: es un camino circular ascendente. Ese formato hace que el lugar se sienta más calmado, aunque esté en plena ciudad.',
        'A medida que subís, aparecen campanas, pequeños altares y vistas parciales. La estupa dorada arriba funciona como culminación visual y ritual (muchos dan vueltas alrededor).',
        'La materialidad es más simple que en wats hiper-decorados: el valor está en la experiencia espacial (ascenso + vista) más que en el exceso ornamental.'
      ],
      diseno: [
        'Diseño de visita: tomalo como “caminata corta” con paradas. Subí sin apuro, deteniéndote en campanas, sombra y miradores. Eso te da ritmo y evita que sea solo ejercicio.',
        'Arriba, hacé dos cosas: 1) mirá Bangkok en 360°, 2) rodeá la estupa para ver el flujo ritual. Es un lugar excelente para entender cómo se mezclan turismo y devoción sin conflicto.',
        'Fotografía: la mejor foto suele ser la que combina estupa + ciudad, no solo el dorado aislado.'
      ],
      observar: [
        'Ascenso en espiral: cómo el camino organiza la visita.',
        'Campanas: a veces la gente las toca (observá y copiá lo permitido).',
        'Vistas en subida vs vistas en cima: compará.',
        'Estupa dorada: circunvalación y detalle del dorado.',
        'Contraste: calma del monte vs ruido urbano abajo.',
        'Sombras y árboles: microclima dentro de Bangkok.'
      ],
      curiosidades: [
        'Es uno de los mejores “miradores tradicionales” de Bangkok: distinto a rooftops modernos.',
        'La subida funciona como “transición mental”: del caos urbano a un espacio más quieto.',
        'Si estás cansado de wats muy ornamentados, este ofrece una experiencia más “espacial”.'
      ]
    }
  },
  {
    slug: 'wat-samphran',
    name: 'Wat Samphran',
    city: 'Nakhon Pathom (cerca de Bangkok)',
    aka: ['Templo del Dragón'],
    sections: {
      historia: [
        'Wat Samphran es conocido por su torre cilíndrica rosada con un dragón gigantesco enroscado alrededor. Es un lugar que se siente menos “clásico” y más “surreal” para el visitante: combina imaginería budista con un gesto arquitectónico muy llamativo.',
        'La visita suele ser más “exploración” que ceremonia: la gente va por curiosidad, por fotos, y también por devoción. Es importante entrar con respeto, pero entendiendo que el atractivo principal es el recorrido alrededor/dentro del dragón.',
        'No es un wat central de Bangkok: se suele visitar como excursión. Por eso conviene planificar transporte y horarios.'
      ],
      arquitectura: [
        'El elemento arquitectónico dominante es la torre (forma de cilindro) y el dragón que la envuelve. El dragón no es solo decorativo: crea un recorrido/volumen que invita a moverse y mirar desde distintos puntos.',
        'La escala del dragón es el “shock”: desde lejos parece un juguete gigante; de cerca, se vuelve un túnel/estructura que podés recorrer. Esa mezcla de “monumento” y “juego” es parte del encanto.',
        'Como conjunto, puede incluir otros espacios/estatuas alrededor. La experiencia completa es caminar, mirar, subir/recorrer si está habilitado, y entender la torre como objeto simbólico más que como templo tradicional de patios.'
      ],
      diseno: [
        'Diseño de visita: primero hacé un perímetro exterior para entender el conjunto. Después buscá el acceso al interior del dragón (si está abierto) y recorré con calma: es fácil desorientarse.',
        'Fotografía: funciona bien con fotos que muestren escala (personas cerca) y con planos que capten la espiral del dragón. La torre sola sin referencia puede verse “plana”.',
        'Respeto: aunque sea “instagrammable”, seguí reglas de ropa y comportamiento. No hagas poses burlonas frente a altares o imágenes de Buda.'
      ],
      observar: [
        'Dragón en espiral: textura, colores, y cómo “abraza” la torre.',
        'Punto donde se ve mejor la espiral completa (buscá el ángulo).',
        'Acceso/recorrido interno (si está habilitado): sensación de túnel.',
        'Contraste entre lo lúdico y lo sagrado (altares alrededor).',
        'Detalles de guardianes/figuras secundarias en el predio.',
        'Escala real: foto con referencia humana.'
      ],
      curiosidades: [
        'Es uno de los wats más “raros” visualmente del entorno de Bangkok: perfecto para romper la monotonía de templos tradicionales.',
        'La visita cambia mucho según mantenimiento/apertura del recorrido interno (puede variar).',
        'Funciona mejor si lo tratás como exploración arquitectónica + respeto religioso, no como “parque temático”.'
      ]
    }
  },
  {
    slug: 'wat-chaiwatthanaram',
    name: 'Wat Chaiwatthanaram',
    city: 'Ayutthaya',
    sections: {
      historia: [
        'Wat Chaiwatthanaram es uno de los complejos más fotogénicos de Ayutthaya, con fuerte influencia jemer/khmer en su diseño (prang central y prangs satélite). Al estar en Ayutthaya, se lee en clave de “ciudad histórica” y ruinas: ladrillo, estuco gastado y una atmósfera distinta a Bangkok.',
        'Ayutthaya fue un reino poderoso y un centro de comercio regional; muchos templos son hoy ruinas por guerras, saqueos y el paso del tiempo. En Wat Chaiwatthanaram, esa condición de ruina es parte del valor: ves el esqueleto de un lenguaje monumental antiguo.',
        'Para el visitante, es un lugar para caminar lento y leer siluetas: el templo se entiende por composición, no por dorado brillante.'
      ],
      arquitectura: [
        'El layout es muy simétrico: prang central alto, plataformas elevadas, y prangs menores alrededor. Esa simetría crea una sensación de “mandala” arquitectónico: un centro fuerte con satélites.',
        'Los materiales predominantes son ladrillo y estuco. La ausencia de decoración intacta obliga a mirar volumen, proporción y vacío. Las sombras en ladrillo son claves para que el conjunto “aparezca”.',
        'Recorrerlo es casi recorrer una maqueta a escala real: subidas cortas, plataformas, y perspectivas que se abren y cierran con cada giro.'
      ],
      diseno: [
        'Diseño de visita: caminá primero el perímetro para captar simetría, después entrá al centro y mirá hacia afuera. Ese cambio de punto de vista te muestra por qué el centro manda.',
        'Mejor luz: temprano o tarde. A pleno sol, el ladrillo puede verse plano; con luz lateral, el relieve se vuelve dramático.',
        'Es un lugar ideal para fotos con líneas fuertes y composición simétrica. Si te interesa “foto de postal”, acá es donde se hace.'
      ],
      observar: [
        'Prang central: proporción y verticalidad (influencia jemer).',
        'Prangs menores: repetición y ritmo alrededor del centro.',
        'Textura del ladrillo: grietas, capas, estuco restante.',
        'Plataformas elevadas: cómo cambian la perspectiva.',
        'Composición simétrica: buscá el eje central para foto.',
        'Sombras: el templo “se dibuja” con luz lateral.',
        'Sensación de ruina: silencio, vacío, y escala.'
      ],
      curiosidades: [
        'Es uno de los templos de Ayutthaya donde la influencia jemer se ve más “clara” en la forma del prang.',
        'La ruina no es “falta”: es información visual sobre materialidad y tiempo.',
        'Si venís de Bangkok, acá cambia el modo de mirar: menos brillo, más volumen.'
      ]
    }
  },
  {
    slug: 'wat-mahathat',
    name: 'Wat Mahathat',
    city: 'Ayutthaya',
    sections: {
      historia: [
        'Wat Mahathat es famoso por la cabeza de Buda entre raíces de árbol: una imagen icónica de Ayutthaya. Históricamente fue un templo importante dentro del antiguo reino, y hoy funciona como recordatorio potente de destrucción, recuperación y naturaleza “reclamando” el espacio.',
        'Ayutthaya sufrió saqueos y destrucción en conflictos históricos; muchas estatuas quedaron decapitadas o fragmentadas. En este sitio, la narrativa de ruina es muy directa: fragmentos, cabezas, torsos, y el contraste entre arte y tierra.',
        'Como visitante, es un lugar para caminar con cuidado (mucho suelo irregular) y para sostener un tono respetuoso: la foto famosa existe, pero el sitio es un memorial cultural.'
      ],
      arquitectura: [
        'Wat Mahathat hoy se lee como ruina dispersa: bases de estructuras, fragmentos de chedis/prangs, y restos de muros. La arquitectura “completa” ya no está; lo que queda es un mapa de lo que fue.',
        'Esa condición fragmentaria te obliga a mirar por señales: alineaciones de bases, escalones, restos de estuco y ladrillo. Es casi arqueológico: reconstruís mentalmente la forma.',
        'La zona de la cabeza de Buda en raíces no es “un edificio”, es un punto dentro del predio. El recorrido es el valor: vas encontrando escenas.'
      ],
      diseno: [
        'Diseño de visita: empezá por la cabeza en raíces temprano (se llena), y después recorré el predio como si fuese un “museo sin techo”. Hacé pausas y mirá cómo se repiten bases y fragmentos.',
        'Para fotos, evitá la obviedad: además del clásico encuadre, buscá texturas del ladrillo y fragmentos con sombras. Ayutthaya se fotografía mejor con luz suave.',
        'Respeto: en la foto de la cabeza, bajate a un nivel más bajo que la cabeza (mucha señalética lo pide). No es formalidad: es jerarquía simbólica.'
      ],
      observar: [
        'Cabeza de Buda en raíces: encuadre clásico + un encuadre más amplio para contexto.',
        'Fragmentos de estatuas: evidencia de destrucción y paso del tiempo.',
        'Bases/alineaciones: reconstrucción mental del templo original.',
        'Textura de ladrillo/estuco: capas y desgaste.',
        'Señales de respeto en el sitio (postura, alturas).',
        'Silencio y ritmo: es un sitio para bajar el volumen.'
      ],
      curiosidades: [
        'La famosa cabeza en raíces suele interpretarse como “naturaleza y espiritualidad”. En términos prácticos: es una foto potente, pero el sitio completo cuenta una historia más grande.',
        'La regla de “no estar más alto que el Buda” aparece de forma muy concreta acá.',
        'Si te interesa la sensación de “ruina viva”, Wat Mahathat es el lugar.'
      ]
    }
  },
  {
    slug: 'wat-chedi-luang',
    name: 'Wat Chedi Luang',
    city: 'Chiang Mai',
    sections: {
      historia: [
        'Wat Chedi Luang es uno de los templos más importantes del casco histórico de Chiang Mai. Su gran chedi (estupa) domina el predio y se siente como “ruina controlada”: una estructura antigua parcialmente dañada, pero integrada a un wat activo.',
        'Históricamente, el chedi tuvo un rol central en la ciudad, y su escala refleja poder político y religioso. Para el viajero, lo clave es el contraste: ladrillo antiguo + culto actual + vida urbana suave de Chiang Mai.',
        'Es un gran lugar para entender el estilo del norte: menos “barroco” que Bangkok en algunos detalles, más presencia de madera y una atmósfera más tranquila.'
      ],
      arquitectura: [
        'El chedi gigante, con su base cuadrada y escalonada, es el elemento dominante. Al estar parcialmente erosionado, la textura del ladrillo cuenta historia: ves capas, grietas y proporción monumental.',
        'Además del chedi, el complejo incluye salas de oración y patios. La circulación es simple: el chedi organiza el espacio como un centro de gravedad.',
        'En entradas y escaleras suele haber nagas/guardianes, que marcan el umbral. Es un templo ideal para “leer” símbolos en una escala clara.'
      ],
      diseno: [
        'Diseño de visita: primero rodeá el chedi para captar escala y textura, después entrá a las salas para ver cómo la devoción se organiza alrededor del monumento.',
        'Si estás haciendo muchos templos, este se “recuerda” por volumen: es una masa. Tomá una foto que capture base + altura para fijarlo mentalmente.',
        'Con luz de tarde, el ladrillo se vuelve cálido y la estupa gana profundidad. Si llueve, el color cambia y la textura se marca más.'
      ],
      observar: [
        'Chedi principal: textura de ladrillo, daños, y escala.',
        'Guardianes/nagas en escaleras y umbrales.',
        'Relación norteña: madera, proporciones más “sobrias” que Bangkok.',
        'Patios: cómo circula la gente alrededor del chedi.',
        'Detalles de ofrendas y ritual: sin interrumpir.',
        'Contraste: ruina monumental + templo vivo.'
      ],
      curiosidades: [
        '“Ruina viva” es la frase: no es arqueología aislada, es religión funcionando.',
        'Si venís de Ayutthaya, compará: en Ayutthaya la ruina domina; acá hay integración activa.',
        'Es un buen templo para visitar sin apuro: Chiang Mai invita a ritmo lento.'
      ]
    }
  },
  {
    slug: 'wat-phra-singh',
    name: 'Wat Phra Singh',
    city: 'Chiang Mai',
    sections: {
      historia: [
        'Wat Phra Singh es uno de los templos más venerados de Chiang Mai y del norte de Tailandia. Su importancia se asocia a la presencia de una imagen de Buda muy respetada (Phra Singh) y a su rol cultural en festivales locales.',
        'Para el viajero, es el “templo clásico” del casco antiguo: ordenado, con arte refinado y un ambiente de devoción tranquila. Es un gran lugar para observar etiqueta local sin la presión de multitudes extremas.',
        'Además, es un buen punto para comparar estilos: el norte tiene un lenguaje visual propio, con énfasis en madera, dorados más equilibrados, y murales que cuentan historias.'
      ],
      arquitectura: [
        'El conjunto incluye viharns y estructuras con techos escalonados muy característicos del norte. Los aleros y la multiplicación de capas en el techo son parte del “look” Lanna.',
        'En interiores, los murales y la talla de madera suelen ser protagonistas. La arquitectura no es solo “forma”: es soporte narrativo (murales) y ornamental (tallas).',
        'El patio y la distribución hacen que la visita sea fluida: podés recorrer sin perderte, con puntos claros de interés.'
      ],
      diseno: [
        'Diseño de visita: entrá al viharn principal con tiempo para mirar murales y detalles. Muchos visitantes se apuran; acá vale la pena quedarse 5–10 minutos solo mirando paredes.',
        'El dorado y la madera tienen un equilibrio agradable. Si tu cabeza ya está saturada de brillo, este templo se siente “elegante” más que exuberante.',
        'Fotografía: interiores pueden ser oscuros; evitá flash y priorizá el detalle (talla, mural, columna) en lugar del plano general.'
      ],
      observar: [
        'Techos escalonados estilo Lanna (mirá capas y remates).',
        'Talla de madera: puertas, columnas, frisos.',
        'Murales: escenas, colores, narrativa.',
        'Imagen principal (Phra Singh) y comportamiento de devotos.',
        'Patios y ritmo: ambiente más calmo que templos de Bangkok.',
        'Detalles de dorado: más “sobrio” y refinado.'
      ],
      curiosidades: [
        'Si estás tratando de entender “estilo del norte”, este es uno de los mejores puntos de referencia.',
        'Los murales suelen ser más interesantes cuanto más te acercás: mirá rostros, escenas cotidianas, animales.',
        'Es un templo donde se siente claramente la mezcla de turismo y devoción sin fricción.'
      ]
    }
  },
  {
    slug: 'wat-doi-suthep',
    name: 'Wat Phra That Doi Suthep',
    city: 'Chiang Mai (montaña Doi Suthep)',
    sections: {
      historia: [
        'Wat Phra That Doi Suthep es el templo “de la montaña” de Chiang Mai: un lugar de peregrinación y un punto de vista dominante sobre la ciudad. Su identidad es doble: santuario sagrado + mirador panorámico.',
        'En términos culturales, la subida a Doi Suthep es un ritual local: ir arriba, hacer mérito, ver la ciudad desde arriba. Para el viajero, eso se traduce en una experiencia intensa: altura, escaleras, dorado brillante y multitudes en ciertos horarios.',
        'Es un excelente lugar para entender por qué los templos no son solo edificios: son geografía (montaña), recorrido (subida) y comunidad (peregrinos).' 
      ],
      arquitectura: [
        'El templo se organiza alrededor de una estupa dorada brillante y patios con barandas y elementos ornamentales. El dorado aquí es protagonista: luz fuerte, reflejo y sensación de “sagrado visible”.',
        'El acceso clásico es por la escalera flanqueada por nagas. Esa entrada marca el umbral y prepara el cuerpo: subir, transpirar, entrar. Si preferís, suele haber opciones alternativas (según operación del lugar).',
        'Como templo-mirador, combina interior (ritual) y exterior (vista). La arquitectura está diseñada para que alternes entre mirar hacia el centro sagrado y mirar hacia el horizonte.'
      ],
      diseno: [
        'Diseño de visita: si querés evitar multitudes, apuntá temprano. Llegás con aire fresco, luz más suave y espacio para observar. Si vas al mediodía, asumí calor y más gente.',
        'No te quedes solo con la estupa: mirá detalles del patio, campanas, y el comportamiento de la gente (circunvalación, ofrendas). Eso te da “templo vivo”.',
        'Fotografía: equilibrá dos fotos: (1) estupa con detalle, (2) mirador con ciudad. La visita se recuerda por esa dupla.'
      ],
      observar: [
        'Escalera con nagas: entrada ceremonial.',
        'Estupa dorada: brillo, textura, y flujo de circunvalación.',
        'Campanas y barandas: detalles ornamentales.',
        'Mirador: vista sobre Chiang Mai (mejor con cielo claro).',
        'Rituales: ofrendas y posturas (observá sin interrumpir).',
        'Contraste: montaña fresca vs calor urbano abajo.'
      ],
      curiosidades: [
        'Es un “templo geográfico”: su poder viene tanto de lo sagrado como del lugar donde está.',
        'La escalera es parte de la narrativa: subir “cuesta”, y eso se siente como transición.',
        'Si te toca neblina, la vista baja, pero el templo sigue siendo espectacular por el dorado y la atmósfera.'
      ]
    }
  },
  {
    slug: 'wat-pha-lat',
    name: 'Wat Pha Lat',
    city: 'Chiang Mai (sendero a Doi Suthep)',
    aka: ['Monk’s Trail'],
    sections: {
      historia: [
        'Wat Pha Lat es un wat más “escondido” en el camino a Doi Suthep, conocido por su ambiente tranquilo y su integración con naturaleza (rocas, bosque, agua). Para muchos viajeros es un respiro frente a templos más masivos.',
        'Más que la “gran historia nacional”, acá importa la experiencia local: un templo de retiro/quietud, donde el sonido del agua y la sombra son parte del lugar.',
        'Se suele combinar con caminata por el Monk’s Trail. Eso lo vuelve una visita híbrida: trekking suave + templo.'
      ],
      arquitectura: [
        'La arquitectura se adapta al terreno: escalones entre rocas, pequeñas salas, terrazas y miradores. No es “plano urbano”, es montaña.',
        'Los edificios suelen ser más modestos, pero el encanto está en la composición con la naturaleza. Las estructuras “abrazan” el paisaje en vez de dominarlo.',
        'Hay elementos clásicos (Buda, altares, nagas), pero el protagonista es el entorno: sombra, piedra, humedad, vegetación.'
      ],
      diseno: [
        'Diseño de visita: vení con mentalidad de pausa. Caminá lento, escuchá el agua, mirá cómo los altares están ubicados para que te detengas.',
        'Si venís de varios wats seguidos, este se siente distinto porque no te “grita” con dorado; te invita a bajar revoluciones.',
        'Fotografía: funciona bien con encuadres que mezclen estatuas + vegetación + roca. Es más “zen” y menos “postal dorada”.'
      ],
      observar: [
        'Integración con naturaleza: roca, bosque y templos pequeños.',
        'Zonas con agua/cascada y su efecto de calma.',
        'Altares ubicados en terrazas: pausa visual.',
        'Texturas: piedra húmeda, musgo, madera.',
        'Sendero Monk’s Trail: la caminata como parte de la visita.',
        'Ambiente: silencio y comportamiento más contemplativo.'
      ],
      curiosidades: [
        'Es un templo ideal para “reset”: si el viaje se volvió demasiado intenso, acá volvés a respirar.',
        'Funciona muy bien como previa a Doi Suthep: mismo eje, otra escala.',
        'En días húmedos, la atmósfera es especialmente buena (pero ojo resbalones).' 
      ]
    }
  },
  {
    slug: 'wat-rong-khun',
    name: 'Wat Rong Khun',
    city: 'Chiang Rai',
    aka: ['White Temple'],
    sections: {
      historia: [
        'Wat Rong Khun (White Temple) es un templo contemporáneo creado como proyecto artístico-religioso. No es “antiguo”: es una obra moderna que usa lenguaje budista para hablar de pureza, deseo, sufrimiento y liberación, pero con estética de arte actual.',
        'Para el viajero, la clave es entenderlo como “instalación” con simbolismo. Muchas escenas y elementos son deliberadamente chocantes o pop: no es irreverencia gratuita, es narrativa visual para atraer y hacer pensar.',
        'La visita suele ser muy concurrida. Conviene asumir filas y moverse con paciencia: es un templo-artículo viral, pero sigue siendo un espacio con reglas.'
      ],
      arquitectura: [
        'Arquitectónicamente domina el blanco y el espejo: superficies blancas con incrustaciones reflectantes que brillan al sol. El conjunto está diseñado para que la luz sea protagonista.',
        'El acceso incluye un puente/recorrido simbólico: atravesás “manos” y figuras que representan sufrimiento/deseo, y luego entrás a un espacio de “pureza”. La arquitectura es guion, no solo forma.',
        'El complejo puede incluir edificios secundarios y áreas de exposición. Pensalo como campus artístico: no se reduce a un único salón.'
      ],
      diseno: [
        'Diseño de visita: primero mirá el conjunto desde lejos para que el blanco se entienda como “masa”. Después, acercate a detalles (espejos, relieves) y finalmente hacé el recorrido simbólico (puente).',
        'No intentes “entender todo” en tiempo real: elegí 3–5 símbolos que te llamen y quedate con esos. El templo es demasiado cargado para decodificarlo completo en una pasada.',
        'Fotografía: el blanco puede sobreexponerse. Bajá exposición o buscá sombra/luz suave. Un buen truco es incluir cielo azul o vegetación para que el blanco tenga contraste.'
      ],
      observar: [
        'Blanco + espejo: cómo la luz hace “vibrar” el templo.',
        'Puente simbólico: manos/figuras y el mensaje de “cruzar”.',
        'Detalles en relieve: patrones, criaturas, micro-escenas.',
        'Contraste pop (si lo ves): elementos modernos dentro de narrativa budista.',
        'Composición para foto: líneas del puente hacia la estructura principal.',
        'Comportamiento del público: mucho turismo; mantené respeto.'
      ],
      curiosidades: [
        'Es un templo donde el “shock visual” es parte del propósito: captar atención para comunicar ideas.',
        'La estética blanca suele leerse como pureza/iluminación; los espejos como “verdad que refleja”.',
        'Si te abruma, hacé una pausa lejos del núcleo y volvé: el ojo se satura rápido.'
      ]
    }
  },
  {
    slug: 'wat-rong-suea-ten',
    name: 'Wat Rong Suea Ten',
    city: 'Chiang Rai',
    aka: ['Blue Temple'],
    sections: {
      historia: [
        'Wat Rong Suea Ten (Blue Temple) es relativamente moderno y se hizo famoso por su color azul intenso y su estética contemporánea. Es un buen contraste con el White Temple: dos templos nuevos que usan color y diseño para impactar.',
        'Aunque sea moderno, mantiene códigos devocionales: imágenes de Buda, ritual, ofrendas. Para el viajero, es la prueba de que lo “nuevo” puede ser plenamente religioso.',
        'En itinerarios, suele visitarse junto a Rong Khun. Es recomendable porque el cambio de paleta (blanco vs azul) hace que ambos se recuerden mejor.'
      ],
      arquitectura: [
        'La arquitectura se apoya en el color: azul saturado con detalles dorados. Los marcos, columnas y esculturas están diseñados para que el dorado “salte” sobre el azul.',
        'En interiores, el Buda principal y la iluminación crean una atmósfera distinta: más “teatral” y envolvente. Es un templo donde la experiencia interior pesa mucho.',
        'El conjunto tiene esculturas externas y guardianes; el recorrido es más compacto que Rong Khun, pero muy eficaz visualmente.'
      ],
      diseno: [
        'Diseño de visita: entrá primero al interior para sentir el impacto cromático y la atmósfera. Después recorré el exterior para ver cómo el azul se sostiene con luz natural.',
        'Si el sol está fuerte, el azul puede verse más plano en fotos. En sombra o con cielo nublado, el azul se vuelve profundo y fotogénico.',
        'Hacé foco en contraste: azul/dorado, interior/exterior, macro (sala) y micro (detalles ornamentales).' 
      ],
      observar: [
        'Fachada azul: remates y dorados que recortan.',
        'Interior: Buda principal y sensación de “caverna azul”.',
        'Detalles dorados: marcos, frisos, patrones repetidos.',
        'Guardianes/esculturas externas: lenguaje contemporáneo.',
        'Cómo cambia el azul según luz (sol vs sombra).',
        'Flujo: suele ser visita corta, pero intensa.'
      ],
      curiosidades: [
        'El Blue Temple se siente “moderno” sin dejar de ser sagrado: buena lectura cultural.',
        'Si venís de Rong Khun, el azul te “resetea” la retina después del blanco brillante.',
        'Para foto, probá ajustar exposición: el azul puede perder detalle si la cámara se confunde.'
      ]
    }
  },
  {
    slug: 'wat-chalong',
    name: 'Wat Chalong',
    city: 'Phuket',
    sections: {
      historia: [
        'Wat Chalong es el templo más conocido de Phuket y un punto clave cultural en una isla dominada por playa y turismo. Es una visita que ancla el viaje: te recuerda que Phuket no es solo resort, también es vida religiosa local.',
        'El templo tiene fuerte vínculo con figuras monásticas veneradas localmente. Aunque no tengas el detalle biográfico, lo importante es observar devoción: mucha gente local viene a pedir bendiciones, hacer mérito y participar de rituales.',
        'Para el viajero, funciona como visita de 45–90 minutos que equilibra el itinerario de playa con un momento cultural.'
      ],
      arquitectura: [
        'El complejo incluye edificios principales y una pagoda/chedi alta donde se suele subir por escaleras internas. Arriba suele haber espacios con objetos religiosos y vistas parciales.',
        'La estética mezcla color, dorado y narrativas visuales en paredes/techos. Es un templo donde los interiores pueden tener escenas pintadas y ornamentación intensa.',
        'El predio incluye patios y áreas para ofrendas. Como siempre: seguí la dinámica local para zapatos, posturas y fotos.'
      ],
      diseno: [
        'Diseño de visita: empezá por el edificio principal (si está abierto), luego recorré patios y finalmente subí al chedi si se permite. La subida suele darte una perspectiva distinta del conjunto.',
        'Si venís de playa con ropa liviana, acordate: hombros/rodillas cubiertos para interiores principales. Planificá una capa o sarong.',
        'Wat Chalong es muy bueno para mirar “ritual cotidiano”: velas, incienso, peticiones, donaciones. Eso te da el pulso local.'
      ],
      observar: [
        'Chedi/pagoda: subida interna (si está habilitada) y detalles en cada nivel.',
        'Murales/pinturas interiores: escenas y patrones.',
        'Ofrendas: velas, incienso, papelitos/peticiones (sin invadir).',
        'Techos y remates: dorado y color.',
        'Flujo local: devotos vs turistas, cómo conviven.',
        'Patios: espacios de transición y calma.'
      ],
      curiosidades: [
        'Es el gran “templo de Phuket”: si solo hacés uno en la isla, suele ser este.',
        'La experiencia cambia mucho si llegás temprano (más local) o a media mañana (más turístico).',
        'En clima húmedo, los interiores se sienten más frescos: buen descanso del sol.'
      ]
    }
  }
]

export const WAT_BY_SLUG = new Map(WATS.map((w) => [w.slug, w] as const))
