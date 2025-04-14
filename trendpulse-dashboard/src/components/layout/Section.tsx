import React from 'react';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <section className="mb-10">
    <h2 className="text-2xl font-semibold mb-4">{title}</h2>
    <div>{children}</div>
  </section>
);

export default Section;