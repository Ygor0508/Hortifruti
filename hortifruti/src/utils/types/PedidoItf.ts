import { ConsumidorItf } from "./ConsumidorItf"
import { MercadoriaItf } from "./MercadoriaItf"
import { MotoboyItf } from "./MotoboyItf"

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

export enum Tipo_entrega {
  RETIRADA_NO_LOCAL = "RETIRADA_NO_LOCAL",
  ENTREGA = "ENTREGA",
  ENTREGA_PROGRAMADA = "ENTREGA_PROGRAMADA",
}

export interface PedidoItf {
  id: number
  status: Status
  tipo_entrega: Tipo_entrega
  createdAt: string // DateTime no Prisma, aqui usa string
  updatedAt: string
  consumidorId: number
  consumidor: ConsumidorItf
  mercadoriaId: number
  mercadoria: MercadoriaItf
  motoboyId?: number | null
  motoboy?: MotoboyItf | null
}
