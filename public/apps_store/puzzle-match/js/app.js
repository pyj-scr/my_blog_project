/* =====================================================
   app.js - Application Controller
   Supports DRAG-AND-DROP + tap-to-swap interaction
   ===================================================== */

/* ---- Confetti ---- */
class Confetti {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.animId = null;
  }
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  launch() {
    this.resize();
    this.particles = [];
    const colors = ['#FF6B6B','#FFD93D','#6BCB77','#4D96FF','#FF6B9D','#C084FC','#FFB74D'];
    const cx = this.canvas.width / 2;
    for (let i = 0; i < 120; i++) {
      this.particles.push({
        x: cx + (Math.random() - 0.5) * 220,
        y: this.canvas.height * 0.45,
        vx: (Math.random() - 0.5) * 12,
        vy: -(Math.random() * 16 + 8),
        size: Math.random() * 8 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        gravity: 0.35,
        opacity: 1,
      });
    }
    this._animate();
  }
  _animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    let alive = false;
    this.particles.forEach((p) => {
      if (p.opacity <= 0) return;
      alive = true;
      p.vy += p.gravity; p.x += p.vx; p.y += p.vy;
      p.rotation += p.rotSpeed; p.opacity -= 0.009;
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = Math.max(0, p.opacity);
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size * 0.6);
      this.ctx.restore();
    });
    if (alive) this.animId = requestAnimationFrame(() => this._animate());
    else this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  stop() {
    if (this.animId) cancelAnimationFrame(this.animId);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

/* ===========================================================
   Main App
   =========================================================== */
class App {
  constructor() {
    this.game = new Game();
    this.confetti = new Confetti(document.getElementById('confetti-canvas'));
    this.currentScreen = 'home';

    // Drag state
    this._drag = null;          // { index, startX, startY, isDragging, clone }
    this._dropTargetIdx = -1;
    this._boundHandlers = null; // For cleanup

    this._init();
  }

  _init() {
    const settings = Storage.getSettings();
    audio.bgmEnabled = settings.bgm;
    audio.sfxEnabled = settings.sfx;
    audio.vibrationEnabled = settings.vibration;
    this._buildHomeScreen();
    this._bindGlobalEvents();
    this._updateSettingsUI();
  }

  /* ==========================================================
     HOME SCREEN
     ========================================================== */
  _buildHomeScreen() {
    const list = document.getElementById('stage-list');
    list.innerHTML = '';
    DIFFICULTY_CONFIG.forEach((cfg, dIdx) => {
      const section = document.createElement('div');
      section.className = 'difficulty-section';
      section.innerHTML = `
        <div class="difficulty-header">
          <span class="difficulty-icon">${cfg.icon}</span>
          <span class="difficulty-name">${cfg.name}</span>
          <span class="difficulty-grid-label">${cfg.gridSize}×${cfg.gridSize}</span>
        </div><div class="stage-grid"></div>`;
      const grid = section.querySelector('.stage-grid');
      for (let i = 0; i < cfg.count; i++) {
        const sn = dIdx * 10 + i + 1;
        const btn = document.createElement('button');
        btn.className = 'stage-btn';
        btn.dataset.stage = sn;
        const cleared = Storage.isStageCleared(sn);
        const unlocked = Storage.isStageUnlocked(sn);
        if (cleared) {
          btn.classList.add('cleared');
          btn.innerHTML = `<span class="stage-num">${sn}</span><span class="stage-star">⭐</span>`;
        } else if (unlocked) {
          btn.classList.add('unlocked');
          btn.innerHTML = `<span class="stage-num">${sn}</span>`;
        } else {
          btn.classList.add('locked');
          btn.innerHTML = `<span class="stage-num">${sn}</span><span class="stage-lock">🔒</span>`;
        }
        grid.appendChild(btn);
      }
      list.appendChild(section);
    });
  }

  /* ==========================================================
     GLOBAL EVENT BINDING (settings, modals, nav)
     ========================================================== */
  _bindGlobalEvents() {
    document.getElementById('stage-list').addEventListener('click', (e) => {
      const btn = e.target.closest('.stage-btn');
      if (!btn || btn.classList.contains('locked')) return;
      audio.init(); audio.playClick();
      this._startGame(parseInt(btn.dataset.stage, 10));
    });

    document.getElementById('btn-settings-home').addEventListener('click', () => {
      audio.init(); audio.playClick(); this._showModal('modal-settings');
    });
    document.getElementById('btn-settings-game').addEventListener('click', () => {
      audio.playClick(); this._showModal('modal-settings');
    });
    document.getElementById('btn-close-settings').addEventListener('click', () => {
      audio.playClick(); this._hideModal('modal-settings');
    });

    document.getElementById('toggle-bgm').addEventListener('click', () => {
      audio.init(); audio.bgmEnabled = !audio.bgmEnabled;
      Storage.saveSetting('bgm', audio.bgmEnabled);
      this._updateSettingsUI(); audio.playClick();
    });
    document.getElementById('toggle-sfx').addEventListener('click', () => {
      audio.init(); audio.sfxEnabled = !audio.sfxEnabled;
      Storage.saveSetting('sfx', audio.sfxEnabled);
      this._updateSettingsUI(); if (audio.sfxEnabled) audio.playClick();
    });
    document.getElementById('toggle-vibration').addEventListener('click', () => {
      audio.init(); audio.vibrationEnabled = !audio.vibrationEnabled;
      Storage.saveSetting('vibration', audio.vibrationEnabled);
      this._updateSettingsUI(); audio.playClick();
      if (audio.vibrationEnabled) audio.vibrate([50]);
    });

    document.getElementById('btn-go-home').addEventListener('click', () => {
      audio.playClick(); this._hideModal('modal-settings'); this._goHome();
    });
    document.getElementById('btn-next-stage').addEventListener('click', () => {
      audio.playClick(); this.confetti.stop(); this._hideModal('modal-clear');
      const next = this.game.currentStage.id + 1;
      if (next <= 50) this._startGame(next); else this._goHome();
    });
    document.getElementById('btn-back-home').addEventListener('click', () => {
      audio.playClick(); this.confetti.stop(); this._hideModal('modal-clear');
      this._goHome();
    });
    document.querySelectorAll('.modal-overlay').forEach((o) => {
      o.addEventListener('click', (e) => {
        if (e.target === o) { audio.playClick(); this._hideModal(o.id); }
      });
    });
  }

  /* ==========================================================
     GAME START
     ========================================================== */
  _startGame(stageNum) {
    const stage = STAGES[stageNum - 1];
    this._showLoading();

    const urls = getStageImageUrls(stageNum);
    preloadImages(urls, (p) => {
      document.getElementById('loading-bar').style.width = `${p * 100}%`;
    }).then(() => {
      this._hideLoading();

      document.getElementById('game-difficulty').textContent = stage.name;
      document.getElementById('game-stage-num').textContent = stageNum;
      document.getElementById('game-timer').textContent = '0:00';
      document.getElementById('game-moves').textContent = '0';

      const grid = this.game.startStage(stageNum);
      const board = document.getElementById('game-board');
      board.className = `game-board grid-${stage.gridSize}`;
      board.innerHTML = '';

      grid.forEach((piece, idx) => {
        const el = document.createElement('div');
        el.className = 'piece';
        el.dataset.index = idx;
        this._applyPieceVisual(el, piece);
        board.appendChild(el);
      });

      // Callbacks
      this.game.onTimerUpdate = (t) => {
        const m = Math.floor(t / 60);
        const s = t % 60;
        document.getElementById('game-timer').textContent = `${m}:${s.toString().padStart(2, '0')}`;
      };
      this.game.onMovesUpdate = (moves) => {
        document.getElementById('game-moves').textContent = moves;
      };
      this.game.onProgressUpdate = (matched, total) => {
        const pct = (matched / total) * 100;
        document.getElementById('progress-bar').style.width = `${pct}%`;
        document.getElementById('progress-text').textContent = `${matched}/${total}`;
      };
      this.game.onPiecesCompleted = (completed) => {
        this._animateCompletions(completed);
      };
      this.game.onStageComplete = (result) => {
        this._showStageClear(result);
      };

      document.getElementById('progress-bar').style.width = '0%';
      document.getElementById('progress-text').textContent = `0/${this.game.totalPictures}`;

      // Setup drag & tap interaction
      this._setupInteraction();
      this._showScreen('game');
    });
  }

  /* ==========================================================
     DRAG & DROP + TAP INTERACTION
     ========================================================== */
  _setupInteraction() {
    // Remove previous listeners if any
    this._removeInteraction();

    const board = document.getElementById('game-board');
    const THRESHOLD = 10; // px to distinguish tap from drag

    const getPos = (e) => {
      if (e.touches && e.touches.length > 0)
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      if (e.changedTouches && e.changedTouches.length > 0)
        return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
      return { x: e.clientX, y: e.clientY };
    };

    const getCellAt = (x, y) => {
      const r = board.getBoundingClientRect();
      const gs = this.game.gridSize;
      if (x < r.left || x > r.right || y < r.top || y > r.bottom) return -1;
      const col = Math.floor((x - r.left) / (r.width / gs));
      const row = Math.floor((y - r.top) / (r.height / gs));
      if (col < 0 || col >= gs || row < 0 || row >= gs) return -1;
      return row * gs + col;
    };

    /* --- Start --- */
    const onStart = (e) => {
      const pieceEl = e.target.closest('.piece');
      if (!pieceEl) return;
      const idx = parseInt(pieceEl.dataset.index);
      const piece = this.game.grid[idx];
      if (piece.isBonus) return;

      // Allow dragging matched pieces too (to move red tiles)
      e.preventDefault();

      const pos = getPos(e);
      this._drag = {
        index: idx,
        startX: pos.x,
        startY: pos.y,
        isDragging: false,
        clone: null,
      };
    };

    /* --- Move --- */
    const onMove = (e) => {
      if (!this._drag) return;
      e.preventDefault();

      const pos = getPos(e);
      const dx = pos.x - this._drag.startX;
      const dy = pos.y - this._drag.startY;

      // Start drag if moved enough
      if (!this._drag.isDragging && Math.sqrt(dx * dx + dy * dy) > THRESHOLD) {
        this._drag.isDragging = true;
        this._beginDrag(this._drag.index, pos.x, pos.y);
      }

      if (this._drag.isDragging) {
        this._moveDragClone(pos.x, pos.y);
        this._updateDropTarget(getCellAt(pos.x, pos.y));
      }
    };

    /* --- End --- */
    const onEnd = (e) => {
      if (!this._drag) return;

      const pos = getPos(e);

      if (this._drag.isDragging) {
        // Drag ended → swap with drop target
        this._endDrag(getCellAt(pos.x, pos.y));
      } else {
        // Short tap → tap-to-swap
        this._handleTap(this._drag.index);
      }

      this._drag = null;
    };

    // Bind events
    board.addEventListener('mousedown', onStart);
    board.addEventListener('touchstart', onStart, { passive: false });
    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchend', onEnd);

    // Store for cleanup
    this._boundHandlers = { board, onStart, onMove, onEnd };
  }

  _removeInteraction() {
    if (!this._boundHandlers) return;
    const { board, onStart, onMove, onEnd } = this._boundHandlers;
    board.removeEventListener('mousedown', onStart);
    board.removeEventListener('touchstart', onStart);
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('mouseup', onEnd);
    document.removeEventListener('touchend', onEnd);
    this._boundHandlers = null;
  }

  /* ---- Drag helpers ---- */
  _beginDrag(index, x, y) {
    const board = document.getElementById('game-board');
    const el = board.children[index];
    const rect = el.getBoundingClientRect();

    // Deselect any tap-selected piece
    if (this.game.selectedIndex !== -1) {
      board.children[this.game.selectedIndex].classList.remove('selected');
      this.game.clearSelection();
    }

    // Create floating clone
    const clone = document.createElement('div');
    clone.className = 'drag-clone';

    // Copy visual from original piece
    const piece = this.game.grid[index];
    if (piece.matched) {
      clone.classList.add('matched');
    } else {
      clone.style.backgroundImage = el.style.backgroundImage;
      clone.style.backgroundSize = el.style.backgroundSize;
      clone.style.backgroundPosition = el.style.backgroundPosition;
      clone.style.backgroundColor = el.style.backgroundColor;
    }

    clone.style.width = rect.width + 'px';
    clone.style.height = rect.height + 'px';
    clone.style.left = (x - rect.width / 2) + 'px';
    clone.style.top = (y - rect.height / 2) + 'px';
    document.body.appendChild(clone);
    this._drag.clone = clone;

    // Dim original
    el.classList.add('dragging');

    audio.playSelect();
    audio.vibrate([25]);
  }

  _moveDragClone(x, y) {
    const clone = this._drag && this._drag.clone;
    if (!clone) return;
    const w = parseFloat(clone.style.width);
    const h = parseFloat(clone.style.height);
    clone.style.left = (x - w / 2) + 'px';
    clone.style.top = (y - h / 2) + 'px';
  }

  _updateDropTarget(cellIndex) {
    const board = document.getElementById('game-board');

    // Clear old highlight
    if (this._dropTargetIdx >= 0 && this._dropTargetIdx < board.children.length) {
      board.children[this._dropTargetIdx].classList.remove('drop-target');
    }
    this._dropTargetIdx = cellIndex;

    // Set new highlight
    if (cellIndex >= 0 && cellIndex < board.children.length &&
        cellIndex !== this._drag.index &&
        !this.game.grid[cellIndex].isBonus) {
      board.children[cellIndex].classList.add('drop-target');
    }
  }

  _endDrag(targetIndex) {
    const board = document.getElementById('game-board');

    // Clean up visuals
    board.children[this._drag.index].classList.remove('dragging');
    if (this._drag.clone) {
      this._drag.clone.remove();
      this._drag.clone = null;
    }
    if (this._dropTargetIdx >= 0 && this._dropTargetIdx < board.children.length) {
      board.children[this._dropTargetIdx].classList.remove('drop-target');
    }
    this._dropTargetIdx = -1;

    // Perform swap
    if (targetIndex >= 0 && targetIndex !== this._drag.index) {
      const result = this.game.swapPieces(this._drag.index, targetIndex);
      if (result) {
        this._refreshPieceVisual(result.fromIndex);
        this._refreshPieceVisual(result.toIndex);

        // Swap animation
        board.children[result.fromIndex].classList.add('swapping');
        board.children[result.toIndex].classList.add('swapping');
        setTimeout(() => {
          board.children[result.fromIndex].classList.remove('swapping');
          board.children[result.toIndex].classList.remove('swapping');
        }, 300);
      }
    }
  }

  /* ---- Tap-to-swap handler ---- */
  _handleTap(index) {
    const result = this.game.selectPiece(index);
    if (!result) return;

    const board = document.getElementById('game-board');

    switch (result.type) {
      case 'select':
        board.children[index].classList.add('selected');
        break;

      case 'deselect':
        board.children[index].classList.remove('selected');
        break;

      case 'swap':
        board.children[result.fromIndex].classList.remove('selected');
        this._refreshPieceVisual(result.fromIndex);
        this._refreshPieceVisual(result.toIndex);

        board.children[result.fromIndex].classList.add('swapping');
        board.children[result.toIndex].classList.add('swapping');
        setTimeout(() => {
          board.children[result.fromIndex].classList.remove('swapping');
          board.children[result.toIndex].classList.remove('swapping');
        }, 300);
        break;
    }
  }

  /* ==========================================================
     PIECE VISUAL HELPERS
     ========================================================== */
  _applyPieceVisual(el, piece) {
    el.classList.remove('matched', 'bonus-cell', 'selected', 'dragging');
    el.style.backgroundImage = '';
    el.style.backgroundSize = '';
    el.style.backgroundPosition = '';
    el.style.backgroundColor = '';

    if (piece.isBonus) {
      el.classList.add('bonus-cell');
    } else if (piece.matched) {
      el.classList.add('matched');
    } else {
      el.style.backgroundImage = `url(${piece.imageUrl})`;
      el.style.backgroundSize = '200% 200%';
      el.style.backgroundPosition = piece.bgPosition;
      el.style.backgroundColor = piece.fallbackColor;
    }
  }

  _refreshPieceVisual(index) {
    const board = document.getElementById('game-board');
    const el = board.children[index];
    const piece = this.game.grid[index];
    this._applyPieceVisual(el, piece);
  }

  /* ---- Completion animation ---- */
  _animateCompletions(completed) {
    const board = document.getElementById('game-board');
    completed.forEach((comp) => {
      comp.indices.forEach((idx, i) => {
        const el = board.children[idx];
        setTimeout(() => el.classList.add('completing'), i * 60);
        setTimeout(() => {
          el.classList.remove('completing');
          this._refreshPieceVisual(idx);
        }, 500 + i * 60);
      });
    });
  }

  /* ---- Stage clear ---- */
  _showStageClear(result) {
    const m = Math.floor(result.time / 60);
    const s = result.time % 60;
    document.getElementById('clear-time').textContent = `${m}:${s.toString().padStart(2, '0')}`;
    document.getElementById('clear-moves').textContent = result.moves;
    document.getElementById('clear-stars').textContent =
      '⭐'.repeat(result.stars) + '☆'.repeat(3 - result.stars);
    document.getElementById('btn-next-stage').style.display =
      result.stageNum < 50 ? 'block' : 'none';
    this.confetti.launch();
    this._showModal('modal-clear');
  }

  /* ==========================================================
     NAVIGATION
     ========================================================== */
  _goHome() {
    this._removeInteraction();
    this.game.destroy();
    this._buildHomeScreen();
    this._showScreen('home');
  }

  _showScreen(name) {
    document.querySelectorAll('.screen').forEach((s) => s.classList.remove('active'));
    document.getElementById(`screen-${name}`).classList.add('active');
    this.currentScreen = name;
  }

  _showModal(id) { document.getElementById(id).classList.add('active'); }
  _hideModal(id) { document.getElementById(id).classList.remove('active'); }
  _showLoading() {
    document.getElementById('loading-bar').style.width = '0%';
    document.getElementById('loading-overlay').classList.add('active');
  }
  _hideLoading() { document.getElementById('loading-overlay').classList.remove('active'); }

  _updateSettingsUI() {
    const bgm = document.getElementById('toggle-bgm');
    const sfx = document.getElementById('toggle-sfx');
    const vib = document.getElementById('toggle-vibration');
    bgm.classList.toggle('active', audio.bgmEnabled);
    sfx.classList.toggle('active', audio.sfxEnabled);
    vib.classList.toggle('active', audio.vibrationEnabled);
    bgm.querySelector('.toggle-icon').textContent = audio.bgmEnabled ? '🎵' : '🔇';
    sfx.querySelector('.toggle-icon').textContent = audio.sfxEnabled ? '🔊' : '🔇';
    vib.querySelector('.toggle-icon').textContent = audio.vibrationEnabled ? '📳' : '📴';
  }
}

/* ---- Bootstrap ---- */
document.addEventListener('DOMContentLoaded', () => { window.app = new App(); });
