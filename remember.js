
const Remember = (() => {
  const KEY = "sachess_active_game";

  function read() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "null");
    } catch {
      return null;
    }
  }

  // Save the current game and any extra learning data.
  function save(game, extra = {}) {
    try {
      localStorage.setItem(KEY, JSON.stringify({
        fen: game.fen(),
        pgn: game.pgn(),
        history: game.history(),
        savedAt: Date.now(),
        interrupted: false,
        completed: false,
        extra
      }));
    } catch (err) {
      console.warn("Could not save chess game:", err);
    }
  }

  // Called when the player leaves an unfinished game.
  function interrupt() {
    const data = read();

    if (data && data.history && data.history.length > 0 && !data.completed) {
      data.interrupted = true;
      data.interruptedAt = Date.now();

      try {
        localStorage.setItem(KEY, JSON.stringify(data));
      } catch (err) {
        console.warn("Could not record interruption:", err);
      }
    }
  }

  // Retrieve any saved game.
  function active() {
    return read();
  }

  // Retrieve only an interrupted game.
  function returning() {
    const data = read();

    if (!data || !data.interrupted) return null;

    return data;
  }

  // Mark a game as resumed.
  function markResumed() {
    const data = read();
    if (!data) return;

    data.interrupted = false;
    data.savedAt = Date.now();

    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (err) {
      console.warn("Could not update saved game:", err);
    }
  }

  // Remove the active game.
  function forgetActive() {
    localStorage.removeItem(KEY);
  }

  // Record that a game has finished.
  function complete() {
    forgetActive();
  }

  // Give the returning player a personalised greeting.
  function dialogue() {
    const data = returning();

    if (!data) return null;

    const elapsed = Date.now() - (data.interruptedAt || data.savedAt);
    const minutes = Math.floor(elapsed / 60000);

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
      interruptedAt: data.interruptedAt || data.savedAt,
      pgn: data.pgn,
      extra: data.extra || {}
    };
  }

  return {
    save,
    interrupt,
    active,
    returning,
    markResumed,
    forgetActive,
    complete,
    dialogue
  };
})();
