import { CalendarDays, Clock, MapPin } from 'lucide-react'
import { wedding } from '@/config/wedding'
import { FadeIn } from './FadeIn'
import { Floral, GoldDivider } from './Ornaments'

/** The venue card with a link to the exact Google Maps location. */
export function VenueSection() {
  const { venue, event, text } = wedding
  return (
    <section className="section venue" aria-labelledby="venue-title">
      <FadeIn className="venue__card">
        <Floral variant="garland" className="venue__garland" sizes="(min-width: 640px) 380px, 76vw" />
        <svg className="venue__arch" viewBox="0 0 200 120" aria-hidden="true">
          <g fill="none" stroke="url(#gold-stroke)" strokeWidth="1">
            <path d="M30 118 V60 A70 70 0 0 1 170 60 V118" />
            <path d="M42 118 V62 A58 58 0 0 1 158 62 V118" opacity=".6" />
            <path d="M100 2 v10 M94 8 h12" />
            <circle cx="100" cy="30" r="5" />
          </g>
        </svg>

        <p className="eyebrow">{text.venueEyebrow}</p>
        <h2 id="venue-title" className="venue__name">
          {venue.name}
        </h2>
        <p className="venue__locality">{venue.locality}</p>
        <GoldDivider />

        <ul className="venue__details">
          <li>
            <CalendarDays aria-hidden="true" />
            <span>
              {event.displayWeekday}, {event.displayDate}
            </span>
          </li>
          <li>
            <Clock aria-hidden="true" />
            <span>{event.displayTime}</span>
          </li>
          <li>
            <MapPin aria-hidden="true" />
            <span>
              {venue.name}, {venue.locality}, {venue.region}
            </span>
          </li>
        </ul>

        <a className="gold-button" href={venue.mapsUrl} target="_blank" rel="noopener noreferrer">
          <MapPin aria-hidden="true" />
          Open in Google Maps
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </FadeIn>
    </section>
  )
}
