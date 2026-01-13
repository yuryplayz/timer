// Lakers Timer App - Timer Edge Cases Unit Tests
// Tests for zero duration, maximum duration, rapid state changes

describe('Timer Edge Cases Unit Tests', () => {
    let timerEngine;
    let countdownTimer;
    let stopwatch;

    // Mock classes for testing
    class MockTimerEngine {
        constructor() {
            this.state = {
                mode: 'countdown',
                isRunning: false,
                isPaused: false,
                currentTime: 0,
                targetTime: 0,
                startTime: 0
            };
            this.eventListeners = new Map();
        }

        addEventListener(event, callback) {
            if (!this.eventListeners.has(event)) {
                this.eventListeners.set(event, []);
            }
            this.eventListeners.get(event).push(callback);
        }

        emit(event, data = null) {
            if (this.eventListeners.has(event)) {
                this.eventListeners.get(event).forEach(callback => callback(data));
            }
        }

        setMode(mode) {
            this.state.mode = mode;
            this.reset();
        }

        setTargetTime(milliseconds) {
            this.state.targetTime = milliseconds;
            if (this.state.mode === 'countdown') {
                this.state.currentTime = milliseconds;
            }
        }

        start() {
            if (this.state.mode === 'countdown' && this.state.currentTime <= 0) {
                this.emit('error', { message: 'Cannot start countdown with zero time' });
                return;
            }
            this.state.isRunning = true;
            this.state.isPaused = false;
            this.emit('start');
        }

        pause() {
            if (!this.state.isRunning || this.state.isPaused) return;
            this.state.isPaused = true;
            this.state.isRunning = false;
            this.emit('pause');
        }

        resume() {
            if (!this.state.isPaused) return;
            this.state.isRunning = true;
            this.state.isPaused = false;
            this.emit('resume');
        }

        reset() {
            this.state.isRunning = false;
            this.state.isPaused = false;
            if (this.state.mode === 'countdown') {
                this.state.currentTime = this.state.targetTime || 0;
            } else {
                this.state.currentTime = 0;
            }
            this.emit('reset');
        }

        getState() {
            return { ...this.state };
        }

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
    }

    class MockCountdownTimer {
        constructor(engine) {
            this.engine = engine;
            this.warningsTriggered = new Set();
        }

        setDuration(minutes, seconds) {
            if (minutes < 0 || seconds < 0) {
                throw new Error('Duration cannot be negative');
            }
            if (minutes > 1440) {
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
            return totalMilliseconds;
        }

        start() {
            const state = this.engine.getState();
            if (state.currentTime <= 0) {
                throw new Error('Cannot start countdown with zero duration');
            }
            this.engine.start();
        }

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
    }

    class MockStopwatch {
        constructor(engine) {
            this.engine = engine;
            this.lapTimes = [];
        }

        recordLap() {
            const state = this.engine.getState();
            if (state.currentTime === 0) {
                throw new Error('Cannot record lap time when stopwatch is at zero');
            }
            
            const lapData = {
                lapNumber: this.lapTimes.length + 1,
                totalTime: state.currentTime,
                timestamp: new Date()
            };
            
            this.lapTimes.push(lapData);
            return lapData;
        }

        getLapTimes() {
            return [...this.lapTimes];
        }
    }

    beforeEach(() => {
        timerEngine = new MockTimerEngine();
        countdownTimer = new MockCountdownTimer(timerEngine);
        stopwatch = new MockStopwatch(timerEngine);
    });

    describe('Zero Duration Edge Cases', () => {
        test('Countdown timer rejects zero duration', () => {
            expect(() => {
                countdownTimer.setDuration(0, 0);
            }).toThrow('Duration must be greater than zero');
        });

        test('Countdown timer cannot start with zero duration', () => {
            timerEngine.setMode('countdown');
            timerEngine.setTargetTime(0);
            
            expect(() => {
                countdownTimer.start();
            }).toThrow('Cannot start countdown with zero duration');
        });

        test('Timer engine emits error when starting countdown with zero time', () => {
            const errorCallback = jest.fn();
            timerEngine.addEventListener('error', errorCallback);
            
            timerEngine.setMode('countdown');
            timerEngine.setTargetTime(0);
            timerEngine.start();
            
            expect(errorCallback).toHaveBeenCalledWith({
                message: 'Cannot start countdown with zero time'
            });
        });

        test('Stopwatch can start from zero', () => {
            timerEngine.setMode('stopwatch');
            timerEngine.start();
            
            const state = timerEngine.getState();
            expect(state.isRunning).toBe(true);
            expect(state.currentTime).toBe(0);
        });

        test('Cannot record lap time when stopwatch is at zero', () => {
            timerEngine.setMode('stopwatch');
            
            expect(() => {
                stopwatch.recordLap();
            }).toThrow('Cannot record lap time when stopwatch is at zero');
        });
    });

    describe('Maximum Duration Edge Cases', () => {
        const MAX_DURATION = 24 * 60 * 60 * 1000; // 24 hours

        test('Countdown timer rejects duration exceeding 24 hours', () => {
            expect(() => {
                countdownTimer.setDuration(1441, 0); // 24 hours and 1 minute
            }).toThrow('Duration cannot exceed 24 hours');
        });

        test('Countdown timer accepts exactly 24 hours', () => {
            expect(() => {
                countdownTimer.setDuration(1440, 0); // Exactly 24 hours
            }).not.toThrow();
        });

        test('Timer formatting handles maximum duration correctly', () => {
            const formatted = timerEngine.formatTime(MAX_DURATION);
            expect(formatted).toBe('24:00:00');
        });

        test('Timer formatting handles values just under 24 hours', () => {
            const almostMax = MAX_DURATION - 1000; // 23:59:59
            const formatted = timerEngine.formatTime(almostMax);
            expect(formatted).toBe('23:59:59');
        });
    });

    describe('Rapid State Changes', () => {
        test('Multiple rapid start calls are handled gracefully', () => {
            countdownTimer.setDuration(5, 0);
            
            // Multiple start calls should not cause issues
            countdownTimer.start();
            timerEngine.start(); // Direct call
            timerEngine.start(); // Another direct call
            
            const state = timerEngine.getState();
            expect(state.isRunning).toBe(true);
            expect(state.isPaused).toBe(false);
        });

        test('Pause when not running is handled gracefully', () => {
            timerEngine.pause(); // Pause when not running
            
            const state = timerEngine.getState();
            expect(state.isRunning).toBe(false);
            expect(state.isPaused).toBe(false);
        });

        test('Resume when not paused is handled gracefully', () => {
            timerEngine.resume(); // Resume when not paused
            
            const state = timerEngine.getState();
            expect(state.isRunning).toBe(false);
            expect(state.isPaused).toBe(false);
        });

        test('Rapid pause and resume cycles work correctly', () => {
            countdownTimer.setDuration(10, 0);
            countdownTimer.start();
            
            // Rapid pause/resume cycles
            timerEngine.pause();
            timerEngine.resume();
            timerEngine.pause();
            timerEngine.resume();
            
            const state = timerEngine.getState();
            expect(state.isRunning).toBe(true);
            expect(state.isPaused).toBe(false);
        });

        test('Mode switching during operation resets timer', () => {
            countdownTimer.setDuration(5, 0);
            countdownTimer.start();
            
            // Switch mode while running
            timerEngine.setMode('stopwatch');
            
            const state = timerEngine.getState();
            expect(state.mode).toBe('stopwatch');
            expect(state.isRunning).toBe(false);
            expect(state.currentTime).toBe(0);
        });
    });

    describe('Input Validation Edge Cases', () => {
        test('Negative duration values are rejected', () => {
            expect(() => {
                countdownTimer.setDuration(-1, 0);
            }).toThrow('Duration cannot be negative');
            
            expect(() => {
                countdownTimer.setDuration(0, -1);
            }).toThrow('Duration cannot be negative');
        });

        test('Seconds >= 60 are rejected', () => {
            expect(() => {
                countdownTimer.setDuration(5, 60);
            }).toThrow('Seconds must be less than 60');
            
            expect(() => {
                countdownTimer.setDuration(5, 120);
            }).toThrow('Seconds must be less than 60');
        });

        test('Non-numeric inputs are handled by validation', () => {
            const validation = MockCountdownTimer.validateDuration('abc', 'def');
            expect(validation.isValid).toBe(false);
            expect(validation.errors).toContain('Minutes and seconds must be numbers');
        });

        test('Validation returns correct results for valid inputs', () => {
            const validation = MockCountdownTimer.validateDuration(5, 30);
            expect(validation.isValid).toBe(true);
            expect(validation.errors).toHaveLength(0);
            expect(validation.totalMilliseconds).toBe(5.5 * 60 * 1000);
        });
    });

    describe('Time Formatting Edge Cases', () => {
        test('Zero time formats correctly', () => {
            expect(timerEngine.formatTime(0)).toBe('00:00');
        });

        test('One second formats correctly', () => {
            expect(timerEngine.formatTime(1000)).toBe('00:01');
        });

        test('One minute formats correctly', () => {
            expect(timerEngine.formatTime(60000)).toBe('01:00');
        });

        test('One hour formats correctly', () => {
            expect(timerEngine.formatTime(3600000)).toBe('01:00:00');
        });

        test('Complex time formats correctly', () => {
            const time = (2 * 3600 + 34 * 60 + 56) * 1000; // 2:34:56
            expect(timerEngine.formatTime(time)).toBe('02:34:56');
        });

        test('Milliseconds are truncated correctly', () => {
            expect(timerEngine.formatTime(1999)).toBe('00:01'); // 1.999 seconds -> 1 second
            expect(timerEngine.formatTime(59999)).toBe('00:59'); // 59.999 seconds -> 59 seconds
        });
    });

    describe('Event Handling Edge Cases', () => {
        test('Event listeners handle exceptions gracefully', () => {
            const faultyCallback = jest.fn(() => {
                throw new Error('Callback error');
            });
            const goodCallback = jest.fn();
            
            timerEngine.addEventListener('start', faultyCallback);
            timerEngine.addEventListener('start', goodCallback);
            
            // Should not throw despite faulty callback
            expect(() => {
                timerEngine.emit('start');
            }).not.toThrow();
            
            expect(faultyCallback).toHaveBeenCalled();
            expect(goodCallback).toHaveBeenCalled();
        });

        test('Multiple event listeners for same event work correctly', () => {
            const callback1 = jest.fn();
            const callback2 = jest.fn();
            const callback3 = jest.fn();
            
            timerEngine.addEventListener('reset', callback1);
            timerEngine.addEventListener('reset', callback2);
            timerEngine.addEventListener('reset', callback3);
            
            timerEngine.reset();
            
            expect(callback1).toHaveBeenCalled();
            expect(callback2).toHaveBeenCalled();
            expect(callback3).toHaveBeenCalled();
        });

        test('Events are emitted in correct order during state changes', () => {
            const events = [];
            
            timerEngine.addEventListener('start', () => events.push('start'));
            timerEngine.addEventListener('pause', () => events.push('pause'));
            timerEngine.addEventListener('resume', () => events.push('resume'));
            timerEngine.addEventListener('reset', () => events.push('reset'));
            
            countdownTimer.setDuration(5, 0);
            countdownTimer.start();
            timerEngine.pause();
            timerEngine.resume();
            timerEngine.reset();
            
            expect(events).toEqual(['reset', 'start', 'pause', 'resume', 'reset']);
        });
    });

    describe('Boundary Value Testing', () => {
        test('Timer handles boundary values correctly', () => {
            // Test 1 millisecond (minimum meaningful duration)
            const oneMs = timerEngine.formatTime(1);
            expect(oneMs).toBe('00:00');
            
            // Test 999 milliseconds (just under 1 second)
            const almostOneSecond = timerEngine.formatTime(999);
            expect(almostOneSecond).toBe('00:00');
            
            // Test exactly 1 second
            const oneSecond = timerEngine.formatTime(1000);
            expect(oneSecond).toBe('00:01');
            
            // Test 59 seconds (boundary before minutes)
            const fiftyNineSeconds = timerEngine.formatTime(59000);
            expect(fiftyNineSeconds).toBe('00:59');
            
            // Test exactly 1 minute
            const oneMinute = timerEngine.formatTime(60000);
            expect(oneMinute).toBe('01:00');
            
            // Test 59 minutes 59 seconds (boundary before hours)
            const almostOneHour = timerEngine.formatTime(3599000);
            expect(almostOneHour).toBe('59:59');
            
            // Test exactly 1 hour
            const oneHour = timerEngine.formatTime(3600000);
            expect(oneHour).toBe('01:00:00');
        });
    });
});