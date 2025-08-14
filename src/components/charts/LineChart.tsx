import {
  LineChart as RechartsLineChart,
  Line,
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

interface LineChartProps {
  title?: string;
  data: DataPoint[];
  xAxisKey: string;
  lines: {
    dataKey: string;
    name: string;
    color: string;
    strokeWidth?: number;
  }[];
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  className?: string;
}

export function LineChart({
  title,
  data,
  xAxisKey,
  lines,
  height = 350,
  showGrid = true,
  showLegend = true,
  className,
}: LineChartProps) {
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
        name.toLowerCase().includes("percentage")
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
                className="w-3 h-3 rounded-full"
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
          <RechartsLineChart
            data={data}
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
              dataKey={xAxisKey}
              className="text-xs fill-muted-foreground"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
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
            {lines.map((line) => (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                stroke={line.color}
                strokeWidth={line.strokeWidth || 2}
                name={line.name}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
