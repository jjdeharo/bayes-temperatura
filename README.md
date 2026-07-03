# ¿Frío o caliente? — demostración de recurso adaptativo bayesiano (tipo C)

Recurso web estático que diagnostica **qué modelo mental sobre el calor y la
temperatura** usa el alumnado (Física y Química, ESO). Sirve como ejemplo de
trabajo del modelo **nominal unifactorial (tipo C)** de la metodología de
[recursos adaptativos bayesianos](https://github.com/jjdeharo/recursos-adaptativos):
hipótesis mutuamente excluyentes y sin orden entre ellas, de modo que no se
usa IRT sino una **matriz de verosimilitudes explícita** por pregunta.

## Hipótesis

| Id | Modelo mental | Concepción errónea |
|----|---------------|--------------------|
| `TACTO` | El tacto mide la temperatura | Cree que lo que notamos al tocar es la temperatura real: «el metal está más frío que la madera». |
| `ABRIGO` | La ropa produce calor | Piensa que abrigos, mantas y lana generan calor por sí mismos, en lugar de aislar. |
| `OK` | Modelo correcto | Equilibrio térmico, conducción y aislamiento. |

Son dos de las concepciones erróneas sobre calor y temperatura más
documentadas en didáctica de las ciencias, y persisten durante toda la
secundaria.

Cada pregunta ofrece tres opciones y sus **distractores están diseñados para
capturar cada modelo mental**: el sistema usa la distribución completa
`P(respuesta | hipótesis, pregunta)`, no solo acierto/fallo. La selección de
la siguiente pregunta maximiza la ganancia esperada de información y el
cierre firme exige `max p ≥ 0,80` y entropía `≤ H_stop` con un mínimo de 4
preguntas (máximo 10). El resultado reporta la hipótesis MAP, su confianza,
la distribución posterior completa y una recomendación pedagógica; si no se
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
se acompaña de un aviso de fiabilidad: puede haber descuidos, azar o una
concepción sobre el calor que el modelo no contempla. Con pocas preguntas es
una señal de cautela orientativa, no una prueba formal. El valor se muestra
en directo en el panel docente.

## Fiabilidad bajo el modelo

Con 2000 simulaciones por hipótesis: 96–98 % de clasificación correcta en la
diagonal, ~4,2 preguntas de media y ~100 % de cierres firmes. Es separabilidad
interna del diseño, no validez empírica: las verosimilitudes son juicios
didácticos a priori, no parámetros calibrados con datos reales.

## Variedad en la primera pregunta

El banco incluye varias preguntas (`q4`, `q11`, `q12`, `q13`) que atacan a la
vez las dos concepciones erróneas en un mismo escenario (dos materiales de
distinta conductividad, con una opción por cada hipótesis). Desde el prior
uniforme, esas preguntas empatan en ganancia esperada de información y son
más informativas que el resto, así que la sesión no siempre abre con la
misma: el desempate aleatorio reparte el inicio entre las cuatro.
