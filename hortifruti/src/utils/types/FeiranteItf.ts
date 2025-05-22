import { MercadoriaItf } from "./MercadoriaItf"

export interface FeiranteItf {
  id: number
  nome: string
  email: string
  senha: string
  telefone: string
  createdAt: string // ou Date
  updatedAt?: string // ou Date, e opcional
  mercadorias?: MercadoriaItf[]
//   fotos_mercadoria?: FotoMercadoriaItf
}
