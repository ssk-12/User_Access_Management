import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import softwareService from '../../services/softwareService';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  accessLevels: z.array(z.string()).min(1, 'At least one access level is required'),
});

export default function AddSoftwareForm({ onSuccess, onCancel }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      accessLevels: ['Read'],
    },
  });

  const accessLevelOptions = [
    { id: 'read', label: 'Read', value: 'Read' },
    { id: 'write', label: 'Write', value: 'Write' },
    { id: 'admin', label: 'Admin', value: 'Admin' },
  ];

  async function onSubmit(data) {
    setIsSubmitting(true);
    setError('');
    
    try {
      await softwareService.createSoftware(data);
      onSuccess();
    } catch (error) {
      setError(
        error.response?.data?.message || 
        'Failed to add software. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Software name" {...field} />
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
                <Input placeholder="Software description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-2">
          <Label>Access Levels</Label>
          <div className="space-y-3">
            {accessLevelOptions.map((option) => (
              <FormField
                key={option.id}
                control={form.control}
                name="accessLevels"
                render={({ field }) => {
                  return (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={option.id}
                        checked={field.value?.includes(option.value)}
                        onCheckedChange={(checked) => {
                          const updatedValue = [...field.value];
                          if (checked) {
                            updatedValue.push(option.value);
                          } else {
                            const index = updatedValue.indexOf(option.value);
                            if (index !== -1) {
                              updatedValue.splice(index, 1);
                            }
                          }
                          field.onChange(updatedValue);
                        }}
                      />
                      <Label htmlFor={option.id} className="cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  );
                }}
              />
            ))}
          </div>
          {form.formState.errors.accessLevels && (
            <p className="text-sm font-medium text-red-500">
              {form.formState.errors.accessLevels.message}
            </p>
          )}
        </div>
        
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Software'}
          </Button>
        </div>
      </form>
    </Form>
  );
} 