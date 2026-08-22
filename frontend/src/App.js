import './index.scss';
import React, { useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Projects from './components/Projects';
import Team from './components/Team';
import Pages from './components/Pages';
import Contact from './components/Contact';

function App() {
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const servicesRef = useRef(null);
  const projectsRef = useRef(null);
  const teamRef = useRef(null);
  const pagesRef = useRef(null);
  const contactRef = useRef(null);


  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const sectionRefs = {
    home: homeRef,
    about: aboutRef,
    services: servicesRef,
    projects: projectsRef,
    team: teamRef,
    pages: pagesRef,
    contact: contactRef,
  };


  return (
    <div className="App">
      <Navbar scrollToSection={scrollToSection} sectionRefs={sectionRefs} />
      <section ref={homeRef} id="home"><Hero /></section>
      <section ref={aboutRef} id="about"><About /></section>
      <section ref={servicesRef} id="services"><Services /></section>
      <section ref={projectsRef} id="projects"><Projects /></section>
      <section ref={teamRef} id="team"><Team /></section>
      <section ref={pagesRef} id="pages"><Pages /></section>
      <section ref={contactRef} id="contact"><Contact /></section>
    </div>
  );
}

export default App;
