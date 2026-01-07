'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { useToast } from '@/lib/context/ToastContext';
import { Button } from '@/components/shared/Button';
import * as authApi from '@/lib/api/auth';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const { verifyEmail } = useAuth();
  const { showToast } = useToast();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only last character
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
    setOtp(newOtp);

    // Focus last filled input or next empty
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      showToast('Please enter all 6 digits', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await verifyEmail(otpString);
      showToast('Email verified successfully!', 'success');
    } catch (error: any) {
      showToast(error.message || 'Verification failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await authApi.resendOTP();
      showToast('Verification code resent to your email', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to resend code', 'error');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Bimba</h1>
          <p className="text-secondary-gray-600">Verify your email</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-8">
          <div className="text-center mb-6">
            <p className="text-secondary-gray-700 mb-2">
              We've sent a 6-digit verification code to
            </p>
            <p className="font-medium text-primary">{email}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex gap-3 justify-center mb-6" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}                  
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-2xl font-bold border-2 border-secondary-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                />
              ))}
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mb-4"
              isLoading={isLoading}
            >
              Verify Email
            </Button>

            <div className="text-center">
              <p className="text-sm text-secondary-gray-600 mb-2">
                Didn't receive the code?
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleResend}
                isLoading={isResending}
              >
                Resend Code
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}