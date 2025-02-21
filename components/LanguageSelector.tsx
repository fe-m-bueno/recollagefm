'use client';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CustomSelect from './CustomSelect';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en'); // Fallback padrão

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'pt-br', label: 'Português do Brasil' },
    { value: 'es', label: 'Español' },
  ];

  useEffect(() => {
    const detectedLang = i18n.language.toLowerCase();

    const matchedLang =
      languageOptions.find((opt) => detectedLang.startsWith(opt.value))
        ?.value || 'en';
    setSelectedLanguage(matchedLang);
  }, [i18n.language]);

  const handleChange = (value: string) => {
    setSelectedLanguage(value);
    i18n.changeLanguage(value);
  };

  return (
    <CustomSelect
      value={selectedLanguage}
      onChange={handleChange}
      options={languageOptions}
      menuPlacement="bottom"
    />
  );
};

export default LanguageSelector;
