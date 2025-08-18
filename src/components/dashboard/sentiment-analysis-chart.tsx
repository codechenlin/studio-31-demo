
"use client"

import * as React from "react"
import { Pie, PieChart } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"

const chartData = [
  { sentiment: "Positivo", value: 75, color: "hsl(var(--chart-2))" },
  { sentiment: "Neutral", value: 15, color: "hsl(var(--chart-3))" },
  { sentiment: "Negativo", value: 10, color: "hsl(var(--chart-5))" },
];

const chartConfig = {
  value: { label: "Sentimiento" },
  Positivo: { label: "Positivo", color: "hsl(var(--chart-2))" },
  Neutral: { label: "Neutral", color: "hsl(var(--chart-3))" },
  Negativo: { label: "Negativo", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig;

export function SentimentAnalysisChart() {
  const positiveValue = chartData.find(d => d.sentiment === 'Positivo')?.value || 0;
  const neutralValue = chartData.find(d => d.sentiment === 'Neutral')?.value || 0;
  const negativeValue = chartData.find(d => d.sentiment === 'Negativo')?.value || 0;

  return (
    <Card className="flex flex-col bg-card/80 backdrop-blur-sm border-border/50 shadow-lg relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary via-accent to-primary opacity-80"/>
      <CardHeader className="items-start pb-0 z-10">
        <CardTitle>Análisis de Sentimiento</CardTitle>
        <CardDescription>Respuesta de la Audiencia</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center pb-4">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart>
            {/* Background Rings */}
            <Pie data={[{ value: 100 }]} dataKey="value" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="hsl(var(--ai-track))" stroke="hsl(var(--border) / 0.2)" />
            <Pie data={[{ value: 100 }]} dataKey="value" cx="50%" cy="50%" innerRadius={85} outerRadius={105} fill="hsl(var(--ai-track))" stroke="hsl(var(--border) / 0.2)" />
            <Pie data={[{ value: 100 }]} dataKey="value" cx="50%" cy="50%" innerRadius={110} outerRadius={130} fill="hsl(var(--ai-track))" stroke="hsl(var(--border) / 0.2)" />
            
            {/* Data Rings */}
            <Pie
              data={[{ value: positiveValue }]}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              startAngle={90}
              endAngle={90 + (positiveValue / 100) * 360}
              fill={chartConfig.Positivo.color}
              stroke="none"
              cornerRadius={5}
            />
            <Pie
              data={[{ value: neutralValue }]}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={85}
              outerRadius={105}
              startAngle={90}
              endAngle={90 + (neutralValue / 100) * 360}
              fill={chartConfig.Neutral.color}
              stroke="none"
              cornerRadius={5}
            />
             <Pie
              data={[{ value: negativeValue }]}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={110}
              outerRadius={130}
              startAngle={90}
              endAngle={90 + (negativeValue / 100) * 360}
              fill={chartConfig.Negativo.color}
              stroke="none"
              cornerRadius={5}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
       <div className="flex w-full flex-col gap-4 text-lg p-4 pt-0">
          {chartData.map((item) => (
              <div key={item.sentiment} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                      <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                      />
                      <span className="text-muted-foreground">{item.sentiment}</span>
                  </div>
                  <span className="font-bold text-foreground">{item.value}%</span>
              </div>
          ))}
      </div>
    </Card>
  )
}
