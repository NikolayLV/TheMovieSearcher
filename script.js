const searchBox = document.querySelector(".search-box")
const apiKEy = "be929698aa8a9595adcab58c7a7a12fa"
const matchBox = document.querySelector(".match-box ul")
const mainSection = document.querySelector("section")

searchBox.addEventListener("click", function () {
    searchBox.value = "";
    return searchBox;
})


async function showSearchRes(e) {
    const inputValue = e.target.value;
    if (inputValue.length >= 2) {
        const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKEy}&query=${inputValue}`)
        const data = await res.json()
        const movies = data.results

        let matches = movies.filter((movie) => {
            const regex = new RegExp(`^${inputValue}`, 'gi')
            return movie.original_title.match(regex)
        })
        outputHtml(matches.slice(0, 5));
        getInfo(matches.slice(0, 5));
    } else {

        matches = [];
        matchBox.innerHTML = ''
    }
}


const outputHtml = matches => {
    if (matches.length > 0) {
        const html = matches.map((match) => {
            return `<li>${match.title}</li>`
        })
        matchBox.innerHTML = html.join("");
    }
}


const getInfo = matches => {
    const list = document.querySelectorAll(".match-box ul li")
    list.forEach(li => {
        li.addEventListener("click", e => {
            searchBox.value = e.target.innerText;
            const selected = matches.filter((match) => {
                if (match.title === searchBox.value)
                    return match.title;
            })
            matchBox.innerHTML = ''
            updateDom(selected[0]);
        })
    });
}


const updateDom = async selected => {
    // fetching movie info by id
    const res = await fetch(`https://api.themoviedb.org/3/movie/${selected.id}?api_key=${apiKEy}`)
    const data = await res.json();
    // changing the body background
    document.body.style.backgroundImage = `url("https://image.tmdb.org/t/p/original/${data.backdrop_path}")`
    const genres = data.genres.map(i => {
        return i.name
    })
    const companies = data.production_companies.map(i => {
        return i.name
    })
    const updated = `<div class="poster">
    <img
      src="https://image.tmdb.org/t/p/original/${data.poster_path}"
      alt="poster"
    />
  </div>
  <div class="info">
    <h2 class="main-color">${data.title}</h2>
    <p style="margin: 10px 0" class="hidden">
      ${data.overview}
    </p>
    <h3 class="main-color" style="margin: 30px 0 10px 0">${genres.join(", ")}</h3>
    <span>${companies.join(", ")}</span>
    <div class="sub-info">
    <div>
      <span>Original Release:</span>
      <h3 class="main-color">${data.release_date}</h3>
      </div>
      <div>
      <span>Running Time:</span>
      <h3 class="main-color">${data.runtime} mins</h3>
      </div>
      <div>
      <span>Budget:</span>
      <h3 class="main-color">$${data.budget}</h3>
      </div>
      <div>
      <span>Vote Average:</span>
      <h3 class="main-color">${data.vote_average} / 10</h3>
      </div>
    

    </div >
  </div > `;
    mainSection.innerHTML = updated
}


searchBox.addEventListener("input", showSearchRes)