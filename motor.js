/*
 * Motor bayesiano nominal unifactorial (tipo C).
 * Demostración: ¿qué modelo mental sobre el calor y la temperatura
 * tiene el alumno? (Física y Química, ESO)
 *
 * Hipótesis excluyentes y sin orden entre ellas, por lo que no se usa IRT:
 * cada pregunta define una distribución explícita P(R = r | H_i, q) sobre
 * sus opciones de respuesta, y la actualización bayesiana es la estándar.
 */

const HIPOTESIS = [
  {
    id: 'TACTO',
    nombre: 'El tacto mide la temperatura',
    resumen:
      'confundes la sensación al tocar con la temperatura real ' +
      '(«el metal está más frío que la madera»)',
    descripcion:
      'Cree que lo que notamos al tocar es la temperatura real del objeto: ' +
      'si el metal se siente más frío que la madera, es que está más frío. ' +
      'En realidad, los objetos que llevan tiempo en el mismo lugar están a ' +
      'la misma temperatura; los buenos conductores (metal, baldosa) se ' +
      'llevan el calor de la piel más deprisa y por eso se notan más fríos.',
    recomendacion:
      'Medir con un termómetro objetos de distintos materiales que lleven ' +
      'tiempo en la misma habitación (metal, madera, plástico) y contrastar ' +
      'la medida con la sensación. Después, introducir la conducción: los ' +
      'materiales que conducen bien el calor se llevan el de la mano más ' +
      'deprisa y por eso «se sienten» fríos.'
  },
  {
    id: 'ABRIGO',
    nombre: 'La ropa produce calor',
    resumen:
      'piensas que abrigos, mantas y lana generan calor por sí mismos',
    descripcion:
      'Piensa que abrigos, mantas, lana o guantes generan calor por sí ' +
      'mismos. En realidad son aislantes: no producen calor, sino que ' +
      'frenan su paso, tanto para conservar lo caliente como lo frío.',
    recomendacion:
      'Envolver un termómetro en un abrigo y comprobar que no sube; ' +
      'envolver hielo en una bufanda y comprobar que dura más. Con esa ' +
      'evidencia, introducir la idea de aislante: la ropa no produce ' +
      'calor, frena su paso.'
  },
  {
    id: 'OK',
    nombre: 'Modelo correcto',
    resumen:
      'ya usas el modelo científico: los objetos de un mismo lugar ' +
      'acaban a la misma temperatura, y la ropa aísla en vez de calentar',
    descripcion:
      'Sabe que los objetos de un mismo lugar acaban a la misma ' +
      'temperatura (equilibrio térmico), que la sensación de frío o calor ' +
      'depende de lo deprisa que el material conduce el calor, y que la ' +
      'ropa y las mantas aíslan en lugar de calentar.',
    recomendacion:
      'Avanzar hacia conductores y aislantes con ejemplos cuantitativos y ' +
      'hacia la rapidez del equilibrio térmico: por qué todo acaba a la ' +
      'temperatura ambiente y de qué depende que ocurra antes o después.'
  }
];

/*
 * Banco de preguntas. Cada ítem tiene tres opciones; `pred` indica qué
 * opción elige cada modelo mental erróneo cuando la pregunta ataca ese
 * error (si la pregunta no lo ataca, no hay entrada y la verosimilitud
 * se genera como afectación parcial).
 */
