import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import Image from 'next/image'
import Link from 'next/link'
import { Mail, Linkedin, Quote } from 'lucide-react'
import { getServerCompany } from '@/lib/server-company'
import { getDictionary } from '@/lib/translations'

// Team data — shown only for Adoris group companies
// For other companies this page will show a generic message
const adorisTeamMembers = [
  {
    name: 'Maksim Harbatsevich',
    role: 'Chief Executive Officer',
    bioKey: 'maksim' as const,
    linkedin: 'https://www.linkedin.com/in/maksim-h/',
    email: 'ceo@adorisgroup.com',
    image: '/maksim-harbatsevich.jpg',
  },
  {
    name: 'Alexei Myshkouski',
    role: 'Chief Software Developer',
    bioKey: 'alexei' as const,
    linkedin: 'https://www.linkedin.com/in/alexei-myshkouski-6788981b9/',
    email: 'dev@adorisgroup.com',
    image: '/alexei-myshkouski.jpg',
  },
  {
    name: 'Anastasiya Valentsiukevich',
    role: 'Chief Strategy Officer',
    bioKey: 'anastasiyaV' as const,
    linkedin: 'https://www.linkedin.com/in/anastasiya-valentsiukevich-ab2570b4/',
    email: 'info@adorisgroup.com',
    image: '/anastasiya-valentsiukevich.jpg',
  },
  {
    name: 'Anastasiya Mokhan',
    role: 'Marketing Manager',
    bioKey: 'anastasiyaM' as const,
    linkedin: 'https://www.linkedin.com/in/anastasiya-mokhan-2493391ba/',
    email: 'marketing@adorisgroup.com',
    image: '/anastasiya-mokhan.jpg',
  },
  {
    name: 'Kseniya Yudashkina',
    role: 'Project Manager',
    bioKey: 'kseniya' as const,
    linkedin: 'https://www.linkedin.com/in/kseniya-yudashkina-7125791ab/',
    email: 'projects@adorisgroup.com',
    image: '/kseniya-yudashkina.jpg',
  },
]

export default async function TeamPage() {
  const company = await getServerCompany()
  const language = (company?.language || 'en') as 'en' | 'ru'
  const dict = getDictionary(language)

  // Only show team members for Adoris-related domains
  const isAdorisGroup = company?.domain?.includes('adorisgroup') || company?.domain?.includes('ivdgroup') || company?.domain?.includes('ivd.by')
  const teamMembers = isAdorisGroup ? adorisTeamMembers : []
  
  return (
    <>
      <Header translations={dict.nav} />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative text-white py-20" style={{ backgroundColor: 'var(--company-primary, #333333)' }}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                {dict.team.title}
              </h1>
              <p className="text-xl sm:text-2xl text-white/90 leading-relaxed">
                {dict.team.subtitle}
              </p>
            </div>
          </div>
        </section>

        {/* CEO Message */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12 border-t-4 border-black relative">
                <Quote className="absolute top-8 left-8 w-16 h-16 text-black/10" />
                <div className="relative z-10">
                  <h2 className="text-3xl sm:text-4xl font-bold text-black mb-8">
                    {dict.team.messageTitle}
                  </h2>
                  
                  <div className="prose prose-lg max-w-none text-neutral-700 leading-relaxed space-y-4 prose-headings:text-black prose-strong:text-black">
                    <p>
                      {dict.team.messageWelcome}
                    </p>
                    
                    <p>
                      {dict.team.messageParagraph1}
                    </p>
                    
                    <p>
                      {dict.team.messageParagraph2}
                    </p>
                    
                    <p>
                      {dict.team.messageParagraph3}
                    </p>
                    
                    <p>
                      {dict.team.messageParagraph4}
                    </p>
                    
                    <p>
                      {dict.team.messageParagraph5}
                    </p>
                    
                    <p className="text-xl font-semibold text-black pt-4">
                      {dict.team.messageThankYou || 'Thank you for choosing us. We look forward to building a lasting, honest partnership with you.'}
                    </p>
                  </div>

                  <div className="mt-8 pt-8 border-t border-neutral-200">
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border-4 border-black">
                        <Image
                          src="/maksim-harbatsevich.jpg"
                          alt="Maksim Harbatsevich"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-xl text-black">Maksim Harbatsevich</div>
                        <div className="text-neutral-600">Chief Executive Officer</div>
                        <a
                          href="https://www.linkedin.com/in/maksim-h/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-black hover:text-neutral-700 transition-colors mt-1"
                        >
                          <Linkedin className="w-4 h-4" />
                          <span className="text-sm">{dict.team.connectLinkedIn}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Members Grid */}
        <section className="py-16 bg-neutral-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center text-black mb-4">
                {dict.team.leadershipTeam}
              </h2>
              <p className="text-center text-neutral-600 text-lg mb-12 max-w-2xl mx-auto">
                {dict.team.leadershipDescription}
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                {teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all p-8 border border-neutral-200"
                  >
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="relative w-32 h-32 rounded-xl overflow-hidden flex-shrink-0 mx-auto sm:mx-0 border-4 border-black">
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-2xl font-bold text-black mb-2">{member.name}</h3>
                        <p className="text-black font-semibold mb-4">{member.role}</p>
                        <p className="text-neutral-600 leading-relaxed mb-4">{dict.team.memberBio[member.bioKey]}</p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-start">
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#0077b5] text-white rounded-lg hover:bg-[#005582] transition-colors text-sm font-medium"
                          >
                            <Linkedin className="w-4 h-4" />
                            LinkedIn
                          </a>
                          <a
                            href={`mailto:${member.email}`}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 border-2 border-neutral-300 text-neutral-700 rounded-lg hover:border-black hover:text-black transition-colors text-sm font-medium"
                          >
                            <Mail className="w-4 h-4" />
                            {dict.team.email}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Join Us CTA */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-black mb-6">
                {dict.team.workWithTeam}
              </h2>
              <p className="text-xl text-neutral-600 mb-8 leading-relaxed">
                {dict.team.workWithTeamDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-black to-neutral-800 text-white font-semibold rounded-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  {dict.team.viewProducts}
                </Link>
                <Link
                  href="/company/about"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-black text-black font-semibold rounded-lg hover:bg-black hover:text-white transition-all"
                >
                  {dict.team.learnMore}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer translations={dict.footer} />
    </>
  )
}
