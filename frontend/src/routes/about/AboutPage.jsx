import React from 'react';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-wrapper">
      <section className="about-hero">
        <h1>Your Trusted Partner in Real Estate</h1>
        <p>Transforming your dreams into addresses</p>
      </section>

      <section className="about-content">
        <h2>Who We Are</h2>
        <p>
          We are a forward-thinking real estate platform committed to revolutionizing the property buying, selling, and renting experience. Our goal is to make real estate simple, transparent, and accessible for everyone — from first-time buyers to experienced investors.
        </p>

        <h2>What We Offer</h2>
        <ul>
          <li>🏠 Verified property listings with rich details</li>
          <li>📞 Direct contact with property owners and agents</li>
          <li>🔍 Smart filters to find your perfect match</li>
          <li>💳 Integrated and secure payment system</li>
          <li>📱 A seamless experience across desktop and mobile</li>
        </ul>

        <h2>Our Mission</h2>
        <p>
          To empower individuals and families with the tools, knowledge, and support they need to make confident real estate decisions. We are dedicated to creating a platform that is as reliable as it is easy to use.
        </p>

        <h2>Why Choose Us?</h2>
        <p>
          Unlike traditional real estate platforms, we believe in creating value through innovation. Our tech-first approach ensures that every step of your property journey is smooth — from discovery to deal.
        </p>
      </section>
    </div>
  );
};

export default AboutPage;
