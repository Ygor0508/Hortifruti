// import { FeiranteItf } from "./FeiranteItf"
// import { MercadoriaItf } from "./MercadoriaItf"
import { PedidoItf } from "./PedidoItf"

export interface UsuarioItf {
  id: string
  nome: string
  email: string
  senha: string
  nivel: number
  createdAt: string  // DateTime no Prisma, aqui string ISO
  updatedAt: string
  pedidos: PedidoItf
  // telefone: string
  // endereco: string
  // codigoRecuperacao?: string | null
  // Não incluí pedidos para evitar referência circular direta
}
