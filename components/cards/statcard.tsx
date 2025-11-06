import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"

export function StatCard({ title, value, description, icon }: {
  title: string
  value: number
  description: string
  icon: React.ReactNode
}) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-white">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
        <p className="text-xs text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
