
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

  return { save, interrupt, returning, forgetActive };
})();
