function MDToHTML(data) {
  let out = "";
  let segment = "";

  const functions = "\\`*_{}[]<>()#+-.!|";

  let styleStack = [];
  let styleIndex = [];

  //spacing
  let spacing = false;
  let spaceCount = 0;

  //line breaks
  let newLine = false;
  let lineCount = 0;
  let addBreak = false;

  let escape = false;

  function insert(string, index) {
    segment = segment.slice(0, index) + string + segment.slice(index);
  }

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

  function space() {
    if (!spacing) {
      spacing = true;
      spaceCount = 1;
    } else {
      spaceCount++;
    }
  }

  function checkAndAdd(style, index) {
    if (styleStack.includes(style)) {
      let stackIndex = styleStack.indexOf(style);
      let tag = getTag(style);
      if (!tag) {
        // console.error("There is not tag for your style.");
        throw new error("There is not tag for your style.");
      }
      insert("<" + tag + ">");
      //TODO: add style tags
    } else {
      styleStack.push(style);
      styleIndex.push(index);
    }
  }

  function getTag(style) {
    switch (style) {
      case "*":
        return "i";
    }
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
      space();
      continue;
    }
    if (newLine && lineCount >= 2) {
      appendSegment();
      newLine = false;
      addBreak = false;
    }
    //escape
    if (!escape) {
      if (data[i] == "\\") {
        escape = true;
        continue;
      }

    }
    escape = false;
    //pass
    if (newLine) {
      if (addBreak) {
        segment += "<br>";
      } else {
        spacing = true;
        spaceCount = 1;
      }
      newLine = false;
      addBreak = false;
    }
    if (spacing) {
      if (segment != "") {
        segment += " ";
      }
      spacing = false;
    }
    segment += data[i];
  }
  appendSegment();
  console.log(out);
  return out;
}