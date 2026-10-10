import { useState } from "react";
import { SITE, driverLink } from "@/lib/site-config";
import { track, type EventName } from "@/lib/track";
import logo from "@/assets/logo.png";
import hero from "@/assets/hero.jpg";
import driver from "@/assets/driver.jpg";

const L = SITE.links;

function Ext({
  href,
  ev,
  btn,
  className,
  children,
  label,
}: {
  href: string;
  ev: EventName | EventName[];
  btn: string;
  className?: string;
  children: React.ReactNode;
  label?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={className}
      onClick={() => (Array.isArray(ev) ? ev : [ev]).forEach((e) => track(e, btn))}
    >
      {children}
    </a>
  );
}

const Apple = () => (
  <svg viewBox="0 0 24 24" className="size-6 fill-current" aria-hidden>
    <path d="M16.4 12.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.6 1.3-.1 1.8-.8 3.3-.8s2 .8 3.4.8c1.4 0 2.3-1.3 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9 0 0-2.7-1-2.7-4.1zM13.9 5c.7-.9 1.2-2 1-3.2-1 .1-2.2.7-3 1.6-.6.7-1.2 1.9-1 3.1 1.1.1 2.3-.6 3-1.5z" />
  </svg>
);
const Play = () => (
  <svg viewBox="0 0 24 24" className="size-6 fill-current" aria-hidden>
    <path d="M3.6 1.8c-.3.3-.5.8-.5 1.4v17.6c0 .6.2 1.1.5 1.4l9.9-10.2L3.6 1.8zm11 9.1 2.9-3-11-6.3 8.1 9.3zm0 2.2-8.1 9.3 11-6.3-2.9-3zm6.6-2.2-3-1.7-3.2 3.3 3.2 3.3 3-1.7c.9-.5.9-2.7 0-3.2z" />
  </svg>
);
const Wa = ({ c = "size-5" }: { c?: string }) => (
  <svg viewBox="0 0 24 24" className={`${c} fill-current`} aria-hidden>
    <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5 2.5 1 3 .8 3.5.8.5-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.5-.4zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z" />
  </svg>
);
const Ig = () => (
  <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-current" strokeWidth="2" aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" className="fill-current" />
  </svg>
);

function StoreButtons({ where }: { where: string }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Ext href={L.android} ev="click_download_android" btn={`android_${where}`} className="store-btn">
        <Play />
        <span className="text-left leading-tight">
          <small className="block text-xs opacity-70">Baixar na</small>
          <b className="text-base">Google Play</b>
        </span>
      </Ext>
      <Ext href={L.ios} ev="click_download_ios" btn={`ios_${where}`} className="store-btn">
        <Apple />
        <span className="text-left leading-tight">
          <small className="block text-xs opacity-70">Baixar na</small>
          <b className="text-base">App Store</b>
        </span>
      </Ext>
    </div>
  );
}

const nav = [
  ["Passageiros", "#passageiros"],
  ["Motoristas", "#motoristas"],
  ["Propósito", "#proposito"],
  ["Como funciona", "#como-funciona"],
];

