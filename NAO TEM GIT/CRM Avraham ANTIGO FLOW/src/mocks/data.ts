import type { CRMState } from '../domain/types'

export const initialState: CRMState = {
  contacts: [
    { id: 'ct1', name: 'Renato Munarin', email: 'renato@brownieswilly.com', phone: '+55 44 98835-3858', companyName: 'Brownies Willy', status: 'client' },
    { id: 'ct2', name: 'Adriano Pereira', email: 'adriano@lavenus.com', phone: '+55 41 99999-1111', companyName: 'Clínica Lavenus', status: 'client' },
    { id: 'ct3', name: 'Luccas Cesar', email: 'luccas@aracalce.com', phone: '+55 41 99999-2222', companyName: 'Grupo Aracalce', status: 'prospect' },
  ],
  deals: [
    { id: 'd1', title: 'BM Disparos 2k', amount: 2100, stage: 'ganho', companyId: 'c1', companyName: 'Datlo', contactId: 'ct1', contactName: 'Renato Munarin', ownerId: 's1', expectedCloseDate: '2026-04-28', createdAt: '2026-04-01', updatedAt: '2026-04-02' },
    { id: 'd2', title: 'Clínica Lavenus', amount: 2500, stage: 'ganho', companyId: 'c2', companyName: 'Lavenus', contactId: 'ct2', contactName: 'Adriano Pereira', ownerId: 's1', expectedCloseDate: '2026-04-20', createdAt: '2026-04-01', updatedAt: '2026-04-03' },
    { id: 'd3', title: 'NeymarJR Edutech', amount: 2300, stage: 'ganho', companyId: 'c3', companyName: 'NeyGoods', contactId: 'ct3', contactName: 'Luccas Cesar', ownerId: 's1', expectedCloseDate: '2026-04-26', createdAt: '2026-04-05', updatedAt: '2026-04-06' },
    { id: 'd4', title: 'SuperCacheta', amount: 0, stage: 'perdido', companyId: 'c4', companyName: 'SuperCacheta', contactId: 'ct2', contactName: 'Adriano Pereira', ownerId: 's1', expectedCloseDate: '2026-02-10', createdAt: '2026-02-01', updatedAt: '2026-02-10', lostAt: '2026-02-10' },
    { id: 'd5', title: 'Garcia Bet & Rifas', amount: 1750, stage: 'perdido', companyId: 'c5', companyName: 'Garcia', contactId: null, contactName: null, ownerId: 's1', expectedCloseDate: '2026-04-12', createdAt: '2026-04-10', updatedAt: '2026-04-12', lostAt: '2026-04-12' },
    { id: 'd6', title: 'Máxima Bet', amount: 9000, stage: 'proposta', companyId: 'c6', companyName: 'Grupo Suprema Gaming', contactId: null, contactName: null, ownerId: 's1', expectedCloseDate: '2026-04-29', createdAt: '2026-04-14', updatedAt: '2026-04-14' },
    { id: 'd7', title: 'Brownies Willy', amount: 2000, stage: 'negociacao', companyId: 'c7', companyName: 'Brownies Willy', contactId: null, contactName: null, ownerId: 's1', expectedCloseDate: '2026-04-30', createdAt: '2026-04-16', updatedAt: '2026-04-16' }
  ],
  products: [
    { id: 'p1', name: 'Chatbot', sku: 'PROD-001', category: 'Chatbot', cost: 800, price: 2000, revenueType: 'unica', status: 'ativo' },
    { id: 'p2', name: 'Disparos API Oficial', sku: 'PROD-002', category: 'Disparos', cost: 0.21, price: 0.56, revenueType: 'recorrente', status: 'ativo' }
  ],
  activities: [
    { id: 'a1', title: 'Follow up Máxima', dueAt: '2026-04-29T21:00:00', priority: 'media', status: 'open', dealId: 'd6', type: 'call' },
    { id: 'a2', title: 'Fechamento Brownies', dueAt: '2026-04-30T21:00:00', priority: 'alta', status: 'open', dealId: 'd7', type: 'meeting' }
  ],
  cadences: [
    { id: 'cd1', name: 'Prospecção', active: true, steps: [{ day: 1, type: 'call' }, { day: 2, type: 'meeting' }, { day: 3, type: 'email' }] }
  ]
}
