import SiteNav from '@/components/ui/SiteNav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav />
      {children}
    </>
  )
}
