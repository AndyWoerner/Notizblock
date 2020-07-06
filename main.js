//VUEX
// 4 Komponenten eines VUEX Stores
const state = {
    notes: [{
        note: "Das ist eine Notiz",
        timestamp: new Date().toLocaleString()
    }]
}
// getters sind wie die computed properties im store
const getters = {
    getNotes() {
        return state.notes;
    },
    getNoteCount() {
        return state.notes.length

    }
}
// Funktionen die unseren State ändern können
// Funktionen der Mutations werden GROSS geschrieben
const mutations = {
    STORE_NOTE(state, payload) { //payload sind die Daten die gespeichert werden sollen. Gängige Benennung.
        state.notes.push(payload)
    },
    REMOVE_NOTE(state, index) {
        state.notes.splice(index, 1)
    },
    UPDATE_NOTE(state, payload) {
        state.notes[payload.index] = payload.payload
    }
}
// Actions
const actions = {
    storeNote(context, payload) {
        //context ist ähnlich wie state. Aber über den context können wir getters kontaktieren und state aufrufen
        //function commit -> damit wird ein mutation aufgerufen   
        context.commit("STORE_NOTE", payload)
    },
    removeNote(context, timestamp) {
        const index = context.state.notes.findIndex(note => note.timestamp === timestamp)
        context.commit("REMOVE_NOTE", index)
    },
    updateNote(context, payload) {
        const index = context.state.notes.findIndex(note => note.timestamp === payload.timestamp)
        payload.timestamp = new Date().toLocaleString()
        context.commit("UPDATE_NOTE", { index, payload })
    }
}

const store = new Vuex.Store({
    //ES6 Schreibweise. key:value sind identisch, daher Kurzschreibweise
    state,
    getters,
    mutations,
    actions
})


//VUE 

const NoteCountComponent = {
    template: `
        <div>Anzahl der Notizen : <strong> {{ noteCount }}</strong></div>
    `,
    computed: {
        noteCount() {
            return this.$store.getters.getNoteCount
        }
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
            const newNote = {
                note: this.note,
                timestamp: new Date().toLocaleString()
            }
            this.$store.dispatch("storeNote", newNote)
            this.note = ""; //nachdem die Notiz gesendet wurde, wird das Feld wieder leer gemacht
        }
    }

}

new Vue({
    el: "#app",
    // store in app einbinden
    // components haben Zugriff auf store
    store,
    components: {
        "input-component": InputComponent,
        "note-count-component": NoteCountComponent
    },
    data: {
        placeholder: "Gib hier deine neue Notiz an",
        activeEditNote: null ,
        activeEditNoteContent: ""
    },
    computed: {
        notes() {
            return this.$store.getters.getNotes
        }
    },
    methods: {
        storeNote(event) {
            this.notes.push(event.note)
            this.timestamps.push(event.timestamp)
        },
        deleteNote(noteTimestamp) {
            this.$store.dispatch("removeNote", noteTimestamp)
        },
        editNote(note) {
            this.activeEditNote = note
            this.activeEditNoteContent = this.activeEditNote.note
        },
        updateNote() {
            const newNote = {
                note: this.activeEditNoteContent,
                timestamp: this.activeEditNote.timestamp
            }
            this.$store.dispatch("updateNote", newNote)
            this.activeEditNote = null
        }
    }
})