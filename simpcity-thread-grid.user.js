// ==UserScript==
// @name         SimpCity Thread Grid
// @namespace    https://github.com/vylix-dev/simpcity-thread-grid
// @version      9.1.6
// @description  Responsive card grid for SimpCity thread lists and sidebar latest posts, with a polished settings UI.
// @author       vylix-dev
// @license      MIT
// @icon         https://raw.githubusercontent.com/vylix-dev/simpcity-thread-grid/main/vylix-logo-64.png
// @iconURL      https://raw.githubusercontent.com/vylix-dev/simpcity-thread-grid/main/vylix-logo-64.png
// @icon64       https://raw.githubusercontent.com/vylix-dev/simpcity-thread-grid/main/vylix-logo-128.png
// @icon64URL    https://raw.githubusercontent.com/vylix-dev/simpcity-thread-grid/main/vylix-logo-128.png
// @homepageURL  https://github.com/vylix-dev/simpcity-thread-grid
// @supportURL   https://github.com/vylix-dev/simpcity-thread-grid/issues
// @updateURL    https://raw.githubusercontent.com/vylix-dev/simpcity-thread-grid/main/simpcity-thread-grid.meta.js
// @downloadURL  https://raw.githubusercontent.com/vylix-dev/simpcity-thread-grid/main/simpcity-thread-grid.user.js
// @match        *://simpcity.su/*
// @match        *://www.simpcity.su/*
// @match        *://*.simpcity.su/*
// @match        *://simpcity.cr/*
// @match        *://www.simpcity.cr/*
// @match        *://*.simpcity.cr/*
// @run-at       document-idle
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @noframes
// ==/UserScript==

