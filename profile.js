document.addEventListener('DOMContentLoaded', () => {
  // 🎨 DOM Elements
  const el = id => document.getElementById(id);
  const badgeContainer = el('award-container');
  const badgeCountText = el('collected-badge-count');
  const badgeRank = el('badge-rank');
  const totalBadgeCount = el('total-badge-count');
  const collectedStarContainer = el('collected-star-cards');
  const collectedCardCount = el('collected-card-count');
  const totalCardCount = el('total-card-count');
  const popup = el('badge-popup');
  const bgMusic = el('bg-music');
  const toggleBtn = el('toggle-music');
  const pollForm = el('titlePoll');
  const resultBox = el('pollResult');

  
  // 🎵 Music Toggle
  let musicPlaying = true;
  if (toggleBtn && bgMusic) {
    toggleBtn.addEventListener('click', () => {
      musicPlaying ? bgMusic.pause() : bgMusic.play().catch(err => console.warn("🎵 Music play failed:", err));
      toggleBtn.textContent = musicPlaying ? '🔇 Music On' : '🔊 Music Off';
      musicPlaying = !musicPlaying;
    });
  }

  // 🐚 Data
  const awardCards = [
    "bon_bon_award.png", "craig_award.png", "dad_gill_award.png", "destiny_award.png",
    "grumpy_shark_award.png", "happy_grumpy_shark_award.png", "irene_lightfish_award.png",
    "jack_gill_award.png", "jada_award.png", "jasmine_award.png", "jessica_gill_award.png",
    "kristine_award.png", "lacy_award.png", "legendary_gold_grumpy_award.png", "rare_silver_grumpy_award.png",
    "lisa_award.png", "matilda_award.png", "maz_award.png", "maz_hiding_award.png", "mckenna_award.png",
    "mum_gill_award.png", "ollie_award.png", "orion_award.png", "pauline_award.png", "polly_award.png",
    "puffy_award.png", "ronnie_award.png", "rylee_award.png"
  ];
  const totalCards = 26;
  const earnedStarCards = JSON.parse(localStorage.getItem('earnedStarCards')) || [];
  const earnedBadgesRaw = JSON.parse(localStorage.getItem('earnedBadges')) || [];
  const earnedBadges = earnedBadgesRaw.map(b => b.split('/').pop());

  // 🧜‍♀️ Rank Logic
  const getRank = count =>
    count === 0 ? 'Bubble Beginner' :
    count < 5 ? 'Friendly Fin' :
    count < 10 ? 'Reef Rookie' :
    count < 20 ? 'Tide Tamer' : 'Gold-Star Master';

  // 🏅 Update Badge Stats
  if (badgeCountText) badgeCountText.textContent = `Collected Badges: ${earnedBadges.length}`;
  if (badgeRank) badgeRank.textContent = `Rank: ${getRank(earnedBadges.length)}`;
  if (totalBadgeCount) {
    const remainingBadges = awardCards.length - earnedBadges.length;
    totalBadgeCount.textContent = remainingBadges === 0
      ? `🎉 Collection Complete! All ${awardCards.length} badges earned!`
      : `Remaining Badges: ${remainingBadges} / ${awardCards.length}`;
  }

  // 🥇 Render Badges
  if (badgeContainer) {
    badgeContainer.innerHTML = earnedBadges.length === 0
      ? "<p>No badges earned yet. Play the Snap game to unlock some!</p>"
      : earnedBadges.map(badgeFile => {
          const name = badgeFile.replace('.png', '').replace(/[_-]/g, ' ');
          return `
            <div class="badge earned" onclick="showBadgePopup('${name}')">
              <img src="BADGES/${badgeFile}" alt="${name}">
              <div class="badge-label">${name}</div>
            </div>
          `;
        }).join('');
  }

  // 📊 Poll Logic
  if (pollForm && resultBox) {
    pollForm.addEventListener("submit", event => {
      event.preventDefault();
      const choice = document.querySelector("input[name='sharkTitle']:checked");
      if (!choice) {
        resultBox.textContent = "Please select an option before submitting.";
        return;
      }
      const data = new FormData();
      data.append("sharkTitle", choice.value);
      fetch(pollForm.action, {
        method: pollForm.method,
        body: data,
        headers: { Accept: "application/json" }
      })
      .then(res => {
        resultBox.textContent = res.ok
          ? `✅ Thanks for voting! You chose: "${choice.value}"`
          : "❌ Submission failed. Try again soon!";
        if (res.ok) pollForm.reset();
      })
      .catch(() => resultBox.textContent = "⚠️ Network error. Reef signal lost.");
    });
  }
  renderCollectedCards(); // ✅ Show collected cards on page load

  const cards = JSON.parse(localStorage.getItem('earnedStarCards')) || [];
const cleaned = cards.map(name => name.endsWith('.png') ? name : name + '.png');
localStorage.setItem('earnedStarCards', JSON.stringify(cleaned));
});

