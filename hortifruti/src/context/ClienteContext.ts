import { ClienteItf } from '@/utils/types/ClienteItf'
import { create } from 'zustand'

type ClienteStore = {
    cliente: ClienteItf
    logaCliente: (clienteLogado: ClienteItf) => void
    deslogaCliente: () => void
}

export const useClienteStore = create<ClienteStore>((set) => ({
    cliente: {} as ClienteItf,
    logaCliente: (clienteLogado) => set({cliente: clienteLogado}),
    deslogaCliente: () => set({cliente: {} as ClienteItf})
}))

// export function useHydrateCliente() {
//   const logaCliente = useClienteStore((state) => state.logaCliente)

//   useEffect(() => {
//     const clienteLocal = localStorage.getItem("clienteKey")
//     if (clienteLocal) {
//       try {
//         const dados = JSON.parse(clienteLocal)
//         if (dados?.id) {
//           logaCliente(dados)
//         }
//       } catch {
//         localStorage.removeItem("clienteKey") // limpa se JSON inválido
//       }
//     }
//   }, [logaCliente])
// }