import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useVisions, useCreateVision, useUpdateVision } from '../services/visionService';
import { useToast } from '../hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Skeleton } from '../components/ui/skeleton';

// Zod validation schema - minimum 50 characters for vision statement
const visionSchema = z.object({
  north_star: z.string()
    .min(50, 'Vision statement must be at least 50 characters')
    .max(2000, 'Vision statement cannot exceed 2000 characters'),
  yearly_theme: z.string()
    .min(3, 'Theme must be at least 3 characters')
    .max(200, 'Theme cannot exceed 200 characters'),
});

type VisionFormData = z.infer<typeof visionSchema>;

const VisionPage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  // TanStack Query hooks
  const { data: visions = [], isLoading, error } = useVisions();
  const createVision = useCreateVision();
  const updateVision = useUpdateVision();

  // Get the most recent vision (first in the list due to ordering)
  const currentVision = visions.length > 0 ? visions[0] : null;

  // react-hook-form with zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<VisionFormData>({
    resolver: zodResolver(visionSchema),
    defaultValues: {
      north_star: currentVision?.north_star || '',
      yearly_theme: currentVision?.yearly_theme || '',
    },
  });

  // Update form when vision data loads
  React.useEffect(() => {
    if (currentVision) {
      reset({
        north_star: currentVision.north_star,
        yearly_theme: currentVision.yearly_theme,
      });
    }
  }, [currentVision, reset]);

  // Handle form submission
  const onSubmit = async (data: VisionFormData) => {
    try {
      if (currentVision) {
        // Update existing vision
        await updateVision.mutateAsync({
          id: currentVision.id,
          data: {
            north_star: data.north_star,
            yearly_theme: data.yearly_theme,
          },
        });
        toast({
          title: "Vision Updated Successfully",
          description: "Your North Star has been updated.",
          variant: "success",
        });
      } else {
        // Create new vision
        await createVision.mutateAsync({
          year: new Date().getFullYear(),
          north_star: data.north_star,
          yearly_theme: data.yearly_theme,
          time_horizon: 1,
        });
        toast({
          title: "Vision Created Successfully",
          description: "Your North Star has been created.",
          variant: "success",
        });
      }
      setIsEditing(false);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.detail || err?.message || 'Failed to save vision';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Handle 401 Unauthorized error
  if (error && 'response' in error && (error as any).response?.status === 401) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-600">Unauthorized</CardTitle>
            <CardDescription>Please log in to access your vision.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Handle 404 Not Found error (though unlikely for list endpoint)
  if (error && 'response' in error && (error as any).response?.status === 404) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-yellow-600">Not Found</CardTitle>
            <CardDescription>The vision endpoint was not found.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Skeleton loader for initial fetch
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="w-full max-w-4xl space-y-4">
          <Skeleton className="h-12 w-64" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-10 w-24" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Empty State - No vision exists
  if (!currentVision && !isEditing) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="max-w-2xl w-full text-center">
          <CardHeader className="space-y-6 pb-8">
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-5xl">
                ✨
              </div>
            </div>
            <div>
              <CardTitle className="text-3xl mb-2">Draft Your North Star</CardTitle>
              <CardDescription className="text-lg">
                Create a guiding vision to illuminate your strategic journey
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pb-8">
            <Button
              size="lg"
              onClick={() => setIsEditing(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              Create Vision
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // View Mode - Display vision
  if (currentVision && !isEditing) {
    return (
      <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-slate-900">Vision</h1>
            <Button onClick={() => setIsEditing(true)} variant="outline">
              Edit Vision
            </Button>
          </div>

          <Card className="overflow-hidden border-2 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl" style={{ fontFamily: 'Georgia, serif' }}>
                    {currentVision.yearly_theme}
                  </CardTitle>
                  <CardDescription className="text-sm mt-2">
                    Year {currentVision.year}
                  </CardDescription>
                </div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl">
                  🎯
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                  North Star Statement
                </h3>
                <blockquote
                  className="text-2xl leading-relaxed text-slate-800 italic border-l-4 border-purple-500 pl-6"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  "{currentVision.north_star}"
                </blockquote>
                <div className="pt-4 text-sm text-slate-500">
                  Last updated: {new Date(currentVision.updated_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Edit/Create Mode - Form
  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-slate-900">
            {currentVision ? 'Edit Vision' : 'Create Vision'}
          </h1>
          {currentVision && (
            <Button
              onClick={() => {
                setIsEditing(false);
                reset();
              }}
              variant="outline"
            >
              Cancel
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Vision Statement</CardTitle>
            <CardDescription>
              Define your North Star - the guiding principle that illuminates your strategic path
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Yearly Theme */}
              <div className="space-y-2">
                <label htmlFor="yearly_theme" className="text-sm font-medium text-slate-700">
                  Yearly Theme
                </label>
                <input
                  id="yearly_theme"
                  type="text"
                  placeholder="e.g., Year of Growth"
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...register('yearly_theme')}
                />
                {errors.yearly_theme && (
                  <p className="text-sm text-red-600">{errors.yearly_theme.message}</p>
                )}
              </div>

              {/* North Star Statement */}
              <div className="space-y-2">
                <label htmlFor="north_star" className="text-sm font-medium text-slate-700">
                  North Star Statement
                </label>
                <Textarea
                  id="north_star"
                  placeholder="Write your vision statement here (minimum 50 characters)..."
                  autoResize
                  className="min-h-[120px] text-base"
                  {...register('north_star')}
                />
                {errors.north_star && (
                  <p className="text-sm text-red-600">{errors.north_star.message}</p>
                )}
                <p className="text-xs text-slate-500">
                  Minimum 50 characters required for thoughtful reflection
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  {isSubmitting ? 'Saving...' : currentVision ? 'Update Vision' : 'Create Vision'}
                </Button>
                {currentVision && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      reset();
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VisionPage;
