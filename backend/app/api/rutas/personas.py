from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.dependencias import obtener_sesion
from app.api.esquemas.persona import PersonaCrear, PersonaRespuesta

from app.nucleo.modelo.persona import Persona
from app.nucleo.servicio.persona_servicio import PersonaServicio
from app.persistencia.repositorios.persona_repositorio import PersonaRepositorio


router = APIRouter(prefix="/personas", tags=["Personas"])


def obtener_servicio(session: Session) -> PersonaServicio:
    repositorio = PersonaRepositorio(session)
    return PersonaServicio(repositorio)


# Registrar persona
@router.post(
    "",
    response_model=PersonaRespuesta,
    status_code=status.HTTP_201_CREATED
)
def crear_persona(
    datos: PersonaCrear,
    session: Session = Depends(obtener_sesion)
):
    servicio = obtener_servicio(session)
    persona = Persona(**datos.model_dump())

    try:
        resultado = servicio.registrar_persona(persona)
        session.commit()
        return resultado

    except ValueError as error:
        session.rollback()
        raise HTTPException(400, str(error)) from error

    except IntegrityError as error:
        session.rollback()
        raise HTTPException(409, "Conflicto al registrar la persona") from error


# Listar personas
@router.get("", response_model=list[PersonaRespuesta])
def listar_personas(
    activo: bool | None = None,
    session: Session = Depends(obtener_sesion)
):
    servicio = obtener_servicio(session)
    personas = servicio.listar()

    if activo is not None:
        personas = [p for p in personas if p.activo == activo]

    return personas


# Obtener persona por ID
@router.get("/{id_persona}", response_model=PersonaRespuesta)
def obtener_persona(
    id_persona: int,
    session: Session = Depends(obtener_sesion)
):
    servicio = obtener_servicio(session)
    persona = servicio.obtener_por_id(id_persona)

    if persona is None:
        raise HTTPException(404, "La persona no existe")

    return persona


# Actualizar persona
@router.put("/{id_persona}", response_model=PersonaRespuesta)
def actualizar_persona(
    id_persona: int,
    datos: PersonaCrear,
    session: Session = Depends(obtener_sesion)
):
    servicio = obtener_servicio(session)

    persona = Persona(
        **datos.model_dump(),
        id_persona=id_persona
    )

    try:
        resultado = servicio.actualizar_persona(persona)
        session.commit()
        return resultado

    except ValueError as error:
        session.rollback()
        raise HTTPException(400, str(error)) from error

    except IntegrityError as error:
        session.rollback()
        raise HTTPException(409, "Conflicto al actualizar la persona") from error


# Desactivar persona (baja lógica)
@router.patch("/{id_persona}/desactivar", response_model=PersonaRespuesta)
def desactivar_persona(
    id_persona: int,
    session: Session = Depends(obtener_sesion)
):
    servicio = obtener_servicio(session)

    try:
        resultado = servicio.desactivar_persona(id_persona)
        session.commit()
        return resultado

    except ValueError as error:
        session.rollback()
        raise HTTPException(400, str(error)) from error
