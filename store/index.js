//Store is a mechanism in Vue/Nuxt to store global states. They are directly
//accessible, but can be accessed only through methods within mutations and actions 
export const state = () => ({   
    auth: null,
    devices: []
});

export const mutations = {    //mutations are simple state setters
    setAuth(state, auth) {
        state.auth = auth;
    },
    
    setDevices(state, devices) {
        state.devices = devices;
    }
};

export const actions = {      //actions are more elaborate methods that use the state

    readToken() {
        let auth = null;
        try {
            auth = JSON.parse(localStorage.getItem("auth"));
        } catch (error) {
            console.log(err);
        }
        //saving auth in global state
        this.commit("setAuth", auth);
    },

    getDevices() {

        const axiosHeader = {
        headers: {
            token: this.state.auth.token
        }
        };
        this.$axios.get("/device", axiosHeader)
        .then(res => {
        console.log(res.data.data);
        this.commit("setDevices", res.data.data)
        });
    }

};