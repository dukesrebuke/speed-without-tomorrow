import { createClient } from "@/lib/supabase/server"
import ChapterReader from "@/components/chapter/ChapterReader"

export default async function ChapterPage({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createClient()
  const { slug } = await params

  const { data: module } = await supabase
    .from("modules")
    .select("id, title, module_number")
    .eq("slug", slug)
    .single()

  if (!module) {
    return <div className="p-10 text-center">Chapter not found.</div>
  }

  const { data: cards } = await supabase
    .from("essay_cards")
    .select("*")
    .eq("module_id", module.id)
    .order("order_index")

  return (
    <ChapterReader 
      cards={cards || []} 
      moduleTitle={module.title}
      moduleNumber={module.module_number}
      moduleId={module.id}
    />
  )
}