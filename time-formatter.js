// Lakers Timer App - Time Formatting Utilities
// Comprehensive time formatting with Lakers-themed enhancements

class TimeFormatter {
    constructor() {
        // Cache for formatted strings to improve performance
        this.formatCache = new Map();
        this.maxCacheSize = 1000;
    }

    /**
     * Format time in milliseconds to display string
     * @param {number} milliseconds - Time in milliseconds
     * @param {Object} options - Formatting options
     * @returns {string} Formatted time string
     */
    formatTime(milliseconds, options = {}) {
        const {
            showMilliseconds = false,
            forceHours = false,
            compact = false,
            showLeadingZero = true
        } = options;

        // Create cache key
        const cacheKey = `${milliseconds}-${JSON.stringify(options)}`;
        
        // Check cache first
        if (this.formatCache.has(cacheKey)) {
            return this.formatCache.get(cacheKey);
        }

        // Validate input
        if (typeof milliseconds !== 'number' || milliseconds < 0) {
            return '00:00';
        }

        const totalMs = Math.floor(milliseconds);
        const totalSeconds = Math.floor(totalMs / 1000);
        const ms = totalMs % 1000;
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        let formatted;

        if (forceHours || hours > 0) {
            // HH:MM:SS format
            const h = showLeadingZero ? hours.toString().padStart(2, '0') : hours.toString();
            const m = minutes.toString().padStart(2, '0');
            const s = seconds.toString().padStart(2, '0');
            
            if (compact) {
                formatted = `${h}h ${m}m ${s}s`;
            } else {
                formatted = `${h}:${m}:${s}`;
            }
        } else {
            // MM:SS format
            const m = showLeadingZero ? minutes.toString().padStart(2, '0') : minutes.toString();
            const s = seconds.toString().padStart(2, '0');
            
            if (compact) {
                formatted = `${m}m ${s}s`;
            } else {
                formatted = `${m}:${s}`;
            }
        }

        // Add milliseconds if requested
        if (showMilliseconds) {
            const msFormatted = ms.toString().padStart(3, '0');
            formatted += compact ? ` ${msFormatted}ms` : `.${msFormatted}`;
        }

        // Cache the result
        this.cacheFormatted(cacheKey, formatted);

        return formatted;
    }

    /**
     * Format time for countdown display (MM:SS or HH:MM:SS)
     * @param {number} milliseconds - Time in milliseconds
     * @returns {string} Formatted countdown time
     */
    formatCountdown(milliseconds) {
        return this.formatTime(milliseconds, { showLeadingZero: true });
    }

    /**
     * Format time for stopwatch display with milliseconds
     * @param {number} milliseconds - Time in milliseconds
     * @param {boolean} showMs - Whether to show milliseconds
     * @returns {string} Formatted stopwatch time
     */
    formatStopwatch(milliseconds, showMs = false) {
        return this.formatTime(milliseconds, { 
            showMilliseconds: showMs,
            showLeadingZero: true 
        });
    }

    /**
     * Format time in compact human-readable format
     * @param {number} milliseconds - Time in milliseconds
     * @returns {string} Compact formatted time (e.g., "5m 30s")
     */
    formatCompact(milliseconds) {
        return this.formatTime(milliseconds, { compact: true, showLeadingZero: false });
    }

