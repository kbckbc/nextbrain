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

