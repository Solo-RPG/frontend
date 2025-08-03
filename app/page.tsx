"use client"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sword, Shield, Users, Sparkles, Crown } from "lucide-react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDiceD20 } from '@fortawesome/free-solid-svg-icons'

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fundo animado com múltiplas camadas */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-slate-900 to-orange-900 animate-gradient-slow"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-800/30 via-slate-900/50 to-orange-800/30 animate-gradient-medium"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-600/10 via-transparent to-orange-600/10 animate-gradient-fast opacity-60"></div>

      {/* Efeitos decorativos */}
      <div className="absolute top-20 right-20 opacity-15">
        <Crown className="h-24 w-24 text-yellow-400 animate-pulse" />
      </div>
      <div className="absolute bottom-32 left-32 opacity-10">
        <Sparkles className="h-16 w-16 text-purple-400 animate-spin-slow" />
      </div>
      <div className="absolute top-1/3 left-1/4 opacity-5">
        <Sparkles className="h-24 w-24 text-orange-300 animate-float" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Lado esquerdo - Conteúdo visual */}
        <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
          <div className="relative z-10 flex flex-col justify-center px-12 text-white">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-4 bg-gradient-to-br from-purple-600/40 to-orange-500/40 backdrop-blur-sm rounded-2xl border border-purple-400/30 shadow-lg">
                  <FontAwesomeIcon 
                    icon={faDiceD20} 
                    className="h-12 w-12 text-purple-200 animate-float-slow" 
                  />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-300 to-orange-300 bg-clip-text text-transparent">
                    SOLO RPG
                  </h1>
                  <p className="text-purple-200">Suas aventuras começam aqui</p>
                </div>
              </div>

              <h2 className="text-3xl font-bold mb-4 leading-tight">Gerencie suas fichas de RPG de forma épica</h2>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                Crie, organize e compartilhe personagens únicos. Suporte a múltiplos sistemas, templates personalizáveis e
                uma interface intuitiva para mestres e jogadores.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-purple-400/30 transition-all">
                <div className="p-3 bg-gradient-to-br from-red-500/30 to-orange-500/30 rounded-lg">
                  <Sword className="h-6 w-6 text-red-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Personagens Únicos</h3>
                  <p className="text-sm text-slate-300">Crie fichas detalhadas com atributos dinâmicos</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-blue-400/30 transition-all">
                <div className="p-3 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-lg">
                  <Shield className="h-6 w-6 text-blue-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Templates Flexíveis</h3>
                  <p className="text-sm text-slate-300">Suporte a D&D, Tormenta e sistemas customizados</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-green-400/30 transition-all">
                <div className="p-3 bg-gradient-to-br from-green-500/30 to-teal-500/30 rounded-lg">
                  <Users className="h-6 w-6 text-green-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Colaboração</h3>
                  <p className="text-sm text-slate-300">Compartilhe com seu grupo de RPG</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lado direito - Formulário */}
        <div className="flex-1 lg:max-w-md xl:max-w-lg flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8 lg:hidden">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-600 to-orange-500 rounded-full shadow-md">
                  <FontAwesomeIcon 
                    icon={faDiceD20} 
                    className="h-8 w-8 text-white" 
                  />
                </div>
                <h1 className="text-3xl font-bold text-white">RPG Manager</h1>
              </div>
              <p className="text-slate-300">Gerencie suas fichas de RPG</p>
            </div>

            <Card className="backdrop-blur-sm bg-white/10 border border-white/20 shadow-2xl hover:shadow-purple-500/20 transition-all">
              <CardHeader>
                <CardTitle className="text-white text-center text-2xl">Bem-vindo</CardTitle>
                <CardDescription className="text-slate-300 text-center">
                  Entre ou crie sua conta para começar sua jornada
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-white/10 border border-white/10">
                    <TabsTrigger
                      value="login"
                      className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md"
                    >
                      Entrar
                    </TabsTrigger>
                    <TabsTrigger
                      value="register"
                      className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md"
                    >
                      Cadastrar
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="login">
                    <LoginForm />
                  </TabsContent>
                  <TabsContent value="register">
                    <RegisterForm />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <div className="flex items-center justify-center gap-8 mt-8 text-slate-400">
              <div className="flex items-center gap-2 hover:text-purple-300 transition-colors">
                <Sword className="h-5 w-5" />
                <span className="text-sm">Personagens</span>
              </div>
              <div className="flex items-center gap-2 hover:text-orange-300 transition-colors">
                <Shield className="h-5 w-5" />
                <span className="text-sm">Templates</span>
              </div>
              <div className="flex items-center gap-2 hover:text-purple-300 transition-colors">
                <FontAwesomeIcon 
                  icon={faDiceD20} 
                  className="h-5 w-5" 
                />
                <span className="text-sm">Campanhas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos globais para as animações */}
      <style jsx global>{`
        @keyframes gradientFlowSlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes gradientFlowMedium {
          0% { background-position: 100% 0%; }
          50% { background-position: 0% 100%; }
          100% { background-position: 100% 0%; }
        }
        @keyframes gradientFlowFast {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-gradient-slow {
          background-size: 300% 300%;
          animation: gradientFlowSlow 25s ease infinite;
        }
        .animate-gradient-medium {
          background-size: 200% 200%;
          animation: gradientFlowMedium 18s ease infinite;
        }
        .animate-gradient-fast {
          background-size: 150% 150%;
          animation: gradientFlowFast 12s ease infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float 8s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spinSlow 20s linear infinite;
        }
      `}</style>
    </div>
  )
}