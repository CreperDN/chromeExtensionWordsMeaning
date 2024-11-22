let dictionary = {};

if (localStorage.getItem("dictionary")) {
  dictionary = JSON.parse(localStorage.getItem("dictionary"));
  displayTranslations();
}

function translate() {
  const wordInput = document.getElementById("wordInput").value.trim().toLowerCase();
  if (wordInput === "") {
    alert("Please enter a word!");
    return;
  }

  if (dictionary[wordInput]) {
    displayTranslation(wordInput, dictionary[wordInput]);
  } else {
    fetchTranslation(wordInput);
  }

  document.getElementById("wordInput").value = "";
}

async function fetchTranslation(word) {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = await response.json();
    if (data.title === "No Definitions Found") {
      displayTranslation(word, "No translation found");
    } else {
      const translation = data[0].meanings[0].definitions[0].definition;
      dictionary[word] = translation; 
      localStorage.setItem("dictionary", JSON.stringify(dictionary)); 
      displayTranslation(word, translation);
    }
  } catch (error) {
    console.error("Error fetching translation:", error);
    displayTranslation(word, "Error fetching translation");
  }
}

function displayTranslation(word, translation) {
  const translationsDiv = document.getElementById("translations");
  translationsDiv.innerHTML += `<p><strong>${word}:</strong> ${translation}</p>`;
}

function displayTranslations() {
  const translationsDiv = document.getElementById("translations");
  translationsDiv.innerHTML = Object.keys(dictionary).map(word => `<p><strong>${word}:</strong> ${dictionary[word]}</p>`).join('');
}

document.getElementById("translateButton").addEventListener("click", translate);