'use client';
import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useToast } from '@/lib/context/ToastContext';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import { LockClosedIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { validatePassword } from '@/lib/utils/validators';
import * as authApi from '@/lib/api/auth';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();
  const token = searchParams.get('token');

  const [step, setStep] = useState<'request' | 'reset'>(token ? 'reset' : 'request');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrors({ email: 'Email is required' });
      return;
    }

    setIsLoading(true);
    try {
      await authApi.requestPasswordReset(email);
      showToast('Password reset link sent to your email', 'success');
      setErrors({});
    } catch (error: any) {
      showToast(error.message || 'Failed to send reset link', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    const passwordError = validatePassword(password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await authApi.resetPassword(token!, password);
      showToast('Password reset successfully!', 'success');
      setTimeout(() => router.push('/login'), 2000);
    } catch (error: any) {
      showToast(error.message || 'Failed to reset password', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Bimba</h1>
          <p className="text-secondary-gray-600">
            {step === 'request' ? 'Reset your password' : 'Create new password'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-8">
          {step === 'request' ? (
            <form onSubmit={handleRequestReset} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                icon={<EnvelopeIcon className="w-5 h-5" />}
              />
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                isLoading={isLoading}
              >
                Send Reset Link
              </Button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <Input
                label="New Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                helperText="Min 8 characters with uppercase, lowercase, and number"
                icon={<LockClosedIcon className="w-5 h-5" />}
              />
              <Input
                label="Confirm New Password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword}
                icon={<LockClosedIcon className="w-5 h-5" />}
              />
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                isLoading={isLoading}
              >
                Reset Password
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <a
              href="/login"
              className="text-sm text-primary font-medium hover:text-primary-600"
            >
              Back to login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}