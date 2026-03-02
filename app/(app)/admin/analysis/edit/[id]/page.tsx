import AnalysisEditor from '@/components/admin/AnalysisEditor'

export default async function EditAnalysisPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  return (
    <>
      <AnalysisEditor analysisId={id} />
    </>
  )
}