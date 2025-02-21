'use client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import CustomSelect from './CustomSelect';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(event.target.value);
  };

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'pt-br', label: 'Português do Brasil' },
    { value: 'es', label: 'Español' },
  ];

  return (
    <CustomSelect
      value={i18n.language}
      onChange={(value) => i18n.changeLanguage(value)}
      options={languageOptions}
      menuPlacement="bottom"
    />
  );
};

export default LanguageSelector;
