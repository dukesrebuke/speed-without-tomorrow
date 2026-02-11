import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ModuleReader from '@/components/module/ModuleReader'

export default async function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  // Get the module by slug
  const { data: module } = await supabase
    .from('modules')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!module) notFound()

  // Get cards for this module
  const { data: cards } = await supabase
    .from('essay_cards')
    .select('*')
    .eq('module_id', module.id)
    .order('order_index')

  // Get practices for this module
  const { data: practices } = await supabase
    .from('practices')
    .select('*')
    .eq('module_id', module.id)
    .order('order_index')

  // Get concepts for this module
  const { data: moduleConcepts } = await supabase
    .from('module_concepts')
    .select('concept_id, concepts(*)')
    .eq('module_id', module.id)

  const concepts = moduleConcepts?.map((mc: any) => mc.concepts).filter(Boolean) || []

  return (
    <ModuleReader 
      module={module} 
      cards={cards || []} 
      practices={practices || []}
      concepts={concepts}
    />
  )
}