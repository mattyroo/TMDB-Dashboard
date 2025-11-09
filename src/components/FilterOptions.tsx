interface FilterOption {
  value: string;
  label: string;
}

interface FilterOptionsProps {
  options: FilterOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

export default function FilterOptions({ options, selectedValue, onSelect }: FilterOptionsProps) {
  return (
    <div className="flex items-center space-x-3">
      <div className="flex space-2 flex-wrap w-full my-2 space-x-0 sm:space-x-1 flex-col sm:flex-row space-y-1 sm:space-y-0">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            className={`px-4 py-2 transition-colors grow ${
              selectedValue === option.value
                ? 'bg-primary text-black font-extrabold'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 font-medium'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
