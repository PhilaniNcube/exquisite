"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';

interface PassCodeFormProps {
  schoolId: string;
  schoolName: string;
}

const PassCodeForm = ({ schoolId, schoolName }: PassCodeFormProps) => {
  const [passCode, setPassCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!passCode.trim()) {
      setError('Please enter the pass code');
      setIsLoading(false);
      return;
    }

    // Create new URL with pass_code parameter
    const params = new URLSearchParams(searchParams);
    params.set('pass_code', passCode.trim());
    
    // Redirect with the pass code
    router.push(`/schools/${schoolId}?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Lock className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Access Required</CardTitle>
          <CardDescription>
            Please enter the pass code to view photos for {schoolName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="passCode" className="block text-sm font-medium text-gray-700 mb-2">
                Pass Code
              </label>
              <Input
                id="passCode"
                type="password"
                value={passCode}
                onChange={(e) => setPassCode(e.target.value)}
                placeholder="Enter your pass code"
                className="w-full"
                disabled={isLoading}
              />
              {error && (
                <p className="mt-2 text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Access Photos'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PassCodeForm;