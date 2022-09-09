module.exports = {
  networks: {
    // for truffle develop
    develop: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*'
    }
  },

  compilers: {
    solc: {
      version: '0.8.16',
      settings: {
        optimizer: {
          enabled: true
        }
      }
    }
  }
};
