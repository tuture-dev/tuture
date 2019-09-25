module.exports = {
  ga: 'UA-125714435-1',
  head: [
    [
      'link',
      { rel: 'shortcut icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
  ],
  locales: {
    '/': {
      lang: 'en-US',
      title: 'Tuture Docs',
      description: 'Everything you need to know about Tuture.',
    },
    '/zh/': {
      lang: 'zh-CN',
      title: '图雀文档',
      description: '关于图雀，你所需要知道的一切',
    },
  },
  themeConfig: {
    // Generate edit links
    docsRepo: 'tutureproject/docs',
    docsBranch: 'master',
    editLinks: true,
    locales: {
      '/': {
        selectText: 'Languages',
        label: 'English',
        editLinkText: 'Edit this page on GitHub',
        nav: [
          { text: 'Guide', link: '/guide/' },
          { text: 'Reference', link: '/reference/' },
          { text: 'GitHub', link: 'https://github.com/tutureproject/docs' },
        ],
        sidebar: {
          '/guide/': ['', 'installation', 'start-writing'],
          '/reference/': ['', 'cli-commands', 'tuture-yml-spec'],
        },
        lastUpdated: 'Last Updated',
      },
      '/zh/': {
        selectText: '选择语言',
        label: '简体中文',
        editLinkText: '在 GitHub 上编辑此页',
        nav: [
          { text: '指南', link: '/zh/guide/' },
          { text: '参考', link: '/zh/reference/' },
          { text: 'GitHub', link: 'https://github.com/tutureproject/docs' },
        ],
        sidebar: {
          '/zh/guide/': ['', 'installation', 'start-writing'],
          '/zh/reference/': ['', 'cli-commands', 'tuture-yml-spec'],
        },
        lastUpdated: '上次更新于',
      },
    },
  },
};
