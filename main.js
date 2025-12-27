async function sendRoastToBackend(userJoke) {
    try {
        const response = await fetch("/api/roast", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userJoke, health, rage }),
        });

        // 1. Check if the response is OK (200)
        if (!response.ok) {
            const errorText = await response.text(); // Read as text first
            console.error("Server Error Response:", errorText);
            return "Server is feeling sick. d:{\"damage_taken\": 0, \"rage_increase\": 0}";
        }

        // 2. Parse JSON
        const data = await response.json();
        
        if (data && data.choices && data.choices[0]) {
            return data.choices[0].message.content;
        } 
        
        return "I have nothing to say to that. d:{\"damage_taken\": 0, \"rage_increase\": 0}";

    } catch (error) {
        console.error("Network/Syntax Error:", error);
        return "Connection failed. d:{\"damage_taken\": 0, \"rage_increase\": 0}";
    }
}