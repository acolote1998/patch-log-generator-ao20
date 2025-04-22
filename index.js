async function callGitHubApi(pullRequestLink) {
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
