import { useState } from 'react';
import { Search, Mic } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onVoiceSearch?: () => void;
  className?: string;
}

export default function SearchBar({
  placeholder = 'काम या जगह मिलेगा...',
  onSearch,
  onVoiceSearch,
  className = ''
}: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (onSearch && query.trim()) {
      onSearch(query);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-3">
        {/* Large, Easy to Use Search Input */}
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={24}
          />
          <Input
            type="search"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-12 h-16 text-lg rounded-2xl border-2 border-gray-300 focus:border-blue-500 bg-white shadow-sm"
            data-testid="input-search"
          />
        </div>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          className="h-16 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl shadow-lg"
          data-testid="button-search"
        >
          <Search size={24} />
        </Button>
      </div>

      {/* Voice Search Instructions */}
      <div className="text-center mt-3">
        <p className="text-sm text-gray-600">
          🎤 माइक बटन दबाकर बोलें | Press mic button and speak
        </p>
      </div>
    </div>
  );
}
