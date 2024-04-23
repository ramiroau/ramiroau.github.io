---
title: Escritura en plain text, citas y automatización
author: Ramiro Álvarez Ugarte
date: 2020-10-12
draft: false
status: published 
type: post
tags: ["R", "plain-text"]
toc: false
---

Esto estaba en *borrador* desde hace mucho tiempo, porque usualmente recibo consultas sobre cómo escribir en *plain text* y cuestiones vinculadas al manejo de la bibliografía (especialmente con referencia a la automatización de citas). Una consulta de [Claudio Ruiz](https://claudioruiz.com/)---quien me presentó el mundo Markdown y `pandoc` hace muchos años---me terminó de empujar a publicar y a actualizar, porque la metodología (*mí* metodología) fue cambiando mucho con el paso del tiempo. Lo que sigue es, entonces, una forma de producir que me resulta útil a mí. No es la mejor, quizás no sea para usted, pero aquí está. 

El primer paso es justificar la excentricidad. Lo que empezó como una preferencia por al escritura "libre" (es decir, sin restricciones de licencias y de formatos) terminó siendo una metodología de producción académica. La comparto con la advertencia previa porque creo que tiene los siguientes beneficios: 

1. Permite separar a la escritura del acto de formateo de los documentos. Sirve para enfocar nuestra atención y aprovechar el tiempo al máximo. En general, darle formato a un documento lleva tiempo y, a menos que se tengan muy buenas prácticas, el proceso ante un procesador de texto, tanto en versión propietaria (Word) como libre (p.ej., Libre Office) es un proceso engorroso y muy *error-prone*. 

2. Permite un manejo automatizado de citas. En la producción académica, las citas son una gran parte del trabajo. Como cualquier investigador sabe, las citas son los que nos permite recorrer una literatura, descubrir su desarrollo, ver su evolución. Sin citas no podría haber producción académica. En general, el trabajo de citar puede ser molesto si no se tiene un flujo de trabajo cuidadosamente diseñado. Las herramientas que voy a compartir son---además de ser software libre *as in freedom*---útiles para hacer ese trabajo más rápido y de manera más consistente. Adoptar estas herramientas permite escribir *sin prestar atención al formato de la cita* hasta la etapa final del borrador. 

3. Da mejores resultados estéticos. Los procesadores de texto, basados en el modelo de WYSIWYG son notablemente malos en términos de diseño. Tienen tipografías poco sofisticadas (aunque, algunos clásicos, nunca decepcionan como *Times*, *Times New Roman* o *Garamond*) y---en general---el manejo de los espacios de la página es bastante arbitrario. A menos que se tenga (a) un template muy bien diseñado o (b) un cuidadoso trabajo de armar cada elemento con criterios tipográficamente aceptables, el resultado final es---en general---una catástrofe. Las herramientas que voy a compartir tienen dos ventajas en relación a esa alternativa. En primer lugar, delegan muchas de esas decisiones a un programa que tiene los *parámetros aceptables de la tipografía* ya incorporados a su código, diseñado por nada más y nada menos que [Donald Knuth](https://es.wikipedia.org/wiki/Donald_Knuth). Eso significa que es difícil cometer errores tipográficos: el programa permanentemente intenta impedir que hagamos tonterías. En segundo lugar, las herramientas que compartiré facilitan la conversión de formatos: es fácil convertir nuestros textos en archivos `docx`, `otd`, `pdf`, `html`, `epub` etcétera. 

# Herramientas y flujo de trabajo

## Escribir en Markdown

El primer paso es empezar a escribir en Markdown. Es una forma de escribir que es independiente del formato y puede hacerse sobre diversas herramientas: desde un mismo procesador de texto hasta el "Bloc de notas" de un sistema operativo como Windows. Personalmente, prefiero [Sublime Text 3](https://www.sublimetext.com/3), aunque he escuchado buenos reportes de [Vim](https://www.vim.org/). Si quisiéramos explorar al máximo el mundo del software libre, podríamos probar con [Emacs](https://www.gnu.org/software/emacs/). 

Lo bueno de estos programas es que permiten diversas formas de manipulación de texto (como la *multiselección*) y están disponibles en múltiples plataformas. También permiten un manejo casi automatizado de las versiones de los documentos, algo que se puede hacer---por ejemplo---con [Git](https://git-scm.com/). En mi caso, como los archivos en Markdown son muy livianos, prefiero hacer esto de manera manual (p.ej., `borrador_capitulo_v2.md`), aunque a medida que los proyectos se vuelven más complejos y muy dependientes en análisis de datos la opción de un mecanismo automatizado parece más atractiva. Aprender a escribir en Markdown es facilísimo: [no lleva más de diez minutos](https://markdown.es/). 

Una vez que aprendimos a hacer eso podemos crear nuestro primer archivo en Markdown. 

```

Este es un archivo en *Markdown*. Muestra distintas formas de señalar cuando queremos que una palabra sea *cursiva* o **negrita**.

También podemos poner notas al pie ^[Así de manera rápida]. O con referencias al pie [^fn1]. 

O con un link, por ejemplo, [a Google](www.google.com).

También podemos citar trabajos de autores conocidos, como bien hiciera Robert Post [@post2010, 1343]. 

[^fn1]: Esto es una nota al pie.  

```

Podemos guardar ese archivo como *borrador.md*. 
 
## Convertir a otros formatos

Para procesar ese texto, vamos a necesitar algunos programas que hay que instalar. Aquí identifico a los que yo uso, en algunos casos hay alternativas (p.ej., [Zotero](https://www.zotero.org/) puede ser reemplazado por *Mendeley* o *Papers*). Con *asterisco*, los esenciales. 

- [Pandoc](https://pandoc.org/) (*)
- [LaTeX](https://miktex.org/) (*)
- [Biblatex](https://www.ctan.org/pkg/biblatex) (*)
- [Zotero](https://www.zotero.org/) (*) + plugin [BetterBibTex](https://retorque.re/zotero-better-bibtex/)
- [Rmarkdown](https://rmarkdown.rstudio.com/)
- [Knitr](https://yihui.org/knitr/)

Una vez que tenemos instalados todos los programas podemos empezar por la conversión más sencilla: de Markdown a PDF. Ello requiere ir al comando de línea y dar la siguiente orden, desde la carpeta en la que se encuentre el archivo que queremos convertir. 

```
pandoc borrador.md -o borrador.pdf 
```

La orden es que `pandoc` convierta el archivo Markdown en un *ouput* (-o): formato PDF. Para realizar esta conversión, Pandoc utiliza un motor de LaTeX. Veremos más adelante que, en ocasiones, podemos precisarlo (y tiene sus ventajas). El proceso se ve más o menos así: 

![](/pics/diagrama_plain_text.png "Diagrama muy básico del flujo de trabajo")
*Esquema básico del flujo de trabajo*

## Bibliografía y formatos de citas
 
La bibliografía debe estar guardada en formato `.bib` o `.json`. Eso lo podemos hacer de manera sencilla con diversos organizadores de bibliografías en este formato. Yo utilizo *Zotero* porque (a) es software libre y (b) funciona como un gran ordenador de materiales, tanto físicos como digitales (los PDF se guardan en el mismo Zotero o en una carpeta de Dropbox o Google Drive vinculada a Zotero). El uso de Zotero no debería presentar mayores dificultades: es como un sistema de archivos dedicados sólo al manejo de bibliografías académicas y de investigación. 

Desde *Zotero*, lo que tenemos que hacer es exportar los trabajos que forman parte de nuestra bibliografía al formato `.bib` o `.json` [^fn1]. También se puede mantener un archivo `.bib` actualizado permanentemente de manera automática con [AutoZotBib](rtwilson.com/academic/autozotbib), pero yo hasta el momento preferí que cada proyecto tenga su propio archivo de bibliografía. Así, p.ej, podemos llamar a nuestro archivo con bibliografía `bibliografia.bib`. La construcción de nuestro archivo de bibliografía la podemos hacer de dos maneras: a través de la selección de los diversos ítems que la integran y su posterior extracción desde Zotero o a través de la conformación manual del archivo, gracias a un *shortcut* que permite Zotero en `Preferences > Export > Quick Copy`. La primera opción exige ir guardando cada ítem en una carpeta o con el mismo tag (la segunda opción parece más versátil, porque---por ejemplo---yo tengo a Zotero organizado por carpetas temáticas más que de proyecto). La segunda opción es la que uso usualmente: a medida que voy escribiendo, voy agregando manualmente gracias al Quick Copy de Zotero cada ítem a un archivo `.bib` o `.json` que mantengo actualizado. En general hacia el final pandoc me informa que hay varias citas que no están en la bibliografía, así: `reference post2010 not found`. Cuando eso me pasa junto todos los ítems faltantes, los pego en Sublime Text y ahí corro los comandos `unique lines` y `sort lines` para eliminar duplicados y ponerlos en orden alfabético. Completar la bibliografía no me lleva más de quince minutos, incluso cuando los faltantes son cerca de cien. 

Ese archivo de bibliografía va a ser así: 

```
@article{post2010,
  title = {Theorizing Disagreement: {{Reconceiving}} the Relationship between Law and Politics},
  shorttitle = {Theorizing Disagreement},
  author = {Post, Robert},
  date = {2010},
  journaltitle = {California Law Review},
  volume = {98},
  pages = {1319--1350},
  eprint = {27896713},
  eprinttype = {jstor},
  file = {/Users/ramiroalvarezugarte/Google Drive/ZoteroFiles/Post_2010_Theorizing disagreement.pdf},
  issue = {1}
}
```

O así optamos por `bibliografia.json`: 

```
[
	{
		"id": "post2010",
		"type": "article-journal",
		"container-title": "California Law Review",
		"issue": "4",
		"page": "1319–1350",
		"source": "Google Scholar",
		"title": "Theorizing Disagreement: Reconceiving the Relationship Between Law and Politics",
		"title-short": "Theorizing disagreement",
		"URL": "http://www.jstor.org/stable/27896713",
		"volume": "98",
		"author": [
			{
				"family": "Post",
				"given": "Robert"
			}
		],
		"accessed": {
			"date-parts": [
				[
					"2014",
					12,
					7
				]
			]
		},
		"issued": {
			"date-parts": [
				[
					"2010"
				]
			]
		}
	}
]
```


Fíjense que ambos archivos tienen todos los datos necesarios para construir una bibliografía: título, autor, publicación, volumen, etcétera. Esta información en Zotero se puede cargar de tres maneras distintas: 

1. La podemos cargar manualmente en Zotero, cuando queremos p.ej., cargar los datos de un libro viejo que tenemos en casa, un fallo judicial que no está en repositorios en línea, etcétera. 

2. Si el libro es nuevo, lo podemos buscar en Google Books o Amazon. Si lo encontramos, con el [Zotero Connector](https://chrome.google.com/webstore/detail/zotero-connector/ekhagklcjbdpajgpjgmbionohlpdbjgc?hl=es) carga la información directamente desde la página. 

3. La mayoría de los repositorios de papers académicos (incluido [Google Scholar](https://scholar.google.com/)) permite---también---usar el botón de conector de Zotero. 

En general la información se carga bien, pero a veces tenemos que revisar que la carga haya sido bien hecha (p.ej., quizás el *conector* no puso la información sobre el "volúmen" de la Revista Académica correspondiente). En esto, el mejor flujo de trabajo es uno que se preocupa de que la información se cargue bien "la primera vez" (y luego nos podemos olvidar de eso). 

Ahora podemos hacer que nuestra cita al texto de Post tenga una forma determinada de acuerdo a un estilo de cita determinado. Para buscar esos estilos, debemos ir al [*Zotero Style Repository*](https://www.zotero.org/styles) y elegir. Probemos p.ej. con APA, sexta edición. Vamos a obtener un archivo `apa-6th.edition.csl` y lo vamos a colocar an la carpeta en la que está nuestro `borrador.md` y nuestra `bibliografia.bib`. Tenemos ahora todo para producir nuestro documento, con la cita que deseamos, y en el formato que deseamos. Empecemos por una conversión a formato PDF. 

```
pandoc --citeproc --bibliography=bibliografia.json --csl=apa-6th-edition.csl --pdf-engine=xelatex borrador.md -o borrador.pdf 
```

Lo que agregamos es lo siguiente: 

- Con `--citeproc` le damos la orden a `pandoc` para que considere la bibliografía. 
- Con `--bibliography` identificamos el archivo correspondiente. 
- Con `--csl` identificamos el estilo que queremos usar. 
- Con `--pdf-engine` identificamos el *motor* de LaTeX que se va a usar para hacer la conversión (sirve si usamos fuentes tipográficas fuera de las que vienen por default; en ese caso uso `xelatex`). 

Para convertir a otros formatos la cosa es aún más sencilla: 

```
pandoc borrador.md -o borrador.html 
pandoc borrador.md -o borrador.docx 

```
 
## Fintas adicionales
 
Es posible que el formato de PDF *por default* de Pandoc (que es el de LaTeX) no nos guste y queramos uno propio. En realidad nos debería gustar --- hay muchos campos en dónde el PDF *por default* que produce LaTeX es el estándar para borradores de todo tipo. Pero si queremos algo más personalizado, hay muchos templates ahí afuera. Yo personalmente tengo varios: uno para las notas de clases (para producir *outlines*), uno para el CV inspirado en el [vita](http://kjhealy.github.io/kjh-vita/) de Kieran Healy, uno para reportes breves, uno para cartas (!), uno para papers individuales en versión borrador, uno para formato "capítulo de tesis", etcétera. Entrar en este mundo es complejizar más el proceso: requiere familiarizarse con la forma en que los archivos `.latex` (los templates que se pueden usar) están programados. Requiere empezar a "meter mano" a temas como espaciado, interlineado, tamaño de fuente, estructura de títulos (numeración, sangría), etcétera. Es un camino de ida, que permitirá---por ejemplo---usar tipografías poco utilizadas, o no fácilmente disponibles. No lo recomiendo porque (a) es una forma de perder tiempo, lo que va en contra de la idea de *enfocarnos solamente en la lectura*; (b) tiene una curva de aprendizaje pronunciada y (c) es la forma más fácil de cometer gruesos errores tipográficos. 

Por eso, y para borradores, trabajos prácticos, tesis de licenciatura, maestría e incluso doctorales, el formato por *default* de LaTeX debería ser suficiente. Como decía, en muchos campos de investigación (especialmente, las ciencias duras) este es el formato *de preferencia*. Así que escribir un borrador en LaTeX tiene ese *no se qué* adicional de "parecer profesional" (incluso sin tener---todavía---el título habilitante). Usar el default es estar *in* y eso (en este club) es bueno. 

Quizás tiene más sentido modificar el formato del template de Word: el que usa Pandoc por default me parece muy malo. Eso es sencillo: hay que crear un documento con las características que queramos que tenga (interlineado, tipo de letra, títulos bien codificados, etcétera) y guardarlo (vacío o con texto, no importa) como `reference.docx` en la carpeta que tenemos de borrador. Luego podemos convertir de Markdown a DOCX (que muchos piden a la hora de p.ej., enviar un archivo) con el siguiente comando: 

```
pandoc --reference-doc=reference.docx borrador.md -o borrador.docx

```

Algo que sí parece importante es familiarizarse con los campos de YAML que permite Pandoc. Así es posible ponerle a nuestros borradores título, afiliación, institución, abstract, etcétera. Comparto abajo, p.ej., dos opciones, una sencilla y otra más compleja. La sencilla es nuestro archivo `borrador.md` con un preámbulo YAML sencillo, al que le podemos poner `borrador_con_titulo.md`. 

```
---
title: Borrador
author: Juan Pérez
date: 2020-10-13
---

```

La opción compleja es el YAML del último paper que escribí. 

```
---
title: 'The Pro-Life Movement and the Fight for the Constitution in Argentina: Between Law and Transcendence'
author: 
- name: Ramiro Álvarez Ugarte
  affiliation: 'Universidad de Buenos Aires'
date: September 28, 2020 
output:
  word_document: 
    reference_docx: "/Users/ramiroalvarezugarte/Dropbox/Templates/reference.docx"
  pdf_document:
    template: /Users/ramiroalvarezugarte/Dropbox/Templates/draft_article_rmd.tex
    latex_engine: xelatex
    includes:
      in_header: /Users/ramiroalvarezugarte/Dropbox/Templates/preamble_mac.tex
fig_width: 1
fig_height: 1
number-sections: no
linkcolor: black
thanks: I want to thank both reviewers for helpful and insightful comments, that improved the manuscript significantly. The mistakes and shortcomings that remain are exclusively my responsibility.
bibliography: lalr.json
csl: chicago-manual-of-style-17th-edition_RAU_2.csl
header-es: \usepackage[spanish]{babel}
suppress-bibliography: no
keyword: 
- "constitución"
- "movimientos sociales"
- "catolicismo"
- "feminismo"
- "laicidad"
- "aborto"
- "derechos reproductivos"
abstract: |

    \noindent The constitutional history of abortion in Argentina is long and complex. This paper overviews a small part of it: the way in which Catholic legal academia developed, since the early 1980s, constitutional arguments to dispute with the feminist camp the meaning of the Constitution. This process has two dimensions. One is linked to the intellectual history of Catholic ideas over reproduction, and how they were adapted to the peculiarities of Argentinean law. The other is related to the way in which these arguments formed the framing of the "pro life" movement in Argentina. Exploring this normative world reveals the "depth of field" with which social movement seeking constitutional change work with (Cover, 1983). It also reveals the stakes involved when the battle is waged in that terrain. This article explores what this means for constitutional theory. 

---
```

La complejidad mayor se debe a que empecé a usar `rmarkdown` como forma de disparar `pandoc`. Permite un nivel de precisión mayor de algunas cosas, como---por ejemplo---el manejo de las figuras por default, algo útil en proyectos que usan muchos datos. Además, permite escribir el código para manejar esos datos dentro del mismo archivo, en un formato `.rmd`. Por otro lado, el YAML más complejo identifica templates y preámbulos de LaTeX personalizados. Esta alternativa es mejor que controlar Pandoc desde la línea de comandos porque las ordenes se vuelven demasiado largas. Pero esto ya es un uso avanzado de las herramientas, aquí sólo quería compartir lo básico. 

Los archivos de los ejemplos dados acá están en un [repositorio](https://github.com/ramiroau/tutorial_plain_text). 

[^fn1]: Yo este año me pasé del .bib al .json porque la traducción de los distintos campos de Zotero es más granular y permitía mayor precisión a la hora de diseñar un estilo propio, algo que hice con la [GACL]({{< relref path="gacl.md" >}}).