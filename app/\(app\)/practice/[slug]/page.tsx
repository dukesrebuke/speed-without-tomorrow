import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import PracticeReader from "@/components/practice/PracticeReader"

export default async function PracticePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: module } = await supabase
    .from("modules")
    .select("id, title, module_number, reading_path, slug")
    .eq("slug", slug)
    .single()

  if (!module) notFound()

  const { data: practices } = await supabase
    .from("practices")
    .select("*")
    .eq("module_id", module.id)
    .order("order_index")

  if (!practices || practices.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center p-10">
          <h1 className="text-2xl font-serif mb-4 text-stone-900">{module.title}</h1>
          <p className="text-stone-600">No practices available for this module yet.</p>
        </div>
      </div>
    )
  }

  return (
    <PracticeReader 
      practices={practices}
      moduleTitle={module.title}
      moduleNumber={module.module_number}
      moduleSlug={module.slug}
      moduleId={module.id}
      readingPath={module.reading_path}
    />
  )
}