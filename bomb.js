/** Enums */
const STATUS = {
  SETUP: 0,
  NOT_STARTED: 1, 
  STARTED: 2,
  FINISHED: 3
}
const WINNER = {
  TERRORIST: 0,
  COUNTER_TERRORIST: 1
}

/** GAME VARS */
var insertedCode =''; 
var id = 0; 
var defuseTime, defuseCode; 
var gameStatus = STATUS.SETUP;

/** AUDIO */
var startSound = new Audio("assets/bomb-has-been-planted.mp3");   
var terroristWin = new Audio('assets/terrorist-wins.mp3');
var ctWin = new Audio('assets/counter-terrorists-win.mp3'); 
var explosion = new Audio('assets/explosion.mp3'); 
var beep = new Audio('assets/beep.mp3'); 
var tenSecBeep = new Audio('assets/ten-sec-beep.mp3'); 
var finalBeep = new Audio('assets/final-beep2.mp3'); 
beep.loop = false;
finalBeep.loop = false;

/** EVENTS */
window.onload = function() {
  document.getElementById("main").style.display = "none";
}


/** FUNCTIONS */
const checkValue = (el) => {
  let value = parseInt(el.value); 
  if (value > 9999){
    return el.value = 9999
  }
  console.log("Value vino: ",value);
  switch (true){
    case (value < 10):
      value = '000'+value;  
      break;
    case (value < 100):
      value = '00'+value;  
      break;
    case (value < 1000):
      value = '0'+value;  
      break;
    default:
      break;
  }
  return el.value = value;
}

const readyToStart = () => {
  
  deleteButton();
  document.getElementById("start").classList.remove("btnStartDisabled");

  defuseCode = document.getElementById("setDefuseCode").value;
  defuseTime = document.getElementById("setDefuseTime").value;
  time = defuseTime.split(':');
  defuseTime = Number(time[0] * 60) + Number(time[1]);

  if(defuseTime <= 1){
    alert('El tiempo de desactivacion no puede ser menor a 60 segundos');
    return
  }

  document.getElementById("defuseMinutes").innerText = time[0];
  document.getElementById("defuseSeconds").innerText = time[1];

  document.getElementById("setup").style.display = "none";
  document.getElementById("main").style.display = "block";
  gameStatus = STATUS.NOT_STARTED;
}

function setNumber(el){
  if(gameStatus === STATUS.STARTED){
    value = el.value;
    insertedCode += value;
    document.getElementById("insertedCode").innerText = insertedCode;
    if(insertedCode.length >= 4){
      return okButton();
    }
  }
}
 

function okButton(){
  if(parseInt(insertedCode) == defuseCode){     
    finishGame(WINNER.COUNTER_TERRORIST);
  }else{
    finishGame(WINNER.TERRORIST);
  }
}

function updateDefuseTime(){
  defuseTime = --defuseTime;
  var date = new Date(null);
  date.setSeconds(defuseTime);
  defuseMinutes = date.toISOString().substr(14, 2);
  defuseSeconds = date.toISOString().substr(17, 2);
  document.getElementById("defuseMinutes").innerText = defuseMinutes;
  document.getElementById("defuseSeconds").innerText = defuseSeconds;
}

function init(){
  id = setInterval(function(){
    switch (true) {
      case (defuseTime > 30 && defuseTime % 2 == 0):
        beep.play();
        break;
      case (defuseTime <= 30 && defuseTime > 10):
        beep.play();
        break;
      case (defuseTime <= 10 && defuseTime > 5):
        tenSecBeep.play();
        break;
      case (defuseTime <= 5):
        finalBeep.play();
        break;
      default:
        break;
    }

    if (defuseTime == 0){
      clearInterval(id);
      finishGame(WINNER.TERRORIST);
      return
    }
    updateDefuseTime();
  },1000)
}


function deleteButton(){
  document.getElementById("insertedCode").innerText = "____";
  insertedCode = '';
}

function start(el)
{
  if(gameStatus == STATUS.NOT_STARTED){
    startSound.loop = false;
    startSound.play();
    gameStatus = STATUS.STARTED;
    el.classList.add("btnStartDisabled");
    init();
  }
}


async function finishGame (winner){
  document.getElementById("gameFinalStatus").innerHTML = '';
  clearInterval(id);
  if (winner === WINNER.TERRORIST){
    document.getElementById("gameFinalStatus").innerHTML = `
    <span class="">Bomb has been exploded</span>
    <span class="tWin">Terrorist WIN. </span>`  
    explosion.loop = false;
    await explosion.play();
    await sleep (1000);
    terroristWin.play();
  } else {
    document.getElementById("gameFinalStatus").innerHTML = `
    <span class="">Bomb has been defused</span>
    <span class="ctWin">Counter terrorist WIN. </span>`
    ctWin.play();
  }
  gameStatus = STATUS.FINISHED;
  document.getElementById("finishModal").style.display = 'flex';
}

function playAgain(){
  document.getElementById("finishModal").style.display = 'none';
  readyToStart();
}

function configure(){
  document.getElementById("finishModal").style.display = 'none';
  document.getElementById("main").style.display = 'none';
  document.getElementById("setup").style.display = 'flex';
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}