const BANCO = [
  {
    id: 'q1', corto: 'Barra de metal y listón de madera',
    enunciado:
      'Una barra de metal y un listón de madera llevan toda la noche ' +
      'sobre la mesa del laboratorio. Si mides su temperatura con un ' +
      'termómetro, ¿qué encontrarás?',
    opciones: [
      'La barra de metal está más fría',
      'El listón de madera está más frío',
      'Los dos están a la misma temperatura'
    ],
    correcta: 2,
    pred: { TACTO: 0 },
    explicacion:
      'Con el tiempo, todo lo que hay en el laboratorio alcanza la ' +
      'temperatura del aire (equilibrio térmico). El metal «se siente» ' +
      'más frío porque conduce el calor de tu mano más deprisa, pero el ' +
      'termómetro marca lo mismo.'
  },
  {
    id: 'q2', corto: 'Cubito con bufanda',
    enunciado:
      'Para un experimento, envuelves un cubito de hielo en una bufanda ' +
      'de lana y dejas otro igual al aire, en la misma mesa. ¿Cuál se ' +
      'derrite antes?',
    opciones: [
      'El de la bufanda',
      'El que está al aire',
      'Los dos a la vez'
    ],
    correcta: 1,
    pred: { ABRIGO: 0 },
    explicacion:
      'La lana no calienta: aísla. Frena el paso del calor del aire hacia ' +
      'el hielo, así que el cubito envuelto se derrite más tarde.'
  },
  {
    id: 'q3', corto: 'Termómetro en el abrigo',
    enunciado:
      'Un termómetro lleva horas en la habitación y marca 22 °C. Lo ' +
      'envuelves media hora con un abrigo que también estaba allí. ' +
      '¿Qué marcará al sacarlo?',
    opciones: ['Más de 22 °C', 'Menos de 22 °C', '22 °C'],
    correcta: 2,
    pred: { ABRIGO: 0 },
    explicacion:
      'El abrigo no produce calor, solo frena su paso. Como el termómetro ' +
      'ya estaba a la temperatura de la habitación, sigue marcando 22 °C.'
  },
  {
    id: 'q4', corto: 'Pasamanos del parque',
    enunciado:
      'En el mismo parque hay un pasamanos de metal y otro de madera. ' +
      'El de metal se nota mucho más frío. ¿Por qué?',
    opciones: [
      'Porque el metal está a menos temperatura que la madera',
      'Porque el metal se lleva el calor de tu mano más deprisa',
      'Porque el metal produce frío'
    ],
    correcta: 1,
    pred: { TACTO: 0, ABRIGO: 2 },
    explicacion:
      'Los dos pasamanos están a la misma temperatura. El metal conduce ' +
      'el calor de tu mano mucho más deprisa que la madera y por eso lo ' +
      'notas más frío.'
  },
  {
    id: 'q5', corto: 'Baldosa y alfombra',
    enunciado:
      'Por la mañana pisas descalzo la baldosa del baño y la alfombra de ' +
      'tu cuarto. ¿Cuál está a menor temperatura?',
    opciones: ['La baldosa', 'La alfombra', 'Las dos están igual'],
    correcta: 2,
    pred: { TACTO: 0 },
    explicacion:
      'Las dos están a la temperatura de la casa. La baldosa conduce el ' +
      'calor de tus pies más deprisa y por eso la notas más fría.'
  },
  {
    id: 'q6', corto: 'Hielo para la acampada',
    enunciado:
      'Compras una bolsa de hielo para una acampada y tienes una hora de ' +
      'camino. Comparado con llevarla tal cual, si la envuelves en una ' +
      'manta el hielo llegará…',
    opciones: [
      'Más derretido',
      'Menos derretido',
      'Igual de derretido'
    ],
    correcta: 1,
    pred: { ABRIGO: 0 },
    explicacion:
      'La manta aísla: frena el paso del calor del aire hacia el hielo, ' +
      'así que envuelto en la manta llega menos derretido.'
  },
  {
    id: 'q7', corto: 'Lata y arroz en el congelador',
    enunciado:
      'Una lata de refresco y un paquete de arroz llevan un día entero en ' +
      'el congelador. Al medirlos con un termómetro, ¿cuál está más frío?',
    opciones: ['La lata', 'El paquete de arroz', 'Los dos están igual'],
    correcta: 2,
    pred: { TACTO: 0 },
    explicacion:
      'Tras un día entero, los dos están a la temperatura del congelador. ' +
      'La lata se «siente» más fría porque el metal conduce mejor el calor.'
  },
  {
    id: 'q8', corto: 'Guantes en invierno',
    enunciado:
      'En invierno, con guantes puestos, tienes las manos calientes. ' +
      '¿De dónde sale ese calor?',
    opciones: [
      'Lo producen los guantes',
      'Lo producen tus manos, y los guantes evitan que escape',
      'Los guantes impiden que entre el frío'
    ],
    correcta: 1,
    pred: { ABRIGO: 0 },
    explicacion:
      'El calor lo produce tu cuerpo. Los guantes son aislantes: evitan ' +
      'que ese calor escape hacia el aire frío.'
  },
  {
    id: 'q9', corto: 'Termómetro en la mesa de metal',
    enunciado:
      'Un termómetro marca 22 °C sobre un libro. Lo pasas a la mesa de ' +
      'metal de la misma habitación y esperas un rato. ¿Qué marcará?',
    opciones: ['Menos de 22 °C', '22 °C', 'Más de 22 °C'],
    correcta: 1,
    pred: { TACTO: 0 },
    explicacion:
      'El libro, la mesa de metal y el aire de la habitación están a la ' +
      'misma temperatura, así que el termómetro sigue marcando 22 °C.'
  },
  {
    id: 'q11', corto: 'Mango de sartén y paño de cocina',
    enunciado:
      'El mango de una sartén de metal y un paño de algodón llevan toda ' +
      'la noche en el mismo cajón. Al tocarlos, el mango se nota bastante ' +
      'más frío. ¿Por qué?',
    opciones: [
      'Porque el mango está a menos temperatura que el paño',
      'Porque el mango conduce el calor de tu mano más deprisa',
      'Porque el paño de algodón produce un poco de calor'
    ],
    correcta: 1,
    pred: { TACTO: 0, ABRIGO: 2 },
    explicacion:
      'Los dos están a la misma temperatura del cajón. El metal conduce ' +
      'el calor de tu mano mucho más deprisa que el algodón y por eso lo ' +
      'notas más frío.'
  },
  {
    id: 'q12', corto: 'Marco metálico y funda de silicona',
    enunciado:
      'Un móvil con marco de metal y funda de silicona lleva toda la ' +
      'tarde sobre la mesa. Al tocarlo, el marco se nota más frío que la ' +
      'funda. ¿Por qué?',
    opciones: [
      'Porque el marco está a menos temperatura que la funda',
      'Porque el marco conduce el calor de tu mano más deprisa',
      'Porque la funda de silicona ha calentado el marco'
    ],
    correcta: 1,
    pred: { TACTO: 0, ABRIGO: 2 },
    explicacion:
      'El marco y la funda están a la misma temperatura. El metal conduce ' +
      'el calor de tu mano mucho más deprisa que la silicona y por eso lo ' +
      'notas más frío.'
  },
  {
    id: 'q13', corto: 'Banco de piedra y banco de madera',
    enunciado:
      'En el mismo parque y a la misma sombra hay un banco de piedra y ' +
      'uno de madera. Al sentarte, notas el de piedra mucho más frío. ' +
      '¿Por qué?',
    opciones: [
      'Porque la piedra está a menos temperatura que la madera',
      'Porque la piedra conduce el calor de tu cuerpo más deprisa',
      'Porque la madera produce un poco de calor'
    ],
    correcta: 1,
    pred: { TACTO: 0, ABRIGO: 2 },
    explicacion:
      'Los dos bancos están a la misma temperatura. La piedra conduce el ' +
      'calor de tu cuerpo mucho más deprisa que la madera y por eso la ' +
      'notas más fría.'
  },
  {
    id: 'q10', corto: 'Botellas frías y manta',
    enunciado:
      'Sacas dos botellas de agua muy fría de la nevera y envuelves una ' +
      'con una manta. Media hora después, la botella envuelta está…',
    opciones: [
      'Más caliente que la otra',
      'Más fría que la otra',
      'Igual que la otra'
    ],
    correcta: 1,
    pred: { ABRIGO: 0 },
    explicacion:
      'La manta frena el paso del calor del aire hacia la botella: la ' +
      'envuelta se mantiene fría durante más tiempo.'
  }
];

