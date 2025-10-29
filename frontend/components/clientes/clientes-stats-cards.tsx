import { IconTrendingDown, IconTrendingUp, IconUsers, IconUserCheck, IconUserX, IconUserPlus } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface ClientesStatsCardsProps {
  totalClientes: number
  clientesAtivos: number
  clientesInativos: number
  novosEsteMes: number
  crescimentoPercentual?: number
}

export function ClientesStatsCards({
  totalClientes,
  clientesAtivos,
  clientesInativos,
  novosEsteMes,
  crescimentoPercentual = 0,
}: ClientesStatsCardsProps) {
  const isCrescendo = crescimentoPercentual >= 0

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total de Clientes</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalClientes.toLocaleString('pt-BR')}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconUsers className="size-4" />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Base total de clientes
          </div>
          <div className="text-muted-foreground">
            Cadastrados no sistema
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Clientes Ativos</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {clientesAtivos.toLocaleString('pt-BR')}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-green-600 dark:text-green-400">
              <IconUserCheck className="size-4" />
              {totalClientes > 0 ? Math.round((clientesAtivos / totalClientes) * 100) : 0}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Clientes em operação
          </div>
          <div className="text-muted-foreground">
            Disponíveis para vendas
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Novos Este Mês</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {novosEsteMes.toLocaleString('pt-BR')}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {isCrescendo ? (
                <>
                  <IconTrendingUp className="size-4" />
                  +{Math.abs(crescimentoPercentual).toFixed(1)}%
                </>
              ) : (
                <>
                  <IconTrendingDown className="size-4" />
                  {crescimentoPercentual.toFixed(1)}%
                </>
              )}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {isCrescendo ? (
              <>
                Crescimento positivo <IconTrendingUp className="size-4" />
              </>
            ) : (
              <>
                Redução no período <IconTrendingDown className="size-4" />
              </>
            )}
          </div>
          <div className="text-muted-foreground">
            Comparado ao mês anterior
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Clientes Inativos</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {clientesInativos.toLocaleString('pt-BR')}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-red-600 dark:text-red-400">
              <IconUserX className="size-4" />
              {totalClientes > 0 ? Math.round((clientesInativos / totalClientes) * 100) : 0}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Clientes desativados
          </div>
          <div className="text-muted-foreground">
            Requer atenção
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

