import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkoutStore, type ProfileId } from '../lib/store'
import categories from '../data/categories.json'

export const Home: React.FC = () => {
  const navigate = useNavigate()
  const { profileId, setProfile } = useWorkoutStore()

  const handleSelectProfile = (id: ProfileId) => {
    setProfile(id)
  }

  const handleChooseCategory = (categoryId: string) => {
    navigate(`/categoria/${categoryId}`)
  }

  // Tela de seleção de perfil
  if (!profileId) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          padding: '20px',
          backgroundColor: '#1a1a1a'
        }}
      >
        <h1 style={{ fontSize: '28px', marginBottom: '8px', textAlign: 'center' }}>
          Catálogo de Treinos
        </h1>
        <p
          style={{
            fontSize: '14px',
            color: '#999',
            marginBottom: '40px',
            textAlign: 'center'
          }}
        >
          Escolha quem vai treinar
        </p>

        <div style={{ display: 'flex', gap: '16px', flexDirection: 'column', width: '100%', maxWidth: '280px' }}>
          {(['higor', 'brenda'] as const).map((profile) => (
            <button
              key={profile}
              onClick={() => handleSelectProfile(profile)}
              style={{
                padding: '16px 20px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: profile === 'higor' ? '#1b5e20' : '#4a148c',
                color: '#fff',
                fontSize: '18px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9'
                e.currentTarget.style.transform = 'scale(1.02)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              {profile.charAt(0).toUpperCase() + profile.slice(1)}
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Tela com categorias após escolher perfil
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#1a1a1a',
        paddingBottom: '60px'
      }}
    >
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #2a2a2a' }}>
        <h1 style={{ fontSize: '20px', marginBottom: '4px' }}>
          Olá, {profileId.charAt(0).toUpperCase() + profileId.slice(1)}
        </h1>
        <p style={{ fontSize: '14px', color: '#999' }}>O que vamos treinar hoje?</p>
        <button
          onClick={() => {
            useWorkoutStore.setState({ profileId: null })
          }}
          style={{
            marginTop: '12px',
            padding: '8px 12px',
            backgroundColor: '#404040',
            color: '#999',
            border: 'none',
            borderRadius: '6px',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          Trocar perfil
        </button>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 20px',
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '12px',
          alignContent: 'start'
        }}
      >
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => handleChooseCategory(category.id)}
            style={{
              padding: '16px',
              backgroundColor: '#2a2a2a',
              borderRadius: '8px',
              border: '1px solid #3a3a3a',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#333'
              e.currentTarget.style.borderColor = '#4CAF50'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#2a2a2a'
              e.currentTarget.style.borderColor = '#3a3a3a'
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>
              {category.nome}
            </h3>
            <p style={{ fontSize: '13px', color: '#999' }}>{category.descricao}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
