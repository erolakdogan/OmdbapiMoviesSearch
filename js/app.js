const form = document.querySelector('form');
const input = document.querySelector('#txtSearchName');
const searchList = document.querySelector('#search-list');
let moviesId ;
let moviesData;
let items;

loadItems();
eventListeners();


function eventListeners() {

  form.addEventListener('submit', addNewItem);

  searchList.addEventListener('click', oldSearchText);

  searchList.addEventListener('click', deleteItem);


}

function loadItems() {
  items = getItemsFromLS();
  items.forEach(function (item) {
    createItem(item);
  });

}

function getItemsFromLS() {
  if (localStorage.getItem('items') === null) {
    items = [];
  } else {
    items = JSON.parse(localStorage.getItem('items'));
  }
  return items;
}


function setItemToLS(text) {
  items = getItemsFromLS();
  items.push(text);
  localStorage.setItem('items', JSON.stringify(items));
}


function deleteItemFromLS(text) {

  items = getItemsFromLS();
  items.forEach(function (item, index) {
    if (item === text) {
      items.splice(index, 1);
    }
  });
  localStorage.setItem('items', JSON.stringify(items));
}


function createItem(text) {

  const li = document.createElement('li');
  li.className = 'list-group-item list-group-item-secondary';
  li.style = 'margin-right: 20px;';
  li.id = text;
  li.appendChild(document.createTextNode(text));

  const a = document.createElement('a');
  a.classList = 'delete-item float-right';
  a.innerHTML = '<i class="fas fa-times" style="color:red"></i>';

  li.appendChild(a);
  searchList.appendChild(li);
}

function addNewItem(e) {

  if (input.value === '') {
    alert('Yeni ekle');
  }

  var searcText = input.value;

  if (searcText.length >= 3) {
    createItem(input.value);
    setItemToLS(input.value);
    getMovies(input.value);
    input.value = '';

    e.preventDefault();

  } else {
    alert("Lütfen en az 3 karakter giriniz.")
  }


}

function oldSearchText(e) {

  if (e.target.className === 'list-group-item list-group-item-secondary') {
    getMovies(e.target.id);
  }
  e.preventDefault();

}

function deleteItem(e) {

  if (e.target.className === 'fas fa-times') {
    if (confirm('Silmek istediğinize emin misiniz?')) {
      e.target.parentElement.parentElement.remove();

      deleteItemFromLS(e.target.parentElement.parentElement.textContent);
    }
  }
  e.preventDefault();
}

function getMovies(searchText) {
  if (searchText !== undefined) {
    axios.get('http://www.omdbapi.com?s=' + searchText + '&apikey=d3f20eb6')
      .then((response) => {
        console.log(response);
        let movies = response.data.Search;
        let output = '';
        $.each(movies, (index, movie) => {
       
          output += `
              <div class="col-md-3">
                <div class="well text-center">
                  <img src="${movie.Poster}">
                  <h5>${movie.Title}</h5>
                  <p>${movie.Year}</p>              
                  
                  <a onclick="movieFavorites('${movie.imdbID}')" class="btn btn-primary" href="#">Favorilere Ekle</a>
                </div>
              </div>
            `;
        });

        $('#movies').html(output);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

function getMoviesFavorites() {
 
    
    moviesId = getMoviesIdFromLS();
    moviesId.forEach(function (item) {
      
      axios.get('http://www.omdbapi.com?i=' + item + '&apikey=d3f20eb6')
      .then((response) => {  
        let output = '';     
          output += `
              <div class="col-md-3">
                <div class="well text-center">
                  <img src="${response.data.Poster}">
                  <h5>${response.data.Title}</h5>
                  <p>${response.data.Year}</p>              
                  
                  <a onclick="movieFavorites('${response.data.imdbID}')" class="btn btn-primary" href="#">Favorilere Ekle</a>
                </div>
              </div>
            `;
            $('#movie').html(output); 
       })
      .catch((err) => {
        console.log(err);
      });
  
    
  })
}





function getMoviesIdFromLS() {
  if (localStorage.getItem('moviesId') === null) {
    moviesId = [];
  } else {
    moviesId = JSON.parse(localStorage.getItem('moviesId'));
  }
  return moviesId;
}


function setMoviesIdToLS(id) {
  moviesId = getMoviesIdFromLS();
  moviesId.push(id);
  localStorage.setItem('moviesId', JSON.stringify(moviesId));
}


function movieFavorites(id) {
setMoviesIdToLS(id)
location.reload();
return true;
}

