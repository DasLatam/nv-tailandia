import Link from 'next/link'

export default function CulturaPage() {
  return (
    <article className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight">Tailandia y su idiosincrasia (para viajar mejor)</h1>
        <p className="text-zinc-700">
          Este capítulo es “contexto utilizable”. No es un ensayo académico: es una caja de herramientas para entender
          costumbres, etiqueta social, por qué el idioma/escritura se ven como se ven y cómo se siente la historia política
          en el día a día.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/datos"
            className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-800 shadow-sm hover:bg-zinc-100"
          >
            Volver al índice
          </Link>
          <Link
            href="/datos/wats"
            className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-800 shadow-sm hover:bg-zinc-100"
          >
            Ir a Wats
          </Link>
        </div>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">1) La cortesía como tecnología social</h2>
        <p className="text-zinc-700">
          La vida pública tailandesa está muy lubricada por la cortesía. El objetivo no es “ser falso”, sino mantener la
          interacción fluida y evitar la confrontación directa. Esto se nota en el tono de voz, en cómo se pide algo y en
          la paciencia con el error del extranjero.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="text-sm font-semibold">Conceptos que vas a sentir</div>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700">
              <li>
                <b>Guardar la cara</b> (face): no exponer al otro, no empujar a una situación incómoda.
              </li>
              <li>
                <b>Calma</b>: el enojo público suele ser mal visto; se privilegia el autocontrol.
              </li>
              <li>
                <b>Jerarquía suave</b>: respeto por edades, roles y contextos (sin necesidad de “militarlo”).
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="text-sm font-semibold">Reglas prácticas</div>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700">
              <li>Pedí con una sonrisa y un “por favor” simple; evitá el tono imperativo.</li>
              <li>Si algo sale mal, bajá el volumen y repetí despacio. La calma resuelve más que la presión.</li>
              <li>En templos y espacios formales, vestimenta y postura importan más de lo que parece.</li>
            </ul>
          </div>
        </div>
        <p className="text-zinc-700">
          En la práctica: si notás una respuesta ambigua, no lo tomes como “no quieren ayudar”. A veces es una forma de
          evitar un “no” frontal. Replanteá la pregunta con opciones cerradas o pedí que te indiquen un lugar en el mapa.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">2) El wai (saludo) y el lenguaje corporal</h2>
        <p className="text-zinc-700">
          El <b>wai</b> (palmas juntas con leve inclinación) no es un gesto “folklórico”: es una herramienta social. Como
          visitante, no hace falta hacerlo perfecto; con hacerlo con respeto alcanza. Lo importante es evitar gestos que en
          Occidente son neutros, pero allí pueden sentirse invasivos.
        </p>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="text-sm font-semibold">Checklist corporal</div>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700">
            <li><b>Cabeza</b>: se considera una parte “alta”; evitá tocar la cabeza de otros (especialmente niños).</li>
            <li><b>Pies</b>: parte “baja”; evitá señalar con el pie o apuntar plantas a imágenes sagradas.</li>
            <li><b>Contacto</b>: menos abrazos/efusividad con desconocidos; observar el contexto.</li>
            <li><b>Espacio</b>: en filas, mercados y templos, el flujo importa; moverse sin bloquear.</li>
          </ul>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">3) Por qué la escritura tailandesa “se ve así”</h2>
        <p className="text-zinc-700">
          El tailandés usa un sistema de escritura propio. Para el viajero, el punto clave no es aprenderlo, sino entender
          por qué <b>no vas a poder “adivinar”</b> palabras por parecido con el alfabeto latino. En carteles, vas a ver
          frecuentemente tailandés + inglés, pero fuera de zonas turísticas puede predominar solo tailandés.
        </p>
        <p className="text-zinc-700">
          Visualmente, la escritura tiene muchos “ganchos” y marcas porque combina consonantes con marcas vocálicas y tonos.
          El idioma es tonal: el tono cambia el significado. Esa capa tonal no se ve como “acentos” simples; es parte del
          sistema.
        </p>
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
          <div className="text-sm font-semibold">Cómo usar esto en el viaje</div>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700">
            <li>Para moverte, confiá más en <b>mapas y pins</b> que en “leer carteles”.</li>
            <li>Guardá en el teléfono el nombre del lugar en tailandés cuando puedas (hoteles, muelles, estaciones).</li>
            <li>Si pedís taxi/Grab, copiá-pega el destino: reduce fricción.</li>
          </ul>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">4) Historia política y realeza (sin meterse en problemas)</h2>
        <p className="text-zinc-700">
          Tailandia tiene una historia política compleja, con ciclos de reformas, tensiones entre poderes y un rol
          simbólico muy fuerte de la monarquía. Para el viajero, lo más importante es el <b>comportamiento público</b>:
          evitar comentarios fuertes o burlas sobre la realeza y tratar símbolos monárquicos con respeto.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="text-sm font-semibold">Qué vas a notar</div>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700">
              <li>Fotos y referencias a la realeza en espacios públicos.</li>
              <li>Himno/rituales cívicos en ciertos lugares y horarios.</li>
              <li>Respeto formal en templos, edificios y ceremonias.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="text-sm font-semibold">Regla práctica</div>
            <p className="mt-2 text-sm text-zinc-700">
              Si un tema se siente sensible, no lo “debatas”: cambiá de tema, escuchá y agradecé. Tailandia es un país
              seguro para viajar, pero el visitante inteligente no busca fricción cultural.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">5) Comer, mercados y la lógica del día</h2>
        <p className="text-zinc-700">
          La comida es parte de la vida social. Mercados y puestos funcionan como “infraestructura diaria”, no como
          atracciones. Vas a ver horarios muy tempranos para actividad intensa, y picos a la tarde/noche según zona.
        </p>
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
          <div className="text-sm font-semibold">Reglas de oro (prácticas)</div>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700">
            <li>Si un puesto tiene fila de locales, suele ser buena señal.</li>
            <li>Pedí “no spicy / little spicy” si no tolerás picante (y aun así puede picar).</li>
            <li>Hidratación: el clima te drena. Tené agua siempre.</li>
            <li>En templos y museos: snacks discretos fuera; respeto adentro.</li>
          </ul>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">6) Cómo mirar un wat sin agotarte</h2>
        <p className="text-zinc-700">
          Si hacés muchos templos seguidos, se vuelve repetitivo. La clave es cambiar el objetivo de observación:
        </p>
        <ol className="list-decimal space-y-2 pl-6 text-zinc-700">
          <li>
            <b>Día 1:</b> mirar el <b>conjunto</b> (patios, ejes, circulación).
          </li>
          <li>
            <b>Día 2:</b> mirar <b>guardianes y umbrales</b> (yaksha, naga, puertas).
          </li>
          <li>
            <b>Día 3:</b> mirar <b>superficies</b> (azulejos, dorados, porcelana, murales).
          </li>
          <li>
            <b>Día 4:</b> mirar <b>ritual vivo</b> (ofrendas, rezos, caminatas, sonidos).
          </li>
        </ol>
        <p className="text-zinc-700">
          Esta rotación hace que cada visita tenga un propósito. Vas a sentir que “aprendés” en vez de solo “tildar lugares”.
        </p>
      </section>
    </article>
  )
}
