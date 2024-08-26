"use client";

import Image from "next/image";
import Slider from "react-slick";

const images = [
	{ id: "pet-nft-1", src: "/image/pet-nft-1.jpeg" },
	{ id: "pet-nft-2", src: "/image/pet-nft-2.jpeg" },
];

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
				{images.map((image) => (
					<div key={image.id}>
						<Image
							src={image.src}
							alt={`NFT Image ${image.id}`}
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
