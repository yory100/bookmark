const { shell } = require('electron');

const parser = new DOMParser();

const linksSection = document.querySelector('.links');
const errorMessage = document.querySelector('.error-message');
const newLinkForm = document.querySelector('.new-link-form');
const newLinkUrl = document.querySelector('.new-link-url');
const newLinkSubmit = document.querySelector('.new-link-submit');
const clearStorageButton = document.querySelector('.clear-storage');

newLinkUrl.addEventListener('keyup', () => {
  newLinkSubmit.disabled = !newLinkUrl.validity.valid;
});

newLinkForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const url = newLinkUrl.value;

  fetch(url)
    .then(validateResponse)
    .then(response => response.text())
    .then(parseResponse)
    .then(findTitle)
    .then(title => storeLink(title, url))
    .then(clearForm)
    .then(renderLinks)
    .catch(error => handleError(error, url));

});

clearStorageButton.addEventListener('click', () => {
  localStorage.clear();
  linksSection.innerHTML = '';
});

linksSection.addEventListener('click', (event) => {
  if (event.target.href) {
    event.preventDefault();
    shell.openExternal(event.target.href);
  }
});

//**************************************************

function clearForm() {
  newLinkUrl.value = null;
}

function parseResponse(text) {
  return parser.parseFromString(text, 'text/html');
}

function findTitle(nodes) {
  return nodes.querySelector('title').innerText;
}

function storeLink(title, url) {
  localStorage.setItem(url, JSON.stringify({ title, url }));
}

function getLinks() {
  return Object.keys(localStorage)
    .map(key => JSON.parse(localStorage.getItem(key)));
}

function convertToElement(link) {
  return `
    <div class="link">
      <h3>${link.title}</h3>
      <p>
        <a href="${link.url}">${link.url}</a>
      </p>
    </div>
  `;
};

function renderLinks() {
  const linkElements = getLinks().map(convertToElement).join('');
  console.log(linkElements);
  linksSection.innerHTML = linkElements;
}

function handleError(error, url) {
  errorMessage.innerHTML = `
    There was an issue adding "${url}": ${error.message}`.trim();
  setTimeout(() => errorMessage.innerHTML = null, 5000);
}

function validateResponse(response) {
  if (response.ok) {
    return response;
  }

  throw new Error(`Status code of ${response.status} ${response.statusText}`);
}

renderLinks();