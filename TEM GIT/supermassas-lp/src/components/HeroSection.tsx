interface Props {
  onOpenChat?: () => void;
}

export function HeroSection({ onOpenChat }: Props) {
  return (
    <div className="flex flex-col gap-6">
      {/* Badge */}
      <div className="inline-flex w-fit">
        <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 border border-cyan-600 dark:border-cyan-400 px-3 py-1 rounded-full uppercase">
          Teste Interativo
        </span>
      </div>

      {/* Headline */}
      <h1 className="text-4xl md:text-5xl font-bold leading-tight dark:text-white">
        Quer ver na prática como a IA da
        <span className="text-cyan-600 dark:text-cyan-400"> SuperMassas</span>
        {' '}funcionará?
      </h1>

      {/* Subtexto */}
      <p className="text-gray-600 dark:text-gray-300 max-w-md text-base leading-relaxed">
        A experiência foi desenhada para parecer um celular com WhatsApp automatizado.
        Mais contraste, mais presença de marca e leitura de operação real.
      </p>

      {/* CTAs */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={onOpenChat}
          className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded font-semibold transition"
        >
          Abrir o chat →
        </button>
        <button className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition">
          Ver benefícios
        </button>
      </div>

      {/* Pills */}
      <div className="flex flex-wrap gap-2 pt-2">
        {['WhatsApp real', '24/7 automatizado', 'Sem fricção', 'Conversa pronta para vender'].map((pill) => (
          <span
            key={pill}
            className="text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full"
          >
            {pill}
          </span>
        ))}
      </div>
    </div>
  );
}
