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

export async function callGemini(text) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`;
  const PR = await callGitHubApi(
    "https://github.com/ao-org/argentum-online-server/pull/759"
  );
  let PRText = await gitHubPrToString(PR);
  // The data you want to send in the request body
  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: `Dame una opinion de la siguiente PR: ${PRText}`,
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

  console.log(data.candidates[0].content.parts[0].text);
}

window.callGitHubApi = callGitHubApi;
window.callGemini = callGemini;
