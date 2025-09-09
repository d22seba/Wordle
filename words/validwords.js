let validwords = []

window.addEventListener("DOMContentLoaded", ()=>{
  fetch("words/validwords.json")
    .then(res => res.json())
    .then(data => {
      validwords = data; // Array jetzt im Speicher
      console.log(validwords)
    })
    .catch(err => console.error("Fehler beim Laden der JSON:", err));
});
