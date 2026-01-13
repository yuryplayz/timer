// Lakers Timer App - Countdown Timer Component
// Specialized countdown timer with Lakers-themed features

class CountdownTimer {
    constructor(timerEngine) {
        this.engine = timerEngine;
        this.completionCallbacks = [];
        this.warningCallbacks = [];
        this.milestoneCallbacks = [];
        
        // Warning thresholds (in milliseconds)
        this.warningThresholds = [
            60000,  // 1 minute
            30000,  // 30 seconds
            10000,  // 10 seconds
            5000,   // 5 seconds
            3000,   // 3 seconds
            1000    // 1 second
        ];
        
        this.warningsTriggered = new Set();
        
        // Bind methods
        this.onTick = this.onTick.bind(this);
        this.onComplete = this.onComplete.bind(this);
        
        // Set up event listeners
        this.engine.addEventListener('tick', this.onTick);
        this.engine.addEventListener('complete', this.onComplete);
        this.engine.addEventListener('reset', () => this.warningsTriggered.clear());
    }

    /**
     * Set countdown duration with validation
     * @param {number} minutes - Minutes
     * @param {number} seconds - Seconds
     */
    setDuration(minutes, seconds) {
        // Validate input
        if (minutes < 0 || seconds < 0) {
            throw new Error('Duration cannot be negative');
        }
        
        if (minutes > 1440) { // 24 hours
            throw new Error('Duration cannot exceed 24 hours');
        }
        
        if (seconds >= 60) {
            throw new Error('Seconds must be less than 60');
        }
        
        const totalMilliseconds = (minutes * 60 + seconds) * 1000;
        
        if (totalMilliseconds === 0) {
            throw new Error('Duration must be greater than zero');
        }
        
        this.engine.setMode('countdown');
        this.engine.setTargetTime(totalMilliseconds);
        this.warningsTriggered.clear();
        
        return totalMilliseconds;
    }

    /**
     * Set duration from preset
     * @param {number} minutes - Preset duration in minutes
     */
    setPresetDuration(minutes) {
        return this.setDuration(minutes, 0);
    }

    /**
     * Set duration from milliseconds
     * @param {number} milliseconds - Duration in milliseconds
     */
    setDurationFromMilliseconds(milliseconds) {
        if (milliseconds <= 0) {
            throw new Error('Duration must be greater than zero');
        }
        
        if (milliseconds > TIMER_CONSTANTS.MAX_DURATION) {
            throw new Error('Duration exceeds maximum allowed time');
        }
        
        this.engine.setMode('countdown');
        this.engine.setTargetTime(milliseconds);
        this.warningsTriggered.clear();
        
        return milliseconds;
    }

    /**
     * Start the countdown
     */
    start() {
        const state = this.engine.getState();
        
        if (state.currentTime <= 0) {
            throw new Error('Cannot start countdown with zero duration');
        }
        
        this.engine.start();
    }

    /**
     * Pause the countdown
     */
    pause() {
        this.engine.pause();
    }

    /**
     * Resume the countdown
     */
    resume() {
        this.engine.resume();
    }

    /**
     * Reset the countdown
     */
    reset() {
        this.engine.reset();
    }

    /**
     * Get remaining time in various formats
     */
    getRemainingTime() {
        const state = this.engine.getState();
        const milliseconds = state.currentTime;
        
        return {
            milliseconds,
            seconds: Math.ceil(milliseconds / 1000),
            totalSeconds: Math.floor(milliseconds / 1000),
            minutes: Math.floor(milliseconds / (1000 * 60)),
            hours: Math.floor(milliseconds / (1000 * 60 * 60)),
            formatted: this.engine.formatTime(milliseconds),
            percentage: this.getProgressPercentage()
        };
    }

    /**
     * Get progress as percentage (0-100)
     */
    getProgressPercentage() {
        const state = this.engine.getState();
        if (state.targetTime <= 0) return 0;
        
        const elapsed = state.targetTime - state.currentTime;
        return Math.min(100, Math.max(0, (elapsed / state.targetTime) * 100));
    }

    /**
     * Check if countdown is at a milestone duration
     * @param {number} currentTime - Current time in milliseconds
     * @returns {boolean} True if at milestone
     */
    isAtMilestone(currentTime) {
        const minutes = Math.floor(currentTime / (1000 * 60));
        return LEBRON_MILESTONES.includes(minutes);
    }

    /**
     * Handle tick events
     */
    onTick(data) {
        const currentTime = data.currentTime;
        
        // Check for warnings
        this.checkWarnings(currentTime);
        
        // Check for milestones
        this.checkMilestones(currentTime);
    }

