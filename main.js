const msgBox = document.getElementById("messageBox");
const inBox = document.getElementById("inputBox");
const sendBtn = document.getElementById("send");
const healthBox = document.getElementById("health");
const rageBox = document.getElementById("rage");

let health = 100;
let rage = 0;

// Update UI
healthBox.innerText = health;
rageBox.innerText = rage;

async function sendRoast() {
    const joke = inBox.value.trim();
    if (!joke) return;

    // Loading State
    sendBtn.disabled = true;
    msgBox.innerHTML += `<p style="color: blue;"><b>You:</b> ${joke}</p>`;
    inBox.value = "";

    try {
        const response = await fetch("/api/roast", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userJoke: joke, health, rage })
        });

        const data = await response.json();

        if (data.choices && data.choices[0]) {
            const fullText = data.choices[0].message.content;
            
            // Parse the "d:" part
            const parts = fullText.split("d:");
            const insult = parts[0];
            const stats = JSON.parse(parts[1] || '{"damage_taken":0, "rage_increase":0}');

            // Update Logic
            health -= stats.damage_taken;
            rage += stats.rage_increase;

            // Update UI
            healthBox.innerText = Math.max(0, health);
            rageBox.innerText = rage;
            msgBox.innerHTML += `<p><b>Bot:</b> ${insult}</p><hr>`;
        } else {
            msgBox.innerHTML += `<p style="color: red;">Error: ${data.error || "Unknown AI error"}</p>`;
        }
    } catch (err) {
        msgBox.innerHTML += `<p style="color: red;">Connection Error. Check Console.</p>`;
        console.error(err);
    }

    sendBtn.disabled = false;
}

sendBtn.addEventListener("click", sendRoast);