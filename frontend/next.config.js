/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "standalone",
	webpack: (config, { isServer }) => {
		config.resolve.alias = {
			...config.resolve.alias,
			"../../contract": "/tmp/build/contract",
		};
		return config;
	},
};

module.exports = nextConfig;