    /**
     * Check and trigger warning callbacks
     */
    checkWarnings(currentTime) {
        for (const threshold of this.warningThresholds) {
            if (currentTime <= threshold && !this.warningsTriggered.has(threshold)) {
                this.warningsTriggered.add(threshold);
                
                // Trigger warning callbacks
                this.warningCallbacks.forEach(callback => {
                    try {
                        callback({
                            threshold,
                            remainingTime: currentTime,
                            formatted: this.engine.formatTime(currentTime),
                            isUrgent: threshold <= 10000 // Last 10 seconds
                        });
                    } catch (error) {
                        console.error('Error in countdown warning callback:', error);
                    }
                });
                
                break; // Only trigger one warning per tick
            }
        }
    }

    /**
     * Check and trigger milestone callbacks
     */
    checkMilestones(currentTime) {
        if (this.isAtMilestone(currentTime)) {
            const minutes = Math.floor(currentTime / (1000 * 60));
            
            this.milestoneCallbacks.forEach(callback => {
                try {
                    callback({
                        milestone: minutes,
                        remainingTime: currentTime,
                        formatted: this.engine.formatTime(currentTime),
                        isLeBronMilestone: [6, 23].includes(minutes)
                    });
                } catch (error) {
                    console.error('Error in countdown milestone callback:', error);
                }
            });
        }
    }

    /**
     * Handle completion events
     */
    onComplete(data) {
        // Trigger completion callbacks
        this.completionCallbacks.forEach(callback => {
            try {
                callback({
                    mode: 'countdown',
                    finalTime: 0,
                    originalDuration: this.engine.getState().targetTime,
                    completedAt: new Date()
                });
            } catch (error) {
                console.error('Error in countdown completion callback:', error);
            }
        });
    }

    /**
     * Add completion callback
     * @param {Function} callback - Callback function
     */
    onCompletion(callback) {
        if (typeof callback === 'function') {
            this.completionCallbacks.push(callback);
        }
    }

    /**
     * Add warning callback
     * @param {Function} callback - Callback function
     */
    onWarning(callback) {
        if (typeof callback === 'function') {
            this.warningCallbacks.push(callback);
        }
    }

    /**
     * Add milestone callback
     * @param {Function} callback - Callback function
     */
    onMilestone(callback) {
        if (typeof callback === 'function') {
            this.milestoneCallbacks.push(callback);
        }
    }

    /**
     * Remove callback
     * @param {string} type - Callback type ('completion', 'warning', 'milestone')
     * @param {Function} callback - Callback function to remove
     */
    removeCallback(type, callback) {
        let callbackArray;
        
        switch (type) {
            case 'completion':
                callbackArray = this.completionCallbacks;
                break;
            case 'warning':
                callbackArray = this.warningCallbacks;
                break;
            case 'milestone':
                callbackArray = this.milestoneCallbacks;
                break;
            default:
                return false;
        }
        
        const index = callbackArray.indexOf(callback);
        if (index > -1) {
            callbackArray.splice(index, 1);
            return true;
        }
        
        return false;
    }

    /**
     * Get current state
     */
    getState() {
        return {
            ...this.engine.getState(),
            remainingTime: this.getRemainingTime(),
            warningsTriggered: Array.from(this.warningsTriggered),
            isAtMilestone: this.isAtMilestone(this.engine.getState().currentTime)
        };
    }

    /**
     * Validate duration input
     * @param {number} minutes - Minutes
     * @param {number} seconds - Seconds
     * @returns {Object} Validation result
     */
    static validateDuration(minutes, seconds) {
        const errors = [];
        
        if (typeof minutes !== 'number' || typeof seconds !== 'number') {
            errors.push('Minutes and seconds must be numbers');
        }
        
        if (minutes < 0 || seconds < 0) {
            errors.push('Duration cannot be negative');
        }
        
        if (minutes > 1440) {
            errors.push('Duration cannot exceed 24 hours');
        }
        
        if (seconds >= 60) {
            errors.push('Seconds must be less than 60');
        }
        
        const totalMilliseconds = (minutes * 60 + seconds) * 1000;
        if (totalMilliseconds === 0) {
            errors.push('Duration must be greater than zero');
        }
        
        return {
            isValid: errors.length === 0,
            errors,
            totalMilliseconds: errors.length === 0 ? totalMilliseconds : 0
        };
    }

    /**
     * Clean up resources
     */
    destroy() {
        this.engine.removeEventListener('tick', this.onTick);
        this.engine.removeEventListener('complete', this.onComplete);
        
        this.completionCallbacks = [];
        this.warningCallbacks = [];
        this.milestoneCallbacks = [];
        this.warningsTriggered.clear();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CountdownTimer;
}