// 🎉 Popup Logic
function showBadgePopup(name) {
  const popup = document.getElementById("badge-popup");
  if (popup) {
    popup.querySelector("h2").textContent = "🎉 Great Work!";
    popup.querySelector("p").textContent = `You won the "${name}" badge!`;
    popup.classList.remove("hidden");
  }
}

function closeBadgePopup() {
  const popup = document.getElementById("badge-popup");
  if (popup) popup.classList.add("hidden");
}
window.closeBadgePopup = closeBadgePopup;

function normalizeCardName(name) {
  const base = name.trim().split('/').pop().replace('.png', '');
  return `${base}.png`;
}


// 🎯 Unlock card logic
function unlockStarCard(cardName) {
  const earnedStarCards = JSON.parse(localStorage.getItem('earnedStarCards')) || [];
  if (!earnedStarCards.includes(filename)) {
    earnedStarCards.push(filename);
    localStorage.setItem('earnedStarCards', JSON.stringify(earnedStarCards));
    renderCollectedCards(filename);
  }
}

function normalizeCardName(name) {
  return name.trim().split('/').pop().replace('.png', '') + '.png';
}


// 🎴 Modular Gold Star Card renderer
function renderCollectedCards(highlightedCard = null) {
  const collectedStarContainer = document.getElementById("collected-star-cards");
  const collectedCardCount = document.getElementById("collected-card-count");
  const totalCardCount = document.getElementById("total-card-count");

  const totalCards = 26;
  const earnedStarCards = JSON.parse(localStorage.getItem('earnedStarCards')) || [];
  const remaining = totalCards - earnedStarCards.length;

  if (collectedCardCount) {
    collectedCardCount.textContent = `Collected Cards: ${earnedStarCards.length}`;
  }

  if (totalCardCount) {
    totalCardCount.textContent = remaining === 0
      ? `🎉 Collection Complete! All ${totalCards} cards collected!`
      : `Remaining Cards: ${remaining} / ${totalCards}`;
  }

  if (!collectedStarContainer) return;

  collectedStarContainer.innerHTML = earnedStarCards.length === 0
    ? "<p>No Gold Star Cards collected yet. Spin the Reef Wheel to earn some!</p>"
    : earnedStarCards.map(filename => {
        const name = filename.replace('.png', '').replace(/_/g, ' ');
        const isNew = filename === highlightedCard;
        return `
          <div class="card collected ${isNew ? 'new-card' : ''}">
            <div class="card-inner">
              <div class="card-front">
                <img src="/Gold_Star_Cards/${filename}" alt="${name}"
     onerror="if (!this.src.includes('fallback.png')) {
  this.src='/Gold_Star_Cards/fallback.png';
  this.classList.add('broken');
}"
                <div class="card-name">${name}</div>
              </div>
            </div>
          </div>
        `;
        
        
      }).join('');
      const cards = JSON.parse(localStorage.getItem('earnedStarCards')) || [];
const cleaned = cards.map(name => name.endsWith('.png') ? name : name + '.png');
localStorage.setItem('earnedStarCards', JSON.stringify(cleaned));



}


// 🎵 Music Controls

function stopMusicOnly() {
  const bgMusic = document.getElementById('bg-music');
  const toggleBtn = document.getElementById('toggle-music');
  if (bgMusic && !bgMusic.paused) {
    bgMusic.pause();
    if (toggleBtn) toggleBtn.textContent = '🔇 Music On';
    console.log("🎵 Background music stopped");
  }
}
function startMusic() {
  const bgMusic = document.getElementById('bg-music');
  const toggleBtn = document.getElementById('toggle-music');
  if (bgMusic && bgMusic.paused) {
    bgMusic.play().catch(err => console.warn("🎵 Music play failed:", err));
    if (toggleBtn) toggleBtn.textContent = '🔊 Music Off';
    console.log("🎵 Background music started");
  }
}
window.stopMusicOnly = stopMusicOnly;
window.startMusic = startMusic;