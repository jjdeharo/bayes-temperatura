/*
 * Motor bayesiano nominal excluyente (perfil B).
 * Demostración: ¿desde qué marco explica el alumno cómo cambian las
 * especies a lo largo del tiempo? (Biología y Geología, ESO)
 *
 * Las tres hipótesis son marcos causales rivales e incompatibles para el
 * MISMO fenómeno (por qué una especie acaba teniendo un rasgo útil): el
 * alumno razona desde uno a la vez, así que solo uno puede ser cierto en
 * cada alumno. Por eso el modelo es nominal excluyente y no multifactorial:
 * no son errores que se acumulen, sino explicaciones que se sustituyen.
 * Sin orden entre ellas, por lo que no se usa IRT: cada pregunta define una
 * distribución explícita P(R = r | H_i, q) sobre sus opciones de respuesta,
 * y la actualización bayesiana es la estándar.
 */

const HIPOTESIS = [
  {
    id: 'LAMARCK',
    nombre: 'El esfuerzo cambia el cuerpo y se hereda',
    resumen:
      'crees que cada ser vivo cambia su cuerpo al usarlo (o dejar de ' +
      'usarlo) y transmite ese cambio a sus crías',
    descripcion:
      'Piensa que los rasgos se adquieren durante la vida —por uso, desuso ' +
      'o esfuerzo— y se heredan: la jirafa estiró el cuello y sus crías ' +
      'nacieron con el cuello más largo. En realidad, lo que un individuo ' +
      'desarrolla usando su cuerpo no pasa a los descendientes; la herencia ' +
      'va en los genes, que no cambian por el esfuerzo.',
    recomendacion:
      'Contrastar con casos claros: los hijos de personas muy musculadas no ' +
      'nacen musculados. Después, introducir que la variación heredable ya ' +
      'está en los genes antes de usar (o no) el órgano, y que el ambiente ' +
      'no la fabrica: solo hace que unas variantes se reproduzcan más.'
  },
  {
    id: 'FINALISMO',
    nombre: 'Las especies cambian porque lo necesitan',
    resumen:
      'crees que una especie desarrolla un rasgo «para» sobrevivir, ' +
      'porque le hace falta',
    descripcion:
      'Piensa que la evolución tiene una intención o una meta: la especie ' +
      'desarrolla el rasgo porque lo necesita, o incluso anticipándose a lo ' +
      'que necesitará. En realidad, la evolución no se propone nada ni ' +
      'prevé el futuro; solo puede favorecer variantes que ya existen y que ' +
      'resultan útiles en el momento.',
    recomendacion:
      'Distinguir «para qué sirve» (función) de «por qué apareció» (causa): ' +
      'un rasgo puede ser útil sin que la especie lo buscara. Trabajar ' +
      'casos donde la necesidad no basta: poblaciones que se extinguen ' +
      'aunque «necesitaran» un cambio, porque la variante útil no existió.'
  },
  {
    id: 'SELECCION',
    nombre: 'Modelo correcto: variación y selección',
    resumen:
      'ya usas el modelo científico: hay variación al azar y el ambiente ' +
      'hace que se reproduzcan más los mejor adaptados',
    descripcion:
      'Sabe que en una población ya existen diferencias heredables surgidas ' +
      'al azar, que el ambiente no las crea sino que hace que unos ' +
      'individuos sobrevivan y se reproduzcan más que otros, y que así los ' +
      'rasgos ventajosos se vuelven más frecuentes generación tras ' +
      'generación, sin intención ni herencia del esfuerzo.',
    recomendacion:
      'Avanzar hacia casos cuantitativos y contraintuitivos: deriva ' +
      'genética, rasgos neutros que se extienden sin «mejorar» nada, ' +
      'coevolución y ritmos de la evolución. Buen momento para modelizar ' +
      'frecuencias de variantes a lo largo de las generaciones.'
  }
];

/*
 * Banco de preguntas. Cada ítem tiene tres opciones; `pred` indica qué
 * opción elige cada marco erróneo cuando la pregunta lo ataca (si la
 * pregunta no ataca ese marco, no hay entrada y la verosimilitud se genera
 * como afectación parcial). Casi todos los ítems son discriminadores a tres
 * bandas: una opción encarna cada marco (LAMARCK / FINALISMO / SELECCION),
 * de modo que la respuesta separa las tres hipótesis a la vez.
 */
