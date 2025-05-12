const form = document.getElementById('movieForm');
const output = document.getElementById('output');

let movieArray = [];

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const title = document.getElementById('title').value.trim();
  const image = document.getElementById('image').value.trim();
  const link = document.getElementById('link').value.trim();
  const comingSoon = document.getElementById('comingSoon').checked;

  const selectedCategories = [];
  form.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    if (checkbox.checked && checkbox.id !== "comingSoon") {
      selectedCategories.push(checkbox.value);
      checkbox.checked = false;
    }
  });

  const movieObj = {
    title,
    image,
    link,
    categories: selectedCategories
  };

  if (comingSoon) {
    movieObj.comingSoon = true;
    document.getElementById('comingSoon').checked = false;
  }

  movieArray.push(movieObj);
  form.reset();
  generateOutput();
});

function generateOutput() {
  let result = "const movies = [\n";
  movieArray.forEach((movie, index) => {
    result += `  {\n    title: '${movie.title}',\n    image: '${movie.image}',\n    link: '${movie.link}',\n    categories: [${movie.categories.map(cat => `'${cat}'`).join(', ')}]`;
    if (movie.comingSoon) result += ",\n    comingSoon: true";
    result += `\n  }${index < movieArray.length - 1 ? ',' : ''}\n`;
  });
  result += "];";
  output.textContent = result;
}
