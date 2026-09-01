const screens = [...document.querySelectorAll(".screen")];

const state = {
  host: "",
  feast: "",
  player: "",
  code: "",
  selected: null
};

const demoProfiles = [
  { name: "Mystery", emoji: "🌙", vibe: "Quietly mysterious" },
  { name: "Sunshine", emoji: "☀️", vibe: "Certified good vibes" },
  { name: "Trouble", emoji: "🖤", vibe: "Probably a bad idea" },
  { name: "Bookworm", emoji: "📚", vibe: "Lives in fictional worlds" }
];

function show(id) {
  screens.forEach(screen => screen.classList.toggle("active", screen.id === id));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function randomCode() {
  return "FEAST-" + Math.floor(1000 + Math.random() * 9000);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}

document.getElementById("hostBtn").addEventListener("click", () => show("host"));
document.getElementById("joinBtn").addEventListener("click", () => show("join"));

document.querySelectorAll("[data-back]").forEach(button => {
  button.addEventListener("click", () => show("home"));
});

document.getElementById("createBtn").addEventListener("click", () => {
  const host = document.getElementById("hostName").value.trim();
  const feast = document.getElementById("feastName").value.trim();

  if (!host || !feast) {
    alert("Give us your name and a Feast name first 😭");
    return;
  }

  state.host = host;
  state.player = host;
  state.feast = feast;
  state.code = randomCode();

  document.getElementById("roomCode").textContent = state.code;
  document.getElementById("created").classList.remove("hidden");
});

document.getElementById("copyBtn").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(state.code);
    document.getElementById("copyBtn").textContent = "✅ Copied!";
    setTimeout(() => document.getElementById("copyBtn").textContent = "📋 Copy Code", 1400);
  } catch {
    alert("Your code is " + state.code);
  }
});

document.getElementById("enterLobbyBtn").addEventListener("click", () => {
  enterLobby(state.host, state.feast, state.code);
});

document.getElementById("joinFeastBtn").addEventListener("click", () => {
  const player = document.getElementById("playerName").value.trim();
  const code = document.getElementById("joinCode").value.trim().toUpperCase();

  if (!player || !code) {
    alert("Enter your nickname and the Feast code.");
    return;
  }

  state.player = player;
  state.code = code;
  state.feast = "Your Group's Feast";
  enterLobby(player, state.feast, code);
});

function enterLobby(player, feast, code) {
  document.getElementById("lobbyTitle").textContent = escapeHtml(feast);
  document.getElementById("lobbyCode").textContent = escapeHtml(code);
  document.getElementById("playerList").innerHTML = `
    <div class="player"><span class="avatar">💌</span><strong>${escapeHtml(player)}</strong><small> · You</small></div>
  `;
  document.getElementById("playerCount").textContent = "1";
  show("lobby");
}

document.getElementById("startDemoBtn").addEventListener("click", () => {
  const grid = document.getElementById("profileGrid");
  grid.innerHTML = demoProfiles.map((profile, index) => `
    <div class="profile" data-index="${index}" role="button" tabindex="0">
      <div class="big-avatar">${profile.emoji}</div>
      <div>
        <strong>${profile.name}</strong>
        <small>${profile.vibe}</small>
      </div>
      <div class="choose">♡</div>
    </div>
  `).join("");

  grid.querySelectorAll(".profile").forEach(card => {
    const choose = () => {
      grid.querySelectorAll(".profile").forEach(item => item.classList.remove("selected"));
      card.classList.add("selected");
      state.selected = Number(card.dataset.index);
      card.querySelector(".choose").textContent = "💗";
      document.getElementById("finishBtn").classList.remove("hidden");
    };

    card.addEventListener("click", choose);
    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") choose();
    });
  });

  show("game");
});

document.getElementById("finishBtn").addEventListener("click", () => {
  const selected = demoProfiles[state.selected];
  document.getElementById("resultText").innerHTML =
    `You picked <strong>${escapeHtml(selected.name)}</strong>. 👀<br><br>` +
    `The Feast has officially started. This is only Round 1 — the next version will add secret admirers, challenges, recoupling and the big final reveal.`;
  show("result");
});

document.getElementById("homeBtn").addEventListener("click", () => {
  state.selected = null;
  show("home");
});
