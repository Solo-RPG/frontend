import { TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

export function RecentActivityCard({ stats }: { stats: { characters: number, templates: number } }) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
          <TrendingUp className="h-5 w-5" />
          Atividade Recente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <ActivityItem 
            color="green" 
            text="Sistema inicializado com sucesso" 
            time="agora" 
          />
          <ActivityItem 
            color="blue" 
            text={`${stats.templates} templates carregados`} 
            time="1 min atrás" 
          />
          <ActivityItem 
            color="purple" 
            text={`${stats.characters} personagens carregados`} 
            time="2 min atrás" 
          />
        </div>
      </CardContent>
    </Card>
  )
}

function ActivityItem({ color, text, time }: {
  color: 'green' | 'blue' | 'purple'
  text: string
  time: string
}) {
  const colorClasses = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500'
  }

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center space-x-3">
        <div className={`w-2 h-2 rounded-full ${colorClasses[color]}`} />
        <span className="text-sm text-gray-700 dark:text-gray-300">{text}</span>
      </div>
      <span className="text-xs text-gray-500">{time}</span>
    </div>
  )
}
