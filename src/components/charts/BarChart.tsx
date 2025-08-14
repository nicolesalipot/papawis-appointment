import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DataPoint {
  [key: string]: any;
}

interface BarChartProps {
  title?: string;
  data: DataPoint[];
  xAxisKey: string;
  bars: {
    dataKey: string;
    name: string;
    color: string;
  }[];
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  orientation?: "vertical" | "horizontal";
  className?: string;
}

export function BarChart({
  title,
  data,
  xAxisKey,
  bars,
  height = 350,
  showGrid = true,
  showLegend = true,
  orientation = "vertical",
  className,
}: BarChartProps) {
  const formatTooltipValue = (value: any, name: string) => {
    if (typeof value === "number") {
      // Format currency
      if (
        name.toLowerCase().includes("revenue") ||
        name.toLowerCase().includes("amount")
      ) {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);
      }
      // Format percentage
      if (
        name.toLowerCase().includes("rate") ||
        name.toLowerCase().includes("percentage") ||
        name.toLowerCase().includes("utilization")
      ) {
        return `${value.toFixed(1)}%`;
      }
      // Format regular numbers
      return new Intl.NumberFormat("en-US").format(value);
    }
    return value;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-medium text-foreground">
                {formatTooltipValue(entry.value, entry.name)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={cn("", className)}>
      {title && (
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="pt-2">
        <ResponsiveContainer width="100%" height={height}>
          <RechartsBarChart
            data={data}
            layout={orientation === "horizontal" ? "horizontal" : "vertical"}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-muted/20"
              />
            )}
            <XAxis
              dataKey={orientation === "horizontal" ? undefined : xAxisKey}
              type={orientation === "horizontal" ? "number" : "category"}
              className="text-xs fill-muted-foreground"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              dataKey={orientation === "horizontal" ? xAxisKey : undefined}
              type={orientation === "horizontal" ? "category" : "number"}
              className="text-xs fill-muted-foreground"
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && (
              <Legend
                wrapperStyle={{
                  paddingTop: "20px",
                  fontSize: "12px",
                }}
              />
            )}
            {bars.map((bar) => (
              <Bar
                key={bar.dataKey}
                dataKey={bar.dataKey}
                fill={bar.color}
                name={bar.name}
                radius={[2, 2, 0, 0]}
              />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
