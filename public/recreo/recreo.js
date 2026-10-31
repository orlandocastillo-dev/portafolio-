// ---------- Utilidades ----------
const $ = (s) => document.querySelector(s);
const guardar = (k, v) => { try { localStorage.setItem("recreo-" + k, String(v)); } catch (e) {} };
const leer = (k, d) => { try { const v = localStorage.getItem("recreo-" + k); return v === null ? d : v; } catch (e) { return d; } };
const azar = (a) => a[Math.floor(Math.random() * a.length)];

// Reloj en la pantalla de la radio
function reloj() {
  const d = new Date();
  $("#lcdReloj").textContent = d.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", hour12: false });
}
reloj(); setInterval(reloj, 15000);

// =====================================================================
// RADIO: todo se sintetiza con Web Audio, no hay archivos de sonido.
// =====================================================================
const NOTAS = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];
const frec = (m) => 440 * Math.pow(2, (m - 69) / 12);

// Acordes en semitonos desde la raíz
const TIPOS = { maj7: [0, 4, 7, 11], m7: [0, 3, 7, 10], "7": [0, 4, 7, 10], m9: [0, 3, 7, 10, 14], maj9: [0, 4, 7, 11, 14], add9: [0, 4, 7, 14], m: [0, 3, 7], "": [0, 4, 7], sus2: [0, 2, 7] };
// Progresiones en grados de la escala mayor: [semitonos desde la tónica, tipo]
const PROGRESIONES = {
  cafe: [
    [[5, "maj7"], [4, "m7"], [2, "m7"], [0, "maj7"]],
    [[2, "m9"], [7, "7"], [0, "maj9"], [9, "m7"]],
    [[9, "m7"], [5, "maj7"], [0, "maj7"], [7, "7"]],
    [[0, "maj7"], [9, "m7"], [2, "m7"], [7, "7"]],
    [[4, "m7"], [9, "m7"], [2, "m9"], [7, "7"]],
  ],
  lluvia: [
    [[9, "m"], [5, ""], [0, ""], [7, ""]],
    [[0, "add9"], [7, ""], [9, "m"], [5, "maj7"]],
    [[5, "maj7"], [7, "sus2"], [9, "m7"], [4, "m7"]],
    [[9, "m7"], [2, "m7"], [7, ""], [0, "maj7"]],
  ],
  noche: [
    [[9, "m"], [5, ""], [0, ""], [7, ""]],
    [[9, "m"], [7, ""], [5, ""], [7, ""]],
    [[2, "m"], [9, "m"], [5, ""], [7, ""]],
    [[9, "m"], [0, ""], [7, ""], [5, ""]],
  ],
  playa: [
    [[0, "maj7"], [2, "m7"], [4, "m7"], [2, "m7"]],
    [[2, "m9"], [7, "7"], [0, "maj7"], [0, "maj7"]],
    [[5, "maj7"], [4, "m7"], [9, "m7"], [2, "m7"]],
    [[0, "maj9"], [5, "maj7"], [2, "m9"], [7, "7"]],
  ],
};
const NOMBRES_A = ["Tarde", "Tinto", "Bus", "Brisa", "Patio", "Siesta", "Ventana", "Lunes", "Malecón", "Neblina", "Domingo", "Azotea", "Callejón", "Hamaca", "Faro"];
const NOMBRES_B = ["lento", "de las tres", "sin afán", "en la 72", "de octubre", "tibio", "a medias", "nocturno", "eterno", "de oficina", "con lluvia", "pendiente", "de regreso", "dormido"];

const EMISORAS = [
  { id: "cafe", nombre: "CAFÉ", fm: "88.1", bpm: [72, 84], swing: 0.16 },
  { id: "lluvia", nombre: "LLUVIA", fm: "91.5", bpm: [60, 70], swing: 0.06 },
  { id: "noche", nombre: "NOCHE", fm: "97.3", bpm: [92, 104], swing: 0 },
  { id: "playa", nombre: "PLAYA", fm: "103.9", bpm: [118, 132], swing: 0.04 },
];

const radio = {
  ctx: null, salida: null, cinta: null, analizador: null, ruidoBuf: null, crujido: null, lluviaFuente: null,
  sonando: false, emisora: 0, cancion: null, paso: 0, proximo: 0, temporizador: null,
};

