// Datos necesarios para registrar una imputación de horas
export interface ImputacionHorasCrear {
    id_averia: number;
    id_tecnico: number;

    fecha: string;
    horas: string;
    descripcion_trabajo: string;
}


// Datos que devuelve FastAPI
export interface ImputacionHorasRespuesta extends ImputacionHorasCrear {
    id_imputacion: number;
}
