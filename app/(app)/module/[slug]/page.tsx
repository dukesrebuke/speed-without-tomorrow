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

  const { data: practices } = await supabase
    .from('practices')
    .select('*')
    .eq('module_id', module.id)
    .order('order_index')

  // Debug logging
  console.log('🔍 Debug - Module slug:', slug)
  console.log('🔍 Debug - Module ID:', module.id)
  console.log('🔍 Debug - Module reading_path:', module.reading_path)
  console.log('🔍 Debug - Practices fetched:', practices)
  console.log('🔍 Debug - Practices count:', practices?.length)

  const { data: moduleConcepts } = await supabase
    .from('module_concepts')
    .select('concept_id, concepts(*)')
    .eq('module_id', module.id)

  const concepts = moduleConcepts?.map((mc: any) => mc.concepts).filter(Boolean) || []

  return <ModuleReader module={module} cards={cards || []} practices={practices || []} concepts={concepts} />
}
