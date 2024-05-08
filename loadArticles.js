// const response = await fetch("./refs.json");
// const movies = await response.json();
// console.log(movies);

const articles = document.getElementById("articles");

function makeArticle(title, prev) {
  let newArticle = document.createElement("div");
  let heading = document.createElement("h1");
  let body = document.createElement("p");

  newArticle.className = "article";

  heading.textContent = title;
  body.innerHTML = prev;

  newArticle.appendChild(heading);
  newArticle.appendChild(body);
  articles.appendChild(newArticle);
}

async function getArticles() {
  const refs = await fetch("./refs.json");
  const references = await refs.json();
  const bDat = await fetch("./blog/index.json");
  const bData = await bDat.json(); 
  //load them
  articles.innerHTML = "";
  if (!references || !references.blog)
    return;
  for (let i = 0; i < references.blog.length; i++) {
    let articleData = bData[references.blog[i]];
    if (!articleData)
      continue;
    makeArticle(articleData.title, articleData.prev);
  }
}
getArticles();