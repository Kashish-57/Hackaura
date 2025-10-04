import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client'; // Adjust path if needed
import { ProfileData } from '@/integrations/supabase/types'; // Adjust path if needed

interface SignUpFormProps {
  onSwitchToSignIn: () => void;
}

// Extend the ProfileData type to include student_email as optional
interface ExtendedProfileData extends Partial<ProfileData> {
  password: string;
  user_type: 'student' | 'therapist' | 'parent';
}


export function SignUpForm({ onSwitchToSignIn }: SignUpFormProps) {
  const [formData, setFormData] = useState<ExtendedProfileData>({
    user_type: 'student',
    display_name: '',
    email: '',
    password: '',
    student_email: '',
  });

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUserTypeChange = (value: 'student' | 'therapist' | 'parent') => {
    setFormData(prev => ({ ...prev, user_type: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare payload: remove student_email if not a parent
      const payload = { ...formData };
      if (formData.user_type !== 'parent') {
        delete payload.student_email;
      }

      const { error } = await supabase.functions.invoke('custom-signup', {
        /*body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },*/
        // In SignUpForm.tsx
        body: payload, // Simply pass the JavaScript object directly

      });


      if (error) throw error;

      toast({
        title: 'Account created successfully!',
        description: 'You can now sign in with your new credentials.',
      });

      onSwitchToSignIn();
    } catch (error: any) {
      const errorMessage =
        error.context?.body?.error || error.message || 'An unexpected error occurred.';

      toast({
        title: 'Sign-up Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create an Account</CardTitle>
        <CardDescription>Join your wellness journey today</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User Type Selector */}
          <div className="space-y-2">
            <Label>I am a:</Label>
            <Select
              onValueChange={handleUserTypeChange}
              defaultValue={formData.user_type}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="therapist">Therapist</SelectItem>
                <SelectItem value="parent">Parent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Common Fields */}
          <div className="space-y-2">
            <Label htmlFor="display_name">Full Name</Label>
            <Input
              id="display_name"
              name="display_name"
              value={formData.display_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Conditional Field: Parent's Child Email */}
          {formData.user_type === 'parent' && (
            <div className="space-y-2">
              <Label htmlFor="student_email">Your Child's Email Address</Label>
              <Input
                id="student_email"
                name="student_email"
                type="email"
                value={formData.student_email}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Button variant="link" onClick={onSwitchToSignIn}>
            Already have an account? Sign in
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
