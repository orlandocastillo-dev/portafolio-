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
  resume: "/resume-orlando-castillo.pdf",
};

export interface Proyecto {
  id: string;
  anios: string;
  nombre: string;
  queEs: string;
  problema: string;
  puntos: string[];
  stack: string[];
  /** Sin enlaces cuando es software privado de un cliente. */
  enVivo?: string;
  codigo?: string;
  /** Dirección que se muestra en la barra de la ventana cuando no hay enlace público. */
  direccion?: string;
  cliente?: string;
  imagen: string;
  movil?: string;
}

export const proyectos: Proyecto[] = [
  {
    id: "produccion",
    anios: "2025 – 2026",
    nombre: "Software de producción",
    cliente: "REG Marketing S.A.S.",
    queEs: "Para un cliente: REG Marketing S.A.S.",
    problema: "Los pedidos se coordinaban a mano entre la oficina y la planta. Ahora cada orden se sigue por etapas desde las tablets, y la empresa lo usa todos los días.",
    puntos: [
      "Cada orden muestra en qué área va (corte, sublimación, confección, despacho…) y el avance se ve al mismo tiempo en la oficina y en la planta.",
      "Versión 2: dos tablets ya no se pisan el avance, editar una orden no borra lo hecho y avisa cuando se va el internet.",
      "Reportes del mes y órdenes en PDF, gráficas de cómo va la producción y filtros para encontrar pedidos.",
    ],
    stack: ["HTML", "CSS", "JavaScript", "Supabase"],
    direccion: "Software interno de la empresa",
    imagen: "/img/produccion.webp",
    movil: "/img/produccion-movil.webp",
  },
  {
    id: "alfabeto",
    anios: "2025 – 2026",
    nombre: "Alfabeto LSC",
    queEs: "Machine learning: lengua de señas con la cámara",
    problema: "Reconocer con la cámara las letras del alfabeto de la Lengua de Señas Colombiana y deletrear palabras, sin que la imagen salga del celular.",
    puntos: [
      "Recogí mis propios datos: una página para grabar cada letra que guarda solo los 21 puntos de la mano, nunca imagen ni video.",
      "Entrené una red neuronal en Python con scikit-learn. Con grabaciones que no vio acierta el 94 %.",
      "El modelo corre en el navegador, con una prueba que revisa que dé lo mismo que en Python.",
      "Las señas siguen el alfabeto oficial del Instituto Caro y Cuervo y el INSOR. Por ahora reconoce las 21 letras que se hacen con la mano quieta.",
    ],
    stack: ["Python", "scikit-learn", "MediaPipe", "React", "TypeScript", "Supabase"],
    enVivo: "https://alfabeto-lsc.vercel.app",
    codigo: "https://github.com/orlandocastillo-dev/alfabeto-lsc",
    imagen: "/img/alfabeto.webp",
    movil: "/img/alfabeto-movil.webp",
  },
  {
    id: "cupo",
    anios: "2026",
    nombre: "Cupo",
    queEs: "Reservas en línea en AWS",
    problema: "Que los clientes de una barbería o un consultorio aparten su hora solos, sin escribir por WhatsApp y sin que dos personas queden en la misma hora.",
    puntos: [
      "Backend sin servidores en AWS: Lambda detrás de API Gateway, DynamoDB con una sola tabla y Cognito para las cuentas de los dueños.",
      "Cero reservas dobles: cada cita aparta sus bloques de 15 minutos en una transacción con escrituras condicionales.",
      "Recordatorio por correo el día antes con EventBridge y SES, y fotos del negocio en S3 detrás de CloudFront.",
      "Toda la infraestructura escrita en código con CDK, con pruebas y despliegue desde GitHub Actions.",
    ],
    stack: ["Next.js", "TypeScript", "AWS Lambda", "DynamoDB", "Cognito", "CDK"],
    enVivo: "https://cupo-projectos5.vercel.app",
    codigo: "https://github.com/orlandocastillo-dev/cupo",
    imagen: "/img/cupo.webp",
    movil: "/img/cupo-movil.webp",
  },
  {
    id: "cuadre",
    anios: "2025 – 2026",
    nombre: "Qadre",
    queEs: "Finanzas personales",
    problema: "Saber cuánta plata te queda para el resto del mes y en qué se te está yendo, con tus propios números.",
    puntos: [
      "Cuentas de usuario con Supabase: cada persona solo puede leer sus datos, protegido en la base con reglas por usuario (RLS).",
      "Bloqueo después de 5 contraseñas equivocadas, cambio de contraseña con la actual y cierre de sesión en todos los dispositivos.",
      "Importa el extracto del banco, sugiere la categoría de cada movimiento y da recomendaciones según tu historial.",
      "También se puede usar sin cuenta, con los datos guardados en el navegador.",
    ],
    stack: ["React 19", "TypeScript", "Redux Toolkit", "RTK Query", "Supabase", "Vitest"],
    enVivo: "https://qadre-app.vercel.app",
    codigo: "https://github.com/orlandocastillo-dev/cuadre",
    imagen: "/img/cuadre.webp",
    movil: "/img/cuadre-movil.webp",
  },
  {
    id: "surtido",
    anios: "2025 – 2026",
    nombre: "Surti2",
    queEs: "Punto de venta para tiendas de barrio",
    problema: "Registrar ventas, llevar el inventario y el cuaderno del fiado desde el celular, aunque se caiga el internet.",
    puntos: [
      "Funciona sin internet: los cambios quedan en cola y se suben solos al volver la señal, sin pisar lo que vendió otro equipo.",
      "El dueño crea a sus vendedores. Cada rol ve y puede hacer cosas distintas, y la base lo hace cumplir.",
      "Escáner de código de barras con la cámara, caja por turnos y reportes de ventas.",
      "Se instala en el celular como una app (PWA).",
    ],
    stack: ["React 19", "TypeScript", "Redux Toolkit", "Supabase", "Edge Functions", "PWA"],
    enVivo: "https://surti2.vercel.app",
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
    nombre: "Página de Surti2",
    texto: "La presentación del producto, hecha sin frameworks: una venta como se ve en la app, el día de la tienda hora por hora y diseño adaptable.",
    stack: ["HTML", "CSS", "JavaScript"],
    enlace: "https://github.com/orlandocastillo-dev/surtido-landing",
    enlaceTexto: "Ver código",
  },
];

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

