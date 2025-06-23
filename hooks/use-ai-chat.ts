"use client"

import { useState, useCallback } from 'react'
import OpenAI from 'openai'

interface AIPersona {
  name: string
  profession: string
  personality: string
  expertise: string[]
  communicationStyle: string
}

interface AIMessage {
  id: string
  content: string
  timestamp: Date
  isFromAI: boolean
  persona: AIPersona
}

export function useAIChat() {
  const [isAIEnabled, setIsAIEnabled] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)

  // Função para criar uma persona baseada no profissional
  const createPersona = useCallback((professional: { name: string; profession: string }): AIPersona => {
    const personas: Record<string, Partial<AIPersona>> = {
      'designer': {
        personality: 'Criativo, detalhista e apaixonado por estética. Gosta de explicar conceitos visuais e sempre está atualizado com as últimas tendências.',
        expertise: ['Design Gráfico', 'UI/UX', 'Adobe Creative Suite', 'Tipografia', 'Teoria das Cores'],
        communicationStyle: 'Entusiástico e visual, usa muitas metáforas visuais para explicar conceitos'
      },
      'developer': {
        personality: 'Lógico, analítico e sempre disposto a resolver problemas. Adora tecnologia e está sempre aprendendo novas linguagens.',
        expertise: ['JavaScript', 'React', 'Node.js', 'Python', 'Arquitetura de Software'],
        communicationStyle: 'Direto e técnico, mas paciente para explicar conceitos complexos'
      },
      'teacher': {
        personality: 'Paciente, empático e dedicado ao aprendizado. Tem facilidade para simplificar conceitos complexos.',
        expertise: ['Pedagogia', 'Metodologias de Ensino', 'Psicologia Educacional'],
        communicationStyle: 'Didático e encorajador, sempre verifica se o aluno entendeu'
      },
      'musician': {
        personality: 'Criativo, expressivo e apaixonado pela música. Gosta de compartilhar a alegria da música.',
        expertise: ['Teoria Musical', 'Instrumentos', 'Composição', 'Performance'],
        communicationStyle: 'Inspirador e metafórico, relaciona conceitos musicais com o dia a dia'
      },
      'chef': {
        personality: 'Apaixonado pela culinária, detalhista com ingredientes e técnicas. Adora compartilhar tradições gastronômicas.',
        expertise: ['Técnicas Culinárias', 'Ingredientes', 'Nutrição', 'Tradições Gastronômicas'],
        communicationStyle: 'Caloroso e descritivo, usa muitas referências sensoriais'
      }
    }

    const professionKey = professional.profession.toLowerCase()
    const basePersona = personas[professionKey] || personas['teacher']

    return {
      name: professional.name,
      profession: professional.profession,
      personality: basePersona.personality || 'Profissional dedicado e experiente na sua área.',
      expertise: basePersona.expertise || ['Conhecimento Geral'],
      communicationStyle: basePersona.communicationStyle || 'Profissional e prestativo'
    }
  }, [])  // Função simulada de IA (para desenvolvimento local)
  const generateLocalAIResponse = useCallback((message: string, persona: AIPersona, chatHistory: any[] = []): string => {
    // Analisa o histórico para evitar repetições
    const recentResponses = chatHistory
      .filter(msg => !msg.isFromAI && msg.senderId !== "current_user")
      .slice(-3)
      .map(msg => msg.content.toLowerCase())

    const messageCount = chatHistory.filter(msg => msg.senderId !== "current_user").length
    const userMessage = message.toLowerCase()

    // Função para gerar datas de agendamento
    const generateSchedulingDates = (): string => {
      const now = new Date()
      const dates = []
      
      // Gera 5 opções de datas nos próximos 14 dias
      for (let i = 1; i <= 14; i++) {
        const date = new Date(now)
        date.setDate(now.getDate() + i)
        
        // Evita fins de semana para algumas profissões
        if (date.getDay() !== 0 && date.getDay() !== 6) {
          dates.push(date)
        }
        
        if (dates.length >= 5) break
      }
      
      const formattedDates = dates.map((date, index) => {
        const dayName = date.toLocaleDateString('pt-BR', { weekday: 'long' })
        const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
        const times = ['09:00', '14:00', '16:00', '19:00']
        const time = times[Math.floor(Math.random() * times.length)]
        
        return `${index + 1}. ${dayName.charAt(0).toUpperCase() + dayName.slice(1)}, ${dateStr} às ${time}h`
      }).join('\n')
      
      return formattedDates
    }    // Detecta diferentes tipos de mensagens relacionadas ao agendamento
    const isSchedulingRequest = userMessage.includes('agendar') || 
                               userMessage.includes('marcar') ||
                               userMessage.includes('horário') ||
                               userMessage.includes('data') ||
                               userMessage.includes('quando') ||
                               userMessage.includes('disponível') ||
                               userMessage.includes('sessão') ||
                               userMessage.includes('aula') ||
                               userMessage.includes('encontro') ||
                               userMessage.includes('reunir')
    
    // Detecta se o usuário está escolhendo uma data específica
    const isChoosingDate = userMessage.match(/\d{1,2}\.|\d{1,2}\s|primeira|segunda|terceira|quarta|quinta|opção|escolho|prefiro|número|data|horário|esse|esta/i) &&
                          (userMessage.includes('opção') || userMessage.includes('escolho') || userMessage.includes('prefiro') || userMessage.includes('essa') || userMessage.includes('este') || userMessage.includes('número') || /\d/.test(userMessage))
    
    // Detecta se o usuário não tem disponibilidade
    const isUnavailable = userMessage.includes('não posso') ||
                         userMessage.includes('não consigo') ||
                         userMessage.includes('não tenho') ||
                         userMessage.includes('indisponível') ||
                         userMessage.includes('não dá') ||
                         userMessage.includes('ocupado') ||
                         userMessage.includes('sem disponibilidade') ||
                         userMessage.includes('nenhuma das datas') ||
                         userMessage.includes('não serve')

    // Respostas específicas para agendamento
    if (isChoosingDate) {
      // Usuário escolheu uma data específica
      const confirmationResponses = [
        `Perfeito! ${persona.name} aqui - vou confirmar sua sessão e te enviar uma solicitação formal! Você receberá todos os detalhes por mensagem, incluindo localização e materiais necessários. Estou muito animado(a) para nossa aula! Vou preparar um conteúdo especial baseado no que conversamos. 📅✨`,
        
        `Excelente escolha! Acabei de anotar na minha agenda. Vou te enviar uma solicitação de agendamento com todos os detalhes da nossa sessão. Prepare-se para uma experiência incrível de aprendizado! Já estou planejando exercícios práticos específicos para você. 🗓️👍`,
        
        `Ótimo! Data confirmada! Como ${persona.profession}, adoro quando vejo esse comprometimento. Vou processar o agendamento e você receberá uma notificação com local, horário e tudo que precisa saber. Mal posso esperar para compartilhar meu conhecimento com você! 🎯📚`
      ]
      
      return confirmationResponses[Math.floor(Math.random() * confirmationResponses.length)]
      
    } else if (isUnavailable) {
      // Usuário não tem disponibilidade para as datas sugeridas
      const keepInTouchResponses = [
        `Entendo perfeitamente! A agenda às vezes não colabora mesmo. 😊 Vou manter contato com você e assim que eu tiver novas disponibilidades, te aviso! Enquanto isso, se surgir alguma dúvida sobre ${persona.expertise[0]}, pode me chamar aqui no chat. Não vamos perder essa oportunidade de aprendizado!`,
        
        `Sem problemas! Como ${persona.profession}, sei que cada um tem seu ritmo e disponibilidade. Vou ficar de olho na minha agenda e te comunico quando abrirem novos horários. Nossa conexão já foi feita, então é só aguardar o momento certo! 📱⏰`,
        
        `Tranquilo! Acontece! Vou manter você na minha lista de contatos prioritários para agendamento. Assim que eu conseguir ajustar minha agenda ou surgirem cancelamentos, você será o primeiro a saber. O importante é que você demonstrou interesse genuíno - isso já é meio caminho andado! 🤝💪`
      ]
      
      return keepInTouchResponses[Math.floor(Math.random() * keepInTouchResponses.length)]
      
    } else if (isSchedulingRequest) {
      // Primeira solicitação de agendamento
      const schedulingResponses = [
        `Claro! Fico muito feliz em agendar uma sessão com você! Tenho algumas opções disponíveis na minha agenda. Aqui estão as datas que posso oferecer:\n\n${generateSchedulingDates()}\n\nQual dessas opções funciona melhor para você? Posso ajustar o horário se necessário!`,
        
        `Perfeito! Adoro quando alguém está disposto a se comprometer com o aprendizado! Vou verificar minha agenda... Tenho essas opções disponíveis:\n\n${generateSchedulingDates()}\n\nCada sessão tem duração de ${persona.profession === 'Chef' ? '2-3 horas' : persona.profession === 'Developer' ? '2 horas' : '1-2 horas'}. Qual horário te atende melhor?`,
        
        `Que ótimo! Vamos marcar sim! Como ${persona.profession}, sempre fico animado quando vejo interesse genuíno. Aqui estão minhas próximas disponibilidades:\n\n${generateSchedulingDates()}\n\nTodas são sessões práticas onde você vai aprender fazendo. Me diga qual data prefere!`
      ]
      
      return schedulingResponses[Math.floor(Math.random() * schedulingResponses.length)]
    }

    // Respostas mais variadas baseadas no contexto (código existente)
    const responseTemplates = {
      firstMessage: [
        `Olá! Que prazer conhecê-lo! Sou ${persona.name}, especialista em ${persona.profession}. Vi que você tem interesse na minha área, e ficarei feliz em ajudar! O que gostaria de aprender primeiro?`,
        `Oi! ${persona.name} aqui! Adoro quando alguém demonstra interesse em ${persona.profession}. Conte-me um pouco sobre seu nível atual e seus objetivos, para que eu possa te ajudar da melhor forma!`,
        `Olá! É sempre empolgante conversar com pessoas interessadas em ${persona.expertise[0]}! Sou ${persona.name} e tenho anos de experiência nesta área. Como posso tornar sua jornada de aprendizado mais interessante?`
      ],
      
      questions: [
        `Excelente pergunta! ${messageCount > 2 ? 'Vejo que você está realmente empenhado em entender isso.' : ''} Na minha experiência com ${persona.profession}, essa é uma questão fundamental.`,
        `Que pergunta interessante! ${messageCount > 1 ? 'Suas perguntas mostram que você está pensando criticamente sobre o assunto.' : ''} Deixe-me compartilhar uma perspectiva prática sobre isso...`,
        `Adoro essa pergunta! ${messageCount > 3 ? 'Suas questões estão se tornando cada vez mais sofisticadas.' : ''} Vou explicar isso de uma forma que conecte com o que já conversamos.`,
        `Ótima questão! Na área de ${persona.profession}, isso é algo que vejo frequentemente. Vou te dar uma resposta baseada em casos reais que já enfrentei.`
      ],

      followUp: [
        `Baseado no que você me disse antes sobre ${userMessage.includes('como') ? 'suas dúvidas' : 'seu interesse'}, posso aprofundar esse tópico.`,
        `Continuando nossa conversa anterior, essa questão se relaciona diretamente com o que discutimos.`,
        `Vejo uma conexão com o que falamos antes. Deixe-me expandir essa ideia...`,
        `Essa pergunta complementa perfeitamente nossa discussão anterior sobre ${persona.expertise[0]}.`
      ],

      encouragement: [
        `Você está fazendo um progresso fantástico! ${messageCount > 2 ? 'Posso ver sua evolução através das perguntas que faz.' : ''}`,
        `Impressionante seu comprometimento! ${messageCount > 1 ? 'A qualidade das suas perguntas melhorou muito.' : ''}`,
        `Excelente! ${messageCount > 3 ? 'Já percorreu um bom caminho no aprendizado.' : 'Continue assim que logo verá resultados!'}`
      ],

      practical: [
        `Vou te dar um exemplo prático que uso com meus alunos: imagine que você está ${persona.profession === 'Designer' ? 'criando um projeto visual' : persona.profession === 'Chef' ? 'preparando um prato especial' : 'trabalhando em um projeto'}...`,
        `Deixe-me compartilhar uma técnica que sempre funciona: ${persona.profession === 'Teacher' ? 'quando ensino esse conceito' : 'na minha prática profissional'}, eu sempre...`,
        `Aqui está uma dica que poucos conhecem: no mundo da ${persona.profession}, nós sempre consideramos...`
      ],

      deeper: [
        `Já que você demonstra interesse genuíno, vou compartilhar algo mais avançado sobre ${persona.expertise[Math.floor(Math.random() * persona.expertise.length)]}...`,
        `Para alguém com sua curiosidade, vale a pena explorar ${persona.expertise[Math.floor(Math.random() * persona.expertise.length)]} mais profundamente.`,
        `Vejo que você está pronto para conceitos mais complexos. Vamos falar sobre ${persona.expertise[Math.floor(Math.random() * persona.expertise.length)]}.`
      ]
    }

    // Determina o tipo de resposta baseado no contexto
    let responseType: keyof typeof responseTemplates
    
    if (messageCount === 0) {
      responseType = 'firstMessage'
    } else if (userMessage.includes('?') || userMessage.includes('como') || userMessage.includes('por que')) {
      responseType = messageCount > 2 ? 'deeper' : 'questions'
    } else if (userMessage.includes('obrigad') || userMessage.includes('valeu') || userMessage.includes('muito bom')) {
      responseType = 'encouragement'
    } else if (messageCount > 1) {
      responseType = Math.random() > 0.5 ? 'followUp' : 'practical'
    } else {
      responseType = 'practical'
    }

    const availableResponses = responseTemplates[responseType]
    let selectedResponse = availableResponses[Math.floor(Math.random() * availableResponses.length)]

    // Evita repetir respostas recentes
    let attempts = 0
    while (recentResponses.some(recent => selectedResponse.toLowerCase().includes(recent.substring(0, 20))) && attempts < 3) {
      selectedResponse = availableResponses[Math.floor(Math.random() * availableResponses.length)]
      attempts++
    }

    // Adiciona contexto específico baseado na área do profissional
    const contextualAdditions = {
      'Designer': [
        'Gostaria de ver alguns exemplos visuais?',
        'Que tal discutirmos sobre tendências atuais de design?',
        'Posso te mostrar algumas técnicas de composição.',
        'Vamos falar sobre teoria das cores?',
        'Quer agendar uma sessão prática de design?'
      ],
      'Developer': [
        'Quer ver um exemplo de código?',
        'Podemos discutir as melhores práticas?',
        'Que tal explorarmos diferentes frameworks?',
        'Vamos falar sobre arquitetura de software?',
        'Podemos marcar uma sessão de coding?'
      ],
      'Chef': [
        'Gostaria de uma receita especial?',
        'Que tal discutirmos técnicas culinárias?',
        'Podemos falar sobre harmonização de sabores?',
        'Vamos explorar ingredientes únicos?',
        'Quer agendar uma aula de culinária prática?'
      ],
      'Teacher': [
        'Quer que eu prepare um exercício prático?',
        'Podemos fazer uma atividade interativa?',
        'Que tal discutirmos metodologias de aprendizado?',
        'Vamos criar um plano de estudos personalizado?',
        'Podemos marcar uma sessão de estudo?'
      ]
    }

    const professionKey = persona.profession.split(' ')[0] // Pega a primeira palavra
    const additions = contextualAdditions[professionKey as keyof typeof contextualAdditions] || [
      'Tem alguma pergunta específica?',
      'Gostaria de explorar algum aspecto em particular?',
      'Posso ajudar com mais alguma coisa?',
      'Que tal aprofundarmos esse tema?',
      'Quer agendar uma sessão prática?'
    ]

    // Varia a adição baseada no número de mensagens
    const additionIndex = messageCount % additions.length
    const addition = additions[additionIndex]
    
    return `${selectedResponse} ${addition}`
  }, [])// Função principal para gerar resposta da IA
  const generateAIResponse = useCallback(async (
    message: string, 
    persona: AIPersona, 
    chatHistory: any[] = [] // Using any[] to avoid type conflicts with different Message interfaces
  ): Promise<string> => {
    setIsGenerating(true)

    try {
      // Para desenvolvimento local, use a função simulada
      if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000)) // Simula delay da API
        const response = generateLocalAIResponse(message, persona, chatHistory)
        setIsGenerating(false)
        return response
      }

      // Configuração da OpenAI (para produção)
      const openai = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
      })

      const systemPrompt = `Você é ${persona.name}, um(a) ${persona.profession} experiente e único(a). 

PERSONALIDADE: ${persona.personality}

EXPERTISE: Você é especialista em: ${persona.expertise.join(', ')}

ESTILO DE COMUNICAÇÃO: ${persona.communicationStyle}

INSTRUÇÕES IMPORTANTES:
- Responda sempre como ${persona.name}, mantendo sua personalidade única
- EVITE repetir frases ou estruturas de respostas anteriores
- Varie seu vocabulário e abordagem em cada resposta
- Use exemplos diferentes e histórias variadas
- Adapte seu tom baseado no progresso da conversa
- Seja progressivamente mais específico e técnico conforme a conversa evolui
- Referencie conversas anteriores quando relevante
- Mantenha o foco na sua área de expertise mas seja criativo nas explicações
- Use analogias e metáforas diferentes a cada resposta
- Pergunte questões variadas para manter o engajamento
- Mantenha um tom profissional mas amigável e autêntico
- Responda em português brasileiro
- Limite suas respostas a 2-3 parágrafos no máximo

CONTEXTO: Você está em uma plataforma de troca de habilidades onde as pessoas se conectam para ensinar e aprender. Cada conversa é única e você deve adaptar seu estilo baseado no histórico.

EVITE: Repetir frases como "Excelente pergunta", "Como especialista em", "Na minha experiência" de forma excessiva. Seja mais natural e variado.`

      const conversation = chatHistory.slice(-8).map(msg => ({
        role: msg.senderId === 'current_user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      }))

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          ...conversation,
          { role: "user", content: message }
        ],
        max_tokens: 300,
        temperature: 0.7
      })

      const response = completion.choices[0].message.content ||
        generateLocalAIResponse(message, persona, chatHistory)
      
      setIsGenerating(false)
      return response

    } catch (error) {
      console.error('Erro ao gerar resposta da IA:', error)
      setIsGenerating(false)
      return generateLocalAIResponse(message, persona, chatHistory)
    }
  }, [generateLocalAIResponse])

  return {
    isAIEnabled,
    setIsAIEnabled,
    isGenerating,
    createPersona,
    generateAIResponse
  }
}
