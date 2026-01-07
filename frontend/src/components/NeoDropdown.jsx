import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const NeoDropdown = ({ options, value, onChange, label = "Select" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div className="relative w-48 font-heading" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`
          w-full flex items-center justify-between px-4 py-3
          border-2 border-black dark:border-white
          bg-white dark:bg-alphonse-surface
          text-alphonse-charcoal dark:text-alphonse-cream
          font-bold uppercase tracking-wider
          transition-all duration-200
          ${isOpen ? 'shadow-none translate-x-[2px] translate-y-[2px]' : 'shadow-neo dark:shadow-neo-light'}
          focus:outline-none
        `}
            >
                <span className="truncate">
                    {selectedOption ? selectedOption.label : label}
                </span>
                {isOpen ? (
                    <ChevronUp className="w-5 h-5 ml-2 border-l-2 border-black pl-1 dark:border-white" />
                ) : (
                    <ChevronDown className="w-5 h-5 ml-2 border-l-2 border-black pl-1 dark:border-white" />
                )}
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white dark:bg-alphonse-surface border-2 border-black dark:border-white shadow-neo dark:shadow-neo-light max-h-60 overflow-y-auto">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            onClick={() => handleSelect(option.value)}
                            className={`
                px-4 py-3 cursor-pointer
                font-bold uppercase tracking-wider text-sm
                border-b-2 border-black dark:border-white last:border-b-0
                hover:bg-alphonse-blue hover:text-white
                dark:hover:bg-alphonse-yellow dark:hover:text-alphonse-charcoal
                transition-colors
                ${value === option.value ? 'bg-gray-100 dark:bg-gray-800' : ''}
                text-alphonse-charcoal dark:text-alphonse-cream
              `}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NeoDropdown;