export const compromiso = [
  {
    titulo: "Responsable con lo que me encargan",
    texto: "Cumplo los tiempos que acuerdo y, si algo no sale bien, lo reviso hasta que quede funcionando.",
  },
  {
    titulo: "Siempre aprendiendo",
    texto: "Cada proyecto me ha llevado a aprender algo nuevo. Me gusta preguntar y entender por qué funcionan las cosas, no solo copiar la solución.",
  },
  {
    titulo: "Cuidadoso con la información",
    texto: "En atención al cliente manejé datos de pacientes y de transferencias de dinero, y trato con la misma discreción los datos en lo que construyo.",
  },
];

/** Los nombres coinciden con los íconos de simple-icons (ver Tecnologias en App.tsx). */
export const tecnologias = [
  { area: "Lenguajes", items: ["JavaScript", "TypeScript", "Python", "HTML", "CSS"] },
  { area: "Frontend", items: ["React", "Redux", "Next.js", "Tailwind CSS", "Vite"] },
  { area: "Datos y servidor", items: ["Supabase", "PostgreSQL", "Node.js", "Zod", "PWA"] },
  { area: "Pruebas y publicación", items: ["Vitest", "Testing Library", "Git", "GitHub", "GitHub Actions", "Vercel"] },
  { area: "Machine learning", items: ["scikit-learn", "MediaPipe", "NumPy"] },
];

export const soporte = ["Windows y redes", "Scripts de PowerShell", "Mesa de ayuda y SLA", "Documentación de procedimientos", "Atención en inglés y español"];

export const educacion = [
  { titulo: "Ingeniería de Sistemas", lugar: "Universidad de la Costa (CUC)", fechas: "2024 – actualidad" },
  { titulo: "Programa de inglés, nivel 6 (finalizado)", lugar: "Universidad del Atlántico", fechas: "" },
  { titulo: "Bachiller con profundización en pedagogía", lugar: "Escuela Normal Superior del Distrito de Barranquilla", fechas: "2023" },
];
