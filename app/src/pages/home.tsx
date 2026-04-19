import React, { useEffect, useState } from 'react';
import './styles/home.scss';
import { services, TabOption } from './services';
import { valueCards } from './valueCards';
import { strings } from './strings';
import classNames from 'classnames';
import { useLocation } from 'react-router-dom';

export const HOME_ID = 'home';
export const ABOUT_ID = 'about-us';
export const SERVICES_ID = 'services';
export const VALUE_ID = 'value-delivered';
export const CONTACT_ID = 'contact-us';

const Home: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<TabOption>(TabOption.Services);
  const filteredServices = services.filter((service) => service.type === selectedTab);

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.replace('#', '');
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [location]);

  return (
    <div className="site-wrapper">
      <div className="content-container nav-section" id={HOME_ID}>
        <div className="home-container">
          <img className="home-bg-image" src={require('../assets/tmg_first_page.jpg')} alt="Warehouse with tools" />
          <div className="home-text">
              <h1>{strings.home.title}</h1>
              <p>{strings.home.description1}</p>
              <p>{strings.home.description2}</p>
            </div>
        </div>

        <div className="services-container nav-section" id={SERVICES_ID}>
          <section>
            <h2 className="services-h2">{strings.services.title}</h2>
            <div className="services-tabs">
              {Object.values(TabOption).map((tab) => (
                <button key={tab} className={classNames('tab', { active: selectedTab === tab })} onClick={() => setSelectedTab(tab)}>
                  {tab}
                </button>
              ))}
            </div>

            <div className="service-grid">
              {filteredServices.map((service, index) => (
                <div key={index} className="service-card">
                  <div className="service-card-image">
                    <img src={service.image} alt={`${service.title} thumbnail`} />
                  </div>
                  <div className="service-card-content">
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="about-container nav-section" id={VALUE_ID}>
          {valueCards.map((card, index) => (
            <div key={index} className="value-card">
              <img src={card.image} alt={card.title} className="value-card-bg" />
              <div className="value-card-content">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="about-container nav-section" id={ABOUT_ID}>
          <h2 className="about-h2">{strings.aboutUs.title}</h2>
          <div className="pillar-grid">
            <div className="pillar">
              <h3 className="pillar-title">{strings.aboutUs.pillar1.title}</h3>
              <div className="pillar-box">
                <p>{strings.aboutUs.pillar1.text}</p>
              </div>
            </div>
            <div className="pillar">
              <h3 className="pillar-title">{strings.aboutUs.pillar2.title}</h3>
              <div className="pillar-box">
                <p>{strings.aboutUs.pillar2.text}</p>
              </div>
            </div>
            <div className="pillar">
              <h3 className="pillar-title">{strings.aboutUs.pillar3.title}</h3>
              <div className="pillar-box">
                <p>{strings.aboutUs.pillar3.text}</p>
              </div>
            </div>
          </div>
        </div>

              <footer className="footer">
        <div className="footer-container">
            <section className="contact-section nav-section" id={CONTACT_ID}>
              <div>
                📞 <a href={`tel:${strings.contact.phone}`}>{strings.contact.phone}</a>
              </div>
              <div className="linkedin-link">
                <img
                  src={require('../assets/linkedIn.png')}
                  alt="LinkedIn"
                  className="linkedin-icon"
                  style={{ height: '16px', width: '16px' }}
                />{' '}
                <a
                  href="https://www.linkedin.com/company/tooling-management-group"
                  target="_blank"
                  rel="noopener·noreferrer"
                >
                  Join us on LinkedIn
                </a>
              </div>
              <div>
                ✉️ <a href={strings.contact.emailLink}>{strings.contact.email}</a>
              </div>
              <div>{strings.contact.address}</div>
            </section>
            <div className="footer-info">
              <h3>{strings.footer.company}</h3>
              <p>{strings.footer.copyright}</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
