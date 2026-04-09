---
title: 'Taller de escritura académica. Recursos y herramientas.'
date: 2026-04-08
documentclass: scrartcl
toc: false
fontsize: 14pt
always_allow_html: true
mermaid: true
output:
  md_document:
    variant: gfm
    preserve_yaml: true 
  bookdown::pdf_document2:
    keep_md: true
    latex_engine: xelatex
    template: /Users/ramiroalvarezugarte/Library/CloudStorage/Dropbox/Templates/draft_article_new.tex
fig_width: 1
fig_height: 0.5
number-sections: no
linkcolor: black
---

Este documento se puede descargar en PDF, [aquí](/files/taller_escritura_academica.pdf).

Este documento presenta, de manera muy esquemática y sencilla, algunos
recursos y herramientas que pueden hacer que la tarea de escribir
trabajos académicos sea más divertida y eficiente. Son apuntes
estructurados rápidamente, sin mayor pretensión que compartir algunos
*links* y consejos desperdigamos, con el fin de que orienten o inspiren
una práctica. Se divide en dos secciones, porque la escritura académica
implica dos cosas: *investigar* y *escribir*, en ambos casos con
restricciones propias del campo o la disciplina en la que se desea
intervenir.

# Investigar

## Ordenar la información

No se puede investigar sin que la etapa de búsqueda y recopilación de
información sea ordenada. Para eso, es conveniente empezar a usar lo
antes posible un gestor de bibliografía: recomiendo
[Zotero](https://www.zotero.org/). Es software *libre* (*free as in
freedom*), lo que asegura permanencia en el tiempo e interoperabilidad.
Está en todas las plataformas.

Las funciones principales de Zotero son:

- *Captura automática de metadatos* desde navegadores web (con el
  *Zotero Connector*): un clic para guardar un artículo de JSTOR, SSRN,
  Google Scholar, o un sitio web. *Consejo* → es posible crear
  conectores personalizados, tengo dos para Infoleg (leyes) y la página
  de la Corte Suprema (fallos de la CSJN) — *ver abajo*.
- *Organización* en colecciones y subcarpetas, con etiquetas (*tags*) y
  búsqueda avanzada.
- *Almacenamiento de PDFs* adjuntos, con anotaciones integradas
  (resaltado, notas). *Consejo* → almacenar los PDFs con *links
  relativos* en una carpeta única sicronizada con algún servicio en “la
  nube”, con plugin *Attanger*.
- *Generación automática de citas y bibliografías* en más de 10.000
  estilos (APA, Chicago, Bluebook, etc.) mediante CSL (ver sección 5).
  *Consejo* → Armé algunos CSL diseñados para revistas argentinas (que
  andan más o menos bien o al menos producen lindas primeras versiones)
  — *ver abajo*.
- *Plugins para procesadores de texto*: integración con Word,
  LibreOffice y Google Docs.
- *Sincronización* entre dispositivos vía Zotero Sync (almacenamiento
  gratuito limitado, pero—*tip*—si los archivos se guardan en carpetas
  en la nube, es suficiente para bibliotecas muy grandes).

*Plugins* recomendados:

