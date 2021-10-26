import json from 'rollup-plugin-json';
import typescript from 'rollup-plugin-typescript2';

export default [
  {
    input: 'packages/core/src/index.ts',
    output: [
      {
        file: 'packages/core/dist/index.esm.js',
        format: 'esm',
        sourcemap: true,
      },
      {
        file: 'packages/core/dist/index.js',
        format: 'cjs',
        exports: 'named',
        sourcemap: true,
      },
    ],
    plugins: [
      typescript({
        tsconfig: 'packages/core/tsconfig.json',
      }),
    ],
    external: (id) => !id.startsWith('.') && !id.endsWith('.ts'),
  },
  {
    input: 'packages/local-server/src/index.ts',
    output: [
      {
        file: 'packages/local-server/dist/index.esm.js',
        format: 'esm',
        sourcemap: true,
      },
      {
        file: 'packages/local-server/dist/index.js',
        format: 'cjs',
        exports: 'named',
        sourcemap: true,
      },
    ],
    plugins: [
      json(),
      typescript({
        tsconfig: 'packages/local-server/tsconfig.json',
      }),
    ],
    external: (id) => !id.startsWith('.') && !id.endsWith('.ts'),
  },
];
