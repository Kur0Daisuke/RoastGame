const inputBox = document.getElementById('inputBox');
const sendBtn = document.getElementById('send');
const messageBox = document.getElementById('messageBox');
const healthEl = document.getElementById('health');
const rageEl = document.getElementById('rage');

// Assuming these are the AI's stats
let aiHealth = 100;
let aiRage = 0;

// --- ALL YOUR FETCH LOGIC ABOVE ---

// ADD THIS AT THE BOTTOM OF main.js
function appendMessage(sender, text) {
    const messageBox = document.getElementById('messageBox');
    
    // Create a new div for the message
    const div = document.createElement('div');
    div.style.marginBottom = "10px";
    
    // Set the content (Example: You: Hello)
    div.innerHTML = `<strong>${sender}:</strong> ${text}`;
    
    // Add it to the box
    messageBox.appendChild(div);
    
    // Auto-scroll to the bottom
    messageBox.scrollTop = messageBox.scrollHeight;
}

sendBtn.addEventListener('click', async () => {
    const text = inputBox.value;
    if (!text) return;

    appendMessage("You", text);
    inputBox.value = "";

    try {
        const response = await fetch('http://localhost:3000/api/roast', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });

        const data = await response.json();

        // The AI responds and reports how much it was "hurt"
        appendMessage("AI Boss", data.reply);
        
        aiHealth -= data.hpLoss;
        aiRage += data.rageGain;

        // Update UI
        document.getElementById('health').innerText = Math.max(0, aiHealth);
        document.getElementById('rage').innerText = aiRage;

        if (aiHealth <= 0) {
            appendMessage("SYSTEM", "🏆 VICTORY! You roasted the AI into retirement.");
            sendBtn.disabled = true;
        }
        
        if (aiRage >= 100) {
            appendMessage("🔥 BOSS RAGE", "The AI is furious! Its next roasts will be double-damage!");
            // You could add a screen shake effect here!
        }

    } catch (err) {
        console.error(err);
    }
});