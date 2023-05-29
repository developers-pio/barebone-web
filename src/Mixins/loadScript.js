export default {
    methods: {
        loadScripts() {
            const script1 = document.createElement('script');
            script1.src = 'https://apis.google.com/js/api.js';
            script1.async = true;

            script1.onload = ()=> {
                // Function to execute after script is loaded
                this.gapiLoaded();
            };

            document.body.appendChild(script1);
            const script2 = document.createElement('script');
            script2.src = 'https://accounts.google.com/gsi/client';
            script2.async = true;

            script2.onload = ()=> {
                // Function to execute after script is loaded
                this.gisLoaded();
            };

            document.body.appendChild(script2);
        },
        gapiLoaded() {
            window.gapi.load("client", this.initializeGapiClient);
        },
        async initializeGapiClient() {
            await window.gapi.client.init({
              apiKey: process.env.VUE_APP_CALENDER_API_KEY,
              discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
            });
            window.gapiInitiated = true
            const myEvent = new CustomEvent("on-load-google-calander-scripts")
            document.dispatchEvent(myEvent)
        },
        gisLoaded() {
             window.tokenClient = window.google.accounts.oauth2.initTokenClient({
              client_id: process.env.VUE_APP_CALENDER_CLIENT_ID,
              scope: "https://www.googleapis.com/auth/calendar",
              callback: () => {
                const myEvent = new CustomEvent("on-getting-google-access-token");
                document.dispatchEvent(myEvent)
              },
            });
            window.gisInitiated = true
        }
    },
}