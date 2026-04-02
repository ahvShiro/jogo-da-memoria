import { URL, WORDS } from "./config.js";

export async function getWords() {
  let words = [];

  try {
    const resp = await fetch(`${URL}/api/palavras.php?quantidade=6`);

    if (!resp.ok) {
      throw new Error(`Error: ${resp.status}`);
    }

    words = await resp.json();
    return words;
  } catch (error) {
    console.log(error);
    return WORDS;
  }
}

export async function saveMatch(match) {
  var userName = match.nome;

  console.log(match);

  if (isUsernameValid(userName)) {
    const error = new Error("User name required");
    error.code = "USERNAME_REQUIRED";
    throw error;
  }

  try {
    const response = await fetch(`${URL}/api/salvar.php`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(match),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(`Error: ${response.status}:${errorBody.error}`);
    }

    const data = await response.json();
    // TODO usar as informações dessa resposta
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

function isUsernameValid(userName) {
    return userName.trim() === "" || userName == null || userName == undefined || userName == "undefined"
}