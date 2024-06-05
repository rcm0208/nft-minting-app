'use client';

import Slider from 'react-slick';
import Image from 'next/image';

const images = ['/pet-nft-1.jpeg', '/pet-nft-2.jpeg'];

const settings = {
  dots: false,
  fade: true,
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 5000,
};

export default function Slideshow() {
  return (
    <div className="max-w-full h-auto rounded-lg">
      <Slider {...settings}>
        {images.map((src, index) => (
          <div key={index} className="flex justify-center">
            <Image src={src} alt={`NFT Image ${index + 1}`} width={400} height={400} />
          </div>
        ))}
      </Slider>
    </div>
  );
}