- *[Better BibTeX](https://retorque.re/zotero-better-bibtex/)*:
  exportación a BibTeX/BibLaTeX para usuarios de LaTeX/Pandoc.
- *[Attanger](https://github.com/MuiseDestiny/zotero-attanger)*, para
  manejar los archivos (funciona mejor, creo, que la función nativa).

## Notas y fichas

Investigar también supone tomar notas. Para ello recomiendo
[Obsidian](https://obsidian.md/), una aplicación de notas basada en
archivos Markdown locales, con soporte nativo para enlaces internos
(`[[nota]]`) y visualización de gráficos de conocimiento en forma de
red. Tiene algunas ventajas: archivos en Markdown plano (portables, no
dependes de la app), enlaces bidireccionales entre notas, búsqueda
potente y etiquetas, *plugins* comunitarios (Zotero integration, Pandoc
export, Dataview, etc.). Y funciona offline: los datos son tuyos y viven
en tu computadora [^1].

Una práctica sistemática de notas y fichas es importante porque la
investigación académica genera un volumen enorme de lecturas, ideas y
conexiones. Es difícil generar un sistema que funcione perfecto de
entrada, y que sea sostenible en el tiempo. Siempre vamos cambiando
nuestras rutinas, nuestras formas de trabajo, y el tiempo que le
dedicamos a cada tarea. Pero tener la *intención*—al menos—de que ese
flujo de trabajo sea lo más eficiente posible siempre es valioso. En ese
contexto, desde hace un tiempo diversos servicios se han desarrollado
alrededor de la idea del *segundo cerebro*: un sistema externo y
organizado donde se almacenan notas y documentos, se conectan entre sí,
y se recuperan ideas. Adoptar algunos de estos sistemas es especialmente
prometedor debido a la forma en que podemos hacer que la inteligencia
artificial interactúe con ellos.

Los principios clave son:

1.  *Capturar* todo lo relevante (citas, ideas propias, preguntas) — en
    el momento en el que se producen.
2.  *Organizar* por proyecto o área, no solo por tema.
3.  *Conectar* notas entre sí mediante enlaces internos (*links*). Las
    conexiones inesperadas producen ideas originales.
4.  *Recuperar* fácilmente cuando se necesita escribir.

{{< mermaid >}}
flowchart LR
    subgraph INVESTIGAR
        A["ENCONTRAR<br/><small><i><code>Google Scholar</code></i></small><br/><small><i><code>Biblioteca</code></i></small><br/><small><i><code>AI Agent</code></i></small><br/><small><i><code>Revistas jurídicas</code></i></small>"] --> |guardar| B("Zotero")
        A --> |anotar| C("Obsidian")
    end

    subgraph ESCRIBIR
        B --> D["REDACTAR"]
        C --> D
        subgraph OUTPUT [" "]
            direction TB
            E["archivo<br/><small><i><code>.docx</code></i></small><br/><small><i><code>.odt</code></i></small><br/><small><i><code>.md</code></i></small><br/><small><i><code>.Rmd</code></i></small>"]
            F["citas automáticas<br/><small><i><code>CSL via Zotero o Pandoc-citeproc</code></i></small>"]
            E <-.-> F
        end
        D --> OUTPUT
    end

    style OUTPUT fill:#e8e8e8,stroke:#888,stroke-dasharray: 5 5
    style INVESTIGAR fill:#e8e8e8,stroke:#999
    style ESCRIBIR fill:#e8e8e8,stroke:#999
    style A fill:salmon,color:#000
    style D fill:salmon,color:#000
    style B fill:#fff,stroke:#333
    style C fill:#fff,stroke:#333

    F <-.-> B
{{< /mermaid >}}

# Escribir

Escribir implica sentarse a pensar, batallar con ideas e intuiciones,
con otros autores, con hechos del mundo en un formato específico
(escrito) y con una finalidad determinada, en general *argumentativa*.
Escribir debería ser una experiencia placentera: es el momento en el que
las ideas dispersas se ordenan para formar un argumento, producir un
conocimiento nuevo que no existía, llamar la atención sobre un problema.
Escribimos con un *objeto* o *fin*—una cierta intervención en el mundo.
Para ello, con el tiempo, desarrollamos nuestra propia voz—con sus
sesgos, sus giros, sus espacios de comodidad. Mi consejo es siempre
luchar contra eso para renovarnos más o menos permanentemente. A
continuación recopilo algunas herramientas que me han sido útiles para
mejorar mi propia escritura.

## Las seis reglas de Orwell

Un escritor magnífico, famoso por su atención al lenguaje. En un texto
fundamental de 1946 —*Politics and the English Language*— da una serie
de consejos que, durante un tiempo, yo tenía impresos en mi escritorio.

1.  *Nunca utilices una metáfora, un símil u otra figura retórica que
    estés acostumbrado a ver impresa.* Las metáforas muertas (“punta del
    iceberg”, “caldo de cultivo”) ya no evocan imágenes; son ruido.

2.  *Nunca uses una palabra larga donde una corta servirá*. “Utilizar”
    vs. “usar”. “Implementar” vs. “hacer”. Siempre es preferible la
    claridad y la brevedad.

3.  *Si es posible recortar una palabra, córtala siempre*. Cada palabra
    debe ganarse su lugar en la oración. “En el caso de que” → “si”.
    “Con el objetivo de” → “para”. Este consejo es especialmente útil
    para la etapa de edición: *editar* es *cortar*.

4.  *Nunca uses el pasivo donde puedes usar el activo…*. “El contrato
    fue rescindido por la parte demandada” → “La parte demandada
    rescindió el contrato.” La voz activa identifica al agente y es más
    directa; la pasiva introduce confusiones innecesarias.

5.  *Nunca utilices una frase extranjera, una palabra científica o una
    palabra de jerga si puedes pensar en un equivalente cotidiano en tu
    idioma*. *Mutatis mutandis*, *inter alia*, *erga omnes*… solo cuando
    el término técnico sea insustituible. Especialmente útil para el
    derecho.

6.  *Rompe cualquiera de estas reglas antes que decir algo abiertamente
    ridículo…*. Las reglas son guías, no dogmas. Si cumplir una regla
    produce un texto peor, rómpela.

**Prueba de Orwell**. Antes de escribir una oración, preguntarse: *¿Qué
estoy tratando de decir? ¿Qué palabras lo expresarán? ¿Qué imagen o
modismo lo aclarará más? ¿Es esta imagen lo suficientemente fresca como
para tener efecto? ¿Podría decirlo más brevemente? ¿He dicho algo que
sea evitablemente feo?*

## El esquema IRAC (y variantes)

IRAC es el método estándar de análisis legal en Estados Unidos.
Estructura el razonamiento jurídico de forma predecible y replicable. En
ocasiones puede parecer una restricción excesiva: los mejores textos
legales que *yo* he leído *jamás* siguieron esta estructura \[^fn3\].
Pero sirve para ganar claridad, especialmente en primeras versiones de
un trabajo. Y sirve también, especialmente, para pensar en artículos que
aborden una cuestión *muy concreta*, un problema jurídico que no ha
recibido atención suficiente y cuya solución puede ser útil para jueces
y abogados.

### IRAC clásico

| Elemento | Función | Ejemplo |
|----|----|----|
| *I* — Issue | Identificar la cuestión jurídica | “¿Constituye la cláusula X una restricción irrazonable del comercio?” |
| *R* — Rule | Enunciar la norma aplicable | “Bajo la Sección 1 del Sherman Act, se prohíben los acuerdos que restrinjan irrazonablemente el comercio…” |
| *A* — Application | Aplicar la norma a los hechos | “En este caso, las partes acordaron fijar precios mínimos de reventa, lo cual bajo *Leegin* se analiza con la regla de la razón…” |
| *C* — Conclusion | Responder la pregunta planteada | “Por lo tanto, la cláusula probablemente constituye una restricción irrazonable.” |

### Variantes comunes

- *CRAC* (*Conclusion–Rule–Application–Conclusion*): Abre con la
  conclusión. Útil en memorandos y briefs donde el lector quiere la
  respuesta primero.
- *CREAC* (*Conclusion–Rule–Explanation–Application–Conclusion*): Agrega
  un paso de *Explanation* donde se ilustra la regla con precedentes
  antes de aplicarla.
- *TREAT* (*Thesis–Rule–Explanation–Application–Thesis*): Similar a
  CREAC, renombra la conclusión como “tesis”.
- *CRuPAC* (*Conclusion–Rule–Proof–Application–Conclusion*): Variante
  que distingue entre la regla abstracta y su prueba con jurisprudencia.

## Un consejo de Jerry Cohen

Se aprende intuitivamente luego de leer mucho. Pero es muy usual (p.ej.,
leyendo a filósofos del derecho como H.L.A. Hart) encontrar este esquema
en un paper: *di lo que vas a dacir / dilo / di lo que dijiste*.
Introducción, desarrollo, conclusión. Es un estándar de la filosofía
analítica. Son movimientos repetitivos que ayudan a ordenar y precisar
el argumento, con cierto minimalismo pero —también— con un objetivo
claro: enfatizar los puntos principales y ayudar al lector a mantener la
atención en lo importante.

## Citas

Las convenciones académicas exigen la atribución de las ideas a quienes
las tuvieron y la identificación precisa de las fuentes. Para ello
usamos diversos *estilos de citas*. Formatear citas a mano es:

- *Tedioso*: cada estilo tiene reglas distintas (*supra*, *id.*, *op.
  cit.*; punto vs. coma; año entre paréntesis o al final).
- *Propenso a errores*: una cita mal formateada resta credibilidad.
- *No escalable*: cambiar de revista implica reformatear toda la
  bibliografía.

La solución es descansar en los formatos CSL (Citation Style Language).
Es un estándar abierto (basado en XML) que describe reglas de formato de
citas. Zotero, Mendeley y otros gestores lo utilizan y —con herramientas
de AI— ahora es fácil de customizar.

- Más de *10.000 estilos* disponibles en el [repositorio CSL de
  Zotero](https://www.zotero.org/styles).
- Incluye estilos para derecho: Bluebook (Estados Unidos), OSCOLA
  (Inglaterra y países del *Commonwealth*), Revista Española de Derecho
  Internacional, etc.
- Si la revista en la que quieres publicar no tiene estilo CSL, se puede
  crear o adaptar uno existente con el *[CSL Visual
  Editor](https://editor.citationstyles.org)*. No lo he intentado pero
  esto debe ser facilísimo con herramientas de inteligencia artificial.

El flujo es automatizable:

1.  Guardar referencia en Zotero (una vez)
2.  Insertar cita en el texto → Zotero la formatea automáticamente
3.  Cambiar de revista → Cambiar el estilo CSL → Todas las citas se
    reformatean

En [este link](https://github.com/ramiroau/gacl) hay algunos recursos
adicionales: conectores de Zotero para Infoleg y la página de la CSJN
(Sumarios) y algunos archivos CSL para Lecciones y Ensayos, La Ley, y
Sistema Interamericano.

También está la opción de escribir en [plain
text](https://ramiroau.github.io/recursos/) para usuarios avanzados.

1.  Exporta bibliografía a formato `.bib` (Better BibTeX, sincronización
    automática) o `CSL JSON`.
2.  `Pandoc` lee el archivo y aplica CSL al compilar [^2].
3.  Output en PDF, Word, HTML, etc.

Esto permite escribir en Markdown puro con citas como
`[@smith2020, p. 45]` y generar el documento final con bibliografía
formateada automáticamente. Un buen recurso para adentrarse en esta
aventura es
[este](https://kieranhealy.org/files/papers/plain-person-text.pdf).

# Inteligencia artificial

Tanto en la etapa de la *investigación* como en la de *escribir* podemos
recurrir a herramientas de inteligencia artificial. Si bien son
novedosas, son enormemente potentes y calculo que su uso será extendido
dentro de pocos meses. Por ahora sugeriría abrazar estas herramientas
con cuidado. Mis consejos arbitrarios—a abril de 2026—son los
siguientes.

![](/pics/safety.jpg "Una referencia a la generación X.")

## Usos más o menos seguros

- *Lluvia de ideas y brainstorming*: generar ángulos, preguntas de
  investigación, contraargumentos. Siempre recordar que estamos hablando
  con una máquina predictiva y no una persona.
- *Mejorar la claridad*: pedir que reformule un párrafo confuso. Pero,
  con cuidado: *tu voz es tu voz, que no te reemplacen*.
- *Revisar gramática y estilo*: como un corrector ortográfico avanzado.
- *Traducir borradores*: como punto de partida para traducción, no como
  producto final.
- *Explicar conceptos*: “Explícame la doctrina del *margin of
  appreciation* como si fuera un estudiante de grado.”. Mucho cuidado:
  además del problema de las alucinaciones, las explicaciones pueden ser
  simplemente incorrectas. Imposible de usar así si no se leyeron de
  manera previa textos de calidad, y se contrastan las respuestas de la
  IA contra ellos.
- *Generar esquemas (outlines)*: estructura inicial para un artículo o
  capítulo. Pero, cuidado: las herramientas de IA tienen varios
  problemas, entre ellos el “sesgo de la pregunta” (siempre considerará
  que tu pregunta es buena, que la teoría aplica, que la hipótesis
  seguramente se sostiene, etcétera). Avanzar con mucho cuidado en ese
  uso.
- *Depurar código y fórmulas*: LaTeX, R, Python, CSL. Todo lo que sea
  código funciona básicamente bien en con IA.
- *Formatear bibliografía*: convertir citas de un formato a otro. Un
  paso innecesario si tenemos un buen uso de Zotero.

## Mejor evitar

- *No presentar texto generado por IA como propio* sin revisión
  sustancial y sin divulgación según las normas de la
  institución/revista.
- *No confiar en sus citas*: la IA *alucina* referencias. Inventa
  autores, títulos, años, y números de página con total confianza.
  *Verificar cada cita contra la fuente original.*
- *No delegar el argumento*: la IA no tiene una tesis, podría inventar
  una. El que piensa sos vos. Usarla para *decorar* un argumento vacío
  produce texto vacío bien decorado.
- *No usarla para áreas que no dominas*: si no puedes evaluar si la
  respuesta es correcta, no puedes usarla de forma responsable.
- *No sustituir la lectura*: resumir un artículo con IA no es haberlo
  leído. Los matices, las notas al pie, las tensiones internas del texto
  se pierden. Se pierde, también, la *densidad* que se alcanza con una
  lectura concentrada, que es el momento en el que se generan de manera
  paralela las ideas y las conexiones.
- *No ignorar las políticas institucionales*: cada universidad, revista
  y jurisdicción tiene (o tendrá) reglas sobre el uso de IA. Conocerlas
  es responsabilidad del autor.
- *No asumir confidencialidad*: lo que se ingresa en un chatbot puede
  ser usado para entrenamiento (salvo configuración explícita en
  contrario).

## Algunos links

| Recurso | Enlace |
|----|----|
| Orwell, “Politics and the English Language” | Disponible [en línea](https://www.orwellfoundation.com/the-orwell-foundation/orwell/essays-and-other-works/politics-and-the-english-language/) |
| Zotero | <https://www.zotero.org> |
| Obsidian | <https://obsidian.md> |
| Pandoc | <https://pandoc.org> |
| CSL (Citation Style Language) | <https://citationstyles.org> |
| Better BibTeX for Zotero | <https://retorque.re/zotero-better-bibtex/> |

------------------------------------------------------------------------

Texto actualizado a abril de 2026.

[^1]: Cover, *Foreword: Nomos and Narrative* (1983); Hartog, *Pigs and
    Positivism* (1985); Post & Siegel, *Roe Rage: Democratic
    Constitutionalism and Backlash* (2007) — por nombrar tres.

[^2]: *Pandoc* es un conversor universal de documentos, creado por John
    MacFarlane (filósofo y programador, UC Berkeley). Convierte entre
    decenas de formatos desde la línea de comandos.
