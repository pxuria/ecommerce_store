"use client"

import { TrendingUp } from "lucide-react"
import { Pie, PieChart as PieChartComponent } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { ChartDataInput } from "recharts/types/polar/Pie";

interface Props {
    title: string;
    titleDescription?: string;
    chartConfig: ChartConfig;
    chartData: ChartDataInput[]
    dataKey?: string
    nameKey?: string
}

const PieChart = ({ title, titleDescription, chartConfig, chartData, dataKey, nameKey }: Props) => {
    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>{title}</CardTitle>
                {titleDescription && <CardDescription>{titleDescription}</CardDescription>}
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChartComponent>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent className="bg-white" hideLabel />}
                        />
                        <Pie data={chartData} dataKey={dataKey} nameKey={nameKey} />
                    </PieChartComponent>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 leading-none font-medium">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">
                    Showing total visitors for the last 6 months
                </div>
            </CardFooter>
        </Card>
    )
}

export default PieChart