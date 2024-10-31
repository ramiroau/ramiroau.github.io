---
title: Por dónde empezar con R
author: Ramiro Álvarez Ugarte
date: 2020-07-22
draft: false
status: published 
type: post
tags: ["R"]
toc: false
---

En las últimas semanas fui publicando en tuiter análisis diversos de datos legales con la metodología de *social network analysis* (SNA), que aprendí (o mejor dicho empecé a aprender) tomando el curso Design of Social Research en el departamento de Sociología de la Universidad de Columbia, con el gran [Josh Whitford](https://sociology.columbia.edu/content/josh-whitford). Fue una de esas experiencias increíbles que siempre recomiendo a quienes van a estudiar derecho afuera: ¡sálganse de la escuelas de leyes! La Universidad es más grande, rica, y todo lo interdisciplinario ilumina mil veces más que volver a leer los viejos fallos de siempre. 

![](/pics/jurisprudencia_dnu.png "Jurisprudencia CSJN / DNU")
*↑ Jurisprudencia CSJN / DNU*

![](/pics/sna_legalfield.png "Vínculos justicia / academia (mega draft)")
*↑ Vínculos justicia / academia (mega draft)*



*Anyway*. 

A propós de esos análisis I. Boulin me preguntó cómo arrancar en este mundo, de este tipo de análisis, y entonces se me ocurrió juntar algunos materiales dispersos y compartir (posibles) formas de arrancar. 

El SNA es una metodología que como otras se basa en el análisis de datos diversos que es necesario---antes que nada---tener. Eso significa que es necesario juntarlos, recopilarlos y luego almacenarlos, manipularlos, y organizarlos. Para ello hay distintas opciones, pero yo empecé y terminé en la que me parece más sólida: el lenguaje R y el *suite* RStudio, que es la forma en que usamos ese lenguaje para hacer cosas con datos. Tiene un enfoque estadístico, es *open source* y tiene detrás una comunidad increíble que está todo el tiempo creando paquetes que se alojan en [CRAN](https://cran.r-project.org/) y que uno puede instalar fácilmente con un par de clicks. 

RStudio es algo desafiante porque requiere cierta comodidad con la línea de comandos (CLI), que es---en realidad---como funcionaban las primeras computadoras personales que mi generación recuerda (MS-DOS). Desde la aparición de Windows ese mundo fue quedando atrás, pero muchos de los programas que encuentro más útiles y que uso a diario como `LaTeX` y `pandoc` son de línea de comandos, así como tantos otros que uso menos seguido pero que igual son útiles como `inkscape` y `imagemagick`para manipular y convertir imágenes, `mutool` o `pdftk` para manipular archivos PDF, `tesseract` o `pdfsandwhich` para OCR, etcétera. En general estos programas son más livianos, funcionan mejor que alternativas "de escritorio" y son *software libre*. Un *win win win* absoluto. RStudio es una buena forma de acercarse a ese mundo si no se conoce (o no se lo recuerda, por razones de juventud). 

No hay *una forma* de empezar en este mundo, así que comparto lo que (creo) son las condiciones básicas y recursos útiles. 

1. Primero, este lenguaje se aprende usándolo. Yo intenté hacer cursos en línea sobre `python` y `javascript` y si bien me sirvieron para entender los grandes principios de la programación, aprendí a usar (muy superficialmente) ambos lenguajes cuando tuve proyectos que los necesitaban, p.ej., el reciente proyecto de bajar de manera automatizada los sumarios de los fallos de la CSJN. Allí, gracias a `Node.js` y `puppetteer` pude profundizar (y consolidar) lo que sabía de JS. *Aprender haciendo es la clave*, así que empezaría por tener un proyecto que pida datos. 

2. Segundo, este lenguaje se aprende leyendo tutoriales. Así, p.ej., para tutoriales empezaría recomendando el de [Antonio Vázquez Burst](https://bitsandbricks.github.io/ciencia_de_datos_gente_sociable/), que permite ir viendo paso a paso cómo funciona R y los conceptos básicos que es necesario ir incorporando: cómo cargamos la información, cómo la manipulamos, etcétera. El punto de entrada es ese: cargar un dataset (por suerte cada vez hay más) y empezar a ver qué podemos hacer con eso en el marco de RStudio. Al principio es frustrante, porque las cosas que son facilísimas en Excel son bastante complicadas de hacer en RStudio. Pero hay que superar esa frustración inicial e intentar---en la medida de lo posible---aprender a hacer lo básico *dentro de RStudio y sin salir de RStudio*. Yo no seguí este consejo, y creo que mi curva de aprendizaje fue un poco más pronunciada que lo necesario. Obligarte a aprender lo básico (p.ej., ordenar columnas, filtrar información) hace que el aprendizaje sea más rápido. Para inspiración y ejemplos, hay que mirar el sitio de [Demián Zayat](https://www.antidiscriminacion.org/acerca/), el abogado que más sabe del tema en la Argentina. 

3. Siempre hay que tener a mano las famosas [RStudio-Cheetsheets](https://rstudio.com/resources/cheatsheets/). Al principio parecen complicadas, pero son fundamentales. Y empezaría por leer (y experimentar de la mano de ellas) con las básicas y después paquetes centrales como `tidyverse` o `dplyr`, y---para visualizaciones---`ggplot2`. 

4. El punto principal, sin embargo, no es leer nada de esto sino preguntarle todo el tiempo a Google, y especialmente [ir a Stack Overflow](https://stackoverflow.com/). Cualquier problema, cosa que tengamos que hacer y no sepamos cómo, encuentra en general allí una respuesta. A veces es (otra vez) frustrante --- las respuestas parecen demasiado complicadas, etcétera. Pero les prometo: vale la pena insistir y dedicarle horas. Si tenemos un proyecto que nos consume tiempo y nos apasiona, esas horas derivarán---en algún momento---en un manejo razonablemente bueno de la herramienta y (si son como yo) en querer hacer todo pero absolutamente todo allí, desde producir visualizaciones sencillas de diagramas (como los que están en este post hasta llevar los [gantts de los proyectos](https://rich-iannone.github.io/DiagrammeR/mermaid.html) en los que están trabajando o que están coordinando. Esto es lo que me llevó---durante un tiempo---a hacer presentaciones para ministros con `beamer`, para tortura de mis colaboradores (pero esa es otra historia). 



