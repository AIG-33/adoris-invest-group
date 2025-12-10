import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import Image from 'next/image'
import Link from 'next/link'
import { Mail, Linkedin, Quote } from 'lucide-react'

const teamMembers = [
  {
    name: 'Maksim Harbatsevich',
    role: 'Chief Executive Officer',
    bio: 'Founder, board member, and shareholder of ADORIS INVEST GROUP OÜ. Passionate entrepreneur with extensive expertise in international sales, IT, and laboratory diagnostics. Strong leadership, communication, and teaching abilities.',
    linkedin: 'https://www.linkedin.com/in/maksim-h/',
    email: 'ceo@adorisgroup.com',
    image: '/maksim-harbatsevich.jpg',
  },
  {
    name: 'Anastasiya Valentsiukevich',
    role: 'Chief Strategy Officer',
    bio: 'Chairman of the Board at IVD Group and co-founder at NewMe. Over a decade of experience in laboratory diagnostics, marketing, and research. Specializes in strategic planning and business development.',
    linkedin: 'https://www.linkedin.com/in/anastasiya-valentsiukevich-ab2570b4/',
    email: 'info@adorisgroup.com',
    image: '/anastasiya-valentsiukevich.jpg',
  },
  {
    name: 'Anastasiya Mokhan',
    role: 'Marketing Manager',
    bio: 'Creative marketing professional driving brand awareness and customer engagement. Expertise in digital marketing, content strategy, and market analysis for the medical equipment industry.',
    linkedin: 'https://www.linkedin.com/in/anastasiya-mokhan-2493391ba/',
    email: 'marketing@adorisgroup.com',
    image: '/anastasiya-mokhan.jpg',
  },
  {
    name: 'Kseniya Yudashkina',
    role: 'Project Manager',
    bio: 'Results-oriented project manager with a track record of delivering complex logistics and supply chain projects on time. Ensures seamless coordination between manufacturers, distributors, and clients.',
    linkedin: 'https://www.linkedin.com/in/kseniya-yudashkina-7125791ab/',
    email: 'projects@adorisgroup.com',
    image: '/kseniya-yudashkina.jpg',
  },
]

export default function TeamPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white to-neutral-50">
        {/* Hero Section */}
        <section className="relative bg-black text-white py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                Meet Our Team
              </h1>
              <p className="text-xl sm:text-2xl text-white/90 leading-relaxed">
                Dedicated professionals committed to excellence in medical equipment distribution
              </p>
            </div>
          </div>
        </section>

        {/* CEO Message */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12 border-t-4 border-black relative">
                <Quote className="absolute top-8 left-8 w-16 h-16 text-black/10" />
                <div className="relative z-10">
                  <h2 className="text-3xl sm:text-4xl font-bold text-[#000000] mb-8">
                    A Message from the CEO
                  </h2>
                  
                  <div className="prose prose-lg max-w-none text-neutral-700 leading-relaxed space-y-4">
                    <p>
                      Welcome to Adoris Invest Group OÜ.
                    </p>
                    
                    <p>
                      For over a decade, we have been navigating the complex world of medical and laboratory wholesale with 
                      a singular, unwavering principle: <strong className="text-black">business is about people, not just products</strong>.
                    </p>
                    
                    <p>
                      When we founded this company more than 10 years ago, we set out to do more than simply move boxes from 
                      a warehouse to a clinic. We wanted to build a bridge between the world’s leading manufacturers and the 
                      professionals who rely on their tools every day. Today, I am proud to say that we have curated one of the 
                      most comprehensive catalogs in the industry, featuring top-tier equipment and supplies from the most 
                      respected global brands.
                    </p>
                    
                    <p>
                      However, our extensive inventory is not our greatest asset—<strong className="text-black">our reputation is</strong>.
                    </p>
                    
                    <p>
                      In an industry often defined by cold transactions and rigid contracts, we have chosen a different path. 
                      We believe in the power of honest, human relationships. We understand that behind every order is a person, 
                      a patient, or a researcher depending on us. That is why transparency and integrity are not just buzzwords 
                      for us; they are the foundation of every interaction we have.
                    </p>
                    
                    <p>
                      We do not just want to be your supplier; we want to be a partner you can trust implicitly. Whether you are 
                      a long-standing client or visiting us for the first time, I want you to know that we value your trust above 
                      all else. We are committed to maintaining that trust through fair practices, open communication, and a genuine 
                      dedication to your success.
                    </p>
                    
                    <p className="text-xl font-semibold text-[#000000] pt-4">
                      Thank you for choosing Adoris Invest Group OÜ. We look forward to building a lasting, honest partnership with you.
                    </p>
                  </div>

                  <div className="mt-8 pt-8 border-t border-neutral-200">
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border-4 border-black">
                        <Image
                          src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop"
                          alt="Maksim Harbatsevich"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-xl text-[#000000]">Maksim Harbatsevich</div>
                        <div className="text-neutral-600">Chief Executive Officer</div>
                        <a
                          href="https://www.linkedin.com/in/maksim-h/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-black hover:text-neutral-700 transition-colors mt-1"
                        >
                          <Linkedin className="w-4 h-4" />
                          <span className="text-sm">Connect on LinkedIn</span>
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
        <section className="py-16 bg-neutral-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#000000] mb-4">
                Leadership Team
              </h2>
              <p className="text-center text-neutral-600 text-lg mb-12 max-w-2xl mx-auto">
                Our experienced team brings together decades of expertise in medical equipment distribution, 
                logistics, and healthcare consulting.
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
                        <h3 className="text-2xl font-bold text-[#000000] mb-2">{member.name}</h3>
                        <p className="text-black font-semibold mb-4">{member.role}</p>
                        <p className="text-neutral-600 leading-relaxed mb-4">{member.bio}</p>
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
                            Email
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
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#000000] mb-6">
                Work With a Team You Can Trust
              </h2>
              <p className="text-xl text-neutral-600 mb-8 leading-relaxed">
                Our team is dedicated to providing exceptional service and building lasting partnerships. 
                Let's discuss how we can support your needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-black to-neutral-800 text-white font-semibold rounded-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  View Our Products
                </Link>
                <Link
                  href="/company/about"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-black text-black font-semibold rounded-lg hover:bg-black hover:text-white transition-all"
                >
                  Learn More About Us
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
