# 2. Modelo de datos
## 2.1 Identificación de entidades
El sistema estará compuesto inicialmente por cuatro entidades principales:
- **Máquina :** almacena la información de las máquinas y equipos industriales.
- **Persona:** almacena los datos de los operarois, técnicos de mantenimiento y responsables.
- **Avería** registra las incidencias detectadas en las máquinas, su estado y la información relacionada con su resolución.
- **ImputaciónHoras:** registra las horas de trabajo dedicadas por los técnicos a cada avería.

## 2.2 Relaciones de entidades
Las relaciones entre entidades se representan en el diagrama entidad-relación del proyecto.
## 2.3 Diagrama entidad-relación
![Diagrama entidad relacion](diagramas/Entidad-Relacion%20AGM.jpg)
## 2.4. Decisiones de diseño

- **Código de máquina:** el atributo `codigo` de la entidad `MAQUINA` es único, evitando que existan máquinas con el mismo identificador.

- **Teléfono de persona:** se asume que cada persona puede tener como máximo un número de teléfono. Por tanto, `telefono` se modela como un atributo de `PERSONA` y no como una entidad independiente.

- **Respuesto sustituidos:** se almacenan como un atributo de la entidad `AVERIA`, incluyendo referencia y cantidad, ya que inicialmente no se contempla una gestión independiente de repuestos.

- **Número de avería:** el atributo `numero` de la entidad `AVERIA` es único y se genera automáticamente con el formato `AV-AAAA-NNNN` (por ejemplo, `AV-2026-0001`), permitiendo identificar cada avería sin duplicidades.