import Link from 'next/link'

export default function BudismoPage() {
  return (
    <article className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight">Budismo y Tailandia</h1>
        <p className="text-zinc-700">
          Esta guía no busca “explicar todo el budismo”, sino darte un marco mental para que, cuando entres a un
          <i> wat</i>, entiendas qué está pasando y por qué el lugar se organiza como se organiza. La idea es que puedas
          mirar con intención: reconocer patrones (espacios, símbolos, gestos) y convertir la visita en algo más que una
          secuencia de fotos.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link href="/datos" className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-800 shadow-sm hover:bg-zinc-100">
            Volver al índice
          </Link>
          <Link href="/datos/wats" className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-800 shadow-sm hover:bg-zinc-100">
            Ir a Wats
          </Link>
        </div>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">1) La vida monástica y el “mérito” (bun)</h2>
        <p className="text-zinc-700">
          En Tailandia, el budismo theravada es la tradición dominante, pero convive con prácticas populares
          (creencias en espíritus, altares domésticos, amuletos, rituales locales). No hace falta que lo estudies como una
          religión comparada: para viajar, lo más útil es comprender la lógica del <b>mérito</b> (en tailandés, <i>bun</i>).
          “Hacer mérito” es realizar acciones consideradas valiosas (donar, cuidar, respetar, sostener a la comunidad
          monástica) y, con eso, acumular una especie de capital moral/espiritual.
        </p>
        <p className="text-zinc-700">
          Por eso vas a ver escenas muy cotidianas: familias llevando comida a monjes por la mañana, gente dejando
          pequeñas donaciones en cajas, flores e incienso frente a una imagen de Buda, o personas dando vueltas alrededor
          de una estupa en sentido horario. Es normal que lo religioso se mezcle con lo práctico: un wat es un lugar vivo,
          no un museo.
        </p>
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
          <div className="text-sm font-semibold">Cómo reconocer un acto de mérito</div>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700">
            <li>Personas ofreciendo flores, incienso o velas frente a una imagen de Buda.</li>
            <li>Donaciones en cajas (a veces con QR), o aportes para restauración del wat.</li>
            <li>Alimentación a monjes (especialmente por la mañana).</li>
            <li>Rondas alrededor de una estupa/chedi en sentido horario (circunvalación ritual).</li>
          </ul>
        </div>
        <p className="text-zinc-700">
          <b>Regla práctica</b>: cuando veas un gesto repetido, asumí que no es solo “turismo”, es uso real del espacio. Dejá el paso, bajá la voz y mirá desde un costado.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">2) Filosofía mínima para mirar un wat con sentido</h2>
        <p className="text-zinc-700">
          Si te quedás con tres ideas, que sean estas: <b>impermanencia</b>, <b>no-aferramiento</b> y <b>compasión</b>. Muchos elementos visuales (ruinas, ofrendas, figuras serenas, repetición de patrones) funcionan como recordatorios de esas ideas.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="text-sm font-semibold">Las 3 marcas</div>
            <p className="mt-2 text-sm text-zinc-700">
              Impermanencia, insatisfacción y no-yo. No es teoría abstracta: se ve en la estética de ruina, en la repetición de rituales, y en la idea de “dejar pasar”.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="text-sm font-semibold">Karma (en versión práctica)</div>
            <p className="mt-2 text-sm text-zinc-700">
              Menos “castigo” y más “consecuencia”. Se conecta con mérito: acciones intencionales que dejan huella.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="text-sm font-semibold">Meditación cotidiana</div>
            <p className="mt-2 text-sm text-zinc-700">
              No siempre es silencio absoluto: puede ser recitación, postura, respiración breve. El wat es un lugar donde eso está permitido y normalizado.
            </p>
          </div>
        </div>
        <p className="text-zinc-700">
          Para no perderte: cuando entres a un wat, preguntate “¿qué conducta está promoviendo este espacio?”. Un patio abierto ordena caminar lento; una sala con imágenes ordena postura/respeto; una estupa ordena giro y repetición.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">3) Fiestas sagradas y calendario (lo que puede aparecerte en el viaje)</h2>
        <p className="text-zinc-700">
          Aunque tu itinerario no coincida con una gran fecha, los wats se “leen” mejor si conocés el tipo de eventos que concentran gente. En general, vas a ver más actividad en fines de semana y al atardecer.
        </p>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="text-sm font-semibold">Fiestas budistas (nombres comunes)</div>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700">
            <li><b>Makha Bucha</b>: celebración asociada a enseñanzas y comunidad monástica (procesiones con velas).</li>
            <li><b>Visakha Bucha</b>: conmemoración vinculada a eventos centrales de la vida del Buda (templos llenos, ritual nocturno).</li>
            <li><b>Asalha Bucha</b> y <b>Khao Phansa</b>: inicio del retiro de lluvias (más énfasis en disciplina monástica).</li>
            <li><b>Ok Phansa</b> y <b>Kathina</b>: cierre del retiro y ofrendas de túnicas/donaciones a monjes.</li>
          </ul>
          <p className="mt-2 text-sm text-zinc-700">
            En estas fechas es común ver <b>procesiones</b>, personas con <b>velas</b> y <b>circunvalaciones</b> alrededor de chedis.
          </p>
        </div>
        <p className="text-zinc-700">
          Fiestas más “culturales” como <b>Songkran</b> (año nuevo tailandés) o <b>Loy Krathong</b> mezclan lo religioso con lo social. Si te toca algo así, el wat deja de ser “atracción” y pasa a ser “centro comunitario”.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">4) Arquitectura y simbolismo: cómo leer un wat</h2>
        <p className="text-zinc-700">
          Un wat no es solo un edificio: es un <b>conjunto</b>. La experiencia típica se arma con patios, salas, torres y puntos de ofrenda. Esto te ayuda a orientarte:
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="text-sm font-semibold">Piezas comunes del conjunto</div>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700">
              <li><b>Ubosot</b>: sala de ordenación (suele ser la más “sagrada”).</li>
              <li><b>Viharn</b>: sala de reunión/adoración (más accesible).</li>
              <li><b>Chedi/Stupa</b>: reliquias y símbolo (se recorre alrededor).</li>
              <li><b>Prang</b>: torre vertical de influencia jemer (ascenso/centro).</li>
              <li><b>Salas y claustros</b>: pasillos con imágenes, campanas, murales.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="text-sm font-semibold">Figuras y símbolos frecuentes</div>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700">
              <li><b>Naga</b>: serpiente protectora (barandas, escaleras).</li>
              <li><b>Garuda</b>: ave mítica asociada a realeza/autoridad.</li>
              <li><b>Yaksha</b>: guardianes (protección, “umbral”).</li>
              <li><b>Loto</b>: pureza (motivo repetido).</li>
            </ul>
          </div>
        </div>
        <p className="text-zinc-700">
          Truco de visita: elegí un “eje” (entrada → patio → edificio principal) y después una “capa de detalle” (texturas, murales, guardianes). Sin esa estructura, muchos templos se sienten “iguales”.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">5) Etiqueta (para no cometer errores típicos)</h2>
        <p className="text-zinc-700">
          La etiqueta no es rigidez; es una forma de no interrumpir prácticas reales. Regla simple: si hay gente rezando o un monje en actividad, tu visita se vuelve “observación respetuosa”.
        </p>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="text-sm font-semibold">Checklist práctica</div>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700">
            <li>Ropa: hombros y rodillas cubiertos (especialmente en edificios principales).</li>
            <li>Zapatos: siempre afuera de interiores (mirá si hay estantes o filas).</li>
            <li>Pies: evitá apuntar plantas hacia imágenes de Buda; sentate “de costado” si estás en el piso.</li>
            <li>Fotos: sin flash donde se indique; evitá selfies invasivas en salas pequeñas.</li>
            <li>Interacciones: si querés hablar con un monje, esperá el momento y mantené tono bajo.</li>
          </ul>
        </div>
        <p className="text-zinc-700">
          Consejo final: la mejor forma de “entender” Tailandia no es acumular templos, sino <b>mirar mejor</b> menos lugares. Por eso las fichas de wats de este sitio están orientadas a guiar la mirada.
        </p>
      </section>
    </article>
  )
}
