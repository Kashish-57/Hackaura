import React, { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignUpForm } from '@/components/auth/SignUpForm'; // <-- Import the SignUpForm

export function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-calm via-background to-serene flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            MindfulMe
          </h1>
          <p className="text-muted-foreground">
            Your personal wellness companion
          </p>
        </div>
        
        {/* Conditionally render the correct form */}
        {isSignUp ? (
          <SignUpForm onSwitchToSignIn={() => setIsSignUp(false)} />
        ) : (
          <LoginForm onSwitchToSignUp={() => setIsSignUp(true)} />
        )}
      </div>
    </div>
  );
}