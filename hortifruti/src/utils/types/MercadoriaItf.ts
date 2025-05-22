import { FeiranteItf } from "./FeiranteItf"
import { FotoItf} from "./FotoItf"

export interface MercadoriaItf {
    id: number
    nome: string
    preco: number
    quantidade: number
    categoria: String
    localizacao: String
    destaque: boolean
    foto: string
    createdAt: Date
    updatedAt: Date
    feirante: FeiranteItf
    fotos: FotoItf[]
}