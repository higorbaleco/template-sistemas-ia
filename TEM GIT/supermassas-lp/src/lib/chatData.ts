import { ChatConversation, Capability } from './types'

export const chatConversation: ChatConversation = {
  agentName: 'SuperMassas',
  status: 'AO VIVO',
  messages: [
    {
      id: '1',
      sender: 'user',
      text: 'Olá, como faço um pedido?',
      timestamp: '10:30',
    },
    {
      id: '2',
      sender: 'bot',
      text: 'Olá! Bem-vindo à SuperMassas. Posso ajudar com pedidos, consultar estoque ou tirar dúvidas sobre nossos produtos.',
      timestamp: '10:30',
    },
    {
      id: '3',
      sender: 'user',
      text: 'Qual é o preço da massa fresca tipo talharim?',
      timestamp: '10:31',
    },
    {
      id: '4',
      sender: 'bot',
      text: 'O talharim fresco está R$ 12,00 por kg. Temos também versão integral por R$ 14,50. Posso adicionar ao seu carrinho?',
      timestamp: '10:31',
    },
    {
      id: '5',
      sender: 'user',
      text: '2kg do talharim comum, por favor',
      timestamp: '10:32',
    },
    {
      id: '6',
      sender: 'bot',
      text: 'Perfeito! 2kg de talharim fresco adicionados. Total: R$ 24,00. Deseja mais alguma coisa?',
      timestamp: '10:32',
    },
    {
      id: '7',
      sender: 'user',
      text: 'Qual é o prazo de entrega?',
      timestamp: '10:33',
    },
  ],
}

export const capabilities: Capability[] = [
  {
    id: 'cap-1',
    title: 'Atendimento humanizado 24/7',
    description: 'Responde com contexto, memória de conversa e tom adequado, a qualquer hora.',
  },
  {
    id: 'cap-2',
    title: 'WhatsApp, site e múltiplos canais',
    description: 'Entra onde o cliente já está, sem fricção e sem trocar de canal.',
  },
  {
    id: 'cap-3',
    title: 'Qualificação e vendas automatizadas',
    description: 'Identifica intenção, capta dados e avança o lead no funil com consistência.',
  },
  {
    id: 'cap-4',
    title: 'Aprende com cada conversa',
    description: 'Treinada especificamente para o negócio e preparada para evoluir com o uso.',
  },
]
