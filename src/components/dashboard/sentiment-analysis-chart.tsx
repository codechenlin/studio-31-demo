
"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig } from "@/components/ui/chart"

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
  return (
    <Card className="flex flex-col bg-card/80 backdrop-blur-sm border-border/50 shadow-lg relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary via-accent to-primary opacity-80"/>
      <CardHeader className="items-start pb-0 z-10">
        <CardTitle>Análisis de Sentimiento</CardTitle>
        <CardDescription>Respuesta de la Audiencia</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center pb-4">
        <div className="w-full min-h-[280px] flex items-center justify-center">
            <div className="flex w-full max-w-xs flex-col gap-4 text-lg">
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
        </div>
      </CardContent>
    </Card>
  )
}
