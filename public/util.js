function randomInt(a) { // min and max included 
  return Math.floor(Math.random() * (a[1] - a[0] + 1) + a[0]);
}

function isKeyAccept(key) {
  // 0 ~9, enter, backspace
  let keyCodeSet = [48,49,50,51,52,53,54,55,56,57,13,8];
  if( keyCodeSet.indexOf(key) == -1) {
    return false;
  }
  else {
    return true;
  }
}

/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
}

function addCoin(coin) {
  return fetch('/coin/inc', {
    method:'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body:JSON.stringify({
      "type":"inc",
      "coin":coin
    })
  })
  .then(res => res.json())
  .catch(err => console.log('/util','addCoin', err));
}

function useCoin() {
  return fetch('/coin/inc', {
    method:'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body:JSON.stringify({
      "type":"dec",
      "coin":_oneCoin
    })
  })
  .then(res => res.json())
  .catch(err => console.log('/util','useCoin', err));
}

function setHeaderCoin(coin) {
  let headercoin = document.getElementById('headercoin');
  if( headercoin != null ) {
    headercoin.textContent = `Coin : ${coin}`;
  }
  
}