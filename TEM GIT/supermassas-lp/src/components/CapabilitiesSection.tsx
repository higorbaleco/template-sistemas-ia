import { capabilities } from '~/lib/chatData'

export function CapabilitiesSection() {
  return (
    <section className="w-full py-12 md:py-16 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">
            O que esta IA é capaz de fazer.
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            A seção abaixo continua como apoio, com menos peso visual. O foco principal fica no celular, no chat e na sensação de conversa real.
          </p>
        </div>

        {/* Grid de Capabilities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {capabilities.map((cap) => (
            <div
              key={cap.id}
              className="bg-white dark:bg-gray-700 p-8 rounded-lg border border-gray-200 dark:border-gray-600"
            >
              <h3 className="text-lg font-semibold mb-3 dark:text-white">
                {cap.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {cap.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
