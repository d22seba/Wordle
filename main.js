class Game{

    
    constructor(){
        this.currentrow = 0
        this.currentletter = 0
        this.minlen = 5

        this.allrows = []
        this.allletters = []

        let gamerun = true
        
        console.log("es läuft")

        let toggle = false;
        let popupbutton = document.getElementById("addword")
        popupbutton.addEventListener("click", ()=>{
            const popup = document.getElementById("popup");
            
            if(toggle){
                gamerun = true;
                popup.className = "closed"
                popupbutton.classList.remove("rotated")
                toggle = false;
            } else {
                gamerun = false;
                popup.className = "open"
                popupbutton.classList.add("rotated")
                popup.innerHTML = `
                <div class="popup-content">
                <h3>Füge ein fehlendes Wort hinzu</h3>
                <div>    
                <div id="loaderarea"></div>
                <input type="text" id="new-word" maxlength="5">
                <div class="notready" id="sendbutton">
                <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#000000ff"><path d="M113.86-153.62v-652.76L887.97-480 113.86-153.62Zm72.81-111.33L699.92-480 186.67-697.05v152.77L430.95-480l-244.28 62.95v152.1Zm0 0v-432.1 432.1Z"/></svg>
                </div>
                </div>
                <div id="result"></div>
                </div>
                `;
                toggle = true;
                let input = document.getElementById("new-word")
                document.getElementById("sendbutton").addEventListener("click",async ()=>{
                    let area = document.getElementById("loaderarea")
                    let eintrag = input.value
                    input.value = ""

                    if(validwords.includes(eintrag.toUpperCase())){
                        document.getElementById("result").innerHTML = `"${eintrag}" existiert schon im Spiel`;
                        return;
                    }

                    area.innerHTML = `<span class="loader"></span>`
                    await this.checkword(eintrag)
                    area.innerHTML = ""
                })
                input.addEventListener("keydown",(event)=>{
                    const key = event.key
                    const button = document.getElementById("sendbutton")
                    const list = ["ö","ä","ü","ß"]
                    if(list.includes(key)) event.preventDefault()
                    setTimeout(() => {
                        if(input.value.length == 5) button.className = "ready"
                        else button.className = "notready"
                    }, 0);
                })
            }
        })

        document.addEventListener("keydown", (event) => {
            if(gamerun) this.inputread(event)
            });
        
        document.querySelectorAll(".letter-indicator").forEach(button=>{
            button.addEventListener("click", () =>{
                if(gamerun) this.inputadd(button.dataset.letter)
                })
        })
        
        document.getElementById("backspace-key").addEventListener("click", () =>{
            if(gamerun) this.inputdelte()
            })
        
        document.getElementById("enter-key").addEventListener("click", ()=>{
            if(gamerun) this.inputsubmit()
            })
    }

    async checkword(word){
        let url = `https://de.wiktionary.org/w/api.php?action=query&titles=${encodeURIComponent(word)}&format=json&origin=*`;
        const result = document.getElementById("result")

        try {
            let res = await fetch(url);
            let data = await res.json();

            await new Promise(async resolve=>{  // ← async hinzufügen
                setTimeout(() => {  // ← async hinzufügen
                    if (data.query.pages["-1"]) {
                        result.textContent = `"${word}" wurde nicht als deutsches Wort erkannt ❌`
                    } else {
                        result.textContent = `"${word}" erkannt und bald im Spiel ✅`;
                        window.sendword(word.toUpperCase());
                    }
                    resolve()
                }, 1500);
            })

        } catch (err) {
        }
    }
    
    scanrows(){
        const rows = document.querySelectorAll(".word-row")
        rows.forEach((row, rownum)=>{

            this.allrows[rownum] = row 
            const letters = row.querySelectorAll(".letter")
            this.allletters[rownum] = [];

            letters.forEach((letter, letternum)=>{
                this.allletters[rownum][letternum] = letter
            })
        })
    }

    inputread(event){
        if(event.key === "Backspace"){
            event.preventDefault()
            this.inputdelte()
        }
        if(/^[a-zA-Z]$/.test(event.key)){
            event.preventDefault()
            this.inputadd(event.key)
        }
        if(event.key === "Enter"){
            event.preventDefault()
            this.inputsubmit()
        }
    }

    inputadd(input){
        if(this.currentletter == 5) return;

        const currentslot = this.allletters[this.currentrow][this.currentletter]
        currentslot.innerText = input.toUpperCase()
        this.currentletter++;
    }
    inputdelte(){
        if(this.currentletter == 0) return;

        this.currentletter--;
        const currentslot = this.allletters[this.currentrow][this.currentletter]
        currentslot.innerText = ""
    }
    inputsubmit(){
        let enteredword = this.allletters[this.currentrow].map(div => div.innerText).join("")

        if(this.currentletter < 5) return;
        if(this.currentrow == 7) return;
        if(!validwords.includes(enteredword)) return;

        this.checkanswer();
        this.currentletter = 0
        this.currentrow++
    }

    greenletter(num, key){
        const letter = this.allletters[this.currentrow][num]
        const button = this.findbutton(key)
        letter.style.backgroundColor = "green"
        if(button.classList.contains("partial")) button.classList.remove("partial")
        if(button.classList.length === 1) button.classList.add("correct")
    }
    yellowletter(num, key){
        const letter = this.allletters[this.currentrow][num]
        const button = this.findbutton(key)
        letter.style.backgroundColor = "yellow"
        if(button.classList.length === 1)button.classList.add("partial")
    }
    grayletter(num, key){
        const letter = this.allletters[this.currentrow][num]
        const button = this.findbutton(key)
        letter.style.backgroundColor = "gray"
        if(button.classList.length === 1)button.classList.add("wrong")
    }
    findbutton(letter){
        return document.querySelector(`[data-letter="${letter}"]`)
    }

    checkanswer(){
        let enteredword = this.allletters[this.currentrow].map(div => div.innerText).join("")
        console.log(gameword)

        let availableLetters = gameword.split("")
        
        let results = new Array(5).fill('gray')

        if(enteredword === gameword) console.log("gewonnen!!!")

        // Phase 1: Grüne Buchstaben finden
        for(let i = 0; i < 5; i++){
            if(gameword[i] === enteredword[i]){
                results[i] = 'green'
                let index = availableLetters.indexOf(enteredword[i])
                availableLetters.splice(index, 1)
            }
        }

        // Phase 2: Gelbe Buchstaben finden  
        for(let i = 0; i < 5; i++){
            if(results[i] === 'gray'){ // Nur wenn noch nicht grün
                let index = availableLetters.indexOf(enteredword[i])
                if(index !== -1){
                    results[i] = 'yellow'
                    availableLetters.splice(index, 1)
                }
            }
        }

        // Phase 3: Farben anwenden
        for(let i = 0; i < 5; i++){
            if(results[i] === 'green'){
                this.greenletter(i, enteredword[i])
                
            } else if(results[i] === 'yellow'){
                this.yellowletter(i, enteredword[i])
            } else {
                this.grayletter(i, enteredword[i])
            }
        }
    }
}
const game = new Game();

let randomnum = Math.floor(Math.random() * gamewords.length)
const gameword = gamewords[randomnum]

game.scanrows()
