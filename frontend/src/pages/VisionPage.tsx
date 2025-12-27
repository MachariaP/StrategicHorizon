import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import TextareaAutosize from 'react-textarea-autosize';
import { useVisions, useCreateVision, useUpdateVision } from '../services/visionService';
import { useToast } from '../hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';
import { Maximize2, Minimize2, History, Target, TrendingUp } from 'lucide-react';

// Constants
const FIVE_WHYS_COUNT = 5;
const VISION_FONT_FAMILY = 'Georgia, serif';
const TEXTAREA_BASE_CLASSES = 'flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none';

// Zod validation schema - minimum 50 characters for vision statement
const visionSchema = z.object({
  north_star: z.string()
    .min(50, 'Vision statement must be at least 50 characters')
    .max(2000, 'Vision statement cannot exceed 2000 characters'),
  yearly_theme: z.string()
    .min(3, 'Theme must be at least 3 characters')
    .max(200, 'Theme cannot exceed 200 characters'),
  five_whys: z.array(z.string()).optional(),
});

type VisionFormData = z.infer<typeof visionSchema>;

const VisionPage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [manifestoMode, setManifestoMode] = useState(false);
  const [fiveWhysEdit, setFiveWhysEdit] = useState<string[]>(Array(FIVE_WHYS_COUNT).fill(''));
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
      // Initialize five whys
      if (currentVision.five_whys && currentVision.five_whys.length > 0) {
        const whys = [...currentVision.five_whys];
        while (whys.length < FIVE_WHYS_COUNT) whys.push('');
        setFiveWhysEdit(whys.slice(0, FIVE_WHYS_COUNT));
      }
    }
  }, [currentVision, reset]);

  // Handle form submission
  const onSubmit = async (data: VisionFormData) => {
    try {
      // Filter out empty five whys
      const filteredWhys = fiveWhysEdit.filter(why => why.trim().length > 0);
      
      if (currentVision) {
        // Update existing vision
        await updateVision.mutateAsync({
          id: currentVision.id,
          data: {
            north_star: data.north_star,
            yearly_theme: data.yearly_theme,
            five_whys: filteredWhys,
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
          five_whys: filteredWhys,
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

  // View Mode - Display vision with all enhancements
  if (currentVision && !isEditing) {
    // Manifesto Mode - Fullscreen presentation
    if (manifestoMode) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900 animate-gradient-xy"
        >
          <Button
            onClick={() => setManifestoMode(false)}
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
          >
            <Minimize2 className="h-6 w-6" />
          </Button>
          <div className="max-w-5xl mx-auto px-8 text-center space-y-12">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-6xl md:text-8xl font-bold text-white mb-8"
              style={{ fontFamily: VISION_FONT_FAMILY }}
            >
              {currentVision.yearly_theme}
            </motion.h1>
            <motion.blockquote
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-3xl md:text-5xl leading-relaxed text-white/90 italic"
              style={{ fontFamily: VISION_FONT_FAMILY }}
            >
              "{currentVision.north_star}"
            </motion.blockquote>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-white/70"
            >
              Year {currentVision.year}
            </motion.p>
          </div>
        </motion.div>
      );
    }

    return (
      <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-slate-900">Vision</h1>
            <div className="flex gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <History className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Vision History</SheetTitle>
                    <SheetDescription>
                      Your evolution over the years
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    {visions.length > 1 ? (
                      visions.slice(1).map((vision) => (
                        <Card key={vision.id} className="border-slate-200">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg">{vision.yearly_theme}</CardTitle>
                            <CardDescription>Year {vision.year}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-slate-600 italic line-clamp-3">
                              "{vision.north_star}"
                            </p>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500 text-center py-8">
                        No previous visions yet. Your journey starts here.
                      </p>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
              <Button onClick={() => setManifestoMode(true)} variant="outline" size="icon">
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button onClick={() => setIsEditing(true)} variant="outline">
                Edit Vision
              </Button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-hidden border-2 shadow-lg relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <svg width="100%" height="100%">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <circle cx="20" cy="20" r="1" fill="currentColor" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>
              
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b relative">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl" style={{ fontFamily: VISION_FONT_FAMILY }}>
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
              <CardContent className="p-8 relative">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                    North Star Statement
                  </h3>
                  <blockquote
                    className="text-2xl leading-relaxed text-slate-800 italic border-l-4 border-purple-500 pl-6"
                    style={{ fontFamily: VISION_FONT_FAMILY }}
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
          </motion.div>

          {/* Goal Progress Alignment Meter */}
          {currentVision.goal_count !== undefined && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="border-2">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-600" />
                    <CardTitle className="text-lg">Current Alignment</CardTitle>
                  </div>
                  <CardDescription>
                    Goals connected to this vision
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-3xl font-bold text-purple-600">
                          {currentVision.goal_count}
                        </span>
                        <span className="text-lg text-slate-600">
                          {currentVision.goal_count === 1 ? 'Goal' : 'Goals'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500">
                        {currentVision.goal_count === 0 
                          ? 'No goals linked yet. Create goals to fulfill this vision.'
                          : currentVision.goal_count === 1
                          ? '1 goal is actively working toward this North Star.'
                          : `${currentVision.goal_count} goals are actively working toward this North Star.`}
                      </p>
                    </div>
                    <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-pink-100">
                      <TrendingUp className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* 5-Whys Deep Dive Section */}
          {currentVision.five_whys && currentVision.five_whys.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-2">
                <CardContent className="pt-6">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="purpose" className="border-none">
                      <AccordionTrigger className="text-lg font-semibold">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">🎯</span>
                          <span>Deep Purpose - The 5 Whys</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-4">
                          <p className="text-sm text-slate-600 mb-6">
                            Understanding the core motivation behind your vision helps prevent drift during challenging times.
                          </p>
                          {currentVision.five_whys.map((why, index) => (
                            <div key={index} className="flex gap-4 items-start">
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-semibold text-sm">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <p className="text-slate-700 leading-relaxed">{why}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </motion.div>
          )}
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
                <TextareaAutosize
                  id="north_star"
                  placeholder="Write your vision statement here (minimum 50 characters)..."
                  minRows={4}
                  className={`${TEXTAREA_BASE_CLASSES} text-base`}
                  {...register('north_star')}
                />
                {errors.north_star && (
                  <p className="text-sm text-red-600">{errors.north_star.message}</p>
                )}
                <p className="text-xs text-slate-500">
                  Minimum 50 characters required for thoughtful reflection
                </p>
              </div>

              {/* 5-Whys Deep Purpose Section */}
              <div className="space-y-4 pt-4 border-t">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Deep Purpose - The 5 Whys (Optional)
                  </h3>
                  <p className="text-sm text-slate-600">
                    Document the layers of "why" behind your vision to prevent drift during challenging times.
                  </p>
                </div>
                {Array.from({ length: FIVE_WHYS_COUNT }, (_, index) => index).map((index) => (
                  <div key={index} className="space-y-2">
                    <label htmlFor={`why-${index}`} className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-semibold text-xs">
                        {index + 1}
                      </span>
                      Why #{index + 1}
                    </label>
                    <TextareaAutosize
                      id={`why-${index}`}
                      placeholder={`Why is this important? ${index === 0 ? '(Start with the surface reason)' : ''}`}
                      minRows={2}
                      value={fiveWhysEdit[index]}
                      onChange={(e) => {
                        const newWhys = [...fiveWhysEdit];
                        newWhys[index] = e.target.value;
                        setFiveWhysEdit(newWhys);
                      }}
                      className={`${TEXTAREA_BASE_CLASSES} text-sm focus-visible:ring-purple-500`}
                    />
                  </div>
                ))}
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
