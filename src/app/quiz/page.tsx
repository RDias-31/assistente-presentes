'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Gift, ArrowLeft, ArrowRight } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'

const questions = [
  {
    id: 'age',
    question: 'Qual a idade aproximada da pessoa?',
    type: 'radio',
    options: ['Menos de 18 anos', '18-25 anos', '26-35 anos', '36-50 anos', 'Mais de 50 anos']
  },
  {
    id: 'relation',
    question: 'Qual é a sua relação com essa pessoa?',
    type: 'radio',
    options: ['Namorado/a ou esposo/a', 'Amigo/a próximo', 'Filho/a', 'Colega de trabalho', 'Outro familiar', 'Outro']
  },
  {
    id: 'style',
    question: 'Qual o estilo principal dessa pessoa?',
    type: 'radio',
    options: ['Mais caseiro/a (gosta de casa)', 'Aventureiro/a (viagens, esportes)', 'Vaidoso/a (moda, beleza)', 'Geek/tecnologia', 'Artístico/a (música, arte)', 'Outro']
  },
  {
    id: 'hobbies',
    question: 'Quais os principais hobbies ou interesses? (selecione até 3)',
    type: 'checkbox',
    options: ['Leitura', 'Esportes', 'Música', 'Arte/Desenho', 'Tecnologia/Games', 'Cozinha', 'Viagens', 'Cinema/Séries', 'Fotografia', 'Jardinagem', 'Dança', 'Outro']
  },
  {
    id: 'preference',
    question: 'Ela prefere mais experiências ou objetos?',
    type: 'radio',
    options: ['Experiências (viagens, jantares, cursos)', 'Objetos (roupa, gadgets, decoração)', 'Ambos igualmente']
  },
  {
    id: 'budget',
    question: 'Qual o orçamento aproximado que você tem em mente?',
    type: 'radio',
    options: ['Até 20€', '20€ - 50€', '50€ - 100€', 'Mais de 100€']
  },
  {
    id: 'type',
    question: 'Que tipo de presente ela mais gosta?',
    type: 'radio',
    options: ['Mais emocional/surpresa', 'Mais prático/útil', 'Mais divertido/engraçado']
  },
  {
    id: 'restrictions',
    question: 'Há alguma restrição ou preferência especial?',
    type: 'checkbox',
    options: ['É vegano/a', 'Não bebe álcool', 'Não gosta de perfumes', 'Alergia a animais', 'É religioso/a', 'Outro']
  },
  {
    id: 'previous',
    question: 'Ela já mencionou algum presente que adorou ou detestou?',
    type: 'text',
    placeholder: 'Conte-nos sobre presentes anteriores...'
  },
  {
    id: 'gender',
    question: 'Qual o gênero da pessoa?',
    type: 'radio',
    options: ['Masculino', 'Feminino', 'Prefiro não dizer']
  }
]

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { profile, updateCredits } = useProfile(user?.id)
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
    }
  }, [user, router])

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    if (!profile || profile.credits < 1) {
      alert('Você não tem créditos suficientes!')
      return
    }

    setLoading(true)

    try {
      // Deduct credit
      await updateCredits(profile.credits - 1)

      // Generate suggestions using OpenAI
      const prompt = `Com base nas seguintes informações sobre a pessoa que vai receber um presente de Natal: ${JSON.stringify(answers)}, sugere entre 5 e 10 ideias de presentes de Natal.
Para cada sugestão, explica em poucas frases:
- Porque é que este presente faz sentido para esta pessoa.
- Se é um presente mais emocional, prático ou divertido.
- Que faixa de orçamento se adequa (baixo, médio, alto).
Mantém a linguagem simples, direta e próxima, como se estivesses a aconselhar um amigo.`

      const response = await fetch('/api/generate-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })

      if (!response.ok) throw new Error('Erro ao gerar sugestões')

      const { suggestions } = await response.json()

      // Save to database
      const { error } = await fetch('/api/save-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          quizData: answers,
          results: suggestions
        })
      })

      if (error) throw error

      // Redirect to results
      router.push(`/results?data=${encodeURIComponent(JSON.stringify({ answers, suggestions }))}`)
    } catch (error) {
      console.error('Error:', error)
      alert('Erro ao processar o quiz. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  if (!user || !profile) {
    return <div>Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <Gift className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz de Presentes de Natal</h1>
          <p className="text-gray-600">Responda às perguntas para descobrir o presente perfeito</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-500">
                Pergunta {currentQuestion + 1} de {questions.length}
              </span>
              <span className="text-sm text-gray-500">
                {profile.credits} créditos restantes
              </span>
            </div>
            <Progress value={progress} className="mb-4" />
            <CardTitle>{question.question}</CardTitle>
          </CardHeader>
          <CardContent>
            {question.type === 'radio' && (
              <RadioGroup
                value={answers[question.id] || ''}
                onValueChange={(value) => handleAnswer(question.id, value)}
              >
                {question.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={option} />
                    <Label htmlFor={option}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {question.type === 'checkbox' && (
              <div className="space-y-2">
                {question.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      id={option}
                      checked={(answers[question.id] || []).includes(option)}
                      onCheckedChange={(checked) => {
                        const current = answers[question.id] || []
                        if (checked) {
                          if (current.length < 3) {
                            handleAnswer(question.id, [...current, option])
                          }
                        } else {
                          handleAnswer(question.id, current.filter((item: string) => item !== option))
                        }
                      }}
                    />
                    <Label htmlFor={option}>{option}</Label>
                  </div>
                ))}
              </div>
            )}

            {question.type === 'text' && (
              <textarea
                className="w-full p-2 border rounded-md"
                placeholder={question.placeholder}
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswer(question.id, e.target.value)}
                rows={4}
              />
            )}

            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>

              {currentQuestion === questions.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={loading || !answers[question.id]}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {loading ? 'Processando...' : 'Concluir e ver sugestões (1 crédito)'}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!answers[question.id]}
                >
                  Próxima
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}