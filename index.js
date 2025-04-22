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

export async function callGemini(text) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`;

  // The data you want to send in the request body
  const requestBody = {
    contents: [
      {
        parts: [{ text: `Favorite music of Argentinian musicians` }],
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
