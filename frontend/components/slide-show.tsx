"use client";

import Image from "next/image";
import Slider from "react-slick";

const images = ["/image/pet-nft-1.jpeg", "/image/pet-nft-2.jpeg"];

const settings = {
	arrows: false,
	dots: false,
	fade: true,
	infinite: true,
	slidesToShow: 1,
	slidesToScroll: 1,
	autoplay: true,
	autoplaySpeed: 4000,
};

export default function Slideshow() {
	return (
		<div className="w-full h-auto">
			<Slider {...settings}>
				{images.map((src, index) => (
					<div key={index}>
						<Image
							src={src}
							alt={`NFT Image ${index + 1}`}
							width={400}
							height={400}
							className="rounded-lg shadow-lg"
						/>
					</div>
				))}
			</Slider>
		</div>
	);
}
