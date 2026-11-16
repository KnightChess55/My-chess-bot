
const Remember = (() => {
  const KEY = "sachess_active_game";

  function save(game) {
    localStorage.setItem(KEY, JSON.stringify({
      fen: game.fen(),
      pgn: game.pgn(),
      history: game.history(),
      savedAt: Date.now(),
      interrupted: false
    }));
  }

  function interrupt() {
    const data = JSON.parse(localStorage.getItem(KEY) || "null");

    if (data && data.history.length > 0) {
      data.interrupted = true;
      localStorage.setItem(KEY, JSON.stringify(data));
    }
  }

  function returning() {
    try {
      const data = JSON.parse(localStorage.getItem(KEY) || "null");
      if (!data || !data.interrupted) return null;
      return data;
    } catch {
      return null;
    }
  }

  function forgetActive() {
    localStorage.removeItem(KEY);
  }


function dialogue() {
  const data = returning();

  if (!data) return null;

  const interruptedFor = Date.now() - data.savedAt;
  const minutes = Math.floor(interruptedFor / 60000);

  let message;

  if (minutes < 2) {
    message = "Hey, it's you again. I remember that you tried to run away, huh? 😏";
  } else if (minutes < 60) {
    message = "Back already? I haven't forgotten our unfinished game.";
  } else {
    message = "You came back. I was wondering when you'd return.";
  }

  return {
    message,
    previousMoves: data.history.length,
    savedPosition: data.fen,
    interruptedAt: data.savedAt
  };
}

return {
  save,
  interrupt,
  returning,
  forgetActive,
  dialogue
};
})();

