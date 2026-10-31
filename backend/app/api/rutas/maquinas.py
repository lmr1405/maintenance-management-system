from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.dependencias import obtener_sesion
from app.api.esquemas.maquina import MaquinaCrear, MaquinaRespuesta

from app.nucleo.modelo.maquina import Maquina
from app.nucleo.modelo.enums import EstadoMaquina
from app.nucleo.servicio.maquina_servicio import MaquinaServicio
from app.persistencia.repositorios.maquina_repositorio import MaquinaRepositorio


router = APIRouter(prefix="/maquinas", tags=["Máquinas"])


def obtener_servicio(session: Session) -> MaquinaServicio:
    repositorio = MaquinaRepositorio(session)
    return MaquinaServicio(repositorio)


# Registrar máquina
@router.post(
    "",
    response_model=MaquinaRespuesta,
    status_code=status.HTTP_201_CREATED
)
def crear_maquina(
    datos: MaquinaCrear,
    session: Session = Depends(obtener_sesion)
):
    servicio = obtener_servicio(session)
    maquina = Maquina(**datos.model_dump())

    try:
        resultado = servicio.registrar_maquina(maquina)
        session.commit()
        return resultado

    except ValueError as error:
        session.rollback()
        raise HTTPException(400, str(error)) from error

    except IntegrityError as error:
        session.rollback()
        raise HTTPException(409, "Código de máquina duplicado") from error


# Listar máquinas, con filtros opcionales
@router.get("", response_model=list[MaquinaRespuesta])
def listar_maquinas(
    estado: EstadoMaquina | None = None,
    ubicacion: str | None = None,
    tipo: str | None = None,
    session: Session = Depends(obtener_sesion)
):
    servicio = obtener_servicio(session)
    maquinas = servicio.listar()

    if estado is not None:
        maquinas = [m for m in maquinas if m.estado == estado]

    if ubicacion:
        maquinas = [
            m for m in maquinas
            if m.ubicacion and ubicacion.lower() in m.ubicacion.lower()
        ]

    if tipo:
        maquinas = [
            m for m in maquinas
            if tipo.lower() in m.tipo.lower()
        ]

    return maquinas


# Obtener una máquina por ID
@router.get("/{id_maquina}", response_model=MaquinaRespuesta)
def obtener_maquina(
    id_maquina: int,
    session: Session = Depends(obtener_sesion)
):
    servicio = obtener_servicio(session)
    maquina = servicio.obtener_por_id(id_maquina)

    if maquina is None:
        raise HTTPException(404, "La máquina no existe")

    return maquina


# Actualizar una máquina
@router.put("/{id_maquina}", response_model=MaquinaRespuesta)
def actualizar_maquina(
    id_maquina: int,
    datos: MaquinaCrear,
    session: Session = Depends(obtener_sesion)
):
    servicio = obtener_servicio(session)

    maquina = Maquina(
        **datos.model_dump(),
        id_maquina=id_maquina
    )

    try:
        resultado = servicio.actualizar_maquina(maquina)
        session.commit()
        return resultado

    except ValueError as error:
        session.rollback()
        raise HTTPException(400, str(error)) from error

    except IntegrityError as error:
        session.rollback()
        raise HTTPException(409, "Conflicto al actualizar la máquina") from error


# Dar de baja una máquina
@router.patch("/{id_maquina}/baja", response_model=MaquinaRespuesta)
def dar_baja_maquina(
    id_maquina: int,
    session: Session = Depends(obtener_sesion)
):
    servicio = obtener_servicio(session)

    try:
        resultado = servicio.dar_baja(id_maquina)
        session.commit()
        return resultado

    except ValueError as error:
        session.rollback()
        raise HTTPException(400, str(error)) from error
