export function addMoreInputs() {
  let inputDivs = document.getElementById("inputs");
  let newInput = document.createElement("input");
  let newBr = document.createElement("br");

  newInput.type = "text";
  inputDivs.appendChild(newBr);
  inputDivs.appendChild(newInput);
}

export async function getPatchLog(language) {
  let linkObjects = document.querySelectorAll("input");
  let linksUrls = [];
  for (let link of linkObjects) {
    linksUrls.push(link.value);
  }
  let finalPatchLog = "";
  let serverPatchLog = "";
  let clientPatchLog = "";
  for (let link of linksUrls) {
    finalPatchLog += (await callGemini(link, language)) + `\n - \n`;
  }
  return finalPatchLog;
}

export async function patchToTextAreas() {
  let textAreaSpanish = document.getElementById("spanishPatchLog");
  textAreaSpanish.innerText = await getPatchLog("spanish");

  let textAreaEnglish = document.getElementById("englishPatchLog");
  textAreaEnglish.innerText = await getPatchLog("english");
}

window.getPatchLog = getPatchLog;
window.addMoreInputs = addMoreInputs;
window.patchToTextAreas = patchToTextAreas;