function iniciarAudio() {
  if (radio.ctx) return;
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  radio.ctx = ctx;
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -18; comp.ratio.value = 3;
  radio.salida = ctx.createGain();
  radio.salida.gain.value = $("#volumen").value / 100 * 0.9;
  // Un filtro pasabajos suave le da sonido de casete
  radio.cinta = ctx.createBiquadFilter();
  radio.cinta.type = "lowpass"; radio.cinta.frequency.value = 9000; radio.cinta.Q.value = 0.4;
  radio.analizador = ctx.createAnalyser();
  radio.analizador.fftSize = 128;
  radio.cinta.connect(comp); comp.connect(radio.salida); radio.salida.connect(radio.analizador); radio.analizador.connect(ctx.destination);
  // Ruido blanco reutilizable para percusión, lluvia y crujido de vinilo
  const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  radio.ruidoBuf = buf;
  // Reverberación hecha con ruido que se apaga
  const largo = ctx.sampleRate * 2.2;
  const imp = ctx.createBuffer(2, largo, ctx.sampleRate);
  for (let c = 0; c < 2; c++) { const x = imp.getChannelData(c); for (let i = 0; i < largo; i++) x[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / largo, 2.6); }
  radio.reverb = ctx.createConvolver(); radio.reverb.buffer = imp;
  radio.envioReverb = ctx.createGain(); radio.envioReverb.gain.value = 0.28;
  radio.envioReverb.connect(radio.reverb); radio.reverb.connect(radio.cinta);
}

function crearCancion() {
  const em = EMISORAS[radio.emisora];
  const prog = azar(PROGRESIONES[em.id]);
  const tonica = 48 + Math.floor(Math.random() * 10); // entre C3 y A3
  const bpm = Math.round(em.bpm[0] + Math.random() * (em.bpm[1] - em.bpm[0]));
  const acordes = prog.map(([g, t]) => ({ raiz: tonica + g, tipo: t, notas: TIPOS[t].map((s) => tonica + g + s) }));
  // Escala pentatónica de la tónica, para que la melodía nunca suene desafinada
  const penta = [0, 2, 4, 7, 9];
  const escala = [];
  for (let o = 0; o < 3; o++) penta.forEach((s) => escala.push(tonica + 12 + o * 12 + s));
  // Patrones de batería de 16 pasos, con variaciones al azar
  const bombo = em.id === "noche" ? [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0]
    : em.id === "playa" ? [1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1]
    : azar([[1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0], [1,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0], [1,0,0,1,0,0,0,0,0,0,1,0,0,1,0,0]]);
  const redo = em.id === "playa" ? [0,0,1,0,0,1,0,0,0,0,1,0,0,1,0,0] : [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0];
  const platillo = Array.from({ length: 16 }, (_, i) => (i % 2 === 0 ? 1 : Math.random() < 0.45 ? 0.5 : 0));
  // Motivo melódico que se repite con pequeñas variaciones, como en una canción de verdad
  const motivo = Array.from({ length: 16 }, () => (Math.random() < (em.id === "lluvia" ? 0.3 : 0.38) ? Math.floor(Math.random() * escala.length) : -1));
  const nombre = `${azar(NOMBRES_A)} ${azar(NOMBRES_B)}`.toUpperCase();
  return { em, acordes, tonica, bpm, escala, bombo, redo, platillo, motivo, nombre, compas: 0 };
}

function nombreAcorde(a) {
  return NOTAS[a.raiz % 12] + (a.tipo === "m" ? "m" : a.tipo);
}

// ----- Instrumentos -----
function envolvente(g, t, ataque, cae, nivel) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(nivel, t + ataque);
  g.gain.exponentialRampToValueAtTime(0.0001, t + ataque + cae);
}

function piano(m, t, dur, vol, destino) {
  // Piano eléctrico: seno con un poco de triángulo una octava arriba y trémolo
  const ctx = radio.ctx;
  const g = ctx.createGain();
  const o1 = ctx.createOscillator(); o1.type = "sine"; o1.frequency.value = frec(m);
  const o2 = ctx.createOscillator(); o2.type = "triangle"; o2.frequency.value = frec(m) * 2; o2.detune.value = 4;
  const g2 = ctx.createGain(); g2.gain.value = 0.18;
  const trem = ctx.createOscillator(); trem.frequency.value = 4.5;
  const tremG = ctx.createGain(); tremG.gain.value = vol * 0.18;
  trem.connect(tremG); tremG.connect(g.gain);
  o1.connect(g); o2.connect(g2); g2.connect(g);
  g.connect(destino || radio.cinta); g.connect(radio.envioReverb);
  envolvente(g, t, 0.012, dur, vol);
  [o1, o2, trem].forEach((o) => { o.start(t); o.stop(t + dur + 0.1); });
}

function pad(m, t, dur, vol, tipo) {
  const ctx = radio.ctx;
  const g = ctx.createGain();
  const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.setValueAtTime(600, t); f.frequency.linearRampToValueAtTime(1800, t + dur * 0.5); f.frequency.linearRampToValueAtTime(700, t + dur);
  [-7, 7].forEach((det) => {
    const o = ctx.createOscillator(); o.type = tipo || "sawtooth"; o.frequency.value = frec(m); o.detune.value = det;
    o.connect(f); o.start(t); o.stop(t + dur + 0.6);
  });
  f.connect(g); g.connect(radio.cinta); g.connect(radio.envioReverb);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(vol, t + dur * 0.25);
  g.gain.linearRampToValueAtTime(0.0001, t + dur + 0.5);
}