    /**
     * Format time with Lakers-themed suffixes
     * @param {number} milliseconds - Time in milliseconds
     * @returns {string} Lakers-themed formatted time
     */
    formatLakersStyle(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (hours > 0) {
            return `${hours}h ${minutes}m ${seconds}s of Lakers Time`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds}s of Lakers Time`;
        } else {
            return `${seconds}s of Lakers Time`;
        }
    }

    /**
     * Parse time string to milliseconds
     * @param {string} timeString - Time string in various formats
     * @returns {number} Time in milliseconds
     */
    parseTime(timeString) {
        if (typeof timeString !== 'string') {
            throw new Error('Time string must be a string');
        }

        const trimmed = timeString.trim();
        
        // Handle empty string
        if (!trimmed) {
            return 0;
        }

        // Try different parsing patterns
        
        // Pattern 1: HH:MM:SS or MM:SS
        const colonPattern = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/;
        const colonMatch = trimmed.match(colonPattern);
        
        if (colonMatch) {
            const [, first, second, third] = colonMatch;
            
            if (third !== undefined) {
                // HH:MM:SS format
                const hours = parseInt(first, 10);
                const minutes = parseInt(second, 10);
                const seconds = parseInt(third, 10);
                
                if (minutes >= 60 || seconds >= 60) {
                    throw new Error('Invalid time format: minutes and seconds must be less than 60');
                }
                
                return (hours * 3600 + minutes * 60 + seconds) * 1000;
            } else {
                // MM:SS format
                const minutes = parseInt(first, 10);
                const seconds = parseInt(second, 10);
                
                if (seconds >= 60) {
                    throw new Error('Invalid time format: seconds must be less than 60');
                }
                
                return (minutes * 60 + seconds) * 1000;
            }
        }

        // Pattern 2: Compact format (5m 30s, 1h 30m, etc.)
        const compactPattern = /^(?:(\d+)h\s*)?(?:(\d+)m\s*)?(?:(\d+)s\s*)?$/;
        const compactMatch = trimmed.match(compactPattern);
        
        if (compactMatch) {
            const [, hours, minutes, seconds] = compactMatch;
            
            const h = hours ? parseInt(hours, 10) : 0;
            const m = minutes ? parseInt(minutes, 10) : 0;
            const s = seconds ? parseInt(seconds, 10) : 0;
            
            return (h * 3600 + m * 60 + s) * 1000;
        }

        // Pattern 3: Just numbers (assume seconds)
        const numberPattern = /^\d+$/;
        if (numberPattern.test(trimmed)) {
            const seconds = parseInt(trimmed, 10);
            return seconds * 1000;
        }

        throw new Error(`Invalid time format: ${timeString}`);
    }

    /**
     * Get time components from milliseconds
     * @param {number} milliseconds - Time in milliseconds
     * @returns {Object} Time components
     */
    getTimeComponents(milliseconds) {
        if (typeof milliseconds !== 'number' || milliseconds < 0) {
            return { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };
        }

        const totalMs = Math.floor(milliseconds);
        const totalSeconds = Math.floor(totalMs / 1000);
        const ms = totalMs % 1000;
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return { hours, minutes, seconds, milliseconds: ms };
    }

    /**
     * Format duration between two timestamps
     * @param {number} startTime - Start timestamp
     * @param {number} endTime - End timestamp
     * @returns {string} Formatted duration
     */
    formatDuration(startTime, endTime) {
        const duration = Math.abs(endTime - startTime);
        return this.formatTime(duration);
    }

    /**
     * Format time with ordinal indicators for Lakers milestones
     * @param {number} milliseconds - Time in milliseconds
     * @returns {Object} Formatted time with milestone info
     */
    formatWithMilestones(milliseconds) {
        const minutes = Math.floor(milliseconds / (1000 * 60));
        const formatted = this.formatTime(milliseconds);
        
        const milestoneInfo = {
            formatted,
            minutes,
            isLeBronMilestone: [6, 23].includes(minutes),
            isMilestone: LEBRON_MILESTONES.includes(minutes),
            milestoneMessage: null
        };

        if (minutes === 6) {
            milestoneInfo.milestoneMessage = "LeBron's Miami Heat Jersey Number! 🔥";
        } else if (minutes === 23) {
            milestoneInfo.milestoneMessage = "LeBron's Iconic Jersey Number! 👑";
        } else if (LEBRON_MILESTONES.includes(minutes)) {
            milestoneInfo.milestoneMessage = `${minutes} minutes - A Lakers milestone! 💜💛`;
        }

        return milestoneInfo;
    }

    /**
     * Format time for accessibility (screen readers)
     * @param {number} milliseconds - Time in milliseconds
     * @returns {string} Accessibility-friendly time description
     */
    formatForAccessibility(milliseconds) {
        const { hours, minutes, seconds } = this.getTimeComponents(milliseconds);
        
        const parts = [];
        
        if (hours > 0) {
            parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
        }
        
        if (minutes > 0) {
            parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
        }
        
        if (seconds > 0 || parts.length === 0) {
            parts.push(`${seconds} ${seconds === 1 ? 'second' : 'seconds'}`);
        }
        
        return parts.join(', ');
    }

    /**
     * Validate time format
     * @param {string} timeString - Time string to validate
     * @returns {Object} Validation result
     */
    validateTimeFormat(timeString) {
        try {
            const milliseconds = this.parseTime(timeString);
            return {
                isValid: true,
                milliseconds,
                formatted: this.formatTime(milliseconds),
                errors: []
            };
        } catch (error) {
            return {
                isValid: false,
                milliseconds: 0,
                formatted: '00:00',
                errors: [error.message]
            };
        }
    }

    /**
     * Cache formatted string
     * @private
     */
    cacheFormatted(key, value) {
        // Implement LRU cache behavior
        if (this.formatCache.size >= this.maxCacheSize) {
            const firstKey = this.formatCache.keys().next().value;
            this.formatCache.delete(firstKey);
        }
        
        this.formatCache.set(key, value);
    }

    /**
     * Clear formatting cache
     */
    clearCache() {
        this.formatCache.clear();
    }

    /**
     * Get cache statistics
     * @returns {Object} Cache statistics
     */
    getCacheStats() {
        return {
            size: this.formatCache.size,
            maxSize: this.maxCacheSize,
            hitRate: this.cacheHits / (this.cacheHits + this.cacheMisses) || 0
        };
    }
}

// Create singleton instance
const timeFormatter = new TimeFormatter();

// Export both class and singleton
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TimeFormatter, timeFormatter };
} else {
    // Browser global
    window.TimeFormatter = TimeFormatter;
    window.timeFormatter = timeFormatter;
}