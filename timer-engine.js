// Lakers Timer App - Timer Engine
// Core timer functionality with state management

class TimerEngine {
    constructor() {
        /** @type {TimerState} */
        this.state = {
            mode: 'countdown',
            isRunning: false,
            isPaused: false,
            currentTime: 0,
            targetTime: 5 * 60 * 1000, // Default 5 minutes
            startTime: 0
        };
        
        this.animationFrameId = null;
        this.lastUpdateTime = 0;
        this.eventListeners = new Map();
        
        // Bind methods to preserve context
        this.update = this.update.bind(this);
        this.start = this.start.bind(this);
        this.pause = this.pause.bind(this);
        this.resume = this.resume.bind(this);
        this.reset = this.reset.bind(this);
    }

    /**
     * Add event listener for timer events
     * @param {string} event - Event name ('tick', 'complete', 'start', 'pause', 'reset')
     * @param {Function} callback - Callback function
     */
    addEventListener(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }

    /**
     * Remove event listener
     * @param {string} event - Event name
     * @param {Function} callback - Callback function to remove
     */
    removeEventListener(event, callback) {
        if (this.eventListeners.has(event)) {
            const listeners = this.eventListeners.get(event);
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }

    /**
     * Emit event to all listeners
     * @param {string} event - Event name
     * @param {*} data - Event data
     */
    emit(event, data = null) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in timer event listener for ${event}:`, error);
                }
            });
        }
    }

    /**
     * Set timer mode
     * @param {'countdown' | 'stopwatch'} mode - Timer mode
     */
    setMode(mode) {
        if (mode !== 'countdown' && mode !== 'stopwatch') {
            throw new Error('Invalid timer mode. Must be "countdown" or "stopwatch"');
        }
        
        const wasRunning = this.state.isRunning;
        if (wasRunning) {
            this.pause();
        }
        
        this.state.mode = mode;
        this.reset();
        
        this.emit('modeChanged', { mode, wasRunning });
    }

    /**
     * Set target time for countdown mode
     * @param {number} milliseconds - Target time in milliseconds
     */
    setTargetTime(milliseconds) {
        if (milliseconds < 0) {
            throw new Error('Target time cannot be negative');
        }
        if (milliseconds > TIMER_CONSTANTS.MAX_DURATION) {
            throw new Error(`Target time cannot exceed ${TIMER_CONSTANTS.MAX_DURATION}ms (24 hours)`);
        }
        
        this.state.targetTime = milliseconds;
        if (this.state.mode === 'countdown') {
            this.state.currentTime = milliseconds;
        }
        
        this.emit('targetTimeChanged', { targetTime: milliseconds });
    }

    /**
     * Start the timer
     */
    start() {
        if (this.state.isRunning) {
            return; // Already running
        }

        // Validate state before starting
        if (this.state.mode === 'countdown' && this.state.currentTime <= 0) {
            this.emit('error', { message: 'Cannot start countdown with zero time' });
            return;
        }

        this.state.isRunning = true;
        this.state.isPaused = false;
        this.state.startTime = performance.now();
        this.lastUpdateTime = this.state.startTime;
        
        this.animationFrameId = requestAnimationFrame(this.update);
        
        this.emit('start', { 
            mode: this.state.mode, 
            currentTime: this.state.currentTime,
            targetTime: this.state.targetTime 
        });
    }

    /**
     * Pause the timer
     */
    pause() {
        if (!this.state.isRunning || this.state.isPaused) {
            return; // Not running or already paused
        }

        this.state.isPaused = true;
        this.state.isRunning = false;
        
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        
        this.emit('pause', { 
            currentTime: this.state.currentTime,
            mode: this.state.mode 
        });
    }

    /**
     * Resume the timer from paused state
     */
    resume() {
        if (!this.state.isPaused) {
            return; // Not paused
        }

        this.state.isRunning = true;
        this.state.isPaused = false;
        this.lastUpdateTime = performance.now();
        
        this.animationFrameId = requestAnimationFrame(this.update);
        
        this.emit('resume', { 
            currentTime: this.state.currentTime,
            mode: this.state.mode 
        });
    }

    /**
     * Reset the timer to initial state
     */
    reset() {
        const wasRunning = this.state.isRunning;
        
        this.state.isRunning = false;
        this.state.isPaused = false;
        
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        
        if (this.state.mode === 'countdown') {
            this.state.currentTime = this.state.targetTime || 0;
        } else {
            this.state.currentTime = 0;
        }
        
        this.emit('reset', { 
            mode: this.state.mode,
            currentTime: this.state.currentTime,
            wasRunning 
        });
    }

    /**
     * Main update loop using requestAnimationFrame for precision
     */
    update() {
        if (!this.state.isRunning || this.state.isPaused) {
            return;
        }

        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastUpdateTime;
        
        // Only update if enough time has passed (for performance)
        if (deltaTime >= TIMER_CONSTANTS.UPDATE_INTERVAL) {
            if (this.state.mode === 'countdown') {
                this.state.currentTime = Math.max(0, this.state.currentTime - deltaTime);
                
                // Check for completion
                if (this.state.currentTime <= 0) {
                    this.state.currentTime = 0;
                    this.state.isRunning = false;
                    
                    if (this.animationFrameId) {
                        cancelAnimationFrame(this.animationFrameId);
                        this.animationFrameId = null;
                    }
                    
                    this.emit('complete', { 
                        mode: this.state.mode,
                        finalTime: this.state.currentTime 
                    });
                    return;
                }
            } else if (this.state.mode === 'stopwatch') {
                this.state.currentTime += deltaTime;
                
                // Check for maximum duration
                if (this.state.currentTime >= TIMER_CONSTANTS.MAX_DURATION) {
                    this.state.currentTime = TIMER_CONSTANTS.MAX_DURATION;
                    this.pause();
                    this.emit('maxDurationReached', { 
                        mode: this.state.mode,
                        maxTime: TIMER_CONSTANTS.MAX_DURATION 
                    });
                    return;
                }
            }
            
            this.lastUpdateTime = currentTime;
            
            // Emit tick event with current state
            this.emit('tick', {
                mode: this.state.mode,
                currentTime: this.state.currentTime,
                targetTime: this.state.targetTime,
                isRunning: this.state.isRunning,
                progress: this.getProgress()
            });
        }
        
        // Continue the animation loop
        this.animationFrameId = requestAnimationFrame(this.update);
    }

    /**
     * Get current progress as percentage (0-1)
     * @returns {number} Progress percentage
     */
    getProgress() {
        if (this.state.mode === 'countdown' && this.state.targetTime > 0) {
            return Math.max(0, Math.min(1, (this.state.targetTime - this.state.currentTime) / this.state.targetTime));
        } else if (this.state.mode === 'stopwatch') {
            // For stopwatch, progress is based on time elapsed vs max duration
            return Math.min(1, this.state.currentTime / TIMER_CONSTANTS.MAX_DURATION);
        }
        return 0;
    }

    /**
     * Get current state (read-only copy)
     * @returns {TimerState} Current timer state
     */
    getState() {
        return { ...this.state };
    }

    /**
     * Get formatted time string
     * @param {number} [time] - Time in milliseconds (uses current time if not provided)
     * @returns {string} Formatted time string
     */
    getFormattedTime(time = this.state.currentTime) {
        return this.formatTime(time);
    }

    /**
     * Format time in milliseconds to display string
     * @param {number} milliseconds - Time in milliseconds
     * @returns {string} Formatted time (MM:SS or HH:MM:SS)
     */
    formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    /**
     * Parse time string to milliseconds
     * @param {string} timeString - Time string in MM:SS or HH:MM:SS format
     * @returns {number} Time in milliseconds
     */
    parseTime(timeString) {
        const parts = timeString.split(':').map(part => parseInt(part, 10));
        
        if (parts.length === 2) {
            // MM:SS format
            const [minutes, seconds] = parts;
            return (minutes * 60 + seconds) * 1000;
        } else if (parts.length === 3) {
            // HH:MM:SS format
            const [hours, minutes, seconds] = parts;
            return (hours * 3600 + minutes * 60 + seconds) * 1000;
        }
        
        throw new Error('Invalid time format. Use MM:SS or HH:MM:SS');
    }

    /**
     * Destroy the timer and clean up resources
     */
    destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        
        this.eventListeners.clear();
        this.state.isRunning = false;
        this.state.isPaused = false;
        
        this.emit('destroyed');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TimerEngine;
}