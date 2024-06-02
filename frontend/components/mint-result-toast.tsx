'use client';

import { Toaster, toast } from 'sonner';

export function MintResultToast() {
  return <Toaster richColors position="bottom-right" />;
}

export function showMintSuccessToast() {
  toast.success('Mint succeeded!');
}

export function showMintErrorToast() {
  toast.error('Mint failed. Please try again.');
}
