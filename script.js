window.onload = function() {
  const characters = [
    'images/cap.png',
    'images/chimp.png',
    'images/duck.png',
    'images/kit.png',
    'images/nanabanana.png',
    'images/tung.png',
    'images/water.png'
  ];

  let currentPair = [];

  // Initialize vote stats if not exist
  if (!localStorage.getItem('votes')) {
    let votes = {};
    characters.forEach((_, idx) => votes[idx] = {wins: 0, losses: 0});
    localStorage.setItem('votes', JSON.stringify(votes));
  }

  function randomPair() {
    let i = Math.floor(Math.random() * characters.length);
    let j;
    do { j = Math.floor(Math.random() * characters.length); } while(j === i);
    currentPair = [i, j];

    document.getElementById('char1').src = characters[i];
    document.getElementById('char2').src = characters[j];

    showResults(i, j);
  }

  function vote(picked) {
    const winner = currentPair[picked];
    const loser = currentPair[1 - picked];

    let votes = JSON.parse(localStorage.getItem('votes'));
    votes[winner].wins += 1;
    votes[loser].losses += 1;
    localStorage.setItem('votes', JSON.stringify(votes));

    // Flash winner
    const winnerImg = document.getElementById(picked === 0 ? 'char1' : 'char2');
    const loserImg = document.getElementById(picked === 0 ? 'char2' : 'char1');

    winnerImg.style.transform = 'scale(1.2)';
    loserImg.style.opacity = 0.5;

    setTimeout(() => {
      winnerImg.style.transform = 'scale(1)';
      loserImg.style.opacity = 1;
      randomPair(); // next matchup after animation
    }, 200);

    showResults(winner, loser);
  }

  function showResults(a, b) {
  let votes = JSON.parse(localStorage.getItem('votes'));
  const totalA = votes[a].wins + votes[a].losses;
  const totalB = votes[b].wins + votes[b].losses;

  const percentA = totalA ? Math.round(votes[a].wins / totalA * 100) : 0;
  const percentB = totalB ? Math.round(votes[b].wins / totalB * 100) : 0;

  // Centered stats with images on top, percentage below
  document.getElementById('results').innerHTML = `
    <div class="result-container">
      <div class="result-char">
        <img src="${characters[a]}" width="80" height="80">
        <div class="percent-text">${percentA}% wins</div>
      </div>
      <div class="result-char">
        <img src="${characters[b]}" width="80" height="80">
        <div class="percent-text">${percentB}% wins</div>
      </div>
    </div>
  `;
}

  // Expose vote globally for buttons
  window.vote = vote;

  // Start first matchup
  randomPair();
};