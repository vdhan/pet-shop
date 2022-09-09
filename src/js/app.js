App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    fetch('../pets.json')
      .then(res => res.json())
      .then(function (data) {
        let petsRow = document.querySelector('#petsRow');
        let petTemplate = document.querySelector('#petTemplate');

        for (let el of data) {
          petTemplate.querySelector('.panel-title').textContent = el.name;
          petTemplate.querySelector('img').setAttribute('src', el.picture);
          petTemplate.querySelector('.pet-breed').textContent = el.breed;
          petTemplate.querySelector('.pet-age').textContent = el.age;
          petTemplate.querySelector('.pet-location').textContent = el.location;
          petTemplate.querySelector('.btn-adopt').setAttribute('data-id', el.id);

          petsRow.insertAdjacentHTML('beforeend', petTemplate.innerHTML);
        }
      });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        await window.ethereum.request({method: 'eth_requestAccounts'});
      } catch (err) {
        if (err.code === 4001) {
          console.error('User denied account access');
        }
      }
    } else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');
    }

    window.web3 = new Web3(App.web3Provider);
    return App.initContract();
  },

  initContract: function() {
    fetch('Adoption.json')
      .then(res => res.json())
      .then(function (data) {
        let AdoptionArtifact = data;
        App.contracts.Adoption = TruffleContract(AdoptionArtifact);
        App.contracts.Adoption.setProvider(App.web3Provider);
        return App.markAdopted();
      });

    return App.bindEvents();
  },

  bindEvents: function() {
    document.addEventListener('click', function (event) {
      if (event.target.matches('.btn-adopt')) {
        App.handleAdopt(event);
      }
    });
  },

  markAdopted: function() {
    App.contracts.Adoption.deployed().then(function (instance) {
      let adoptionInstance = instance;

      return adoptionInstance.getAdopters.call();
    }).then(function (adopters) {
      let panelPets = document.querySelectorAll('.panel-pet');
      adopters.forEach((el, i) => {
        if (el !== '0x0000000000000000000000000000000000000000') {
          let btn = panelPets[i].querySelector('button');
          btn.textContent = 'Adopted';
          btn.setAttribute('disabled', '');
        }
      });
    }).catch(function (err) {
      console.log(err.message);
    });
  },

  handleAdopt: function(event) {
    event.preventDefault();

    let petId = parseInt(event.target.dataset.id);
    web3.eth.getAccounts(function (err, accounts) {
      if (err) {
        console.log(err.message);
      }

      let account = accounts[0];
      App.contracts.Adoption.deployed().then(function (instance) {
        let adoptionInstance = instance;
        return adoptionInstance.adopt(petId, {from: account});
      }).then(function (_) {
        return App.markAdopted();
      }).catch(function (err) {
        console.log(err.message);
      });
    });
  }
};

document.addEventListener('DOMContentLoaded', function () {
  App.init();
});
