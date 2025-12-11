 "use client"

import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface ChartWrapperProps {
    title: string;
    description: string;
    children: React.ReactNode;
    chartConfig: any;
}

export function ChartWrapper({ title, description, children, chartConfig }: ChartWrapperProps) {
    return (
        <>
        <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
                {children}
            </ChartContainer>
        </CardContent>
        </>
    );
}

export const ChartTooltipFrame = (props: any) => (
  <ChartTooltip
    content={
      <ChartTooltipContent
        className="w-[200px]"
        labelClassName="font-bold"
        {...props}
      />
    }
  />
);
