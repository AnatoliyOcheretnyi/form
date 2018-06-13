window.onload = () => {
  let authB   = document.getElementById("auth"),
      addB    = document.getElementById("add"),
      showB   = document.getElementById("show"),
      buttons = document.getElementById("buttons");

  let first, second, third, values = [];

  let CLIENT_ID       = '769067592560-mkjt9jv59e7sfubu69o4unp4jf4blhfq.apps.googleusercontent.com',
      API_KEY         = 'AIzaSyCWDVJH1QiU6aCxKGE14NwVnA3WD7tviZ0',
      SCOPES          = "https://www.googleapis.com/auth/spreadsheets",
      DISCOVERY_DOCS  = ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
      SHEETID         = "1jIiiMpFZT9y5zNqFDy_3421rHmmUSDNCXhQo1r8wmbM";

      gapi.load('client:auth2', function() {
        gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          scope: SCOPES
        }).then(function () {
          console.log(gapi.auth2.getAuthInstance().isSignedIn);
        });
        console.log("auth loaded");
      });

      buttons.addEventListener("click", (event) => {
  console.log(event.target.innerHTML);

  if(event.target.type === "submit"){
    switch (event.target.innerHTML) {
      case "Authorization":
        gapi.auth2.getAuthInstance().signIn();
        break;

      case "Add":
        addSomeInformation();
        break;

      case "Show":
        showInformation();
        break;

      default:
        break;
    }
  }
});

  function addSomeInformation() {
    first   = document.getElementById("firstName").value;
    second  = document.getElementById("lastname").value;
    third   = document.getElementById("middlename").value;
    values  = [[first,second,third]];

    document.getElementById("firstName").value  = "";
    document.getElementById("secondName").value = "";
    document.getElementById("middlename").value = "";

    gapi.client.sheets.spreadsheets.values.append({
      "spreadsheetId": SHEETID,
      "range": "List!A1:D3",
      "includeValuesInResponse": "false",
      "insertDataOption": "INSERT_ROWS",
      "responseDateTimeRenderOption": "FORMATTED_STRING",
      "valueInputOption": "RAW",
      "resource": { values: values}

    }).then(function(response) {
        console.log("Response", response);
        readData();
      },
      function(err) { console.error("Execute error", err); });
  }
}

function showInformation(message) {
    var card = document.createElement('div');
    card.setAttribute("class", "card");
    card.textContent = message;
    document.getElementById("information").appendChild(card);
  }

function getIformation() {
  document.getElementById("information").innerHTML = "";

  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: SHEETID,
    range: 'List!A2:C',
  }).then(function(response) {
    var range = response.result;
    if (range.values.length > 0) {
      for (i = range.values.length - 1; i > 0 ; i--) {
        var row = range.values[i];
        showInformation(`${row[0]} ${row[1]}`);
      }
    } else {
      showInformation('No data found.');
    }
  }, function(response) {
    showInformation('Error: ' + response.result.error.message);
  });
}
