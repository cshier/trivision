/*
TODO:
  URL Saving
  curl https://api.upload.io/v1/files/FW25au86ZT39EAHCLS8LyMD \-X DELETE \
-u apikey:public_FW25au8414mD1b8ErD179P3JNWyv 
*/
console.clear();

const upload = new Upload({ apiKey: "public_FW25au8414mD1b8ErD179P3JNWyv" });

const cfg = {
  slat: {
    count: 113,
    width: 0.75,
    height: 50,
    spread: 1.2,
    radius: 1 / 3.5,
    rFreq: 0,
    rRate: 0.0025,
    rRot: 0,
    rTime: 0,
    colourA: "rgb(255,0,0)",
    colourB: "rgb(0,255,0)",
    colourC: "rgb(0,0,255)",
    time: 0.0011,
    play: 1,
    now: 0,
    time1: 0,
    time2: 0,
    wave1: { x: 2.35, y: 1.18 },
    wave2: { x: -2.65, y: -0.29 }
  },
  tex: [
    {
      src: "https://upcdn.io/FW25au8PPa8RbghYaRWwJE5",
      rep: { u: 16 / 9 / 40, t: 1 },
      off: { x: 0, y: 0 }
    },
    {
      src: "https://upcdn.io/FW25au8VASUmTxN3D37o6tg",
      rep: { u: 16 / 9 / 40, t: 1 },
      off: { x: 0, y: 0 }
    },
    {
      src: "https://upcdn.io/FW25au8MEH2S8RDeQRVEQtb",
      rep: { u: 16 / 9 / 40, t: 1 },
      off: { x: 0, y: 0 }
    }
  ],
  scene: {
    mainLight: 1
  },
  camera: {
    near: 0.1,
    far: 0,
    zoom: 2
  },
  bg: {
    url: "/img/bghires.png"
  },
  title: "Default",
  preset: "",
  outputSize: { x: window.innerWidth, y: window.innerHeight }
};

function hidePane(e) {
  if (e.key === "`") {
    pane.hidden = !pane.hidden;
  }
}

window.addEventListener("keydown", hidePane);

const pane = new Tweakpane.Pane({
  title: "Controls",
  hidden: false,
  expanded: false
});
pane.registerPlugin(TweakpaneInfodumpPlugin);
setTimeout(function () {
  pane.expanded = true;
}, 2400);

pane.folders = {};

pane.folders.bg = pane.addFolder({
  title: "background",
  expanded: true,
  hidden: true
});
pane.folders.waves = pane.addFolder({
  title: "Waves",
  hidden: false,
  index: 2
});

// pane.folders.waves.addMonitor(cfg.slat, "now");

pane.folders.waves.addInput(cfg.slat, "time", {
  min: -0.05,
  max: 0.05,
  presetKey: "time"
});

pane.folders.waves.addInput(cfg.slat, "wave1", { presetKey: "wave1" });

// pane.folders.waves.addMonitor(cfg.slat, "time1", { presetKey: "time1" });

pane.folders.waves.addInput(cfg.slat, "wave2", { presetKey: "wave2" });

// pane.folders.waves.addMonitor(cfg.slat, "time2", { presetKey: "wave2" });
pane.pauseButton = pane.folders.waves.addButton({
  title: "Pause"
});

pane.pauseButton.count = 0;

pane.pauseButton.on("click", () => {
  pane.pauseButton.count += 1;
  if (pane.pauseButton.count % 2 === 0) {
    console.log("Playing");
    cfg.slat.play = 1;
    pane.pauseButton.title = "Pause";
  } else {
    console.log("Paused");
    cfg.slat.play = 0;
    pane.pauseButton.title = "Play";
  }
});

pane.folders.slats = pane.addFolder({
  title: "Slats",
  expanded: true,
  index: 2
});