(() => {
  'use strict';

  const APP = Object.freeze({
    id: 'scg',
    name: 'SimpCity Thread Grid',
    storageKey: 'simpcity-thread-grid.settings.v1',
    legacyStorageKey: 'sc-grid-v3',
  });

  const DONATION_URL = 'https://ko-fi.com/vylix';
  const LOGO_PATH = 'M 512.50 802.06 C473.23,795.69 443.36,760.28 422.19,695.00 C416.37,677.05 409.33,650.22 400.54,612.45 C383.02,537.19 375.01,511.16 360.25,481.57 C340.74,442.44 310.85,412.01 276.66,396.46 L 271.50 394.12 L 275.87 394.06 C282.30,393.97 303.95,398.58 315.94,402.58 C336.56,409.47 360.37,422.84 379.50,438.29 C395.48,451.19 416.70,474.82 429.98,494.50 C443.91,515.13 459.88,544.87 473.66,575.86 C477.24,583.91 488.70,611.65 499.14,637.50 C531.09,716.66 544.06,739.87 561.11,748.37 C567.29,751.45 575.88,751.91 581.71,749.48 C587.71,746.97 588.26,746.18 586.10,743.14 C582.75,738.42 574.14,720.71 570.96,712.00 C569.26,707.33 566.70,698.33 565.28,692.00 C563.03,682.00 562.69,678.15 562.66,662.50 C562.64,646.65 562.96,642.99 565.34,631.87 C577.62,574.51 613.61,518.79 723.49,387.00 C763.19,339.37 774.42,324.54 782.29,309.31 C793.51,287.58 792.14,269.82 778.79,263.96 C774.35,262.01 771.81,261.64 763.00,261.65 C745.18,261.66 722.81,267.04 684.50,280.53 C630.01,299.70 600.98,306.09 550.00,310.13 C531.23,311.62 473.62,311.58 444.00,310.07 C384.84,307.05 332.91,307.65 311.57,311.61 C276.75,318.07 254.99,331.66 244.51,353.50 C238.60,365.82 237.63,370.78 238.27,385.38 C239.15,405.16 244.30,420.50 263.97,461.98 C269.58,473.79 278.57,492.01 283.95,502.48 C308.05,549.34 317.25,567.46 316.69,566.95 C316.35,566.65 308.95,555.63 300.23,542.45 C282.46,515.57 263.38,487.93 242.64,459.00 C206.27,408.27 198.23,395.94 188.89,376.50 C176.08,349.85 173.00,326.01 179.49,303.64 C190.40,265.97 224.39,238.96 275.12,227.62 C296.07,222.93 309.44,221.62 336.50,221.60 C381.96,221.56 416.88,226.63 498.00,245.01 C577.86,263.10 599.30,266.44 635.00,266.32 C658.75,266.25 666.64,265.36 718.00,257.01 C762.73,249.73 773.24,248.58 788.00,249.34 C801.77,250.04 808.71,251.74 819.90,257.14 C835.74,264.79 846.27,278.56 851.13,297.97 C852.98,305.34 853.19,308.40 852.76,321.47 C852.06,342.61 848.39,355.71 836.95,378.00 C827.05,397.28 818.14,409.56 775.92,462.14 C738.26,509.04 716.55,538.29 694.76,571.50 C670.71,608.14 657.69,631.56 622.81,700.93 C596.05,754.14 590.46,763.86 580.07,775.19 C568.98,787.29 553.68,796.85 539.74,800.42 C532.40,802.30 518.97,803.11 512.50,802.06 Z';

  const DEFAULT_SETTINGS = Object.freeze({
    enabled: true,
    cardMinWidth: 220,
    gap: 10,
    titleLines: 2,
    thumbnailFit: 'cover',
    showPageNums: false,
    showLatest: false,
    hoverAnim: true,
    sidebarGrid: true,
    sidebarMinWidth: 120,
  });

  const THUMBNAIL_FIT_VALUES = Object.freeze(['cover', 'contain']);

  const LIMITS = Object.freeze({
    cardMinWidth: [140, 500],
    gap: [0, 32],
    titleLines: [1, 99],
    sidebarMinWidth: [100, 260],
  });

  const CSS = String.raw`
    @import url("https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Teko:wght@500;600;700&display=swap");

    :root {
      --scg-card-min: 220px;
      --scg-gap: 10px;
      --scg-lines: 2;
      --scg-sidebar-min: 120px;
    }

    body.scg-enabled .structItemContainer-group {
      display: grid !important;
      grid-template-columns: repeat(auto-fill, minmax(min(var(--scg-card-min), 100%), 1fr)) !important;
      gap: var(--scg-gap) !important;
      align-items: start !important;
    }

    body.scg-enabled .structItemContainer-group .structItem--thread {
      display: flex !important;
      flex-direction: column !important;
      height: auto !important;
      min-width: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow: hidden !important;
      border: 1px solid rgba(255, 255, 255, 0.08) !important;
      border-radius: 10px !important;
      background: rgba(255, 255, 255, 0.04) !important;
      transition: transform 130ms ease, box-shadow 130ms ease !important;
    }

    body.scg-enabled:not(.scg-no-hover) .structItemContainer-group .structItem--thread:hover {
      transform: translateY(-3px) !important;
      box-shadow: 0 8px 22px rgba(0, 0, 0, 0.4) !important;
    }

    body.scg-enabled .structItemContainer-group .structItem--thread .structItem-cell--icon:not(.structItem-cell--iconEnd) {
      width: 100% !important;
      min-width: 0 !important;
      height: auto !important;
      overflow: hidden !important;
    }

    body.scg-enabled .structItemContainer-group .structItem--thread .structItem-cell--icon:not(.structItem-cell--iconEnd) .structItem-iconContainer {
      width: 100% !important;
      min-width: 0 !important;
      height: auto !important;
    }

    body.scg-enabled .structItemContainer-group .structItem--thread a.dcThumbnail,
    body.scg-sidebar-enabled .block-body.scg-sidebar a.dcThumbnail {
      display: block !important;
      width: 100% !important;
      height: auto !important;
      min-height: 0 !important;
      flex-shrink: 0 !important;
      overflow: hidden !important;
      border-radius: 0 !important;
      background-color: #050505 !important;
      background-size: cover !important;
      background-position: center center !important;
      background-repeat: no-repeat !important;
    }

    body.scg-enabled .structItemContainer-group .structItem--thread a.dcThumbnail img,
    body.scg-sidebar-enabled .block-body.scg-sidebar a.dcThumbnail img {
      display: block !important;
      width: 100% !important;
      height: 100% !important;
      min-height: 0 !important;
      object-fit: cover !important;
      object-position: -99999px -99999px !important;
      background-size: cover !important;
      background-position: center center !important;
      background-repeat: no-repeat !important;
    }

    body.scg-thumb-contain.scg-enabled .structItemContainer-group .structItem--thread a.dcThumbnail,
    body.scg-thumb-contain.scg-sidebar-enabled .block-body.scg-sidebar a.dcThumbnail {
      background-color: #050505 !important;
      background-size: contain !important;
      background-position: center center !important;
      background-repeat: no-repeat !important;
    }

    body.scg-thumb-contain.scg-enabled .structItemContainer-group .structItem--thread a.dcThumbnail::before,
    body.scg-thumb-contain.scg-enabled .structItemContainer-group .structItem--thread a.dcThumbnail::after,
    body.scg-thumb-contain.scg-sidebar-enabled .block-body.scg-sidebar a.dcThumbnail::before,
    body.scg-thumb-contain.scg-sidebar-enabled .block-body.scg-sidebar a.dcThumbnail::after {
      display: none !important;
      padding: 0 !important;
      content: none !important;
    }

    body.scg-thumb-contain.scg-enabled .structItemContainer-group .structItem--thread a.dcThumbnail img,
    body.scg-thumb-contain.scg-sidebar-enabled .block-body.scg-sidebar a.dcThumbnail img {
      object-fit: cover !important;
      object-position: -99999px -99999px !important;
      background: transparent !important;
      opacity: 0 !important;
    }

    body.scg-enabled .structItemContainer-group .structItem--thread .structItem-cell--main {
      flex: 1 1 auto !important;
      width: auto !important;
      min-width: 0 !important;
      padding: 9px 11px 5px !important;
    }

    body.scg-enabled .structItemContainer-group .structItem--thread .structItem-title {
      display: -webkit-box !important;
      overflow: hidden !important;
      white-space: normal !important;
      font-size: 13px !important;
      line-height: 1.4 !important;
      -webkit-line-clamp: var(--scg-lines) !important;
      -webkit-box-orient: vertical !important;
      word-break: break-word !important;
    }

    body.scg-enabled.scg-title-unlimited .structItemContainer-group .structItem--thread .structItem-title {
      display: block !important;
      overflow: visible !important;
      -webkit-line-clamp: unset !important;
    }

    body.scg-enabled .structItemContainer-group .structItem--thread .structItem-minor {
      margin-top: 5px !important;
      overflow: hidden !important;
      white-space: nowrap !important;
      text-overflow: ellipsis !important;
      font-size: 11px !important;
      opacity: 0.65 !important;
    }

    body.scg-enabled .structItemContainer-group .structItem--thread .structItem-statuses {
      margin-bottom: 3px !important;
    }

    body.scg-enabled .structItemContainer-group .structItem--thread .structItem-pageJump {
      display: none !important;
    }

    body.scg-enabled.scg-show-page-numbers .structItemContainer-group .structItem--thread .structItem-pageJump {
      display: inline !important;
    }

    body.scg-enabled .structItemContainer-group .structItem--thread .structItem-cell--meta {
      display: flex !important;
      flex-wrap: wrap !important;
      gap: 10px !important;
      width: auto !important;
      padding: 5px 11px 7px !important;
      border-top: 1px solid rgba(255, 255, 255, 0.07) !important;
      font-size: 11px !important;
    }

    body.scg-enabled .structItemContainer-group .structItem--thread .structItem-cell--meta .pairs {
      display: flex !important;
      gap: 4px !important;
      margin: 0 !important;
    }

    body.scg-enabled .structItemContainer-group .structItem--thread .structItem-cell--meta dt {
      opacity: 0.55 !important;
    }

    body.scg-enabled .structItemContainer-group .structItem--thread .structItem-cell--meta dd {
      font-weight: 600 !important;
    }

    body.scg-enabled .structItemContainer-group .structItem--thread .structItem-cell--latest,
    body.scg-enabled .structItemContainer-group .structItem--thread .structItem-cell--iconEnd {
      display: none !important;
    }

    body.scg-enabled.scg-show-latest .structItemContainer-group .structItem--thread .structItem-cell--latest {
      display: flex !important;
      align-items: center !important;
      gap: 6px !important;
      padding: 4px 11px 7px !important;
      overflow: hidden !important;
      border-top: 1px solid rgba(255, 255, 255, 0.06) !important;
      white-space: nowrap !important;
      font-size: 11px !important;
      opacity: 0.6 !important;
    }

    body.scg-enabled .structItemContainer-group .structItem--thread + .structItem--thread {
      margin-top: 0 !important;
      border-top: none !important;
    }

    body.scg-sidebar-enabled .block-body.scg-sidebar {
      display: grid !important;
      grid-template-columns: repeat(auto-fill, minmax(min(var(--scg-sidebar-min), 100%), 1fr)) !important;
      gap: 8px !important;
      margin: 0 !important;
      padding: 6px 0 !important;
      list-style: none !important;
    }

    body.scg-sidebar-enabled .block-body.scg-sidebar .block-row {
      display: flex !important;
      flex-direction: column !important;
      min-width: 0 !important;
      padding: 0 !important;
    }

    body.scg-sidebar-enabled .block-body.scg-sidebar .contentRow {
      display: flex !important;
      flex: 1 1 auto !important;
      flex-direction: column !important;
      width: 100% !important;
      min-width: 0 !important;
      overflow: hidden !important;
      border: 1px solid rgba(255, 255, 255, 0.08) !important;
      border-radius: 8px !important;
      background: rgba(255, 255, 255, 0.04) !important;
      transition: transform 130ms ease, box-shadow 130ms ease !important;
    }

    body.scg-sidebar-enabled:not(.scg-no-hover) .block-body.scg-sidebar .contentRow:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4) !important;
    }

    body.scg-sidebar-enabled .block-body.scg-sidebar .structItem-cell--icon,
    body.scg-sidebar-enabled .block-body.scg-sidebar .structItem-iconContainer {
      width: 100% !important;
      min-width: 0 !important;
      height: auto !important;
      overflow: hidden !important;
    }

    body.scg-sidebar-enabled .block-body.scg-sidebar .contentRow-main {
      flex: 1 1 auto !important;
      width: auto !important;
      min-width: 0 !important;
      padding: 7px 9px 5px !important;
    }

    body.scg-sidebar-enabled .block-body.scg-sidebar .contentRow-main > a {
      display: -webkit-box !important;
      overflow: hidden !important;
      white-space: normal !important;
      font-size: 12px !important;
      line-height: 1.4 !important;
      word-break: break-word !important;
      -webkit-line-clamp: var(--scg-lines) !important;
      -webkit-box-orient: vertical !important;
    }

    body.scg-sidebar-enabled.scg-title-unlimited .block-body.scg-sidebar .contentRow-main > a {
      display: block !important;
      overflow: visible !important;
      -webkit-line-clamp: unset !important;
    }

    body.scg-sidebar-enabled .block-body.scg-sidebar .contentRow-minor {
      margin-top: 3px !important;
      overflow: hidden !important;
      white-space: nowrap !important;
      text-overflow: ellipsis !important;
      font-size: 10px !important;
      opacity: 0.6 !important;
    }

    .scg-settings-link {
      position: relative !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 42px !important;
      min-width: 42px !important;
      height: 42px !important;
      min-height: 42px !important;
      margin: 0 2px !important;
      padding: 0 !important;
      color: #f2f2f0 !important;
      text-decoration: none !important;
      cursor: pointer !important;
      isolation: isolate !important;
      transition: color 120ms ease, transform 120ms ease !important;
    }

    .scg-settings-link:hover,
    .scg-settings-link:focus-visible {
      color: #fff !important;
      transform: translateY(-1px) !important;
      outline: none !important;
    }

    .scg-settings-icon {
      position: relative !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 31px !important;
      height: 31px !important;
      border: 1px solid rgba(255, 255, 255, 0.12) !important;
      border-radius: 999px !important;
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0)),
        rgba(34, 35, 39, 0.92) !important;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.055), 0 8px 20px rgba(0, 0, 0, 0.2) !important;
      color: #ff6666 !important;
      transition: background 120ms ease, border-color 120ms ease, box-shadow 120ms ease, color 120ms ease !important;
    }

    .scg-settings-link svg {
      width: 17px !important;
      height: 17px !important;
      filter: drop-shadow(0 0 8px rgba(255, 77, 77, 0.14)) !important;
    }

    .scg-settings-link:hover .scg-settings-icon,
    .scg-settings-link:focus-visible .scg-settings-icon {
      border-color: rgba(255, 77, 77, 0.55) !important;
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0)),
        rgba(45, 31, 34, 0.96) !important;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.07), 0 0 0 3px rgba(255, 77, 77, 0.08), 0 10px 24px rgba(0, 0, 0, 0.24) !important;
      color: #ff7a7a !important;
    }

    .scg-settings-link .p-navgroup-linkText {
      display: none !important;
    }

    .scg-overlay {
      position: fixed !important;
      inset: 0 !important;
      z-index: 2147483647 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      padding: 18px !important;
      background:
        linear-gradient(90deg, rgba(0, 0, 0, 0.86), rgba(0, 0, 0, 0.58) 48%, rgba(0, 0, 0, 0.82)),
        radial-gradient(circle at 50% 34%, rgba(255, 77, 77, 0.07), rgba(0, 0, 0, 0.72) 68%, rgba(0, 0, 0, 0.94)) !important;
      backdrop-filter: blur(5px) !important;
      animation: scg-fade-in 150ms ease !important;
    }

    .scg-overlay::before {
      content: "" !important;
      position: absolute !important;
      inset: 0 !important;
      pointer-events: none !important;
      opacity: 0.18 !important;
      background-image: radial-gradient(circle, rgba(255, 255, 255, 0.26) 1px, transparent 1px) !important;
      background-size: 8px 8px !important;
      mix-blend-mode: screen !important;
    }

    @keyframes scg-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .scg-modal {
      position: relative !important;
      z-index: 1 !important;
      display: flex !important;
      flex-direction: column !important;
      width: 430px !important;
      max-width: 96vw !important;
      max-height: 90vh !important;
      overflow: hidden !important;
      border: 1px solid rgba(255, 255, 255, 0.14) !important;
      border-radius: 10px !important;
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.035), rgba(255, 255, 255, 0)),
        rgba(12, 12, 14, 0.9) !important;
      color: #f2f2f0 !important;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 26px 80px rgba(0, 0, 0, 0.84), 0 0 44px rgba(255, 77, 77, 0.08) !important;
      backdrop-filter: blur(8px) !important;
      font-family: Rajdhani, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
      font-size: 15px !important;
      line-height: 1.4 !important;
      text-shadow: 0 1px 2px #000 !important;
      animation: scg-pop 180ms cubic-bezier(0.2, 1.4, 0.4, 1) !important;
    }

    @keyframes scg-pop {
      from { transform: translateY(8px) scale(0.97); opacity: 0; }
      to { transform: translateY(0) scale(1); opacity: 1; }
    }

    .scg-modal-header {
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      gap: 14px !important;
      padding: 18px 18px 14px !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.14) !important;
    }

    .scg-modal-title {
      display: flex !important;
      align-items: center !important;
      min-width: 0 !important;
      gap: 12px !important;
    }

    .scg-modal-mark {
      display: inline-flex !important;
      flex: 0 0 auto !important;
      align-items: center !important;
      justify-content: center !important;
      width: 47px !important;
      height: 47px !important;
      color: #ff4d4d !important;
      filter: drop-shadow(0 0 18px rgba(255, 77, 77, 0.22)) drop-shadow(0 1px 2px #000) !important;
    }

    .scg-modal-mark svg {
      display: block !important;
      width: 100% !important;
      height: 100% !important;
      fill: currentColor !important;
    }

    .scg-modal-kicker {
      display: block !important;
      margin: 0 0 3px !important;
      color: #aaa8a8 !important;
      font-size: 11px !important;
      font-weight: 700 !important;
      letter-spacing: 0.16em !important;
      line-height: 1 !important;
      text-transform: uppercase !important;
    }

    .scg-modal-title h2 {
      margin: 0 !important;
      color: #f2f2f0 !important;
      font-family: Teko, Rajdhani, sans-serif !important;
      font-size: 32px !important;
      font-weight: 600 !important;
      letter-spacing: 0.015em !important;
      line-height: 0.9 !important;
      text-transform: uppercase !important;
    }

    .scg-modal-close {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 31px !important;
      height: 31px !important;
      padding: 0 !important;
      border: 1px solid rgba(255, 255, 255, 0.12) !important;
      border-radius: 8px !important;
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.025), rgba(255, 255, 255, 0)),
        rgba(12, 12, 14, 0.58) !important;
      color: #aaa8a8 !important;
      cursor: pointer !important;
      font-size: 20px !important;
      line-height: 1 !important;
      transition: background 120ms ease, border-color 120ms ease, color 120ms ease !important;
    }

    .scg-modal-close:hover,
    .scg-modal-close:focus-visible {
      border-color: rgba(255, 77, 77, 0.58) !important;
      background: rgba(255, 77, 77, 0.16) !important;
      color: #fff !important;
      outline: none !important;
    }

    .scg-modal-body {
      flex: 1 1 auto !important;
      min-height: 0 !important;
      max-height: min(64vh, 620px) !important;
      overflow-y: auto !important;
      padding: 14px 18px !important;
      scrollbar-color: rgba(255, 77, 77, 0.45) rgba(255, 255, 255, 0.06) !important;
    }

    .scg-section-title {
      margin: 19px 0 9px !important;
      color: #aaa8a8 !important;
      font-size: 12px !important;
      font-weight: 700 !important;
      letter-spacing: 0.16em !important;
      line-height: 1 !important;
      text-transform: uppercase !important;
    }

    .scg-section-title:first-child {
      margin-top: 0 !important;
    }

    .scg-donation-section {
      display: grid !important;
      gap: 10px !important;
      margin: 0 18px 16px !important;
      padding: 12px !important;
      border: 1px solid rgba(255, 77, 77, 0.24) !important;
      border-radius: 8px !important;
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.025), rgba(255, 255, 255, 0)),
        rgba(255, 77, 77, 0.08) !important;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.045), 0 10px 28px rgba(0, 0, 0, 0.18), 0 0 22px rgba(255, 77, 77, 0.06) !important;
    }

    .scg-donation-copy {
      margin: 0 !important;
      color: #aaa8a8 !important;
      font-size: 13px !important;
    }

    .scg-donation-copy strong {
      color: #f2f2f0 !important;
      font-weight: 700 !important;
    }

    .scg-button-donate {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: fit-content !important;
      text-decoration: none !important;
    }

    .scg-row {
      display: grid !important;
      grid-template-columns: minmax(0, 1fr) auto auto !important;
      align-items: center !important;
      gap: 10px !important;
      min-height: 43px !important;
      margin-bottom: 8px !important;
      padding: 10px 11px !important;
      border: 1px solid rgba(255, 255, 255, 0.09) !important;
      border-radius: 8px !important;
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.025), rgba(255, 255, 255, 0)),
        rgba(12, 12, 14, 0.58) !important;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.045), 0 10px 28px rgba(0, 0, 0, 0.18) !important;
    }

    .scg-label {
      min-width: 0 !important;
      color: #f2f2f0 !important;
      font-size: 14px !important;
      font-weight: 600 !important;
    }

    .scg-value {
      min-width: 48px !important;
      color: #777575 !important;
      text-align: right !important;
      font-size: 12px !important;
      font-weight: 700 !important;
      letter-spacing: 0.08em !important;
      text-transform: uppercase !important;
      font-variant-numeric: tabular-nums !important;
    }

    .scg-range {
      flex: 0 0 auto !important;
      width: 128px !important;
      height: 4px !important;
      border-radius: 999px !important;
      background: rgba(255, 255, 255, 0.13) !important;
      cursor: pointer !important;
      outline: none !important;
      appearance: none !important;
      -webkit-appearance: none !important;
      accent-color: #ff4d4d !important;
    }

    .scg-range::-webkit-slider-thumb {
      width: 16px !important;
      height: 16px !important;
      border: 1px solid rgba(255, 255, 255, 0.16) !important;
      border-radius: 50% !important;
      background: #ff4d4d !important;
      cursor: pointer !important;
      box-shadow: 0 0 0 3px rgba(255, 77, 77, 0.14), 0 0 14px rgba(255, 77, 77, 0.18) !important;
      appearance: none !important;
      -webkit-appearance: none !important;
    }

    .scg-range::-moz-range-thumb {
      width: 16px !important;
      height: 16px !important;
      border: 1px solid rgba(255, 255, 255, 0.16) !important;
      border-radius: 50% !important;
      background: #ff4d4d !important;
      cursor: pointer !important;
      box-shadow: 0 0 0 3px rgba(255, 77, 77, 0.14), 0 0 14px rgba(255, 77, 77, 0.18) !important;
    }

    .scg-toggle {
      position: relative !important;
      flex: 0 0 42px !important;
      width: 42px !important;
      height: 23px !important;
    }

    .scg-toggle input {
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    .scg-toggle-track {
      position: absolute !important;
      inset: 0 !important;
      border: 1px solid rgba(255, 255, 255, 0.14) !important;
      border-radius: 999px !important;
      background: rgba(0, 0, 0, 0.4) !important;
      cursor: pointer !important;
      transition: background 160ms ease, border-color 160ms ease, box-shadow 160ms ease !important;
    }

    .scg-toggle-track::after {
      content: "" !important;
      position: absolute !important;
      top: 2px !important;
      left: 2px !important;
      width: 17px !important;
      height: 17px !important;
      border-radius: 50% !important;
      background: #aaa8a8 !important;
      transition: transform 160ms ease, background 160ms ease !important;
    }

    .scg-toggle input:checked ~ .scg-toggle-track {
      border-color: #ff4d4d !important;
      background: rgba(255, 77, 77, 0.18) !important;
      box-shadow: 0 0 0 3px rgba(255, 77, 77, 0.09), 0 0 14px rgba(255, 77, 77, 0.18) !important;
    }

    .scg-toggle input:checked ~ .scg-toggle-track::after {
      transform: translateX(19px) !important;
      background: #ff4d4d !important;
    }

    .scg-toggle input:focus-visible ~ .scg-toggle-track,
    .scg-select:focus-visible,
    .scg-range:focus-visible {
      outline: none !important;
      box-shadow: 0 0 0 3px rgba(255, 77, 77, 0.18) !important;
    }

    .scg-select {
      min-width: 118px !important;
      padding: 7px 9px !important;
      border: 1px solid rgba(255, 255, 255, 0.09) !important;
      border-radius: 8px !important;
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.025), rgba(255, 255, 255, 0)),
        rgba(12, 12, 14, 0.58) !important;
      color: #f2f2f0 !important;
      cursor: pointer !important;
      font-size: 13px !important;
      font-weight: 600 !important;
      outline: none !important;
    }

    .scg-select option {
      background: #111114 !important;
      color: #f2f2f0 !important;
    }

    .scg-modal-footer {
      display: flex !important;
      justify-content: flex-end !important;
      gap: 8px !important;
      padding: 12px 18px 16px !important;
      border-top: 1px solid rgba(255, 255, 255, 0.14) !important;
    }

    .scg-button {
      min-height: 38px !important;
      padding: 9px 12px !important;
      border-radius: 8px !important;
      cursor: pointer !important;
      font-size: 14px !important;
      font-weight: 600 !important;
      line-height: 1 !important;
      text-align: center !important;
      transition: background 120ms ease, border-color 120ms ease, color 120ms ease, transform 100ms ease !important;
    }

    .scg-button:hover,
    .scg-button:focus-visible {
      outline: none !important;
      transform: translateY(-1px) !important;
    }

    .scg-button:active {
      transform: scale(0.98) !important;
    }

    .scg-button-ghost {
      border: 1px solid rgba(255, 255, 255, 0.09) !important;
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.025), rgba(255, 255, 255, 0)),
        rgba(12, 12, 14, 0.58) !important;
      color: #f2f2f0 !important;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.045), 0 10px 28px rgba(0, 0, 0, 0.18) !important;
    }

    .scg-button-ghost:hover,
    .scg-button-ghost:focus-visible {
      border-color: rgba(255, 255, 255, 0.14) !important;
      background: rgba(24, 24, 28, 0.72) !important;
    }

    .scg-button-primary {
      border: 1px solid rgba(255, 77, 77, 0.5) !important;
      background: rgba(255, 77, 77, 0.14) !important;
      color: #fff !important;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 0 24px rgba(255, 77, 77, 0.08) !important;
    }

    .scg-button-primary:hover,
    .scg-button-primary:focus-visible {
      border-color: rgba(255, 102, 102, 0.72) !important;
      background: rgba(255, 77, 77, 0.24) !important;
    }

    @media (max-width: 620px) {
      .scg-modal {
        width: 100% !important;
      }

      .scg-modal-header {
        padding: 16px 14px 12px !important;
      }

      .scg-modal-body {
        padding: 12px 14px !important;
      }

      .scg-row {
        grid-template-columns: minmax(0, 1fr) auto !important;
      }

      .scg-range {
        grid-column: 1 / -1 !important;
        width: 100% !important;
      }

      .scg-modal-footer {
        flex-wrap: wrap !important;
        padding-inline: 14px !important;
      }

      .scg-button,
      .scg-button-donate {
        flex: 1 1 120px !important;
        width: 100% !important;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      body.scg-enabled .structItemContainer-group .structItem--thread,
      body.scg-sidebar-enabled .block-body.scg-sidebar .contentRow,
      .scg-overlay,
      .scg-modal,
      .scg-settings-link,
      .scg-settings-icon,
      .scg-button,
      .scg-toggle-track,
      .scg-toggle-track::after {
        animation: none !important;
        transition: none !important;
      }

      body.scg-enabled:not(.scg-no-hover) .structItemContainer-group .structItem--thread:hover,
      body.scg-sidebar-enabled:not(.scg-no-hover) .block-body.scg-sidebar .contentRow:hover,
      .scg-settings-link:hover,
      .scg-settings-link:focus-visible {
        transform: none !important;
      }
    }
  `;

  const ratioCache = new Map();
  const pendingRatioRequests = new Map();
  let settings = loadSettings();
  let scanQueued = false;
  let initialized = false;

  function isPlainObject(value) {
    return Object.prototype.toString.call(value) === '[object Object]';
  }

  function toBool(value, fallback) {
    return typeof value === 'boolean' ? value : fallback;
  }

  function toChoice(value, allowed, fallback) {
    return allowed.includes(value) ? value : fallback;
  }

  function toInt(value, min, max, fallback) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return fallback;
    return Math.min(max, Math.max(min, Math.round(numeric)));
  }

  function normalizeSettings(input) {
    const source = isPlainObject(input) ? input : {};
    return {
      enabled: toBool(source.enabled, DEFAULT_SETTINGS.enabled),
      cardMinWidth: toInt(source.cardMinWidth, ...LIMITS.cardMinWidth, DEFAULT_SETTINGS.cardMinWidth),
      gap: toInt(source.gap, ...LIMITS.gap, DEFAULT_SETTINGS.gap),
      titleLines: toInt(source.titleLines, ...LIMITS.titleLines, DEFAULT_SETTINGS.titleLines),
      thumbnailFit: toChoice(source.thumbnailFit, THUMBNAIL_FIT_VALUES, DEFAULT_SETTINGS.thumbnailFit),
      showPageNums: toBool(source.showPageNums, DEFAULT_SETTINGS.showPageNums),
      showLatest: toBool(source.showLatest, DEFAULT_SETTINGS.showLatest),
      hoverAnim: toBool(source.hoverAnim, DEFAULT_SETTINGS.hoverAnim),
      sidebarGrid: toBool(source.sidebarGrid, DEFAULT_SETTINGS.sidebarGrid),
      sidebarMinWidth: toInt(source.sidebarMinWidth, ...LIMITS.sidebarMinWidth, DEFAULT_SETTINGS.sidebarMinWidth),
    };
  }

  function parseStoredValue(value) {
    if (value == null || value === '') return null;
    if (isPlainObject(value)) return value;
    if (typeof value !== 'string') return null;
    try {
      const parsed = JSON.parse(value);
      return isPlainObject(parsed) ? parsed : null;
    } catch (_error) {
      return null;
    }
  }

  function storageGet(key) {
    try {
      if (typeof GM_getValue === 'function') {
        return GM_getValue(key, null);
      }
    } catch (_error) {
      // Fall through to localStorage.
    }

    try {
      return window.localStorage.getItem(key);
    } catch (_error) {
      return null;
    }
  }

  function storageSet(key, value) {
    const payload = JSON.stringify(value);
    let saved = false;

    try {
      if (typeof GM_setValue === 'function') {
        GM_setValue(key, payload);
        saved = true;
      }
    } catch (_error) {
      saved = false;
    }

    if (!saved) {
      try {
        window.localStorage.setItem(key, payload);
      } catch (_error) {
        // Settings are non-critical. Ignore storage failures such as private-mode quota errors.
      }
    }
  }

  function loadSettings() {
    const stored = parseStoredValue(storageGet(APP.storageKey));
    if (stored) return normalizeSettings(stored);

    let legacy = null;
    try {
      legacy = parseStoredValue(window.localStorage.getItem(APP.legacyStorageKey));
    } catch (_error) {
      legacy = null;
    }

    if (legacy) {
      const migrated = normalizeSettings(legacy);
      storageSet(APP.storageKey, migrated);
      return migrated;
    }

    return normalizeSettings(DEFAULT_SETTINGS);
  }

  function saveSettings(nextSettings) {
    storageSet(APP.storageKey, normalizeSettings(nextSettings));
  }

  function addStyle(css) {
    try {
      if (typeof GM_addStyle === 'function') {
        GM_addStyle(css);
        return;
      }
    } catch (_error) {
      // Fall through to a normal style tag.
    }

    const style = document.createElement('style');
    style.setAttribute('data-scg-style', 'true');
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
  }

  function applySettings(nextSettings) {
    const normalized = normalizeSettings(nextSettings);
    const root = document.documentElement;
    root.style.setProperty('--scg-card-min', `${normalized.cardMinWidth}px`);
    root.style.setProperty('--scg-gap', `${normalized.gap}px`);
    root.style.setProperty('--scg-lines', String(normalized.titleLines));
    root.style.setProperty('--scg-sidebar-min', `${normalized.sidebarMinWidth}px`);

    const body = document.body;
    if (!body) return;

    body.classList.toggle('scg-enabled', normalized.enabled);
    body.classList.toggle('scg-no-hover', !normalized.hoverAnim);
    body.classList.toggle('scg-show-page-numbers', normalized.showPageNums);
    body.classList.toggle('scg-show-latest', normalized.showLatest);
    body.classList.toggle('scg-sidebar-enabled', normalized.enabled && normalized.sidebarGrid);
    body.classList.toggle('scg-title-unlimited', normalized.titleLines >= 99);
    body.classList.toggle('scg-thumb-contain', normalized.thumbnailFit === 'contain');
  }

  function createElement(tagName, props = {}, children = []) {
    const node = document.createElement(tagName);

    Object.entries(props).forEach(([key, value]) => {
      if (value == null || value === false) return;

      if (key === 'className') {
        node.className = String(value);
        return;
      }

      if (key === 'textContent') {
        node.textContent = String(value);
        return;
      }

      if (key === 'dataset' && isPlainObject(value)) {
        Object.entries(value).forEach(([dataKey, dataValue]) => {
          node.dataset[dataKey] = String(dataValue);
        });
        return;
      }

      if (key === 'attributes' && isPlainObject(value)) {
        Object.entries(value).forEach(([attrName, attrValue]) => {
          if (attrValue != null && attrValue !== false) node.setAttribute(attrName, String(attrValue));
        });
        return;
      }

      if (key.startsWith('on') && typeof value === 'function') {
        node.addEventListener(key.slice(2).toLowerCase(), value);
        return;
      }

      if (key in node) {
        try {
          node[key] = value;
          return;
        } catch (_error) {
          // Fall back to setAttribute below.
        }
      }

      node.setAttribute(key, String(value));
    });

    const childList = Array.isArray(children) ? children : [children];
    childList.forEach((child) => {
      if (child == null) return;
      node.append(child && typeof child.nodeType === 'number' ? child : document.createTextNode(String(child)));
    });

    return node;
  }

  function createLogoMark(className) {
    const mark = createElement('span', { className, attributes: { 'aria-hidden': 'true' } });
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 1024 1024');
    svg.setAttribute('focusable', 'false');

    const logoPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    logoPath.setAttribute('d', LOGO_PATH);
    logoPath.setAttribute('fill', 'currentColor');
    svg.appendChild(logoPath);
    mark.appendChild(svg);
    return mark;
  }

  function createSvgIcon() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', '16');
    svg.setAttribute('height', '16');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('focusable', 'false');

    [
      ['path', { d: 'M4 7h5' }],
      ['path', { d: 'M15 7h5' }],
      ['circle', { cx: '12', cy: '7', r: '2' }],
      ['path', { d: 'M4 17h9' }],
      ['path', { d: 'M19 17h1' }],
      ['circle', { cx: '16', cy: '17', r: '2' }],
    ].forEach(([tag, attrs]) => {
      const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
      Object.entries(attrs).forEach(([name, value]) => node.setAttribute(name, value));
      svg.appendChild(node);
    });

    return svg;
  }

  function injectButton() {
    if (document.querySelector('.scg-settings-link')) return;

    const discovery = document.querySelector('.p-navgroup.p-discovery');
    const account = document.querySelector('.p-navgroup.p-account');
    const host = discovery || account;
    if (!host) return;

    const button = createElement('a', {
      href: '#',
      className: 'p-navgroup-link scg-settings-link',
      title: `${APP.name} settings`,
      attributes: {
        'aria-label': `${APP.name} settings`,
        role: 'button',
      },
      onclick: (event) => {
        event.preventDefault();
        openSettingsModal(button);
      },
    });

    const iconWrap = createElement('span', { className: 'scg-settings-icon', attributes: { 'aria-hidden': 'true' } }, [createSvgIcon()]);
    const text = createElement('span', { className: 'p-navgroup-linkText', textContent: 'Grid Settings' });
    button.append(iconWrap, text);

    const searchLink = discovery?.querySelector('.p-navgroup-link--search');
    if (discovery) {
      discovery.insertBefore(button, searchLink || null);
    } else {
      host.appendChild(button);
    }
  }

  function formatSettingValue(key, value) {
    if (key === 'cardMinWidth' || key === 'gap' || key === 'sidebarMinWidth') return `${value}px`;
    return String(value);
  }

  function createSectionTitle(text) {
    return createElement('div', { className: 'scg-section-title', textContent: text });
  }

  function createDonationSection() {
    return createElement('div', { className: 'scg-donation-section' }, [
      createElement('p', { className: 'scg-donation-copy' }, [
        createElement('strong', { textContent: 'Enjoying the script?' }),
        ' Support vylix development and future updates.',
      ]),
      createElement('a', {
        className: 'scg-button scg-button-primary scg-button-donate',
        href: DONATION_URL,
        target: '_blank',
        rel: 'noreferrer',
        textContent: 'Support on Ko-fi',
      }),
    ]);
  }

  function createToggleRow(labelText, key, draft) {
    const input = createElement('input', {
      type: 'checkbox',
      checked: Boolean(draft[key]),
      dataset: { scgKey: key, scgType: 'bool' },
    });

    const toggle = createElement('label', { className: 'scg-toggle' }, [
      input,
      createElement('span', { className: 'scg-toggle-track', attributes: { 'aria-hidden': 'true' } }),
    ]);

    return createElement('div', { className: 'scg-row' }, [
      createElement('span', { className: 'scg-label', textContent: labelText }),
      toggle,
    ]);
  }

  function createRangeRow(labelText, key, draft, min, max, step) {
    return createElement('div', { className: 'scg-row' }, [
      createElement('span', { className: 'scg-label', textContent: labelText }),
      createElement('input', {
        className: 'scg-range',
        type: 'range',
        min,
        max,
        step,
        value: draft[key],
        dataset: { scgKey: key, scgType: 'num' },
      }),
      createElement('span', {
        className: 'scg-value',
        textContent: formatSettingValue(key, draft[key]),
        dataset: { scgValueFor: key },
      }),
    ]);
  }

  function createTitleLinesRow(draft) {
    const select = createElement('select', {
      className: 'scg-select',
      value: String(draft.titleLines),
      dataset: { scgKey: 'titleLines', scgType: 'num' },
    });

    [
      ['1', '1 line'],
      ['2', '2 lines'],
      ['3', '3 lines'],
      ['99', 'Unlimited'],
    ].forEach(([value, text]) => {
      select.appendChild(createElement('option', { value, textContent: text, selected: Number(value) === draft.titleLines }));
    });

    return createElement('div', { className: 'scg-row' }, [
      createElement('span', { className: 'scg-label', textContent: 'Title Lines' }),
      select,
    ]);
  }

  function createThumbnailFitRow(draft) {
    const select = createElement('select', {
      className: 'scg-select',
      value: draft.thumbnailFit,
      dataset: { scgKey: 'thumbnailFit', scgType: 'string' },
    });

    [
      ['cover', 'Crop to fill'],
      ['contain', 'Show full image'],
    ].forEach(([value, text]) => {
      select.appendChild(createElement('option', { value, textContent: text, selected: value === draft.thumbnailFit }));
    });

    return createElement('div', { className: 'scg-row' }, [
      createElement('span', { className: 'scg-label', textContent: 'Thumbnail Fit' }),
      select,
    ]);
  }

  function updateModalControls(overlay, draft) {
    overlay.querySelectorAll('[data-scg-key]').forEach((control) => {
      const key = control.dataset.scgKey;
      if (!(key in draft)) return;

      if (control.dataset.scgType === 'bool') {
        control.checked = Boolean(draft[key]);
      } else {
        control.value = String(draft[key]);
      }
    });

    overlay.querySelectorAll('[data-scg-value-for]').forEach((valueNode) => {
      const key = valueNode.dataset.scgValueFor;
      valueNode.textContent = formatSettingValue(key, draft[key]);
    });
  }

  function getFocusableElements(root) {
    return Array.from(root.querySelectorAll([
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(','))).filter((node) => node.offsetWidth > 0 || node.offsetHeight > 0 || node === document.activeElement);
  }

  function trapFocus(event, modal) {
    const focusable = getFocusableElements(modal);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function openSettingsModal(opener = document.activeElement) {
    if (document.querySelector('.scg-overlay')) return;

    let draft = normalizeSettings(settings);
    const previousActiveElement = opener && typeof opener.focus === 'function' ? opener : null;
    const titleId = `${APP.id}-settings-title`;

    const overlay = createElement('div', { className: 'scg-overlay' });
    const modal = createElement('div', {
      className: 'scg-modal',
      attributes: {
        role: 'dialog',
        'aria-modal': 'true',
        'aria-labelledby': titleId,
      },
    });

    const title = createElement('div', { className: 'scg-modal-title' }, [
      createLogoMark('scg-modal-mark'),
      createElement('div', {}, [
        createElement('span', { className: 'scg-modal-kicker', textContent: 'Thread Grid' }),
        createElement('h2', { id: titleId, textContent: 'Grid Settings' }),
      ]),
    ]);
    const closeButton = createElement('button', {
      type: 'button',
      className: 'scg-modal-close',
      textContent: '×',
      title: 'Close settings',
      attributes: { 'aria-label': 'Close settings' },
    });

    const body = createElement('div', { className: 'scg-modal-body' }, [
      createSectionTitle('Layout'),
      createToggleRow('Grid View', 'enabled', draft),
      createRangeRow('Card Width', 'cardMinWidth', draft, LIMITS.cardMinWidth[0], LIMITS.cardMinWidth[1], 10),
      createRangeRow('Card Gap', 'gap', draft, LIMITS.gap[0], LIMITS.gap[1], 2),
      createTitleLinesRow(draft),

      createSectionTitle('Media'),
      createThumbnailFitRow(draft),

      createSectionTitle('Content'),
      createToggleRow('Show Page Numbers', 'showPageNums', draft),
      createToggleRow('Show Latest Post', 'showLatest', draft),

      createSectionTitle('Sidebar'),
      createToggleRow('Latest Posts Grid', 'sidebarGrid', draft),
      createRangeRow('Sidebar Card Width', 'sidebarMinWidth', draft, LIMITS.sidebarMinWidth[0], LIMITS.sidebarMinWidth[1], 10),

      createSectionTitle('Interaction'),
      createToggleRow('Card Hover Lift', 'hoverAnim', draft),
    ]);

    const resetButton = createElement('button', {
      type: 'button',
      className: 'scg-button scg-button-ghost',
      textContent: 'Reset Defaults',
    });
    const cancelButton = createElement('button', {
      type: 'button',
      className: 'scg-button scg-button-ghost',
      textContent: 'Cancel',
    });
    const saveButton = createElement('button', {
      type: 'button',
      className: 'scg-button scg-button-primary',
      textContent: 'Save',
    });

    modal.append(
      createElement('div', { className: 'scg-modal-header' }, [title, closeButton]),
      body,
      createElement('div', { className: 'scg-modal-footer' }, [resetButton, cancelButton, saveButton]),
      createDonationSection(),
    );
    overlay.appendChild(modal);

    function closeModal({ restoreSettings = true } = {}) {
      if (restoreSettings) applySettings(settings);
      document.removeEventListener('keydown', onDocumentKeydown, true);
      overlay.remove();
      if (previousActiveElement && typeof previousActiveElement.focus === 'function') previousActiveElement.focus();
    }

    function onDocumentKeydown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeModal();
      } else if (event.key === 'Tab') {
        trapFocus(event, modal);
      }
    }

    function onSettingChange(event) {
      const control = event.target.closest('[data-scg-key]');
      if (!control || !overlay.contains(control)) return;

      const key = control.dataset.scgKey;
      let value;
      if (control.dataset.scgType === 'bool') {
        value = Boolean(control.checked);
      } else if (control.dataset.scgType === 'string') {
        value = control.value;
      } else {
        value = Number(control.value);
      }
      draft = normalizeSettings({ ...draft, [key]: value });
      applySettings(draft);
      updateModalControls(overlay, draft);
    }

    overlay.addEventListener('input', onSettingChange);
    overlay.addEventListener('change', onSettingChange);
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) closeModal();
    });
    closeButton.addEventListener('click', () => closeModal());
    cancelButton.addEventListener('click', () => closeModal());
    resetButton.addEventListener('click', () => {
      draft = normalizeSettings(DEFAULT_SETTINGS);
      applySettings(draft);
      updateModalControls(overlay, draft);
    });
    saveButton.addEventListener('click', () => {
      settings = normalizeSettings(draft);
      saveSettings(settings);
      applySettings(settings);
      closeModal({ restoreSettings: false });
    });

    document.body.appendChild(overlay);
    document.addEventListener('keydown', onDocumentKeydown, true);

    const firstFocusable = getFocusableElements(modal)[0];
    if (firstFocusable) firstFocusable.focus();
  }

  function extractCssUrl(backgroundImage) {
    if (!backgroundImage || backgroundImage === 'none') return null;
    const match = backgroundImage.match(/url\((?:"([^"]+)"|'([^']+)'|([^)]*))\)/i);
    if (!match) return null;
    return (match[1] || match[2] || match[3] || '').trim();
  }

  function getBackgroundImage(node) {
    if (!node) return '';

    try {
      return node.style.backgroundImage || window.getComputedStyle(node).backgroundImage || '';
    } catch (_error) {
      return '';
    }
  }

  function getThumbnailUrl(anchor, image) {
    const fromImageBackground = extractCssUrl(getBackgroundImage(image));
    if (fromImageBackground) return fromImageBackground;

    const fromAnchorBackground = extractCssUrl(getBackgroundImage(anchor));
    if (fromAnchorBackground) return fromAnchorBackground;

    if (image) return image.currentSrc || image.src || null;
    return null;
  }

  function cssUrl(value) {
    return `url("${String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}")`;
  }

  function parseDimsFromUrl(url) {
    if (!url) return null;
    const match = String(url).match(/(?:^|[^\d])(\d{2,5})x(\d{2,5})(?:[^\d]|$)/i);
    if (!match) return null;

    const width = Number(match[1]);
    const height = Number(match[2]);
    if (!Number.isFinite(width) || !Number.isFinite(height) || width < 16 || height < 16) return null;
    return { width, height };
  }

  function applyRatio(anchor, width = 16, height = 9, imageUrl = null) {
    const safeWidth = Math.max(1, Number(width) || 16);
    const safeHeight = Math.max(1, Number(height) || 9);
    anchor.style.setProperty('aspect-ratio', `${safeWidth} / ${safeHeight}`, 'important');
    anchor.style.setProperty('width', '100%', 'important');
    anchor.style.setProperty('height', 'auto', 'important');
    if (imageUrl) anchor.style.setProperty('background-image', cssUrl(imageUrl), 'important');
    anchor.dataset.scgThumb = 'ready';

    const container = anchor.parentElement;
    if (!container) return;

    container.style.setProperty('width', '100%', 'important');
    container.style.setProperty('min-width', '0', 'important');
    container.style.setProperty('height', 'auto', 'important');

    const cell = container.parentElement;
    if (!cell) return;

    cell.style.setProperty('width', '100%', 'important');
    cell.style.setProperty('min-width', '0', 'important');
    cell.style.setProperty('height', 'auto', 'important');
  }

  function processThumb(anchor) {
    if (!anchor || typeof anchor.querySelector !== 'function' || anchor.dataset.scgThumb === 'ready') return;

    const image = anchor.querySelector('img');
    const url = getThumbnailUrl(anchor, image);

    if (image && image.naturalWidth > 0 && image.naturalHeight > 0) {
      applyRatio(anchor, image.naturalWidth, image.naturalHeight, url);
      return;
    }

    const parsedDims = parseDimsFromUrl(url);
    if (parsedDims) {
      applyRatio(anchor, parsedDims.width, parsedDims.height, url);
      return;
    }

    if (!url) {
      applyRatio(anchor, 16, 9);
      return;
    }

    if (ratioCache.has(url)) {
      const cached = ratioCache.get(url);
      applyRatio(anchor, cached.width, cached.height, url);
      return;
    }

    if (pendingRatioRequests.has(url)) {
      pendingRatioRequests.get(url).push(anchor);
      anchor.dataset.scgThumb = 'pending';
      return;
    }

    anchor.dataset.scgThumb = 'pending';
    pendingRatioRequests.set(url, [anchor]);

    const probe = new Image();
    const finish = (width, height) => {
      const ratio = { width: width || 16, height: height || 9 };
      ratioCache.set(url, ratio);
      const anchors = pendingRatioRequests.get(url) || [];
      pendingRatioRequests.delete(url);
      anchors.forEach((pendingAnchor) => applyRatio(pendingAnchor, ratio.width, ratio.height, url));
    };

    probe.onload = () => finish(probe.naturalWidth, probe.naturalHeight);
    probe.onerror = () => finish(16, 9);
    probe.src = url;
  }

  function processSidebar() {
    const preferredContainers = document.querySelectorAll('.p-body-sidebar .block-body, aside .block-body');
    const containers = preferredContainers.length ? preferredContainers : document.querySelectorAll('.block-body');

    containers.forEach((container) => {
      if (!container || !container.classList || typeof container.querySelector !== 'function') return;
      if (container.closest('.p-body-main') && !container.closest('.p-body-sidebar')) return;

      const hasLatestPostShape = Boolean(container.querySelector('.contentRow')) &&
        Boolean(container.querySelector('.dcThumbnail, .structItem-cell--icon, .contentRow-main'));

      container.classList.toggle('scg-sidebar', hasLatestPostShape);
    });
  }

  function scan() {
    injectButton();
    processSidebar();

    if (!settings.enabled) return;

    const thumbnailSelectors = ['.structItemContainer-group .structItem--thread a.dcThumbnail'];
    if (settings.sidebarGrid) thumbnailSelectors.push('.block-body.scg-sidebar a.dcThumbnail');
    document.querySelectorAll(thumbnailSelectors.join(',')).forEach(processThumb);
  }

  function queueScan() {
    if (scanQueued) return;
    scanQueued = true;

    window.requestAnimationFrame(() => {
      scanQueued = false;
      scan();
    });
  }

  function registerMenuCommands() {
    if (typeof GM_registerMenuCommand !== 'function') return;

    try {
      GM_registerMenuCommand('Open grid settings', () => openSettingsModal());
      GM_registerMenuCommand('Toggle grid view', () => {
        settings = normalizeSettings({ ...settings, enabled: !settings.enabled });
        saveSettings(settings);
        applySettings(settings);
      });
      GM_registerMenuCommand('Reset grid settings', () => {
        settings = normalizeSettings(DEFAULT_SETTINGS);
        saveSettings(settings);
        applySettings(settings);
      });
    } catch (_error) {
      // Menu commands are a convenience. The nav button remains the primary UI.
    }
  }

  function init() {
    if (initialized) return;
    initialized = true;

    addStyle(CSS);
    applySettings(settings);
    registerMenuCommands();
    queueScan();

    const observer = new MutationObserver((mutationList) => {
      const hasAddedNodes = mutationList.some((mutation) => mutation.addedNodes && mutation.addedNodes.length > 0);
      if (hasAddedNodes) queueScan();
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else if (document.body) {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  }
})();
