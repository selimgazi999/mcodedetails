// script.js

let movies = JSON.parse(localStorage.getItem("movies") || "[]");
const form = document.getElementById("movieForm");
const output = document.getElementById("outputCode");
const list = document.getElementById("movieList");
let editIndex = null;

function render() {
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

  list.innerHTML = "";
  movies.forEach((m, index) => {
    const div = document.createElement("div");
    div.className = "movie-item";
    div.innerHTML = `
      <strong>${m.title}</strong><br/>
      ${m.comingSoon ? "<em>Coming Soon</em>" : "Released"}<br/>
      <button onclick="editMovie(${index})">Edit</button>
      <button onclick="releaseMovie(${index})">Mark Released</button>
      <button onclick="deleteMovie(${index})">Delete</button>
      <button onclick="moveUp(${index})"${index === 0 ? " disabled" : ""}>↑</button>
      <button onclick="moveDown(${index})"${index === movies.length - 1 ? " disabled" : ""}>↓</button>
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
  const checkboxes = document.querySelectorAll('input[name="category"]:checked');
  const categories = Array.from(checkboxes).map(cb => cb.value);
  const comingSoon = form.comingSoon.checked;

  const movieData = { title, image, link, categories, ...(comingSoon && { comingSoon }) };

  if (editIndex !== null) {
    movies[editIndex] = movieData;
    editIndex = null;
  } else {
    movies.push(movieData);
  }

  form.reset();
  render();
});

function editMovie(index) {
  const movie = movies[index];
  form.title.value = movie.title;
  form.image.value = movie.image;
  form.link.value = movie.link;
  document.querySelectorAll('input[name="category"]').forEach(cb => {
    cb.checked = movie.categories.includes(cb.value);
  });
  form.comingSoon.checked = !!movie.comingSoon;
  editIndex = index;
  form.scrollIntoView({ behavior: 'smooth' });
}

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

function deleteMovie(index) {
  if (confirm("Are you sure you want to delete this movie?")) {
    movies.splice(index, 1);
    render();
  }
}

function moveUp(index) {
  if (index > 0) {
    [movies[index - 1], movies[index]] = [movies[index], movies[index - 1]];
    render();
  }
}

function moveDown(index) {
  if (index < movies.length - 1) {
    [movies[index], movies[index + 1]] = [movies[index + 1], movies[index]];
    render();
  }
}

// Backup import
function importBackup() {
  const fileInput = document.getElementById("backupFile");
  const file = fileInput.files[0];
  if (!file) {
    alert("Please select a backup file.");
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const newData = JSON.parse(e.target.result);
      const oldData = JSON.parse(localStorage.getItem("movies") || "[]");
      const mergedData = oldData.concat(newData);

      localStorage.setItem("movies", JSON.stringify(mergedData));
      movies = mergedData;
      render();
      alert("Backup imported and merged!");
    } catch (err) {
      alert("Invalid backup file!");
    }
  };
  reader.readAsText(file);
}

// Backup download
function downloadBackup() {
  const dataStr = JSON.stringify(movies, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "movies-backup.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

render();
