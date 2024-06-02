import Image from 'next/image';
import Link from 'next/link';

export default function NetworkCardlist({
  networkName,
  description,
}: {
  networkName: string;
  description: string;
}) {
  return (
    <div className="border relative rounded-md p-6 shadow space-y-3">
      <div className="aspect-video flex items-center justify-center">
        <Image
          src={`/banners/${networkName}-banner.png`}
          alt={networkName}
          width={640}
          height={360}
        />
      </div>
      <h2 className="font-bold">
        {networkName} <Link href={`/mint/${networkName}`} className="absolute inset-0"></Link>
      </h2>
      <p>{description}</p>
    </div>
  );
}
