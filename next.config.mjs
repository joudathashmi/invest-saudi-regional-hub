/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    // The design-system bundle references its logos at /_blob/<id> (no file
    // extension). The files are served from public/_blob unchanged; this only
    // sets the content type so browsers render them as SVG.
    return [
      {
        source: '/_blob/:id',
        headers: [
          { key: 'Content-Type', value: 'image/svg+xml' },
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default nextConfig;
