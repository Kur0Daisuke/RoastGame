async function sendRoastToPoe(userJoke) {
    try {
        // Point to your local Vercel function
        const response = await fetch("/api/roast", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userJoke, health, rage })
        });

        const out = await response.json();
        const aiBurn = out.choices[0].message.content;
        
        // ... (Your existing d: parsing logic here) ...
        
        return aiBurn;
    } catch (error) {
        console.error("Connection failed:", error);
        return "The server is as broken as your humor.";
    }
}