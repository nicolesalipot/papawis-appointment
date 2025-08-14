import {
  AreaChart as RechartsAreaChart,
  Area,
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

interface AreaChartProps {
  title?: string;
  data: DataPoint[];
  xAxisKey: string;
  areas: {
    dataKey: string;
    name: string;
    color: string;
    stackId?: string;
  }[];
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  stacked?: boolean;
  className?: string;
}

export function AreaChart({
  title,
  data,
  xAxisKey,
  areas,
  height = 350,
  showGrid = true,
  showLegend = true,
  stacked = false,
  className,
}: AreaChartProps) {
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
          <RechartsAreaChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <defs>
              {areas.map((area, index) => (
                <linearGradient
                  key={`gradient-${index}`}
                  id={`gradient-${area.dataKey}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={area.color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={area.color} stopOpacity={0.1} />
                </linearGradient>
              ))}
            </defs>
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
            {areas.map((area) => (
              <Area
                key={area.dataKey}
                type="monotone"
                dataKey={area.dataKey}
                stackId={stacked ? area.stackId || "1" : undefined}
                stroke={area.color}
                fill={`url(#gradient-${area.dataKey})`}
                strokeWidth={2}
                name={area.name}
              />
            ))}
          </RechartsAreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
