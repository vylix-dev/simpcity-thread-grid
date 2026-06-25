// ==UserScript==
// @name         SimpCity Thread Grid
// @namespace    https://github.com/vylix-dev/simpcity-thread-grid
// @version      9.0.1
// @description  Responsive card grid for SimpCity thread lists and sidebar latest posts, with a polished settings UI.
// @author       vylix-dev
// @license      MIT
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

  const DEFAULT_SETTINGS = Object.freeze({
    enabled: true,
    cardMinWidth: 220,
    gap: 10,
    titleLines: 2,
    showPageNums: false,
    showLatest: false,
    hoverAnim: true,
    sidebarGrid: true,
    sidebarMinWidth: 120,
  });

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

    body.scg-enabled .structItem--thread {
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

    body.scg-enabled:not(.scg-no-hover) .structItem--thread:hover {
      transform: translateY(-3px) !important;
      box-shadow: 0 8px 22px rgba(0, 0, 0, 0.4) !important;
    }

    body.scg-enabled .structItem-cell--icon:not(.structItem-cell--iconEnd) {
      width: 100% !important;
      min-width: 0 !important;
      height: auto !important;
      overflow: hidden !important;
    }

    body.scg-enabled .structItem-cell--icon:not(.structItem-cell--iconEnd) .structItem-iconContainer {
      width: 100% !important;
      min-width: 0 !important;
      height: auto !important;
    }

    body.scg-enabled a.dcThumbnail,
    body.scg-sidebar-enabled a.dcThumbnail {
      display: block !important;
      width: 100% !important;
      height: auto !important;
      min-height: 0 !important;
      flex-shrink: 0 !important;
      overflow: hidden !important;
      border-radius: 0 !important;
      background-size: cover !important;
      background-position: center center !important;
    }

    body.scg-enabled a.dcThumbnail img,
    body.scg-sidebar-enabled a.dcThumbnail img {
      display: block !important;
      width: 100% !important;
      height: 100% !important;
      min-height: 0 !important;
      object-fit: cover !important;
      object-position: -99999px -99999px !important;
      background-size: cover !important;
      background-position: center center !important;
    }

    body.scg-enabled .structItem-cell--main {
      flex: 1 1 auto !important;
      width: auto !important;
      min-width: 0 !important;
      padding: 9px 11px 5px !important;
    }

    body.scg-enabled .structItem-title {
      display: -webkit-box !important;
      overflow: hidden !important;
      white-space: normal !important;
      font-size: 13px !important;
      line-height: 1.4 !important;
      -webkit-line-clamp: var(--scg-lines) !important;
      -webkit-box-orient: vertical !important;
      word-break: break-word !important;
    }

    body.scg-enabled.scg-title-unlimited .structItem-title {
      display: block !important;
      overflow: visible !important;
      -webkit-line-clamp: unset !important;
    }

    body.scg-enabled .structItem-minor {
      margin-top: 5px !important;
      overflow: hidden !important;
      white-space: nowrap !important;
      text-overflow: ellipsis !important;
      font-size: 11px !important;
      opacity: 0.65 !important;
    }

    body.scg-enabled .structItem-statuses {
      margin-bottom: 3px !important;
    }

    body.scg-enabled .structItem-pageJump {
      display: none !important;
    }

    body.scg-enabled.scg-show-page-numbers .structItem-pageJump {
      display: inline !important;
    }

    body.scg-enabled .structItem-cell--meta {
      display: flex !important;
      flex-wrap: wrap !important;
      gap: 10px !important;
      width: auto !important;
      padding: 5px 11px 7px !important;
      border-top: 1px solid rgba(255, 255, 255, 0.07) !important;
      font-size: 11px !important;
    }

    body.scg-enabled .structItem-cell--meta .pairs {
      display: flex !important;
      gap: 4px !important;
      margin: 0 !important;
    }

    body.scg-enabled .structItem-cell--meta dt {
      opacity: 0.55 !important;
    }

    body.scg-enabled .structItem-cell--meta dd {
      font-weight: 600 !important;
    }

    body.scg-enabled .structItem-cell--latest,
    body.scg-enabled .structItem-cell--iconEnd {
      display: none !important;
    }

    body.scg-enabled.scg-show-latest .structItem-cell--latest {
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

    body.scg-enabled .structItem--thread + .structItem--thread {
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

    .scg-settings-link i {
      position: relative !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 31px !important;
      height: 31px !important;
      border: 1px solid rgba(255, 255, 255, 0.13) !important;
      border-radius: 10px !important;
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0)),
        rgba(12, 12, 14, 0.58) !important;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 8px 20px rgba(0, 0, 0, 0.24) !important;
      color: #ff4d4d !important;
      transition: background 120ms ease, border-color 120ms ease, box-shadow 120ms ease, color 120ms ease !important;
    }

    .scg-settings-link i::after {
      content: "" !important;
      position: absolute !important;
      top: 5px !important;
      right: 5px !important;
      width: 5px !important;
      height: 5px !important;
      border-radius: 999px !important;
      background: #ff4d4d !important;
      box-shadow: 0 0 10px rgba(255, 77, 77, 0.55) !important;
    }

    .scg-settings-link svg {
      width: 16px !important;
      height: 16px !important;
      filter: drop-shadow(0 0 10px rgba(255, 77, 77, 0.16)) !important;
    }

    .scg-settings-link:hover i,
    .scg-settings-link:focus-visible i {
      border-color: rgba(255, 77, 77, 0.58) !important;
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0)),
        rgba(255, 77, 77, 0.16) !important;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.07), 0 0 0 3px rgba(255, 77, 77, 0.08), 0 10px 24px rgba(0, 0, 0, 0.28) !important;
      color: #ff6666 !important;
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
      flex: 0 0 auto !important;
      color: #ff4d4d !important;
      font-family: Teko, Rajdhani, sans-serif !important;
      font-size: 44px !important;
      font-weight: 600 !important;
      letter-spacing: -0.03em !important;
      line-height: 0.78 !important;
      text-shadow: 0 0 18px rgba(255, 77, 77, 0.22), 0 1px 2px #000 !important;
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

      .scg-button {
        flex: 1 1 120px !important;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      body.scg-enabled .structItem--thread,
      body.scg-sidebar-enabled .block-body.scg-sidebar .contentRow,
      .scg-overlay,
      .scg-modal,
      .scg-settings-link,
      .scg-button,
      .scg-toggle-track,
      .scg-toggle-track::after {
        animation: none !important;
        transition: none !important;
      }

      body.scg-enabled:not(.scg-no-hover) .structItem--thread:hover,
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

  function createSvgIcon() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', '16');
    svg.setAttribute('height', '16');
    svg.setAttribute('fill', 'currentColor');
    svg.setAttribute('focusable', 'false');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54C14.46 3.17 14.26 3 14.02 3h-3.84c-.24 0-.44.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.83 9.47c-.12.21-.08.47.12.61l2.03 1.58C4.93 11.86 4.9 12.18 4.9 12.5s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.04.24.24.41.47.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6S10.02 8.4 12 8.4s3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z');
    svg.appendChild(path);
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
      className: 'p-navgroup-link p-navgroup-link--iconic scg-settings-link',
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

    const iconWrap = createElement('i', { attributes: { 'aria-hidden': 'true' } }, [createSvgIcon()]);
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
      createElement('span', { className: 'scg-modal-mark', textContent: 'SC' }),
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
      const value = control.dataset.scgType === 'bool' ? Boolean(control.checked) : Number(control.value);
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

  function parseDimsFromUrl(url) {
    if (!url) return null;
    const match = String(url).match(/(?:^|[^\d])(\d{2,5})x(\d{2,5})(?:[^\d]|$)/i);
    if (!match) return null;

    const width = Number(match[1]);
    const height = Number(match[2]);
    if (!Number.isFinite(width) || !Number.isFinite(height) || width < 16 || height < 16) return null;
    return { width, height };
  }

  function applyRatio(anchor, width = 16, height = 9) {
    const safeWidth = Math.max(1, Number(width) || 16);
    const safeHeight = Math.max(1, Number(height) || 9);
    anchor.style.setProperty('aspect-ratio', `${safeWidth} / ${safeHeight}`, 'important');
    anchor.style.setProperty('width', '100%', 'important');
    anchor.style.setProperty('height', 'auto', 'important');
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
      applyRatio(anchor, image.naturalWidth, image.naturalHeight);
      return;
    }

    const parsedDims = parseDimsFromUrl(url);
    if (parsedDims) {
      applyRatio(anchor, parsedDims.width, parsedDims.height);
      return;
    }

    if (!url) {
      applyRatio(anchor, 16, 9);
      return;
    }

    if (ratioCache.has(url)) {
      const cached = ratioCache.get(url);
      applyRatio(anchor, cached.width, cached.height);
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
      anchors.forEach((pendingAnchor) => applyRatio(pendingAnchor, ratio.width, ratio.height));
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
    document.querySelectorAll('a.dcThumbnail').forEach(processThumb);
    processSidebar();
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
