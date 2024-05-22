function MDToHTML(data) {
  let out = "";
  let segment = "";

  const functions = "\\`*_{}[]<>()#+-.!|";

  let lineStyles = [];
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
    cancelFormatting();
    addLineStyles();
    out += "<p>" + segment + "</p>\n";
    segment = "";
  }

  function cancelFormatting() {
    for (let i = styleStack.length - 1; i >= 0; i--) {
      let style = styleStack.pop();
      let startIndex = styleIndex.pop();

      insert(style, startIndex);
    }
  }

  function addLineStyles() {
    for (let i = lineStyles.length - 1; i >= 0; i--) {
      let tag = getTag(lineStyles[i]);

      if (!tag) {
        throw new error("There is no tag for your style.");
      }

      segment = "<" + tag + ">" + segment + "</" + tag + ">";
    }
    lineStyles = [];
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
        // console.error("There is no tag for your style.");
        throw new error("There is no tag for your style.");
      }
      insert("<" + tag + ">", startIndex);
      segment += "</" + tag + ">";

    } else {
      appendSpacing();
      styleStack.push(style);
      styleIndex.push(segment.length);
    }
  }

  // function scanAhead(tag, startIndex) {
  //   let endIndex = data.length - 1;
  //   for (let i = startIndex; i < data.length; i++) {

  //   }
  //   // let endIndex = find index before many line breaks
  //   // go back from end to start
  //   // if tag matches return index and splice it out
  //   // if could not find match retrun -1
  // }

  function getTag(style) {
    switch (style) {
      case "*":
      case "_":
        return "em";
      case "**":
      case "__":
        return "strong";
      case "`":
        return "samp";
      case "#":
        return "h1";
    }
  }

  for (let i = 0; i < data.length; i++) {
    // console.log(segment, styleStack, styleIndex);
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
      let code = styleStack[styleStack.length - 1] == "`";
      console.log(styleStack[styleStack.length - 1]);
      let close = checkForClose(i);
      if (close >= 1) {
        i += close - 1;
        continue;
      }
      if (data[i] == "\\" && !code) {
        escape = true;
        continue;
      }
      if (data[i] == "#" && segment == "" && !code) {
        //TODO: Check header count
        lineStyles.push("#");
        continue;
      }
      if (data[i] == "*" && !code) {
        if (data[i + 1] == "*") {
          checkAndAdd("**");
          i++;
        } else {
          checkAndAdd("*");
        }
        continue;
      }
      if (data[i] == "_" && !code) {
        if (data[i + 1] == "_") {
          checkAndAdd("__");
          i++;
        } else {
          checkAndAdd("_");
        }
        continue;
      }
      if (data[i] == "`") {
        checkAndAdd("`");
        continue;
      }
    }
    //pass
    appendSpacing();
    
    if (escape && data[i] == "<") {
      segment += "&lt";
      escape = false;
      continue;
    }
    escape = false;

    segment += data[i];
  }
  appendSegment();
  // console.log(styleStack);
  // console.log(styleIndex);
  console.log(out);
  return out;
}