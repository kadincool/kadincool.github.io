function MDToHTML(data) {
  let out = "";
  let segment = "";

  const functions = "\\`*_{}[]<>()#+-.!|";

  let styleStack = [];

  let escape = false;

  for (let i = 0; i < data.length; i++) {
    if (data[i] == "\r") {
      continue;
    }

  }
}

function appendSegment() {
  // TODO: finish styling
  out += segment;
  segment = "";
  
}