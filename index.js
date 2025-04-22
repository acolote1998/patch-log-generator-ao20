function callGitHubApi(pullRequestLink) {
  let modifiedString = pullRequestLink.replace(
    "https://github.com/",
    "https://api.github.com/repos/"
  );
  modifiedString = modifiedString.replace("pull", "pulls");
  let pullRequest;
  console.log(modifiedString);
  fetch(modifiedString)
    .then((response) => response.json())
    .then((response) => {
      let prTitle = response.title;
      let autor = response.user.login;
      let descripcion = response.body;
      let prNumber = response.number;
      pullRequest = {
        titulo: prTitle,
        autor: autor,
        descripcion: descripcion,
        prNumber: prNumber,
      };
      console.log(pullRequest);
    });
}
