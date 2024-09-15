'use client';
import { motion, useAnimation } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import Section from './section';

interface FeatureCardProps {
  id: string;
  imageSrc?: string;
  title: string;
  description: string;
  link?: string;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  id,
  imageSrc,
  title,
  description,
  link,
  index,
}) => {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controls.start({ opacity: 1, y: 0 });
        } else {
          controls.start({ opacity: 0, y: 50 });
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [controls]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="border relative rounded-md p-6 shadow-sm space-y-3"
    >
      <div className="aspect-video">
        {imageSrc ? (
          <Image src={imageSrc} alt={title} width={640} height={360} />
        ) : (
          <div className="bg-muted flex items-center justify-center h-full">
            <p>Coming Soon...</p>
          </div>
        )}
      </div>
      <h2 className="font-bold">
        {title}
        {link && <Link href={link} className="absolute inset-0" />}
      </h2>
      <p>{description}</p>
    </motion.div>
  );
};

export default function Features() {
  const features: Omit<FeatureCardProps, 'index'>[] = [
    {
      id: 'erc721-minting',
      imageSrc: '/image/mint-banner.png',
      title: 'NFT Minting of ERC721',
      description: 'NFTをミントできます',
      link: '/mint',
    },
    {
      id: 'gasless-erc721-minting',
      imageSrc: '/image/gasless-mint-banner.png',
      title: 'Gasless NFT Minting of ERC721',
      description: 'ガス代なしでNFTをミントできます',
      link: '/gasless-mint',
    },
    {
      id: 'sbt-minting',
      title: 'SBT Minting of ERC721',
      description: 'SBTのNFTをミントできます',
    },
    {
      id: 'whitelisted-minting',
      title: 'Whitelisted NFT Minting of ERC721',
      description: 'ホワイトリスト登録者のみNFTをミントできます',
    },
  ];

  return (
    <Section title="Features" subTitle="Various NFT Minting">
      <div className="grid lg:grid-cols-3 gap-4">
        {features.map((feature, index) => (
          <FeatureCard key={feature.id} {...feature} index={index} />
        ))}
      </div>
    </Section>
  );
}
