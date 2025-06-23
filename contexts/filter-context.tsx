"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'

// Tipos para os filtros
export type FilterCategory = 'all' | 'arte' | 'tecnologia' | 'musica' | 'idiomas' | 'culinaria' | 'design' | 'negocios'

export interface FilterState {
  category: FilterCategory
  searchQuery: string
  sortBy: 'recent' | 'popular' | 'rating'
  skillLevel: 'all' | 'iniciante' | 'intermediario' | 'avancado'
}

export interface FilterContextType {
  filters: FilterState
  setCategory: (category: FilterCategory) => void
  setSearchQuery: (query: string) => void
  setSortBy: (sortBy: FilterState['sortBy']) => void
  setSkillLevel: (level: FilterState['skillLevel']) => void
  clearFilters: () => void
  applyFilters: (newFilters: Partial<FilterState>) => void
}

const defaultFilters: FilterState = {
  category: 'all',
  searchQuery: '',
  sortBy: 'recent',
  skillLevel: 'all'
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters)

  const setCategory = (category: FilterCategory) => {
    setFilters(prev => ({ ...prev, category }))
  }

  const setSearchQuery = (searchQuery: string) => {
    setFilters(prev => ({ ...prev, searchQuery }))
  }

  const setSortBy = (sortBy: FilterState['sortBy']) => {
    setFilters(prev => ({ ...prev, sortBy }))
  }

  const setSkillLevel = (skillLevel: FilterState['skillLevel']) => {
    setFilters(prev => ({ ...prev, skillLevel }))
  }

  const clearFilters = () => {
    setFilters(defaultFilters)
  }

  const applyFilters = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  return (
    <FilterContext.Provider value={{
      filters,
      setCategory,
      setSearchQuery,
      setSortBy,
      setSkillLevel,
      clearFilters,
      applyFilters
    }}>
      {children}
    </FilterContext.Provider>
  )
}

export function useFilters() {
  const context = useContext(FilterContext)
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider')
  }
  return context
}

// Função helper para obter o texto da categoria em português
export function getCategoryLabel(category: FilterCategory): string {
  const labels: Record<FilterCategory, string> = {
    all: 'Todas as Categorias',
    arte: 'Arte & Design',
    tecnologia: 'Tecnologia',
    musica: 'Música',
    idiomas: 'Idiomas',
    culinaria: 'Culinária',
    design: 'Design',
    negocios: 'Negócios'
  }
  return labels[category]
}

// Função helper para mapear categorias para os filtros existentes
export function mapCategoryToExisting(category: FilterCategory): string {
  const mapping: Record<FilterCategory, string> = {
    all: 'Todos',
    arte: 'Arte',
    tecnologia: 'Tecnologia',
    musica: 'Música',
    idiomas: 'Idiomas',
    culinaria: 'Culinária',
    design: 'Design',
    negocios: 'Negócios'
  }
  return mapping[category]
}
