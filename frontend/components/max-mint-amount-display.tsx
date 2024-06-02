'use client';

import { Loader2 } from 'lucide-react';

interface MaxMintAmountDisplayProps {
  maxMintAmount: number | null;
}

export default function MaxMintAmountDisplay({ maxMintAmount }: MaxMintAmountDisplayProps) {
  return (
    <div className="bg-primary-foreground py-2 px-4 rounded-lg mr-4 shadow-inner">
      {maxMintAmount !== null ? (
        <p>{`Max Mint Amount: ${maxMintAmount}`}</p>
      ) : (
        <div className="flex items-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <p>Loading max mint amount...</p>
        </div>
      )}
    </div>
  );
}
