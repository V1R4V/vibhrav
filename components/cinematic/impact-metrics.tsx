import type { ImpactMetric } from "@/lib/portfolio-data"
import "./impact-metrics.css"

/** Keep the measure and its scope together, including in server-rendered HTML. */
export function ImpactMetrics({ metrics, title }: { metrics?: ImpactMetric[]; title: string }) {
  if (!metrics?.length) return null
  return (
    <dl className="impact-metrics" aria-label={`${title} results`} data-impact>
      {metrics.map(metric => <div key={metric.label}>
        <dt>{metric.label}</dt>
        <dd><strong>{metric.value}</strong>{metric.context && <span>{metric.context}</span>}</dd>
      </div>)}
    </dl>
  )
}
