"""Carga de datos de demostración en PostgreSQL de Docker."""

from datetime import date, datetime, timedelta, timezone
from decimal import Decimal

from sqlalchemy import select, func
from sqlalchemy.engine import make_url

from app.persistencia.database import SessionLocal, DATABASE_URL
from app.persistencia.modelo.maquina_orm import MaquinaORM
from app.persistencia.modelo.persona_orm import PersonaORM
from app.persistencia.modelo.averia_orm import AveriaORM
from app.persistencia.modelo.imputacionhoras_orm import ImputacionHorasORM

from app.nucleo.modelo.enums import (
    Criticidad, EstadoMaquina, RolPersona, Especialidad,
    TipoFallo, Prioridad, EstadoAveria, TipoSolucion
)


def cargar_datos():

    # Comprobar que estamos utilizando PostgreSQL de Docker
    url = make_url(DATABASE_URL)
    if url.host != "db" or url.database != "mantenimiento":
        raise RuntimeError("Solo se permite cargar datos en Docker local")

    with SessionLocal.begin() as session:

        # Evitar duplicados y no modificar datos existentes
        modelos = [MaquinaORM, PersonaORM, AveriaORM, ImputacionHorasORM]

        if any(session.scalar(select(func.count()).select_from(m)) for m in modelos):
            print("La base de datos ya contiene datos. No se modifica.")
            return

        # 1. Máquinas
        datos_maquinas = [
            ("M001", "Prensa hidráulica", "Prensa", EstadoMaquina.OPERATIVA),
            ("M002", "Cinta transportadora", "Transporte", EstadoMaquina.EN_AVERIA),
            ("M003", "Torno CNC", "Mecanizado", EstadoMaquina.OPERATIVA),
            ("M004", "Robot soldadura", "Robot", EstadoMaquina.FUERA_SERVICIO),
            ("M005", "Fresadora industrial", "Mecanizado", EstadoMaquina.OPERATIVA),
        ]

        maquinas = [
            MaquinaORM(
                codigo=codigo, nombre=nombre, tipo=tipo,
                estado=estado, criticidad=Criticidad.ALTA,
                ubicacion="Nave de producción"
            )
            for codigo, nombre, tipo, estado in datos_maquinas
        ]

        session.add_all(maquinas)
        session.flush()

        # 2. Personas
        datos_personas = [
            ("Carlos", "Martínez", RolPersona.OPERARIO, None),
            ("Ana", "García", RolPersona.OPERARIO, None),
            ("Pedro", "López", RolPersona.TECNICO, Especialidad.MECANICA),
            ("Laura", "Fernández", RolPersona.TECNICO, Especialidad.ELECTRICA),
            ("Miguel", "Sánchez", RolPersona.RESPONSABLE, None),
        ]

        personas = [
            PersonaORM(
                nombre=nombre, apellidos=apellidos,
                rol=rol, especialidad=especialidad,
                activo=True
            )
            for nombre, apellidos, rol, especialidad in datos_personas
        ]

        session.add_all(personas)
        session.flush()

        # 3. Averías
        # Máquina, título, estado, prioridad, tipo de fallo y parada
        datos_averias = [
            (0, "Vibración anómala", EstadoAveria.ABIERTA, Prioridad.MEDIA, TipoFallo.MECANICO, False),
            (2, "Ruido en motor", EstadoAveria.ABIERTA, Prioridad.BAJA, TipoFallo.MECANICO, False),
            (1, "Rotura de rodamiento", EstadoAveria.ASIGNADA, Prioridad.ALTA, TipoFallo.MECANICO, True),
            (4, "Fallo de sensor", EstadoAveria.ASIGNADA, Prioridad.MEDIA, TipoFallo.ELECTRONICO, False),
            (1, "Bloqueo transportador", EstadoAveria.EN_CURSO, Prioridad.URGENTE, TipoFallo.MECANICO, True),
            (3, "Fallo eléctrico", EstadoAveria.EN_CURSO, Prioridad.URGENTE, TipoFallo.ELECTRICO, True),
            (0, "Fuga hidráulica", EstadoAveria.RESUELTA, Prioridad.ALTA, TipoFallo.HIDRAULICO, True),
            (2, "Error posicionamiento", EstadoAveria.RESUELTA, Prioridad.MEDIA, TipoFallo.ELECTRONICO, False),
            (4, "Desgaste herramienta", EstadoAveria.CERRADA, Prioridad.BAJA, TipoFallo.MECANICO, False),
            (0, "Sustitución válvula", EstadoAveria.CERRADA, Prioridad.MEDIA, TipoFallo.HIDRAULICO, True),
        ]

        averias = []
        fecha_base = datetime(2026, 10, 1, 8, tzinfo=timezone.utc)

        for i, (maq, titulo, estado, prioridad, fallo, parada) in enumerate(datos_averias):

            resuelta = estado in (EstadoAveria.RESUELTA, EstadoAveria.CERRADA)
            cerrada = estado == EstadoAveria.CERRADA
            asignada = estado != EstadoAveria.ABIERTA
            deteccion = fecha_base + timedelta(days=i)

            averia = AveriaORM(
                numero=f"DEMO-{i+1:03d}",
                id_maquina=maquinas[maq].id_maquina,
                id_reportada_por=personas[i % 2].id_persona,
                id_tecnico_asignado=personas[2 + i % 2].id_persona if asignada else None,
                id_validada_por=personas[4].id_persona if cerrada else None,
                fecha_deteccion=deteccion,
                titulo=titulo,
                sintoma=f"Se detecta: {titulo.lower()}",
                tipo_fallo=fallo,
                prioridad=prioridad,
                maquina_parada=parada,
                estado=estado,
                causa_raiz="Desgaste del componente" if resuelta else None,
                solucion_aplicada="Reparación realizada" if resuelta else None,
                tipo_solucion=TipoSolucion.DEFINITIVA if resuelta else None,
                fecha_resolucion=deteccion + timedelta(days=1) if resuelta else None,
                fecha_cierre=deteccion + timedelta(days=2) if cerrada else None
            )

            averias.append(averia)

        session.add_all(averias)
        session.flush()

        # 4. Horas imputadas
        # Dos imputaciones por cada avería en curso, resuelta o cerrada
        imputaciones = []

        for averia in averias[4:]:

            for tecnico, horas in [(personas[2], "1.50"), (personas[3], "2.00")]:

                imputaciones.append(
                    ImputacionHorasORM(
                        id_averia=averia.id_averia,
                        id_tecnico=tecnico.id_persona,
                        fecha=averia.fecha_deteccion.date(),
                        horas=Decimal(horas),
                        descripcion_trabajo="Intervención técnica de mantenimiento"
                    )
                )

        session.add_all(imputaciones)

    # SessionLocal.begin() confirma automáticamente la transacción
    print("Datos de demostración cargados correctamente.")
    print("5 máquinas, 5 personas, 10 averías y 12 imputaciones.")


if __name__ == "__main__":
    cargar_datos()
