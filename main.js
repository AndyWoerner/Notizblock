const InputComponent = {
    template: `
            <input 
                type="text"
                class="form-control"
                :placeholder="placeholder"
            >
        `,
        props: ["placeholder"]
        
}

new Vue({
    el:"#app",
    components:{
        "input-component": InputComponent
    },
    data: {
        notes: [],
        timestamps: [],
        placeholder: "Gib hier deine neue Notiz an"
    }
})