const PARAMETROS = {
  pMin: 0.80,
  minPreguntas: 4,
  maxPreguntas: 10,
  numOpciones: 3
};

/*
 * Umbral de entropía asociado a pMin con n hipótesis:
 * H_stop = -p·log2(p) - (1-p)·log2((1-p)/(n-1))
 */
function hStop(pMin, n) {
  return -pMin * Math.log2(pMin)
    - (1 - pMin) * Math.log2((1 - pMin) / (n - 1));
}

const H_STOP = hStop(PARAMETROS.pMin, HIPOTESIS.length);

/*
 * Matriz P(R = r | H_i, q) del ítem: una fila por hipótesis (en el orden
 * de HIPOTESIS), una columna por opción. Valores por tramos, no afinados:
 *  - dominio: 0.90 en la correcta, resto repartido (techo de descuido);
 *  - error atacado por la pregunta: 0.75 en su distractor y 0.15 de
 *    acierto (por debajo del suelo de azar: el distractor lo atrae);
 *  - error no atacado: afectación parcial (0.50 de acierto), con cierta
 *    atracción hacia el distractor intuitivo del otro error (0.30).
 */
function verosimilitudes(item) {
  return HIPOTESIS.map(function (h) {
    const fila = new Array(PARAMETROS.numOpciones).fill(0);
    if (h.id === 'OK') {
      fila.fill(0.05);
      fila[item.correcta] = 0.90;
      return fila;
    }
    const propio = item.pred[h.id];
    if (propio !== undefined) {
      fila.fill(0.10);
      fila[propio] = 0.75;
      fila[item.correcta] = 0.15;
      return fila;
    }
    const otro = Object.values(item.pred)[0];
    for (let r = 0; r < fila.length; r++) {
      if (r === item.correcta) fila[r] = 0.50;
      else if (r === otro) fila[r] = 0.30;
      else fila[r] = 0.20;
    }
    return fila;
  });
}