const BANCO = [
  {
    id: 'q1', corto: 'El cuello de la jirafa',
    enunciado:
      'Hace mucho, las jirafas tenían el cuello más corto que ahora. ' +
      '¿Cómo pasaron a tenerlo tan largo?',
    opciones: [
      'Cada jirafa estiraba el cuello para alcanzar las hojas altas, se le ' +
        'fue alargando y sus crías nacían con el cuello un poco más largo.',
      'Las jirafas desarrollaron el cuello largo porque lo necesitaban ' +
        'para alcanzar el alimento.',
      'Ya nacían jirafas con el cuello de distinta longitud; las de cuello ' +
        'más largo comían mejor y dejaban más crías, hasta que predominó.'
    ],
    correcta: 2,
    pred: { LAMARCK: 0, FINALISMO: 1 },
    explicacion:
      'El estiramiento de una jirafa no se hereda, ni la especie «encarga» ' +
      'un cuello largo. Entre jirafas que ya variaban en el cuello, las de ' +
      'cuello más largo se alimentaban y reproducían más, y su rasgo se ' +
      'hizo común generación tras generación.'
  },
  {
    id: 'q2', corto: 'Peces ciegos de las cuevas',
    enunciado:
      'Algunos peces que viven en cuevas totalmente oscuras son ciegos, ' +
      'aunque sus antepasados veían. ¿Por qué se quedaron ciegos?',
    opciones: [
      'Al vivir a oscuras dejaron de usar los ojos, se les fueron ' +
        'atrofiando y pasaron esos ojos atrofiados a sus crías.',
      'Perdieron los ojos porque en la oscuridad no les hacían falta.',
      'Nacían con ojos de distinto tamaño; a oscuras ver no daba ninguna ' +
        'ventaja, así que los de ojos reducidos no salían perjudicados y ' +
        'su rasgo se extendió.'
    ],
    correcta: 2,
    pred: { LAMARCK: 0, FINALISMO: 1 },
    explicacion:
      'El desuso no encoge los ojos de los descendientes, ni los peces ' +
      '«deciden» perderlos. En la oscuridad, tener ojos grandes no daba ' +
      'ventaja, así que las variantes con ojos reducidos se extendieron.'
  },
  {
    id: 'q3', corto: 'Bacterias resistentes',
    enunciado:
      'En un cultivo, un antibiótico mata casi todas las bacterias, pero ' +
      'al tiempo la población vuelve, ahora resistente. ¿Qué ha pasado?',
    opciones: [
      'Ya había unas pocas bacterias resistentes por azar; el antibiótico ' +
        'mató al resto y solo ellas se multiplicaron.',
      'El antibiótico obligó a cada bacteria a hacerse resistente, y esa ' +
        'resistencia pasó a sus descendientes.',
      'Las bacterias se hicieron resistentes porque necesitaban sobrevivir ' +
        'al antibiótico.'
    ],
    correcta: 0,
    pred: { LAMARCK: 1, FINALISMO: 2 },
    explicacion:
      'El antibiótico no fabrica la resistencia ni las bacterias la crean ' +
      'a voluntad. Unas pocas ya eran resistentes por mutaciones previas; ' +
      'al eliminar al resto, solo esas dejaron descendencia.'
  },
  {
    id: 'q4', corto: 'Mariposas y hollín',
    enunciado:
      'En una zona donde los troncos se ennegrecieron por el hollín, las ' +
      'mariposas claras casi desaparecieron y abundaron las oscuras. ' +
      '¿Por qué?',
    opciones: [
      'El hollín fue oscureciendo a las mariposas claras, que se volvieron ' +
        'oscuras y tuvieron crías oscuras.',
      'Ya había mariposas claras y oscuras; sobre los troncos ennegrecidos ' +
        'los pájaros cazaban más a las claras, así que quedaron sobre todo ' +
        'las oscuras.',
      'Las mariposas se volvieron oscuras porque necesitaban camuflarse en ' +
        'los troncos.'
    ],
    correcta: 1,
    pred: { LAMARCK: 0, FINALISMO: 2 },
    explicacion:
      'El hollín no tiñe a las mariposas de forma heredable ni ellas ' +
      'cambian de color a voluntad. Entre las que ya existían, las oscuras ' +
      'pasaban desapercibidas sobre los troncos sucios y sobrevivían más.'
  },
  {
    id: 'q5', corto: 'El pelaje del oso polar',
    enunciado: '¿Por qué los osos polares tienen el pelaje blanco?',
    opciones: [
      'Nacían osos de tonos distintos; los más claros cazaban mejor sin ' +
        'ser vistos y dejaban más crías, hasta predominar el blanco.',
      'El frío y la nieve fueron aclarando el pelo de cada oso a lo largo ' +
        'de su vida, y así nacieron blancos.',
      'Se volvieron blancos porque necesitaban camuflarse en la nieve.'
    ],
    correcta: 0,
    pred: { LAMARCK: 1, FINALISMO: 2 },
    explicacion:
      'Ni la nieve destiñe el pelo de forma heredable ni la especie ' +
      '«elige» el blanco. Entre osos de distinto tono, los más claros ' +
      'cazaban mejor sin ser vistos y dejaron más descendencia.'
  },
  {
    id: 'q6', corto: 'La velocidad del guepardo',
    enunciado:
      'Los guepardos actuales corren muchísimo. ¿Cómo llegaron a ser tan ' +
      'veloces?',
    opciones: [
      'Sus antepasados corrían tanto que sus patas se hicieron más ' +
        'rápidas, y transmitieron esa rapidez a las crías.',
      'Se volvieron veloces porque necesitaban cazar presas rápidas.',
      'Nacían guepardos de distinta rapidez; los más veloces cazaban más y ' +
        'dejaban más crías, y así se acumuló la velocidad.'
    ],
    correcta: 2,
    pred: { LAMARCK: 0, FINALISMO: 1 },
    explicacion:
      'Correr mucho no hace que las crías nazcan más veloces, ni la ' +
      'especie encarga velocidad. Entre guepardos que ya variaban, los más ' +
      'rápidos cazaban y se reproducían más.'
  },
  {
    id: 'q7', corto: 'Pinzones tras la sequía',
    enunciado:
      'Tras una sequía en una isla solo quedaron semillas grandes y duras. ' +
      'Un año después, los pinzones tenían de media el pico más grueso. ' +
      '¿Por qué?',
    opciones: [
      'De tanto partir semillas duras, a cada pinzón se le engrosó el pico ' +
        'y sus crías nacieron con el pico más grueso.',
      'Ya había pinzones de pico más fino y más grueso; con solo semillas ' +
        'duras, los de pico grueso comían y sobrevivían más, y dejaron más ' +
        'crías.',
      'Los pinzones desarrollaron el pico más grueso porque lo necesitaban ' +
        'para las semillas duras.'
    ],
    correcta: 1,
    pred: { LAMARCK: 0, FINALISMO: 2 },
    explicacion:
      'Usar el pico no lo engrosa de forma heredable, ni la necesidad crea ' +
      'el rasgo. Entre los pinzones que ya variaban, los de pico grueso ' +
      'aprovechaban mejor las semillas duras y dejaron más descendencia.'
  },
  {
    id: 'q8', corto: 'Los brazos del herrero',
    enunciado:
      'Un herrero desarrolla unos brazos muy fuertes por su trabajo. ' +
      'Según lo que sabemos de la herencia, sus hijos al nacer…',
    opciones: [
      'tendrán los brazos más fuertes de lo normal, porque heredan la ' +
        'fuerza que su padre ganó trabajando.',
      'tendrán brazos normales: lo que el padre desarrolló con su trabajo ' +
        'no se transmite a los hijos.',
      'tendrán brazos fuertes si la familia sigue necesitando ese trabajo.'
    ],
    correcta: 1,
    pred: { LAMARCK: 0, FINALISMO: 2 },
    explicacion:
      'Los rasgos que se adquieren usando el cuerpo no se heredan: los ' +
      'hijos del herrero nacen con brazos normales. La herencia va en los ' +
      'genes, que el trabajo no modifica.'
  },
  {
    id: 'q9', corto: '¿Cambiar para lo que vendrá?',
    enunciado:
      '¿Puede una especie desarrollar un rasgo nuevo porque le hará falta ' +
      'en el futuro?',
    opciones: [
      'Sí: si el ambiente va a cambiar, la especie desarrolla a tiempo lo ' +
        'que necesitará.',
      'No: la evolución no se anticipa; solo puede favorecer variantes que ' +
        'ya existen y que resultan útiles ahora.',
      'Sí, pero solo si los individuos se esfuerzan mucho en usar esa parte ' +
        'del cuerpo.'
    ],
    correcta: 1,
    pred: { FINALISMO: 0, LAMARCK: 2 },
    explicacion:
      'La evolución no prevé el futuro ni responde a un esfuerzo heredado. ' +
      'Solo puede actuar sobre la variación que ya existe: si la variante ' +
      'útil no está, la especie no la «fabrica» porque le convenga.'
  },
  {
    id: 'q10', corto: 'De dónde salen las diferencias',
    enunciado:
      'En una población, ¿de dónde salen las diferencias entre individuos ' +
      'sobre las que actúa la selección natural?',
    opciones: [
      'Aparecen al azar (mutaciones y recombinación) antes de que el ' +
        'ambiente influya.',
      'Las produce el ambiente: cada individuo cambia según cómo vive y lo ' +
        'transmite.',
      'Las crea la especie según lo que necesita.'
    ],
    correcta: 0,
    pred: { LAMARCK: 1, FINALISMO: 2 },
    explicacion:
      'La selección natural no crea las diferencias: las encuentra ya ' +
      'hechas. La variación surge al azar (mutación y recombinación) antes ' +
      'de que el ambiente favorezca unas variantes u otras.'
  },
  {
    id: 'q11', corto: 'Las espinas del cactus',
    enunciado:
      'En muchos cactus, las hojas son espinas en lugar de hojas planas. ' +
      '¿Cómo llegaron a ser así?',
    opciones: [
      'El calor del desierto fue secando y afilando las hojas de cada ' +
        'cactus hasta volverlas espinas, y así nacieron sus descendientes.',
      'El cactus transformó sus hojas en espinas porque necesitaba perder ' +
        'menos agua.',
      'Entre plantas con hojas más anchas o más estrechas, en el desierto ' +
        'las de hoja reducida perdían menos agua y sobrevivían más, hasta ' +
        'quedar las de espinas.'
    ],
    correcta: 2,
    pred: { LAMARCK: 0, FINALISMO: 1 },
    explicacion:
      'El desierto no afila las hojas de forma heredable ni la planta ' +
      'decide protegerse. Entre plantas que ya variaban, las de hojas ' +
      'reducidas perdían menos agua y dejaron más descendencia.'
  },
  {
    id: 'q12', corto: 'Colmillos de elefante y caza',
    enunciado:
      'En zonas con mucha caza furtiva por el marfil, cada vez nacen más ' +
      'elefantes con colmillos pequeños o sin colmillos. ¿Por qué?',
    opciones: [
      'Siempre nacían algunos elefantes con colmillos pequeños; como a esos ' +
        'no los cazaban, sobrevivían y dejaban más crías, y su rasgo se hizo ' +
        'más común.',
      'De tanto esconder los colmillos del peligro, se les fueron reduciendo ' +
        'y sus crías nacieron con colmillos más pequeños.',
      'Los elefantes redujeron sus colmillos porque los necesitaban pequeños ' +
        'para librarse de los cazadores.'
    ],
    correcta: 0,
    pred: { LAMARCK: 1, FINALISMO: 2 },
    explicacion:
      'El peligro no encoge los colmillos de forma heredable ni los ' +
      'elefantes los reducen a voluntad. Los cazadores eliminan a los de ' +
      'colmillos grandes, así que solo los de colmillos pequeños dejan crías.'
  },
  {
    id: 'q13', corto: 'Ratas resistentes al veneno',
    enunciado:
      'En un edificio se usa un veneno para ratas durante años. Al final ' +
      'quedan ratas a las que el veneno ya no hace efecto. ¿Qué ha pasado?',
    opciones: [
      'El veneno fue acostumbrando el cuerpo de cada rata, que se hizo ' +
        'resistente y transmitió esa resistencia a sus crías.',
      'Las ratas se hicieron resistentes porque necesitaban sobrevivir al ' +
        'veneno.',
      'Ya había alguna rata resistente por azar; el veneno mató al resto y ' +
        'solo esas se reprodujeron.'
    ],
    correcta: 2,
    pred: { LAMARCK: 0, FINALISMO: 1 },
    explicacion:
      'El veneno no fabrica la resistencia ni las ratas la crean porque les ' +
      'convenga. Unas pocas ya eran resistentes por mutaciones previas; al ' +
      'morir las demás, solo ellas dejaron descendencia.'
  },
  {
    id: 'q14', corto: 'Aves que no vuelan',
    enunciado:
      'Algunas aves, como el avestruz, descienden de antepasados que ' +
      'volaban, pero hoy no pueden volar. ¿Cómo se explica?',
    opciones: [
      'Dejaron de volar porque, viviendo en el suelo, ya no lo necesitaban.',
      'Nacían aves que volaban mejor o peor; donde volar no daba ventaja, ' +
        'las que invertían en correr o en tamaño sobrevivían igual o mejor, ' +
        'y el vuelo se perdió.',
      'De no usar las alas para volar, estas se fueron atrofiando y las crías ' +
        'nacieron sin capacidad de vuelo.'
    ],
    correcta: 1,
    pred: { LAMARCK: 2, FINALISMO: 0 },
    explicacion:
      'El desuso no atrofia las alas de forma heredable ni la especie decide ' +
      'dejar de volar. Donde volar no daba ventaja, las variantes que ' +
      'dedicaban recursos a otras cosas no salían perjudicadas y el vuelo se ' +
      'fue perdiendo.'
  },
  {
    id: 'q15', corto: 'Lagartijas de patas largas',
    enunciado:
      'En una isla con troncos anchos, las lagartijas tienen de media las ' +
      'patas más largas que en otra isla con ramas finas. ¿Por qué?',
    opciones: [
      'De correr por troncos anchos, a cada lagartija se le fueron alargando ' +
        'las patas y se las pasó a sus crías.',
      'Nacían lagartijas de patas más largas y más cortas; en troncos anchos ' +
        'las de patas largas corrían mejor y escapaban más, y dejaron más ' +
        'crías.',
      'Las lagartijas alargaron las patas porque las necesitaban para los ' +
        'troncos anchos.'
    ],
    correcta: 1,
    pred: { LAMARCK: 0, FINALISMO: 2 },
    explicacion:
      'Correr no alarga las patas de forma heredable ni la necesidad crea el ' +
      'rasgo. Entre lagartijas que ya variaban, en troncos anchos las de ' +
      'patas largas se movían mejor y sobrevivían más.'
  },
  {
    id: 'q16', corto: 'Un dedo perdido en un accidente',
    enunciado:
      'Una persona pierde un dedo en un accidente y años después tiene ' +
      'hijos. Al nacer, sus hijos…',
    opciones: [
      'nacerán también sin ese dedo, porque heredan el cambio que sufrió su ' +
        'cuerpo.',
      'nacerán con todos los dedos: una lesión sufrida en vida no se ' +
        'transmite a los hijos.',
      'nacerán sin ese dedo solo si el accidente ocurrió antes de tenerlos.'
    ],
    correcta: 1,
    pred: { LAMARCK: 0 },
    explicacion:
      'Los cambios que le ocurren al cuerpo durante la vida —una lesión, un ' +
      'músculo entrenado— no pasan a los descendientes. La herencia va en ' +
      'los genes, que el accidente no modifica.'
  },
  {
    id: 'q17', corto: 'El apéndice, que casi no sirve',
    enunciado:
      'El apéndice humano apenas cumple función y a veces incluso causa ' +
      'problemas. Si no sirve para casi nada, ¿por qué seguimos teniéndolo?',
    opciones: [
      'Es un resto heredado de antepasados en los que sí era útil; como ' +
        'tenerlo no supone una desventaja grande, no ha desaparecido.',
      'Si todavía lo tenemos es porque en el fondo el cuerpo lo necesita ' +
        'para algo.',
      'Seguimos teniéndolo porque aún no ha pasado tiempo suficiente para ' +
        'que desaparezca del todo.'
    ],
    correcta: 0,
    pred: { FINALISMO: 1 },
    explicacion:
      'Que un órgano exista no significa que sea necesario. El apéndice es un ' +
      'vestigio de antepasados donde sí cumplía función; la evolución no lo ' +
      'ha eliminado porque tenerlo no penaliza lo suficiente, no porque haga ' +
      'falta.'
  },
  {
    id: 'q18', corto: '¿Evoluciona un individuo?',
    enunciado:
      'A lo largo de su vida, un mismo animal adulto, ¿puede evolucionar y ' +
      'adaptarse genéticamente a un nuevo ambiente?',
    opciones: [
      'No: quien evoluciona es la población a lo largo de las generaciones; ' +
        'un individuo adulto no cambia sus genes por vivir en otro ambiente.',
      'Sí: se va adaptando poco a poco durante su vida y transmite esos ' +
        'cambios a sus crías.',
      'Sí: si el ambiente se lo exige, su cuerpo desarrolla lo que necesita.'
    ],
    correcta: 0,
    pred: { LAMARCK: 1, FINALISMO: 2 },
    explicacion:
      'La evolución le ocurre a las poblaciones a lo largo de las ' +
      'generaciones, no a un individuo durante su vida. Un adulto puede ' +
      'aclimatarse (broncearse, ganar músculo), pero eso no cambia sus genes ' +
      'ni pasa a sus hijos.'
  },
  {
    id: 'q19', corto: '¿Hacia seres más perfectos?',
    enunciado:
      '¿Es cierto que la evolución va haciendo a los seres vivos cada vez ' +
      'más perfectos o superiores?',
    opciones: [
      'Sí: la evolución tiene una dirección y mejora a las especies con el ' +
        'tiempo.',
      'No: solo favorece lo que funciona en cada ambiente; un rasgo «mejor» ' +
        'en un sitio puede ser un estorbo en otro, y muchos cambios no ' +
        'mejoran nada.',
      'Sí, siempre que los individuos se esfuercen en mejorar y lo ' +
        'transmitan a sus crías.'
    ],
    correcta: 1,
    pred: { FINALISMO: 0, LAMARCK: 2 },
    explicacion:
      'La evolución no persigue la perfección ni tiene una escala de ' +
      '«superioridad». Solo favorece variantes útiles aquí y ahora; lo ' +
      'ventajoso en un ambiente puede ser perjudicial en otro, y muchos ' +
      'rasgos se extienden sin mejorar nada.'
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
 *  - dominio (SELECCION): 0.90 en la correcta, resto repartido (techo de
 *    descuido);
 *  - marco atacado por la pregunta: 0.75 en su distractor y 0.15 de
 *    acierto (por debajo del suelo de azar: el distractor lo atrae);
 *  - marco no atacado: afectación parcial (0.50 de acierto), con cierta
 *    atracción hacia el distractor intuitivo del otro marco (0.30).
 */
function verosimilitudes(item) {
  return HIPOTESIS.map(function (h) {
    const fila = new Array(PARAMETROS.numOpciones).fill(0);
    if (h.id === 'SELECCION') {
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

/*
 * Ajuste del patrón individual (person-fit, índice l_z). Evalúa si el
 * patrón de respuestas es coherente con la hipótesis MAP: compara la
 * log-verosimilitud del patrón observado con su media y varianza
 * esperadas bajo esa hipótesis, promediando sobre las opciones de cada
 * ítem (generalización politómica del l_z clásico). Un valor muy
 * negativo (< -2) señala un patrón que ninguna hipótesis del modelo
 * explica bien —descuidos, azar o una concepción no contemplada— y el
 * diagnóstico debe tomarse con cautela, aunque el posterior sea alto.
 * Con pocas preguntas es orientativo, no una prueba formal.
 */
function personFit(posterior, historial) {
  const iMap = hipotesisMap(posterior);
  let logL = 0, esperanza = 0, varianza = 0;
  historial.forEach(function (paso) {
    const fila = verosimilitudes(paso.item)[iMap];
    logL += Math.log(fila[paso.respuesta]);
    let e = 0, e2 = 0;
    fila.forEach(function (p) {
      if (p > 0) {
        const lp = Math.log(p);
        e += p * lp;
        e2 += p * lp * lp;
      }
    });
    esperanza += e;
    varianza += e2 - e * e;
  });
  const lz = varianza > 0 ? (logL - esperanza) / Math.sqrt(varianza) : 0;
  return { lz: lz, fiable: lz >= -2 };
}
