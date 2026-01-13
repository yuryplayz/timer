// Lakers Timer App - Stopwatch Component
// Specialized stopwatch with lap time recording and Lakers-themed features

class Stopwatch {
    constructor(timerEngine) {
        this.engine = timerEngine;
        this.lapTimes = [];
        this.milestoneCallbacks = [];
        this.lapCallbacks = [];
        
        // Milestone thresholds (in milliseconds)
        this.milestoneThresholds = [
            60000,      // 1 minute
            5 * 60000,  // 5 minutes
            10 * 60000, // 10 minutes
            15 * 60000, // 15 minutes
            23 * 60000, // 23 minutes (LeBron)
            30 * 60000, // 30 minutes
            60 * 60000  // 1 hour
        ];
        
        this.milestonesReached = new Set();
        
        // Bind methods
        this.onTick = this.onTick.bind(this);
        this.onReset = this.onReset.bind(this);
        
        // Set up event listeners
        this.engine.addEventListener('tick', this.onTick);
        this.engine.addEventListener('reset', this.onReset);
    }

    /**
     * Initialize stopwatch mode
     */
    initialize() {
        this.engine.setMode('stopwatch');
        this.lapTimes = [];
        this.milestonesReached.clear();
    }

    /**
     * Start the stopwatch
     */
    start() {
        this.engine.setMode('stopwatch');
        this.engine.start();
    }

    /**
     * Pause the stopwatch
     */
    pause() {
        this.engine.pause();
    }

    /**
     * Resume the stopwatch
     */
    resume() {
        this.engine.resume();
    }

    /**
     * Reset the stopwatch
     */
    reset() {
        this.engine.reset();
    }

    /**
     * Record a lap time
     * @returns {Object} Lap time information
     */
    recordLap() {
        const state = this.engine.getState();
        const currentTime = state.currentTime;
        
        if (currentTime === 0) {
            throw new Error('Cannot record lap time when stopwatch is at zero');
        }
        
        const lapNumber = this.lapTimes.length + 1;
        const previousLapTime = this.lapTimes.length > 0 ? 
            this.lapTimes[this.lapTimes.length - 1].totalTime : 0;
        const lapTime = currentTime - previousLapTime;
        
        const lapData = {
            lapNumber,
            lapTime,
            totalTime: currentTime,
            timestamp: new Date(),
            formatted: {
                lapTime: this.engine.formatTime(lapTime),
                totalTime: this.engine.formatTime(currentTime)
            }
        };
        
        this.lapTimes.push(lapData);
        
        // Trigger lap callbacks
        this.lapCallbacks.forEach(callback => {
            try {
                callback(lapData);
            } catch (error) {
                console.error('Error in stopwatch lap callback:', error);
            }
        });
        
        return lapData;
    }

    /**
     * Get all lap times
     * @returns {Array} Array of lap time objects
     */
    getLapTimes() {
        return [...this.lapTimes];
    }

    /**
     * Get lap statistics
     * @returns {Object} Lap statistics
     */
    getLapStatistics() {
        if (this.lapTimes.length === 0) {
            return {
                count: 0,
                fastest: null,
                slowest: null,
                average: null,
                total: 0
            };
        }
        
        const lapDurations = this.lapTimes.map(lap => lap.lapTime);
        const fastest = Math.min(...lapDurations);
        const slowest = Math.max(...lapDurations);
        const average = lapDurations.reduce((sum, time) => sum + time, 0) / lapDurations.length;
        const total = this.lapTimes[this.lapTimes.length - 1].totalTime;
        
        return {
            count: this.lapTimes.length,
            fastest: {
                time: fastest,
                formatted: this.engine.formatTime(fastest),
                lapNumber: this.lapTimes.find(lap => lap.lapTime === fastest).lapNumber
            },
            slowest: {
                time: slowest,
                formatted: this.engine.formatTime(slowest),
                lapNumber: this.lapTimes.find(lap => lap.lapTime === slowest).lapNumber
            },
            average: {
                time: average,
                formatted: this.engine.formatTime(average)
            },
            total: {
                time: total,
                formatted: this.engine.formatTime(total)
            }
        };
    }

    /**
     * Get current elapsed time in various formats
     */
    getElapsedTime() {
        const state = this.engine.getState();
        const milliseconds = state.currentTime;
        
        return {
            milliseconds,
            seconds: Math.floor(milliseconds / 1000),
            minutes: Math.floor(milliseconds / (1000 * 60)),
            hours: Math.floor(milliseconds / (1000 * 60 * 60)),
            formatted: this.engine.formatTime(milliseconds),
            percentage: this.getProgressPercentage()
        };
    }

    /**
     * Get progress as percentage of maximum duration (0-100)
     */
    getProgressPercentage() {
        const state = this.engine.getState();
        return Math.min(100, (state.currentTime / TIMER_CONSTANTS.MAX_DURATION) * 100);
    }

