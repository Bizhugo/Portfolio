"use client";
 
import { useState, useEffect, useRef } from "react";
import {
  Search, MessageSquarePlus, History, Compass, Grid3X3,
  Plus, ChevronDown, Mic, AudioLines, ExternalLink,
  Briefcase, Heart, Mail, Github, Linkedin,
  Twitter, ArrowRight, Star, Quote, Code2, Database,
  Cpu, Package, Sun, Moon, Smartphone, X, Menu
} from "lucide-react";
 
// ─────────────────────────────────────────────
// AVATAR
// ─────────────────────────────────────────────
const AVATAR = "/avatar.jpg";
 
function Avatar({ size, className = "" }: { size: number; className?: string }) {
  return (
    <img
      src={AVATAR}
      alt="Hugo Amory"
      width={size}
      height={size}
      className={`rounded-full object-cover object-center shrink-0 ${className}`}
    />
  );
}
 
// ─────────────────────────────────────────────
// THEME TOKENS
// ─────────────────────────────────────────────
const THEMES = {
  dark: {
    bg:           "#0e0e0e",
    surface:      "#141414",
    surface2:     "#1c1c1c",
    border:       "#242424",
    border2:      "#2b2b2b",
    text:         "#e8e8e6",
    muted:        "#9e9e9e",
    faint:        "#6b6b6b",
    ghost:        "#4b4b4b",
    blue:         "#4285f4",
    blueBg:       "#1e3a5f",
    blueBorder:   "#2b4a7a",
    blueText:     "#a0c0e8",
    bannerBg:     "linear-gradient(90deg,#1a2a4a,#1e3a5f,#1a2a4a)",
    bannerText:   "#a0c0e8",
    bannerBorder: "#2b4a7a",
    inputBg:      "#141414",
    cardBg:       "#141414",
    sidebarBg:    "#141414",
    sidebarBorder:"#1f1f1f",
    termBg:       "#0a0a0a",
    termBorder:   "#1f1f1f",
    termBlue:     "#4285f4",
    termGreen:    "#6b9e6b",
    resumeBg:     "#1e3a5f",
    resumeText:   "#a0c0e8",
    resumeBorder: "#2b4a7a",
    statBg:       "#141414",
    statBorder:   "#242424",
    quickBorder:  "#1a1a1a",
    sendBg:       "#4285f4",
    chipBorder:   "#2b2b2b",
    dotColor:     "#4b4b4b",
  },
  light: {
    bg:           "#f9f9f7",
    surface:      "#ffffff",
    surface2:     "#f2f2f0",
    border:       "#e8e8e4",
    border2:      "#ddddd8",
    text:         "#111110",
    muted:        "#5a5a58",
    faint:        "#888886",
    ghost:        "#aaaaaa",
    blue:         "#1a56db",
    blueBg:       "#eff4ff",
    blueBorder:   "#c7d9fc",
    blueText:     "#1a56db",
    bannerBg:     "linear-gradient(90deg,#eff4ff,#dbeafe,#eff4ff)",
    bannerText:   "#1a56db",
    bannerBorder: "#c7d9fc",
    inputBg:      "#ffffff",
    cardBg:       "#ffffff",
    sidebarBg:    "#ffffff",
    sidebarBorder:"#e8e8e4",
    termBg:       "#f2f2f0",
    termBorder:   "#e0e0dc",
    termBlue:     "#1a56db",
    termGreen:    "#1a7a3a",
    resumeBg:     "#eff4ff",
    resumeText:   "#1a56db",
    resumeBorder: "#c7d9fc",
    statBg:       "#ffffff",
    statBorder:   "#e8e8e4",
    quickBorder:  "#efefed",
    sendBg:       "#1a56db",
    chipBorder:   "#ddddd8",
    dotColor:     "#c0c0bc",
  },
};
 
type Theme = typeof THEMES.dark;
 
// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
type MessageType = "text"|"projects"|"about"|"contact"|"stack"|"testimonials"|"easter_egg";
type Message = {
  id: string; role: "ai"|"user"; content: string;
  type?: MessageType; link?: string; linkText?: string;
};
 
// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
const RESPONSES: Record<string, { content: string; type: MessageType; link?: string; linkText?: string }> = {
  projects:     { type: "projects",     content: "I'm a Fullstack & Mobile developer who ships production-ready products. Here are my main ventures — a B2B SaaS, a web agency, and a native mobile app in development." },
  about:        { type: "about",        content: "I'm Hugo Amory — Freelance Fullstack Web & Mobile Developer based in Mons, Belgium. I build digital products at the intersection of clean code and real business impact. Fully remote-ready." },
  contact:      { type: "contact",      content: "I'm currently open to freelance missions, remote roles, and interesting collaborations. Best way to reach me?" },
  stack:        { type: "stack",        content: "I work across the full product lifecycle — from UI to database, web to mobile. Here's my current tech arsenal:" },
  testimonials: { type: "testimonials", content: "A few words from people I've worked with:" },
  case_agence:  { type: "text", content: "A&A Web Agence is my freelance web agency. We build custom-coded, high-performance websites — no templates. Every site is engineered for SEO and conversion from the ground up.\n\nStack: Next.js · React · Tailwind CSS · Vercel", link: "https://aa-webagence.be/", linkText: "Visit A&A Web Agence" },
  case_libreta: { type: "text", content: "Libreta is a B2B SaaS built for the Peruvian laundry market. It digitalizes the ticketing workflow and automates client notifications through WhatsApp Business API — reducing manual work by ~80%.\n\nStack: Next.js · Tailwind CSS · WhatsApp API · Vercel", link: "https://libreta-saas.vercel.app/", linkText: "View Libreta App" },
  case_milee:   { type: "text", content: "Milee is a mobile app for Long Distance Relationships, currently in development. Milee enables real-time, synchronous intimacy rituals.\n\nStack: Flutter · Dart · Firebase · Riverpod", link: "#", linkText: "Coming Soon" },
  remote:       { type: "text", content: "Based in Belgium as a student entrepreneur, I operate with full autonomy — async by default, timezone-flexible. I've collaborated remotely with clients across South America and Western Europe.\n\nFluent in French, English and Spanish." },
  easter_egg:   { type: "easter_egg",   content: "Access granted. Welcome to the terminal, operator." },
};
 
const KEYWORD_MAP: Record<string, string> = {
  project:"projects", portfolio:"projects", work:"projects", show:"projects",
  about:"about", bio:"about", who:"about", background:"about",
  contact:"contact", email:"contact", hire:"contact", reach:"contact", available:"contact",
  stack:"stack", tech:"stack", code:"stack", framework:"stack",
  testimonial:"testimonials", review:"testimonials", client:"testimonials",
  agence:"case_agence", agency:"case_agence", freelance:"case_agence",
  libreta:"case_libreta", peru:"case_libreta", laundry:"case_libreta", saas:"case_libreta",
  milee:"case_milee", mobile:"case_milee", flutter:"case_milee", app:"case_milee",
  remote:"remote", belgium:"remote", location:"remote",
  sudo:"easter_egg", whoami:"easter_egg", terminal:"easter_egg", hack:"easter_egg",
};
 
function matchResponse(text: string): string {
  const lower = text.toLowerCase().replace(/[^a-z0-9 ]/g, "");
  for (const [kw, key] of Object.entries(KEYWORD_MAP)) {
    if (lower.includes(kw)) return key;
  }
  return "fallback";
}
 
// ─────────────────────────────────────────────
// TYPEWRITER
// ─────────────────────────────────────────────
const TypewriterText = ({ text = "", speed = 12, onComplete }: { text?: string; speed?: number; onComplete?: () => void }) => {
  const [displayed, setDisplayed] = useState("");
  const ref = useRef(onComplete);
  useEffect(() => { ref.current = onComplete; }, [onComplete]);
  useEffect(() => {
    if (!text) return;
    let i = 0; setDisplayed("");
    const timer = setInterval(() => {
      setDisplayed(text.slice(0, i + 1)); i++;
      if (i >= text.length) { clearInterval(timer); ref.current?.(); }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);
  return (
    <span className="whitespace-pre-wrap">
      {displayed}
      {displayed.length < text.length && (
        <span className="inline-block w-[2px] h-[16px] ml-0.5 animate-pulse align-middle" style={{ background: "currentColor", opacity: 0.7 }} />
      )}
    </span>
  );
};
 
// ─────────────────────────────────────────────
// TYPING INDICATOR
// ─────────────────────────────────────────────
const TypingIndicator = ({ t }: { t: Theme }) => (
  <div className="flex gap-3 animate-in fade-in duration-200">
    <div className="w-9 h-9 rounded shrink-0 mt-1 flex items-center justify-center" style={{ background: t.surface, border: `1px solid ${t.border2}` }}>
      <Search size={16} style={{ color: t.faint }} />
    </div>
    <div className="flex items-center gap-2 pt-2 px-1">
      {[0,1,2].map(i => (
        <span key={i} className="w-2 h-2 rounded-full" style={{ background: t.dotColor, animation: `dotPulse 1.2s ease-in-out ${i*0.2}s infinite` }} />
      ))}
    </div>
  </div>
);
 
// ─────────────────────────────────────────────
// CARDS
// ─────────────────────────────────────────────
function ProjectCard({ title, desc, label, icon, onClick, t }: { title:string; desc:string; label:string; icon:React.ReactNode; onClick?:()=>void; t:Theme }) {
  return (
    <div onClick={onClick} className="rounded-xl p-5 transition-all cursor-pointer" style={{ background: t.cardBg, border: `1px solid ${t.border}` }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = t.blue + "55")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = t.border)}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: t.surface2, border: `1px solid ${t.border2}`, color: t.faint }}>
          {icon}
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded uppercase tracking-wide" style={{ color: t.faint, border: `1px solid ${t.border2}` }}>{label}</span>
      </div>
      <p className="font-medium text-base mb-1.5" style={{ color: t.text }}>{title}</p>
      <p className="text-sm leading-relaxed" style={{ color: t.faint }}>{desc}</p>
    </div>
  );
}
 
