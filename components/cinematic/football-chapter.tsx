import Image from "next/image"
import { publicCopy } from "@/lib/portfolio-data"
import { BernabeuViewer } from "./bernabeu-viewer"
import "./football-chapter.css"

export function FootballChapter() {
  return <div className="football-chapter" aria-labelledby="football-title">
    <figure className="football-stadium">
      <BernabeuViewer />
    </figure>
    <div className="football-story">
      <div className="football-club"><Image src="/football/real-madrid-crest.png" alt="Real Madrid crest" width={64} height={64} /><span>Madridista since seven.</span></div>
      <h3 id="football-title">{publicCopy.about.personalHeading}</h3>
      <p>{publicCopy.about.personal}</p>
      <div className="football-record"><h4>{publicCopy.about.football.role}</h4><p>{publicCopy.about.football.academy}<br />{publicCopy.about.football.period}</p>
        <ul>{publicCopy.about.football.achievements.map(achievement => <li key={achievement}>{achievement}</li>)}</ul>
      </div>
    </div>
  </div>
}