function entropia(p) {
  return p.reduce(function (h, pi) {
    return pi > 0 ? h - pi * Math.log2(pi) : h;
  }, 0);
}

function priorUniforme() {
  return HIPOTESIS.map(function () { return 1 / HIPOTESIS.length; });
}

/* Posterior tras observar la respuesta r (índice de opción) al ítem. */
function actualizar(posterior, item, r) {
  const M = verosimilitudes(item);
  const nuevo = posterior.map(function (p, i) { return p * M[i][r]; });
  const suma = nuevo.reduce(function (a, b) { return a + b; }, 0);
  return nuevo.map(function (x) { return x / suma; });
}

/*
 * Ganancia esperada de información del ítem: como el modelo define una
 * distribución por opción, se promedia sobre las tres respuestas
 * posibles, no solo sobre acierto/fallo.
 */
function gananciaEsperada(posterior, item) {
  const M = verosimilitudes(item);
  const h0 = entropia(posterior);
  let hEsperada = 0;
  for (let r = 0; r < PARAMETROS.numOpciones; r++) {
    let pr = 0;
    for (let i = 0; i < posterior.length; i++) pr += posterior[i] * M[i][r];
    if (pr === 0) continue;
    const post = posterior.map(function (p, i) { return p * M[i][r] / pr; });
    hEsperada += pr * entropia(post);
  }
  return h0 - hEsperada;
}

/*
 * Elige entre los ítems restantes el de mayor ganancia esperada; los
 * empates (diferencia < 1e-6) se rompen al azar.
 */
function seleccionar(posterior, indicesRestantes, rng) {
  rng = rng || Math.random;
  const evaluados = indicesRestantes.map(function (idx) {
    return { idx: idx, ig: gananciaEsperada(posterior, BANCO[idx]) };
  });
  const mejor = Math.max.apply(null, evaluados.map(function (e) { return e.ig; }));
  const empatados = evaluados.filter(function (e) { return mejor - e.ig < 1e-6; });
  return empatados[Math.floor(rng() * empatados.length)];
}

/*
 * Estado del criterio de parada. Cierre firme: mínimo de preguntas
 * cumplido y ambas condiciones (max p >= pMin y H <= H_stop). Si se agota
 * el banco o el máximo práctico sin cumplirlas, se cierra como provisional.
 */
function estadoParada(posterior, nRespondidas, nRestantes) {
  const h = entropia(posterior);
  const maxP = Math.max.apply(null, posterior);
  const firme = maxP >= PARAMETROS.pMin && h <= H_STOP;
  if (nRespondidas >= PARAMETROS.minPreguntas && firme) {
    return { parar: true, firme: true, h: h, maxP: maxP };
  }
  if (nRespondidas >= PARAMETROS.maxPreguntas || nRestantes === 0) {
    return { parar: true, firme: false, h: h, maxP: maxP };
  }
  return { parar: false, firme: false, h: h, maxP: maxP };
}

function hipotesisMap(posterior) {
  let mejor = 0;
  for (let i = 1; i < posterior.length; i++) {
    if (posterior[i] > posterior[mejor]) mejor = i;
  }
  return mejor;
}
