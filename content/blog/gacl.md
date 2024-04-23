---
title: La Guía Argentina de Citas Legales (versión 1.0)
author: Ramiro Álvarez Ugarte
date: 2020-06-22
draft: false
type: post
---

A diferencia de otras jurisdicciones (p.ej. Estados Unidos, Reino Unido, Australia), la comunidad legal de Argentina no tiene un estilo de citas unificado. Cada editor pide el estilo que desea y---en general---no adoptan uno que ya exista, sino que generan un estilo propio desarrollado ad-hoc que vuelcan a una guía de estilo propia (p.ej. la Revista Ambiental de la Universidad de Palermo, la Revista Argentina de Teoría Jurídica de la Universidad Di Tella, Lecciones y Ensayos, etcétera).  

La ausencia de un criterio unificado genera algunos problemas típicos de coordinación que complican innecesariamente el proceso de producción académica: 

1. La dispersión de criterios genera trabajo adicional para los autores, ya que deben formatear sus citas manualmente y (posiblemente) dos veces, antes de presentar el trabajo y luego de que éste fuera aceptado. 

2. Esa dispersión de criterios genera trabajo adicional para los editores, quienes deben (a) pedir o (b) formatear las citas de acuerdo a sus propios criterios. En mi experiencia, esta etapa de producción no es sencilla y demora innecesariamente el proceso de edición y de publicación. 

3. La dispersión de criterios genera que (p.ej., obras colectivas) tengan criterios de citas diferentes. Ello dificulta construir listas bibliográficas o de referencias unificadas: si se procede mediante un simple copiar y pegar el resultado es estéticamente pobre (por la dispersión) y demanda mucho trabajo de edición (p.ej., buscar duplicados de libros que comienzan con el nombre del autor en relación a otros que comienzan con el apellido del autor, etcétera). En mi experiencia, estos problemas terminan generando obras colectivas con referencias incompletas (citas en el artículo que no se encuentran en las referencias totales de las obras). 

4. El problema principal: la dispersión de criterios genera que no exista---hasta ahora---un sistema de citas legales locales en lenguaje CSL (*Citation Style Language*), algo que permite la automatización del formateo de citas. 

Los tres primeros problemas son menores, aunque hacen que el proceso de producción académica sea más difícil. El último problema es, sin embargo, fundamental: los académicos profesionales suelen trabajar con sistemas de administración de bibliografía y éstos funcionan muy bien con estilos de citas codificados en lenguaje CSL. La GACL ofrece una herramienta fácil de implementar, capaz de generar formatos de citas razonables y sencillos, que en muchos casos copian o siguen de cerca a diversas prácticas locales. Los editores de revistas académicas pueden adoptarlo y/o adaptarlo a sus propias necesidades. Para los autores, adoptar la GALC les permite producir borradores que sólo haya que modificar parcialmente una vez que el artículo fue aceptado para su publicación. Para los editores, las ventajas son mayores: les permite orientar a los autores mediante una herramienta automatizada y facilita el trabajo de edición, al permitir la extracción de las bibliografías [creadas mediante un administrador de bilbiografía](https://update.lib.berkeley.edu/2018/02/07/extracting-references-from-an-already-created-bibliography/) o---en el escenario más usual---permitir el procesamiento automatizado de citas producidas manualmente (*ver* [anystyle.io](https://anystyle.io/) o [text2bib](https://text2bib.economics.utoronto.ca/)).

Yo hace bastante que usaba una modificación ad-hoc del estilo *Spanish Legal* de Rafael Palomino, pero lo había modificado bastante, especialmente para capturar los fallos judiciales de la CSJN en el formato usual que se utiliza acá en Argentina. La cuarentena fue una buena oportunidad para darle un poco más de forma a ese borrador hackeado un poco brutamente, llenar algunos gaps que había que llenar, y compartirlo para quien desee usarlo. Se encuentra [en un repositorio en GitHub](https://github.com/ramiroau/gacl) bajo una licencia GNU General Public License v3.0. 

# ¿Cómo arrancar?

La forma más fácil es bajar [Zotero](https://www.zotero.org/) y los [conectores del procesador de texto de preferencia](https://www.zotero.org/download/connectors). Una vez que se tiene eso es cuestión de ir armando la propia biblioteca. Con los conectores simplemente se inserta una cita, se busca el material que se desea y ya. Realmente no es necesario más que eso, funciona más o menos así: 

Hay otra variante que es la escritura en *plain text* y la conversión de los materiales mediante [Pandoc](https://pandoc.org/), pero esa es otra historia. 