var form = document.getElementById("myForm");

const perPage = 10;
let currentPage = 1;
let loaderRepo = false;
var originalName = "viv59"
const loader = document.getElementById("loader");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  var search = document.getElementById("search").value;
 originalName =  search.split(" ").join("");


  document.getElementById("result").innerHTML = "";
 
  fetch("https://api.github.com/users/" + originalName)
    .then((result) => result.json())
    .then((data) => {
      document.getElementById("result").innerHTML = `
           <div> <img class="rounded-circle shadow-4-strong" alt="avatar2" src="${data?.avatar_url}" height="100%" width="100%"/></div>
            <p class="card-text"  style="text-align:center; padding-bottom: 30px;"><i class="bi-link"><a href="${data?.html_url}"> ${data?.html_url}</a></i></p>
            `;
      
      document.getElementById("nameid").innerHTML = `
      <h1 class="johnname">${data?.name}</h1>
      `;
      
      let temp_bio = data?.bio
      let temp_twitter = data?.twitter_username
      let temp_location = data?.location

      if (temp_bio === null) {
        document.getElementById("bioid").innerHTML = `
      <p>No bio available</p>
      `
      } else {
        document.getElementById("bioid").innerHTML = `
      <p>${data?.bio}</p>
      `
      }

      if (temp_location === null) {
        document.getElementById("locationid").innerHTML = `
      <p>Location not available</p>
      `
      } else {
        document.getElementById("locationid").innerHTML = `
      <p>&nbsp;<i style="font-size:20px" class="fa fa-map-marker"></i>&nbsp;&nbsp;&nbsp;${data?.location}</p>
      `
      }

      if (temp_twitter === null) {
        document.getElementById("twitter_usernameid").innerHTML = `
      <p>Twitter handle not available</p>
      `
      } else {
        document.getElementById("twitter_usernameid").innerHTML = `
      <p>&nbsp;<i style="font-size:20px" class="fa">&#xf099;</i>&nbsp;<a href="https://twitter.com/${data?.twitter_username}">https://twitter.com/${data?.twitter_username}</a></p>
      `
      }
    });

    fetchRepositories(originalName,currentPage);
  
});

function fetchRepositories(username,currentPage) {
  
  const apiUrl = `https://api.github.com/users/${username}/repos?page=${currentPage}&per_page=${perPage}`;
  // alert(apiUrl)
  loader.style.display = "block"
  fetch(apiUrl)
    .then(response => response.json())
    .then(repositories => {
      const repositoriesList = document.getElementById('repositories-list');
      const pageInfo = document.getElementById('page-info');
      repositoriesList.innerHTML = '';

      repositories.forEach(async repo => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = repo.html_url;
        link.textContent = repo.name;

        const languagesList = document.createElement('div');
        languagesList.classList.add('languages');
        const languages = await fetchLanguages(repo.languages_url);
        languages.forEach(language => {
          const languageButton = document.createElement('button');
          languageButton.textContent = language;
          languageButton.addEventListener('click', () => filterByLanguage(language));
          languagesList.appendChild(languageButton);
        });
        
        listItem.appendChild(link);
        listItem.appendChild(languagesList);
        repositoriesList.appendChild(listItem);
      });

      pageInfo.textContent = `Page ${currentPage}`;
      loader.style.display = "none"
    })
    .catch(error => {
      loader.style.display = "none"
      console.error('Error fetching repositories:', error)
    });
}

async function fetchLanguages(languagesUrl) {
  const response = await fetch(languagesUrl);
  const languages = await response.json();
  const sortedLanguages = Object.entries(languages)
    .sort((a, b) => b[1] - a[1]) // Sort by usage count in descending order
    .map(([language]) => language)
    .slice(0, 4); // Display up to 4 languages
  return sortedLanguages.length > 0 ? sortedLanguages : ['Unknown'];
}

function loadPreviousPage() {
  if (currentPage > 1) {
    currentPage--;
    fetchRepositories(originalName,currentPage);
  }
}

function loadNextPage() {
 if(currentPage < 10){
  currentPage++;
  fetchRepositories(originalName,currentPage);
 }
 else{
  alert("Maximum 100 repositories can be fetched")
 } 
}


fetchRepositories("viv59",1);

