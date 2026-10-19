import { useRef } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { HeroSection } from '~/components/HeroSection'
import { ChatSimulator } from '~/components/ChatSimulator'
import { CapabilitiesSection } from '~/components/CapabilitiesSection'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const chatRef = useRef<HTMLDivElement>(null);

  const handleOpenChat = () => {
    chatRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero + Chat Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: Hero */}
          <HeroSection onOpenChat={handleOpenChat} />

          {/* Right: Chat */}
          <div ref={chatRef} className="flex justify-center md:justify-end">
            <ChatSimulator />
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <CapabilitiesSection />

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
        <p>SuperMassas © 2026 | IA Comercial no WhatsApp</p>
      </footer>
    </main>
  );
}
