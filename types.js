// Lakers Timer App - Type Definitions and Interfaces
// Since we're using vanilla JavaScript, we'll use JSDoc comments for type documentation

/**
 * @typedef {Object} TimerState
 * @property {'countdown' | 'stopwatch'} mode - Current timer mode
 * @property {boolean} isRunning - Whether timer is currently running
 * @property {boolean} isPaused - Whether timer is paused
 * @property {number} currentTime - Current time in milliseconds
 * @property {number} [targetTime] - Target time for countdown mode (optional)
 * @property {number} startTime - When the timer was started (timestamp)
 */

/**
 * @typedef {Object} TimerConfig
 * @property {string} id - Unique identifier
 * @property {string} name - Display name
 * @property {number} duration - Duration in milliseconds
 * @property {boolean} isPreset - Whether this is a preset timer
 * @property {'workout' | 'study' | 'break' | 'custom'} category - Timer category
 */

/**
 * @typedef {Object} LeBronQuote
 * @property {string} id - Unique identifier
 * @property {string} text - Quote text
 * @property {string} [context] - Context or situation (optional)
 * @property {number} [year] - Year quote was said (optional)
 */

/**
 * @typedef {Object} LeBronAchievement
 * @property {string} id - Unique identifier
 * @property {string} title - Achievement title
 * @property {string} description - Achievement description
 * @property {number} year - Year achieved
 * @property {string} team - Team when achieved
 * @property {'championship' | 'award' | 'record' | 'milestone'} category - Achievement category
 */

/**
 * @typedef {Object} UserPreferences
 * @property {number} volume - Volume level (0-100)
 * @property {string} selectedSound - Selected notification sound
 * @property {boolean} lebronModeEnabled - Whether LeBron Mode is enabled
 * @property {'countdown' | 'stopwatch'} defaultTimerMode - Default timer mode
 * @property {string[]} favoritePresets - Array of favorite preset IDs
 */

/**
 * @typedef {Object} NotificationConfig
 * @property {boolean} audioEnabled - Whether audio notifications are enabled
 * @property {boolean} visualEnabled - Whether visual notifications are enabled
 * @property {boolean} browserNotifications - Whether browser notifications are enabled
 * @property {'classic' | 'arena' | 'championship'} soundTheme - Sound theme selection
 */

// Constants for Lakers theming
const LAKERS_COLORS = {
    PURPLE: '#552583',
    GOLD: '#FDB927',
    BLACK: '#000000',
    WHITE: '#FFFFFF',
    PURPLE_LIGHT: '#7B4397',
    PURPLE_DARK: '#3D1A5B',
    GOLD_LIGHT: '#FFD700',
    GOLD_DARK: '#B8860B'
};

// Timer constants
const TIMER_CONSTANTS = {
    MAX_DURATION: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    MIN_DURATION: 1000, // 1 second in milliseconds
    UPDATE_INTERVAL: 100, // Update every 100ms for smooth display
    PROGRESS_CIRCLE_CIRCUMFERENCE: 879.6 // 2 * π * 140 (radius)
};

// Preset timer configurations
const PRESET_TIMERS = [
    { id: 'preset-5', name: '5 Minutes', duration: 5 * 60 * 1000, isPreset: true, category: 'break' },
    { id: 'preset-10', name: '10 Minutes', duration: 10 * 60 * 1000, isPreset: true, category: 'break' },
    { id: 'preset-15', name: '15 Minutes', duration: 15 * 60 * 1000, isPreset: true, category: 'study' },
    { id: 'preset-23', name: '23 Minutes (LeBron)', duration: 23 * 60 * 1000, isPreset: true, category: 'workout' },
    { id: 'preset-30', name: '30 Minutes', duration: 30 * 60 * 1000, isPreset: true, category: 'workout' }
];

// LeBron Mode presets (jersey numbers)
const LEBRON_PRESETS = [
    { id: 'lebron-6', name: '6 Minutes (Miami)', duration: 6 * 60 * 1000, isPreset: true, category: 'custom' },
    { id: 'lebron-23', name: '23 Minutes (Cavs/Lakers)', duration: 23 * 60 * 1000, isPreset: true, category: 'custom' }
];

// Milestone durations for LeBron content (in minutes)
const LEBRON_MILESTONES = [6, 12, 18, 23, 30, 46, 60];

// Default user preferences
const DEFAULT_PREFERENCES = {
    volume: 50,
    selectedSound: 'classic',
    lebronModeEnabled: false,
    defaultTimerMode: 'countdown',
    favoritePresets: []
};

// Export for use in other modules (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        LAKERS_COLORS,
        TIMER_CONSTANTS,
        PRESET_TIMERS,
        LEBRON_PRESETS,
        LEBRON_MILESTONES,
        DEFAULT_PREFERENCES
    };
}