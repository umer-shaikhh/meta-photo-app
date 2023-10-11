const fetchData = async () => {
  const title = document.getElementById('titleFilter').value;
  const albumTitle = document.getElementById('albumTitleFilter').value;
  const userEmail = document.getElementById('userEmailFilter').value;

  const url = new URL('http://localhost:3000/externalapi/photos');
  if (title) url.searchParams.append('title', title);
  if (albumTitle) url.searchParams.append('album.title', albumTitle);
  if (userEmail) url.searchParams.append('album.user.email', userEmail);

  const response = await fetch(url);
  const data = await response.json();

  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = JSON.stringify(data, null, 2);
};

const generateCatchphrase = async () => {
  const companyId = document.getElementById('companyId').value;
  const response = await fetch(`http://localhost:3000/externalapi/photos/generate-catchphrase/${companyId}`);
  const data = await response.json();

  const catchphrasesDiv = document.getElementById('catchphrases');
  catchphrasesDiv.innerHTML = `
      <strong>Original:</strong> ${data.original}<br>
      <strong>Alternatives:</strong> ${data.alternatives.join('<br>')}
  `;
};
