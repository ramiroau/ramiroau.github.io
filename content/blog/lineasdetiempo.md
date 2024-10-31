---
title: "Líneas de tiempo"
date: 2020-05-19
draft: false
status: published 
type: post
tags: ["R"]
toc: false
mermaid: true
---

Sin pizarrón no podemos hacer las "líneas de tiempo" que siempre hacemos (¡la dimensión temporal explica muchas cosas!). En *Derecho Constitucional y Cambio Social*, la clase que damos con I.J. desde hace muchos años, *siempre* hablamos sobre el movimiento de DDHH y *siempre* hacemos una línea de tiempo en el pizarrón, contando la historia en sí y los distintos hitos legales que fueron ocurriendo con el correr de los años. 

Me puse a buscar la forma de armar una línea de tiempo sencilla. Primero intenté con una versión de [Mermaid](https://mermaid-js.github.io/mermaid/#/gantt) que no está mal pero funciona mejor para otras cosas (p.ej., para los hechos de casos de DDHH, que en general son complejos y están muy desordenados). Terminé haciéndolo en `ggplot2`, siguiendo [este modelo](https://benalexkeen.com/creating-a-timeline-graphic-using-r-and-ggplot2/). El código, más abajo. 

# Historia del MDH

![](/pics/timeline_mdh.png#superwider "Principales hitos legales del MDH")

`timeline_mdh.csv`

```
milestone,date,status
Visita CIDH,1979-09-06,Normal
Fundación del CELS,1980-03-01,Normal
Guerra de Malvinas,1982-04-01,Normal
Ley de Autoamnistía,1983-09-22,Retroceso
CONADEP,1983-12-15,Avance
Informe Nunca Más,1984-09-20,Avance
Juicio a las Juntas,1985-04-22,Avance
Ley de Punto Final,1986-12-05,Retroceso
Levantamiento de Aldo Rico,1987-04-16,Retroceso
Ley de Obediencia Debida,1987-05-13,Retroceso
Indultos de CSM,1989-10-07,Retroceso
Reforma constitucional (Tratados de DDHH),1994-08-22,Normal
Juicios por la verdad (La Plata),1998-09-01,Avance
Comienza el caso Scilingo en España,1996-03-28,Normal
Comienza el caso Lapacó en CIDH,1998-10-07,Normal
Cavallo declara nulidad de leyes de aministía,2001-03-06,Avance
Congreso declarar nulidad de leyes de aministía (Ley 25.779),2003-08-02,Avance
Caso Simón (CSJN) -> reapertura juicios,2005-06-14,Avance
Caso Mazzeo (CSJN),2007-07-13,Normal
Caso Bignone (CSJN),2017-05-03,Normal
Marcha contra caso Muiña,2017-05-10,Normal
Ley interpretativa 27.632,2017-05-12,Normal
Caso Batalla(CSJN),2018-12-04,Normal
```

Código en R con `ggplot`, `lubridate`, `scales` →

```
df <- read.csv('timeline_mdh.csv')

df <- df[with(df, order(date)), ]

status_levels <- c("Retroceso", "Normal", "Avance")
status_colors <- c("#008000","#0070C0","#C00000")

# Para que los distintos hitos no se superpongan expandí las opciones posibles de ubicación en el eje y 

positions <- c(0.25, -0.25, 0.5, -0.5, 0.75, -0.75, 1.0, -1.0, 1.25, -1.25, 1.5, -1.5)
directions <- c(1, -1)

line_pos <- data.frame(
  "date"=unique(df$date),
  "position"=rep(positions, length.out=length(unique(df$date))),
  "direction"=rep(directions, length.out=length(unique(df$date)))
)

df <- merge(x=df, y=line_pos, by="date", all = TRUE)

df <- df[with(df, order(date)), ]

text_offset <- 0.05

# Para meses, mejor hacerlo y scarlo luego (así queda el template para hacer líneas de tiempo más cortas)

df$month_count <- ave(df$date==df$date, df$date, FUN=cumsum)

df$text_position <- (df$month_count * text_offset * df$direction) + df$position

df <- df %>%
  mutate(date = as.Date(date, "%Y-%m-%d"))

month_date_range <- seq(min(df$date) - months(month_buffer), max(df$date) + months(month_buffer), by='month')

month_format <- format(month_date_range, '%m')

month_df <- data.frame(month_date_range, month_format)

year_date_range <- seq(min(df$date) - months(month_buffer), max(df$date) + months(month_buffer), by='year')

year_date_range <- as.Date(
  intersect(
    ceiling_date(year_date_range, unit="year"),
    floor_date(year_date_range, unit="year")
  ),  origin = "1970-01-01"
)

# Años de a dos números mejor que cuatro 

year_format <- format(year_date_range, '%y')

year_df <- data.frame(year_date_range, year_format)

timeline_plot<-ggplot(df,aes(x=date,y=0, col=status, label=milestone))

timeline_plot<-timeline_plot+labs(col="Milestones")

timeline_plot<-timeline_plot+scale_color_manual(values=status_colors, labels=status_levels, drop = FALSE)

# Los meses se plotean con esto --> pero me lo salteo 

timeline_plot<-timeline_plot+geom_text(data=month_df, aes(x=month_date_range,y=-0.1,label=month_format),size=2,vjust=0.5, color='black', angle=0)

timeline_plot<-timeline_plot+theme_classic()

timeline_plot<-timeline_plot+geom_hline(yintercept=0, color = "black", size=0.3, family = "Jost* Book")

timeline_plot<-timeline_plot+geom_segment(data=df[df$month_count == 1,], aes(y=position,yend=0,xend=date), color='black', family = "Jost* Book", size=0.2)

timeline_plot<-timeline_plot+geom_point(aes(y=0), size=3)

timeline_plot<-timeline_plot+theme(axis.line.y=element_blank(),
                                   axis.text.y=element_blank(),
                                   axis.title.x=element_blank(),
                                   axis.title.y=element_blank(),
                                   axis.ticks.y=element_blank(),
                                   axis.text.x =element_blank(),
                                   axis.ticks.x =element_blank(),
                                   axis.line.x =element_blank(),
                                   legend.position = "bottom"
)

timeline_plot<-timeline_plot+geom_text(data=year_df, aes(x=year_date_range,y=-0.1,label=year_format, fontface="bold", family = "Jost* Book"),size=3, color='black')

timeline_plot<-timeline_plot+geom_text(aes(y=text_position,label=milestone),size=4.5, family = "Jost* Book") + theme(legend.position = "none")

print(timeline_plot)
```

[^fn1]: También es *súper* útil en casos legales complejos (p.ej., de DDHH). Recomiendo su implementación para ordenar hechos, expedientes, presentaciones, etcétera. 