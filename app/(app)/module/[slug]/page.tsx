import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ModuleReader from '@/components/module/ModuleReader'

export default async function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: module } = await supabase
    .from('modules')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!module) notFound()

  const { data: cards } = await supabase
    .from('essay_cards')
    .select('*')
    .eq('module_id', module.id)
    .order('order_index')

  const { data: practices, error: practicesError } = await supabase
    .from('practices')
    .select('*')
    .eq('module_id', module.id)
    .order('order_index')

  const { data: moduleConcepts } = await supabase
    .from('module_concepts')
    .select('concept_id, concepts(*)')
    .eq('module_id', module.id)

  const concepts = moduleConcepts?.map((mc: any) => mc.concepts).filter(Boolean) || []

  // This will show in Netlify function logs
  if (practicesError) {
    console.error('ERROR fetching practices:', practicesError)
  }
  console.log(`Module: ${slug} | Practices found: ${practices?.length ?? 0}`)

  return <ModuleReader module={module} cards={cards || []} practices={practices || []} concepts={concepts} />
}