export interface Module {
  id: string
  module_number: number
  title: string
  slug: string
  description: string | null
  estimated_reading_minutes: number | null
  status: 'draft' | 'published' | 'archived'
  created_at: string
  updated_at: string
}

export interface EssayCard {
  id: string
  module_id: string
  order_index: number
  title: string
  content: string
  created_at: string
  updated_at: string
}

export interface Concept {
  id: string
  concept_id: string
  name: string
  short_definition: string | null
  long_explanation: string | null
  related_thinkers: string[] | null
  status: string
  created_at: string
  updated_at: string
}