pane.folders.slats
  .addInput(cfg.slat, "count", {
    min: 1,
    max: 300,
    step: 1,
    presetKey: "slatCount"
  })
  .on("change", (e) => {
    console.log(e.value);
  });

pane.folders.slats.addInput(cfg.slat, "width", {
  min: 0,
  max: 10,
  disabled: false,
  presetKey: "slatWidth"
});

pane.folders.slats.addInput(cfg.slat, "radius", {
  min: 0,
  max: 2,
  disabled: false,
  presetKey: "slatRadius"
});

pane.folders.slats.addInput(cfg.slat, "spread", {
  min: 0.01,
  max: 10,
  disabled: false,
  presetKey: "slatSpread"
});

// pane.folders.slats.addInput(cfg.slat, "colourA", {
//   picker: "inline",
//   expanded: false,
//   hidden: true
// });

// pane.folders.slats.addInput(cfg.slat, "colourB", {
//   picker: "inline",
//   expanded: false,
//   hidden: true
// });

// pane.folders.slats.addInput(cfg.slat, "colourC", {
//   picker: "inline",
//   expanded: false,
//   hidden: true
// });

pane.folders.slats
  .addButton({
    title: "createMeshes",
    hidden: true
  })
  .on("click", () => {
    console.log("createMeshes button clicked, ", cfg.slat);
    createMeshes();
  });

pane.folders.slats.on("change", (e) => {
  console.log("Slats Folder Changed", e.value);
  createMeshes();
});

pane.folders.tex = pane.addFolder({
  title: "Sides",
  expanded: true,
  hidden: false,
  index: 1
});

let inputA = document.createElement("input");
inputA.type = "file";
const uploadA = upload.createFileInputHandler({
  onUploaded: ({ fileUrl, fileId }) => {
    cfg.tex[0].src = fileUrl;
    console.log("uploadA", fileId, fileUrl, cfg.tex);
    images.load();
    // pane.disabled = false
    pane.refresh();
  }
});
inputA.addEventListener("change", uploadA, false);
pane.folders.tex
  .addButton({
    title: "upload Texture A"
  })
  .on("click", () => {
    console.log("inputA clicked");
    // pane.disabled = true
    inputA.click();
  });

let inputB = document.createElement("input");
inputB.type = "file";
const uploadB = upload.createFileInputHandler({
  onUploaded: ({ fileUrl, fileId }) => {
    cfg.tex[1].src = fileUrl;
    console.log("uploadB", fileId, fileUrl, cfg.tex);
    images.load();
    pane.refresh();
  }
});
inputB.addEventListener("change", uploadB, false);
pane.folders.tex
  .addButton({
    title: "upload Texture B"
  })
  .on("click", () => {
    console.log("inputB clicked");
    inputB.click();
  });

let inputC = document.createElement("input");
inputC.type = "file";
const uploadC = upload.createFileInputHandler({
  onUploaded: ({ fileUrl, fileId }) => {
    cfg.tex[2].src = fileUrl;
    console.log("uploadC", fileId, fileUrl, cfg.tex);
    images.load();
    pane.refresh();
  }
});
inputC.addEventListener("change", uploadC, false);
pane.folders.tex
  .addButton({
    title: "upload Texture C"
  })
  .on("click", () => {
    console.log("inputC clicked");
    inputC.click();
  });

pane.folders.tex.addInput(cfg.tex[0], "src", {
  label: "src A",
  presetKey: "texAsrc",
  hidden: true
});

pane.folders.tex.addInput(cfg.tex[1], "src", {
  label: "src B",
  presetKey: "texBsrc",
  hidden: true
});

pane.folders.tex.addInput(cfg.tex[2], "src", {
  label: "src C",
  presetKey: "texCsrc",
  hidden: true
});

pane.folders.tex.loadButtonA = pane.folders.tex
  .addButton({
    title: "Load",
    hidden: true
    // label: "texA" // optional
  })
  .on("click", () => {
    images.load();
  });

