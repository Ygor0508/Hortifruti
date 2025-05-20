import { MercadoriaItf } from "../types/MercadoriaItf";
import { FeiranteItf} from "../types/FeiranteItf";

export interface FotoItf {
    id: number
    descricao: string
    url: string
    mercadoria_id: number
    feirante_id: number
    Mercadoria: MercadoriaItf
    Feirante: FeiranteItf
}