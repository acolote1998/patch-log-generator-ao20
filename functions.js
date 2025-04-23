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
    finalPatchLog += await callGemini(link, language);
  }
  return finalPatchLog;
}

export async function patchToTextAreas() {
  let textAreaSpanish = document.getElementById("spanishPatchLog");
  let spanishText = await getPatchLog("spanish");
  spanishText = spanishText.replaceAll("`", "").split("XXXXX");
  for (let string of spanishText) {
    textAreaSpanish.value = textAreaSpanish.value + string;
  }

  let textAreaEnglish = document.getElementById("englishPatchLog");
  let englishText = await getPatchLog("english");
  englishText = englishText.replaceAll("`", "").split("XXXXX");
  for (let string of englishText) {
    textAreaEnglish.value = textAreaEnglish.value + string;
  }
}

window.getPatchLog = getPatchLog;
window.addMoreInputs = addMoreInputs;
window.patchToTextAreas = patchToTextAreas;
