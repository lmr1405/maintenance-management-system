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
