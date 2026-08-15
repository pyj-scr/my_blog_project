/* =====================================================
   game.js - Core Game Engine (Swap + Drag Puzzle)
   Pieces can be dragged or tapped to swap.
   Matched (red) cells CAN be swapped to prevent blocking.
   ===================================================== */

const DIFFICULTY_CONFIG = [
  { name: '쉬움',        gridSize: 4, icon: '🟢', count: 10 },
  { name: '보통',        gridSize: 5, icon: '🔵', count: 10 },
  { name: '어려움',      gridSize: 6, icon: '🟡', count: 10 },
  { name: '매우 어려움', gridSize: 7, icon: '🟠', count: 10 },
  { name: '극한',        gridSize: 8, icon: '🔴', count: 10 },
];

const STAGES = [];
(function buildStages() {
  let id = 1;
  DIFFICULTY_CONFIG.forEach((cfg) => {
    for (let i = 0; i < cfg.count; i++) {
      STAGES.push({ id: id++, name: cfg.name, gridSize: cfg.gridSize, icon: cfg.icon });
    }
  });
})();

class Game {
  constructor() {
    this.currentStage = null;
    this.grid = [];
    this.gridSize = 0;
    this.selectedIndex = -1;
    this.matchedCount = 0;
    this.totalPictures = 0;
    this.moves = 0;
    this.timer = 0;
    this.timerInterval = null;

    this.onTimerUpdate = null;
    this.onMovesUpdate = null;
    this.onProgressUpdate = null;
    this.onPiecesCompleted = null;
    this.onStageComplete = null;
  }

  startStage(stageNum) {
    this.currentStage = STAGES[stageNum - 1];
    this.gridSize = this.currentStage.gridSize;
    this.grid = generateGrid(stageNum);
    this.selectedIndex = -1;
    this.matchedCount = 0;
    this.moves = 0;
    this.timer = 0;
    this.totalPictures = Math.floor((this.gridSize * this.gridSize) / 4);
    this._startTimer();
    return this.grid;
  }

  _startTimer() {
    this._stopTimer();
    this.timerInterval = setInterval(() => {
      this.timer++;
      if (this.onTimerUpdate) this.onTimerUpdate(this.timer);
    }, 1000);
  }

  _stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  /* ---- Tap-to-swap (select → select → swap) ---- */
  selectPiece(index) {
    const piece = this.grid[index];
    if (!piece || piece.isBonus) return null;

    // First selection: must be an unmatched piece
    if (this.selectedIndex === -1) {
      if (piece.matched) return null; // Can't pick red tiles by tapping
      this.selectedIndex = index;
      audio.playSelect();
      audio.vibrate([15]);
      return { type: 'select', index };
    }

    // Same piece → deselect
    if (this.selectedIndex === index) {
      this.selectedIndex = -1;
      audio.playDeselect();
      return { type: 'deselect', index };
    }

    // Second tap → swap (target CAN be a matched/red cell)
    const fromIndex = this.selectedIndex;
    this.selectedIndex = -1;
    return this.swapPieces(fromIndex, index);
  }

  /**
   * Direct swap between any two cells.
   * Both matched and unmatched cells can participate.
   * Only bonus cells are excluded.
   */
  swapPieces(fromIndex, toIndex) {
    if (fromIndex === toIndex) return null;

    const from = this.grid[fromIndex];
    const to = this.grid[toIndex];
    if (!from || !to) return null;
    if (from.isBonus || to.isBonus) return null;

    // Swap data
    this.grid[fromIndex] = to;
    this.grid[toIndex] = from;

    this.moves++;
    if (this.onMovesUpdate) this.onMovesUpdate(this.moves);

    audio.playClick();
    audio.vibrate([20]);

    // Check for completed 2×2 pictures
    const completed = this._scanCompletions();

    return { type: 'swap', fromIndex, toIndex, completed };
  }

  _scanCompletions() {
    const gs = this.gridSize;
    const completed = [];

    for (let r = 0; r < gs - 1; r++) {
      for (let c = 0; c < gs - 1; c++) {
        const tlI = r * gs + c;
        const trI = r * gs + c + 1;
        const blI = (r + 1) * gs + c;
        const brI = (r + 1) * gs + c + 1;

        const tl = this.grid[tlI];
        const tr = this.grid[trI];
        const bl = this.grid[blI];
        const br = this.grid[brI];

        if (tl.matched || tr.matched || bl.matched || br.matched) continue;

        if (
          tl.pictureId === tr.pictureId &&
          tl.pictureId === bl.pictureId &&
          tl.pictureId === br.pictureId &&
          tl.quadrant === 'tl' &&
          tr.quadrant === 'tr' &&
          bl.quadrant === 'bl' &&
          br.quadrant === 'br'
        ) {
          tl.matched = true;
          tr.matched = true;
          bl.matched = true;
          br.matched = true;
          this.matchedCount++;

          completed.push({
            pictureId: tl.pictureId,
            indices: [tlI, trI, blI, brI],
          });
        }
      }
    }

    if (completed.length > 0) {
      audio.playMatch();
      audio.vibrate([40, 20, 40]);

      if (this.onProgressUpdate) {
        this.onProgressUpdate(this.matchedCount, this.totalPictures);
      }
      if (this.onPiecesCompleted) {
        this.onPiecesCompleted(completed);
      }

      if (this.matchedCount >= this.totalPictures) {
        this._stopTimer();
        const stars = this._calcStars();
        Storage.clearStage(this.currentStage.id, this.timer, this.moves);
        setTimeout(() => {
          audio.playStageClear();
          if (this.onStageComplete) {
            this.onStageComplete({
              stageNum: this.currentStage.id,
              time: this.timer,
              moves: this.moves,
              stars,
            });
          }
        }, 700);
      }
    }

    return completed;
  }

  _calcStars() {
    const minSwaps = this.totalPictures * 3;
    const ratio = this.moves / Math.max(1, minSwaps);
    if (ratio <= 1.5) return 3;
    if (ratio <= 3.0) return 2;
    return 1;
  }

  clearSelection() {
    this.selectedIndex = -1;
  }

  destroy() {
    this._stopTimer();
    this.grid = [];
    this.selectedIndex = -1;
  }
}
