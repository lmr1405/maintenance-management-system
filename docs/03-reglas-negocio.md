# 3. Reglas de negocio

## 3.1. Ciclo de vida de una avería

Toda avería seguirá el siguiente ciclo de estados:

- **Abierta:** la avería ha sido registrada y todavía no tiene un técnico asignado.
- **Asignada:** un técnico de mantenimiento ha sido asignado para atenderla.
- **En curso:** el técnico está trabajando en su reparación.
- **Resuelta:** se ha solucionado la avería y documentado su causa y solución.
- **Cerrada:** un responsable ha validado la resolución.

Las transiciones normales seguirán el orden:

**Abierta → Asignada → En curso → Resuelta → Cerrada**

## 3.2. Registro de averías

- Toda avería debe estar asociada a una máquina y a la persona que la reporta.
- Al registrarse, comienza en estado `Abierta`.
- Si se indica que la máquina está parada, su estado cambia a `En avería`.

## 3.3. Asignación de técnicos

- Solo las personas con rol de técnico de mantenimiento pueden recibir averías.
- Una avería puede estar sin asignar o tener un único técnico responsable.
- No se pueden asignar averías a personas inactivas.

## 3.4. Imputación de horas

- Solo los técnicos pueden registrar horas de trabajo.
- Una avería puede tener varias imputaciones realizadas por distintos técnicos.
- Las horas deben ser mayores que cero y registrarse en incrementos de 0,25 horas.
- La fecha de imputación no puede ser anterior a la detección de la avería.

## 3.5. Resolución y cierre

- Para marcar una avería como `Resuelta`, deben registrarse obligatoriamente la causa raíz y la solución aplicada.
- Al resolver una avería, se registra la fecha y hora de resolución.
- Solo una persona con rol de responsable puede validar su cierre.
- Al cerrar una avería, se registra quién la validó y cuándo.

## 3.6. Cálculos

- El total de horas de una avería se obtiene sumando todas sus imputaciones.
- Las horas por técnico se calculan sumando las imputaciones realizadas por esa persona.
- Las horas por máquina se calculan sumando las imputaciones de sus averías.
- El tiempo de parada se calcula desde la detección hasta la resolución cuando la máquina estaba parada.