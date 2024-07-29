/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Required for useSearchParams https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
    missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;
