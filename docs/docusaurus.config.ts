import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Pragmatic Angular Testing by Marmicode',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://lit.marmicode.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'marmicode', // Usually your GitHub org/user name.
  projectName: 'lit-workshop', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          path: 'instructions',
          routeBasePath: '',
          sidebarPath: './sidebars.ts',
          exclude: ['**/legacy/**'],
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Marmicode',
      logo: {
        alt: 'Marmicode',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'instructions',
          position: 'left',
          label: 'Instructions',
        },
      ],
    },

    footer: {
      links: [
        {
          title: 'Need help?',
          items: [
            {
              label: '🚀 Audit / Coaching / Training',
              href: 'https://marmicode.io/services',
            },
          ],
        },
        {
          title: 'Learn',
          items: [
            {
              label: '🎥 Pragmatic Angular Testing Course (50% off)',
              href: 'https://courses.marmicode.io/courses/pragmatic-angular-testing?utm_source=cookbook&utm_medium=footer',
            },
            {
              label: '👨🏻‍🏫 Workshops',
              href: 'https://marmicode.io/workshops',
            },
            {
              label: '📚 Blog',
              href: 'https://marmicode.io',
            },
          ],
        },
        {
          title: 'Stay tuned',
          items: [
            {
              label: '💌 Newsletter',
              href: 'https://marmicode.us3.list-manage.com/subscribe?u=915d6ba70c9c00912ba326214&id=71255f30c7',
            },
            {
              label: '📺 Youtube',
              href: 'https://www.youtube.com/marmicode',
            },
            {
              label: '🦋 Bluesky',
              href: 'https://bsky.app/profile/younes.marmico.de',
            },
            {
              label: 'X',
              href: 'https://x.com/yjaaidi',
            },
            {
              label: 'LinkedIn',
              href: 'https://www.linkedin.com/in/yjaaidi/',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Marmicode.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
