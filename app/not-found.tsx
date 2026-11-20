import Link from "next/link"
import { PortfolioFrame } from "@/components/cinematic/portfolio-frame"
import "./cinematic/cinematic.css"

export default function NotFound() {
  return <PortfolioFrame><main id="introduction" tabIndex={-1} className="portfolio-missing"><p>Page not found</p><h1 data-reveal>Let’s get back<br />to the work.</h1><Link className="cinematic-primary" href="/#work">Explore selected work</Link></main></PortfolioFrame>
}
