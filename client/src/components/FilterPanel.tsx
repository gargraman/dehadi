import { useState } from 'react';
import { FilterList } from '@mui/icons-material';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';

const skillCategories = [
  'Mason', 'Carpenter', 'Electrician', 'Plumber', 'Painter', 'Welder', 'Helper'
];

const distanceOptions = [
  { label: '2 km', value: 2 },
  { label: '5 km', value: 5 },
  { label: '10 km', value: 10 },
  { label: '25 km', value: 25 },
];

export default function FilterPanel() {
  const [open, setOpen] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [wageRange, setWageRange] = useState([500, 2000]);
  const [selectedDistance, setSelectedDistance] = useState(10);

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleApply = () => {
    console.log('Filters applied:', { selectedSkills, wageRange, selectedDistance });
    setOpen(false);
  };

  const handleClear = () => {
    setSelectedSkills([]);
    setWageRange([500, 2000]);
    setSelectedDistance(10);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="h-12 w-12" data-testid="button-filters">
          <FilterList sx={{ fontSize: 24 }} />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh]">
        <SheetHeader className="text-left">
          <SheetTitle className="text-xl">Filters</SheetTitle>
          <SheetDescription>Refine your search results</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6 overflow-y-auto max-h-[calc(85vh-200px)]">
          <div>
            <h3 className="font-semibold mb-3">Skills</h3>
            <div className="space-y-3">
              {skillCategories.map((skill) => (
                <div key={skill} className="flex items-center space-x-3">
                  <Checkbox
                    id={skill}
                    checked={selectedSkills.includes(skill)}
                    onCheckedChange={() => handleSkillToggle(skill)}
                    data-testid={`filter-skill-${skill.toLowerCase()}`}
                  />
                  <Label
                    htmlFor={skill}
                    className="text-base font-normal cursor-pointer flex-1"
                  >
                    {skill}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Distance</h3>
            <div className="grid grid-cols-4 gap-2">
              {distanceOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedDistance(option.value)}
                  className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                    selectedDistance === option.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-card text-foreground'
                  }`}
                  data-testid={`filter-distance-${option.value}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">
              Daily Wage Range: ₹{wageRange[0]} - ₹{wageRange[1]}
            </h3>
            <Slider
              value={wageRange}
              onValueChange={setWageRange}
              min={500}
              max={2000}
              step={50}
              className="mt-4"
              data-testid="filter-wage-slider"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>₹500</span>
              <span>₹2000</span>
            </div>
          </div>
        </div>

        <SheetFooter className="mt-6 gap-3">
          <Button
            variant="outline"
            onClick={handleClear}
            className="flex-1"
            data-testid="button-clear-filters"
          >
            Clear All
          </Button>
          <Button
            onClick={handleApply}
            className="flex-1"
            data-testid="button-apply-filters"
          >
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
