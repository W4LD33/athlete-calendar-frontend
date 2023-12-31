import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';

export default function useSavedEvents() {
    const store = useStore();
    const savedEvents = ref({});
    const isLoading = ref(false);
    const error = ref(null);
    
    const fetchSavedEvents = async () => {
        isLoading.value = true;
        error.value = null;

        try {
            const response = await fetch(process.env.VUE_APP_API_URL + "/saved-events", {
                headers: {
                    "Authorization": `Bearer ${store.state.token}`
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch saved events.");
            }

            const savedEventData = await response.json();
            savedEventData.forEach(event => {
                savedEvents.value[event.id] = true; 
            });
            

        } catch (error) {
            console.error("Error fetching saved events:", error);
            error.value = err.message;
        }
        finally {
            isLoading.value = false;
        }
    };


    return {
        savedEvents,
        isLoading,
        error,
        fetchSavedEvents
    };
}
