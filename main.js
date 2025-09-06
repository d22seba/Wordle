class Game{

    
    constructor(){
        this.currentrow = 0
        this.currentletter = 0
        this.minlen = 5

        this.allrows = []
        this.allletters = []

        console.log("es läuft")

        document.addEventListener("keydown", (event) => this.inputread(event));


        document.querySelectorAll(".letter-indicator").forEach(button=>{
            button.addEventListener("click", () =>{
                this.inputadd(button.dataset.letter)
            })
        })

        document.getElementById("backspace-key").addEventListener("click", () =>{
            this.inputdelte()
        })

        document.getElementById("enter-key").addEventListener("click", ()=>{
            this.inputsubmit()
        })
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

    greenletter(num){
        const letter = this.allletters[this.currentrow][num]
        letter.style.backgroundColor = "green"
    }
    yellowletter(num){
        const letter = this.allletters[this.currentrow][num]
        letter.style.backgroundColor = "yellow"
    }
    grayletter(num){
        const letter = this.allletters[this.currentrow][num]
        letter.style.backgroundColor = "gray"
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
                this.greenletter(i)
            } else if(results[i] === 'yellow'){
                this.yellowletter(i)
            } else {
                this.grayletter(i)
            }
        }
    }
}
const game = new Game();

let randomnum = Math.floor(Math.random() * gamewords.length)
const gameword = gamewords[randomnum]

game.scanrows()
