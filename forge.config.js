const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const path = require('path');

module.exports = {
  packagerConfig: {
    executableName: "badge-scanner",
    asar: true,
    //icon: path.join(process.cwd(), 'main', 'images', 'icon'),
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      executableName: "badge-scanner",
      config: {
        options: {
          name: 'badge-scanner',
          productName: 'badge-scanner'
          //icon: path.join(process.cwd(), 'main', 'images', 'icon.png'),
        },
      }
    },
    {
      name: '@electron-forge/maker-zip',
      executableName: "badge-scanner",
      platforms: ['darwin'],
      config: {
        options: {
          name: 'badge-scanner',
          productName: 'badge-scanner'
          //icon: path.join(process.cwd(), 'main', 'images', 'icon.png'),
        },
      }
    },
    {
      name: '@electron-forge/maker-deb',
      executableName: "badge-scanner",
      config: {
        options: {
          name: 'badge-scanner',
          productName: 'badge-scanner'
          //icon: path.join(process.cwd(), 'main', 'images', 'icon.png'),
        },
      }
    },
    {
      name: '@electron-forge/maker-rpm',
      executableName: "badge-scanner",
      config: {
        options: {
          name: 'badge-scanner',
          productName: 'badge-scanner'
          //icon: path.join(process.cwd(), 'main', 'images', 'icon.png'),
        },
      }
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'delimitertech',
          name: 'electron-starter'
        },
        prerelease: true
      }
    }
  ]
};
