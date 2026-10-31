from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.dependencias import obtener_sesion
from app.api.esquemas.imputacionhoras import (
    ImputacionHorasCrear,
    ImputacionHorasRespuesta
)

from app.nucleo.modelo.imputacionhoras import ImputacionHoras
from app.nucleo.servicio.imputacionhoras_servicio import ImputacionHorasServicio

from app.persistencia.repositorios.imputacionhoras_repositorio import ImputacionHorasRepositorio
from app.persistencia.repositorios.averia_repositorio import AveriaRepositorio
from app.persistencia.repositorios.persona_repositorio import PersonaRepositorio
from app.persistencia.repositorios.maquina_repositorio import MaquinaRepositorio


router = APIRouter(prefix="/imputaciones", tags=["Imputaciones"])


def obtener_repositorios(session: Session):
    imputaciones = ImputacionHorasRepositorio(session)
    averias = AveriaRepositorio(session)
    personas = PersonaRepositorio(session)

    return imputaciones, averias, personas


# Registrar horas de trabajo
@router.post(
    "",
    response_model=ImputacionHorasRespuesta,
    status_code=status.HTTP_201_CREATED
)
def crear_imputacion(
    datos: ImputacionHorasCrear,
    session: Session = Depends(obtener_sesion)
):
    imputaciones, averias, personas = obtener_repositorios(session)

    # Recuperar la avería y el técnico
    averia = averias.obtener_por_id(datos.id_averia)
    persona = personas.obtener_por_id(datos.id_tecnico)

    if averia is None:
        raise HTTPException(404, "La avería no existe")

    if persona is None:
        raise HTTPException(404, "La persona no existe")

    # Convertir los datos en una entidad del núcleo
    imputacion = ImputacionHoras(**datos.model_dump())

    # Utilizar el servicio para validar y guardar
    servicio = ImputacionHorasServicio(imputaciones)

    try:
        resultado = servicio.registrar_imputacion(
            imputacion,
            persona,
            averia
        )
        session.commit()
        return resultado

    except ValueError as error:
        session.rollback()
        raise HTTPException(400, str(error)) from error

    except IntegrityError as error:
        session.rollback()
        raise HTTPException(409, "Conflicto al registrar las horas") from error


# Listar imputaciones, con filtros opcionales
@router.get("", response_model=list[ImputacionHorasRespuesta])
def listar_imputaciones(
    id_averia: int | None = None,
    id_tecnico: int | None = None,
    session: Session = Depends(obtener_sesion)
):
    imputaciones, _, _ = obtener_repositorios(session)

    if id_averia is not None:
        resultado = imputaciones.listar_por_averia(id_averia)
    elif id_tecnico is not None:
        resultado = imputaciones.listar_por_tecnico(id_tecnico)
    else:
        resultado = imputaciones.listar()

    # Aplicar también el segundo filtro si se han enviado ambos
    if id_averia is not None and id_tecnico is not None:
        resultado = [
            i for i in resultado
            if i.id_tecnico == id_tecnico
        ]

    return resultado



# Obtener el total de horas de una avería
@router.get("/totales/averia/{id_averia}")
def total_horas_por_averia(
    id_averia: int,
    session: Session = Depends(obtener_sesion)
):
    imputaciones, averias, _ = obtener_repositorios(session)

    # Comprobar que la avería existe
    if averias.obtener_por_id(id_averia) is None:
        raise HTTPException(404, "La avería no existe")

    servicio = ImputacionHorasServicio(imputaciones)

    total = servicio.total_horas_por_averia(id_averia)

    return {
        "id_averia": id_averia,
        "total_horas": total
    }


# Obtener el total de horas de una máquina
@router.get("/totales/maquina/{id_maquina}")
def total_horas_por_maquina(
    id_maquina: int,
    session: Session = Depends(obtener_sesion)
):
    imputaciones, _, _ = obtener_repositorios(session)

    maquinas = MaquinaRepositorio(session)

    # Comprobar que la máquina existe
    if maquinas.obtener_por_id(id_maquina) is None:
        raise HTTPException(404, "La máquina no existe")

    servicio = ImputacionHorasServicio(imputaciones)

    total = servicio.total_horas_por_maquina(id_maquina)

    return {
        "id_maquina": id_maquina,
        "total_horas": total
    }


# Obtener el total de horas de un técnico
@router.get("/totales/tecnico/{id_tecnico}")
def total_horas_por_tecnico(
    id_tecnico: int,
    session: Session = Depends(obtener_sesion)
):
    imputaciones, _, personas = obtener_repositorios(session)

    # Comprobar que el técnico existe
    if personas.obtener_por_id(id_tecnico) is None:
        raise HTTPException(404, "La persona no existe")

    servicio = ImputacionHorasServicio(imputaciones)

    total = servicio.total_horas_por_tecnico(id_tecnico)

    return {
        "id_tecnico": id_tecnico,
        "total_horas": total
    }

# Obtener imputación por identificador
@router.get(
    "/{id_imputacion}",
    response_model=ImputacionHorasRespuesta
)
def obtener_imputacion(
    id_imputacion: int,
    session: Session = Depends(obtener_sesion)
):
    imputaciones, _, _ = obtener_repositorios(session)

    resultado = imputaciones.obtener_por_id(id_imputacion)

    if resultado is None:
        raise HTTPException(404, "La imputación no existe")

    return resultado