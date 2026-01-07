/**
 * Client-Side Validation Utilities
 * 
 * NOTE: These match backend validation rules
 * Backend MUST re-validate all inputs
 */

export const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  export const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number';
    }
    
    return null; // Valid
  };
  
  export const validateNigerianBankAccount = (accountNumber: string): boolean => {
    // NUBAN format: exactly 10 digits
    return /^\d{10}$/.test(accountNumber);
  };
  
  export const validateAmount = (amount: string): string | null => {
    const num = parseFloat(amount);
    
    if (isNaN(num)) {
      return 'Amount must be a valid number';
    }
    
    if (num <= 0) {
      return 'Amount must be greater than zero';
    }
    
    return null; // Valid
  };
  
  export const validateFileSize = (file: File, maxSizeMB: number): boolean => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  };
  
  export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
    return allowedTypes.includes(file.type);
  };