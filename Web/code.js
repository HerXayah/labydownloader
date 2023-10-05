async function kek() {
  Gluon.ipc['download']('araara');
  value.textContent = await Gluon.ipc.send('get good');
}

async function submitLabyVersion() {
  // make #selectionContainer visible
  document.getElementById('selectionContainer').style.display = 'block';
  // wa
}

async function submitVersion() {
  let selection = document.getElementsByName('mcVersion');
  for (i = 0; i < selection.length; i++) {
    if (selection[i].checked) {
      console.log(selection[i].value);
      Gluon.ipc['determineVersions'](selection[i].value);
    }
  }
  console.log(Gluon.ipc.send('yeet'));
  document.getElementById('selectionContainer').style.display = 'block';
  prepareMCVersions();
}

function prepareLabyVersions() {
  Gluon.ipc.send('populate');

  // Get the selectionContainer element
  var selectionContainer = document.getElementById('labyChannelSelector');

  // add a button to submit the version
  var button = document.createElement('button');
  button.className = 'btn btn-primary';
  button.type = 'button';
  button.onclick = submitVersion;
  button.textContent = 'Submit';
  selectionContainer.appendChild(button);

  // Initialize an empty versionData array
  var versionData = [];

  console.log('ROFLFF');

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
        radioInput.name = 'mcVersion';
        radioInput.id = versionData[i].id;
        radioInput.value = versionData[i].value;

        var radioLabel = document.createElement('label');
        radioLabel.className = 'form-check-label';
        radioLabel.htmlFor = versionData[i].id;
        radioLabel.textContent = versionData[i].label;

        radioDiv.appendChild(radioInput);
        radioDiv.appendChild(radioLabel);

        var button = document.createElement('button');
        button.className = 'btn btn-primary';
        button.type = 'button';
        button.onclick = submitVersion;

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

   // add a button to submit the version
   var button = document.createElement('button');
   button.className = 'btn btn-primary';
   button.type = 'button';
   button.onclick = submitVersion;
   button.textContent = 'Submit';
   selectionContainer.appendChild(button);
 
   // Initialize an empty versionData array
   var versionData = [];

   console.log('ROFLFF')
 
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
 
         var button = document.createElement('button');
         button.className = 'btn btn-primary';
         button.type = 'button';
         button.onclick = Gluon.ipc.send('yeet');
 
         selectionContainer.appendChild(radioDiv);
       }
     })
     .catch(function (error) {
       // Handle any errors here
       console.error(error);
     });
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
