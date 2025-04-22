import geminiKey from "./key.js";

export async function callGitHubApi(pullRequestLink) {
  let modifiedString = pullRequestLink.replace(
    "https://github.com/",
    "https://api.github.com/repos/"
  );
  modifiedString = modifiedString.replace("pull", "pulls");
  let pullRequest;
  const response = await fetch(modifiedString);
  const data = await response.json();
  return {
    titulo: data.title,
    autor: data.user.login,
    descripcion: data.body,
    prNumber: data.number,
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

function givePrompt(PrToString) {
  return `
  Meta: Quiero que la inteligencia artificial analice un Pull Request del repositorio del juego de rol argentino "Argentum Online" y, con base en la información del PR, genere una pequeña descripción para incluir en el patch log del juego.

La descripción debe seguir el formato de ejemplo que te proporcionaré.

Formato de la respuesta:

La respuesta debe contener lo siguiente:

Título: Una breve descripción del cambio realizado en el PR.

Autor: Nombre del autor del PR.

PR: El número del PR.

Ejemplo de respuesta correcta:
"
Mensajes de chat sobre la cabeza ahora traducidos y localizados.

Autor: ReyarB

¡Ahora los mensajes de chat que aparecen sobre la cabeza de los personajes se mostrarán en el idioma correcto! Disfruta de una experiencia de juego más inmersiva y con mejor traducción gracias a esta mejora.

PR: #759
"

Advertencias:

Asegúrate de que el título sea claro y resuma el cambio de manera concisa.

Verifica que el número del PR esté bien indicado.

Evita hacer descripciones demasiado largas o técnicas. Deben ser fáciles de leer para cualquier usuario.

Evita ser muy entusiasta.

Contexto adicional:

Este PR es para el juego de rol argentino "Argentum Online", un juego con una comunidad activa y una base de jugadores que sigue de cerca las actualizaciones del juego. La descripción en el patch log debe ser atractiva y reflejar el cambio de forma clara.

Información de PR a analizar:

${PrToString}

`;
}

export async function callGemini(PRLink) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`;

  const PR = await callGitHubApi(PRLink);

  let PRText = await gitHubPrToString(PR);

  let prompt = await givePrompt(PRText);
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

window.callGitHubApi = callGitHubApi;
window.callGemini = callGemini;
