import { UsuarioItf } from '@/utils/types/UsuarioItf'
import { create } from 'zustand'

type ClienteStore = {
    cliente: UsuarioItf
    logaCliente: (clienteLogado: UsuarioItf) => void
    deslogaCliente: () => void
}

export const useClienteStore = create<ClienteStore>((set) => ({
    cliente: {} as UsuarioItf,
    logaCliente: (clienteLogado) => set({cliente: clienteLogado}),
    deslogaCliente: () => set({cliente: {} as UsuarioItf})
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