// pane.folders.bg.addInput(cfg.bg, "url").on("change", (ev) => {
//   document.body.style.backgroundImage = "url(" + ev.value + ")";
// });

pane.folders.tex.on("change", (ev) => {
  console.log("changed: " + JSON.stringify(ev.value));
  createMeshes();
});

const OUTPUT = {
  string: "",
  json: ""
};

// PRESET PANE begin

pane.folders.preset = pane.addFolder({
  hidden: true,
  title: "presets"
});

pane.folders.preset.addInput(cfg, "title", {
  index: 0
});

let presetDropdown = {};
let presetList = {};

presetDropdown.spawn = function () {
  presetDropdown.folder = pane.folders.preset
    .addInput(cfg, "preset", {
      index: 1,
      label: "load",
      options: (function () {
        for (let i = 0; i < localStorage.length; i++) {
          let storedValue = localStorage.getItem(localStorage.key([i]));
          let presetBody = {};
          if (storedValue.includes("title")) {
            // console.log("storedValue,", i, JSON.parse(storedValue));
            presetBody = JSON.parse(storedValue);
            presetList[presetBody.title] = presetBody.title;
          }
        }
        console.log("presetList", presetList);
        if (typeof presetList !== undefined) {
          console.log("localStored presets found", presetList);
          return presetList;
        } else {
          console.log("no localStorage presets found");
          pane.save();
          return {
            Default: ""
          };
        }
      })()
    })
    .on("change", (e) => {
      console.log("switch change", e.value);
      cfg.title = e.value;
      pane.load();
      pane.refresh();
    });
};

presetDropdown.spawn();

presetDropdown.refresh = function () {
  presetDropdown.folder.dispose();
  presetDropdown.spawn();
};

pane.save = function () {
  cfg.preset = cfg.title;
  updatePaneOutput();
  localStorage.setItem(cfg.title, OUTPUT.string);
  console.log("saving ", cfg.title, OUTPUT.string);
  presetDropdown.refresh();
};

pane.saveButton = pane.folders.preset.addButton({
  title: "save as title"
});

pane.saveButton.on("click", () => {
  pane.save();
});

pane.load = function () {
  console.log(
    "loading",
    cfg.title,
    cfg.preset,
    localStorage.getItem(cfg.title)
  );
  pane.importPreset(JSON.parse(localStorage.getItem(cfg.preset)));
};

pane.loadButton = pane.folders.preset
  .addButton({
    title: "load",
    hidden: true
  })
  .on("click", () => {
    pane.load();
  });

pane.reset = function () {
  localStorage.clear();
  pane.save();
  presetDropdown.refresh();
  pane.refresh();
  console.log("cleared localstorage", localStorage);
};

pane.clearButton = pane.folders.preset
  .addButton({
    title: "clear all presets",
    hidden: true
  })
  .on("click", () => {
    pane.reset();
  });

pane.folders.preset
  .addButton({
    title: "console.log(localStorage)",
    hidden: true
  })
  .on("click", () => {
    console.log(localStorage);
  });

pane.folders.preset
  .addButton({
    title: "pane.refresh()",
    hidden: true
  })
  .on("click", () => {
    pane.refresh();
  });

// PRESET PANE end

pane.folders.share = pane.addFolder({
  title: "Share",
  expanded: true,
  index: 0
});

const types = [
  "video/webm",
  "video/mpeg",
  "video/quicktime",
  "video/ogg",
  "video/mov",
  "video/mp4"
];

for (const type of types) {
  console.log(
    `Is ${type} supported? ${
      MediaRecorder.isTypeSupported(type) ? "Maybe!" : "Nope :("
    }`
  );
}

var supportedMimeType;
if (MediaRecorder.isTypeSupported("video/mp4")) {
  supportedMimeType = "video/mp4";
} else {
  supportedMimeType = "video/webm";
}

