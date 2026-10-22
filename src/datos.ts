// Textos y datos del portafolio

export const persona = {
  nombre: "Orlando Castillo",
  nombreCompleto: "Orlando Efraín Castillo Ariza",
  ciudad: "Barranquilla, Colombia",
  correo: "orlandocastillo0709@gmail.com",
  whatsapp: "573236205415",
  telefono: "+57 323 620 5415",
  github: "https://github.com/orlandocastillo-dev",
  hojaDeVida: "/hoja-de-vida-orlando-castillo.pdf",
};

export interface Proyecto {
  id: string;
  anios: string;
  nombre: string;
  queEs: string;
  problema: string;
  puntos: string[];
  stack: string[];
  enVivo: string;
  codigo: string;
  imagen: string;
  movil?: string;
}

export const proyectos: Proyecto[] = [
  {
    id: "cuadre",
    anios: "2025 – 2026",
    nombre: "Cuadre",
    queEs: "Finanzas personales",
    problema: "Saber cuánta plata te queda para el resto del mes y en qué se te está yendo, con tus propios números.",
    puntos: [
      "Cuentas de usuario con Supabase: cada persona solo puede leer sus datos, protegido en la base con reglas por usuario (RLS).",
      "Bloqueo después de 5 contraseñas equivocadas, cambio de contraseña con la actual y cierre de sesión en todos los dispositivos.",
      "Importa el extracto del banco, sugiere la categoría de cada movimiento y da recomendaciones según tu historial.",
      "También se puede usar sin cuenta, con los datos guardados en el navegador.",
    ],
    stack: ["React 19", "TypeScript", "Redux Toolkit", "RTK Query", "Supabase", "Vitest"],
    enVivo: "https://cuadre-lake.vercel.app",
    codigo: "https://github.com/orlandocastillo-dev/cuadre",
    imagen: "/img/cuadre.webp",
    movil: "/img/cuadre-movil.webp",
  },
  {
    id: "surtido",
    anios: "2025 – 2026",
    nombre: "Surtido",
    queEs: "Punto de venta para tiendas de barrio",
    problema: "Registrar ventas, llevar el inventario y el cuaderno del fiado desde el celular, aunque se caiga el internet.",
    puntos: [
      "Funciona sin internet: los cambios quedan en cola y se suben solos al volver la señal, sin pisar lo que vendió otro equipo.",
      "El dueño crea a sus vendedores. Cada rol ve y puede hacer cosas distintas, y la base lo hace cumplir.",
      "Escáner de código de barras con la cámara, caja por turnos y reportes de ventas.",
      "Se instala en el celular como una app (PWA).",
    ],
    stack: ["React 19", "TypeScript", "Redux Toolkit", "Supabase", "Edge Functions", "PWA"],
    enVivo: "https://surtido-app-tan.vercel.app",
    codigo: "https://github.com/orlandocastillo-dev/surtido-app",
    imagen: "/img/surtido.webp",
    movil: "/img/surtido-movil.webp",
  },
  {
    id: "mesati",
    anios: "2025 – 2026",
    nombre: "MesaTI",
    queEs: "Mesa de ayuda para soporte técnico",
    problema: "Que un empleado reporte una falla y el técnico la resuelva a tiempo, con todo el caso registrado.",
    puntos: [
      "Tickets con roles de empleado y técnico, prioridades y plazo de solución (SLA) según la urgencia.",
      "Sugiere la guía de solución mientras el empleado describe el problema.",
      "Métricas en tiempo real: cumplimiento de SLA, tiempos de respuesta y carga por técnico.",
      "Trae su base de conocimiento: guías paso a paso con scripts de PowerShell.",
    ],
    stack: ["TypeScript", "Vite", "Supabase", "Realtime", "PowerShell", "Vitest"],
    enVivo: "https://mesa-ti-chi.vercel.app",
    codigo: "https://github.com/orlandocastillo-dev/mesa-ti",
    imagen: "/img/mesati.webp",
    movil: "/img/mesati-movil.webp",
  },
  {
    id: "traste",
    anios: "2025 – 2026",
    nombre: "Traste",
    queEs: "Letra y acordes para guitarristas",
    problema: "Pegar el link de YouTube de una canción y tenerla lista para tocar en la iglesia.",
    puntos: [
      "Reconoce la canción desde el link y trae la letra de una API pública.",
      "Pones los acordes tocando la palabra. Detecta la tonalidad, cambia el tono y calcula la cejilla.",
      "Diagramas de acordes y escalas dibujados en SVG, y desplazamiento automático para no soltar la guitarra.",
    ],
    stack: ["React 19", "TypeScript", "Redux Toolkit", "RTK Query", "Tonal", "SVG"],
    enVivo: "https://traste-nine.vercel.app",
    codigo: "https://github.com/orlandocastillo-dev/traste",
    imagen: "/img/traste.webp",
    movil: "/img/traste-movil.webp",
  },
  {
    id: "rodada",
    anios: "2025 – 2026",
    nombre: "Taller Rodada",
    queEs: "Página de un taller de bicicletas",
    problema: "Que el cliente sepa cuánto le cuesta el arreglo y reserve un turno sin tener que llamar.",
    puntos: [
      "Cotizador que calcula precio, tiempo de trabajo y fecha de entrega.",
      "Reserva validada igual en el formulario y en el servidor (Zod), con protección contra bots.",
      "Confirmación por WhatsApp y archivo para agregar la cita al calendario.",
    ],
    stack: ["Next.js", "React 19", "TypeScript", "Tailwind CSS", "Zod"],
    enVivo: "https://taller-rodada.vercel.app",
    codigo: "https://github.com/orlandocastillo-dev/taller-rodada",
    imagen: "/img/rodada.webp",
    movil: "/img/rodada-movil.webp",
  },
];

