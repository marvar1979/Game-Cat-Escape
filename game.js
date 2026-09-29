(() => {
  "use strict";

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  const screens = {
    home: document.getElementById("homeScreen"),
    levels: document.getElementById("levelsScreen"),
    game: document.getElementById("gameScreen")
  };

  const ui = {
    playBtn: document.getElementById("playBtn"),
    levelsBtn: document.getElementById("levelsBtn"),
    worldTabs: document.getElementById("worldTabs"),
    levelGrid: document.getElementById("levelGrid"),
    hudWorld: document.getElementById("hudWorld"),
    hudLevelName: document.getElementById("hudLevelName"),
    fishCounter: document.getElementById("fishCounter"),
    timeCounter: document.getElementById("timeCounter"),
    deathCounter: document.getElementById("deathCounter"),
    menuBtn: document.getElementById("menuBtn"),
    soundBtn: document.getElementById("soundBtn"),
    restartBtn: document.getElementById("restartBtn"),
    toast: document.getElementById("toast"),
    pauseOverlay: document.getElementById("pauseOverlay"),
    resumeBtn: document.getElementById("resumeBtn"),
    pauseRestartBtn: document.getElementById("pauseRestartBtn"),
    pauseLevelsBtn: document.getElementById("pauseLevelsBtn"),
    completeOverlay: document.getElementById("completeOverlay"),
    completeTitle: document.getElementById("completeTitle"),
    starsResult: document.getElementById("starsResult"),
    resultTime: document.getElementById("resultTime"),
    resultFish: document.getElementById("resultFish"),
    resultDeaths: document.getElementById("resultDeaths"),
    resultTip: document.getElementById("resultTip"),
    completeRetryBtn: document.getElementById("completeRetryBtn"),
    nextLevelBtn: document.getElementById("nextLevelBtn")
  };

  // Ajustes centrales de movimiento.
  // Diseñados para que los niveles sean cómodos y no exijan saltos pixel-perfect.
  const PLAYER_TUNING = {
    speed: 340,
    jumpForce: 880,
    gravity: 1550,
    earlyReleaseGravity: 700,
    coyoteTime: 0.14,
    jumpBufferTime: 0.14,
    maxFallSpeed: 900
  };

  const COLORS = {
    home: {
      skyTop: "#282344",
      skyBottom: "#ef9c82",
      platform: "#71536a",
      platformTop: "#f4c3a5",
      accent: "#ffd37c",
      far: "#443858"
    },
    garden: {
      skyTop: "#233f55",
      skyBottom: "#88d7b6",
      platform: "#506845",
      platformTop: "#9ec56f",
      accent: "#ffe07a",
      far: "#2f5d57"
    },
    city: {
      skyTop: "#15182d",
      skyBottom: "#6d5f9e",
      platform: "#474b67",
      platformTop: "#8c91ad",
      accent: "#ffbd6f",
      far: "#292b48"
    }
  };

  // Copia embebida para que el juego también funcione al abrir index.html con doble clic.
  // Cuando se ejecuta desde un servidor, levels.json sigue siendo la fuente principal.
  const defaultData = {"title":"Cat Escape","version":"1.1.0","worlds":[{"id":1,"name":"Casa","theme":"home","tagline":"Escapa sin despertar a nadie.","levels":[["Dormitorio","Encuentra la puerta y recoge tus primeros pescados.",52],["Pasillo","Usa las cajas para alcanzar la salida.",58],["Cocina","Evita el agua y encuentra la llave.",62],["Sala","Una aspiradora patrulla la zona.",66],["Perro dormido","El último obstáculo antes del jardín.",72]]},{"id":2,"name":"Jardín","theme":"garden","tagline":"Hierba alta, agua y muchos saltos.","levels":[["Arbustos","Salta entre macetas y arbustos.",60],["Aspersores","No toques las zonas mojadas.",65],["Árbol","Sube usando ramas y plataformas.",70],["Piscina","Cruza sin caer al agua.",72],["La cerca","Usa el trampolín para escapar.",78]]},{"id":3,"name":"Ciudad","theme":"city","tagline":"Azoteas, callejones y el camino a casa.","levels":[["Callejón","Avanza entre cajas y cubos.",66],["Mercado","Consigue la llave entre los puestos.",70],["Azoteas","Saltos largos y plataformas altas.",76],["Tráfico","Cuidado con los peligros en movimiento.",80],["Regreso a casa","El desafío final del pequeño fugitivo.",86]]}],"levels":[{"id":1,"world":1,"worldName":"Casa","theme":"home","name":"Dormitorio","description":"Encuentra la puerta y recoge tus primeros pescados.","parTime":52,"width":2340,"height":720,"spawn":{"x":90,"y":520},"door":{"x":2220,"y":520,"w":58,"h":100,"locked":false},"key":null,"platforms":[{"x":0,"y":620,"w":520,"h":100},{"x":610,"y":620,"w":430,"h":100},{"x":1120,"y":620,"w":480,"h":100},{"x":1700,"y":620,"w":640,"h":100},{"x":390,"y":490,"w":170,"h":26},{"x":850,"y":490,"w":180,"h":26},{"x":1320,"y":430,"w":180,"h":26}],"fish":[{"x":260,"y":565},{"x":465,"y":430},{"x":920,"y":430},{"x":1390,"y":370},{"x":1880,"y":565}],"hazards":[{"type":"water","x":520,"y":610,"w":90,"h":110},{"type":"void","x":1040,"y":610,"w":80,"h":110},{"type":"void","x":1600,"y":610,"w":100,"h":110}],"enemies":[],"springs":[]},{"id":2,"world":1,"worldName":"Casa","theme":"home","name":"Pasillo","description":"Usa las cajas para alcanzar la salida.","parTime":58,"width":2480,"height":720,"spawn":{"x":90,"y":520},"door":{"x":2360,"y":520,"w":58,"h":100,"locked":false},"key":null,"platforms":[{"x":0,"y":620,"w":520,"h":100},{"x":610,"y":620,"w":430,"h":100},{"x":1120,"y":620,"w":480,"h":100},{"x":1700,"y":620,"w":780,"h":100},{"x":390,"y":510,"w":170,"h":26},{"x":850,"y":510,"w":180,"h":26},{"x":1320,"y":430,"w":180,"h":26}],"fish":[{"x":260,"y":565},{"x":465,"y":450},{"x":920,"y":450},{"x":1390,"y":370},{"x":1880,"y":565}],"hazards":[{"type":"water","x":520,"y":610,"w":90,"h":110},{"type":"void","x":1040,"y":610,"w":80,"h":110},{"type":"void","x":1600,"y":610,"w":100,"h":110}],"enemies":[],"springs":[]},{"id":3,"world":1,"worldName":"Casa","theme":"home","name":"Cocina","description":"Evita el agua y encuentra la llave.","parTime":62,"width":2620,"height":720,"spawn":{"x":90,"y":520},"door":{"x":2500,"y":520,"w":58,"h":100,"locked":true},"key":{"x":1060,"y":420},"platforms":[{"x":0,"y":620,"w":520,"h":100},{"x":610,"y":620,"w":430,"h":100},{"x":1120,"y":620,"w":480,"h":100},{"x":1700,"y":620,"w":920,"h":100},{"x":390,"y":490,"w":170,"h":26},{"x":850,"y":470,"w":180,"h":26},{"x":1320,"y":430,"w":180,"h":26},{"x":1560,"y":465,"w":140,"h":24}],"fish":[{"x":260,"y":565},{"x":465,"y":430},{"x":920,"y":410},{"x":1390,"y":370},{"x":1880,"y":565}],"hazards":[{"type":"water","x":520,"y":610,"w":90,"h":110},{"type":"void","x":1040,"y":610,"w":80,"h":110},{"type":"void","x":1600,"y":610,"w":100,"h":110}],"enemies":[],"springs":[]},{"id":4,"world":1,"worldName":"Casa","theme":"home","name":"Sala","description":"Una aspiradora patrulla la zona.","parTime":66,"width":2760,"height":720,"spawn":{"x":90,"y":520},"door":{"x":2640,"y":520,"w":58,"h":100,"locked":true},"key":{"x":1080,"y":330},"platforms":[{"x":0,"y":620,"w":520,"h":100},{"x":610,"y":620,"w":430,"h":100},{"x":1120,"y":620,"w":480,"h":100},{"x":1700,"y":620,"w":1060,"h":100},{"x":390,"y":510,"w":170,"h":26},{"x":850,"y":490,"w":180,"h":26},{"x":1320,"y":430,"w":180,"h":26},{"x":1560,"y":500,"w":140,"h":24},{"x":1010,"y":380,"w":140,"h":22}],"fish":[{"x":260,"y":565},{"x":465,"y":450},{"x":920,"y":430},{"x":1390,"y":370},{"x":1880,"y":565},{"x":1080,"y":320}],"hazards":[{"type":"water","x":520,"y":610,"w":90,"h":110},{"type":"void","x":1040,"y":610,"w":80,"h":110},{"type":"void","x":1600,"y":610,"w":100,"h":110},{"type":"spikes","x":760,"y":595,"w":70,"h":25}],"enemies":[{"type":"vacuum","x":1180,"y":570,"minX":1140,"maxX":1500,"speed":89}],"springs":[]},{"id":5,"world":1,"worldName":"Casa","theme":"home","name":"Perro dormido","description":"El último obstáculo antes del jardín.","parTime":72,"width":2900,"height":720,"spawn":{"x":90,"y":520},"door":{"x":2780,"y":520,"w":58,"h":100,"locked":true},"key":{"x":1080,"y":330},"platforms":[{"x":0,"y":620,"w":520,"h":100},{"x":610,"y":620,"w":430,"h":100},{"x":1120,"y":620,"w":480,"h":100},{"x":1700,"y":620,"w":1200,"h":100},{"x":390,"y":490,"w":170,"h":26},{"x":850,"y":510,"w":180,"h":26},{"x":1320,"y":430,"w":180,"h":26},{"x":1560,"y":465,"w":140,"h":24},{"x":1010,"y":380,"w":140,"h":22}],"fish":[{"x":260,"y":565},{"x":465,"y":430},{"x":920,"y":450},{"x":1390,"y":370},{"x":1880,"y":565},{"x":1080,"y":320}],"hazards":[{"type":"water","x":520,"y":610,"w":90,"h":110},{"type":"void","x":1040,"y":610,"w":80,"h":110},{"type":"void","x":1600,"y":610,"w":100,"h":110},{"type":"spikes","x":760,"y":595,"w":70,"h":25}],"enemies":[{"type":"vacuum","x":1180,"y":570,"minX":1140,"maxX":1500,"speed":95}],"springs":[]},{"id":6,"world":2,"worldName":"Jardín","theme":"garden","name":"Arbustos","description":"Salta entre macetas y arbustos.","parTime":60,"width":2460,"height":720,"spawn":{"x":90,"y":520},"door":{"x":2340,"y":520,"w":58,"h":100,"locked":false},"key":null,"platforms":[{"x":0,"y":620,"w":520,"h":100},{"x":610,"y":620,"w":430,"h":100},{"x":1120,"y":620,"w":480,"h":100},{"x":1700,"y":620,"w":760,"h":100},{"x":390,"y":490,"w":170,"h":26},{"x":850,"y":490,"w":180,"h":26},{"x":1320,"y":430,"w":180,"h":26}],"fish":[{"x":260,"y":565},{"x":465,"y":430},{"x":920,"y":430},{"x":1390,"y":370},{"x":1880,"y":565}],"hazards":[{"type":"water","x":520,"y":610,"w":90,"h":110},{"type":"water","x":1040,"y":610,"w":80,"h":110},{"type":"water","x":1600,"y":610,"w":100,"h":110}],"enemies":[],"springs":[]},{"id":7,"world":2,"worldName":"Jardín","theme":"garden","name":"Aspersores","description":"No toques las zonas mojadas.","parTime":65,"width":2600,"height":720,"spawn":{"x":90,"y":520},"door":{"x":2480,"y":520,"w":58,"h":100,"locked":false},"key":null,"platforms":[{"x":0,"y":620,"w":520,"h":100},{"x":610,"y":620,"w":430,"h":100},{"x":1120,"y":620,"w":480,"h":100},{"x":1700,"y":620,"w":900,"h":100},{"x":390,"y":510,"w":170,"h":26},{"x":850,"y":510,"w":180,"h":26},{"x":1320,"y":430,"w":180,"h":26}],"fish":[{"x":260,"y":565},{"x":465,"y":450},{"x":920,"y":450},{"x":1390,"y":370},{"x":1880,"y":565}],"hazards":[{"type":"water","x":520,"y":610,"w":90,"h":110},{"type":"water","x":1040,"y":610,"w":80,"h":110},{"type":"water","x":1600,"y":610,"w":100,"h":110}],"enemies":[{"type":"dog","x":1180,"y":570,"minX":1140,"maxX":1500,"speed":77}],"springs":[]},{"id":8,"world":2,"worldName":"Jardín","theme":"garden","name":"Árbol","description":"Sube usando ramas y plataformas.","parTime":70,"width":2740,"height":720,"spawn":{"x":90,"y":520},"door":{"x":2620,"y":520,"w":58,"h":100,"locked":true},"key":{"x":1060,"y":420},"platforms":[{"x":0,"y":620,"w":520,"h":100},{"x":610,"y":620,"w":430,"h":100},{"x":1120,"y":620,"w":480,"h":100},{"x":1700,"y":620,"w":1040,"h":100},{"x":390,"y":490,"w":170,"h":26},{"x":850,"y":470,"w":180,"h":26},{"x":1320,"y":430,"w":180,"h":26},{"x":1560,"y":465,"w":140,"h":24}],"fish":[{"x":260,"y":565},{"x":465,"y":430},{"x":920,"y":410},{"x":1390,"y":370},{"x":1880,"y":565}],"hazards":[{"type":"water","x":520,"y":610,"w":90,"h":110},{"type":"water","x":1040,"y":610,"w":80,"h":110},{"type":"water","x":1600,"y":610,"w":100,"h":110}],"enemies":[{"type":"dog","x":1180,"y":570,"minX":1140,"maxX":1500,"speed":83}],"springs":[{"x":1510,"y":585,"w":48,"h":35,"power":920}]},{"id":9,"world":2,"worldName":"Jardín","theme":"garden","name":"Piscina","description":"Cruza sin caer al agua.","parTime":72,"width":2880,"height":720,"spawn":{"x":90,"y":520},"door":{"x":2760,"y":520,"w":58,"h":100,"locked":true},"key":{"x":1080,"y":330},"platforms":[{"x":0,"y":620,"w":520,"h":100},{"x":610,"y":620,"w":430,"h":100},{"x":1120,"y":620,"w":480,"h":100},{"x":1700,"y":620,"w":1180,"h":100},{"x":390,"y":510,"w":170,"h":26},{"x":850,"y":490,"w":180,"h":26},{"x":1320,"y":430,"w":180,"h":26},{"x":1560,"y":500,"w":140,"h":24},{"x":1010,"y":380,"w":140,"h":22}],"fish":[{"x":260,"y":565},{"x":465,"y":450},{"x":920,"y":430},{"x":1390,"y":370},{"x":1880,"y":565},{"x":1080,"y":320}],"hazards":[{"type":"water","x":520,"y":610,"w":90,"h":110},{"type":"water","x":1040,"y":610,"w":80,"h":110},{"type":"water","x":1600,"y":610,"w":100,"h":110},{"type":"water","x":760,"y":595,"w":70,"h":25}],"enemies":[{"type":"dog","x":1180,"y":570,"minX":1140,"maxX":1500,"speed":89}],"springs":[]},{"id":10,"world":2,"worldName":"Jardín","theme":"garden","name":"La cerca","description":"Usa el trampolín para escapar.","parTime":78,"width":3020,"height":720,"spawn":{"x":90,"y":520},"door":{"x":2900,"y":520,"w":58,"h":100,"locked":true},"key":{"x":1080,"y":330},"platforms":[{"x":0,"y":620,"w":520,"h":100},{"x":610,"y":620,"w":430,"h":100},{"x":1120,"y":620,"w":480,"h":100},{"x":1700,"y":620,"w":1320,"h":100},{"x":390,"y":490,"w":170,"h":26},{"x":850,"y":510,"w":180,"h":26},{"x":1320,"y":430,"w":180,"h":26},{"x":1560,"y":465,"w":140,"h":24},{"x":1010,"y":380,"w":140,"h":22}],"fish":[{"x":260,"y":565},{"x":465,"y":430},{"x":920,"y":450},{"x":1390,"y":370},{"x":1880,"y":565},{"x":1080,"y":320}],"hazards":[{"type":"water","x":520,"y":610,"w":90,"h":110},{"type":"water","x":1040,"y":610,"w":80,"h":110},{"type":"water","x":1600,"y":610,"w":100,"h":110},{"type":"water","x":760,"y":595,"w":70,"h":25}],"enemies":[{"type":"dog","x":1180,"y":570,"minX":1140,"maxX":1500,"speed":95}],"springs":[{"x":1510,"y":585,"w":48,"h":35,"power":920}]},{"id":11,"world":3,"worldName":"Ciudad","theme":"city","name":"Callejón","description":"Avanza entre cajas y cubos.","parTime":66,"width":2580,"height":720,"spawn":{"x":90,"y":520},"door":{"x":2460,"y":520,"w":58,"h":100,"locked":false},"key":null,"platforms":[{"x":0,"y":620,"w":520,"h":100},{"x":610,"y":620,"w":430,"h":100},{"x":1120,"y":620,"w":480,"h":100},{"x":1700,"y":620,"w":880,"h":100},{"x":390,"y":490,"w":170,"h":26},{"x":850,"y":490,"w":180,"h":26},{"x":1320,"y":430,"w":180,"h":26}],"fish":[{"x":260,"y":565},{"x":465,"y":430},{"x":920,"y":430},{"x":1390,"y":370},{"x":1880,"y":565}],"hazards":[{"type":"road","x":520,"y":610,"w":90,"h":110},{"type":"void","x":1040,"y":610,"w":80,"h":110},{"type":"void","x":1600,"y":610,"w":100,"h":110}],"enemies":[],"springs":[]},{"id":12,"world":3,"worldName":"Ciudad","theme":"city","name":"Mercado","description":"Consigue la llave entre los puestos.","parTime":70,"width":2720,"height":720,"spawn":{"x":90,"y":520},"door":{"x":2600,"y":520,"w":58,"h":100,"locked":false},"key":null,"platforms":[{"x":0,"y":620,"w":520,"h":100},{"x":610,"y":620,"w":430,"h":100},{"x":1120,"y":620,"w":480,"h":100},{"x":1700,"y":620,"w":1020,"h":100},{"x":390,"y":510,"w":170,"h":26},{"x":850,"y":510,"w":180,"h":26},{"x":1320,"y":430,"w":180,"h":26}],"fish":[{"x":260,"y":565},{"x":465,"y":450},{"x":920,"y":450},{"x":1390,"y":370},{"x":1880,"y":565}],"hazards":[{"type":"road","x":520,"y":610,"w":90,"h":110},{"type":"void","x":1040,"y":610,"w":80,"h":110},{"type":"void","x":1600,"y":610,"w":100,"h":110}],"enemies":[{"type":"scooter","x":1180,"y":570,"minX":1140,"maxX":1500,"speed":77}],"springs":[]},{"id":13,"world":3,"worldName":"Ciudad","theme":"city","name":"Azoteas","description":"Saltos largos y plataformas altas.","parTime":76,"width":2860,"height":720,"spawn":{"x":90,"y":520},"door":{"x":2740,"y":520,"w":58,"h":100,"locked":true},"key":{"x":1060,"y":420},"platforms":[{"x":0,"y":620,"w":520,"h":100},{"x":610,"y":620,"w":430,"h":100},{"x":1120,"y":620,"w":480,"h":100},{"x":1700,"y":620,"w":1160,"h":100},{"x":390,"y":490,"w":170,"h":26},{"x":850,"y":470,"w":180,"h":26},{"x":1320,"y":430,"w":180,"h":26},{"x":1560,"y":465,"w":140,"h":24},{"x":540,"y":440,"w":120,"h":22},{"x":1480,"y":350,"w":150,"h":22}],"fish":[{"x":260,"y":565},{"x":465,"y":430},{"x":920,"y":410},{"x":1390,"y":370},{"x":1880,"y":565},{"x":1540,"y":290}],"hazards":[{"type":"road","x":520,"y":610,"w":90,"h":110},{"type":"void","x":1040,"y":610,"w":80,"h":110},{"type":"void","x":1600,"y":610,"w":100,"h":110}],"enemies":[{"type":"scooter","x":1180,"y":570,"minX":1140,"maxX":1500,"speed":83}],"springs":[{"x":1510,"y":585,"w":48,"h":35,"power":920}]},{"id":14,"world":3,"worldName":"Ciudad","theme":"city","name":"Tráfico","description":"Cuidado con los peligros en movimiento.","parTime":80,"width":3000,"height":720,"spawn":{"x":90,"y":520},"door":{"x":2880,"y":520,"w":58,"h":100,"locked":true},"key":{"x":1080,"y":330},"platforms":[{"x":0,"y":620,"w":520,"h":100},{"x":610,"y":620,"w":430,"h":100},{"x":1120,"y":620,"w":480,"h":100},{"x":1700,"y":620,"w":1300,"h":100},{"x":390,"y":510,"w":170,"h":26},{"x":850,"y":490,"w":180,"h":26},{"x":1320,"y":430,"w":180,"h":26},{"x":1560,"y":500,"w":140,"h":24},{"x":1010,"y":380,"w":140,"h":22},{"x":540,"y":440,"w":120,"h":22},{"x":1480,"y":350,"w":150,"h":22}],"fish":[{"x":260,"y":565},{"x":465,"y":450},{"x":920,"y":430},{"x":1390,"y":370},{"x":1880,"y":565},{"x":1080,"y":320},{"x":1540,"y":290}],"hazards":[{"type":"road","x":520,"y":610,"w":90,"h":110},{"type":"void","x":1040,"y":610,"w":80,"h":110},{"type":"void","x":1600,"y":610,"w":100,"h":110},{"type":"spikes","x":760,"y":595,"w":70,"h":25}],"enemies":[{"type":"scooter","x":1180,"y":570,"minX":1140,"maxX":1500,"speed":89},{"type":"scooter","x":1770,"y":570,"minX":1720,"maxX":2840,"speed":105}],"springs":[]},{"id":15,"world":3,"worldName":"Ciudad","theme":"city","name":"Regreso a casa","description":"El desafío final del pequeño fugitivo.","parTime":86,"width":3140,"height":720,"spawn":{"x":90,"y":520},"door":{"x":3020,"y":520,"w":58,"h":100,"locked":true},"key":{"x":1080,"y":330},"platforms":[{"x":0,"y":620,"w":520,"h":100},{"x":610,"y":620,"w":430,"h":100},{"x":1120,"y":620,"w":480,"h":100},{"x":1700,"y":620,"w":1440,"h":100},{"x":390,"y":490,"w":170,"h":26},{"x":850,"y":510,"w":180,"h":26},{"x":1320,"y":430,"w":180,"h":26},{"x":1560,"y":465,"w":140,"h":24},{"x":1010,"y":380,"w":140,"h":22},{"x":540,"y":440,"w":120,"h":22},{"x":1480,"y":350,"w":150,"h":22}],"fish":[{"x":260,"y":565},{"x":465,"y":430},{"x":920,"y":450},{"x":1390,"y":370},{"x":1880,"y":565},{"x":1080,"y":320},{"x":1540,"y":290}],"hazards":[{"type":"road","x":520,"y":610,"w":90,"h":110},{"type":"void","x":1040,"y":610,"w":80,"h":110},{"type":"void","x":1600,"y":610,"w":100,"h":110},{"type":"spikes","x":760,"y":595,"w":70,"h":25}],"enemies":[{"type":"scooter","x":1180,"y":570,"minX":1140,"maxX":1500,"speed":95},{"type":"scooter","x":1770,"y":570,"minX":1720,"maxX":2980,"speed":105}],"springs":[{"x":1510,"y":585,"w":48,"h":35,"power":920}]}]};

  let data = defaultData;
  let currentWorldFilter = 1;
  let currentLevel = null;
  let currentLevelIndex = 0;
  let levelRuntime = null;
  let animationId = 0;
  let lastTime = 0;
  let paused = false;
  let completed = false;
  let soundEnabled = true;
  let audioCtx = null;
  let toastTimer = null;

  const input = {
    left: false,
    right: false,
    jump: false,
    interact: false,
    jumpPressed: false,
    interactPressed: false
  };

  const progress = loadProgress();

  function loadProgress() {
    try {
      return JSON.parse(localStorage.getItem("catEscapeProgress")) || {
        unlocked: 1,
        levels: {}
      };
    } catch {
      return { unlocked: 1, levels: {} };
    }
  }

  function saveProgress() {
    localStorage.setItem("catEscapeProgress", JSON.stringify(progress));
  }

  function switchScreen(name) {
    Object.values(screens).forEach(screen => screen.classList.remove("screen--active"));
    screens[name].classList.add("screen--active");
  }

  async function loadGameData() {
    try {
      const response = await fetch("levels.json", { cache: "no-store" });
      if (!response.ok) throw new Error("No se pudo cargar levels.json");
      data = await response.json();
    } catch (error) {
      console.warn("No se pudo cargar levels.json. Si abriste index.html con doble clic, usa un servidor local para cargar JSON.", error);
      showToast("Modo local: usando niveles integrados.");
      data = defaultData;
    }
    renderWorldTabs();
    renderLevels();
  }

  function renderWorldTabs() {
    ui.worldTabs.innerHTML = "";
    data.worlds.forEach(world => {
      const button = document.createElement("button");
      button.className = `world-tab${world.id === currentWorldFilter ? " active" : ""}`;
      button.textContent = `Mundo ${world.id} · ${world.name}`;
      button.addEventListener("click", () => {
        currentWorldFilter = world.id;
        renderWorldTabs();
        renderLevels();
      });
      ui.worldTabs.appendChild(button);
    });
  }

  function renderLevels() {
    ui.levelGrid.innerHTML = "";
    const levels = data.levels.filter(level => level.world === currentWorldFilter);
    levels.forEach(level => {
      const unlocked = level.id <= progress.unlocked;
      const result = progress.levels[level.id];
      const stars = result?.stars || 0;

      const card = document.createElement("button");
      card.className = `level-card${unlocked ? "" : " locked"}`;
      card.innerHTML = `
        <span class="level-number">${String(level.id).padStart(2, "0")}</span>
        <span class="level-name">${level.name}</span>
        <span class="level-stars">${"★".repeat(stars)}${"☆".repeat(3 - stars)}</span>
        ${unlocked ? "" : '<span class="level-lock">🔒</span>'}
      `;

      if (unlocked) {
        card.addEventListener("click", () => startLevel(level.id));
      }
      ui.levelGrid.appendChild(card);
    });
  }

  class Player {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.w = 50;
      this.h = 58;
      this.vx = 0;
      this.vy = 0;
      this.speed = PLAYER_TUNING.speed;
      this.jumpForce = PLAYER_TUNING.jumpForce;
      this.onGround = false;
      this.facing = 1;
      this.coyote = 0;
      this.jumpBuffer = 0;
      this.hasKey = false;
      this.invulnerable = 0;
      this.anim = 0;
    }

    update(dt) {
      const accel = this.onGround ? 2200 : 1300;
      const friction = this.onGround ? 2500 : 900;
      const target = (input.right ? 1 : 0) - (input.left ? 1 : 0);

      if (target !== 0) {
        this.vx = approach(this.vx, target * this.speed, accel * dt);
        this.facing = Math.sign(target);
      } else {
        this.vx = approach(this.vx, 0, friction * dt);
      }

      if (this.onGround) {
        this.coyote = PLAYER_TUNING.coyoteTime;
      } else {
        this.coyote -= dt;
      }

      if (input.jumpPressed) this.jumpBuffer = PLAYER_TUNING.jumpBufferTime;
      this.jumpBuffer -= dt;

      if (this.jumpBuffer > 0 && this.coyote > 0) {
        this.vy = -this.jumpForce;
        this.onGround = false;
        this.coyote = 0;
        this.jumpBuffer = 0;
        playTone(440, .06, "triangle", .035);
        spawnParticles(this.x + this.w / 2, this.y + this.h, 8, "#f5d7b5", 120);
      }

      if (!input.jump && this.vy < -240) {
        this.vy += PLAYER_TUNING.earlyReleaseGravity * dt;
      }

      this.vy += PLAYER_TUNING.gravity * dt;
      this.vy = Math.min(this.vy, PLAYER_TUNING.maxFallSpeed);

      this.moveAndCollide(this.vx * dt, 0);
      this.onGround = false;
      this.moveAndCollide(0, this.vy * dt);

      this.anim += dt * (3 + Math.abs(this.vx) / 90);
      this.invulnerable = Math.max(0, this.invulnerable - dt);
    }

    moveAndCollide(dx, dy) {
      this.x += dx;
      this.y += dy;

      for (const p of currentLevel.platforms) {
        if (!rectsOverlap(this, p)) continue;

        if (dx > 0) {
          this.x = p.x - this.w;
          this.vx = 0;
        } else if (dx < 0) {
          this.x = p.x + p.w;
          this.vx = 0;
        }

        if (dy > 0) {
          this.y = p.y - this.h;
          this.vy = 0;
          this.onGround = true;
        } else if (dy < 0) {
          this.y = p.y + p.h;
          this.vy = 0;
        }
      }

      this.x = clamp(this.x, 0, currentLevel.width - this.w);
    }

    draw(cameraX) {
      const x = Math.round(this.x - cameraX);
      const y = Math.round(this.y);
      const bob = this.onGround && Math.abs(this.vx) > 30 ? Math.sin(this.anim * 2) * 2 : 0;
      const flip = this.facing;

      ctx.save();
      ctx.translate(x + this.w / 2, y + this.h / 2 + bob);
      ctx.scale(flip, 1);
      if (this.invulnerable > 0 && Math.floor(this.invulnerable * 16) % 2 === 0) {
        ctx.globalAlpha = .45;
      }

      // shadow
      ctx.fillStyle = "rgba(0,0,0,.18)";
      ctx.beginPath();
      ctx.ellipse(0, this.h / 2 - 1, 26, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // tail
      ctx.strokeStyle = "#e77c54";
      ctx.lineWidth = 12;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(-18, 10);
      ctx.quadraticCurveTo(-40, -4, -30, -22);
      ctx.stroke();

      // body
      roundRect(-20, -6, 40, 38, 17, "#ef8c5a");

      // head
      roundRect(-23, -28, 46, 40, 16, "#f6a263");

      // ears
      ctx.fillStyle = "#f6a263";
      ctx.beginPath();
      ctx.moveTo(-19, -23);
      ctx.lineTo(-12, -43);
      ctx.lineTo(-3, -24);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(19, -23);
      ctx.lineTo(12, -43);
      ctx.lineTo(3, -24);
      ctx.fill();

      ctx.fillStyle = "#ef7591";
      ctx.beginPath();
      ctx.moveTo(-15, -26);
      ctx.lineTo(-12, -37);
      ctx.lineTo(-7, -25);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(15, -26);
      ctx.lineTo(12, -37);
      ctx.lineTo(7, -25);
      ctx.fill();

      // face
      ctx.fillStyle = "#38253a";
      ctx.beginPath();
      ctx.ellipse(-8, -10, 2.8, 4.5, 0, 0, Math.PI * 2);
      ctx.ellipse(8, -10, 2.8, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#d95775";
      ctx.beginPath();
      ctx.ellipse(0, -2, 3.5, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // paws
      ctx.fillStyle = "#f5a064";
      ctx.beginPath();
      ctx.ellipse(-12, 29, 9, 5, 0, 0, Math.PI * 2);
      ctx.ellipse(12, 29, 9, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      if (this.hasKey) {
        ctx.font = "21px system-ui";
        ctx.textAlign = "center";
        ctx.fillText("🔑", 0, -52);
      }

      ctx.restore();
    }
  }

  class Enemy {
    constructor(config) {
      Object.assign(this, config);
      this.w = this.type === "scooter" ? 64 : 58;
      this.h = 48;
      this.dir = 1;
      this.phase = Math.random() * Math.PI * 2;
    }

    update(dt) {
      this.x += this.dir * this.speed * dt;
      if (this.x < this.minX) {
        this.x = this.minX;
        this.dir = 1;
      }
      if (this.x + this.w > this.maxX) {
        this.x = this.maxX - this.w;
        this.dir = -1;
      }
      this.phase += dt * 5;
    }

    draw(cameraX) {
      const x = this.x - cameraX;
      const y = this.y;
      ctx.save();
      ctx.translate(x + this.w / 2, y + this.h / 2);
      ctx.scale(this.dir, 1);

      if (this.type === "vacuum") {
        roundRect(-27, -11, 45, 26, 8, "#8f7aff");
        ctx.fillStyle = "#5e54a7";
        ctx.fillRect(-12, -26, 9, 17);
        ctx.strokeStyle = "#bcaeff";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(-8, -25);
        ctx.quadraticCurveTo(-24, -40, -32, -20);
        ctx.stroke();
        ctx.fillStyle = "#2c2944";
        ctx.beginPath();
        ctx.arc(-15, 16, 7, 0, Math.PI * 2);
        ctx.arc(11, 16, 7, 0, Math.PI * 2);
        ctx.fill();
      } else if (this.type === "dog") {
        ctx.fillStyle = "#b77848";
        ctx.beginPath();
        ctx.ellipse(0, 3, 27, 18, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(17, -9, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#7a472f";
        ctx.beginPath();
        ctx.ellipse(10, -22, 6, 13, -.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#2c2230";
        ctx.beginPath();
        ctx.arc(22, -10, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#7f4a31";
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(-23, 0);
        ctx.quadraticCurveTo(-38, -13, -31, -25);
        ctx.stroke();
      } else {
        // scooter
        ctx.strokeStyle = "#2f2c46";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(-18, 14, 9, 0, Math.PI * 2);
        ctx.arc(19, 14, 9, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = "#ff7fa9";
        ctx.beginPath();
        ctx.moveTo(-18, 10);
        ctx.lineTo(4, 10);
        ctx.lineTo(13, -17);
        ctx.lineTo(21, -17);
        ctx.stroke();
        ctx.fillStyle = "#ffb36b";
        ctx.beginPath();
        ctx.arc(5, -12, 8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  class Particle {
    constructor(x, y, color, speed = 140) {
      const a = Math.random() * Math.PI * 2;
      const s = speed * (.35 + Math.random() * .75);
      this.x = x;
      this.y = y;
      this.vx = Math.cos(a) * s;
      this.vy = Math.sin(a) * s - 30;
      this.life = .35 + Math.random() * .45;
      this.maxLife = this.life;
      this.color = color;
      this.size = 2 + Math.random() * 4;
    }
    update(dt) {
      this.life -= dt;
      this.x += this.vx * dt;
      this.y += this.vy * dt;
      this.vy += 260 * dt;
    }
    draw(cameraX) {
      if (this.life <= 0) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.life / this.maxLife);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x - cameraX, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function createRuntime(level) {
    const clonedFish = level.fish.map((fish, index) => ({ ...fish, id: index, collected: false, w: 32, h: 26, phase: index }));
    return {
      player: new Player(level.spawn.x, level.spawn.y),
      fish: clonedFish,
      key: level.key ? { ...level.key, collected: false, w: 30, h: 30 } : null,
      enemies: level.enemies.map(e => new Enemy(e)),
      springs: level.springs.map(s => ({...s})),
      particles: [],
      cameraX: 0,
      elapsed: 0,
      deaths: 0,
      collectedFish: 0,
      startedAt: performance.now()
    };
  }

  function startLevel(levelId) {
    const index = data.levels.findIndex(level => level.id === levelId);
    if (index < 0) return;
    currentLevelIndex = index;
    currentLevel = data.levels[index];
    levelRuntime = createRuntime(currentLevel);
    paused = false;
    completed = false;
    ui.pauseOverlay.classList.remove("active");
    ui.completeOverlay.classList.remove("active");
    switchScreen("game");
    updateHud();
    lastTime = performance.now();
    cancelAnimationFrame(animationId);
    animationId = requestAnimationFrame(gameLoop);
    playTone(330, .08, "sine", .03);
  }

  function restartLevel() {
    if (!currentLevel) return;
    levelRuntime = createRuntime(currentLevel);
    paused = false;
    completed = false;
    ui.pauseOverlay.classList.remove("active");
    ui.completeOverlay.classList.remove("active");
    lastTime = performance.now();
    updateHud();
    showToast("Nivel reiniciado");
  }

  function gameLoop(now) {
    if (!screens.game.classList.contains("screen--active")) return;

    const dt = Math.min((now - lastTime) / 1000, .033);
    lastTime = now;

    if (!paused && !completed && levelRuntime) {
      updateGame(dt);
    }

    drawGame();
    resetPressedInputs();
    animationId = requestAnimationFrame(gameLoop);
  }

  function updateGame(dt) {
    const rt = levelRuntime;
    const p = rt.player;
    rt.elapsed += dt;

    p.update(dt);
    rt.enemies.forEach(enemy => enemy.update(dt));
    rt.particles.forEach(part => part.update(dt));
    rt.particles = rt.particles.filter(part => part.life > 0);

    // Fish collection
    for (const fish of rt.fish) {
      if (!fish.collected && rectsOverlap(p, { x: fish.x - 16, y: fish.y - 13, w: fish.w, h: fish.h })) {
        fish.collected = true;
        rt.collectedFish++;
        spawnParticles(fish.x, fish.y, 12, "#ffd86b", 165);
        playTone(740 + rt.collectedFish * 36, .08, "sine", .045);
        showToast(rt.collectedFish === rt.fish.length ? "¡Todos los pescados!" : "Pescado encontrado");
      }
    }

    // Key
    if (rt.key && !rt.key.collected && rectsOverlap(p, rt.key)) {
      rt.key.collected = true;
      p.hasKey = true;
      spawnParticles(rt.key.x + 15, rt.key.y + 15, 16, "#ffe38a", 180);
      playTone(880, .12, "triangle", .05);
      showToast("¡Llave encontrada!");
    }

    // Springs
    for (const spring of rt.springs) {
      const springBox = { x: spring.x, y: spring.y, w: spring.w, h: spring.h };
      if (p.vy >= 0 && rectsOverlap(p, springBox)) {
        p.vy = -spring.power;
        p.onGround = false;
        playTone(520, .09, "square", .035);
        spawnParticles(spring.x + spring.w / 2, spring.y, 12, "#66e3c4", 180);
      }
    }

    // Hazards
    for (const hazard of currentLevel.hazards) {
      if (rectsOverlap(p, hazard)) {
        hurtPlayer("¡Cuidado!");
        break;
      }
    }

    // Enemy collisions
    if (p.invulnerable <= 0) {
      for (const enemy of rt.enemies) {
        if (rectsOverlap(p, enemy)) {
          hurtPlayer(enemy.type === "dog" ? "¡Guau! Te encontró." : "¡Esquiva los obstáculos!");
          break;
        }
      }
    }

    if (p.y > currentLevel.height + 160) {
      hurtPlayer("Ups, caída.");
    }

    // Door interaction / auto hint
    const door = currentLevel.door;
    const doorRange = { x: door.x - 24, y: door.y - 12, w: door.w + 48, h: door.h + 24 };
    if (rectsOverlap(p, doorRange)) {
      const locked = door.locked && !p.hasKey;
      if (locked && input.interactPressed) {
        showToast("Necesitas encontrar la llave.");
        playTone(170, .12, "sawtooth", .025);
      } else if (!locked && (input.interactPressed || Math.abs(p.vx) < 10)) {
        finishLevel();
      }
    }

    // Camera
    const targetCam = clamp(p.x - canvas.width * .38, 0, Math.max(0, currentLevel.width - canvas.width));
    rt.cameraX += (targetCam - rt.cameraX) * Math.min(1, dt * 5.5);

    updateHud();
  }

  function hurtPlayer(message) {
    const rt = levelRuntime;
    const p = rt.player;
    if (p.invulnerable > 0) return;

    rt.deaths++;
    playTone(130, .18, "sawtooth", .035);
    spawnParticles(p.x + p.w / 2, p.y + p.h / 2, 18, "#ff6b78", 220);
    showToast(message);

    p.x = currentLevel.spawn.x;
    p.y = currentLevel.spawn.y;
    p.vx = 0;
    p.vy = 0;
    p.invulnerable = 1.1;
  }

  function finishLevel() {
    if (completed) return;
    completed = true;

    const fishRatio = levelRuntime.fish.length ? levelRuntime.collectedFish / levelRuntime.fish.length : 1;
    const timeGood = levelRuntime.elapsed <= currentLevel.parTime;
    const clean = levelRuntime.deaths === 0;

    let stars = 1;
    if (fishRatio >= .8) stars++;
    if (fishRatio === 1 && (timeGood || clean)) stars++;
    stars = clamp(stars, 1, 3);

    const existing = progress.levels[currentLevel.id] || { stars: 0, bestTime: Infinity };
    progress.levels[currentLevel.id] = {
      stars: Math.max(existing.stars || 0, stars),
      bestTime: Math.min(existing.bestTime || Infinity, levelRuntime.elapsed),
      bestFish: Math.max(existing.bestFish || 0, levelRuntime.collectedFish)
    };
    progress.unlocked = Math.max(progress.unlocked, Math.min(data.levels.length, currentLevel.id + 1));
    saveProgress();
    renderLevels();

    ui.completeTitle.textContent = currentLevel.id === data.levels.length ? "¡Llegaste a casa!" : `¡${currentLevel.name} superado!`;
    ui.starsResult.textContent = "★".repeat(stars) + "☆".repeat(3 - stars);
    ui.resultTime.textContent = formatTime(levelRuntime.elapsed);
    ui.resultFish.textContent = `${levelRuntime.collectedFish}/${levelRuntime.fish.length}`;
    ui.resultDeaths.textContent = levelRuntime.deaths;
    ui.resultTip.textContent = stars === 3
      ? "¡Perfecto! Completaste el nivel como un verdadero michi profesional."
      : "Para conseguir 3 estrellas, busca todos los pescados y trata de evitar caídas.";
    ui.nextLevelBtn.textContent = currentLevel.id === data.levels.length ? "Volver a niveles" : "Siguiente nivel";

    ui.completeOverlay.classList.add("active");
    playVictory();
  }

  function nextLevel() {
    ui.completeOverlay.classList.remove("active");
    if (currentLevel.id >= data.levels.length) {
      switchScreen("levels");
      currentWorldFilter = 3;
      renderWorldTabs();
      renderLevels();
      return;
    }
    startLevel(currentLevel.id + 1);
  }

  function updateHud() {
    if (!currentLevel || !levelRuntime) return;
    ui.hudWorld.textContent = `Mundo ${currentLevel.world} · ${currentLevel.worldName}`;
    ui.hudLevelName.textContent = `${currentLevel.id}. ${currentLevel.name}`;
    ui.fishCounter.textContent = `${levelRuntime.collectedFish}/${levelRuntime.fish.length}`;
    ui.timeCounter.textContent = formatTime(levelRuntime.elapsed);
    ui.deathCounter.textContent = String(levelRuntime.deaths);
  }

  function drawGame() {
    if (!currentLevel || !levelRuntime) return;

    const rt = levelRuntime;
    const theme = COLORS[currentLevel.theme] || COLORS.home;
    const cameraX = rt.cameraX;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawSky(theme);
    drawParallax(cameraX, theme);
    drawPlatforms(cameraX, theme);
    drawHazards(cameraX);
    drawSprings(cameraX);
    drawFish(cameraX);
    drawKey(cameraX);
    drawDoor(cameraX);
    rt.enemies.forEach(enemy => enemy.draw(cameraX));
    rt.particles.forEach(particle => particle.draw(cameraX));
    rt.player.draw(cameraX);
    drawForeground(cameraX, theme);

    if (paused) {
      ctx.fillStyle = "rgba(10,8,16,.18)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  function drawSky(theme) {
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, theme.skyTop);
    grad.addColorStop(1, theme.skyBottom);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // stars / dust
    const t = performance.now() * .0001;
    for (let i = 0; i < 36; i++) {
      const x = (i * 173 + 77) % canvas.width;
      const y = (i * 83 + 46) % 310;
      const alpha = .22 + Math.sin(t * 8 + i) * .08;
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, i % 5 === 0 ? 2 : 1, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "rgba(255,241,187,.82)";
    ctx.beginPath();
    ctx.arc(canvas.width - 150, 120, 54, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawParallax(cameraX, theme) {
    // far skyline / hills
    ctx.save();
    ctx.translate(-(cameraX * .15) % 520, 0);
    for (let i = -1; i < 5; i++) {
      const baseX = i * 520;
      ctx.fillStyle = theme.far;

      if (currentLevel.theme === "garden") {
        for (let h = 0; h < 5; h++) {
          const x = baseX + h * 110;
          const y = 390 + (h % 2) * 20;
          ctx.beginPath();
          ctx.arc(x, y, 90, Math.PI, 0);
          ctx.fill();
        }
      } else {
        for (let b = 0; b < 6; b++) {
          const x = baseX + b * 90;
          const h = 110 + ((b * 47) % 120);
          ctx.fillRect(x, 500 - h, 68, h);
          if (currentLevel.theme === "city") {
            ctx.fillStyle = "rgba(255,216,107,.16)";
            for (let wy = 500 - h + 20; wy < 470; wy += 30) {
              for (let wx = x + 14; wx < x + 58; wx += 24) {
                ctx.fillRect(wx, wy, 6, 9);
              }
            }
            ctx.fillStyle = theme.far;
          }
        }
      }
    }
    ctx.restore();

    // nearer haze
    ctx.fillStyle = "rgba(20,17,35,.08)";
    ctx.fillRect(0, 500, canvas.width, 220);
  }

  function drawPlatforms(cameraX, theme) {
    for (const p of currentLevel.platforms) {
      const x = p.x - cameraX;
      if (x + p.w < -40 || x > canvas.width + 40) continue;

      ctx.fillStyle = "rgba(18,14,26,.18)";
      roundRect(x + 8, p.y + 9, p.w, p.h, 12, "rgba(25,20,33,.16)");

      roundRect(x, p.y, p.w, p.h, 10, theme.platform);
      ctx.fillStyle = theme.platformTop;
      roundRect(x, p.y, p.w, Math.min(14, p.h), 10, theme.platformTop);

      if (currentLevel.theme === "home") {
        ctx.fillStyle = "rgba(255,255,255,.08)";
        for (let i = 22; i < p.w; i += 80) {
          ctx.fillRect(x + i, p.y + 28, 42, 4);
        }
      } else if (currentLevel.theme === "garden") {
        ctx.fillStyle = "rgba(32,81,52,.34)";
        for (let i = 16; i < p.w; i += 34) {
          ctx.beginPath();
          ctx.moveTo(x + i, p.y);
          ctx.lineTo(x + i + 6, p.y - 9);
          ctx.lineTo(x + i + 11, p.y);
          ctx.fill();
        }
      } else {
        ctx.fillStyle = "rgba(255,255,255,.07)";
        for (let i = 20; i < p.w; i += 55) {
          ctx.fillRect(x + i, p.y + 28, 24, 5);
        }
      }
    }
  }

  function drawHazards(cameraX) {
    for (const h of currentLevel.hazards) {
      const x = h.x - cameraX;
      if (x + h.w < -30 || x > canvas.width + 30) continue;

      if (h.type === "water") {
        ctx.fillStyle = "#55a8c7";
        ctx.fillRect(x, h.y, h.w, h.h);
        ctx.strokeStyle = "rgba(255,255,255,.5)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let i = 0; i <= h.w; i += 24) {
          const yy = h.y + Math.sin((performance.now() * .005) + i) * 3;
          if (i === 0) ctx.moveTo(x + i, yy);
          else ctx.lineTo(x + i, yy);
        }
        ctx.stroke();
      } else if (h.type === "spikes") {
        ctx.fillStyle = "#d9d6e7";
        for (let i = 0; i < h.w; i += 18) {
          ctx.beginPath();
          ctx.moveTo(x + i, h.y + h.h);
          ctx.lineTo(x + i + 9, h.y);
          ctx.lineTo(x + i + 18, h.y + h.h);
          ctx.fill();
        }
      } else if (h.type === "road") {
        ctx.fillStyle = "#2f3246";
        ctx.fillRect(x, h.y, h.w, h.h);
        ctx.fillStyle = "#f4cb68";
        ctx.fillRect(x + 8, h.y + 16, h.w - 16, 5);
      } else {
        const grad = ctx.createLinearGradient(0, h.y, 0, h.y + h.h);
        grad.addColorStop(0, "rgba(29,22,42,.75)");
        grad.addColorStop(1, "rgba(12,10,18,.95)");
        ctx.fillStyle = grad;
        ctx.fillRect(x, h.y, h.w, h.h);
      }
    }
  }

  function drawSprings(cameraX) {
    for (const s of levelRuntime.springs) {
      const x = s.x - cameraX;
      ctx.fillStyle = "#433f5e";
      roundRect(x, s.y + 18, s.w, 17, 5, "#433f5e");
      ctx.strokeStyle = "#66e3c4";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(x + 8, s.y + 18);
      ctx.lineTo(x + 18, s.y + 4);
      ctx.lineTo(x + 28, s.y + 18);
      ctx.lineTo(x + 38, s.y + 4);
      ctx.stroke();
      roundRect(x + 2, s.y, s.w - 4, 8, 4, "#7ef0d3");
    }
  }

  function drawFish(cameraX) {
    for (const fish of levelRuntime.fish) {
      if (fish.collected) continue;
      const x = fish.x - cameraX;
      const y = fish.y + Math.sin(performance.now() * .004 + fish.phase) * 5;

      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = "#ffd86b";
      ctx.beginPath();
      ctx.ellipse(0, 0, 15, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-12, 0);
      ctx.lineTo(-24, -10);
      ctx.lineTo(-24, 10);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#473447";
      ctx.beginPath();
      ctx.arc(6, -2, 1.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(255,216,107,.24)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 24 + Math.sin(performance.now()*.006)*3, 0, Math.PI*2);
      ctx.stroke();
      ctx.restore();
    }
  }

  function drawKey(cameraX) {
    const key = levelRuntime.key;
    if (!key || key.collected) return;
    const x = key.x - cameraX;
    const y = key.y + Math.sin(performance.now()*.005) * 5;

    ctx.save();
    ctx.translate(x + 14, y + 14);
    ctx.strokeStyle = "#ffe17c";
    ctx.lineWidth = 7;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(-6, -2, 8, 0, Math.PI*2);
    ctx.moveTo(2, 3);
    ctx.lineTo(16, 17);
    ctx.lineTo(21, 12);
    ctx.moveTo(12, 13);
    ctx.lineTo(17, 8);
    ctx.stroke();
    ctx.restore();
  }

  function drawDoor(cameraX) {
    const d = currentLevel.door;
    const x = d.x - cameraX;
    const locked = d.locked && !levelRuntime.player.hasKey;

    ctx.save();
    ctx.translate(x, d.y);
    roundRect(0, 0, d.w, d.h, 13, locked ? "#715d7e" : "#6bc5a5");
    ctx.fillStyle = locked ? "#8c7896" : "#8ee2c3";
    roundRect(8, 8, d.w - 16, d.h - 8, 9, ctx.fillStyle);

    ctx.fillStyle = "#2e2941";
    ctx.beginPath();
    ctx.arc(d.w - 17, d.h / 2, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = "22px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(locked ? "🔒" : "✨", d.w / 2, -12);
    ctx.restore();
  }

  function drawForeground(cameraX, theme) {
    const offset = -(cameraX * .52) % 260;
    ctx.save();
    ctx.translate(offset, 0);
    ctx.globalAlpha = .18;
    for (let i = -2; i < 8; i++) {
      const x = i * 260 + 40;
      if (currentLevel.theme === "garden") {
        ctx.fillStyle = "#2b5a4d";
        ctx.beginPath();
        ctx.arc(x, 680, 80, Math.PI, 0);
        ctx.fill();
      } else if (currentLevel.theme === "home") {
        ctx.fillStyle = "#3a2e46";
        ctx.fillRect(x, 650, 90, 70);
      } else {
        ctx.fillStyle = "#23263b";
        ctx.fillRect(x, 668, 120, 52);
      }
    }
    ctx.restore();
  }

  function spawnParticles(x, y, count, color, speed = 140) {
    for (let i = 0; i < count; i++) {
      levelRuntime.particles.push(new Particle(x, y, color, speed));
    }
  }

  function roundRect(x, y, w, h, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fill();
  }

  function rectsOverlap(a, b) {
    return a.x < b.x + b.w &&
           a.x + a.w > b.x &&
           a.y < b.y + b.h &&
           a.y + a.h > b.y;
  }

  function approach(value, target, amount) {
    if (value < target) return Math.min(value + amount, target);
    if (value > target) return Math.max(value - amount, target);
    return target;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function formatTime(seconds) {
    const total = Math.floor(seconds);
    const minutes = Math.floor(total / 60);
    const secs = total % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  function showToast(text) {
    clearTimeout(toastTimer);
    ui.toast.textContent = text;
    ui.toast.classList.add("show");
    toastTimer = setTimeout(() => ui.toast.classList.remove("show"), 1550);
  }

  function ensureAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx?.state === "suspended") audioCtx.resume();
  }

  function playTone(freq, duration = .08, type = "sine", volume = .03) {
    if (!soundEnabled) return;
    ensureAudio();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(.0001, audioCtx.currentTime + duration);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  }

  function playVictory() {
    if (!soundEnabled) return;
    [523, 659, 784, 1046].forEach((freq, index) => {
      setTimeout(() => playTone(freq, .14, "triangle", .035), index * 90);
    });
  }

  function setPaused(value) {
    if (!currentLevel || completed) return;
    paused = value;
    ui.pauseOverlay.classList.toggle("active", paused);
    if (!paused) lastTime = performance.now();
  }

  function resetPressedInputs() {
    input.jumpPressed = false;
    input.interactPressed = false;
  }

  // UI events
  ui.playBtn.addEventListener("click", () => {
    const target = Math.min(progress.unlocked, data.levels.length || 1);
    startLevel(target);
  });

  ui.levelsBtn.addEventListener("click", () => {
    renderLevels();
    switchScreen("levels");
  });

  document.querySelectorAll("[data-action='home']").forEach(button => {
    button.addEventListener("click", () => switchScreen("home"));
  });

  ui.menuBtn.addEventListener("click", () => setPaused(true));
  ui.resumeBtn.addEventListener("click", () => setPaused(false));
  ui.restartBtn.addEventListener("click", restartLevel);
  ui.pauseRestartBtn.addEventListener("click", restartLevel);
  ui.completeRetryBtn.addEventListener("click", restartLevel);
  ui.nextLevelBtn.addEventListener("click", nextLevel);

  ui.pauseLevelsBtn.addEventListener("click", () => {
    paused = false;
    ui.pauseOverlay.classList.remove("active");
    switchScreen("levels");
    renderLevels();
  });

  ui.soundBtn.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    ui.soundBtn.textContent = soundEnabled ? "🔊" : "🔇";
    if (soundEnabled) playTone(520, .08, "sine", .03);
  });

  // Keyboard controls
  const keyMap = {
    ArrowLeft: "left",
    a: "left",
    A: "left",
    ArrowRight: "right",
    d: "right",
    D: "right",
    ArrowUp: "jump",
    w: "jump",
    W: "jump",
    " ": "jump",
    e: "interact",
    E: "interact"
  };

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && screens.game.classList.contains("screen--active")) {
      event.preventDefault();
      setPaused(!paused);
      return;
    }

    const action = keyMap[event.key];
    if (!action) return;
    event.preventDefault();

    if (action === "jump" && !input.jump) input.jumpPressed = true;
    if (action === "interact" && !input.interact) input.interactPressed = true;
    input[action] = true;
    ensureAudio();
  });

  window.addEventListener("keyup", (event) => {
    const action = keyMap[event.key];
    if (!action) return;
    input[action] = false;
  });

  // Touch controls
  document.querySelectorAll("[data-touch]").forEach(button => {
    const action = button.dataset.touch;

    const press = (event) => {
      event.preventDefault();
      if (action === "jump" && !input.jump) input.jumpPressed = true;
      if (action === "interact" && !input.interact) input.interactPressed = true;
      input[action] = true;
      ensureAudio();
    };

    const release = (event) => {
      event.preventDefault();
      input[action] = false;
    };

    button.addEventListener("pointerdown", press);
    button.addEventListener("pointerup", release);
    button.addEventListener("pointercancel", release);
    button.addEventListener("pointerleave", release);
  });

  // Prevent stuck keys
  window.addEventListener("blur", () => {
    input.left = input.right = input.jump = input.interact = false;
  });

  // Scale game internally while preserving crisp 16:9 coordinates
  function resizeCanvas() {
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    // Maintain logical coordinates at 1280x720 for gameplay.
    canvas.width = 1280;
    canvas.height = 720;
    ctx.imageSmoothingEnabled = true;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  loadGameData();
})();
