// --- CONFIGURATION ---
const msgBox = document.getElementById("messageBox");
const inBox = document.getElementById("inputBox");
const sendBox = document.getElementById("send");
const healthBox = document.getElementById("health");
const rageBox = document.getElementById("rage");

// Initial Game Stats
let health = 100;
let rage = 0;

// Set initial display
healthBox.innerText = health;
rageBox.innerText = rage;

/**
 * Connects to the Vercel Backend (/api/roast.js)
 */
async function sendRoastToBackend(userJoke) {
    try {
        const response = await fetch("/api/roast", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userJoke, health, rage }),
        });

        const data = await response.json();
        console.log("Full Data from Backend:", data);

        // SAFETY CHECK: Make sure 'choices' and 'message' exist
        if (data && data.choices && data.choices[0] && data.choices[0].message) {
            return data.choices[0].message.content;
        } else {
            // If Hugging Face is loading or threw an error
            console.error("AI Response Error:", data);
            return "My brain just glitched. Try again. d:{\"damage_taken\": 0, \"rage_increase\": 0}";
        }

    } catch (error) {
        console.error("Connection Error:", error);
        return "Connection lost! d:{\"damage_taken\": 0, \"rage_increase\": 0}";
    }
}

/**
 * Handle Button Click
 */
sendBox.addEventListener("click", async () => {
    const userJoke = inBox.value.trim();
    if (!userJoke) return;

    // 1. Update UI to show loading
    sendBox.disabled = true;
    msgBox.innerHTML += `<p><b>You:</b> ${userJoke}</p>`;
    inBox.value = "";

    // 2. Get response from our Backend
    const fullText = await sendRoastToBackend(userJoke);

    // 3. Parse the damage data (the "d:{" part)
    if (fullText.includes("d:")) {
        const parts = fullText.split("d:");
        const insult = parts[0].trim();
        const statsStr = parts[1].trim();

        try {
            const stats = JSON.parse(statsStr);
            
            // Update stats logic
            health -= (stats.damage_taken || 0);
            rage += (stats.rage_increase || 0);

            // Update UI
            healthBox.innerText = Math.max(0, health);
            rageBox.innerText = rage;
            msgBox.innerHTML += `<p><b>Bot:</b> ${insult}</p><hr>`;
        } catch (e) {
            msgBox.innerHTML += `<p><b>Bot:</b> ${fullText}</p><hr>`;
        }
    } else {
        msgBox.innerHTML += `<p><b>Bot:</b> ${fullText}</p><hr>`;
    }

    // 4. Re-enable button & Scroll
    sendBox.disabled = false;
    window.scrollTo(0, document.body.scrollHeight);
});