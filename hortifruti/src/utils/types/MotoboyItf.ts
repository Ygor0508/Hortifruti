export interface MotoboyItf {
  id: number
  nome: string
  email: string
  senha: string
  telefone: string
  veiculo: string
  modelo_Veiculo: string
  placa_Veiculo: string
  createdAt: string  // ISO date string
  updatedAt: string
  // pedidos não incluído para evitar referência circular
}