function recordVideo(canvas, time) {
  var recordedChunks = [];
  return new Promise(function (res, rej) {
    var stream = canvas.captureStream(60 /*fps*/);

    console.log(`supportedMimeType is ${supportedMimeType}`);

    mediaRecorder = new MediaRecorder(stream, {
      mimeType: supportedMimeType
    });

    //ondataavailable will fire in interval of `time || 4000 ms`
    mediaRecorder.start(time || 4000);

    mediaRecorder.ondataavailable = function (event) {
      recordedChunks.push(event.data);
      // after stop `dataavilable` event run one more time
      if (mediaRecorder.state === "recording") {
        mediaRecorder.stop();
      }
    };

    mediaRecorder.onstop = function (event) {
      var blob = new Blob(recordedChunks, { type: supportedMimeType });
      var url = URL.createObjectURL(blob);
      res(url);
      onWindowResize();
    };
  });
}

function exportVideo(duration, width, height) {
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  // renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setSize(width, height);
  const recording = recordVideo(renderer.domElement, duration);
  // play it on another video element
  var video$ = document.createElement("video");
  document.body.appendChild(video$);
  recording.then((url) => video$.setAttribute("src", url));

  // download it
  var link$ = document.createElement("a");
  link$.setAttribute("download", "recordingVideo");
  recording.then((url) => {
    link$.setAttribute("href", url);
    link$.click();
    // renderer.setSize(window.innerWidth, window.innerHeight);
    onWindowResize();
  });
  console.log("capturer started");
}

// pane.folders.share = pane.addFolder({
//   title: "video"
// });

pane.folders.share.exportButton = pane.folders.share
  .addButton({
    title: `Save ${supportedMimeType} vert 1080p`
  })
  .on("click", () => exportVideo(10000, 1080, 1920));
pane.folders.share.exportButton = pane.folders.share
  .addButton({
    title: `Save ${supportedMimeType} horiz 1080p`
  })
  .on("click", () => exportVideo(10000, 1920, 1080));

pane.folders.share.addSeparator();

pane.saveImageButton = pane.folders.share
  .addButton({
    title: "Save Image"
  })
  .on("click", () => {
    let oldWidth = renderer.width;
    let oldHeight = renderer.height;
    renderer.setSize(cfg.outputSize.x, cfg.outputSize.y);
    renderer.render(scene, camera);
    camera.aspect = container.clientWidth / container.clientHeight;
    // Update camera frustum
    camera.updateProjectionMatrix();
    let dataURL = renderer.domElement.toDataURL();
    // window.open(dataURL);
    const link = document.createElement("a");
    link.download = "download.png";
    link.href = dataURL;
    link.click();
    // link.delete;
    renderer.setSize(oldWidth, oldHeight);
    onWindowResize();
    // renderer.setSize(oldWidth, oldHeight);

    // renderer.width = oldWidth
    // renderer.height = oldHeight
  });

// pane.folders.share.addInput(cfg, "outputSize", {
//   label: 'width & height',
//   x: { step: 1 },
//   y: { step: 1 }
// });

pane.folders.share.addInput(cfg.outputSize, "x", {
  label: "Img width",
  step: 1
});

pane.folders.share.addInput(cfg.outputSize, "y", {
  label: "Img height",
  step: 1
});

pane.folders.share.addMonitor(OUTPUT, "string", {
  hidden: true,
  multiline: true
});

function updatePaneOutput() {
  OUTPUT.json = pane.exportPreset();
  OUTPUT.string = JSON.stringify(pane.exportPreset(), null, 2);
}

pane.on("change", (e) => {
  console.log(e.value);
  // testUrl()
  updatePaneOutput();
  pane.refresh();
});

