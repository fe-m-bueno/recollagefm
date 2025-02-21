'use client';
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';
import { Check, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import React from 'react';

interface Option<T> {
  value: T;
  label: string;
}

interface CustomSelectProps<T> {
  value: T;
  onChange: (value: T) => void;
  options: Option<T>[];
  labelKey?: string;
  menuPlacement?: 'top' | 'bottom';
}

const CustomSelect = <T extends string | number>({
  value,
  onChange,
  options,
  labelKey,
  menuPlacement = 'bottom',
}: CustomSelectProps<T>) => {
  const { t } = useTranslation();

  return (
    <div className="relative w-full ~text-[0.7rem]/base text-nowrap">
      {labelKey && <label className="block mb-2 pl-3">{t(labelKey)}</label>}
      <Listbox value={value} onChange={onChange}>
        <ListboxButton className="w-full flex justify-between items-center dark:bg-black/25 bg-white/80 backdrop-blur-sm border dark:border-white/10 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-white/50">
          {options.find((o) => o.value === value)?.label}
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </ListboxButton>

        <ListboxOptions
          anchor={menuPlacement === 'top' ? 'top' : 'bottom'}
          transition
          className={`[--anchor-gap:2px] sm:[--anchor-gap:4px] ${
            menuPlacement === 'top'
              ? 'origin-bottom-center'
              : 'origin-top-center'
          } transition duration-200 ease-out [--anchor-] absolute dark:bg-black/65 bg-white/65 backdrop-blur-md w-[var(--button-width)] dark:text-white border dark:border-white/10 border-black/10 rounded shadow-lg z-10 data-[closed]:scale-95 data-[closed]:opacity-0`}
        >
          {options.map((option) => (
            <ListboxOption
              key={option.value}
              value={option.value}
              className="cursor-pointer select-none px-4 py-2 data-[focus]:bg-blue-600 data-[focus]:text-white"
            >
              {({ selected }) => (
                <div className="flex items-center justify-between ~text-[0.5rem]/base">
                  {option.label}
                  {selected && <Check className="~h-2/4 ~w-2/4 text-white" />}
                </div>
              )}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </div>
  );
};

export default CustomSelect;
