import { useState } from 'react';
import { Search, Mic, Close } from '@mui/icons-material';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onVoiceSearch?: () => void;
  className?: string;
}

export default function SearchBar({ 
  placeholder = 'Search for jobs, skills, or location...', 
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

  const handleClear = () => {
    setQuery('');
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" sx={{ fontSize: 20 }} />
          <Input
            type="search"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10 pr-10 h-12 text-base"
            data-testid="input-search"
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              data-testid="button-clear-search"
            >
              <Close sx={{ fontSize: 20 }} />
            </button>
          )}
        </div>
        <Button
          size="icon"
          variant="outline"
          onClick={onVoiceSearch || (() => console.log('Voice search activated'))}
          className="h-12 w-12 shrink-0"
          data-testid="button-voice-search"
        >
          <Mic sx={{ fontSize: 24 }} />
        </Button>
      </div>
    </div>
  );
}