function copyUrlToClipboard(){
  if(!navigator.clipboard){
    console.log(`no access to clipboard`)
    return
  } else {
    try {
      navigator.clipboard.writeText(`${window.location.href}`)
      pane.folders.share.copiedText = pane.folders.share.addBlade({
        view: "infodump",
        border: false,
        markdown: false,
        content: "The URL for your page has been copied to clipboard!"
      })
      setTimeout(() => {
        pane.folders.share.copiedText.dispose()
      }, 6000)
    } catch (error) {
      console.log(`error writing url to clipboard: `, error)
    }
  }
};

async function saveTriToDb(httpMethod) {
  try {
    let config = pane.exportPreset();
    let apiUrl = `/api/`;
    if (window.location.pathname.split("/")[1]) {
      config.url = window.location.pathname.split("/")[1];
      config.pass = cfg.pass;
      apiUrl += config.url;
    } else {
      apiUrl += `new-trivision`;
    }
    const cfgToSave = JSON.stringify(config);
    let fetchRes = await window.fetch(apiUrl, {
      method: httpMethod, //or PUT to update a save, but one thing at a time
      headers: {
        "Content-Type": "application/json"
      },
      body: cfgToSave
    });
    let fetchData = await fetchRes.json();
    if (fetchRes.ok) {
      if (fetchData.acknowledged === true) {
        document.title = `Stellar Drifting - ${fetchData.url}`;
        if (fetchData.url && fetchData.pass) {
          window.history.pushState(null, document.title, fetchData.url);
          window.localStorage.setItem(fetchData.url, fetchData.pass);
          cfg.pass = fetchData.pass;
          copyUrlToClipboard()
        }
      } else {
        throw new Error(`shape of the obj returning from Mongo is mestup`);
      }
    } else {
      //data.status is a custom obj. made by us on the server
      //res.status is the HTTP status code and always exists
      //so if it's an error we "expected", console log it
      //otherwise, console log the HTTP status code
      if (fetchData.status) {
        throw new Error(fetchData.status);
      } else {
        throw new Error(fetchRes.status);
      }
    }
  } catch (error) {
    console.log(`error saving Triface to DB: `, error.message);
  }
}

