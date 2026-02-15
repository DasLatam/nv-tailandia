export type WatGuide = {
  slug: string
  name: string
  city: string
  aka?: string
  sections: {
    historia: string[]
    arquitectura: string[]
    diseno: string[]
    observar: string[]
    curiosidades: string[]
  }
  mapsQuery?: string
}

export const WATS: WatGuide[] = [
  {
    slug: 'wat-arun',
    name: 'Wat Arun',
    aka: 'Templo del Amanecer',
    city: 'Bangkok (Thonburi)',
    mapsQuery: 'Wat Arun',
    sections: {
      historia: [
        'Wat Arun es uno de los íconos visuales de Bangkok. Su relevancia no es solo estética: el templo quedó asociado a la consolidación del Reino de Siam en la era Thonburi y al traslado posterior del poder a Rattanakosin (la Bangkok histórica).',
        'Para una visita práctica: pensalo como “el gran mirador ritual” del Chao Phraya. En pocos lugares se entiende tan bien la relación entre ciudad, río y vida religiosa cotidiana.'
      ],
      arquitectura: [
        'Su elemento central es un prang (torre tipo jemer) que domina el conjunto. A diferencia de chedis redondeados, el prang es vertical, escalonado, y transmite “ascenso”.',
        'El revestimiento de porcelana y cerámica (muchas piezas reusadas de cargamentos) crea texturas que cambian con la luz. En fotos, se luce tanto de día como al atardecer.'
      ],
      diseno: [
        'La composición es axial: entrada, patio y torre central. Buscá las figuras guardianas, motivos florales y pequeñas incrustaciones que desde lejos se pierden.',
        'Recorrido recomendado: entrada → patios laterales → prang (subida si está habilitada) → borde hacia el río para la vista de la otra orilla.'
      ],
      observar: [
        'Texturas de porcelana y patrones florales en el prang (miralos de cerca).',
        'Guardianes y figuras míticas (yaksha/naga) en accesos y escaleras.',
        'La vista del río (especialmente con luz baja): te ayuda a ubicar Wat Pho/Gran Palacio del otro lado.'
      ],
      curiosidades: [
        'La “magia” de Wat Arun es fotográfica: desde el río se percibe monumental; desde adentro, se percibe artesanal (miles de pequeñas piezas).',
        'Si te interesa la lectura del lugar, es un buen ejemplo de cómo la arquitectura religiosa también funciona como “marca urbana” visible desde lejos.'
      ]
    }
  },
  {
    slug: 'wat-pho',
    name: 'Wat Pho',
    aka: 'Templo del Buda Reclinado',
    city: 'Bangkok',
    mapsQuery: 'Wat Pho',
    sections: {
      historia: [
        'Wat Pho es uno de los complejos monásticos más importantes de Bangkok, asociado al período temprano de Rattanakosin. Es, además, una referencia cultural por la tradición de enseñanza y por ser un punto de “formación” dentro del templo (no solo oración).',
        'Para el viaje: Wat Pho funciona como “la gran clase magistral” de iconografía y diseño budista tailandés. Si querés aprender a leer wats, este es el lugar.'
      ],
      arquitectura: [
        'El complejo es amplio, con múltiples patios, chedis y pabellones. La gran atracción es el Buda Reclinado, alojado en un edificio largo que obliga a un recorrido lineal.',
        'Fijate en los chedis recubiertos y en los techos superpuestos con remates ornamentales. Es un catálogo de formas: columnas, murales, azulejos, dorados.'
      ],
      diseno: [
        'Recorrido recomendado: entrar temprano → Buda Reclinado (antes de que se llene) → patios y chedis → murales y detalles → salida por los laterales para evitar embudos.',
        'Dentro del edificio del Buda Reclinado, el flujo es de “ida”: avanzás mirando, hacés fotos, y salís por el extremo.'
      ],
      observar: [
        'Los pies del Buda Reclinado (iconografía: patrones simbólicos).',
        'Los chedis principales (muchas veces son lo más fotogénico después del Buda).',
        'Murales y detalles de puertas/ventanas: están llenos de micro-símbolos y escenas.'
      ],
      curiosidades: [
        'Wat Pho suele mencionarse por el masaje tradicional tailandés asociado al complejo. Aunque no tomes masaje, entender esa capa cultural te cambia la lectura del lugar.',
        'Buen wat para entrenar “mirada lenta”: en vez de sacar 30 fotos rápidas, elegí 5 detalles y buscá qué significan visualmente.'
      ]
    }
  },
  {
    slug: 'wat-traimit',
    name: 'Wat Traimit',
    aka: 'Buda de Oro',
    city: 'Bangkok (Chinatown)',
    mapsQuery: 'Wat Traimit Bangkok',
    sections: {
      historia: [
        'Wat Traimit es famoso por albergar el Buda de Oro. Su atractivo “de viaje” es claro: una visita relativamente corta con una pieza icónica y una historia fácil de recordar.',
        'Está en zona de Chinatown, así que combina muy bien con paseo gastronómico o con una caminata por mercados.'
      ],
      arquitectura: [
        'El templo como conjunto es más sobrio que otros grandes complejos. El foco está en el edificio que guarda la estatua y en la experiencia de “llegar y verla”.',
        'La arquitectura funciona como contenedor: te guía hacia el momento central.'
      ],
      diseno: [
        'Recorrido recomendado: llegar → subir al edificio principal → ver la estatua con calma (evitar la foto “apretada”) → bajar y recorrer el entorno (Chinatown).',
        'Si vas en hora pico, mentalidad práctica: entrá, mirá, salí. Es un wat para “picos de atención” más que para vagar.'
      ],
      observar: [
        'La estatua (tamaño, brillo, detalles del rostro y manos).',
        'Cómo cambia la percepción según la iluminación del interior.',
        'El contraste del wat con la vida urbana de Chinatown afuera.'
      ],
      curiosidades: [
        'Es un buen ejemplo de cómo una sola pieza puede reorganizar el valor turístico y simbólico de un lugar.',
        'Ideal para una visita “corta pero memorable” en un día cargado.'
      ]
    }
  },
  {
    slug: 'wat-saket',
    name: 'Wat Saket',
    aka: 'Golden Mount',
    city: 'Bangkok',
    mapsQuery: 'Wat Saket Golden Mount',
    sections: {
      historia: [
        'Wat Saket es conocido por el Monte Dorado: una colina artificial con una estupa en la cima. Su valor para el viajero es doble: historia y, sobre todo, perspectiva de la ciudad.',
        'Es un templo para sentir “altura” sin necesidad de rooftop bars.'
      ],
      arquitectura: [
        'El conjunto combina templo + colina con sendero. La estupa dorada en la cima es el punto final del recorrido.',
        'La arquitectura aquí es experiencia: subir en espiral, rodeado de campanas, vegetación y pequeños altares.'
      ],
      diseno: [
        'Recorrido recomendado: subir lento → detenerse en miradores intermedios → cima con vista 360° → bajar por el mismo camino.',
        'Para fotos: mejor luz temprano o al atardecer. Con calor fuerte, es una subida más exigente de lo que parece.'
      ],
      observar: [
        'Campanas (podés hacerlas sonar suavemente donde esté permitido).',
        'La vista panorámica: buscá puntos de referencia para ubicar tu mapa mental de Bangkok.',
        'La estupa y su entorno ritual (ofrendas, flores, velas).' 
      ],
      curiosidades: [
        'Es un wat “de recorrido”: no es solo mirar un edificio; es caminar una secuencia. Ideal para cortar el ritmo de templos planos.',
        'Si venís de visitas largas, este wat te “resetea” con aire y vista.'
      ]
    }
  },
  {
    slug: 'wat-paknam',
    name: 'Wat Paknam Phasi Charoen',
    aka: 'Wat Paknam (zona MRT)',
    city: 'Bangkok (Thonburi)',
    mapsQuery: 'Wat Paknam Phasi Charoen',
    sections: {
      historia: [
        'Wat Paknam es muy visitado por su impresionante estupa moderna y por su estética “contemporánea” dentro del marco budista tradicional.',
        'Para el viaje: es el contraste perfecto frente a los wats históricos del centro.'
      ],
      arquitectura: [
        'La estupa principal es grande, de líneas limpias, y se acompaña de interiores muy fotogénicos (cúpulas, luces, patrones).',
        'La escala está pensada para impactar, pero con un lenguaje más reciente.'
      ],
      diseno: [
        'Recorrido recomendado: ir con batería/cámara lista → entrar a las áreas principales → dedicar tiempo a interiores (mirar hacia arriba) → salir hacia patios para ver la estupa en contexto.',
        'Consejo práctico: al ser popular, intentá ir fuera de las horas pico para evitar multitudes en zonas estrechas.'
      ],
      observar: [
        'Interiores: techos/cúpulas (los mejores ángulos suelen ser verticales).',
        'La estupa desde el exterior (buscá simetrías).',
        'Detalles de color y repetición geométrica (sensación “casi de museo”).'
      ],
      curiosidades: [
        'Muchos viajeros lo “descubren” por redes sociales: si vas con esa expectativa, intentá además registrar el silencio y el uso real del templo.',
        'Es un buen wat para entender cómo el budismo en Tailandia convive con estética moderna.'
      ]
    }
  },
  {
    slug: 'wat-samphran',
    name: 'Wat Samphran',
    aka: 'El Templo del Dragón',
    city: 'Nakhon Pathom (cerca de Bangkok)',
    mapsQuery: 'Wat Samphran dragon temple',
    sections: {
      historia: [
        'Wat Samphran se volvió famoso por su torre cilíndrica envuelta por un dragón. Es una visita “de impacto visual”, distinta al canon clásico de los wats del centro.',
        'Se suele visitar como excursión, combinable con otros puntos fuera de Bangkok.'
      ],
      arquitectura: [
        'La torre (con el dragón) es el elemento dominante. El conjunto incluye patios y esculturas que, en general, apuntan a una experiencia más “parque temático religioso”.',
        'Lo clave es entenderlo como arquitectura simbólica: subir dentro del dragón se siente como un recorrido ritual/físico.'
      ],
      diseno: [
        'Recorrido recomendado: ver la torre desde abajo (foto completa) → acercarte al dragón para detalles → subir si está habilitado → recorrer patios/esculturas.',
        'Práctico: llevá agua y protección solar. La zona puede ser calurosa y con poca sombra.'
      ],
      observar: [
        'La vista completa del dragón rodeando la torre (mejor con gran angular).',
        'Detalles del cuerpo del dragón (escamas, colores) y accesos.',
        'Los patios con esculturas (interpretación libre: algunas son sorprendentes).' 
      ],
      curiosidades: [
        'Es un wat “fuera de lo típico”: ideal para romper la monotonía si ya viste muchos templos clásicos.',
        'En fotos, la escala engaña: es más grande de lo que parece. Reservá tiempo de recorrido.'
      ]
    }
  },
  {
    slug: 'wat-chaiwatthanaram',
    name: 'Wat Chaiwatthanaram',
    city: 'Ayutthaya',
    mapsQuery: 'Wat Chaiwatthanaram Ayutthaya',
    sections: {
      historia: [
        'Wat Chaiwatthanaram es uno de los templos más fotogénicos de Ayutthaya. Representa el poder y el arte del período ayutthayano y es una de las postales del sitio histórico.',
        'Para una visita práctica: este es el templo para “entender Ayutthaya” en una sola imagen: ruina, simetría, ladrillo, y memoria.'
      ],
      arquitectura: [
        'El diseño centralizado con un prang principal y prangs menores alrededor remite a influencias jemer y a la idea de centro cósmico.',
        'La materialidad de ladrillo y estuco (a veces erosionado) hace que la luz lateral sea clave para fotos.'
      ],
      diseno: [
        'Recorrido recomendado: llegar con sol bajo (mañana o tarde) → caminar el perímetro para ver el conjunto → acercarte al centro → recorrer galerías y bases.',
        'En Ayutthaya, el calor pega: planificá agua y sombra; el sitio es abierto.'
      ],
      observar: [
        'La simetría del conjunto (foto frontal + foto en ángulo).',
        'Texturas de ladrillo/estuco y restos de figuras en nichos.',
        'El diálogo con el paisaje (horizonte bajo, cielo grande).' 
      ],
      curiosidades: [
        'En ruinas, “lo que falta” también comunica: prestá atención a vacíos, mutilaciones y restauraciones.',
        'Si solo hacés 2–3 templos en Ayutthaya, este suele ser uno de los imprescindibles.'
      ]
    }
  },
  {
    slug: 'wat-mahathat',
    name: 'Wat Mahathat',
    city: 'Ayutthaya',
    mapsQuery: 'Wat Mahathat Ayutthaya',
    sections: {
      historia: [
        'Wat Mahathat es famoso por la cabeza de Buda entrelazada en raíces. Es un símbolo potente de la historia de Ayutthaya: esplendor, caída y naturaleza reclamando el sitio.',
        'Práctico: es un lugar donde el “momento foto” es fuerte, pero vale la pena caminar más allá del punto conocido.'
      ],
      arquitectura: [
        'Como complejo, incluye bases, chedis y restos de estructuras. La lógica es de ruina arqueológica: recorrés fragmentos y reconstruís mentalmente.',
        'No esperes “interior ornamentado”: el valor está en la estructura y el contexto.'
      ],
      diseno: [
        'Recorrido recomendado: buscar el punto de la cabeza en raíces temprano (menos gente) → dar una vuelta amplia por el complejo → volver si querés re-fotografiar con otra luz.',
        'Norma de etiqueta: la cabeza de Buda se respeta; para fotos, evitar poses que la “superen” en altura de forma irrespetuosa.'
      ],
      observar: [
        'La cabeza de Buda en raíces (con respeto).',
        'Texturas de ladrillo erosionado y bases de chedis.',
        'Perspectivas largas: columnas/ruinas alineadas con el cielo.'
      ],
      curiosidades: [
        'Es un ejemplo perfecto de cómo la iconografía budista puede sobrevivir incluso cuando el edificio cae: el símbolo queda.',
        'Si llevás guía mental: Ayutthaya se “siente” más que se “lee” en placas.'
      ]
    }
  },
  {
    slug: 'wat-chedi-luang',
    name: 'Wat Chedi Luang',
    city: 'Chiang Mai',
    mapsQuery: 'Wat Chedi Luang Chiang Mai',
    sections: {
      historia: [
        'Wat Chedi Luang es uno de los puntos históricos del casco viejo de Chiang Mai. Su enorme chedi (en parte en ruinas) es un recordatorio físico del paso del tiempo y de los cambios de poder en el norte de Tailandia.',
        'Práctico: es un gran “ancla” para recorrer el centro a pie.'
      ],
      arquitectura: [
        'El chedi domina el patio: masivo, escalonado, con una presencia casi “montañosa”. La ruina no lo debilita; lo vuelve más dramático.',
        'El conjunto incluye salas de oración y detalles de naga/guardianes en escaleras.'
      ],
      diseno: [
        'Recorrido recomendado: entrar → bordear el chedi para verlo desde todos los lados → visitar pabellones → salir caminando hacia otros wats cercanos.',
        'Si llueve, el ladrillo oscuro y el cielo bajo lo vuelven especialmente fotogénico.'
      ],
      observar: [
        'Escala del chedi (foto con personas para referencia).',
        'Detalles de escaleras con naga/guardianes.',
        'Contraste entre ruina y espacios activos de culto.'
      ],
      curiosidades: [
        'En Chiang Mai vas a ver un estilo algo distinto al de Bangkok: más madera, más “norte”, y una atmósfera menos imperial.',
        'Ideal para visita al atardecer: baja el calor y sube la sensación de calma.'
      ]
    }
  },
  {
    slug: 'wat-phra-singh',
    name: 'Wat Phra Singh',
    city: 'Chiang Mai',
    mapsQuery: 'Wat Phra Singh Chiang Mai',
    sections: {
      historia: [
        'Wat Phra Singh es un wat central en Chiang Mai, asociado a la identidad cultural del antiguo reino Lanna. Suele considerarse uno de los templos más importantes del casco viejo.',
        'Práctico: si querés ver un wat “representativo” del norte, este es una apuesta segura.'
      ],
      arquitectura: [
        'Vas a notar diferencias con Bangkok: más protagonismo de madera, techos escalonados y un lenguaje visual Lanna.',
        'Los pabellones (viharn) y detalles en dorado/murales son parte de la experiencia.'
      ],
      diseno: [
        'Recorrido recomendado: entrar por acceso principal → recorrer patios → entrar al viharn principal → buscar detalles de techo y murales → salir por laterales para ver el conjunto.',
        'En interior, hablar bajo y moverse lento: es un templo muy activo.'
      ],
      observar: [
        'Techos Lanna (capas y remates).',
        'Murales/dorados y ornamentación en puertas.',
        'Ambiente de culto (monjes, ofrendas, sonido).' 
      ],
      curiosidades: [
        'Es un buen lugar para comparar estilos regionales: Bangkok (Rattanakosin) vs Chiang Mai (Lanna).',
        'Ideal para visita de mañana: luz suave y menos gente.'
      ]
    }
  },
  {
    slug: 'wat-pha-lat',
    name: 'Wat Pha Lat',
    aka: 'Hidden Temple',
    city: 'Chiang Mai (Doi Suthep road)',
    mapsQuery: 'Wat Pha Lat Chiang Mai',
    sections: {
      historia: [
        'Wat Pha Lat se percibe más como “retiro” que como atracción urbana: está en la ladera, con vegetación, agua y espacios pequeños.',
        'Práctico: es el wat para bajar revoluciones. Si tu viaje viene acelerado, este te ordena el día.'
      ],
      arquitectura: [
        'Tiene una mezcla de estructuras discretas, escaleras, terrazas y pequeños altares. No es monumental; es íntimo.',
        'El entorno (rocas, árboles, agua) es parte de la arquitectura.'
      ],
      diseno: [
        'Recorrido recomendado: llegar → caminar sin apuro → seguir el sonido del agua → sentarse 5 minutos en algún banco/sector → continuar hacia miradores/altares.',
        'Calzado: cómodo. Puede haber humedad y escalones.'
      ],
      observar: [
        'Relación templo-naturaleza (es el “tema” del lugar).',
        'Pequeños altares y estatuas escondidas.',
        'Miradores con vista parcial de la ciudad.'
      ],
      curiosidades: [
        'Muchos lo prefieren a Doi Suthep si buscan calma y fotos sin masas.',
        'Buen punto intermedio si hacés ruta hacia Doi Suthep: funciona como pausa.'
      ]
    }
  },
  {
    slug: 'wat-phra-that-doi-suthep',
    name: 'Wat Phra That Doi Suthep',
    city: 'Chiang Mai (montaña)',
    mapsQuery: 'Wat Phra That Doi Suthep',
    sections: {
      historia: [
        'Wat Phra That Doi Suthep es el templo-mirador más famoso de Chiang Mai. Su ubicación en altura lo vuelve un símbolo: peregrinación + vista + santuario.',
        'Práctico: es el wat para “ver Chiang Mai desde arriba” y para sentir la escala espiritual del lugar.'
      ],
      arquitectura: [
        'La estupa dorada y el patio principal condensan el foco. El acceso por escalinata con naga es parte del ritual: subir es “llegar”.',
        'Hay campanas, murales y perímetros que funcionan como circuito.'
      ],
      diseno: [
        'Recorrido recomendado: llegar temprano → subir escaleras (o funicular) → patio principal → rodear la estupa en sentido horario (si se puede) → miradores → salida.',
        'Si vas en hora pico, enfocá: patio principal + mirador. El resto lo podés dejar para una visita más tranquila.'
      ],
      observar: [
        'Escalinata con naga (foto de subida).',
        'La estupa (detalles y reflejos).',
        'La vista: buscá “capas” de ciudad/montaña en el horizonte.'
      ],
      curiosidades: [
        'La altura cambia la percepción: incluso con mucha gente, el lugar se siente “importante”.',
        'Si te interesa el audio ambiente, grabá 20 segundos: campanas + murmullos + viento.'
      ]
    }
  },
  {
    slug: 'wat-rong-khun',
    name: 'Wat Rong Khun',
    aka: 'Templo Blanco',
    city: 'Chiang Rai',
    mapsQuery: 'Wat Rong Khun',
    sections: {
      historia: [
        'Wat Rong Khun es un templo contemporáneo que funciona casi como obra total de arte. Para el viajero es simple: es “el templo más surreal/visual” del norte.',
        'Práctico: andá con mentalidad de museo + templo. Se visita con reglas y con flujo.'
      ],
      arquitectura: [
        'El blanco dominante, los reflejos y los detalles de filigrana crean una estética muy distinta al dorado tradicional.',
        'La composición está pensada para una secuencia: puente/umbral → edificio principal → patios.'
      ],
      diseno: [
        'Recorrido recomendado: llegar temprano (evitar colas) → hacer el recorrido principal sin apuro → después volver a buscar detalles para fotos.',
        'En fotos: cuidado con sobreexposición; el blanco “quema” en mediodía.'
      ],
      observar: [
        'Detalles en blanco (micro-ornamentos).',
        'El puente/entrada como “relato visual” del paso hacia lo sagrado.',
        'Contraste con el cielo: si hay nubes, mejor.'
      ],
      curiosidades: [
        'Es un wat que divide opiniones: algunos lo aman por el arte; otros lo sienten menos “espiritual”. Usalo como experiencia distinta.',
        'Ideal si ya viste muchos templos clásicos: te despierta la atención.'
      ]
    }
  },
  {
    slug: 'wat-rong-suea-ten',
    name: 'Wat Rong Suea Ten',
    aka: 'Templo Azul',
    city: 'Chiang Rai',
    mapsQuery: 'Wat Rong Suea Ten',
    sections: {
      historia: [
        'Wat Rong Suea Ten es el “templo azul” de Chiang Rai, otra experiencia contemporánea con fuerte impacto visual.',
        'Práctico: es un gran complemento del Templo Blanco: mismo día, dos estilos extremos.'
      ],
      arquitectura: [
        'El azul saturado y los dorados crean un interior/exterior muy fotogénico. La arquitectura funciona como escenario para la luz y el color.',
        'El interior suele ser el punto más memorable.'
      ],
      diseno: [
        'Recorrido recomendado: exterior para fotos rápidas → interior con calma (mirar arriba y hacia el altar) → volver al exterior para un segundo ángulo.',
        'Si está lleno, esperá 2 minutos: el flujo se abre y se vuelve más cómodo.'
      ],
      observar: [
        'El azul en columnas y techos (detalle + plano general).',
        'El altar/imagen central y cómo se ilumina.',
        'Esculturas exteriores y guardianes.'
      ],
      curiosidades: [
        'En fotos de móvil, el balance de blancos puede alterar el azul. Probá tocar la pantalla sobre una zona neutra.',
        'Es un wat ideal para “mirada de diseño”: color, contraste, repetición.'
      ]
    }
  },
  {
    slug: 'wat-chalong',
    name: 'Wat Chalong',
    aka: 'Wat Chaiyathararam',
    city: 'Phuket',
    mapsQuery: 'Wat Chalong Phuket',
    sections: {
      historia: [
        'Wat Chalong es el templo más conocido de Phuket. Para el viajero, funciona como ancla cultural entre playa y excursiones.',
        'Práctico: si sentís que Phuket es solo logística de islas, este wat te da contexto local.'
      ],
      arquitectura: [
        'El complejo incluye edificios con ornamentación fuerte y una pagoda/chedi que suele concentrar el interés.',
        'Los interiores suelen tener pinturas y detalles que se aprecian mejor si te tomás 10 minutos sin apuro.'
      ],
      diseno: [
        'Recorrido recomendado: patio principal → pagoda/chedi → interiores con murales → vuelta exterior para fotos completas.',
        'Regla práctica: hombros/rodillas cubiertos, y moverse con respeto (templo muy activo).' 
      ],
      observar: [
        'Detalles de ornamentación (dorados, relieves).',
        'Murales/pinturas en interior (si están accesibles).',
        'La pagoda desde distintos ángulos (simetría).' 
      ],
      curiosidades: [
        'En Phuket, el contraste cultural se siente más: pasar de playa a wat en 20 minutos es parte del encanto.',
        'Buen lugar para comprar amuletos/souvenirs religiosos con respeto (si te interesa).' 
      ]
    }
  }
]

export const WAT_BY_SLUG = new Map(WATS.map((w) => [w.slug, w]))
