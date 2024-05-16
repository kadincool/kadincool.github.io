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

  function appendSpacing() {
    if (spacing) {
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
    }
  }

  function checkForClose(index) { //doesnt work with *italic **bold and italic***
    // let index = segment.length;
    if (styleStack.length == 0) {
      return 0;
    }
    let test = styleStack[styleStack.length - 1];
    // console.log(data, index, test.length)
    // console.log("test", data.slice(index, index + test.length), test)
    if (data.slice(index, index + test.length) == test) {
      checkAndAdd(data.slice(index, index + test.length));
      return test.length;
    }
  }

  function checkAndAdd(style) {
    if (styleStack.includes(style)) {
      if (styleStack[styleStack.length - 1] != style) {
        segment += style;
        return;
      }
      // let stackIndex = styleStack.length - 1;
      styleStack.pop();
      let startIndex = styleIndex.pop();
      let tag = getTag(style);
      if (!tag) {
        // console.error("There is not tag for your style.");
        throw new error("There is not tag for your style.");
      }
      insert("<" + tag + ">", startIndex);
      segment += "</" + tag + ">";

    } else {
      appendSpacing();
      styleStack.push(style);
      styleIndex.push(segment.length);
    }
  }

  function getTag(style) {
    switch (style) {
      case "*":
        return "i";
      case "**":
        return "b";
    }
  }

  for (let i = 0; i < data.length; i++) {
    console.log(segment, styleStack, styleIndex);
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
      let close = checkForClose(i);
      if (close >= 1) {
        console.log("closed");
        i += close - 1;
        continue;
      }
      if (data[i] == "\\") {
        escape = true;
        continue;
      }
      if (data[i] == "*") {
        if (data[i + 1] == "*") {
          checkAndAdd("**");
          i++;
        } else {
          checkAndAdd("*");
        }
        continue;
      }
    }
    escape = false;
    //pass
    appendSpacing();
    segment += data[i];
  }
  appendSegment();
  // console.log(styleStack);
  // console.log(styleIndex);
  console.log(out);
  return out;
}