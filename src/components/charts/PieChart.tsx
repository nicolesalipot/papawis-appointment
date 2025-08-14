import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DataPoint {
  name: string;
  value: number;
  color?: string;
}

interface PieChartProps {
  title?: string;
  data: DataPoint[];
  dataKey?: string;
  nameKey?: string;
  height?: number;
  showLegend?: boolean;
  showLabels?: boolean;
  innerRadius?: number;
  outerRadius?: number;
  colors?: string[];
  className?: string;
}

const DEFAULT_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "#8b5cf6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#3b82f6",
  "#ec4899",
];

export function PieChart({
  title,
  data,
  dataKey = "value",
  nameKey = "name",
  height = 350,
  showLegend = true,
  showLabels = false,
  innerRadius = 0,
  outerRadius = undefined,
  colors = DEFAULT_COLORS,
  className,
}: PieChartProps) {
  const formatTooltipValue = (value: any, name: string) => {
    if (typeof value === "number") {
      // Calculate percentage
      const total = data.reduce((sum, item) => sum + item.value, 0);
      const percentage = ((value / total) * 100).toFixed(1);

      // Format currency
      if (
        name.toLowerCase().includes("revenue") ||
        name.toLowerCase().includes("amount")
      ) {
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);
        return `${formatted} (${percentage}%)`;
      }

      // Format regular numbers with percentage
      const formatted = new Intl.NumberFormat("en-US").format(value);
      return `${formatted} (${percentage}%)`;
    }
    return value;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3">
          <div className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: data.payload.color || data.color }}
            />
            <span className="text-muted-foreground">{data.name}:</span>
            <span className="font-medium text-foreground">
              {formatTooltipValue(data.value, data.name)}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    if (percent < 0.05) return null; // Don't show labels for slices less than 5%

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => {
          const total = data.reduce((sum, item) => sum + item.value, 0);
          const percentage = ((entry.payload.value / total) * 100).toFixed(1);

          return (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">
                {entry.value} ({percentage}%)
              </span>
            </div>
          );
        })}
      </div>
    );
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
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={showLabels ? CustomLabel : false}
              outerRadius={outerRadius || height * 0.3}
              innerRadius={innerRadius}
              fill="#8884d8"
              dataKey={dataKey}
              nameKey={nameKey}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || colors[index % colors.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend content={<CustomLegend />} />}
          </RechartsPieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
