let movies = JSON.parse(localStorage.getItem("movies") || "[]");
const form = document.getElementById("movieForm");
const output = document.getElementById("outputCode");
const list = document.getElementById("movieList");

function render() {
  // Generate code
  let code = "const movies = [\n";
  movies.forEach((m, i) => {
    code += "  {\n";
    code += `    title: ${JSON.stringify(m.title)},\n`;
    code += `    image: ${JSON.stringify(m.image)},\n`;
    code += `    link: ${JSON.stringify(m.link)},\n`;
    code += `    categories: [${m.categories.map(c => JSON.stringify(c)).join(", ")}]`;
    if (m.comingSoon) code += ",\n    comingSoon: true";
    code += "\n  }";
    code += (i < movies.length - 1 ? ",\n" : "\n");
  });
  code += "];";
  output.value = code;

  // Movie management
  list.innerHTML = "";
  movies.forEach((m, index) => {
    const div = document.createElement("div");
    div.className = "movie-item";
    div.innerHTML = `
      <strong>${m.title}</strong><br/>
      ${m.comingSoon ? "<em>Coming Soon</em>" : "Released"}<br/>
      <button onclick="releaseMovie(${index})">Mark Released</button>
    `;
    list.appendChild(div);
  });

  localStorage.setItem("movies", JSON.stringify(movies));
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = form.title.value.trim();
  const image = form.image.value.trim();
  const link = form.link.value.trim();
  const categories = form.categories.value.trim().split(",").map(c => c.trim());
  const comingSoon = form.comingSoon.checked;

  movies.push({ title, image, link, categories, ...(comingSoon && { comingSoon }) });
  form.reset();
  render();
});

function copyCode() {
  output.select();
  document.execCommand("copy");
  alert("Copied!");
}

function releaseMovie(index) {
  if (movies[index].comingSoon) {
    delete movies[index].comingSoon;
    render();
  }
}

// Initial render
render();
