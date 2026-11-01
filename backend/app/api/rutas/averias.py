from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.dependencias import obtener_sesion
from app.api.esquemas.averia import AveriaCrear, AveriaRespuesta

from app.nucleo.modelo.averia import Averia
from app.nucleo.modelo.enums import EstadoAveria, TipoSolucion

from app.nucleo.servicio.deteccion_averia_servicio import DeteccionAveriaServicio
from app.nucleo.servicio.resolucion_averia_servicio import ResolucionAveriaServicio

from app.persistencia.repositorios.averia_repositorio import AveriaRepositorio
from app.persistencia.repositorios.maquina_repositorio import MaquinaRepositorio
from app.persistencia.repositorios.persona_repositorio import PersonaRepositorio


router = APIRouter(prefix="/averias", tags=["Averías"])


# Datos para operaciones específicas
class AsignarTecnico(BaseModel):
    id_tecnico: int = Field(gt=0)


class ResolverAveria(BaseModel):
    id_tecnico: int = Field(gt=0)

    # Datos obligatorios para resolver
    causa_raiz: str = Field(min_length=1)
    solucion_aplicada: str = Field(min_length=1)

    # Información adicional de la reparación
    repuestos_sustituidos: str | None = None
    tipo_solucion: TipoSolucion | None = None
    recomendacion_preventiva: str | None = None


class CerrarAveria(BaseModel):
    id_responsable: int = Field(gt=0)


def obtener_servicios(session: Session):
    # Todos los repositorios comparten la misma sesión
    averias = AveriaRepositorio(session)
    maquinas = MaquinaRepositorio(session)
    personas = PersonaRepositorio(session)

    deteccion = DeteccionAveriaServicio(averias, maquinas, personas)
    resolucion = ResolucionAveriaServicio(averias, maquinas, personas)

    return deteccion, resolucion


# Registrar avería
@router.post(
    "",
    response_model=AveriaRespuesta,
    status_code=status.HTTP_201_CREATED
)
def crear_averia(
    datos: AveriaCrear,
    session: Session = Depends(obtener_sesion)
):
    deteccion, _ = obtener_servicios(session)

    # Toda avería nueva comienza abierta
    averia = Averia(
        **datos.model_dump(),
        estado=EstadoAveria.ABIERTA
    )

    try:
        resultado = deteccion.registrar_averia(averia)
        session.commit()
        return resultado

    except ValueError as error:
        session.rollback()
        raise HTTPException(400, str(error)) from error

    except IntegrityError as error:
        session.rollback()
        raise HTTPException(409, "Conflicto al registrar la avería") from error


# Listar averías y consultar el historial
@router.get("", response_model=list[AveriaRespuesta])
def listar_averias(
    id_maquina: int | None = None,
    buscar: str | None = None,
    session: Session = Depends(obtener_sesion)
):
    deteccion, _ = obtener_servicios(session)

    if id_maquina is not None:
        averias = deteccion.listar_por_maquina(id_maquina)
    else:
        averias = deteccion.listar()

    # Buscar por título, síntoma, causa o solución
    if buscar:
        texto = buscar.casefold()

        averias = [
            a for a in averias
            if any(
                texto in (valor or "").casefold()
                for valor in (
                    a.titulo,
                    a.sintoma,
                    a.causa_raiz,
                    a.solucion_aplicada
                )
            )
        ]

    return averias


# Obtener una avería por ID
@router.get("/{id_averia}", response_model=AveriaRespuesta)
def obtener_averia(
    id_averia: int,
    session: Session = Depends(obtener_sesion)
):
    deteccion, _ = obtener_servicios(session)
    averia = deteccion.obtener_por_id(id_averia)

    if averia is None:
        raise HTTPException(404, "La avería no existe")

    return averia


# Asignar técnico
@router.patch(
    "/{id_averia}/asignar",
    response_model=AveriaRespuesta
)
def asignar_tecnico(
    id_averia: int,
    datos: AsignarTecnico,
    session: Session = Depends(obtener_sesion)
):
    deteccion, _ = obtener_servicios(session)

    try:
        resultado = deteccion.asignar_tecnico(
            id_averia,
            datos.id_tecnico
        )
        session.commit()
        return resultado

    except ValueError as error:
        session.rollback()
        raise HTTPException(400, str(error)) from error


# Iniciar reparación
@router.patch(
    "/{id_averia}/iniciar",
    response_model=AveriaRespuesta
)
def iniciar_reparacion(
    id_averia: int,
    session: Session = Depends(obtener_sesion)
):
    _, resolucion = obtener_servicios(session)

    try:
        resultado = resolucion.iniciar_reparacion(id_averia)
        session.commit()
        return resultado

    except ValueError as error:
        session.rollback()
        raise HTTPException(400, str(error)) from error


# Resolver avería
@router.patch(
    "/{id_averia}/resolver",
    response_model=AveriaRespuesta
)
def resolver_averia(
    id_averia: int,
    datos: ResolverAveria,
    session: Session = Depends(obtener_sesion)
):
    _, resolucion = obtener_servicios(session)

    try:
        resultado = resolucion.resolver_averia(
            id_averia,
            datos.id_tecnico,
            datos.causa_raiz,
            datos.solucion_aplicada,
            datos.repuestos_sustituidos,
            datos.tipo_solucion,
            datos.recomendacion_preventiva
        )
        session.commit()
        return resultado

    except ValueError as error:
        session.rollback()
        raise HTTPException(400, str(error)) from error


# Cerrar avería
@router.patch(
    "/{id_averia}/cerrar",
    response_model=AveriaRespuesta
)
def cerrar_averia(
    id_averia: int,
    datos: CerrarAveria,
    session: Session = Depends(obtener_sesion)
):
    _, resolucion = obtener_servicios(session)

    try:
        resultado = resolucion.cerrar_averia(
            id_averia,
            datos.id_responsable
        )
        session.commit()
        return resultado

    except ValueError as error:
        session.rollback()
        raise HTTPException(400, str(error)) from error
