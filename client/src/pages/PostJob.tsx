import { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { ArrowBack, Work as WorkIcon } from '@mui/icons-material';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Hammer, Zap, Wrench, PaintBucket, Users, Car, Sparkles, ChefHat, Shield } from 'lucide-react';

const workTypes = [
  { id: 'mason', name: 'Mason', icon: Hammer },
  { id: 'electrician', name: 'Electrician', icon: Zap },
  { id: 'plumber', name: 'Plumber', icon: Wrench },
  { id: 'carpenter', name: 'Carpenter', icon: Hammer },
  { id: 'painter', name: 'Painter', icon: PaintBucket },
  { id: 'helper', name: 'Helper', icon: Users },
  { id: 'driver', name: 'Driver', icon: Car },
  { id: 'cleaner', name: 'Cleaner', icon: Sparkles },
  { id: 'cook', name: 'Cook', icon: ChefHat },
  { id: 'security', name: 'Security Guard', icon: Shield },
];

const jobSchema = z.object({
  workType: z.string().min(1, 'Please select a work type'),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  location: z.string().min(3, 'Location is required'),
  wageType: z.enum(['daily', 'hourly', 'fixed']),
  wage: z.coerce.number().min(1, 'Wage is required'),
  headcount: z.coerce.number().min(1).optional().default(1),
});

type JobFormData = z.infer<typeof jobSchema>;

export default function PostJob() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      workType: '',
      title: '',
      description: '',
      location: '',
      wageType: 'daily' as const,
      wage: 0,
      headcount: 1,
    },
  });

  const postJobMutation = useMutation({
    mutationFn: async (data: JobFormData) => {
      // Get employer ID from localStorage (temporary until auth is implemented)
      const onboardingData = localStorage.getItem('onboardingData');
      const employerId = onboardingData ? JSON.parse(onboardingData).userId || 'temp-employer-id' : 'temp-employer-id';

      return await apiRequest('POST', '/api/jobs', {
        employerId,
        workType: data.workType,
        title: data.title,
        description: data.description,
        location: data.location,
        wageType: data.wageType,
        wage: data.wage,
        headcount: data.headcount,
      });
    },
    onSuccess: () => {
      toast({
        title: 'Job Posted Successfully!',
        description: 'Your job posting is now live and workers can apply.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
      navigate('/');
    },
    onError: () => {
      toast({
        title: 'Failed to Post Job',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: JobFormData) => {
    postJobMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-card-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            data-testid="button-back"
          >
            <ArrowBack sx={{ fontSize: 24 }} />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Post a Job</h1>
            <p className="text-xs text-muted-foreground">Find the right workers for your project</p>
          </div>
        </div>
      </header>

      <div className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Work Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Work Type</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="workType"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-work-type">
                            <SelectValue placeholder="Select work type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {workTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              <div className="flex items-center gap-2">
                                <type.icon className="w-4 h-4" />
                                <span>{type.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Job Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Brick Mason for Residential Project" data-testid="input-title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Describe the work, requirements, and any specific details..."
                          className="min-h-32"
                          data-testid="input-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Andheri West, Mumbai" data-testid="input-location" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Wage & Workers */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Wage & Workers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="wageType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-wage-type">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="hourly">Hourly</SelectItem>
                            <SelectItem value="fixed">Fixed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="wage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Wage (₹)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" placeholder="850" data-testid="input-wage" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="headcount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Workers Needed</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min="1" data-testid="input-headcount" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={postJobMutation.isPending}
              data-testid="button-post-job"
            >
              {postJobMutation.isPending ? 'Posting...' : 'Post Job'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
