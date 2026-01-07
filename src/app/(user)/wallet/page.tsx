'use client';
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { Modal } from '@/components/shared/Modal';
import { TransactionList } from '@/components/user/TransactionList';
import { useToast } from '@/lib/context/ToastContext';
import * as walletApi from '@/lib/api/wallet';
import * as withdrawalApi from '@/lib/api/withdrawals';
import { formatCurrency } from '@/lib/utils/formatters';
import { validateNigerianBankAccount } from '@/lib/utils/validators';

export default function WalletPage() {
  const { showToast } = useToast();
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawalForm, setWithdrawalForm] = useState({
    amount: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      const [walletData, txData] = await Promise.all([
        walletApi.getWallet(),
        walletApi.getTransactions({ limit: 20 }),
      ]);
      setWallet(walletData);
      setTransactions(txData.transactions);
    } catch (error) {
      console.error('Failed to load wallet data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateWithdrawal = () => {
    const newErrors: Record<string, string> = {};

    const amount = parseFloat(withdrawalForm.amount);
    if (!amount || amount <= 0) {
      newErrors.amount = 'Amount must be greater than zero';
    } else if (wallet && amount > wallet.availableBalance) {
      newErrors.amount = 'Insufficient balance';
    }

    if (!withdrawalForm.bankName) {
      newErrors.bankName = 'Bank name is required';
    }

    if (!validateNigerianBankAccount(withdrawalForm.accountNumber)) {
      newErrors.accountNumber = 'Account number must be 10 digits';
    }

    if (!withdrawalForm.accountName) {
      newErrors.accountName = 'Account name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleWithdrawal = async () => {
    if (!validateWithdrawal()) return;

    setIsSubmitting(true);
    try {
      await withdrawalApi.createWithdrawal({
        amount: parseFloat(withdrawalForm.amount),
        bankName: withdrawalForm.bankName,
        accountNumber: withdrawalForm.accountNumber,
        accountName: withdrawalForm.accountName,
      });

      showToast('Withdrawal request submitted successfully!', 'success');
      setShowWithdrawModal(false);
      setWithdrawalForm({
        amount: '',
        bankName: '',
        accountNumber: '',
        accountName: '',
      });
      await loadWalletData();
    } catch (error: any) {
      showToast(error.message || 'Failed to submit withdrawal', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Wallet</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Balance Cards */}
        <Card className="bg-gradient-to-br from-primary to-primary-700 text-white">
          <p className="text-sm opacity-90">Available Balance</p>
          <h2 className="text-4xl font-bold mt-2">
            {formatCurrency(wallet?.availableBalance || 0)}
          </h2>
        </Card>

        <Card>
          <p className="text-sm text-secondary-gray-600">Locked Balance</p>
          <h2 className="text-3xl font-bold mt-2 text-warning">
            {formatCurrency(wallet?.lockedBalance || 0)}
          </h2>
          <p className="text-xs text-secondary-gray-500 mt-2">
            Funds in pending withdrawals
          </p>
        </Card>

        <Card>
          <p className="text-sm text-secondary-gray-600">Total Balance</p>
          <h2 className="text-3xl font-bold mt-2 text-primary">
            {formatCurrency((wallet?.availableBalance || 0) + (wallet?.lockedBalance || 0))}
          </h2>
          <Button
            variant="primary"
            className="w-full mt-4"
            onClick={() => setShowWithdrawModal(true)}
            disabled={!wallet || wallet.availableBalance <= 0}
          >
            Withdraw Funds
          </Button>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <h2 className="text-2xl font-semibold mb-6">Transaction History</h2>
        <TransactionList transactions={transactions} />
      </Card>

      {/* Withdrawal Modal */}
      <Modal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        title="Withdraw Funds"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-secondary-gray-700">
              <strong>Note:</strong> Withdrawal requests have a 5-minute cancellation window
              before being submitted for admin approval.
            </p>
          </div>

          <Input
            label="Withdrawal Amount"
            type="number"
            placeholder="10000"
            value={withdrawalForm.amount}
            onChange={(e) => setWithdrawalForm({ ...withdrawalForm, amount: e.target.value })}
            error={errors.amount}
            helperText={`Available: ${formatCurrency(wallet?.availableBalance || 0)}`}
          />

          <Input
            label="Bank Name"
            type="text"
            placeholder="GTBank"
            value={withdrawalForm.bankName}
            onChange={(e) => setWithdrawalForm({ ...withdrawalForm, bankName: e.target.value })}
            error={errors.bankName}
          />

          <Input
            label="Account Number"
            type="text"
            placeholder="0123456789"
            maxLength={10}
            value={withdrawalForm.accountNumber}
            onChange={(e) => setWithdrawalForm({ ...withdrawalForm, accountNumber: e.target.value })}
            error={errors.accountNumber}
            helperText="10-digit NUBAN account number"
          />

          <Input
            label="Account Name"
            type="text"
            placeholder="John Doe"
            value={withdrawalForm.accountName}
            onChange={(e) => setWithdrawalForm({ ...withdrawalForm, accountName: e.target.value })}
            error={errors.accountName}
          />

          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowWithdrawModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleWithdrawal}
              isLoading={isSubmitting}
              className="flex-1"
            >
              Submit Withdrawal
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}