function AboutCard({ t }: { t: Theme }) {
  return (
    <div className="rounded-xl p-5 mt-3" style={{ background: t.cardBg, border: `1px solid ${t.border}` }}>
      <div className="flex items-center gap-3 mb-5">
        <Avatar size={48} />
        <div>
          <p className="font-medium text-base" style={{ color: t.text }}>Hugo Amory</p>
          <p className="text-sm" style={{ color: t.faint }}>Student Entrepreneur · Mons, Belgium</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-emerald-500">Available</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 border-t pt-4" style={{ borderColor: t.border }}>
        {[{ value:"10+", label:"Projects" },{ value:"3", label:"Countries" },{ value:"Full", label:"Stack" }].map(s => (
          <div key={s.label} className="text-center">
            <p className="font-semibold text-xl" style={{ color: t.text }}>{s.value}</p>
            <p className="text-xs mt-0.5" style={{ color: t.faint }}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
 
function ContactCard({ t }: { t: Theme }) {
  const links = [
    { icon: <Mail size={16}/>, label: "amoryhugo16@gmail.com", href: "mailto:amoryhugo16@gmail.com", cta: true },
    { icon: <Linkedin size={16}/>, label: "LinkedIn", href: "https://linkedin.com/in/hugo-amory", cta: false },
    { icon: <Github size={16}/>, label: "GitHub", href: "https://github.com/hugo-amory", cta: false },
    { icon: <Twitter size={16}/>, label: "Twitter / X", href: "https://twitter.com/hugo_amory", cta: false },
  ];
  return (
    <div className="flex flex-col gap-2.5 mt-3">
      {links.map(l => (
        <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all"
          style={{ background: l.cta ? t.blueBg : t.cardBg, border: `1px solid ${l.cta ? t.blueBorder : t.border}`, color: l.cta ? t.blueText : t.muted }}>
          <span style={{ color: l.cta ? t.blue : t.faint }}>{l.icon}</span>
          <span className="text-sm font-medium flex-1">{l.label}</span>
          <ExternalLink size={14} style={{ color: t.ghost }} />
        </a>
      ))}
    </div>
  );
}
 
function StackCard({ t }: { t: Theme }) {
  const cats = [
    { label:"Frontend",   icon:<Code2 size={14}/>,     items:["Next.js","React","TypeScript","Tailwind"] },
    { label:"Mobile",     icon:<Smartphone size={14}/>, items:["Flutter","Dart","Firebase","Riverpod"] },
    { label:"Backend",    icon:<Database size={14}/>,   items:["Node.js","Supabase","PostgreSQL","REST"] },
    { label:"AI & Tools", icon:<Cpu size={14}/>,        items:["Cursor AI","Claude Code","GPT-4o","Make.com"] },
    { label:"Infra",      icon:<Package size={14}/>,    items:["Vercel","Cloudflare","GitHub Actions","Docker"] },
    { label:"Design",     icon:<Star size={14}/>,       items:["Figma","Framer","shadcn/ui","Stripe"] },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 mt-3">
      {cats.map(cat => (
        <div key={cat.label} className="rounded-xl p-4" style={{ background: t.cardBg, border: `1px solid ${t.border}` }}>
          <div className="flex items-center gap-2 mb-3" style={{ color: t.faint }}>
            {cat.icon}
            <span className="text-xs uppercase tracking-widest font-medium">{cat.label}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {cat.items.map(item => (
              <span key={item} className="text-xs px-2 py-0.5 rounded-full" style={{ color: t.muted, background: t.surface2, border: `1px solid ${t.border2}` }}>{item}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
 
function TestimonialsCard({ t }: { t: Theme }) {
  const items = [
    { quote:"Hugo delivered a clean, fast website that ranked on Google within weeks. Very professional.", author:"Marc D.", role:"CEO, Brussels Startup", initials:"MD" },
    { quote:"He understood the business side immediately and suggested improvements we hadn't thought of.", author:"Valeria C.", role:"Founder, Lima SaaS", initials:"VC" },
    { quote:"Rare to find a dev who codes fast AND thinks about UX. Highly recommend.", author:"Thomas L.", role:"Product Manager", initials:"TL" },
  ];
  return (
    <div className="flex flex-col gap-3 mt-3">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl p-5" style={{ background: t.cardBg, border: `1px solid ${t.border}` }}>
          <Quote size={15} className="mb-2 opacity-50" style={{ color: t.blue }} />
          <p className="text-sm leading-relaxed mb-4 italic" style={{ color: t.muted }}>"{item.quote}"</p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: t.blueBg, color: t.blue }}>{item.initials}</div>
            <div>
              <p className="text-sm font-medium" style={{ color: t.text }}>{item.author}</p>
              <p className="text-xs" style={{ color: t.faint }}>{item.role}</p>
            </div>
            <div className="ml-auto flex gap-0.5">{[...Array(5)].map((_,s) => <Star key={s} size={11} className="text-amber-400 fill-amber-400" />)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
 
function EasterEggCard({ t }: { t: Theme }) {
  const lines = [
    { p:"$", text:"whoami" },
    { p:">", text:"hugo_amory — builder, debugger, occasional over-engineer." },
    { p:"$", text:"cat /etc/skills" },
    { p:">", text:"[fullstack] [mobile] [ai_First] [product_thinking]" },
    { p:"$", text:"uptime" },
    { p:">", text:"Available for hire. No known critical bugs." },
    { p:"$", text:"ping amoryhugo16@gmail.com" },
    { p:">", text:"PONG. Response time: fast." },
  ];
  return (
    <div className="rounded-xl p-5 mt-3 font-mono" style={{ background: t.termBg, border: `1px solid ${t.termBorder}` }}>
      <div className="flex items-center gap-1.5 mb-3">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        <span className="text-xs ml-2" style={{ color: t.ghost }}>terminal — hugo@portfolio</span>
      </div>
      {lines.map((l, i) => (
        <div key={i} className="text-sm leading-7" style={{ color: l.p === "$" ? t.termBlue : t.termGreen }}>
          {l.p} {l.text}
        </div>
      ))}
      <div className="flex items-center gap-1 mt-1">
        <span className="text-sm" style={{ color: t.termBlue }}>$</span>
        <span className="inline-block w-[7px] h-[16px] animate-pulse" style={{ background: t.termBlue }} />
      </div>
    </div>
  );
}
 
// ─────────────────────────────────────────────
// MESSAGE ROW
// ─────────────────────────────────────────────
function MessageRow({ msg, isLast, isStreaming, onComplete, onAsk, t }: {
  msg: Message; isLast: boolean; isStreaming: boolean;
  onComplete: () => void; onAsk: (key: string) => void; t: Theme;
}) {
  const showComponents = !isStreaming || !isLast;
  return (
    <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="shrink-0 mt-1">
        {msg.role === "ai"
          ? <div className="w-9 h-9 rounded flex items-center justify-center" style={{ background: t.surface, border: `1px solid ${t.border2}` }}><Search size={16} style={{ color: t.faint }} /></div>
          : <Avatar size={36} />
        }
      </div>
      <div className="flex-1 space-y-1 pt-1 min-w-0">
        <div className="text-base leading-relaxed" style={{ color: t.text }}>
          {msg.role === "ai" && isLast && isStreaming
            ? <TypewriterText text={msg.content} onComplete={onComplete} />
            : <span className="whitespace-pre-wrap">{msg.content}</span>
          }
        </div>
        {showComponents && (
          <>
            {msg.type === "projects" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                <ProjectCard t={t} onClick={() => onAsk("case_libreta")} title="Libreta SaaS" desc="B2B software for laundry shops in Peru. WhatsApp automation + digital ticketing." label="SaaS" icon={<Database size={18} />} />
                <ProjectCard t={t} onClick={() => onAsk("case_agence")} title="A&A Web Agence" desc="Custom web agency building high-performance sites for European clients." label="Agency" icon={<Briefcase size={18} />} />
                <ProjectCard t={t} onClick={() => onAsk("case_milee")} title="Milee App" desc="Flutter mobile app for long-distance relationships. In active development." label="Mobile" icon={<Heart size={18} />} />
              </div>
            )}
            {msg.type === "about"        && <AboutCard t={t} />}
            {msg.type === "contact"      && <ContactCard t={t} />}
            {msg.type === "stack"        && <StackCard t={t} />}
            {msg.type === "testimonials" && <TestimonialsCard t={t} />}
            {msg.type === "easter_egg"   && <EasterEggCard t={t} />}
            {msg.link && (
              <a href={msg.link} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium mt-2 group transition-colors"
                style={{ color: t.blue }}>
                {msg.linkText}
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </a>
            )}
          </>
        )}
      </div>
    </div>
  );
}
 
// ─────────────────────────────────────────────
// THEME TOGGLE
// ─────────────────────────────────────────────
function ThemeToggle({ isDark, toggle, t }: { isDark: boolean; toggle: () => void; t: Theme }) {
  return (
    <button onClick={toggle}
      className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
      style={{ background: t.surface2, border: `1px solid ${t.border}`, color: t.muted }}>
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
 
// ─────────────────────────────────────────────
// MOBILE DRAWER SIDEBAR
// ─────────────────────────────────────────────
function MobileDrawer({ open, onClose, isDark, toggleTheme, onAsk, isTyping, isStreaming, t }: {
  open: boolean; onClose: () => void; isDark: boolean; toggleTheme: () => void;
  onAsk: (key: string) => void; isTyping: boolean; isStreaming: boolean; t: Theme;
}) {
  const items = [
    { label: "View my projects", key: "projects", icon: <Briefcase size={16} /> },
    { label: "About Hugo",       key: "about",    icon: <Search size={16} /> },
    { label: "Tech stack",       key: "stack",    icon: <Code2 size={16} /> },
    { label: "Testimonials",     key: "testimonials", icon: <Star size={16} /> },
    { label: "Contact",          key: "contact",  icon: <Mail size={16} /> },
  ];
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60" onClick={onClose} />
      <div className="fixed inset-y-0 left-0 z-50 w-72 flex flex-col transition-all duration-200"
        style={{ background: t.sidebarBg, borderRight: `1px solid ${t.sidebarBorder}` }}>
        <div className="flex items-center justify-between p-4" style={{ borderBottom: `1px solid ${t.sidebarBorder}` }}>
          <span className="font-medium text-base" style={{ color: t.text }}>Menu</span>
          <button onClick={onClose} className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: t.surface2, color: t.muted }}><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <p className="text-xs px-3 mb-3 uppercase tracking-widest font-medium" style={{ color: t.ghost }}>Portfolio</p>
          {items.map(item => (
            <button key={item.key} onClick={() => { onAsk(item.key); onClose(); }}
              disabled={isTyping || isStreaming}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left disabled:opacity-40"
              style={{ color: t.muted }}
              onMouseEnter={e => { e.currentTarget.style.background = t.surface2; e.currentTarget.style.color = t.text; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = t.muted; }}>
              <span style={{ color: t.ghost }}>{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </div>
        <div className="p-4 space-y-3" style={{ borderTop: `1px solid ${t.sidebarBorder}` }}>
          <a href="mailto:amoryhugo16@gmail.com"
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-colors"
            style={{ background: t.resumeBg, border: `1px solid ${t.resumeBorder}`, color: t.resumeText }}>
            <span>Request resume</span>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: t.blue }} />
          </a>
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar size={32} />
            <span className="flex-1 text-sm font-medium" style={{ color: t.text }}>Hugo Amory</span>
            <ThemeToggle isDark={isDark} toggle={toggleTheme} t={t} />
          </div>
        </div>
      </div>
    </>
  );
}
 
// ─────────────────────────────────────────────
// SPLASH SCREEN
// ─────────────────────────────────────────────
function SplashScreen({ onDone, t }: { onDone: () => void; t: Theme }) {
  const cursorRef = useRef<HTMLSpanElement>(null);
 
  useEffect(() => {
    const snap = setTimeout(() => {
      if (cursorRef.current) {
        cursorRef.current.style.animation = "splashBlink 0.7s step-start infinite";
        cursorRef.current.style.opacity = "1";
      }
    }, 1380);
    const done = setTimeout(onDone, 2600);
    return () => { clearTimeout(snap); clearTimeout(done); };
  }, [onDone]);
 
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: t.bg, animation: "splashFadeOut 0.5s ease 2.1s both" }}
    >
      <style>{`
        @keyframes splashLeft  { 0%{opacity:0;transform:translateX(-80px) rotate(-12deg)} 100%{opacity:1;transform:none} }
        @keyframes splashSlash { 0%{opacity:0;transform:translateY(-80px)}               100%{opacity:1;transform:none} }
        @keyframes splashRight { 0%{opacity:0;transform:translateX(80px) rotate(12deg)}  100%{opacity:1;transform:none} }
        @keyframes splashSnap  { 0%{transform:scale(1)} 50%{transform:scale(1.07)} 100%{transform:scale(1)} }
        @keyframes splashGrow  { from{width:0} to{width:140px} }
        @keyframes splashUp    { 0%{opacity:0;transform:translateY(10px)} 100%{opacity:1;transform:none} }
        @keyframes splashBlink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes splashFadeOut { 0%{opacity:1} 100%{opacity:0;pointer-events:none} }
      `}</style>
 
      {/* Symbol */}
      <div
        className="flex items-center leading-none select-none"
        style={{
          fontFamily: "'Courier New', Courier, monospace",
          fontWeight: 700,
          fontSize: "clamp(72px, 18vw, 100px)",
          letterSpacing: "-4px",
          animation: "splashSnap 0.25s ease 0.72s both",
        }}
      >
        <span style={{ color: t.blue, animation: "splashLeft  0.55s cubic-bezier(.34,1.56,.64,1) 0.08s both" }}>&lt;</span>
        <span style={{ color: t.text, animation: "splashSlash 0.55s cubic-bezier(.34,1.56,.64,1) 0.34s both" }}>/</span>
        <span style={{ color: t.blue, animation: "splashRight 0.55s cubic-bezier(.34,1.56,.64,1) 0.08s both" }}>&gt;</span>
      </div>
 
      {/* Underline */}
      <div style={{
        height: "2px",
        width: 0,
        background: t.blue,
        margin: "14px auto 18px",
        animation: "splashGrow 0.35s ease 0.78s both",
      }} />
 
      {/* Name */}
      <p style={{
        margin: 0,
        fontSize: "clamp(20px, 5vw, 26px)",
        fontWeight: 400,
        fontFamily: "Georgia, serif",
        color: t.text,
        animation: "splashUp 0.4s ease 0.95s both",
        opacity: 0,
      }}>
        Hugo Amory
      </p>
 
      {/* Sub */}
      <p style={{
        margin: "6px 0 0",
        fontSize: "14px",
        color: t.faint,
        animation: "splashUp 0.4s ease 1.12s both",
        opacity: 0,
        display: "flex",
        alignItems: "center",
        gap: "4px",
      }}>
        fullstack · mobile · ai-first
        <span
          ref={cursorRef}
          style={{
            display: "inline-block",
            width: "2px",
            height: "16px",
            background: t.blue,
            opacity: 0,
            flexShrink: 0,
          }}
        />
      </p>
    </div>
  );
}
 
// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function Portfolio() {
  const [isDark, setIsDark] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [usedChips, setUsedChips] = useState<Set<string>>(new Set());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
 
  const t = isDark ? THEMES.dark : THEMES.light;
 
  const allChips = [
    { label: "View my projects", key: "projects" },
    { label: "My tech stack",    key: "stack" },
    { label: "Work with me",     key: "contact" },
    { label: "About Hugo",       key: "about" },
    { label: "What clients say", key: "testimonials" },
  ];
  const chips = allChips
    .filter(c => !usedChips.has(c.key))
    .filter((c, i, arr) => arr.findIndex(x => x.key === c.key) === i);
 
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);
 
  const handleAsk = (key: string, customText?: string) => {
    if (isTyping || isStreaming) return;
    if (!hasStarted) setHasStarted(true);
    const resolvedKey = key === "custom" && customText ? matchResponse(customText) : key;
    const userContent = customText || allChips.find(c => c.key === key)?.label || key;
    setUsedChips(prev => new Set([...prev, resolvedKey, key]));
    setMessages(prev => [...prev, { id: `u-${Date.now()}`, role: "user", content: userContent }]);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const resp = RESPONSES[resolvedKey] || { type: "text" as MessageType, content: "Try asking about my projects, stack, or availability — or type /sudo for a surprise." };
      setMessages(prev => [...prev, { id: `a-${Date.now()}`, role: "ai", ...resp }]);
      setIsStreaming(true);
    }, 600 + Math.random() * 400);
  };
 
  const handleSubmit = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isTyping || isStreaming) return;
    const isEgg = ["/sudo","/whoami","/hire","/hack"].some(c => trimmed.toLowerCase().startsWith(c));
    handleAsk(isEgg ? "easter_egg" : "custom", trimmed);
    setInputValue("");
  };
 
  const sidebarItems = [
    { label: "View my projects", key: "projects", icon: <Briefcase size={15} /> },
    { label: "About Hugo",       key: "about",    icon: <Search size={15} /> },
    { label: "Tech stack",       key: "stack",    icon: <Code2 size={15} /> },
    { label: "Testimonials",     key: "testimonials", icon: <Star size={15} /> },
    { label: "Contact",          key: "contact",  icon: <Mail size={15} /> },
  ];
 
  return (
    <>
      {showSplash && <SplashScreen onDone={() => setShowSplash(false)} t={t} />}
      <style>{`
        @keyframes dotPulse {
          0%, 80%, 100% { opacity:.3; transform:scale(.8); }
          40%            { opacity:1;  transform:scale(1);  }
        }
      `}</style>
 
      {/* Mobile drawer */}
      <MobileDrawer
        open={drawerOpen} onClose={() => setDrawerOpen(false)}
        isDark={isDark} toggleTheme={() => setIsDark(p => !p)}
        onAsk={handleAsk} isTyping={isTyping} isStreaming={isStreaming} t={t}
      />
 
      <div className="flex h-screen overflow-hidden" style={{ background: t.bg, color: t.text, fontFamily: "sans-serif" }}>
 
        {/* ── SIDEBAR (desktop only) ── */}
        <aside className="w-[260px] hidden md:flex flex-col shrink-0 transition-colors duration-200"
          style={{ background: t.sidebarBg, borderRight: `1px solid ${t.sidebarBorder}` }}>
 
          <div className="p-3 space-y-1">
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg" style={{ background: t.surface2, border: `1px solid ${t.border2}` }}>
              <Search size={15} style={{ color: t.faint }} />
              <span className="text-sm" style={{ color: t.faint }}>Search portfolio...</span>
            </div>
          </div>
 
          <div className="px-3 py-2 space-y-0.5 flex-1">
            <button onClick={() => { setHasStarted(false); setMessages([]); setUsedChips(new Set()); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors"
              style={{ color: t.muted }}
              onMouseEnter={e => e.currentTarget.style.background = t.surface2}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <MessageSquarePlus size={15} /><span className="text-sm">New thread</span>
            </button>
            {[{ icon:<History size={15}/>, label:"History" },{ icon:<Compass size={15}/>, label:"Discover" },{ icon:<Grid3X3 size={15}/>, label:"Spaces" }].map(item => (
              <div key={item.label} className="flex items-center gap-3 px-3 py-2.5 rounded-lg" style={{ color: t.ghost }}>
                {item.icon}<span className="text-sm">{item.label}</span>
              </div>
            ))}
 
            <div className="pt-5">
              <p className="text-xs px-3 mb-2 uppercase tracking-widest font-medium" style={{ color: t.ghost }}>Portfolio</p>
              {sidebarItems.map(item => (
                <button key={item.key} onClick={() => handleAsk(item.key)}
                  disabled={isTyping || isStreaming}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left disabled:opacity-40"
                  style={{ color: t.muted }}
                  onMouseEnter={e => { e.currentTarget.style.background = t.surface2; e.currentTarget.style.color = t.text; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = t.muted; }}>
                  <span style={{ color: t.ghost }}>{item.icon}</span>
                  <span className="text-sm truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
 
          <div className="p-3 space-y-2" style={{ borderTop: `1px solid ${t.sidebarBorder}` }}>
            <a href="mailto:amoryhugo16@gmail.com"
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-colors"
              style={{ background: t.resumeBg, border: `1px solid ${t.resumeBorder}`, color: t.resumeText }}>
              <span>Request resume</span>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: t.blue }} />
            </a>
            <div className="flex items-center gap-3 px-3 py-2">
              <Avatar size={32} />
              <span className="flex-1 text-sm font-medium" style={{ color: t.text }}>Hugo Amory</span>
              <ThemeToggle isDark={isDark} toggle={() => setIsDark(p => !p)} t={t} />
            </div>
          </div>
        </aside>
 
        {/* ── MAIN ── */}
        <main className="flex-1 flex flex-col h-full overflow-hidden relative transition-colors duration-200">
 
          {/* Banner */}
          <div className="h-10 flex items-center justify-center text-[13px] font-medium shrink-0 relative"
            style={{ background: t.bannerBg, color: t.bannerText, borderBottom: `1px solid ${t.bannerBorder}` }}>
 
            {/* Mobile: hamburger left */}
            <button onClick={() => setDrawerOpen(true)} className="md:hidden absolute left-4 w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: t.surface2, border: `1px solid ${t.border}`, color: t.muted }}>
              <Menu size={18} />
            </button>
 
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
            Open to freelance &amp; remote roles worldwide
            <span className="ml-2" style={{ color: t.blue }}>→</span>
 
            {/* Mobile: theme toggle right */}
            <button onClick={() => setIsDark(p => !p)} className="md:hidden absolute right-4 w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: t.surface2, border: `1px solid ${t.border}`, color: t.muted }}>
              {isDark ? <Sun size={16}/> : <Moon size={16}/>}
            </button>
          </div>
 
          {/* Scrollable area */}
          <div className="flex-1 overflow-y-auto w-full transition-colors duration-200">
            {!hasStarted ? (
 
              /* ── HOME SCREEN ── */
              <div className="flex flex-col items-center justify-center min-h-full w-full max-w-2xl mx-auto px-5 pt-16 pb-20 relative">
 
                {/* Grid bg */}
                <div className="absolute inset-0 pointer-events-none" style={{
                  opacity: isDark ? 0.2 : 0.4,
                  backgroundImage: `linear-gradient(${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"} 1px, transparent 1px)`,
                  backgroundSize: "48px 48px",
                }} />
 
                {/* Glow */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
                  style={{ background: `radial-gradient(circle, ${t.blue}11 0%, transparent 70%)` }} />
 
                {/* Avatar + name */}
                <div className="relative flex flex-col items-center mb-8 z-10">
                  <Avatar size={68} className="mb-5" />
                  <h1 className="text-4xl md:text-5xl font-normal tracking-tight mb-2 text-center"
                    style={{ color: t.text, fontFamily: "Georgia, serif" }}>
                    Hugo Amory
                  </h1>
                  <p className="text-base" style={{ color: t.faint }}>Fullstack · Mobile · AI-First dev</p>
                </div>
 
                {/* Stats row */}
                <div className="flex items-center gap-3 mb-8 z-10 flex-wrap justify-center">
                  {[{ value:"10+", label:"projects" },{ value:"3", label:"countries" },{ value:"2", label:"companies" }].map(s => (
                    <div key={s.label} className="flex items-center gap-2 rounded-full px-4 py-2"
                      style={{ background: t.statBg, border: `1px solid ${t.statBorder}` }}>
                      <span className="font-semibold text-sm" style={{ color: t.text }}>{s.value}</span>
                      <span className="text-sm" style={{ color: t.faint }}>{s.label}</span>
                    </div>
                  ))}
                </div>
 
                {/* Input */}
                <div className="w-full rounded-2xl p-4 shadow-sm mb-6 z-10 transition-colors duration-200"
                  style={{ background: t.inputBg, border: `1px solid ${t.border}` }}>
                  <input type="text" placeholder="Ask about my projects, stack, or availability..."
                    className="w-full bg-transparent focus:outline-none px-2 mb-4 text-base"
                    style={{ color: t.text }}
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  />
                  <div className="flex items-center justify-between" style={{ color: t.faint }}>
                    <div className="flex items-center gap-2">
                      <button className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: t.surface2 }}><Plus size={15}/></button>
                      <span className="text-sm flex items-center gap-1">Claude 3.5 <ChevronDown size={12}/></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mic size={16}/>
                      <button onClick={handleSubmit} className="w-9 h-9 text-white rounded-xl flex items-center justify-center transition-colors"
                        style={{ background: t.sendBg }}>
                        <AudioLines size={16}/>
                      </button>
                    </div>
                  </div>
                </div>
 
                {/* Chips */}
                <div className="flex flex-wrap gap-2 mb-8 justify-center z-10">
                  {chips.map(chip => (
                    <button key={chip.key} onClick={() => handleAsk(chip.key)}
                      className="px-4 py-2 text-sm rounded-full transition-all"
                      style={{ color: t.muted, border: `1px solid ${t.chipBorder}` }}
                      onMouseEnter={e => { e.currentTarget.style.background = t.surface2; e.currentTarget.style.color = t.text; e.currentTarget.style.borderColor = t.border2; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = t.muted; e.currentTarget.style.borderColor = t.chipBorder; }}>
                      {chip.label}
                    </button>
                  ))}
                </div>
 
                {/* Quick questions */}
                <div className="w-full z-10" style={{ borderTop: `1px solid ${t.quickBorder}` }}>
                  {[
                    { key:"case_libreta", text:"How did you build Libreta for the Peruvian market?" },
                    { key:"case_milee",   text:"Tell me about the Flutter app you're building for couples." },
                    { key:"remote",       text:"Why are you a great fit for remote roles outside Belgium?" },
                    { key:"easter_egg",   text:"/sudo — access dev terminal" },
                  ].map(q => (
                    <button key={q.key} onClick={() => handleAsk(q.key)}
                      className="w-full text-left py-4 text-sm flex items-center justify-between group transition-colors"
                      style={{ color: t.faint, borderBottom: `1px solid ${t.quickBorder}` }}
                      onMouseEnter={e => e.currentTarget.style.color = t.text}
                      onMouseLeave={e => e.currentTarget.style.color = t.faint}>
                      <span>{q.text}</span>
                      <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-3"/>
                    </button>
                  ))}
                </div>
              </div>
 
            ) : (
 
              /* ── CHAT THREAD ── */
              <div className="w-full max-w-2xl mx-auto px-5 pt-10 pb-52 space-y-10">
                {messages.map((msg, idx) => (
                  <MessageRow key={msg.id} msg={msg}
                    isLast={idx === messages.length - 1}
                    isStreaming={isStreaming}
                    onComplete={() => setIsStreaming(false)}
                    onAsk={handleAsk} t={t} />
                ))}
                {isTyping && <TypingIndicator t={t} />}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
 
          {/* ── BOTTOM INPUT (chat mode) ── */}
          {hasStarted && (
            <div className="absolute bottom-0 left-0 w-full px-5 pb-6 pt-6"
              style={{ background: `linear-gradient(to top, ${t.bg} 60%, transparent)` }}>
              <div className="max-w-2xl mx-auto space-y-3">
                {chips.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {chips.slice(0,4).map(chip => (
                      <button key={chip.key} onClick={() => handleAsk(chip.key)}
                        disabled={isTyping || isStreaming}
                        className="px-4 py-1.5 text-sm rounded-full transition-all disabled:opacity-30"
                        style={{ color: t.muted, border: `1px solid ${t.chipBorder}` }}
                        onMouseEnter={e => { e.currentTarget.style.background = t.surface2; e.currentTarget.style.color = t.text; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = t.muted; }}>
                        {chip.label}
                      </button>
                    ))}
                  </div>
                )}
                <div className="w-full rounded-2xl p-3 flex items-center gap-2 transition-colors"
                  style={{ background: t.inputBg, border: `1px solid ${t.border}` }}>
                  <input type="text" placeholder="Ask follow-up... (try /sudo)"
                    className="bg-transparent w-full focus:outline-none px-2 text-base"
                    style={{ color: t.text }}
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSubmit()}
                    disabled={isTyping || isStreaming}
                  />
                  <button onClick={handleSubmit}
                    disabled={!inputValue.trim() || isTyping || isStreaming}
                    className="w-10 h-10 text-white rounded-xl flex items-center justify-center transition-colors shrink-0 disabled:opacity-30"
                    style={{ background: t.sendBg }}>
                    <ArrowRight size={16}/>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
} 

