'use client'

import { ArrowDown, ArrowUpRight, Asterisk, Circle } from 'lucide-react'

const roles = [
  {
    years: '2024—NOW',
    company: 'ONLYFANS — SELF-EMPLOYED-ish',
    role: 'Premium Content Creator & Director of Strategic Thirst',
    copy: 'Built a subscriber empire using one ring light, two houseplants, and the confidence of a man who has never opened his front-facing camera by accident. Personally replies “thanks babe” at enterprise scale.',
    tag: 'Top 0.0001%*',
  },
  {
    years: '2023—2024',
    company: 'ONLYFANS UNIVERSITY',
    role: 'Professor of Advanced Paywall Studies',
    copy: 'Taught creators how to turn “link in bio” into a complete go-to-market strategy. Thesis: scarcity is just forgetting to post for three weeks.',
    tag: 'Magna Cum Loudly',
  },
  {
    years: '2021—2023',
    company: 'RING LIGHT CAPITAL',
    role: 'Venture Partner, Bedroom Economy',
    copy: 'Invested exclusively in flattering angles and suspiciously expensive bathrobes. Achieved a 400% return on investment and a 900% increase in mirror selfies.',
    tag: 'Series DD',
  },
  {
    years: '2019—2021',
    company: 'LINKEDIN AFTER DARK',
    role: 'B2B Content Creator (Business to Bedroom)',
    copy: 'Combined corporate thought leadership with premium subscriber funnels. Every post began “I was laid off today” and ended with a discount code.',
    tag: 'Thought Seduction',
  },
  {
    years: '2017—2019',
    company: 'MY PARENTS’ WIFI',
    role: 'Junior Webcam Logistics Coordinator',
    copy: 'Managed a global media operation from the spare bedroom while shouting “I am in a meeting” whenever anyone touched the router.',
    tag: 'Remote & Shirtless',
  },
]

const facts = [
  ['0.01%', 'alleged top creator'],
  ['47', 'ring lights expensed'],
  ['€8.99', 'emotional availability'],
  ['1', 'shirt for meetings'],
]

export function ParodyPortfolio() {
  return (
    <main>
      <section className="min-h-screen border-b border-border px-5 py-5 md:px-8 md:py-7">
        <nav className="flex items-center justify-between font-mono text-xs uppercase tracking-wider" aria-label="Main navigation">
          <a href="#top" className="flex items-center gap-2 font-bold" aria-label="Agustin Egea home">
            <span className="flex size-7 items-center justify-center bg-foreground text-background">AE</span>
            <span className="hidden sm:inline">Portfolio-ish</span>
          </a>
          <div className="flex items-center gap-5 md:gap-8">
            <a className="underline-offset-4 hover:underline" href="#experience">Work</a>
            <a className="underline-offset-4 hover:underline" href="#about">About</a>
            <a className="underline-offset-4 hover:underline" href="mailto:agustin@example.com">Hire him?</a>
          </div>
        </nav>

        <div id="top" className="flex min-h-[calc(100vh-84px)] flex-col justify-between pt-16 md:pt-20">
          <div>
            <div className="mb-5 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              <span className="inline-block size-2 bg-accent" />
              Available for premium collaborations
            </div>
            <h1 className="max-w-6xl text-balance font-serif text-[clamp(4.5rem,13vw,10rem)] leading-[0.76] tracking-[-0.055em]">
              Agustin Egea<span className="text-accent">*</span>
            </h1>
            <div className="mt-8 inline-flex -rotate-1 border-2 border-foreground bg-accent px-4 py-2 font-mono text-sm font-bold uppercase tracking-wider text-accent-foreground md:text-base">
              OnlyFans content creator — yes, professionally
            </div>
          </div>

          <div className="grid gap-8 pb-4 pt-16 md:grid-cols-12 md:items-end">
            <div className="md:col-span-4">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Current occupation</p>
              <p className="mt-2 text-xl font-medium">Monetizing WiFi and audacity</p>
            </div>
            <p className="max-w-2xl text-pretty text-2xl leading-snug md:col-span-7 md:text-3xl">
              Full-time OnlyFans content creator. Part-time entrepreneur. Overtime explaining to relatives that it is, technically, a subscription SaaS business.
            </p>
            <a href="#experience" className="flex size-12 items-center justify-center justify-self-end border border-foreground transition-colors hover:bg-foreground hover:text-background" aria-label="See experience">
              <ArrowDown aria-hidden="true" size={20} />
            </a>
          </div>
        </div>
      </section>

      <section id="experience" className="px-5 py-20 md:px-8 md:py-28">
        <div className="mb-14 flex items-end justify-between border-b border-border pb-5">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">01 / Premium professional experience</p>
            <h2 className="mt-3 font-serif text-5xl tracking-tight md:text-7xl">Behind the paywall</h2>
          </div>
          <Asterisk className="hidden text-accent md:block" size={44} strokeWidth={1.5} aria-hidden="true" />
        </div>

        <div>
          {roles.map((item, index) => (
            <article key={item.company} className="group grid gap-5 border-b border-border py-8 md:grid-cols-12 md:gap-8 md:py-10">
              <p className="font-mono text-xs tracking-widest text-muted-foreground md:col-span-2">{item.years}</p>
              <div className="md:col-span-4">
                <p className="font-mono text-xs uppercase tracking-widest">{String(index + 1).padStart(2, '0')} — {item.company}</p>
                <h3 className="mt-3 text-balance text-2xl font-medium leading-tight md:text-3xl">{item.role}</h3>
              </div>
              <div className="md:col-span-5">
                <p className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">{item.copy}</p>
                <span className="mt-5 inline-flex border border-border bg-secondary px-3 py-1 font-mono text-xs uppercase tracking-wider">{item.tag}</span>
              </div>
              <ArrowUpRight className="hidden transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 md:block" size={22} aria-hidden="true" />
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="bg-foreground px-5 py-20 text-background md:px-8 md:py-28">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="font-mono text-xs uppercase tracking-widest text-background/60">02 / Unverified statistics</p>
            <h2 className="mt-5 text-balance font-serif text-5xl leading-none tracking-tight md:text-8xl">
              Big numbers.<br />Tiny context.
            </h2>
            <p className="mt-8 max-w-xl text-pretty text-lg leading-relaxed text-background/70">
              Agustin is a fictional OnlyFans creator with very real confidence. He specializes in premium content, subscriber retention, and calling a bedroom “the studio” for tax purposes.
            </p>
          </div>
          <div className="grid grid-cols-2 border-l border-background/20 md:col-span-5">
            {facts.map(([value, label]) => (
              <div key={label} className="flex min-h-40 flex-col justify-between border-b border-r border-background/20 p-5">
                <span className="font-serif text-5xl text-accent md:text-6xl">{value}</span>
                <span className="font-mono text-xs uppercase tracking-wider text-background/60">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-accent px-5 py-8 text-accent-foreground md:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest">References available</p>
            <p className="mt-2 font-serif text-4xl md:text-6xl">His mum says he&apos;s brilliant.</p>
          </div>
          <a href="mailto:agustin@example.com" className="group flex items-center gap-3 font-mono text-sm uppercase tracking-wider">
            Make a terrible decision
            <Circle className="fill-current transition-transform group-hover:scale-75" size={14} aria-hidden="true" />
          </a>
        </div>
        <p className="mt-16 border-t border-accent-foreground/30 pt-4 font-mono text-[10px] uppercase tracking-widest">
          This is a fictional parody. No actual careers were harmed in the making of this portfolio.
        </p>
      </footer>
    </main>
  )
}
