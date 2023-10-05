async function kek() {
  Gluon.ipc['download']('araara');
  value.textContent = await Gluon.ipc.send('get good');
}

async function submitLabyVersion() {
  let selection = document.getElementsByName('LabyVersion');
  for (i = 0; i < selection.length; i++) {
    if (selection[i].checked) {
      await Gluon.ipc['determineVersions'](selection[i].value);
      console.log(selection[i].value);
      document
        .getElementById('submitButton')
        .setAttribute('onclick', 'submitVersion()');
      prepareMCVersions();
    }
  }
}

async function submitVersion() {
  let selection = document.getElementsByName('mcVersion');
  for (i = 0; i < selection.length; i++) {
    if (selection[i].checked) {
      console.log(selection[i].value);
    }
  }
}

function prepareLabyVersions() {
  Gluon.ipc.send('populate');

  // Get the selectionContainer element
  var selectionContainer = document.getElementById('labyChannelSelector');

  // Initialize an empty versionData array
  var versionData = [];

  // Fetch the data from the Promise and populate versionData
  Gluon.ipc['getLabyBuild']()
    .then(function (result) {
      // You can access the resolved value here
      for (let i = 0; i < result.length; i++) {
        versionData.push({
          value: result[i],
          label: result[i],
          disabled: false,
          id: result[i],
        });
      }

      // After populating versionData, create the elements
      for (let i = 0; i < versionData.length; i++) {
        var radioDiv = document.createElement('div');
        radioDiv.className = 'form-check';

        var radioInput = document.createElement('input');
        radioInput.className = 'form-check-input';
        radioInput.type = 'radio';
        radioInput.name = 'LabyVersion';
        radioInput.id = versionData[i].id;
        radioInput.value = versionData[i].value;

        var radioLabel = document.createElement('label');
        radioLabel.className = 'form-check-label';
        radioLabel.htmlFor = versionData[i].id;
        radioLabel.textContent = versionData[i].label;

        radioDiv.appendChild(radioInput);
        radioDiv.appendChild(radioLabel);

        selectionContainer.appendChild(radioDiv);
      }
    })
    .catch(function (error) {
      // Handle any errors here
      console.error(error);
    });
}

function prepareMCVersions() {
  // Get the selectionContainer element
  var selectionContainer = document.getElementById('selectionContainer');

  // Initialize an empty versionData array
  var versionData = [];

  // Fetch the data from the Promise and populate versionData

  Gluon.ipc['getMCBuild']()
    .then(function (result) {
      // You can access the resolved value here
      for (let i = 0; i < result.length; i++) {
        versionData.push({
          value: result[i],
          label: result[i],
          disabled: false,
          id: result[i],
        });
      }

      // After populating versionData, create the elements
      for (let i = 0; i < versionData.length; i++) {
        var radioDiv = document.createElement('div');
        radioDiv.className = 'form-check';

        var radioInput = document.createElement('input');
        radioInput.className = 'form-check-input';
        radioInput.type = 'radio';
        radioInput.name = 'mcVersion';
        radioInput.id = versionData[i].id;
        radioInput.value = versionData[i].value;

        var radioLabel = document.createElement('label');
        radioLabel.className = 'form-check-label';
        radioLabel.htmlFor = versionData[i].id;
        radioLabel.textContent = versionData[i].label;

        radioDiv.appendChild(radioInput);
        radioDiv.appendChild(radioLabel);

        selectionContainer.appendChild(radioDiv);
      }
    })
    .catch(function (error) {
      // Handle any errors here
      console.error(error);
    });
  document.getElementById('labyChannelSelector').style.display = 'none';
  document.getElementById('selectionContainer').style.display = 'grid';
}

(async () => {
  await new Promise((res) => {
    const check = () => {
      if (!window.Gluon) return setTimeout(check, 100);
      res();
    };
    check();
  });
})();
