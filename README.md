# ¿Cómo cambian las especies? — demostración de recurso adaptativo bayesiano (perfil B)

Recurso web estático que diagnostica **desde qué marco explica el alumnado la
evolución** de los seres vivos (Biología y Geología, ESO). Sirve como ejemplo
de trabajo del modelo **nominal excluyente (perfil B)** de la metodología de
[recursos adaptativos bayesianos](https://github.com/jjdeharo/recursos-adaptativos):
hipótesis mutuamente excluyentes y sin orden entre ellas, de modo que no se
usa IRT sino una **matriz de verosimilitudes explícita** por pregunta.

## Por qué las hipótesis son de verdad excluyentes

El modelo nominal excluyente solo es honesto si las hipótesis son **marcos
causales rivales** —el alumno razona desde uno a la vez—, no errores
independientes que se acumulan (esos exigirían un modelo multifactorial,
perfil C). Aquí las tres hipótesis son tres respuestas **incompatibles a una
misma pregunta**: *¿por qué una especie acaba teniendo un rasgo útil?* Ante
«¿la jirafa primero estiró el cuello o ya nació con él?», cada marco da una
respuesta distinta y una sola.

## Hipótesis

| Id | Marco | Idea central |
|----|-------|--------------|
| `LAMARCK` | El esfuerzo cambia el cuerpo y se hereda | El individuo adquiere el rasgo en vida (uso/desuso) y lo transmite: «la jirafa estiró el cuello y sus crías nacen con él». |
| `FINALISMO` | Las especies cambian porque lo necesitan | La evolución tiene una meta o intención: la especie desarrolla el rasgo «para» sobrevivir, porque le hace falta. |
| `SELECCION` | Modelo correcto | Variación heredable al azar + reproducción diferencial: el ambiente no crea el rasgo, favorece a los que ya lo tenían. |

El lamarckismo y el finalismo son dos de las concepciones alternativas sobre
la evolución más documentadas en didáctica de las ciencias, y persisten
durante toda la secundaria.

Cada pregunta ofrece tres opciones y sus **distractores están diseñados para
capturar cada marco**: el sistema usa la distribución completa
`P(respuesta | hipótesis, pregunta)`, no solo acierto/fallo. La selección de
la siguiente pregunta maximiza la ganancia esperada de información y el cierre
firme exige `max p ≥ 0,80` y entropía `≤ H_stop` con un mínimo de 4 preguntas
(máximo 10). El resultado reporta la hipótesis MAP, su confianza, la
distribución posterior completa y una recomendación pedagógica; si no se
alcanza la confianza mínima, se marca como provisional.

## Archivos

- `index.html` — recurso del alumno. Incluye un panel docente plegable con el
  estado bayesiano en directo (posterior, entropía y verosimilitud de la
  última respuesta), pensado para usar la página como demostración.
- `motor.js` — hipótesis, banco de preguntas, matriz de verosimilitudes,
  actualización bayesiana, selección adaptativa, criterio de parada y
  person-fit.
- `validacion.html` — **herramienta del autor** (no del alumnado): validación
  Monte Carlo de la separabilidad del diseño, con matriz de confusión sobre
  respondentes sintéticos y tasa de falsas alarmas del aviso de person-fit.

Todo funciona en local sin servidor: basta abrir `index.html` en el navegador.

## Person-fit (índice l_z)

Al cerrar la sesión se comprueba si el patrón de respuestas es coherente con
la hipótesis diagnosticada (generalización politómica del índice `l_z`,
calculada sobre la opción elegida en cada ítem). Si `l_z < −2`, el resultado
se acompaña de un aviso de fiabilidad: puede haber descuidos, azar o una idea
sobre la evolución que el modelo no contempla. Con pocas preguntas es una
señal de cautela orientativa, no una prueba formal. El valor se muestra en
directo en el panel docente.

## Fiabilidad bajo el modelo

Con un banco de 19 ítems y 500 simulaciones por hipótesis (semilla fija):
~97 % de clasificación correcta en la diagonal, ~4 preguntas de media y 100 %
de cierres firmes, sin confusiones sistemáticas entre marcos. Es separabilidad
interna del diseño, no validez empírica: las verosimilitudes son juicios
didácticos a priori, no parámetros calibrados con datos reales.

## Variedad en la primera pregunta

La mayoría de los 19 ítems son **discriminadores a tres bandas**: una opción
encarna cada marco (`LAMARCK` / `FINALISMO` / `SELECCION`), de modo que la
respuesta separa las tres hipótesis a la vez. Desde el prior uniforme, esos
ítems empatan en ganancia esperada de información, así que la sesión no siempre
abre con la misma pregunta: el desempate aleatorio reparte el inicio entre
ellos. El banco incluye además algún ítem que aísla un solo marco (la lesión
que no se hereda, para el lamarckismo; el órgano vestigial, para el finalismo)
y probes conceptuales (individuo frente a población, la idea de «progreso»),
que dan textura y variedad al recorrido sin restar separabilidad.