function bajo(m, t, dur, vol) {
  const ctx = radio.ctx;
  const g = ctx.createGain();
  const o = ctx.createOscillator(); o.type = "triangle"; o.frequency.value = frec(m);
  const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 500;
  o.connect(f); f.connect(g); g.connect(radio.cinta);
  envolvente(g, t, 0.01, dur, vol);
  o.start(t); o.stop(t + dur + 0.05);
}

function arpegio(m, t, vol) {
  const ctx = radio.ctx;
  const g = ctx.createGain();
  const o = ctx.createOscillator(); o.type = "square"; o.frequency.value = frec(m);
  const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 2400;
  o.connect(f); f.connect(g); g.connect(radio.cinta); g.connect(radio.envioReverb);
  envolvente(g, t, 0.005, 0.16, vol);
  o.start(t); o.stop(t + 0.25);
}

function bombo(t, vol) {
  const ctx = radio.ctx;
  const o = ctx.createOscillator(); const g = ctx.createGain();
  o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.12);
  o.connect(g); g.connect(radio.cinta);
  envolvente(g, t, 0.002, 0.32, vol);
  o.start(t); o.stop(t + 0.4);
}

function ruido(t, dur, vol, tipo, frecuencia, destinoReverb) {
  const ctx = radio.ctx;
  const s = ctx.createBufferSource(); s.buffer = radio.ruidoBuf;
  const f = ctx.createBiquadFilter(); f.type = tipo; f.frequency.value = frecuencia;
  const g = ctx.createGain();
  s.connect(f); f.connect(g); g.connect(radio.cinta); if (destinoReverb) g.connect(radio.envioReverb);
  envolvente(g, t, 0.002, dur, vol);
  s.start(t, Math.random() * 1.5); s.stop(t + dur + 0.05);
}

// Ambiente continuo: crujido de vinilo en Café, aguacero en Lluvia, olas en Playa
function ambiente() {
  const ctx = radio.ctx;
  if (radio.ambiente) { try { radio.ambiente.stop(); } catch (e) {} radio.ambiente = null; }
  const id = EMISORAS[radio.emisora].id;
  if (id === "noche") return;
  const s = ctx.createBufferSource(); s.buffer = radio.ruidoBuf; s.loop = true;
  const f = ctx.createBiquadFilter();
  const g = ctx.createGain();
  if (id === "lluvia") { f.type = "bandpass"; f.frequency.value = 1400; f.Q.value = 0.5; g.gain.value = 0.05; }
  else if (id === "playa") {
    f.type = "lowpass"; f.frequency.value = 700; g.gain.value = 0.02;
    const ola = ctx.createOscillator(); ola.frequency.value = 0.09;
    const olaG = ctx.createGain(); olaG.gain.value = 0.018;
    ola.connect(olaG); olaG.connect(g.gain); ola.start();
  } else { f.type = "highpass"; f.frequency.value = 3000; g.gain.value = 0.006; }
  s.connect(f); f.connect(g); g.connect(radio.salida);
  s.start();
  radio.ambiente = s;
}

function chasquidoVinilo(t) {
  if (Math.random() < 0.3) ruido(t + Math.random() * 0.2, 0.01, 0.05 + Math.random() * 0.05, "highpass", 2500);
}

