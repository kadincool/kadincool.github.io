// const response = await fetch("./refs.json");
// const movies = await response.json();
// console.log(movies);

const articles = document.getElementById("articles");

function makeArticle() {
  
}

async function getArticles() {
  const refs = await fetch("./refs.json");
  const references = await refs.json();
  console.log(references);
}
getArticles();