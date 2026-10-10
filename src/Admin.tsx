import { useEffect, useMemo, useState } from "react";
import { supabase, supabaseConfigured } from "./lib/supabase";

type Row = {
  id: string;
  event: string;
  button: string | null;
  session_id: string | null;
  path: string | null;
  referrer: string | null;
  user_agent: string | null;
  created_at: string;
};

const PERIODS = [
  { label: "Hoje", days: 0 },
  { label: "7 dias", days: 7 },
  { label: "30 dias", days: 30 },
  { label: "90 dias", days: 90 },
  { label: "Tudo", days: -1 },
] as const;

const FUNNEL: { event: string; label: string }[] = [
  { event: "page_view", label: "Visitas" },
  { event: "click_cta_hero", label: "Clicaram em CTA" },
  { event: "click_download_app", label: "Baixar o app" },
  { event: "click_download_android", label: "Google Play" },
  { event: "click_download_ios", label: "App Store" },
];

function sinceDate(days: number): string | null {
  if (days < 0) return null;
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function isMobile(ua: string | null) {
  return ua ? /Mobi|Android|iPhone/i.test(ua) : false;
}

function Bar({ value, max, label, sub }: { value: number; max: number; label: string; sub?: string }) {
  const pct = max > 0 ? Math.max(2, Math.round((value / max) * 100)) : 0;
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-display font-semibold">
          {value}
          {sub && <span className="ml-2 text-xs font-normal text-muted-foreground">{sub}</span>}
        </span>
      </div>
      <div className="mt-1 h-2 rounded-full bg-muted">
        <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function Admin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Row[]>([]);
  const [period, setPeriod] = useState<(typeof PERIODS)[number]["days"]>(7);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) checkAdmin(data.session.user.id, data.session.user.email ?? "");
      else setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) checkAdmin(session.user.id, session.user.email ?? "");
      else {
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function checkAdmin(uid: string, mail: string) {
    const { data, error } = await supabase!.rpc("is_admin");
    if (error || !data) {
      setError("Esta conta não tem acesso ao painel.");
      await supabase!.auth.signOut();
      setLoading(false);
      return;
    }
    void uid;
    setUser(mail);
    setIsAdmin(true);
    setLoading(false);
  }

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase!.auth.signInWithPassword({ email, password });
    if (error) {
      setError("E-mail ou senha inválidos.");
      setLoading(false);
    }
  }

  // Carrega eventos do período + realtime
  useEffect(() => {
    if (!isAdmin || !supabase) return;
    let cancelled = false;

    async function load() {
      let q = supabase!
        .from("analytics_events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5000);
      const since = sinceDate(period);
      if (since) q = q.gte("created_at", since);
      const { data } = await q;
      if (!cancelled && data) setRows(data as Row[]);
    }
    load();

    const channel = supabase!
      .channel("analytics-live")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "analytics_events" }, (payload) => {
        const row = payload.new as Row;
        const since = sinceDate(period);
        if (!since || row.created_at >= since) setRows((r) => [row, ...r].slice(0, 5000));
      })
      .subscribe();

    return () => {
      cancelled = true;
      supabase!.removeChannel(channel);
    };
  }, [isAdmin, period]);

  const stats = useMemo(() => {
    const byEvent = new Map<string, number>();
    const sessions = new Set<string>();
    let mobile = 0;
    const sources = new Map<string, number>();
    const byDay = new Map<string, number>();

    for (const r of rows) {
      byEvent.set(r.event, (byEvent.get(r.event) ?? 0) + 1);
      if (r.session_id) sessions.add(r.session_id);
      if (isMobile(r.user_agent)) mobile++;
      const src = r.referrer ? new URL(r.referrer).hostname.replace(/^www\./, "") : "Direto";
      sources.set(src, (sources.get(src) ?? 0) + 1);
      const day = r.created_at.slice(0, 10);
      byDay.set(day, (byDay.get(day) ?? 0) + 1);
    }

    const days = [...byDay.entries()].sort((a, b) => a[0].localeCompare(b[0])).slice(-14);
    return { byEvent, sessions: sessions.size, mobile, sources: [...sources.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6), days };
  }, [rows]);

  if (!supabaseConfigured) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-5 text-foreground">
        <div className="max-w-md text-center">
          <h1 className="font-display text-2xl font-bold">Painel não configurado</h1>
          <p className="mt-3 text-muted-foreground">
            Defina <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code> nas variáveis de ambiente da Netlify e rode o SQL de <code>supabase/schema.sql</code>.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-background text-muted-foreground">Carregando…</div>;
  }

  if (!user || !isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-5 text-foreground">
        <form onSubmit={login} className="w-full max-w-sm space-y-4 rounded-xl border border-border bg-card p-8">
          <h1 className="font-display text-2xl font-bold">Painel 77 Drive</h1>
          <p className="text-sm text-muted-foreground">Acesso restrito a administradores.</p>
          <input
            type="email"
            required
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />
          <input
            type="password"
            required
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button type="submit" className="btn-primary w-full">Entrar</button>
        </form>
      </div>
    );
  }

  const maxDay = Math.max(1, ...stats.days.map(([, v]) => v));
  const funnelMax = Math.max(1, ...FUNNEL.map((f) => stats.byEvent.get(f.event) ?? 0));

  return (
    <div className="min-h-screen bg-background px-5 py-10 text-foreground">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">Painel 77 Drive</h1>
            <p className="text-sm text-muted-foreground">{user} · atualiza em tempo real</p>
          </div>
          <div className="flex items-center gap-2">
            {PERIODS.map((p) => (
              <button
                key={p.label}
                onClick={() => setPeriod(p.days)}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  period === p.days ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {p.label}
              </button>
            ))}
            <button onClick={() => supabase!.auth.signOut()} className="btn-outline !h-10 !px-4 text-sm">
              Sair
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Visitas", stats.byEvent.get("page_view") ?? 0],
            ["Sessões únicas", stats.sessions],
            ["Cliques em baixar", (stats.byEvent.get("click_download_android") ?? 0) + (stats.byEvent.get("click_download_ios") ?? 0) + (stats.byEvent.get("click_download_app") ?? 0)],
            ["Interesse em dirigir", stats.byEvent.get("click_driver") ?? 0],
          ].map(([label, v]) => (
            <div key={label as string} className="rounded-xl border border-border bg-card p-5">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-1 font-display text-4xl font-bold text-primary">{v}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Funil */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-xl font-semibold">Funil de download</h2>
            <div className="mt-5 space-y-4">
              {FUNNEL.map((f) => {
                const v = stats.byEvent.get(f.event) ?? 0;
                const visits = stats.byEvent.get("page_view") ?? 0;
                const conv = f.event !== "page_view" && visits > 0 ? `${Math.round((v / visits) * 100)}% das visitas` : undefined;
                return <Bar key={f.event} label={f.label} value={v} max={funnelMax} sub={conv} />;
              })}
            </div>
          </div>

          {/* Por dia */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-xl font-semibold">Eventos por dia</h2>
            {stats.days.length === 0 ? (
              <p className="mt-5 text-sm text-muted-foreground">Sem eventos no período.</p>
            ) : (
              <div className="mt-5 flex h-40 items-end gap-1.5">
                {stats.days.map(([day, v]) => (
                  <div key={day} className="group relative flex-1">
                    <div className="w-full rounded-t bg-primary/80 transition-colors group-hover:bg-primary" style={{ height: `${Math.max(4, (v / maxDay) * 140)}px` }} />
                    <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-popover px-2 py-1 text-xs opacity-0 shadow group-hover:opacity-100">
                      {day.slice(5).split("-").reverse().join("/")}: {v}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dispositivos e origens */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-xl font-semibold">Dispositivos</h2>
            <div className="mt-5 space-y-4">
              <Bar label="Celular" value={stats.mobile} max={rows.length || 1} sub={rows.length ? `${Math.round((stats.mobile / rows.length) * 100)}%` : undefined} />
              <Bar label="Computador" value={rows.length - stats.mobile} max={rows.length || 1} />
            </div>
            <h2 className="mt-8 font-display text-xl font-semibold">Origem das visitas</h2>
            <div className="mt-5 space-y-4">
              {stats.sources.length === 0 && <p className="text-sm text-muted-foreground">Sem dados.</p>}
              {stats.sources.map(([src, v]) => (
                <Bar key={src} label={src} value={v} max={stats.sources[0]?.[1] ?? 1} />
              ))}
            </div>
          </div>

          {/* Últimos eventos */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-xl font-semibold">Últimos eventos</h2>
            <div className="mt-4 max-h-80 overflow-y-auto">
              <table className="w-full text-sm">
                <tbody>
                  {rows.slice(0, 50).map((r) => (
                    <tr key={r.id} className="border-b border-border/50 last:border-0">
                      <td className="py-2 pr-3 font-medium text-primary">{r.event}</td>
                      <td className="py-2 pr-3 text-muted-foreground">{r.button ?? "—"}</td>
                      <td className="py-2 text-right text-xs text-muted-foreground">
                        {new Date(r.created_at).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                      </td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr><td className="py-4 text-muted-foreground">Nenhum evento ainda.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