    /**
     * Check if stopwatch is at a milestone duration
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
        
        // Check for milestones
        this.checkMilestones(currentTime);
    }

    /**
     * Check and trigger milestone callbacks
     */
    checkMilestones(currentTime) {
        for (const threshold of this.milestoneThresholds) {
            if (currentTime >= threshold && !this.milestonesReached.has(threshold)) {
                this.milestonesReached.add(threshold);
                
                const minutes = Math.floor(threshold / (1000 * 60));
                
                // Trigger milestone callbacks
                this.milestoneCallbacks.forEach(callback => {
                    try {
                        callback({
                            milestone: minutes,
                            elapsedTime: currentTime,
                            formatted: this.engine.formatTime(currentTime),
                            isLeBronMilestone: [6, 23].includes(minutes),
                            threshold
                        });
                    } catch (error) {
                        console.error('Error in stopwatch milestone callback:', error);
                    }
                });
                
                break; // Only trigger one milestone per tick
            }
        }
        
        // Check for LeBron-specific milestones
        if (this.isAtMilestone(currentTime)) {
            const minutes = Math.floor(currentTime / (1000 * 60));
            const milestoneKey = `lebron-${minutes}`;
            
            if (!this.milestonesReached.has(milestoneKey)) {
                this.milestonesReached.add(milestoneKey);
                
                this.milestoneCallbacks.forEach(callback => {
                    try {
                        callback({
                            milestone: minutes,
                            elapsedTime: currentTime,
                            formatted: this.engine.formatTime(currentTime),
                            isLeBronMilestone: true,
                            type: 'lebron-milestone'
                        });
                    } catch (error) {
                        console.error('Error in LeBron milestone callback:', error);
                    }
                });
            }
        }
    }

    /**
     * Handle reset events
     */
    onReset() {
        this.lapTimes = [];
        this.milestonesReached.clear();
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
     * Add lap callback
     * @param {Function} callback - Callback function
     */
    onLap(callback) {
        if (typeof callback === 'function') {
            this.lapCallbacks.push(callback);
        }
    }

    /**
     * Remove callback
     * @param {string} type - Callback type ('milestone', 'lap')
     * @param {Function} callback - Callback function to remove
     */
    removeCallback(type, callback) {
        let callbackArray;
        
        switch (type) {
            case 'milestone':
                callbackArray = this.milestoneCallbacks;
                break;
            case 'lap':
                callbackArray = this.lapCallbacks;
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
            elapsedTime: this.getElapsedTime(),
            lapTimes: this.getLapTimes(),
            lapStatistics: this.getLapStatistics(),
            milestonesReached: Array.from(this.milestonesReached),
            isAtMilestone: this.isAtMilestone(this.engine.getState().currentTime)
        };
    }

    /**
     * Export lap times to various formats
     * @param {string} format - Export format ('json', 'csv', 'text')
     * @returns {string} Formatted lap times
     */
    exportLapTimes(format = 'json') {
        const lapTimes = this.getLapTimes();
        const statistics = this.getLapStatistics();
        
        switch (format.toLowerCase()) {
            case 'json':
                return JSON.stringify({
                    lapTimes,
                    statistics,
                    exportedAt: new Date().toISOString()
                }, null, 2);
                
            case 'csv':
                let csv = 'Lap Number,Lap Time,Total Time,Timestamp\n';
                lapTimes.forEach(lap => {
                    csv += `${lap.lapNumber},${lap.formatted.lapTime},${lap.formatted.totalTime},${lap.timestamp.toISOString()}\n`;
                });
                return csv;
                
            case 'text':
                let text = 'Lakers Timer - Stopwatch Lap Times\n';
                text += '=====================================\n\n';
                
                lapTimes.forEach(lap => {
                    text += `Lap ${lap.lapNumber}: ${lap.formatted.lapTime} (Total: ${lap.formatted.totalTime})\n`;
                });
                
                if (statistics.count > 0) {
                    text += '\nStatistics:\n';
                    text += `-----------\n`;
                    text += `Total Laps: ${statistics.count}\n`;
                    text += `Fastest Lap: ${statistics.fastest.formatted} (Lap ${statistics.fastest.lapNumber})\n`;
                    text += `Slowest Lap: ${statistics.slowest.formatted} (Lap ${statistics.slowest.lapNumber})\n`;
                    text += `Average Lap: ${statistics.average.formatted}\n`;
                    text += `Total Time: ${statistics.total.formatted}\n`;
                }
                
                return text;
                
            default:
                throw new Error('Invalid export format. Use "json", "csv", or "text"');
        }
    }

    /**
     * Clear all lap times
     */
    clearLapTimes() {
        this.lapTimes = [];
    }

    /**
     * Get split time (time since last lap)
     * @returns {Object} Split time information
     */
    getSplitTime() {
        const state = this.engine.getState();
        const currentTime = state.currentTime;
        
        if (this.lapTimes.length === 0) {
            return {
                splitTime: currentTime,
                formatted: this.engine.formatTime(currentTime),
                sinceStart: true
            };
        }
        
        const lastLapTime = this.lapTimes[this.lapTimes.length - 1].totalTime;
        const splitTime = currentTime - lastLapTime;
        
        return {
            splitTime,
            formatted: this.engine.formatTime(splitTime),
            sinceStart: false,
            lastLapNumber: this.lapTimes.length
        };
    }

    /**
     * Clean up resources
     */
    destroy() {
        this.engine.removeEventListener('tick', this.onTick);
        this.engine.removeEventListener('reset', this.onReset);
        
        this.milestoneCallbacks = [];
        this.lapCallbacks = [];
        this.lapTimes = [];
        this.milestonesReached.clear();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Stopwatch;
}