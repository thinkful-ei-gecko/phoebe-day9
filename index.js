'use strict';

function displayPhotoResults(responseJson) {
  console.log('`displayPhotoResults` started to run');
  let img = responseJson.message;
  $('.js-photo-results').html(`<img src='${img}'>`);
}

//function to display results/printing to console
function displayBreedResults(breedType, responseJson) {
  console.log('`displayBreedResults` started to run');
  if (responseJson.hasOwnProperty('code')) {
    console.log('`displayBreedResults`: (is an error) started to run');
    $('.js-breed-info').html(`
    <p>Sorry, we can't find any results for "<span class="breed-type">${breedType}</span>". Please check for typos and try again.</p>
    <p>If you're looking for a sub-breed, try searching the master breed to see its available photos by sub-breed.</p>
    `);
  }
  else {
    if (responseJson.message.length === 0 || responseJson.message.length === 1) {
      console.log('`displayBreedResults`: (has no subbreeds, going to fetch) started to run');
      fetchDogImage(breedType);
    } 
    else {
      console.log('`displayBreedResults`: (getting subbreed results) started to run');
      $('.js-breed-info').html(`
        <p>We found the following results for "${breedType}". Please click on one of the following results to display an image for the ${breedType} breed.</p>
      `);
      $('.js-breed-results').append(`
        <input class="${breedType}" id="main" type="button" value="${breedType}, all">
      `);
      responseJson.message.forEach(item => $('.js-breed-results').append(`
        <input class="${breedType}" id="${item}" type="button" value="${item} ${breedType}">
      `));
      breedListener();
    }
  }
}

function fetchDogImage(breedType, subBreed) {
  console.log('`fetchDogImage` started to run');
  if (subBreed) {
    fetch (`https://dog.ceo/api/breed/${breedType}/${subBreed}/images/random`)
      .then(response => response.json())
      .then(responseJson => displayPhotoResults(responseJson));
    //probably need to account for an error here
    // .catch(error => alert('Something went wrong. Please try again later.'));
  }
  else {
    fetch(`https://dog.ceo/api/breed/${breedType}/images/random`)
      .then(response => response.json())
      .then(responseJson => displayPhotoResults(responseJson));
  }
}

function clearResultsFields() {
  console.log('`clearResultsFields` started to run');
  $('.js-breed-info').empty();
  $('.js-breed-results').empty();
  $('.js-photo-results').empty();
}

function fetchDogBreeds(breedType) {
  console.log('`fetchDogBreeds` started to run');
  fetch(`https://dog.ceo/api/breed/${breedType}/list`)
    .then(response => response.json())
    .then(responseJson => displayBreedResults(breedType, responseJson));
}

function breedListener() {
  console.log('`breedListener` started to run');
  $('.js-breed-results').on('click', e => {
    console.log('breedListener clicked');
    let subBreed = e.target.getAttribute('id');
    let breedType = e.target.getAttribute('class');
    if (subBreed === 'main') {
      fetchDogImage(breedType);
    }
    else {
      fetchDogImage(breedType, subBreed);
    }
    //do something if there's an error here
  });
}

//listener on the submit button 
function clickListener() {
  console.log('`clickListener` started to run');
  $('.dog-pic-form').submit(event => {
    event.preventDefault();
    //not sure if the below is right
    let breedType = $('#breed-input').val();
    clearResultsFields();
    console.log(breedType);
    fetchDogBreeds(breedType);
  });
}

$(clickListener);