import { createClient } from "@/lib/supabase/server"
import PracticeReader from "@/components/practice/PracticeReader"

export default async function PracticePage({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createClient()
  const { slug } = await params

  const { data: module } = await supabase
    .from("modules")
    .select("id, title, module_number, reading_path")
    .eq("slug", slug)
    .single()

  if (!module) {
    return <div className="p-10 text-center">Module not found.</div>
  }

  const { data: practices } = await supabase
    .from("practices")
    .select("*")
    .eq("module_id", module.id)
    .order("order_index")

  if (!practices || practices.length === 0) {
    return (
      <div className="p-10 text-center">
        <p className="text-stone-600">No practices available for this module yet.</p>
      </div>
    )
  }

  return (
    <PracticeReader 
      practices={practices}
      moduleTitle={module.title}
      moduleNumber={module.module_number}
      moduleId={module.id}
      readingPath={module.reading_path}
    />
  )
}