// ----- Secuenciador -----
function tocarPaso(paso, t) {
  const c = radio.cancion;
  const id = c.em.id;
  const seg16 = 60 / c.bpm / 4;
  const i = paso % 16;
  const acorde = c.acordes[c.compas % c.acordes.length];
  const swing = i % 2 === 1 ? c.em.swing * seg16 : 0;
  const ts = t + swing;
  const parte = Math.floor(c.compas / 8) % 3; // intro, desarrollo y quiebre

  if (i === 0) {
    $("#lcdAcorde").textContent = c.acordes.map(nombreAcorde).map((n, k) => (k === c.compas % c.acordes.length ? `[${n}]` : n)).join(" ");
    if (id === "noche") acorde.notas.forEach((m) => pad(m, t, seg16 * 16, 0.035, "sawtooth"));
    else if (id === "lluvia") acorde.notas.forEach((m, k) => piano(m, t + k * 0.03, 2.6, 0.08));
    else if (id === "playa") acorde.notas.forEach((m) => pad(m + 12, t, seg16 * 16, 0.02, "triangle"));
    else acorde.notas.forEach((m, k) => piano(m, t + k * 0.012, 2.2, 0.075));
  }
  // Bossa: la guitarra comping con el ritmo sincopado
  if (id === "playa" && [0, 3, 6, 10, 13].includes(i)) acorde.notas.forEach((m, k) => piano(m + 12, ts + k * 0.008, 0.22, 0.045));
  // Café: un segundo golpe de acorde a mitad del compás
  if (id === "cafe" && i === 10 && Math.random() < 0.5) acorde.notas.slice(1).forEach((m) => piano(m, ts, 0.9, 0.05));

  // Bajo
  if (id === "noche" && i % 2 === 0) bajo(acorde.raiz - 12, ts, seg16 * 1.6, 0.22);
  else if (id === "playa" && (i === 0 || i === 6 || i === 8 || i === 14)) bajo(acorde.raiz - 12 + (i === 6 || i === 14 ? 7 : 0), ts, seg16 * 2.5, 0.25);
  else if ((id === "cafe") && (i === 0 || (i === 11 && Math.random() < 0.6))) bajo(acorde.raiz - 12, ts, seg16 * 5, 0.24);
  else if (id === "lluvia" && i === 0) bajo(acorde.raiz - 12, ts, seg16 * 14, 0.13);

  // Arpegio de la noche
  if (id === "noche" && parte > 0) arpegio(acorde.notas[i % acorde.notas.length] + 12, ts, 0.025);

  // Melodía: el motivo, que cambia un poquito cada cuatro compases
  const n = c.motivo[i];
  if (n >= 0 && (parte > 0 || id === "lluvia")) {
    const variacion = c.compas % 4 === 3 && Math.random() < 0.5 ? azar([-2, -1, 1, 2]) : 0;
    const m = c.escala[Math.max(0, Math.min(c.escala.length - 1, n + variacion))];
    if (id === "noche") arpegio(m, ts, 0.035);
    else piano(m, ts, id === "lluvia" ? 1.6 : 0.7, id === "lluvia" ? 0.06 : 0.05);
  }

  // Batería
  if (id !== "lluvia") {
    const vb = id === "noche" ? 0.6 : 0.5;
    if (c.bombo[i]) bombo(ts, vb);
    if (c.redo[i] && (parte > 0 || id === "playa")) ruido(ts, id === "playa" ? 0.03 : 0.16, id === "playa" ? 0.12 : 0.16, "bandpass", id === "playa" ? 3200 : 1800, true);
    if (c.platillo[i] && parte !== 0) ruido(ts, 0.035, 0.05 * c.platillo[i], "highpass", 7000);
    if (id === "playa" && i % 2 === 1) ruido(ts, 0.02, 0.05, "highpass", 5000); // shaker
  } else if (i === 8 && Math.random() < 0.3) {
    bombo(ts, 0.18);
  }
  if (id === "cafe") chasquidoVinilo(t);

  if (i === 15) c.compas++;
}

function programar() {
  const ctx = radio.ctx;
  while (radio.proximo < ctx.currentTime + 0.12) {
    tocarPaso(radio.paso, radio.proximo);
    radio.proximo += 60 / radio.cancion.bpm / 4;
    radio.paso++;
    // Cada 32 compases arranca otra canción sola
    if (radio.paso % (16 * 32) === 0) nuevaCancion(true);
  }
}

function nuevaCancion(seguir) {
  radio.cancion = crearCancion();
  radio.paso = 0;
  if (!seguir && radio.ctx) radio.proximo = radio.ctx.currentTime + 0.08;
  const c = radio.cancion;
  $("#lcdEmisora").textContent = "FM " + c.em.fm + " " + c.em.nombre;
  $("#lcdNombre").textContent = c.nombre;
  $("#lcdTempo").textContent = c.bpm + " BPM";
}

function encender() {
  iniciarAudio();
  radio.ctx.resume();
  radio.sonando = true;
  nuevaCancion(false);
  ambiente();
  radio.temporizador = setInterval(programar, 25);
  $("#radio").classList.add("sonando");
  $("#btnPlay").setAttribute("aria-label", "Pausar");
  $("#icoPlay").innerHTML = '<path d="M6 4.5h4.5v15H6zM13.5 4.5H18v15h-4.5z"/>';
}

function apagar() {
  radio.sonando = false;
  clearInterval(radio.temporizador);
  if (radio.ambiente) { try { radio.ambiente.stop(); } catch (e) {} radio.ambiente = null; }
  radio.ctx.suspend();
  $("#radio").classList.remove("sonando");
  $("#btnPlay").setAttribute("aria-label", "Reproducir");
  $("#icoPlay").innerHTML = '<path d="M7 4.5v15l13-7.5z"/>';
  $("#lcdAcorde").textContent = "En pausa";
}

