import React from "react";
import "./DigipinTechnology.css";

const officialSources = [
  {
    number: "01",
    title: "India Post",
    subtitle: "Department of Posts, Government of India",
    description:
      "Leads the DIGIPIN initiative as a standardized, geo-coded addressing layer for India's digital address ecosystem.",
    url: "https://www.indiapost.gov.in/digipin",
    linkText: "Official DIGIPIN initiative",
  },
  {
    number: "02",
    title: "NRSC · ISRO",
    subtitle: "National Remote Sensing Centre",
    description:
      "Collaborates on the national geospatial addressing grid, connecting geographic coordinates with a structured location reference.",
    url: "https://www.isro.gov.in/",
    linkText: "Visit ISRO",
  },
  {
    number: "03",
    title: "IIT Hyderabad",
    subtitle: "Indian Institute of Technology Hyderabad",
    description:
      "Collaborated with the Department of Posts and NRSC, ISRO in developing the DIGIPIN addressing grid.",
    url: "https://www.iith.ac.in/",
    linkText: "Visit IIT Hyderabad",
  },
];

const steps = [
  {
    number: "01",
    title: "Geographic coordinates",
    description:
      "A location is represented by latitude and longitude coordinates.",
  },
  {
    number: "02",
    title: "Hierarchical grid",
    description:
      "India's geographic area is divided into progressively smaller grid cells.",
  },
  {
    number: "03",
    title: "10-character code",
    description:
      "A predefined encoding system converts a location into its DIGIPIN reference.",
  },
  {
    number: "04",
    title: "Digital applications",
    description:
      "The code can help reference locations in addressing, delivery and GIS-based applications.",
  },
];

export default function DigipinTechnology() {
  return (
    <section
      className="digipin-tech"
      id="digipin-technology"
      aria-labelledby="digipin-tech-title"
    >
      <div className="dpt-container">
        <header className="dpt-heading">
          <span className="dpt-eyebrow">
            INDIA'S DIGITAL ADDRESSING INFRASTRUCTURE
          </span>

          <h2 id="digipin-tech-title">
            The Technology
            <br />
            <span>Behind DIGIPIN</span>
          </h2>

          <p>
            Bridging physical locations and their digital representation through
            a standardized, geospatial addressing grid.
          </p>
        </header>

        <div className="dpt-stats" aria-label="DIGIPIN facts">
          <article className="dpt-stat">
            <span className="dpt-stat-value">~4 × 4 m</span>
            <span className="dpt-stat-label">
              Approximate grid-cell dimensions
            </span>
          </article>

          <article className="dpt-stat">
            <span className="dpt-stat-value">10 characters</span>
            <span className="dpt-stat-label">
              Alphanumeric location reference
            </span>
          </article>

          <article className="dpt-stat">
            <span className="dpt-stat-value">Open source</span>
            <span className="dpt-stat-label">
              Publicly available encoding logic
            </span>
          </article>
        </div>

        <div className="dpt-intro">
          <div className="dpt-intro-mark" aria-hidden="true">
            <span>DP</span>
            <i />
            <i />
            <i />
          </div>

          <div>
            <span className="dpt-kicker">A NATIONAL INITIATIVE</span>
            <h3>A digital reference for physical places</h3>
            <p>
              DIGIPIN is an open-source, national-level geo-coded addressing
              grid developed by the Department of Posts in collaboration with
              IIT Hyderabad and the National Remote Sensing Centre (NRSC), ISRO.
              It is designed to complement conventional addresses with a
              geographic location reference.
            </p>

            <a
              className="dpt-text-link"
              href="https://www.indiapost.gov.in/digipin"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read the official overview <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <div className="dpt-section-heading">
          <span className="dpt-kicker">COLLABORATION</span>
          <h3>Three institutions. A shared initiative.</h3>
          <p>
            Explore the institutions identified by India Post as collaborators
            in the development of DIGIPIN.
          </p>
        </div>

        <div className="dpt-partners">
          {officialSources.map((partner) => (
            <article className="dpt-partner" key={partner.number}>
              <div className="dpt-partner-top">
                <span className="dpt-partner-number">{partner.number}</span>
                <span className="dpt-partner-dot" aria-hidden="true" />
              </div>

              <h4>{partner.title}</h4>
              <span className="dpt-partner-subtitle">{partner.subtitle}</span>
              <p>{partner.description}</p>

              <a href={partner.url} target="_blank" rel="noopener noreferrer">
                {partner.linkText} <span aria-hidden="true">↗</span>
              </a>
            </article>
          ))}
        </div>

        <div className="dpt-process">
          <div className="dpt-section-heading">
            <span className="dpt-kicker">HOW THE TECHNOLOGY WORKS</span>
            <h3>From coordinates to DIGIPIN</h3>
            <p>A simplified overview of the location-encoding concept.</p>
          </div>

          <div className="dpt-steps">
            {steps.map((step) => (
              <article className="dpt-step" key={step.number}>
                <span className="dpt-step-number">{step.number}</span>
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="dpt-note">
          <span className="dpt-note-icon" aria-hidden="true">
            i
          </span>
          <p>
            A DIGIPIN identifies a geographic grid cell; it is not a personal
            identifier and does not replace a conventional postal address. The
            actual location accuracy also depends on the precision of the
            coordinates supplied.
          </p>
        </div>

        <div className="dpt-sources">
          <span className="dpt-kicker">OFFICIAL DOCUMENTATION</span>

          <a
            href="https://www.indiapost.gov.in/VAS/DOP_PDFFiles/DIGIPIN%20Technical%20document.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            DIGIPIN Technical Document <span aria-hidden="true">↗</span>
          </a>

          <a
            href="https://github.com/INDIAPOST-gov/digipin"
            target="_blank"
            rel="noopener noreferrer"
          >
            DIGIPIN Source Repository <span aria-hidden="true">↗</span>
          </a>

          <a
            href="https://dac.indiapost.gov.in/mydigipin"
            target="_blank"
            rel="noopener noreferrer"
          >
            India Post — Know Your DIGIPIN <span aria-hidden="true">↗</span>
          </a>
        </div>

        <footer className="dpt-disclaimer">
          <strong>Independent project disclaimer</strong>
          <p>
            DIGIPIN Explorer is an independent, community-built project that
            references publicly available DIGIPIN documentation and open-source
            resources. It is not an official website of, or endorsed by, India
            Post, NRSC, ISRO or IIT Hyderabad. Institutional names are used for
            factual attribution only.
          </p>
        </footer>
      </div>
    </section>
  );
}
