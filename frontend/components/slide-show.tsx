'use client';

import Slider from 'react-slick';
import Image from 'next/image';

const images = ['/image/pet-nft-1.jpeg', '/image/pet-nft-2.jpeg'];

const settings = {
  arrows: false,
  dots: false,
  fade: true,
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
};

export default function Slideshow() {
  return (
    <div className="w-full h-auto rounded-lg">
      <Slider {...settings}>
        {images.map((src, index) => (
          <div key={index}>
            <Image src={src} alt={`NFT Image ${index + 1}`} width={400} height={400} />
          </div>
        ))}
      </Slider>
    </div>
  );
}