async function deleteTriFromDb(pass){
  if(confirm(`Are you sure you want to delete this page? This action cannot be undone.`)){
    try {
      let delteRes = await window.fetch(`/api/${window.location.pathname.split("/")[1]}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          pass
        })
      })
      if(delteRes.ok){
        window.location.assign('/')
      }
    } catch (error) {
      console.log(`failed to delete triface: `, error)
    }
  } else {
    return
  }
}

async function checkPass(userPass){
  let checkPassRes = await window.fetch('/api/check-pass', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      url: window.location.pathname.split("/")[1],
      pass: userPass
    })
  })
  console.log(`whats up with checkPassRes: `, checkPassRes)
  if(checkPassRes.ok){
    return true
  } else if(checkPassRes.status === 401){
    return false
  } else {
    let checkPassData = await checkPassRes.json()
    console.log(`Error checking password: `, checkPassData.status)
    return false
  }
}

async function getConfigFromUrl() {
  await window
    .fetch(`/api/${window.location.pathname.split("/")[1]}`)
    .then(async (res) => {
      if (res.ok) {
        res.json().then((data) => {
          pane.importPreset(data);
        });
      } else {
        console.log(`error fetching url from the DB`);
        window.location.assign("/");
      }
    })
    .catch((err) => {
      console.log(err);
      window.location.assign("/");
    });
}

async function testUrl() {
  if (window.location.pathname.split("/")[1]) {
    await getConfigFromUrl()
    const pathname = window.location.pathname.split("/")[1];
    cfg.pass = localStorage.getItem(pathname);
    //pass found in localStorage
    if (cfg.pass) {
      if(pane.folders.share.shareButton){
        pane.folders.share.shareButton.dispose()
      }
      if(pane.folders.share.hasPass && pane.folders.share.passphrase){
        pane.folders.share.hasPass.dispose()
        pane.folders.share.passphrase.dispose()
      }
      pane.folders.share.hasPass = pane.folders.share.addBlade({
        view: "infodump",
        border: false,
        markdown: false,
        content:
          "Copy and keep this passphrase to modify or delete this page later!"
      });
      pane.folders.share.passphrase = pane.folders.share
        .addBlade({
          view: "text",
          label: "Passphrase",
          parse: (v) => String(v),
          value: cfg.pass
        })
      pane.folders.share.shareButton = pane.folders.share
        .addButton({
          title: "modify page"
        })
        .on("click", async () => {
          await saveTriToDb("PUT");
        });
      pane.folders.share.deleteButton = pane.folders.share
        .addButton({
          title: "Delete this page",
        })
        .on("click", async() => {
          await deleteTriFromDb(cfg.pass)
        })
      pane.folders.share.deleteButton.element.querySelector('button').style.backgroundColor = "#ee9c9c"
      // console.log(pane.folders.share.deleteButton.element.querySelector('button'))
    //no pass in LocalStorage
    } else {
      pane.folders.share.hasPass = pane.folders.share.addBlade({
        view: "infodump",
        border: false,
        markdown: false,
        content:
          "if you're the maker of this page, input the passphrase to modify or delete it: "
      });
      pane.folders.share.passphrase = pane.folders.share
        .addBlade({
          view: "text",
          label: "Passphrase",
          parse: (v) => String(v),
          value: ""
        })
        .on("change", async (ev) => {
          console.log(`is pass good?`)
          let passGood = await checkPass(ev.value)
          if(passGood){
            localStorage.setItem(pathname, ev.value)
            testUrl()
          } else {
            pane.folders.share.badPass = pane.folders.share.addBlade({
              view: "infodump",
              border: false,
              markdown: false,
              content: "Passphrases don't match :("
            })
            setTimeout(() => {
              pane.folders.share.badPass.dispose()
            }, 6000)
          }
        });
      // pane.folders.share.expanded = false
    }
    pane.folders.share.copyToClip = pane.folders.share
      .addButton({
        title: "Copy URL to clipboard",
        index: 0
      })
      .on("click", copyUrlToClipboard)
      return true
  } else {
    pane.folders.share.shareButton = pane.folders.share
      .addButton({
        title: "Share page"
      })
      .on("click", async () => {
        await saveTriToDb("POST");
        testUrl()
        updatePaneOutput();
        pane.refresh();
      });
      return false
  }
}

/*

THREEJS

*/

let container;
let camera;
let camera2;
let renderer;
let scene;
// let mesh;
// let group;
// let controls;
let mainLight;
let slats = [];
// let f = 0;
// let currentSlatCount = 0;

const PI = Math.PI;
const TAU = Math.PI * 2;

function sin(n) {
  return Math.sin(n);
}

function cos(n) {
  return Math.cos(n);
}

function createCamera() {
  const fov = 35;
  const aspect = container.clientWidth / container.clientHeight;
  const near = 0.1;
  const far = 500;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  scene.add(camera);
  camera.position.set(0, 0, cfg.slat.count / aspect);

  // camera2 = new THREE.PerspectiveCamera(fov, aspect, near, far);
  // camera2.position.copy(camera.position);
}

function createLights() {
  mainLight = new THREE.AmbientLight(0xffffff, 1.75);
  scene.add(mainLight);
}

// function updateCamera() {
// camera.position.set(0, 0, cfg.slat.count / 1.25);
// }

function returnProxy(url) {
  // disabled for local file hosting
  return url;
}

const textureLoader = new THREE.TextureLoader();
textureLoader.crossOrigin = "anonymous";
textureLoader.setCrossOrigin("anonymous");
const textures = [];
const mats = [];
for (let i = 0; i < 3; i++) {
  mats[i] = new THREE.MeshStandardMaterial({ color: 0xffffff });
}
let slatGeometry = new THREE.PlaneBufferGeometry(
  cfg.slat.width,
  cfg.slat.height
);

const images = {
  loaded: 0,
  hasLoaded: function (index, e) {
    images.loaded++;
    const tex = textures[index];
    tex.minFilter = THREE.LinearFilter;
    tex.encoding = THREE.sRGBEncoding;
    // tex.wrapS = ClampToEdgeWrapping;
    // tex.wrapT = ClampToEdgeWrapping;
    tex.repeat.set(cfg.tex[index].rep.u, cfg.tex[index].rep.t);
    updateSlatsTexture(index);
    if (images.loaded === 3) {
      container.style.visibility = "visible";
    }
  },
  load: function () {
    console.log("images.load begun");
    images.loaded = 0;
    for (let i = 0; i < 3; i++) {
      textures[i] = textureLoader.load(
        returnProxy(cfg.tex[i].src),
        images.hasLoaded.bind(null, i)
      );
    }
  }
};

function xOffset(slatIndex) {
  return slatIndex * cfg.slat.spread - (cfg.slat.count / 2) * cfg.slat.spread;
}

function createSlatGroup(slatIndex) {
  const group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const mat = createSlatMat(slatIndex, i);
    const mesh = new THREE.Mesh(slatGeometry, mat);
    mesh.position.set(
      sin(((i + 1) * TAU) / 3) * cfg.slat.radius,
      0,
      cos(((i + 1) * TAU) / 3) * cfg.slat.radius
    );
    mesh.rotation.y = ((i + 1) * TAU) / 3;
    group.add(mesh);
  }
  group.position.x = xOffset(slatIndex);
  return group;
}

function createSlatMat(slatIndex, textureIndex) {
  const mat = mats[textureIndex].clone();
  if (textures?.[textureIndex]?.clone) {
    mat.map = textures[textureIndex].clone();
    const x = xOffset(slatIndex);
    mat.map.offset.set(Math.abs(x / cfg.slat.count + 0.5), 0);
    // mat.map.needsUpdate = true;
  }
  return mat;
}

function updateSlatsTexture(textureIndex) {
  for (let i = 0; i < slats.length; i++) {
    const slat = slats[i].children[textureIndex];
    slat.material.dispose();
    slat.material = createSlatMat(i, textureIndex);
  }
}
let billboard;
function createBillboard() {
  let texture, material, plane;
  let billMap;
  textureLoader.setCrossOrigin("anonymous");
  texture = textureLoader.load(
    // "https://csh.bz/trivision/stellar-bg.jpg",
    // "https://upcdn.io/FW25au8Q7QwKr6U96jyn74m",
    // "https://upcdn.io/FW25au85V1jjbRXjyVL9uBJ", //stellar-bg-crop.png
    "https://csh.bz/trivision/stellar-bg-crop.png",
    function (texture) {
      console.log("billboard image loaded");
    },
    undefined,
    function (error) {
      console.log("billboard load error, " + error);
    }
  );
  material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(1, 1, 1),
    transparent: true,
    alphaMap: texture,
    map: texture
  });
  billboard = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), material);
  billboard.material.side = THREE.DoubleSide;
  scene.add(billboard);
  billboard.position.set(0, 0, -5);
  // console.dir(billboard)
}

function createMeshes() {
  console.log("begin createMeshes()");
  if (slats.length > 0) {
    console.log("createMeshes removing slats");
    for (let i = 0; i < slats.length; i++) {
      for (let j = 0; j < slats[i].children.length; j++) {
        const object = slats[i].children[j];
        object.geometry.dispose();
        object.material.dispose();
        scene.remove(object);
      }
      scene.remove(slats[i]);
    }
  }
  slats.length = 0;
  cfg.slat.height = cfg.slat.count * (9 / 16);
  // addSlat();
  slatGeometry = new THREE.PlaneBufferGeometry(cfg.slat.width, cfg.slat.height);
  for (let i = 0; i < cfg.slat.count; i++) {
    slats[i] = createSlatGroup(i);
    scene.add(slats[i]);
  }
  // updateCamera();
  camera.position.set(0, 0, cfg.slat.count / 1.25);
  console.log("createMeshes camera.position.z: " + camera.position.z);
  console.log("createMeshes completed", slats[0].children[0].material);
  billboard.scale.set(
    (cfg.slat.count / 113) * 1.25,
    (cfg.slat.count / 113) * 1.25,
    1
  );
}

function createRenderer() {
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    // alpha: true,
    preserveDrawingBuffer: true
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(1);
  // renderer.setPixelRatio(window.devicePixelRatio);
  // renderer.gammaFactor = 2.2;
  // renderer.gammaOutput = true;
  // renderer.toneMapping = ReinhardToneMapping;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.physicallyCorrectLights = false;
  // renderer.alpha = true;
  container.appendChild(renderer.domElement);
}

function update() {
  cfg.slat.height = cfg.slat.count * (9 / 16);
  // addSlat();
  for (let i = 0; i < slats.length; i++) {
    // var sx = slats[i].x;
    // var wave_one = sin(sx * cfg.slat.wave1.y + cfg.slat.now / 10 * cfg.slat + cfg.offset) * cfg.amp;
    // var wave_two = sin(sx * cfg.slat.wave2.y + cfg.slat.now / 10 * cfg.speed2 + cfg.offset2) * cfg.amp2;
    // var waves = wave_one + wave_two;
    var wave =
      cfg.slat.rRot +
      ((slats[i].position.x / cfg.slat.count) * PI * cfg.slat.wave1.y +
        cfg.slat.time1) +
      TAU *
        sin(
          (slats[i].position.x / cfg.slat.count) * PI * cfg.slat.wave2.y +
            cfg.slat.time2
        );
    slats[i].rotation.y = wave + cfg.slat.now;
    // cfg.slat.rRot +
    // TAU * sin((i / cfg.slat.count) * PI * cfg.slat.rFreq) +
    // cfg.slat.rTime;
  }
  cfg.slat.now += cfg.slat.time * cfg.slat.play;
  cfg.slat.time1 -= (cfg.slat.wave1.x / 600) * cfg.slat.play;
  cfg.slat.time2 -= (cfg.slat.wave2.x / 1200) * cfg.slat.play;
}

function render() {
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  // Update camera frustum
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
  cfg.outputSize.x = window.innerWidth;
  cfg.outputSize.y = window.innerHeight;
  pane.refresh();
  // let insetWidth = window.innerHeight / 4;
  // let insetHeight = window.innerHieght / 4;
  // camera2.aspect = insetWidth / insetHeight;
  // camera2.updateProjectionMatrix();
  // outputSize: { x: window.innerWidth, y: window.innerHeight }
  console.log(
    "camera.aspect is " + camera.aspect + ", position is " + camera.position.z
  );
}
window.addEventListener("resize", onWindowResize, false);

async function init() {
  console.log("init begun");

  //    commenting out this chunk for codepen work
  await testUrl()
  
  /*
  TODOS: 
  * add fetch request to API endpoint that passes along URL w/ params
  * if a url is found in the DB, replace cfg with the one from the DB
  * if no URL is found, load in default cfg and create new document in DB
  */
 container = document.querySelector("#scene-container");
 //   check url for preset subdirectory, if existing query db
 images.load();
 
 scene = new THREE.Scene();
 // const loader = new TextureLoader();
 // const bgTexture = loader.load("img/concrete.jpg");
 // scene.background = bgTexture;
 // scene.background = new Color("rgb(20,20,20)");
 createCamera();
 createLights();
 createBillboard();
 createMeshes();
  // createControls();
createRenderer();
  renderer.setAnimationLoop(() => {
    update();
    render();
  });
  pane.hidden = false;
  updatePaneOutput();
  console.log("init completed");
}

init();
