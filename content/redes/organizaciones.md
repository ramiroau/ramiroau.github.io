---
title: "Red de organizaciones"
date: 2026-08-10
publishDate: 2026-08-10
weight: 10
summary: "Tribunales, estudios jurídicos y departamentos de la Facultad, vinculados cuando comparten docentes."
---

Cada nodo es una organización; dos quedan unidas cuando al menos una persona
aparece en ambos registros. Los trece departamentos de la Facultad ocupan el
centro porque son sus miembros quienes cargan con las afiliaciones externas que
producen todos los vínculos. 

{{< red-grafo data="organizaciones.json"
              bajada="Pasá el mouse por un nodo para ver sus datos. Rueda para acercar, arrastrá para mover."
              alto="620" etiquetas="14" pesomax="20" >}}

El nodo consolidado de la matrícula —quienes están inscriptos en el CPACF sin
un domicilio compartido— se muestra porque carga con co-afiliaciones reales,
pero su intermediación se informa como cero: un nodo que representa a decenas
de miles de matriculados sin estudio funcionaría como un centro artificial. El
paper calcula la intermediación solo sobre organizaciones reales, por la misma
razón.
