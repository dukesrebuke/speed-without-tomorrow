export default function SectionCard({
  title,
  children,
}: {
  title?: string
  children: React.ReactNode
}) {
  return (
    <section className="card-lift relative bg-[#fbf8f2] border border-[#e8e1d6] rounded-2xl px-10 py-12 shadow-sm">
      
      {/* Subtle accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#d6cbbd] to-transparent rounded-t-2xl" />

      {title && (
        <h2 className="text-2xl font-serif mb-6 text-stone-900 tracking-wide">
          {title}
        </h2>
      )}

      <div className="text-stone-800 text-[17px] leading-relaxed space-y-4">
        {children}
      </div>
    </section>
  )
}
