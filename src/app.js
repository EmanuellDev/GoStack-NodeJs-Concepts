const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const newRepository = {
    id: uuid(),
    likes: 0,
    title,
    url,
    techs
  };

  repositories.push(newRepository);
  return response.json(newRepository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const repositoryIndex = findRepositoryIndex(id);

  repositories[repositoryIndex] = {
    ...repositories[repositoryIndex],
    title,
    url,
    techs
  };

  return response.json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = findRepositoryIndex(id);

  repositories.splice(repositoryIndex, 1);

  return response.status(204).json({ message: 'Repository removed' });
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = findRepositoryIndex(id);

  repositories[repositoryIndex].likes++;

  return response.json(repositories[repositoryIndex]);
});

const findRepositoryIndex = (index) => {
  const repositoryIndex = repositories.findIndex(el => el.id === index);

  if (repositoryIndex < 0) {
    const error = new Error();
    error.status = 400;
    throw error;
  }

  return repositoryIndex;
}

module.exports = app;
