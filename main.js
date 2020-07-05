const EventBus = new Vue();

const NoteCountComponent = {
    template: `
        <div>Anzahl der Notizen : <strong> {{ noteCount }}</strong></div>
    `,
    data(){
        return{
            noteCount: 0
        }
    },
    created(){
        EventBus.$on("new-note", event => {
            this.noteCount++
        })
    }
}


const InputComponent = {
    template: `
            <input 
                type="text"
                class="form-control"
                :placeholder="placeholder"
                v-model="note" 

                @keyup.enter="submitNote"
            >
        `,
    props: ["placeholder"],
    // data muss innerhalb der component eine Funktion sein. Gibt ein Objekt mit den Daten zurück
    data() {
        return {
            note: ""
        }
    },
    methods: {
        submitNote() {
            EventBus.$emit("new-note", {
                note: this.note,
                timestamp: new Date().toLocaleString()
            })
            this.note = ""; //nachdem die Notiz gesendet wurde, wird das Feld wieder leer gemacht
        }
    }

}

new Vue({
    el: "#app",
    components: {
        "input-component": InputComponent,
        "note-count-component": NoteCountComponent
    },
    data: {
        notes: [],
        timestamps: [],
        placeholder: "Gib hier deine neue Notiz an"
    },
    methods: {
        storeNote(event) {
            this.notes.push(event.note)
            this.timestamps.push(event.timestamp)
        }
    },
    created(){
        EventBus.$on("new-note", event => this.storeNote(event))
    }
})