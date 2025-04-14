import React from 'react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => (
  <header className="text-center mb-6">
    <h1 className="text-3xl font-bold">{title}</h1>
  </header>
);

export default Header;