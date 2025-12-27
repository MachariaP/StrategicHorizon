import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Slider } from './ui/slider';
import { DatePicker } from './DatePicker';
import { useVisions } from '../services/visionService';
import { useCreateGoal, useUpdateGoal } from '../services/goalsService';
import { useToast } from '../hooks/use-toast';
import type { Goal } from '../types';

const goalSchema = z.object({
  vision: z.number({ required_error: 'Please select a vision' }),
  title: z.string().min(3, 'Title must be at least 3 characters').max(255),
  description: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'completed', 'stalled']),
  confidence_level: z.number().min(1).max(5),
  target_date: z.string().optional(),
  strategic_level: z.enum(['high', 'low']).optional(),
});

type GoalFormData = z.infer<typeof goalSchema>;

interface GoalFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal?: Goal | null;
  mode: 'create' | 'edit';
}

export const GoalFormDialog: React.FC<GoalFormDialogProps> = ({
  open,
  onOpenChange,
  goal,
  mode,
}) => {
  const { toast } = useToast();
  const { data: visions = [], isLoading: visionsLoading } = useVisions();
  const createGoal = useCreateGoal();
  const updateGoal = useUpdateGoal();

  const [confidenceLevel, setConfidenceLevel] = React.useState<number[]>([3]);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      status: 'pending',
      confidence_level: 3,
      strategic_level: 'low',
    },
  });

  const selectedVision = watch('vision');
  const selectedStatus = watch('status');
  const selectedStrategicLevel = watch('strategic_level');

  // Load goal data when in edit mode
  useEffect(() => {
    if (goal && mode === 'edit') {
      reset({
        vision: goal.vision,
        title: goal.title,
        description: goal.description,
        status: goal.status,
        confidence_level: goal.confidence_level,
        strategic_level: goal.strategic_level || 'low',
        target_date: goal.target_date,
      });
      setConfidenceLevel([goal.confidence_level]);
      if (goal.target_date) {
        setSelectedDate(new Date(goal.target_date));
      }
    } else if (mode === 'create') {
      reset({
        status: 'pending',
        confidence_level: 3,
        strategic_level: 'low',
      });
      setConfidenceLevel([3]);
      setSelectedDate(undefined);
    }
  }, [goal, mode, reset]);

  // Update confidence level in form when slider changes
  useEffect(() => {
    setValue('confidence_level', confidenceLevel[0]);
  }, [confidenceLevel, setValue]);

  // Update target date in form when date picker changes
  useEffect(() => {
    if (selectedDate) {
      setValue('target_date', selectedDate.toISOString().split('T')[0]);
    } else {
      setValue('target_date', undefined);
    }
  }, [selectedDate, setValue]);

  const onSubmit = async (data: GoalFormData) => {
    try {
      if (mode === 'create') {
        await createGoal.mutateAsync({
          vision: data.vision,
          title: data.title,
          description: data.description || '',
          status: data.status,
          confidence_level: data.confidence_level,
          target_date: data.target_date,
        });
        toast({
          title: 'Goal Created',
          description: 'Your goal has been created successfully.',
          variant: 'success',
        });
      } else {
        await updateGoal.mutateAsync({
          id: goal!.id,
          data: {
            vision: data.vision,
            title: data.title,
            description: data.description || '',
            status: data.status,
            confidence_level: data.confidence_level,
            target_date: data.target_date,
          },
        });
        toast({
          title: 'Goal Updated',
          description: 'Your goal has been updated successfully.',
          variant: 'success',
        });
      }
      onOpenChange(false);
      reset();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getConfidenceLabel = (level: number) => {
    const labels = ['Very Low', 'Low', 'Medium', 'High', 'Very High'];
    return labels[level - 1] || 'Medium';
  };

  const getConfidenceColor = (level: number) => {
    if (level === 5) return 'text-emerald-600 font-bold';
    if (level === 4) return 'text-green-600';
    if (level === 3) return 'text-blue-600';
    if (level === 2) return 'text-orange-600';
    return 'text-slate-600';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {mode === 'create' ? 'Create New Goal' : 'Edit Goal'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Define a specific, measurable milestone that supports your vision.'
              : 'Update your goal details and track your progress.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Vision Selection */}
          <div className="space-y-2">
            <Label htmlFor="vision" className="text-sm font-semibold">
              Vision <span className="text-red-500">*</span>
            </Label>
            <Select
              value={selectedVision?.toString()}
              onValueChange={(value) => setValue('vision', parseInt(value))}
              disabled={visionsLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a vision this goal supports" />
              </SelectTrigger>
              <SelectContent>
                {visions.map((vision) => (
                  <SelectItem key={vision.id} value={vision.id.toString()}>
                    <div className="flex flex-col">
                      <span className="font-medium">{vision.north_star.substring(0, 60)}...</span>
                      <span className="text-xs text-slate-500">{vision.yearly_theme}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.vision && (
              <p className="text-sm text-red-500">{errors.vision.message}</p>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-semibold">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g., Launch MVP by Q2"
              {...register('title')}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe what this goal entails and why it matters..."
              rows={4}
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* Status and Strategic Level - Side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-semibold">
                Status
              </Label>
              <Select
                value={selectedStatus}
                onValueChange={(value) => setValue('status', value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="stalled">Stalled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="strategic_level" className="text-sm font-semibold">
                Strategic Level
              </Label>
              <Select
                value={selectedStrategicLevel}
                onValueChange={(value) => setValue('strategic_level', value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">
                    <span className="font-bold">High-Level (Strategic)</span>
                  </SelectItem>
                  <SelectItem value="low">Low-Level (Tactical)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Confidence Level */}
          <div className="space-y-2">
            <Label htmlFor="confidence_level" className="text-sm font-semibold">
              Confidence Level: <span className={getConfidenceColor(confidenceLevel[0])}>{getConfidenceLabel(confidenceLevel[0])}</span>
            </Label>
            <div className="pt-2">
              <Slider
                id="confidence_level"
                min={1}
                max={5}
                step={1}
                value={confidenceLevel}
                onValueChange={setConfidenceLevel}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>1 - Very Low</span>
                <span>3 - Medium</span>
                <span>5 - Very High</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 italic">
              How confident are you that you'll achieve this goal?
            </p>
          </div>

          {/* Target Date */}
          <div className="space-y-2">
            <Label htmlFor="target_date" className="text-sm font-semibold">
              Target Date
            </Label>
            <DatePicker
              date={selectedDate}
              onDateChange={setSelectedDate}
              placeholder="Select target completion date"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Goal' : 'Update Goal'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
