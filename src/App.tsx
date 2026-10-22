import { casoReal, educacion, experiencia, habilidades, otros, persona, proyectos, type Proyecto } from "./datos";

const wa = `https://wa.me/${persona.whatsapp}?text=${encodeURIComponent("Hola Orlando, vi tu portafolio y quiero hablar contigo.")}`;
const sinProtocolo = (url: string) => url.replace(/^https?:\/\//, "");

export function App() {
  return (
    <>
      <a className="saltar" href="#contenido">
        Ir al contenido
      </a>
      <header className="barra">
        <div className="marco barra__dentro">
          <a className="barra__nombre" href="#inicio">
            Orlando Castillo
          </a>
          <nav aria-label="Secciones">
            <a href="#proyectos">Proyectos</a>
            <a href="#experiencia">Experiencia</a>
            <a href="#contacto">Contacto</a>
          </nav>
          <a className="boton boton--borde boton--chico" href={persona.hojaDeVida} download>
            Hoja de vida
          </a>
        </div>
      </header>

      <main id="contenido">
        <Portada />
        <section id="proyectos" className="seccion marco" aria-labelledby="t-proyectos">
          <div className="seccion__cabeza">
            <h2 id="t-proyectos">Proyectos</h2>
            <p>Todos están publicados: puedes abrirlos, crear una cuenta y probarlos. El código de cada uno está en GitHub.</p>
          </div>
          <div className="proyectos">
            {proyectos.map((p, i) => (
              <TarjetaProyecto key={p.id} p={p} invertida={i % 2 === 1} />
            ))}
          </div>
          <div className="otros" aria-label="Otros proyectos">
            {otros.map((o) => (
              <article key={o.nombre} className="otro">
                <h3>{o.nombre}</h3>
                <p>{o.texto}</p>
                <ul className="chips" aria-label="Tecnologías">
                  {o.stack.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                <a className="enlace" href={o.enlace} target="_blank" rel="noopener">
                  {o.enlaceTexto}
                </a>
              </article>
            ))}
          </div>
        </section>

        <CasoReal />
        <Experiencia />
        <Habilidades />
        <Contacto />
      </main>

      <footer className="pie marco">
        <p>Orlando Castillo, {persona.ciudad}.</p>
        <p>
          Este sitio también es un proyecto:{" "}
          <a href={`${persona.github}/portafolio-`} target="_blank" rel="noopener">
            ver su código
          </a>
          .
        </p>
      </footer>
    </>
  );
}

function Portada() {
  return (
    <section id="inicio" className="portada">
      <div className="marco portada__dentro">
        <div className="portada__texto">
          <h1>
            <span>Orlando</span> <span>Castillo</span>
          </h1>
          <p className="portada__rol">Desarrollo web y soporte técnico</p>
          <p className="portada__intro">
            Estudio Ingeniería de Sistemas en Barranquilla. Hago aplicaciones web completas, con cuentas de usuario, base de datos, seguridad y pruebas, y las publico para que cualquiera las use. Una de ellas la usa a diario una empresa para manejar su producción.
          </p>
          <div className="portada__acciones">
            <a className="boton" href="#proyectos">
              Ver proyectos
            </a>
            <a className="boton boton--borde" href={wa} target="_blank" rel="noopener">
              Escribirme por WhatsApp
            </a>
          </div>
          <dl className="datos">
            <div>
              <dt>Estudio</dt>
              <dd>Ingeniería de Sistemas, CUC</dd>
            </div>
            <div>
              <dt>Idiomas</dt>
              <dd>Español nativo, inglés B2+</dd>
            </div>
            <div>
              <dt>Publicado</dt>
              <dd>{proyectos.length} apps en vivo</dd>
            </div>
          </dl>
        </div>
        <figure className="portada__foto">
          <img src="/img/orlando.webp" alt="Orlando Castillo" width="640" height="800" fetchPriority="high" />
        </figure>
      </div>
    </section>
  );
}

function TarjetaProyecto({ p, invertida }: { p: Proyecto; invertida: boolean }) {
  return (
    <article className={`proyecto ${invertida ? "proyecto--invertida" : ""}`} aria-labelledby={`p-${p.id}`}>
      <div className="proyecto__vista">
        <a className="ventana" href={p.enVivo} target="_blank" rel="noopener" aria-label={`Abrir ${p.nombre} en vivo`}>
          <span className="ventana__barra" aria-hidden="true">
            <span className="ventana__puntos">
              <i />
              <i />
              <i />
            </span>
            <span className="ventana__url">{sinProtocolo(p.enVivo)}</span>
          </span>
          <img src={p.imagen} alt={`Pantalla de ${p.nombre}`} width="1280" height="800" loading="lazy" />
        </a>
        {p.movil && <img className="celular" src={p.movil} alt={`${p.nombre} en el celular`} width="360" height="720" loading="lazy" />}
      </div>
      <div className="proyecto__texto">
        <p className="proyecto__que">
          {p.queEs}, {p.anios}
        </p>
        <h3 id={`p-${p.id}`}>{p.nombre}</h3>
        <p className="proyecto__problema">{p.problema}</p>
        <ul className="proyecto__puntos">
          {p.puntos.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <ul className="chips" aria-label="Tecnologías">
          {p.stack.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <div className="proyecto__enlaces">
          <a className="boton boton--chico" href={p.enVivo} target="_blank" rel="noopener">
            Probar en vivo
          </a>
          <a className="enlace" href={p.codigo} target="_blank" rel="noopener">
            Ver código en GitHub
          </a>
        </div>
      </div>
    </article>
  );
}

function CasoReal() {
  return (
    <section className="caso" aria-labelledby="t-caso">
      <div className="marco caso__dentro">
        <div>
          <p className="caso__empresa">
            Para un cliente: {casoReal.empresa}, {casoReal.anios}
          </p>
          <h2 id="t-caso">{casoReal.titulo}</h2>
          <p className="caso__intro">{casoReal.intro}</p>
          <ul className="chips chips--claro" aria-label="Tecnologías">
            {casoReal.stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
        <ul className="caso__lista">
          {casoReal.hice.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Experiencia() {
  return (
    <section id="experiencia" className="seccion marco" aria-labelledby="t-exp">
      <div className="seccion__cabeza">
        <h2 id="t-exp">Experiencia</h2>
        <p>Trabajos recientes, del más nuevo al más antiguo.</p>
      </div>
      <ol className="linea">
        {experiencia.map((t) => (
          <li key={t.empresa} className="linea__item">
            <p className="linea__fechas">{t.fechas}</p>
            <div>
              <h3>{t.cargo}</h3>
              <p className="linea__empresa">{t.empresa}</p>
              <ul>
                {t.puntos.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
      <div className="educacion">
        <h3>Educación</h3>
        <ul>
          {educacion.map((e) => (
            <li key={e.titulo}>
              <b>{e.titulo}</b>
              <span>
                {e.lugar}
                {e.fechas && `, ${e.fechas}`}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Habilidades() {
  return (
    <section className="seccion marco" aria-labelledby="t-hab">
      <div className="seccion__cabeza">
        <h2 id="t-hab">Con qué trabajo</h2>
        <p>Lo que he usado en los proyectos de arriba, no una lista de cursos.</p>
      </div>
      <div className="habilidades">
        {habilidades.map((h) => (
          <div key={h.area} className="habilidad">
            <h3>{h.area}</h3>
            <ul>
              {h.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function Contacto() {
  return (
    <section id="contacto" className="contacto" aria-labelledby="t-contacto">
      <div className="marco">
        <h2 id="t-contacto">Hablemos</h2>
        <p className="contacto__intro">Estoy abierto a oportunidades en desarrollo web y soporte técnico. Respondo rápido por cualquiera de estos medios.</p>
        <a className="contacto__correo" href={`mailto:${persona.correo}`}>
          {persona.correo}
        </a>
        <ul className="contacto__otros">
          <li>
            <a href={wa} target="_blank" rel="noopener">
              WhatsApp {persona.telefono}
            </a>
          </li>
          <li>
            <a href={persona.github} target="_blank" rel="noopener">
              GitHub
            </a>
          </li>
          <li>
            <a href={persona.hojaDeVida} download>
              Hoja de vida en PDF
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