export default function Home({ qr }: { qr?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* HEADER */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <a href="#inicio" className="flex items-center gap-2">
            <img src={logo} alt="77 Drive" width={40} height={40} className="size-10 rounded-[30%]" />
            <span className="font-display text-lg font-bold tracking-wide">DRIVE</span>
          </a>
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            {nav.map(([t, h]) => (
              <a key={h} href={h} className="transition-colors hover:text-foreground">
                {t}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a href="#baixar" onClick={() => track("click_download_app", "header")} className="btn-primary hidden !h-10 !px-5 text-sm sm:inline-flex">
              Baixar o app
            </a>
            <button className="grid size-11 place-items-center md:hidden" aria-label="Abrir menu" aria-expanded={open} onClick={() => setOpen(!open)}>
              <span className="block h-0.5 w-6 bg-foreground shadow-[0_7px_0_var(--foreground),0_-7px_0_var(--foreground)]" />
            </button>
          </div>
        </div>
        {open && (
          <nav className="border-t border-border bg-background px-5 pb-6 md:hidden">
            {nav.map(([t, h]) => (
              <a key={h} href={h} onClick={() => setOpen(false)} className="block border-b border-border/60 py-4 font-display text-xl">
                {t}
              </a>
            ))}
            <a href="#baixar" onClick={() => { setOpen(false); track("click_download_app", "menu_mobile"); }} className="btn-primary mt-5 w-full">
              Baixar o app
            </a>
          </nav>
        )}
      </header>

      <main>
        {/* HERO */}
        <section id="inicio" className="relative flex min-h-[100svh] items-end overflow-hidden pt-16">
          <img src={hero} alt="Passageira entrando no carro e motorista sorrindo à noite" width={1600} height={1104} className="absolute inset-0 size-full object-cover opacity-50" fetchPriority="high" />
          <div className="absolute inset-0 bg-hero-fade" />
          <div className="relative mx-auto w-full max-w-6xl px-5 pb-10 pt-10 md:pb-16">
            <p className="font-display text-sm uppercase tracking-[0.3em] text-primary">77 Drive</p>
            <h1 className="mt-3 max-w-3xl font-display text-5xl font-bold leading-[0.95] sm:text-6xl md:text-7xl">
              <span className="text-glow text-primary">Juntos</span> por uma mobilidade mais justa.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Para quem precisa chegar e para quem leva a cidade adiante. Feito por gente daqui, para gente como você.
            </p>
            <div className="mt-8 grid gap-3 md:grid-cols-2 md:max-w-3xl">
              <div className="path-card">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Para passageiros</p>
                <p className="mt-1 font-display text-xl font-semibold">Tenha sua mobilidade na palma da mão.</p>
                <a href="#baixar" onClick={() => { track("click_cta_hero", "passageiro"); track("click_download_app", "hero"); }} className="btn-primary mt-4 w-full">
                  Baixar o app
                </a>
              </div>
              <div className="path-card">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Para motoristas</p>
                <p className="mt-1 font-display text-xl font-semibold">Faça parte de uma mobilidade mais justa.</p>
                <Ext href={driverLink()} ev={["click_cta_hero", "click_driver"]} btn="motorista_hero" className="btn-outline mt-4 w-full">
                  Quero ser motorista
                </Ext>
              </div>
            </div>
          </div>
        </section>

        {/* PASSAGEIROS */}
        <section id="passageiros" className="mx-auto max-w-6xl px-5 py-24 md:py-32">
          <div className="grid gap-12 md:grid-cols-[1fr_1.1fr] md:items-start">
            <div>
              <p className="eyebrow">Passageiros</p>
              <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">Seu caminho começa aqui.</h2>
              <p className="mt-5 text-lg text-muted-foreground">Abrir o app, pedir e ir. Simples como deve ser.</p>
              <div className="mt-8">
                <StoreButtons where="passageiros" />
              </div>
            </div>
            <ol className="divide-y divide-border border-y border-border">
              {[
                ["Solicite sua viagem de forma simples.", "Poucos toques, sem complicação."],
                ["Praticidade para se deslocar.", "Trabalho, faculdade, compromisso ou a volta pra casa."],
                ["Perto de quem dirige.", "Uma plataforma feita para aproximar passageiros e motoristas."],
                ["Mobilidade mais humana.", "Acessível, próxima e sempre à mão."],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-5 py-6">
                  <span className="font-display text-2xl font-bold text-primary">0{i + 1}</span>
                  <div>
                    <h3 className="font-display text-xl font-semibold">{t}</h3>
                    <p className="mt-1 text-muted-foreground">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* MOTORISTAS */}
        <section id="motoristas" className="relative overflow-hidden bg-card">
          <div className="mx-auto grid max-w-6xl md:grid-cols-2">
            <img src={driver} alt="Motorista ao volante ao entardecer com o app no celular" width={1200} height={1408} loading="lazy" className="h-80 w-full object-cover opacity-60 md:h-full" />
            <div className="px-5 py-16 md:px-14 md:py-28">
              <p className="eyebrow">Motoristas</p>
              <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">Você também faz parte dessa mudança.</h2>
              <div className="mt-8 space-y-1 font-display text-2xl font-semibold md:text-3xl">
                <p>Você trabalha.</p>
                <p>Você se movimenta.</p>
                <p className="text-primary">Você conecta pessoas.</p>
              </div>
              <p className="mt-6 text-lg text-muted-foreground">
                A cidade se move porque alguém está ao volante. A 77 Drive quer construir uma relação mais próxima entre a plataforma e quem dirige.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Ext href={driverLink()} ev={["click_cta_driver", "click_driver"]} btn="motorista_secao" className="btn-primary">
                  Quero ser motorista
                </Ext>
                <Ext href={L.whatsapp} ev="click_whatsapp" btn="falar_motoristas" className="btn-outline">
                  <Wa /> Falar com a 77 Drive
                </Ext>
              </div>
            </div>
          </div>
        </section>

        {/* PROPÓSITO */}
        <section id="proposito" className="mx-auto max-w-4xl px-5 py-28 text-center md:py-40">
          <img src={logo} alt="" width={88} height={88} loading="lazy" className="mx-auto size-22 rounded-[30%]" />
          <h2 className="mt-6 font-display text-4xl font-bold md:text-6xl">Juntos por uma mobilidade mais justa.</h2>
          <div className="mt-10 space-y-2 text-xl text-muted-foreground md:text-2xl">
            <p>Mobilidade não é só chegar a algum lugar.</p>
            <p className="text-foreground">É poder ir. É poder trabalhar. É voltar pra casa.</p>
            <p>É encontrar alguém no caminho e fazer a cidade continuar se movendo.</p>
          </div>
          <p className="mx-auto mt-10 max-w-2xl text-lg">
            A 77 Drive acredita que essa relação pode ser mais próxima, simples e justa —{" "}
            <span className="text-primary">para quem dirige e para quem precisa chegar.</span>
          </p>
        </section>

        {/* COMO FUNCIONA */}
        <section id="como-funciona" className="border-y border-border">
          <div className="mx-auto max-w-6xl px-5 py-24">
            <h2 className="font-display text-4xl font-bold md:text-5xl">Como funciona?</h2>
            <div className="mt-12 grid gap-14 md:grid-cols-2">
              {[
                { t: "Passageiro", s: ["Baixe o aplicativo", "Solicite sua viagem", "Encontre seu motorista", "Chegue ao seu destino"] },
                { t: "Motorista", s: ["Entre em contato", "Faça seu cadastro", "Faça parte da plataforma", "Comece a realizar viagens"] },
              ].map((g) => (
                <div key={g.t}>
                  <p className="eyebrow">{g.t}</p>
                  <ol className="mt-5 space-y-4">
                    {g.s.map((s, i) => (
                      <li key={s} className="flex items-center gap-4">
                        <span className="step-dot">{i + 1}</span>
                        <span className="text-lg">{s}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DOWNLOAD */}
        <section id="baixar" className="relative overflow-hidden">
          <div className="absolute inset-0 bg-glow-radial" />
          <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-28 md:grid-cols-[1.4fr_1fr] md:items-center">
            <div>
              <h2 className="font-display text-5xl font-bold md:text-7xl">
                Baixe a <span className="text-glow text-primary">77 Drive</span>
              </h2>
              <p className="mt-5 max-w-lg text-lg text-muted-foreground">Comece sua próxima viagem agora. Disponível para Android e iPhone.</p>
              <div className="mt-8">
                <StoreButtons where="download" />
              </div>
            </div>
            {qr && <div className="hidden md:block">{qr}</div>}
          </div>
        </section>

        {/* CONTATO */}
        <section className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-16 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">Ficou com dúvida?</h2>
            <p className="text-muted-foreground">Fale com a gente ou acompanhe a 77 Drive no Instagram.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Ext href={L.whatsapp} ev="click_whatsapp" btn="contato" className="btn-outline">
              <Wa /> WhatsApp
            </Ext>
            <Ext href={L.instagram} ev="click_instagram" btn="contato" className="btn-outline">
              <Ig /> @app77drive
            </Ext>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border bg-card pb-28 md:pb-0">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
          <div>
            <img src={logo} alt="77 Drive" width={56} height={56} loading="lazy" className="size-14 rounded-[30%]" />
            <p className="mt-3 font-display text-lg">{SITE.tagline}</p>
          </div>
          <ul className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
            <li><a href="#inicio" className="hover:text-foreground">Início</a></li>
            <li><a href="#passageiros" className="hover:text-foreground">Passageiros</a></li>
            <li><a href="#motoristas" className="hover:text-foreground">Motoristas</a></li>
            <li><a href="#como-funciona" className="hover:text-foreground">Como funciona</a></li>
            <li><a href="#baixar" className="hover:text-foreground">Baixar app</a></li>
            <li><Ext href={L.whatsapp} ev="click_whatsapp" btn="footer" className="hover:text-foreground">WhatsApp</Ext></li>
            <li><Ext href={L.instagram} ev="click_instagram" btn="footer" className="hover:text-foreground">Instagram</Ext></li>
          </ul>
          <div className="space-y-2 text-sm text-muted-foreground">
            <a href={L.privacy} className="block hover:text-foreground">Política de Privacidade</a>
            <a href={L.terms} className="block hover:text-foreground">Termos de Uso</a>
            <a href={L.lgpd} className="block hover:text-foreground">LGPD</a>
          </div>
        </div>
        <div className="border-t border-border px-5 py-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} 77 Drive
          {SITE.legal.companyName && ` · ${SITE.legal.companyName}`}
          {SITE.legal.cnpj && ` · CNPJ ${SITE.legal.cnpj}`}
          {SITE.legal.address && ` · ${SITE.legal.address}`}
        </div>
      </footer>

      {/* CTA flutuante mobile */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex gap-3 border-t border-border bg-background/90 p-3 backdrop-blur md:hidden">
        <a href="#baixar" onClick={() => track("click_download_app", "flutuante_mobile")} className="btn-primary flex-1">
          Baixar o app
        </a>
        <Ext href={L.whatsapp} ev="click_whatsapp" btn="flutuante_mobile" label="WhatsApp" className="btn-outline !w-14 !px-0">
          <Wa c="size-6" />
        </Ext>
      </div>
    </div>
  );
}
