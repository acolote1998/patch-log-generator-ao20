export function addMoreInputs() {
  let inputDivs = document.getElementById("inputs");
  let newInput = document.createElement("input");
  let newBr = document.createElement("br");

  newInput.type = "text";
  inputDivs.appendChild(newBr);
  inputDivs.appendChild(newInput);
}

export async function getPatchLog() {
  let linkObjects = document.querySelectorAll("input");
  let linksUrls = [];
  for (let link of linkObjects) {
    linksUrls.push(link.value);
  }
  let finalPatchLog = "";
  for (let link of linksUrls) {
    finalPatchLog += (await callGemini(link, "spanish")) + `\n - \n`;
  }
  return finalPatchLog;
}

window.getPatchLog = getPatchLog;
window.addMoreInputs = addMoreInputs;
