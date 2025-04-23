import geminiKey from "./key.js";

export async function callGitHubApi(pullRequestLink) {
  let modifiedString = pullRequestLink.replace(
    "https://github.com/",
    "https://api.github.com/repos/"
  );
  modifiedString = modifiedString.replace("pull", "pulls");

  const response = await fetch(modifiedString);

  if (!response.ok) {
    throw new Error(
      `GitHub API error: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();

  if (!data.user) {
    throw new Error(`Unexpected API response: ${JSON.stringify(data)}`);
  }

  return {
    titulo: data.title,
    autor: data.user.login,
    descripcion: data.body,
    prNumber: data.number,
    repo: data.head.repo.name,
  };
}

/*
(async () => {
  const prData = await callGitHubApi('https://github.com/ao-org/argentum-online-server/pull/759');
  console.log(prData);
})();
*/

function gitHubPrToString(PRObject) {
  return `
  Titulo del pull request: ${PRObject.titulo} \n
  Autor del pull request: ${PRObject.autor} \n
  Descripcion del pull request: ${PRObject.descripcion} \n
  Numero de pull request: #${PRObject.prNumber};
  `;
}

function givePrompt(PrToString, language) {
  if (language == "spanish") {
    return `
  Meta: Quiero que la inteligencia artificial analice un Pull Request del repositorio del juego de rol argentino "Argentum Online" y, con base en la información del PR, genere una pequeña descripción para incluir en el patch log del juego.

La descripción debe seguir el formato de ejemplo que te proporcionaré.

Formato de la respuesta:

La respuesta debe contener lo siguiente:

Título: Una breve descripción del cambio realizado en el PR.

Autor: Nombre del autor del PR.

PR: El número del PR.

Ejemplo de respuesta correcta:
"XXXXX
Mensajes de chat sobre la cabeza ahora traducidos y localizados.
XXXXX
Autor: ReyarB
XXXXX
¡Ahora los mensajes de chat que aparecen sobre la cabeza de los personajes se mostrarán en el idioma correcto! Disfruta de una experiencia de juego más inmersiva y con mejor traducción gracias a esta mejora.
XXXXX
PR: #759
XXXXX"

Advertencias:

Asegurate de que las XXXXX se conserven en la respuesta generada

Asegúrate de que el título sea claro y resuma el cambio de manera concisa.

Verifica que el número del PR esté bien indicado.

Evita hacer descripciones demasiado largas o técnicas. Deben ser fáciles de leer para cualquier usuario.

Evita ser muy entusiasta.

Contexto adicional:

Este PR es para el juego de rol argentino "Argentum Online", un juego con una comunidad activa y una base de jugadores que sigue de cerca las actualizaciones del juego. La descripción en el patch log debe ser atractiva y reflejar el cambio de forma clara.

Información de PR a analizar:

${PrToString}

`;
  } else {
    return `
Goal: I want the artificial intelligence to analyze a Pull Request from the repository of the Argentine role-playing game "Argentum Online" and, based on the PR information, generate a short description to include in the game's patch log.

The description should follow the example format I will provide.

Response format:

The response must contain the following:

Title: A brief description of the change made in the PR.

Author: Name of the PR's author.

PR: The number of the PR.

Example of a correct response:
"XXXXX
Chat messages above characters' heads now translated and localized.
XXXXX
Author: ReyarB
XXXXX
Now the chat messages that appear above characters' heads will be shown in the correct language! Enjoy a more immersive and better-translated gameplay experience thanks to this improvement.
XXXXX
PR: #759
XXXXX
-"

Warnings:

Make sure the XXXXX are kept in the generated response

Make sure the title is clear and summarizes the change concisely.

Verify that the PR number is correctly indicated.

Avoid making the description too long or too technical. It should be easy to read for any user.

Avoid being overly enthusiastic.

Additional context:

This PR is for the Argentine role-playing game "Argentum Online", a game with an active community and a player base that closely follows game updates. The description in the patch log should be engaging and clearly reflect the change.

PR information to analyze:

${PrToString}
`;
  }
}

export async function callGemini(PRLink, language) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`;

  const PR = await callGitHubApi(PRLink);

  let PRText = await gitHubPrToString(PR);

  let prompt = await givePrompt(PRText, language);
  // The data you want to send in the request body
  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: `${prompt}`,
          },
        ],
      },
    ],
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Set the content type to JSON
    },
    body: JSON.stringify(requestBody), // Convert the body to a JSON string
  });

  const data = await response.json();

  return data.candidates[0].content.parts[0].text;
}

window.callGitHubApi = await callGitHubApi;
window.callGemini = await callGemini;
