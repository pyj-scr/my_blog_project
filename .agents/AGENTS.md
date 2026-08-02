# ReRoomAI / 100-Yen App Shop Project Directives & Guidelines

This document defines the core architecture rules and operational guidelines for the **100-Yen App Shop (アプリ 100円ショップ / 어플 100엔 샵)** project. All future code additions, modifications, and AI agent operations MUST strictly abide by these principles.

---

## 🌐 1. Universal Real-Time Multi-Language Engine Policy (KO / JA / EN)

1. **100% Coverage Rule**:
   - Every single app item (title, short description, full description, usage guide, key features) MUST possess complete 3-language representations (`Ko`, `Ja`, `En`).
   - Korean remnants or untranslated fallback text in Japanese/English UI modes are STRICTLY FORBIDDEN.

2. **Natural Language Standard (Japanese Optimization)**:
   - Prayer / Goal terms MUST use natural native Japanese expressions: **`お祈り`** (never awkward literal translations like `祈禱`).
   - Mobile execution features MUST default to clean localized phrasing: **`モバイル＆スマホアプリ ワンタッチ即時起動`**.

3. **User Manual Override Priority**:
   - When a user explicitly provides custom multi-language titles (`titleJa`, `titleEn`, `titleKo`), the system MUST treat these manual inputs as top priority (`Persist User Override`) and NEVER overwrite them with machine translations.

---

## ⚡ 2. Global Server Data Synchronization (Worldwide Real-Time Availability)

1. **Central Server API Requirement**:
   - Local browser state (`localStorage`) MUST NEVER be used as the single source of truth.
   - All app creations, updates, and deletions MUST route through the central server API endpoint (`/api/apps`).

2. **Cross-Browser & Visitor Consistency**:
   - Any app registered by any user in any browser (Chrome, Edge, Safari, Mobile, Whale) MUST instantly persist to the global server data store (`/api/apps`).
   - Every visitor worldwide MUST view 100% identical real-time catalog data.

---

## 🖼️ 3. App Thumbnail Image & UI Layout Standard

1. **Zero-Cropping Ratio Standard (`object-contain`)**:
   - App cover thumbnails MUST rendered with `object-contain` to preserve full aspect ratios without cropping or magnifying image centers.

2. **Automatic High-Quality Category Fallback**:
   - If a creator does not upload a custom image, the system MUST automatically assign an optimized high-quality category default thumbnail (`DEFAULT_CATEGORY_IMAGES`).

---

## 🔒 4. Continuous Verification Protocol

1. **Build Sanity Check**:
   - Before completing any task, execute `npm run build` to verify zero TypeScript errors and static generation integrity.
2. **Git Auto-Publish**:
   - Every verified change MUST be committed and pushed to `main` for instant Vercel production release.
