import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Gift, Snowflake, Bell, TreePine } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* Ícones natalícios */}
        <div className="flex justify-center gap-4 mb-8">
          <TreePine className="h-12 w-12 text-green-600" />
          <Gift className="h-12 w-12 text-red-600" />
          <Bell className="h-12 w-12 text-yellow-600" />
          <Snowflake className="h-12 w-12 text-blue-400" />
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Não sabes o que oferecer este <span className="text-red-600">Natal</span>?
        </h1>

        <p className="text-xl text-gray-600 mb-8">
          Nós ajudamos! Responde a um quiz simples sobre a pessoa e deixa o nosso assistente inteligente sugerir os presentes perfeitos.
        </p>

        <p className="text-lg text-gray-500 mb-8">
          Tudo feito com amor e inteligência artificial para tornar o teu Natal ainda mais especial.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white">
            <Link href="/auth/login">Entrar</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-green-600 text-green-600 hover:bg-green-50">
            <Link href="/auth/register">Criar conta</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}