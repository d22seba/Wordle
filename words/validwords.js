let validwords = [];

window.addEventListener("DOMContentLoaded", ()=>{
  fetch("words/validwords.json")
    .then(res => res.json())
    .then(data => {
      validwords = data; 
    })
    .catch(err => console.error("Fehler beim Laden der JSON:", err));
});
