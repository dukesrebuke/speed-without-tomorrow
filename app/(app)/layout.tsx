import SiteNav from '@/components/ui/SiteNav'
import { Toaster } from 'sonner'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster position="top-right" />
      <SiteNav />
      {children}
    </>
  )
}