const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
 
const nextConfig = {
	experimental: {
		ppr: true,
	},
};

module.exports = withBundleAnalyzer(nextConfig);
