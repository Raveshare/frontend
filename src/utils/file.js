export const loadJSONFile = (file, store) => {
  var reader = new FileReader();
  reader.onloadend = function () {
    var text = reader.result;
    let json;
    try {
      json = JSON.parse(text);
    } catch (e) {
      alert("Can not load the project.");
    }

    if (json) {
      store.loadJSON(json);
    }
  };
  reader.onerror = function () {
    alert("Can not load Polotno project file.");
  };
  reader.readAsText(file);
};

export const loadImageFile = (file, store) => {
  var reader = new FileReader();
  reader.onloadend = function () {
    var url = reader.result;
    const img = new Image();
    img.src = url;
    img.onload = () => {
      const scale = Math.min(
        1,
        store.width / img.width,
        store.height / img.height
      );
      const type = file.type.indexOf("svg") > -1 ? "svg" : "image";
      store.activePage.addElement({
        type,
        width: img.width * scale,
        height: img.height * scale,
        src: url,
      });

      // Add a logo to the bottom right corner of the canvas
      let h = store.activePage.computedHeight;
      let w = store.activePage.computedWidth;
      store.activePage.addElement({
        x: w - 100,
        y: h - 100,
        type: "image",
        src: "/logo_square_630x630.png",
        selectable: false,
        alwaysOnTop: true,
        showInExport: true,
      });
    };
  };
  reader.onerror = function () {
    alert("Can not load image.");
  };
  reader.readAsDataURL(file);
};

export const loadFile = (file, store) => {
  if (file.type.indexOf("image") >= 0) {
    loadImageFile(file, store);
  } else {
    loadJSONFile(file, store);
  }
};

export const waterMark = (store) => {
  let h = store.activePage.computedHeight;
  let w = store.activePage.computedWidth;
  store.activePage.addElement({
    x: w - 220,
    y: h - 220,
    type: "image",
    src: "/watermark.png",
    selectable: false,
    alwaysOnTop: true,
    showInExport: true,
    height: h / 5,
    width: w / 5,
  });
};
