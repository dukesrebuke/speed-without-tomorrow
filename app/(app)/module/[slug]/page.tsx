import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ModuleReader from '@/components/module/ModuleReader'
import ConceptGraph from '@/components/ConceptGraph'

export default async function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: module } = await supabase
    .from('modules')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
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

  const { data: moduleConcepts } = await supabase
    .from('module_concepts')
    .select('concept_id, concepts(*)')
    .eq('module_id', module.id)

  const concepts = moduleConcepts?.map((mc: any) => mc.concepts).filter(Boolean) || []

  const { data: allModuleConcepts } = await supabase
    .from('module_concepts')
    .select(`
      concepts (
        id,
        name,
        short_definition
      ),
      modules (
        module_number,
        title,
        slug,
        reading_path
      )
    `)

  const conceptMap = new Map()

  allModuleConcepts?.forEach((item: any) => {
    if (!item.concepts || !item.modules) return
    if (item.modules.reading_path !== module.reading_path) return

    const conceptId = item.concepts.id
    if (!conceptMap.has(conceptId)) {
      conceptMap.set(conceptId, {
        ...item.concepts,
        modules: []
      })
    }

    conceptMap.get(conceptId).modules.push({
      module_number: item.modules.module_number,
      module_title: item.modules.title,
      module_slug: item.modules.slug
    })
  })

  const conceptsWithModules = [...conceptMap.values()]

  return (
    <>
      <ModuleReader
        module={module}
        cards={cards || []}
        practices={practices || []}
        concepts={concepts}
      />
      <ConceptGraph
        concepts={conceptsWithModules}
        currentModuleNumber={module.module_number}
      />
    </>
  )
}
