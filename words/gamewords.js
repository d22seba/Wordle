let gamewords = []

window.addEventListener("DOMContentLoaded", ()=>{
  fetch("words/gamewords.json")
    .then(res => res.json())
    .then(data => {
      gamewords = data; // Array jetzt im Speicher
      console.log(gamewords)
    })
    .catch(err => console.error("Fehler beim Laden der JSON:", err));
});
