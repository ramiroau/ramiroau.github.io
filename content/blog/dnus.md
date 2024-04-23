---
title: DNU, doctrina y práctica constitucional (urgente)
author: Ramiro Álvarez Ugarte
date: 2020-06-14
draft: false
status: published 
type: post
tags: ["teoría-jurídica", "derecho-constitucional"]
toc: false
---

Sólo para compartir algunos datos que terminaron en un hilo de tuiter. 


Me interesaba mirar los datos de DNU y fui a la fuente original, *Infoleg* y *SAIJ*. Éste último resultó ser [más amigable a la hora de escrapear los datos](http://www.saij.gob.ar/resultados.jsp?r=%20fecha-rango%3A%5B19950101%20TO%2020200613%5D&o=0&p=25&f=Total%7CTipo%20de%20Documento/Legislaci%F3n/Decreto/Decreto%20de%20Necesidad%20y%20Urgencia%7CFecha%7COrganismo%7CPublicaci%F3n%7CTema%7CEstado%20de%20Vigencia%7CAutor%7CJurisdicci%F3n/Nacional&v=colapsada) y así terminé con un dataset con DNUs dictados entre 1995 y 2020 de 782[^fn2]. La pregunta que me guiaba era ver la evolución del uso y detectar el aumento de 2020 (que es evidente). 

![](/pics/dnus.png "DNUS 1995-2020")

Pero también me interesaba saber qué pasó con cada uno de esos DNUS. ¿Son revisados por el Congreso? ¿Son aprobados, rechazados? ¿Reciben el tratamiento del silencio y---ergo---la validez? Los datos para responder estas últimas preguntas no están fácilmente disponibles pero en el [sitio de datos abiertos](https://datos.hcdn.gob.ar/)  de Diputados hay un [lindo dataset con información sobre los dictámenes de las comisiones](https://datos.hcdn.gob.ar/dataset/dictamenes/resource/59595a93-5a5e-4ba6-a3db-c1044e2f949e). Eso permite filtrar por la Comisión Bicameral de Trámite Legislativo, la que creó la ley 26.122 que vino a cumplir---años tarde---con lo dispuesto por el artículo 99.3 de la Constitución. Con base en ese dataset es posible inferir los resultados porque en la columna `dictamen_observaciones` se da bastante información, p.ej.: 

`DICTAMEN DE MAYORIA: LA COMISION ACONSEJA APROBAR UN PROYECTO DE RESOLUCION Y DECLARAR LA VALIDEZ DEL DECRETO 2 DICTAMENES DE MINORIA: UNO ACONSEJA APROBAR EL DECRETO Y OTRO ACONSEJA RECHAZAR EL MISMO`

Con esa información es bastante fácil construir una columna nueva en la que se diga si la mayoría recomienda declarar la validez del decreto o recomienda rechazarlo. El análisis de esos datos me pareció muy significativo [^fn1]. 

|           | 2008 | 2009 | 2010 | 2011 | 2012 | 2013 | 2014 | 2015 | 2016  | 2017  | 2018  | 2019  |
|-----------|------|------|------|------|------|------|------|------|-------|-------|-------|-------|
| EMPATE    | 0    | 0    | 4    | 2    | 1    | 0    | 0    | 0    | 0     | 0     | 0     | 0     |
| INVALIDEZ | 0    | 0    | 5    | 0    | 2    | 0    | 0    | 0    | 3     | 5     | 0     | 3     |
| MINORIA   | 0    | 0    | 0    | 0    | 1    | 1    | 0    | 4    | 0     | 0     | 0     | 0     |
| VALIDEZ   | 5    | 21   | 21   | 2    | 39   | 13   | 15   | 17   | 22    | 10    | 19    | 4     |

La abrumadora mayoría de dictámenes de la Comisión recomiendan darle validez al DNU que viene desde el ejecutivo. Sólo en un puñado menor de casos el dictamen de mayoría recomienda declarar la "invalidez" del mismo. En aún menos casos se da un empate (la comisión tiene 16 miembros, 8 diputados y 8 senadores) y en otro puñado de casos no se logra dictamen de mayoría. Los datos pueden tener sus errores, porque el análisis fue realizado relativamente rápido (habría que profundizarlo si esto va a ser más que un post) pero de todas formas, la tendencia parece bastante clara: los DNU tienen altísimas chances de ser aprobados por el mecanismo de control que prevé la ley 26.121. 

Creo que un análisis en esta dirección debería profundizarse, por al menos dos razones. 

En primer lugar, la doctrina constitucional de casos como *Verrochi* o *Consumidores Argentinos* es la vieja historia que a veces repetimos en las clases: la reforma constitucional de 1994 vino a "atenuar el presidencialismo" y sólo en condiciones de rigurosa excepcionalidad los DNU son legítimos. 

> "Que todo lo aquí expuesto no permite albergar dudas en cuanto a que la Convención reformadora de 1994 pre- tendió atenuar el sistema presidencialista, fortaleciendo el rol del Congreso y la mayor independencia del Poder Judicial (confr. en igual sentido "Verrocchi", Fallos: 322:1726, y sus citas). De manera que es ese el espíritu que deberá guiar a los tribunales de justicia tanto al determinar los alcances que corresponde asignar a las previsiones del art. 99, inciso 3, de la Constitución Nacional, como al revisar su efectivo cumplimiento por parte del Poder Ejecutivo Nacional en ocasión de dictar un decreto de necesidad y urgencia" (Consumidores Argentinos, cdo. 13). 

Los datos antes analizados sugieren, al menos provisionalmente, que esta doctrina constitucional no controla en la práctica lo que hace el Congreso en ejercicio de la facultad constitucional de revisión que prevé el artículo 99.3. Sobre 219 dictámenes, 188 recomiendan darle validez al DNU del ejecutivo (!). 

Esta distancia es importante por una segunda razón: afirmamos---creo que con razón---que los derechos constitucionales sólo se pueden limitar por medio de leyes en sentido formal y material, siguiendo principios constitucionales y de derechos humanos (OC 6/86). Pero tenemos un montón de ejemplos en contrario, y el Congreso parece aprobar sin mayores inconvenientes muchos de estos decretos: los casos de "los decretos de la Pandemia" apoyan esta conclusión de forma bastante clara, como surge de [las reuniones de comisión](https://www.senado.gov.ar/parlamentario/comisiones/info/105) que todavía no llegaron al dataset de dictámenes. 

Esta "realidad constitucional" sugiere que Rodolfo Barra, finalmente, ganó. No tengo a mano su *Tratado de Derecho Administrativo* pero Barra---siguiendo cierto fervor hiperpresidencialista---sostenía que el verbo "urgir" del artículo 99.3 debía interpretarse políticamente, como la facultad del PEN de forzar al Congreso a actuar. El hecho de que el DNU se mantenga vigente mientras el Congreso no actúe en contrario y que el silencio del Congreso deriva en la validez del DNU respetaba, para Barra, la realidad constitucional (que gente como Vermeule o Posner [podrían apoyar](https://www.amazon.es/Executive-Unbound-After-Madisonian-Republic/dp/0199765332) en EEUU) de que la primacía política de las democracias modernas pasa por el ejecutivo. 

Creo que tenemos un problema. 

[^fn1]: Este dataset no distingue entre DNUS / decretos delegados --- No encontré una forma sencilla de distinguirlos. 
[^fn2]: En una versión anterior del gráfico había unos 30 dnus *menos* porque SAIJ no está actualizado. Se actualizaron los datos con información de Infoleg. 