export const otros = [
  {
    nombre: "diagnostica",
    texto: "Herramienta de terminal que revisa un computador en segundos (CPU, memoria, discos y red) y genera un informe para adjuntar al ticket.",
    stack: ["Node.js", "TypeScript", "GitHub Actions"],
    enlace: "https://github.com/orlandocastillo-dev/diagnostica",
    enlaceTexto: "Ver código",
  },
  {
    nombre: "Guías de soporte IT",
    texto: "Guías paso a paso para fallas comunes en Windows: sin internet, equipo lento, impresora y diadema. Son la base de conocimiento de MesaTI.",
    stack: ["Markdown", "Mermaid", "PowerShell"],
    enlace: "https://github.com/orlandocastillo-dev/guias-soporte-it",
    enlaceTexto: "Ver guías",
  },
  {
    nombre: "Página de Surtido",
    texto: "La presentación del producto, hecha sin frameworks: modo oscuro, animación de una venta y diseño adaptable.",
    stack: ["HTML", "CSS", "JavaScript"],
    enlace: "https://github.com/orlandocastillo-dev/surtido-landing",
    enlaceTexto: "Ver código",
  },
];

export const casoReal = {
  empresa: "REG Marketing S.A.S.",
  titulo: "Software de producción en uso diario",
  anios: "2025 – 2026",
  intro:
    "En REG Marketing los pedidos se coordinaban a mano entre oficina y planta. Hice una aplicación web interna para seguir cada orden por sus etapas de producción, y hoy la usan a diario en las tablets de la planta.",
  hice: [
    "Seguimiento de cada orden por etapa, con el avance visible para oficina y planta al mismo tiempo.",
    "Versión 2: arreglé que dos tablets se pisaran el avance, que editar una orden borrara lo hecho y los avisos cuando se va el internet.",
    "Reportes en PDF de cada orden y del mes, gráficas de cómo va la producción y filtros para encontrar pedidos.",
  ],
  stack: ["HTML", "CSS", "JavaScript", "Supabase"],
};

export interface Trabajo {
  cargo: string;
  empresa: string;
  fechas: string;
  puntos: string[];
}

export const experiencia: Trabajo[] = [
  {
    cargo: "Customer Service Representative",
    empresa: "Sutherland, cuenta Remitly",
    fechas: "Julio 2026 – octubre 2026",
    puntos: [
      "Atención en inglés y español sobre envíos y transferencias internacionales de dinero.",
      "Resolución de incidencias, seguimiento de casos y verificación de identidad según los protocolos de seguridad.",
    ],
  },
  {
    cargo: "Atención al cliente",
    empresa: "Soft G Net, cuenta Centrum Health",
    fechas: "Febrero 2026 – julio 2026",
    puntos: [
      "Llamadas de entrada y salida para resolver inquietudes de pacientes y agendar citas médicas.",
      "Manejo de información confidencial de pacientes.",
    ],
  },
  {
    cargo: "Producción y desarrollo interno",
    empresa: "REG Marketing S.A.S.",
    fechas: "Julio 2025 – enero 2026",
    puntos: [
      "Seguimiento de pedidos y coordinación para cumplir los tiempos de entrega.",
      "Operación de corte láser y sublimación.",
      "Desarrollé la aplicación web interna de producción, que la empresa sigue usando.",
    ],
  },
];

export const habilidades = [
  {
    area: "Desarrollo web",
    items: ["React", "TypeScript", "JavaScript", "Redux Toolkit y RTK Query", "Next.js", "HTML y CSS", "Tailwind CSS", "Diseño adaptable y accesible"],
  },
  {
    area: "Datos y servidor",
    items: ["Supabase (PostgreSQL, Auth, RLS)", "Edge Functions", "Node.js", "APIs REST", "Validación con Zod", "Apps que funcionan sin internet (PWA)"],
  },
  {
    area: "Calidad y entrega",
    items: ["Pruebas con Vitest y Testing Library", "Git y GitHub", "GitHub Actions", "Despliegue en Vercel"],
  },
  {
    area: "Soporte técnico",
    items: ["Windows y redes", "Scripts de PowerShell", "Mesa de ayuda y SLA", "Documentación de procedimientos", "Atención bilingüe"],
  },
];

export const educacion = [
  { titulo: "Ingeniería de Sistemas", lugar: "Universidad de la Costa (CUC)", fechas: "2023 – actualidad" },
  { titulo: "Programa de inglés, nivel 6 (finalizado)", lugar: "Universidad del Atlántico", fechas: "" },
  { titulo: "Bachiller con profundización en pedagogía", lugar: "Escuela Normal Superior del Distrito de Barranquilla", fechas: "2023" },
];