$("#btnPlay").addEventListener("click", () => (radio.sonando ? apagar() : encender()));
$("#btnOtra").addEventListener("click", () => { if (!radio.sonando) encender(); else nuevaCancion(false); });
$("#volumen").addEventListener("input", (e) => {
  if (radio.salida) radio.salida.gain.setTargetAtTime(e.target.value / 100 * 0.9, radio.ctx.currentTime, 0.05);
  guardar("volumen", e.target.value);
});
$("#volumen").value = leer("volumen", 70);
document.querySelectorAll("[data-emisora]").forEach((b) => b.addEventListener("click", () => {
  document.querySelectorAll("[data-emisora]").forEach((x) => x.classList.toggle("is-on", x === b));
  radio.emisora = Number(b.dataset.emisora);
  guardar("emisora", radio.emisora);
  if (radio.sonando) { nuevaCancion(false); ambiente(); }
  else { const em = EMISORAS[radio.emisora]; $("#lcdEmisora").textContent = "FM " + em.fm + " " + em.nombre; }
}));
radio.emisora = Number(leer("emisora", 0)) || 0;
document.querySelectorAll("[data-emisora]").forEach((x) => x.classList.toggle("is-on", Number(x.dataset.emisora) === radio.emisora));
$("#lcdEmisora").textContent = "FM " + EMISORAS[radio.emisora].fm + " " + EMISORAS[radio.emisora].nombre;

// Visualizador en la pantalla de cristal líquido
const lienzoVis = $("#visual");
const gv = lienzoVis.getContext("2d");
function dibujarVisual() {
  const w = (lienzoVis.width = lienzoVis.clientWidth * devicePixelRatio);
  const h = (lienzoVis.height = lienzoVis.clientHeight * devicePixelRatio);
  gv.clearRect(0, 0, w, h);
  const barras = 32, ancho = w / barras;
  let datos = null;
  if (radio.analizador && radio.sonando) { datos = new Uint8Array(radio.analizador.frequencyBinCount); radio.analizador.getByteFrequencyData(datos); }
  for (let b = 0; b < barras; b++) {
    const v = datos ? datos[Math.floor(b * datos.length / barras / 1.3)] / 255 : 0;
    const bloques = Math.max(1, Math.round(v * 8));
    for (let k = 0; k < 8; k++) {
      gv.fillStyle = k < bloques ? "#2f3a24" : "rgba(47,58,36,0.1)";
      const bh = h / 8;
      gv.fillRect(b * ancho + 2, h - (k + 1) * bh + 2, ancho - 4, bh - 3);
    }
  }
  requestAnimationFrame(dibujarVisual);
}
requestAnimationFrame(dibujarVisual);

// =====================================================================
// JUEGOS
// =====================================================================
let juegoActual = "sumas";
const records = { sumas: Number(leer("rec-sumas", 0)), culebra: Number(leer("rec-culebra", 0)), minas: Number(leer("rec-minas", 0)) };
function marcar(puntos) {
  $("#puntos").textContent = puntos;
  if (juegoActual === "minas") {
    $("#record").textContent = records.minas ? records.minas + "s" : "--";
    return;
  }
  if (puntos > records[juegoActual]) { records[juegoActual] = puntos; guardar("rec-" + juegoActual, puntos); }
  $("#record").textContent = records[juegoActual];
}

document.querySelectorAll("[data-juego]").forEach((b) => b.addEventListener("click", () => {
  juegoActual = b.dataset.juego;
  document.querySelectorAll("[data-juego]").forEach((x) => { x.classList.toggle("is-on", x === b); x.setAttribute("aria-selected", x === b); });
  document.querySelectorAll(".juego").forEach((j) => j.classList.toggle("is-on", j.id === "juego-" + juegoActual));
  culebra.pausar(true);
  if (juegoActual === "sumas") marcar(sumas.puntos);
  if (juegoActual === "culebra") marcar(culebra.puntos);
  if (juegoActual === "minas") marcar(minas.tiempo + "s");
}));

