/* =====================================================
   storage.js - LocalStorage Progress Manager
   ===================================================== */

const STORAGE_KEY = 'puzzle_match_save';

const Storage = {
  /** Default save data structure */
  _defaults() {
    return {
      clearedStages: [],
      bestTimes: {},
      bestMoves: {},
      settings: {
        bgm: true,
        sfx: true,
        vibration: true,
      },
    };
  },

  /** Load save data (or defaults if none found) */
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Merge with defaults to handle added fields
        return { ...this._defaults(), ...parsed };
      }
    } catch (e) {
      console.warn('[Storage] load failed:', e);
    }
    return this._defaults();
  },

  /** Persist save data */
  save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('[Storage] save failed:', e);
    }
  },

  /**
   * Record a stage clear.
   * @param {number} stageNum
   * @param {number} time      Seconds elapsed
   * @param {number} moves     Number of attempts
   * @returns {object}         Updated save data
   */
  clearStage(stageNum, time, moves) {
    const data = this.load();

    if (!data.clearedStages.includes(stageNum)) {
      data.clearedStages.push(stageNum);
    }

    // Track best time
    if (!data.bestTimes[stageNum] || time < data.bestTimes[stageNum]) {
      data.bestTimes[stageNum] = time;
    }

    // Track best moves
    if (!data.bestMoves[stageNum] || moves < data.bestMoves[stageNum]) {
      data.bestMoves[stageNum] = moves;
    }

    this.save(data);
    return data;
  },

  /** Check if a stage is unlocked (stage 1 always unlocked) */
  isStageUnlocked(stageNum) {
    if (stageNum === 1) return true;
    const data = this.load();
    return data.clearedStages.includes(stageNum - 1);
  },

  /** Check if a stage has been cleared */
  isStageCleared(stageNum) {
    const data = this.load();
    return data.clearedStages.includes(stageNum);
  },

  /** Get settings object */
  getSettings() {
    return this.load().settings;
  },

  /** Save a single setting */
  saveSetting(key, value) {
    const data = this.load();
    data.settings[key] = value;
    this.save(data);
  },
};
