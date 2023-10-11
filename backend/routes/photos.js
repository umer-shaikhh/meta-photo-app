const express = require("express");
const axios = require("axios");
const router = express.Router();
const OpenAIApi = require("openai");

const openai = new OpenAIApi({ key: 'OPENAI_API_KEY' });

const fetchData = async (url) => {
  const response = await axios.get(url);
  return response.data;
};

router.get("/", async (req, res) => {
  try {
    const {
      title,
      "album.title": albumTitle,
      "album.user.email": userEmail,
      limit = 25,
      offset = 0,
    } = req.query;

    const users = await fetchData("https://jsonplaceholder.typicode.com/users");
    const albums = await fetchData(
      "https://jsonplaceholder.typicode.com/albums"
    );
    const photos = await fetchData(
      "https://jsonplaceholder.typicode.com/photos"
    );

    let filteredPhotos = photos;

    if (title) {
      filteredPhotos = filteredPhotos.filter((photo) =>
        photo.title.includes(title)
      );
    }

    if (albumTitle || userEmail) {
      const filteredAlbums = albums.filter((album) => {
        const user = users.find((user) => user.id === album.userId);
        return (
          (userEmail && user.email === userEmail) ||
          (albumTitle && album.title.includes(albumTitle))
        );
      });

      filteredPhotos = filteredPhotos.filter((photo) =>
        filteredAlbums.some((album) => album.id === photo.albumId)
      );
    }

    const paginatedPhotos = filteredPhotos
      .slice(offset, offset + limit)
      .map((photo) => {
        const album = albums.find((a) => a.id === photo.albumId);
        const user = users.find((u) => u.id === album.userId);
        return {
          ...photo,
          album: {
            ...album,
            user,
          },
        };
      });

    res.status(200).send(paginatedPhotos);
  } catch (error) {
    res.status(500).send({});
  }
});

router.get("/generate-catchphrase/:companyId", async (req, res) => {
  try {
    const companyId = req.params.companyId;
    const users = await fetchData("https://jsonplaceholder.typicode.com/users");
    const user = users.find((u) => u.id === parseInt(companyId));

    if (!user) {
      return res.status(404).json({ error: "Company not found" });
    }

    const prompt = `Generate five alternative catchphrases that convey a similar concept or sentiment to: "${user.company.catchPhrase}"`;
    const response = await openai.complete({
      prompt: prompt,
      max_tokens: 150,
    });

    res.status(200).json({
      original: user.company.catchPhrase,
      alternatives: response.choices[0].text.trim().split("\n"),
    });
  } catch (error) {
    res.status(500).json({})
  }
});

module.exports = router;