// ---------- 2048 ----------
const sumas = { celdas: [], puntos: 0, gano: false };
function sumasNuevo() {
  sumas.celdas = Array(16).fill(0); sumas.puntos = 0; sumas.gano = false;
  $("#avisoSumas").classList.remove("is-on");
  sumasPoner(); sumasPoner(); sumasPintar([]);
  marcar(0);
}
function sumasPoner() {
  const vacias = sumas.celdas.map((v, i) => (v ? -1 : i)).filter((i) => i >= 0);
  if (!vacias.length) return -1;
  const i = azar(vacias);
  sumas.celdas[i] = Math.random() < 0.9 ? 2 : 4;
  return i;
}
function sumasPintar(nuevas, sumadas = []) {
  const t = $("#tablero");
  t.innerHTML = sumas.celdas.map((v, i) => `<div class="celda${v >= 1024 ? " grande" : ""}${nuevas.includes(i) ? " nueva" : ""}${sumadas.includes(i) ? " suma" : ""}"${v ? ` data-v="${v}"` : ""}>${v || ""}</div>`).join("");
}
function sumasMover(dx, dy) {
  const c = sumas.celdas;
  let movio = false;
  const sumadas = [];
  for (let k = 0; k < 4; k++) {
    // Índices de la fila o columna en el orden en que se empujan
    const idx = [];
    for (let s = 0; s < 4; s++) {
      const p = dx === 1 || dy === 1 ? 3 - s : s;
      idx.push(dx ? k * 4 + p : p * 4 + k);
    }
    const vals = idx.map((i) => c[i]).filter(Boolean);
    const res = [];
    for (let s = 0; s < vals.length; s++) {
      if (vals[s] === vals[s + 1]) { res.push(vals[s] * 2); sumas.puntos += vals[s] * 2; sumadas.push(idx[res.length - 1]); s++; }
      else res.push(vals[s]);
    }
    idx.forEach((i, s) => { const v = res[s] || 0; if (c[i] !== v) movio = true; c[i] = v; });
  }
  if (!movio) return;
  const nueva = sumasPoner();
  sumasPintar([nueva], sumadas);
  marcar(sumas.puntos);
  if (!sumas.gano && c.includes(2048)) { sumas.gano = true; sumasAviso("¡2048!<small>Puedes seguir jugando</small>", true); }
  else if (!sumasPuedeMover()) sumasAviso(`SE ACABÓ<small>${sumas.puntos} puntos. Toca para jugar otra</small>`);
}
function sumasPuedeMover() {
  const c = sumas.celdas;
  if (c.includes(0)) return true;
  for (let i = 0; i < 16; i++) {
    if (i % 4 < 3 && c[i] === c[i + 1]) return true;
    if (i < 12 && c[i] === c[i + 4]) return true;
  }
  return false;
}
function sumasAviso(html, cerrable) {
  const a = $("#avisoSumas");
  a.innerHTML = `<div>${html}</div>`;
  a.classList.add("is-on");
  a.onclick = () => { a.classList.remove("is-on"); if (!cerrable) sumasNuevo(); };
}
$("#nuevoSumas").addEventListener("click", sumasNuevo);
sumasNuevo();

// ---------- Culebrita ----------
const culebra = (() => {
  const lienzo = $("#lienzoCulebra");
  const g = lienzo.getContext("2d");
  const N = 20, T = lienzo.width / N;
  let cuerpo, dir, siguiente, fruta, vivo = false, pausa = true, reloj = null, velocidad;
  const api = { puntos: 0 };
  function nuevo() {
    cuerpo = [{ x: 8, y: 10 }, { x: 7, y: 10 }, { x: 6, y: 10 }];
    dir = { x: 1, y: 0 }; siguiente = dir; api.puntos = 0; velocidad = 130; vivo = true;
    ponerFruta(); dibujar(); marcar(0);
  }
  function ponerFruta() {
    do { fruta = { x: Math.floor(Math.random() * N), y: Math.floor(Math.random() * N) }; } while (cuerpo.some((p) => p.x === fruta.x && p.y === fruta.y));
  }
  function paso() {
    dir = siguiente;
    const cab = { x: cuerpo[0].x + dir.x, y: cuerpo[0].y + dir.y };
    if (cab.x < 0 || cab.y < 0 || cab.x >= N || cab.y >= N || cuerpo.some((p) => p.x === cab.x && p.y === cab.y)) return morir();
    cuerpo.unshift(cab);
    if (cab.x === fruta.x && cab.y === fruta.y) {
      api.puntos += 10; marcar(api.puntos); ponerFruta();
      velocidad = Math.max(55, velocidad - 4); clearInterval(reloj); reloj = setInterval(paso, velocidad);
    } else cuerpo.pop();
    dibujar();
  }
  function morir() {
    vivo = false; pausa = true; clearInterval(reloj);
    $("#avisoCulebra").innerHTML = `<div>¡PUM!<small>${api.puntos} puntos. Espacio o toca para otra</small></div>`;
    $("#avisoCulebra").classList.add("is-on");
  }
  function dibujar() {
    g.clearRect(0, 0, lienzo.width, lienzo.height);
    g.fillStyle = "rgba(47,58,36,0.06)";
    for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) if ((x + y) % 2) g.fillRect(x * T, y * T, T, T);
    g.fillStyle = "#b8431b";
    g.beginPath(); g.arc(fruta.x * T + T / 2, fruta.y * T + T / 2, T * 0.36, 0, Math.PI * 2); g.fill();
    cuerpo.forEach((p, i) => {
      g.fillStyle = i === 0 ? "#1f2818" : "#2f3a24";
      g.fillRect(p.x * T + 1, p.y * T + 1, T - 2, T - 2);
    });
    // Ojitos
    const c = cuerpo[0];
    g.fillStyle = "#c9d6b0";
    const ox = dir.x === 0 ? [0.3, 0.7] : [dir.x > 0 ? 0.65 : 0.35, dir.x > 0 ? 0.65 : 0.35];
    const oy = dir.y === 0 ? [0.3, 0.7] : [dir.y > 0 ? 0.65 : 0.35, dir.y > 0 ? 0.65 : 0.35];
    for (let k = 0; k < 2; k++) g.fillRect(c.x * T + ox[k] * T - 2, c.y * T + oy[k] * T - 2, 4, 4);
  }
  api.girar = (x, y) => {
    if (!vivo) return;
    if (x === -dir.x && y === -dir.y) return;
    siguiente = { x, y };
    if (pausa) api.pausar(false);
  };
  api.pausar = (si) => {
    if (si === undefined) si = !pausa;
    if (!vivo) { if (!si) { nuevo(); } else return; }
    pausa = si;
    clearInterval(reloj);
    if (!pausa) { reloj = setInterval(paso, velocidad); $("#avisoCulebra").classList.remove("is-on"); }
    else if (vivo) { $("#avisoCulebra").innerHTML = "<div>PAUSA<small>Espacio o toca para seguir</small></div>"; $("#avisoCulebra").classList.add("is-on"); }
  };
  $("#avisoCulebra").addEventListener("click", () => api.pausar(false));
  $("#pausaCulebra").addEventListener("click", () => api.pausar());
  document.querySelectorAll("[data-dir]").forEach((b) => b.addEventListener("click", () => { const [x, y] = b.dataset.dir.split(",").map(Number); api.girar(x, y); }));
  cuerpo = [{ x: 8, y: 10 }, { x: 7, y: 10 }, { x: 6, y: 10 }]; dir = { x: 1, y: 0 }; fruta = { x: 14, y: 10 };
  dibujar();
  return api;
})();

