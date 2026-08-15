/* =====================================================
   tiles.js - Image-based Puzzle Piece Generation
   Each picture is split into 4 quadrants (2×2)
   Uses picsum.photos for real stock photographs
   ===================================================== */

/**
 * Seeded PRNG (Park-Miller LCG).
 */
function seededRandom(seed) {
  let s = Math.abs(seed) || 1;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Fisher-Yates shuffle.
 */
function shuffleArray(arr, rng) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Get the image URL for a specific picture in a stage.
 * picsum.photos provides consistent images per seed.
 */
function getImageUrl(stageNum, pictureIndex) {
  const seed = `puzzle-s${stageNum}-p${pictureIndex}`;
  return `https://picsum.photos/seed/${seed}/200/200`;
}

/**
 * Get CSS background-position for a quadrant.
 */
function getQuadrantPosition(quadrant) {
  switch (quadrant) {
    case 'tl': return '0% 0%';
    case 'tr': return '100% 0%';
    case 'bl': return '0% 100%';
    case 'br': return '100% 100%';
    default:   return '50% 50%';
  }
}

/**
 * Generate fallback color for a picture (used if image fails to load).
 */
function getPictureFallbackColor(pictureId) {
  const hue = (pictureId * 47 + 30) % 360;
  return `hsl(${hue}, 55%, 65%)`;
}

/**
 * Generate the puzzle grid data for a stage.
 * Returns an array of piece objects.
 */
function generateGrid(stageNum) {
  const stage = STAGES[stageNum - 1];
  const gs = stage.gridSize;
  const totalCells = gs * gs;
  const hasBonus = totalCells % 4 !== 0;
  const numPictures = Math.floor(totalCells / 4);

  const QUADRANTS = ['tl', 'tr', 'bl', 'br'];
  const pieces = [];

  // Create 4 quadrant pieces for each picture
  for (let p = 0; p < numPictures; p++) {
    const url = getImageUrl(stageNum, p);
    const fallbackColor = getPictureFallbackColor(p);

    QUADRANTS.forEach((q) => {
      pieces.push({
        pictureId: p,
        quadrant: q,
        imageUrl: url,
        bgPosition: getQuadrantPosition(q),
        fallbackColor: fallbackColor,
        matched: false,
        isBonus: false,
      });
    });
  }

  // Add a bonus cell for odd grids (5×5, 7×7)
  if (hasBonus) {
    pieces.push({
      pictureId: -1,
      quadrant: 'bonus',
      imageUrl: '',
      bgPosition: '50% 50%',
      fallbackColor: '#FFD54F',
      matched: true,  // Pre-cleared
      isBonus: true,
    });
  }

  // Shuffle until no 2×2 group is already completed
  let shuffled;
  let attempt = 0;
  do {
    shuffled = shuffleArray(pieces, seededRandom(stageNum * 7919 + 42 + attempt));
    attempt++;
  } while (!isValidShuffle(shuffled, gs) && attempt < 200);

  return shuffled;
}

/**
 * Check that no 2×2 group is already completed after shuffle.
 */
function isValidShuffle(grid, gridSize) {
  for (let r = 0; r < gridSize - 1; r++) {
    for (let c = 0; c < gridSize - 1; c++) {
      const tl = grid[r * gridSize + c];
      const tr = grid[r * gridSize + c + 1];
      const bl = grid[(r + 1) * gridSize + c];
      const br = grid[(r + 1) * gridSize + c + 1];

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
        return false; // A group is already complete
      }
    }
  }
  return true;
}

/**
 * Get unique image URLs needed for a stage (for preloading).
 */
function getStageImageUrls(stageNum) {
  const stage = STAGES[stageNum - 1];
  const totalCells = stage.gridSize * stage.gridSize;
  const numPictures = Math.floor(totalCells / 4);
  const urls = [];
  for (let p = 0; p < numPictures; p++) {
    urls.push(getImageUrl(stageNum, p));
  }
  return urls;
}

/**
 * Preload images with progress callback.
 * Resolves when all loaded (or after timeout).
 */
function preloadImages(urls, onProgress) {
  let loaded = 0;

  return new Promise((resolve) => {
    if (urls.length === 0) return resolve();

    // Safety timeout: resolve after 20s regardless
    const timer = setTimeout(() => resolve(), 20000);

    urls.forEach((url) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = img.onerror = () => {
        loaded++;
        if (onProgress) onProgress(loaded / urls.length);
        if (loaded >= urls.length) {
          clearTimeout(timer);
          resolve();
        }
      };
      img.src = url;
    });
  });
}
