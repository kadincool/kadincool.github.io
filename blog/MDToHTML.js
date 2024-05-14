function MDToHTML(data) {
  let out = "";
  let segment = "";

  const functions = "\\`*_{}[]<>()#+-.!|";

  let styleStack = [];

  //spacing
  let spacing = false;
  let spaceCount = 0;

  //line breaks
  let newLine = false;
  let lineCount = 0;
  let addBreak = false;

  let escape = false;

  function appendSegment() {
    // TODO: finish styling
    out += "<p>" + segment + "</p>\n";
    segment = "";
  }

  function lineBreak() {
    if (!newLine) {
      newLine = true;
      lineCount = 1;
      if (spacing && spaceCount >= 2) {
        addBreak = true;
      }
    } else {
      lineCount++;
    }
    spacing = false;
  }

  for (let i = 0; i < data.length; i++) {
    if (data[i] == "\r") {
      continue;
    }
    if (data[i] == "\n") {
      lineBreak();
      continue;
    }
    if (data[i] == " ") {
      if (!spacing) {
        spacing = true;
        spaceCount = 1;
      } else {
        spaceCount++;
      }
      continue;
    }
    if (newLine && lineCount >= 2) {
      appendSegment();
      newLine = false;
      addBreak = false;
    }
    if (!escape) {
      if (data[i] == "\\") {
        escape = true;
        continue;
      }
    }
    if (spacing) {
      segment += " ";
      spacing = false;
    }
    segment += data[i];
  }
  appendSegment();
  console.log(out);
  return out;
}