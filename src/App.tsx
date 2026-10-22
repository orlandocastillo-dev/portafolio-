import { useEffect, useState } from "react";
import {
  siCss, siGit, siGithub, siGithubactions, siHtml5, siJavascript, siNextdotjs, siNodedotjs, siPostgresql, siPwa, siPython,
  siReact, siRedux, siSupabase, siTailwindcss, siTestinglibrary, siTypescript, siVercel, siVite, siVitest, siZod, siScikitlearn, siMediapipe, siNumpy,
  type SimpleIcon,
} from "simple-icons";
import { compromiso, educacion, experiencia, otros, persona, proyectos, soporte, tecnologias, type Proyecto } from "./datos";

const logos: Record<string, SimpleIcon> = {
  JavaScript: siJavascript, TypeScript: siTypescript, Python: siPython, HTML: siHtml5, CSS: siCss,
  React: siReact, Redux: siRedux, "Next.js": siNextdotjs, "Tailwind CSS": siTailwindcss, Vite: siVite,
  Supabase: siSupabase, PostgreSQL: siPostgresql, "Node.js": siNodedotjs, Zod: siZod, PWA: siPwa, "scikit-learn": siScikitlearn, MediaPipe: siMediapipe, NumPy: siNumpy,
  Vitest: siVitest, "Testing Library": siTestinglibrary, Git: siGit, GitHub: siGithub, "GitHub Actions": siGithubactions, Vercel: siVercel,
};

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

      <Puntos />
      <main id="contenido">
        <Portada />
        <Compromiso />
        <section id="proyectos" className="seccion marco" aria-labelledby="t-proyectos">
          <div className="seccion__cabeza">
            <h2 id="t-proyectos">Proyectos</h2>
            <p>El primero lo hice para una empresa y es privado. Los demás están publicados: puedes abrirlos, crear una cuenta y probarlos, y el código de cada uno está en GitHub.</p>
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

const secciones = [
  { id: "inicio", nombre: "Inicio" },
  { id: "compromiso", nombre: "Mi compromiso" },
  { id: "proyectos", nombre: "Proyectos" },
  { id: "experiencia", nombre: "Experiencia" },
  { id: "tecnologias", nombre: "Con qué trabajo" },
  { id: "contacto", nombre: "Contacto" },
];

// Punticos a la derecha para saltar a cada sección
function Puntos() {
  const [actual, setActual] = useState("inicio");
  useEffect(() => {
    const vistas = new Map<string, number>();
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) vistas.set(e.target.id, e.intersectionRatio);
        const mejor = [...vistas.entries()].sort((a, b) => b[1] - a[1])[0];
        if (mejor && mejor[1] > 0) setActual(mejor[0]);
      },
      { threshold: [0, 0.15, 0.3, 0.5, 0.75, 1], rootMargin: "-30% 0px -30% 0px" },
    );
    for (const { id } of secciones) {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    }
    return () => obs.disconnect();
  }, []);

  return (
    <nav className="puntos" aria-label="Ir a una sección">
      <ul>
        {secciones.map((x) => (
          <li key={x.id}>
            <a href={`#${x.id}`} aria-current={actual === x.id ? "true" : undefined}>
              <span className="puntos__nombre">{x.nombre}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
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
            Estudio Ingeniería de Sistemas en Barranquilla y me gusta construir aplicaciones web de principio a fin: lo que ve la persona, la base de datos y la publicación. Busco una oportunidad en desarrollo web o soporte técnico donde pueda seguir aprendiendo y aportar desde el primer día.
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
              <dd>{proyectos.filter((p) => p.enVivo).length} apps en vivo</dd>
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
        {p.enVivo ? (
          <a className="ventana" href={p.enVivo} target="_blank" rel="noopener" aria-label={`Abrir ${p.nombre} en vivo`}>
            <Ventana p={p} />
          </a>
        ) : (
          <div className="ventana">
            <Ventana p={p} />
          </div>
        )}
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
        {p.enVivo && p.codigo ? (
          <div className="proyecto__enlaces">
            <a className="boton boton--chico" href={p.enVivo} target="_blank" rel="noopener">
              Probar en vivo
            </a>
            <a className="enlace" href={p.codigo} target="_blank" rel="noopener">
              Ver código en GitHub
            </a>
          </div>
        ) : (
          <p className="proyecto__privado">Es software interno de la empresa, así que no tiene enlace público. Las capturas usan datos de ejemplo.</p>
        )}
      </div>
    </article>
  );
}

function Ventana({ p }: { p: Proyecto }) {
  return (
    <>
      <span className="ventana__barra" aria-hidden="true">
        <span className="ventana__puntos">
          <i />
          <i />
          <i />
        </span>
        <span className="ventana__url" data-privado={!p.enVivo || undefined}>
          {p.enVivo ? sinProtocolo(p.enVivo) : p.direccion}
        </span>
      </span>
      <img src={p.imagen} alt={`Pantalla de ${p.nombre}`} width="1280" height="800" loading="lazy" />
    </>
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

function Compromiso() {
  return (
    <section id="compromiso" className="compromiso" aria-labelledby="t-compromiso">
      <div className="marco compromiso__dentro">
        <h2 id="t-compromiso">Mi compromiso</h2>
        <ul>
          {compromiso.map((c) => (
            <li key={c.titulo}>
              <h3>{c.titulo}</h3>
              <p>{c.texto}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Habilidades() {
  return (
    <section id="tecnologias" className="seccion marco" aria-labelledby="t-hab">
      <div className="seccion__cabeza">
        <h2 id="t-hab">Con qué trabajo</h2>
        <p>Los lenguajes y herramientas que uso en los proyectos de arriba.</p>
      </div>
      <div className="tecnologias">
        {tecnologias.map((g) => (
          <div key={g.area} className="tecnologias__grupo">
            <h3>{g.area}</h3>
            <ul>
              {g.items.map((nombre) => {
                const logo = logos[nombre];
                return (
                  <li key={nombre} className="tec">
                    {logo && (
                      <svg viewBox="0 0 24 24" aria-hidden="true" style={{ color: `#${logo.hex}` }} data-oscuro={["000000", "181717"].includes(logo.hex) || undefined}>
                        <path d={logo.path} />
                      </svg>
                    )}
                    {nombre}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        <div className="tecnologias__grupo tecnologias__grupo--ancho">
          <h3>Soporte técnico</h3>
          <ul className="tecnologias__texto">
            {soporte.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
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
