import SearchBar from '../SearchBar';

export default function SearchBarExample() {
  return (
    <div className="p-4">
      <SearchBar 
        placeholder="Search for jobs, skills, or location..."
        onSearch={(query) => console.log('Searching for:', query)}
        onVoiceSearch={() => console.log('Voice search activated')}
      />
    </div>
  );
}