// ---------- Buscaminas ----------
const NIVELES = [{ n: "Fácil", c: 9, f: 9, m: 10 }, { n: "Medio", c: 12, f: 12, m: 24 }, { n: "Difícil", c: 14, f: 14, m: 40 }];
const minas = { nivel: 0, tablero: [], abiertas: 0, fin: false, tiempo: 0, reloj: null, bandera: false, primera: true };
function minasNuevo() {
  const L = NIVELES[minas.nivel];
  minas.tablero = Array.from({ length: L.c * L.f }, () => ({ mina: false, n: 0, abierta: false, bandera: false }));
  minas.abiertas = 0; minas.fin = false; minas.primera = true; minas.tiempo = 0;
  clearInterval(minas.reloj); minas.reloj = null;
  $("#avisoMinas").classList.remove("is-on");
  $("#nivelMinas").textContent = L.n;
  const r = $("#minas"); r.style.setProperty("--cols", L.c);
  r.innerHTML = minas.tablero.map((_, i) => `<button class="mina" data-i="${i}" aria-label="Casilla"></button>`).join("");
  $("#quedan").textContent = L.m;
  if (juegoActual === "minas") marcar("0s");
}
function vecinos(i) {
  const L = NIVELES[minas.nivel];
  const x = i % L.c, y = Math.floor(i / L.c), v = [];
  for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
    if (!dx && !dy) continue;
    const nx = x + dx, ny = y + dy;
    if (nx >= 0 && ny >= 0 && nx < L.c && ny < L.f) v.push(ny * L.c + nx);
  }
  return v;
}
function sembrarMinas(evitar) {
  const L = NIVELES[minas.nivel];
  const prohibidas = new Set([evitar, ...vecinos(evitar)]);
  let puestas = 0;
  while (puestas < L.m) {
    const i = Math.floor(Math.random() * minas.tablero.length);
    if (minas.tablero[i].mina || prohibidas.has(i)) continue;
    minas.tablero[i].mina = true; puestas++;
  }
  minas.tablero.forEach((c, i) => { c.n = vecinos(i).filter((v) => minas.tablero[v].mina).length; });
}
function abrir(i) {
  const c = minas.tablero[i];
  if (c.abierta || c.bandera || minas.fin) return;
  if (minas.primera) {
    sembrarMinas(i); minas.primera = false;
    minas.reloj = setInterval(() => { minas.tiempo++; if (juegoActual === "minas") marcar(minas.tiempo + "s"); }, 1000);
  }
  if (c.mina) return perder(i);
  const pila = [i];
  while (pila.length) {
    const k = pila.pop(); const x = minas.tablero[k];
    if (x.abierta || x.bandera) continue;
    x.abierta = true; minas.abiertas++;
    const b = document.querySelector(`.mina[data-i="${k}"]`);
    b.classList.add("abierta"); b.textContent = x.n || ""; if (x.n) b.dataset.n = x.n;
    if (!x.n) vecinos(k).forEach((v) => pila.push(v));
  }
  const L = NIVELES[minas.nivel];
  if (minas.abiertas === L.c * L.f - L.m) ganar();
}
function perder(i) {
  minas.fin = true; clearInterval(minas.reloj);
  minas.tablero.forEach((c, k) => { if (c.mina) { const b = document.querySelector(`.mina[data-i="${k}"]`); b.textContent = "✸"; b.classList.add("abierta"); if (k === i) b.classList.add("boom"); } });
  setTimeout(() => avisoMinas("¡BOOM!<small>Toca para otra partida</small>"), 500);
}
function ganar() {
  minas.fin = true; clearInterval(minas.reloj);
  const clave = "rec-minas-" + minas.nivel;
  const mejor = Number(leer(clave, 0));
  if (!mejor || minas.tiempo < mejor) guardar(clave, minas.tiempo);
  records.minas = Math.min(mejor || Infinity, minas.tiempo);
  marcar(minas.tiempo + "s");
  avisoMinas(`¡LIMPIO!<small>${minas.tiempo} segundos${!mejor || minas.tiempo < mejor ? ", récord nuevo" : ""}</small>`);
}
function avisoMinas(html) {
  const a = $("#avisoMinas"); a.innerHTML = `<div>${html}</div>`; a.classList.add("is-on");
  a.onclick = minasNuevo;
}
function ponerBandera(i) {
  const c = minas.tablero[i];
  if (c.abierta || minas.fin) return;
  c.bandera = !c.bandera;
  const b = document.querySelector(`.mina[data-i="${i}"]`);
  b.textContent = c.bandera ? "⚑" : "";
  const L = NIVELES[minas.nivel];
  $("#quedan").textContent = L.m - minas.tablero.filter((x) => x.bandera).length;
}
$("#minas").addEventListener("click", (e) => {
  const b = e.target.closest(".mina"); if (!b) return;
  const i = Number(b.dataset.i);
  const c = minas.tablero[i];
  // Clic en un número ya abierto con sus banderas completas: abre los vecinos
  if (c.abierta && c.n) {
    const v = vecinos(i);
    if (v.filter((k) => minas.tablero[k].bandera).length === c.n) v.forEach(abrir);
    return;
  }
  minas.bandera ? ponerBandera(i) : abrir(i);
});
$("#minas").addEventListener("contextmenu", (e) => {
  const b = e.target.closest(".mina"); if (!b) return;
  e.preventDefault(); ponerBandera(Number(b.dataset.i));
});
$("#modoBandera").addEventListener("click", (e) => { minas.bandera = !minas.bandera; e.currentTarget.classList.toggle("is-on", minas.bandera); });
$("#nivelMinas").addEventListener("click", () => {
  minas.nivel = (minas.nivel + 1) % NIVELES.length;
  records.minas = Number(leer("rec-minas-" + minas.nivel, 0));
  minasNuevo();
});
$("#nuevoMinas").addEventListener("click", minasNuevo);
records.minas = Number(leer("rec-minas-0", 0));
minasNuevo();

