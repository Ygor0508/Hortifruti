import { UsuarioItf } from "./UsuarioItf"
import { MercadoriaItf } from "./MercadoriaItf"

export enum Status {
  EM_ANDAMENTO = "EM_ANDAMENTO",
  FINALIZADO = "FINALIZADO",
  CANCELADO = "CANCELADO",
  PENDENTE = "PENDENTE",
  ENTREGUE = "ENTREGUE",
  EM_PREPARACAO = "EM_PREPARACAO",
  EM_ROTA = "EM_ROTA",
  RETORNANDO = "RETORNANDO",
}


export interface PedidoItf {
  id: number
  status: Status
  createdAt: string // DateTime no Prisma, aqui usa string
  updatedAt: string
  mercadoria: MercadoriaItf
  mercadoria_Id: number
  usuario: UsuarioItf
  usuario_id: string
}
