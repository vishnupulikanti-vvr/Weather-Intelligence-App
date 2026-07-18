import { Lightbulb, AlertTriangle, HelpCircle, CheckCircle, Info } from "lucide-react";
import { IntelligenceRecommendation } from "../types";
import { getIconComponent } from "../utils";

interface WeatherRecommendationsProps {
  recommendations: IntelligenceRecommendation[];
}

export default function WeatherRecommendations({ recommendations }: WeatherRecommendationsProps) {
  // Styles based on recommendation type
  const getTypeStyles = (type: string) => {
    switch (type) {
      case "warning":
        return {
          container: "bg-red-500/10 border-red-500/30 text-red-200",
          iconBg: "bg-red-500/20 text-red-400",
          accentColor: "border-l-4 border-l-red-500",
          iconLabel: AlertTriangle,
        };
      case "success":
        return {
          container: "bg-emerald-500/10 border-emerald-500/30 text-emerald-200",
          iconBg: "bg-emerald-500/20 text-emerald-400",
          accentColor: "border-l-4 border-l-emerald-500",
          iconLabel: CheckCircle,
        };
      case "info":
        return {
          container: "bg-blue-500/10 border-blue-500/30 text-blue-200",
          iconBg: "bg-blue-500/20 text-blue-400",
          accentColor: "border-l-4 border-l-blue-500",
          iconLabel: Info,
        };
      default:
        return {
          container: "bg-slate-900/80 border-slate-800 text-slate-300",
          iconBg: "bg-slate-800 text-slate-400",
          accentColor: "border-l-4 border-l-slate-600",
          iconLabel: HelpCircle,
        };
    }
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700/50 transition-all space-y-4">
      {/* Title Header */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
        <Lightbulb className="h-4.5 w-4.5 text-amber-400 animate-pulse" />
        <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
          Intelligence & Recommendations
        </h3>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {recommendations.map((rec, idx) => {
          const styles = getTypeStyles(rec.type);
          const DynamicIcon = getIconComponent(rec.iconName);

          return (
            <div
              key={idx}
              className={`flex gap-4 p-4 rounded-xl border ${styles.container} ${styles.accentColor} hover:shadow-lg hover:shadow-black/10 transition-all`}
            >
              {/* Left Column: Icon container */}
              <div className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center ${styles.iconBg}`}>
                <DynamicIcon className="h-5 w-5" />
              </div>

              {/* Right Column: Descriptions */}
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  {rec.title}
                </span>
                <p className="text-xs leading-relaxed text-slate-300/90 font-light">
                  {rec.message}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