// ---------- Teclado y gestos ----------
document.addEventListener("keydown", (e) => {
  const k = e.key.toLowerCase();
  const flechas = { arrowup: [0, -1], w: [0, -1], arrowdown: [0, 1], s: [0, 1], arrowleft: [-1, 0], a: [-1, 0], arrowright: [1, 0], d: [1, 0] };
  if (e.target.matches("input")) return;
  if (juegoActual === "sumas" && flechas[k]) { e.preventDefault(); sumasMover(...flechas[k]); }
  if (juegoActual === "culebra") {
    if (flechas[k]) { e.preventDefault(); culebra.girar(...flechas[k]); }
    if (k === " ") { e.preventDefault(); culebra.pausar(); }
  }
});
function deslizar(el, alMover) {
  let x0 = 0, y0 = 0, activo = false;
  el.addEventListener("pointerdown", (e) => { x0 = e.clientX; y0 = e.clientY; activo = true; });
  el.addEventListener("pointerup", (e) => {
    if (!activo) return; activo = false;
    const dx = e.clientX - x0, dy = e.clientY - y0;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    if (Math.abs(dx) > Math.abs(dy)) alMover(dx > 0 ? 1 : -1, 0); else alMover(0, dy > 0 ? 1 : -1);
  });
}
deslizar($("#tablero"), sumasMover);
deslizar($("#lienzoCulebra"), (x, y) => culebra.girar(x, y));
