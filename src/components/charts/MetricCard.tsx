import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: number | string;
  change?: number;
  trend?: "up" | "down" | "stable";
  icon?: LucideIcon;
  color?: string;
  format?: "number" | "currency" | "percentage";
  description?: string;
  className?: string;
}

export function MetricCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color = "primary",
  format = "number",
  description,
  className,
}: MetricCardProps) {
  const formatValue = (val: number | string) => {
    if (typeof val === "string") return val;

    switch (format) {
      case "currency":
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(val);
      case "percentage":
        return `${val.toFixed(1)}%`;
      case "number":
      default:
        return new Intl.NumberFormat("en-US").format(val);
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3" />;
      case "down":
        return <TrendingDown className="h-3 w-3" />;
      case "stable":
      default:
        return <Minus className="h-3 w-3" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      case "stable":
      default:
        return "text-muted-foreground";
    }
  };

  const getIconBgColor = () => {
    const colorMap: Record<string, string> = {
      primary: "bg-primary/10 text-primary",
      green: "bg-green-100 text-green-600",
      blue: "bg-blue-100 text-blue-600",
      purple: "bg-purple-100 text-purple-600",
      orange: "bg-orange-100 text-orange-600",
      red: "bg-red-100 text-red-600",
    };
    return colorMap[color] || colorMap.primary;
  };

  return (
    <Card className={cn("transition-all hover:shadow-md", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-foreground">
                {formatValue(value)}
              </h3>
              {change !== undefined && (
                <div
                  className={cn(
                    "flex items-center gap-1 text-xs font-medium",
                    getTrendColor()
                  )}
                >
                  {getTrendIcon()}
                  <span>
                    {change > 0 ? "+" : ""}
                    {change.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">
                {description}
              </p>
            )}
          </div>

          {Icon && (
            <div className={cn("rounded-lg p-3", getIconBgColor())}>
              <Icon className="h-6 w-6" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
