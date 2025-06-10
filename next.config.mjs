import createMDX from '@next/mdx';
import lingoCompiler from 'lingo.dev/compiler';
import path from 'path';

if (process.platform === 'win32') {
  const orig = path.relative;
  path.relative = (...args) => orig(...args).replace(/\\/g, '/');
}
import rehypeExternalLinks from 'rehype-external-links';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  webpack: (config) => {
    config.resolve ??= {};
    config.resolve.preferRelative = true;
    return config;
  },
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/blog',
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeExternalLinks,
        {
          target: '_blank',
          rel: ['noopener noreferrer'],
        },
      ],
      [
        rehypePrettyCode,
        {
          theme: 'one-dark-pro',
        },
      ],
    ],
  },
});

// Merge MDX config with Next.js config
const withPlugins = (config) => {
  const mdx = withMDX(config);
  if (!process.env.GROQ_API_KEY) {
    console.warn('GROQ_API_KEY not set, skipping Lingo.dev compiler');
    return mdx;
  }
  return lingoCompiler.next({
    sourceLocale: 'en',
    targetLocales: ['es'],
    models: {
      '*:*': process.env.GROQ_MODEL || 'groq:mistral-saba-24b',
    },
  })(mdx);
};

export default withPlugins(nextConfig);
