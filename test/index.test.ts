import { fileURLToPath } from 'url'
import { expect, it, describe } from 'vitest'
import { loadConfig } from '../src'

describe('c12', () => {
  const r = path => fileURLToPath(new URL(path, import.meta.url))

  it('load fixture config', async () => {
    const { config, layers } = await loadConfig({
      cwd: r('./fixture'),
      dotenv: true,
      overrides: {
        overriden: true
      },
      defaults: {
        defaultConfig: true
      }
    })

    expect(config).toMatchObject({
      configFile: true,
      rcFile: true,
      defaultConfig: true,
      overriden: true,
      baseConfig: true,
      devConfig: true,
      colors: {
        primary: 'user_primary',
        secondary: 'theme_secondary',
        text: 'base_text'
      }
    })

    expect(layers).toMatchObject([
      {
        config: {
          colors: {
            primary: 'theme_primary',
            secondary: 'theme_secondary'
          }
        },
        configFile: r('./fixture/theme/config.ts'),
        cwd: r('./fixture/theme')
      },
      {
        config: {
          baseConfig: true,
          colors: {
            primary: 'base_primary',
            text: 'base_text'
          }
        },
        configFile: r('./fixture/base/config.ts'),
        cwd: r('./fixture/base')
      },
      {
        config: { devConfig: true },
        configFile: r('./fixture/config.dev.ts'),
        cwd: r('./fixture')
      }
    ])
  })

  it('extend from git repo', async () => {
    const { config } = await loadConfig({
      cwd: r('./fixture/new_dir'),
      overrides: {
        extends: ['github:unjs/c12/test/fixture']
      }
    })

    expect(config).toMatchObject({
      devConfig: true,
      baseConfig: true,
      colors: {
        primary: 'user_primary',
        text: 'base_text',
        secondary: 'theme_secondary'
      },
      configFile: true,
      overriden: false
    })
  })
})
