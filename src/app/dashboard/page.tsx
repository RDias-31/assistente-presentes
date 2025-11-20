'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Gift, Snowflake, Bell, TreePine, LogOut, Plus } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'

export default function DashboardPage() {
  const { user, loading: authLoading, signOut } = useAuth()
  const { profile, loading: profileLoading } = useProfile(user?.id)
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const handleBuyCredits = async (amount: number) => {
    if (!profile) return
    // Simulate buying credits
    const newCredits = profile.credits + amount
    // In real app, this would integrate with payment system
    // For now, just update locally
    alert(`Simulando compra de ${amount} créditos. Em produção, isso seria integrado com Stripe ou similar.`)
  }

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Snowflake className="h-12 w-12 text-blue-400 animate-spin mx-auto mb-4" />
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <Gift className="h-8 w-8 text-red-600" />
              <h1 className="text-xl font-bold text-gray-900">Assistente de Presentes</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Olá, {profile.name}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {profile.credits} créditos
                  </Badge>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Ícones natalícios */}
        <div className="flex justify-center gap-4 mb-8">
          <TreePine className="h-12 w-12 text-green-600" />
          <Gift className="h-12 w-12 text-red-600" />
          <Bell className="h-12 w-12 text-yellow-600" />
          <Snowflake className="h-12 w-12 text-blue-400" />
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Bem-vindo ao seu assistente de presentes de <span className="text-red-600">Natal</span>!
          </h2>
          <p className="text-lg text-gray-600">
            Descubra o presente perfeito respondendo ao nosso quiz inteligente.
          </p>
        </div>

        {/* Créditos Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-red-600" />
                Seus Créditos
              </CardTitle>
              <CardDescription>
                Cada pesquisa custa 1 crédito
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-4">
                {profile.credits}
              </div>
              {profile.credits === 0 && (
                <p className="text-red-600 mb-4">
                  Você ficou sem créditos. Compre mais para continuar!
                </p>
              )}
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleBuyCredits(1)}>
                  <Plus className="h-4 w-4 mr-1" />
                  +1 Crédito
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBuyCredits(5)}>
                  <Plus className="h-4 w-4 mr-1" />
                  +5 Créditos
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBuyCredits(10)}>
                  <Plus className="h-4 w-4 mr-1" />
                  +10 Créditos
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Nova Pesquisa</CardTitle>
              <CardDescription>
                Responda ao quiz e receba sugestões personalizadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {profile.credits > 0 ? (
                <Button asChild className="w-full bg-red-600 hover:bg-red-700">
                  <Link href="/quiz">
                    Começar Quiz (1 crédito)
                  </Link>
                </Button>
              ) : (
                <Button disabled className="w-full">
                  Sem créditos disponíveis
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Placeholder for search history */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Pesquisas</CardTitle>
            <CardDescription>
              Suas pesquisas anteriores aparecerão aqui
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-center py-8">
              Você ainda não fez nenhuma pesquisa.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}