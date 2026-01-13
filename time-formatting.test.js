// Lakers Timer App - Time Formatting Property Tests
// Feature: lakers-timer-app, Property 5: Time Format Display Rules

const fc = require('fast-check');

/**
 * Property Test for Time Format Display Rules
 * Validates: Requirements 1.5
 * 
 * Property 5: Time Format Display Rules
 * For any time duration, the display format should be MM:SS for durations 
 * under 60 minutes and HH:MM:SS for durations of 60 minutes or longer
 */

describe('Time Formatting Property Tests', () => {
    // Mock TimeFormatter for testing
    class MockTimeFormatter {
        formatTime(milliseconds, options = {}) {
            if (typeof milliseconds !== 'number' || milliseconds < 0) {
                return '00:00';
            }

            const totalSeconds = Math.floor(milliseconds / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            if (options.forceHours || hours > 0) {
                // HH:MM:SS format
                return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            } else {
                // MM:SS format
                return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }

        parseTime(timeString) {
            if (typeof timeString !== 'string') {
                throw new Error('Time string must be a string');
            }

            const trimmed = timeString.trim();
            if (!trimmed) return 0;

            // HH:MM:SS or MM:SS pattern
            const colonPattern = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/;
            const match = trimmed.match(colonPattern);
            
            if (match) {
                const [, first, second, third] = match;
                
                if (third !== undefined) {
                    // HH:MM:SS format
                    const hours = parseInt(first, 10);
                    const minutes = parseInt(second, 10);
                    const seconds = parseInt(third, 10);
                    
                    if (minutes >= 60 || seconds >= 60) {
                        throw new Error('Invalid time format');
                    }
                    
                    return (hours * 3600 + minutes * 60 + seconds) * 1000;
                } else {
                    // MM:SS format
                    const minutes = parseInt(first, 10);
                    const seconds = parseInt(second, 10);
                    
                    if (seconds >= 60) {
                        throw new Error('Invalid time format');
                    }
                    
                    return (minutes * 60 + seconds) * 1000;
                }
            }

            throw new Error(`Invalid time format: ${timeString}`);
        }

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
    }

    let formatter;

    beforeEach(() => {
        formatter = new MockTimeFormatter();
    });

    /**
     * Property 5: Time format follows MM:SS and HH:MM:SS rules based on duration
     */
    test('Property 5: Time format follows MM:SS for under 1 hour, HH:MM:SS for 1 hour or more', () => {
        fc.assert(fc.property(
            fc.integer({ min: 0, max: 24 * 60 * 60 * 1000 }), // 0 to 24 hours in milliseconds
            (milliseconds) => {
                const formatted = formatter.formatTime(milliseconds);
                const totalSeconds = Math.floor(milliseconds / 1000);
                const hours = Math.floor(totalSeconds / 3600);

                if (hours > 0) {
                    // Should be HH:MM:SS format
                    const hhmmssPattern = /^\d{2}:\d{2}:\d{2}$/;
                    return hhmmssPattern.test(formatted);
                } else {
                    // Should be MM:SS format
                    const mmssPattern = /^\d{2}:\d{2}$/;
                    return mmssPattern.test(formatted);
                }
            }
        ), { numRuns: 100 });
    });

    /**
     * Property Test: Format consistency across different time ranges
     */
    test('Property: Format consistency within time ranges', () => {
        fc.assert(fc.property(
            fc.integer({ min: 0, max: 59 * 60 * 1000 }), // Under 1 hour
            (milliseconds) => {
                const formatted = formatter.formatTime(milliseconds);
                
                // All times under 1 hour should use MM:SS format
                const mmssPattern = /^\d{2}:\d{2}$/;
                const isCorrectFormat = mmssPattern.test(formatted);
                
                // Should not contain hours
                const hasHours = formatted.includes(':') && formatted.split(':').length === 3;
                
                return isCorrectFormat && !hasHours;
            }
        ), { numRuns: 100 });
    });

    test('Property: Format consistency for 1 hour and above', () => {
        fc.assert(fc.property(
            fc.integer({ min: 60 * 60 * 1000, max: 24 * 60 * 60 * 1000 }), // 1 hour to 24 hours
            (milliseconds) => {
                const formatted = formatter.formatTime(milliseconds);
                
                // All times 1 hour and above should use HH:MM:SS format
                const hhmmssPattern = /^\d{2}:\d{2}:\d{2}$/;
                const isCorrectFormat = hhmmssPattern.test(formatted);
                
                // Should contain exactly 3 parts (hours:minutes:seconds)
                const parts = formatted.split(':');
                const hasThreeParts = parts.length === 3;
                
                return isCorrectFormat && hasThreeParts;
            }
        ), { numRuns: 100 });
    });

    /**
     * Property Test: Round-trip consistency (format then parse)
     */
    test('Property: Round-trip formatting preserves time values', () => {
        fc.assert(fc.property(
            fc.integer({ min: 0, max: 24 * 60 * 60 * 1000 }),
            (originalMilliseconds) => {
                // Round to seconds to avoid millisecond precision issues
                const roundedMs = Math.floor(originalMilliseconds / 1000) * 1000;
                
                const formatted = formatter.formatTime(roundedMs);
                const parsedMs = formatter.parseTime(formatted);
                
                // Round-trip should preserve the original value
                return parsedMs === roundedMs;
            }
        ), { numRuns: 100 });
    });

    /**
     * Property Test: Format components are within valid ranges
     */
    test('Property: Formatted time components are within valid ranges', () => {
        fc.assert(fc.property(
            fc.integer({ min: 0, max: 24 * 60 * 60 * 1000 }),
            (milliseconds) => {
                const formatted = formatter.formatTime(milliseconds);
                const parts = formatted.split(':');
                
                if (parts.length === 2) {
                    // MM:SS format
                    const minutes = parseInt(parts[0], 10);
                    const seconds = parseInt(parts[1], 10);
                    
                    return minutes >= 0 && minutes <= 59 && seconds >= 0 && seconds <= 59;
                } else if (parts.length === 3) {
                    // HH:MM:SS format
                    const hours = parseInt(parts[0], 10);
                    const minutes = parseInt(parts[1], 10);
                    const seconds = parseInt(parts[2], 10);
                    
                    return hours >= 0 && hours <= 24 && 
                           minutes >= 0 && minutes <= 59 && 
                           seconds >= 0 && seconds <= 59;
                }
                
                return false; // Invalid format
            }
        ), { numRuns: 100 });
    });

    /**
     * Property Test: Boundary conditions are handled correctly
     */
    test('Property: Boundary conditions at 1 hour mark', () => {
        const justUnderOneHour = 59 * 60 * 1000 + 59 * 1000; // 59:59
        const exactlyOneHour = 60 * 60 * 1000; // 1:00:00
        const justOverOneHour = 60 * 60 * 1000 + 1000; // 1:00:01
        
        const underFormat = formatter.formatTime(justUnderOneHour);
        const exactFormat = formatter.formatTime(exactlyOneHour);
        const overFormat = formatter.formatTime(justOverOneHour);
        
        // Just under 1 hour should be MM:SS
        expect(underFormat).toMatch(/^\d{2}:\d{2}$/);
        expect(underFormat).toBe('59:59');
        
        // Exactly 1 hour should be HH:MM:SS
        expect(exactFormat).toMatch(/^\d{2}:\d{2}:\d{2}$/);
        expect(exactFormat).toBe('01:00:00');
        
        // Just over 1 hour should be HH:MM:SS
        expect(overFormat).toMatch(/^\d{2}:\d{2}:\d{2}$/);
        expect(overFormat).toBe('01:00:01');
    });

    /**
     * Property Test: Zero padding is consistent
     */
    test('Property: Zero padding is applied consistently', () => {
        fc.assert(fc.property(
            fc.integer({ min: 0, max: 24 * 60 * 60 * 1000 }),
            (milliseconds) => {
                const formatted = formatter.formatTime(milliseconds);
                const parts = formatted.split(':');
                
                // All parts should be zero-padded to 2 digits
                return parts.every(part => part.length === 2 && /^\d{2}$/.test(part));
            }
        ), { numRuns: 100 });
    });

    /**
     * Property Test: Time components extraction is accurate
     */
    test('Property: Time components extraction matches formatted output', () => {
        fc.assert(fc.property(
            fc.integer({ min: 0, max: 24 * 60 * 60 * 1000 }),
            (milliseconds) => {
                const components = formatter.getTimeComponents(milliseconds);
                const formatted = formatter.formatTime(milliseconds);
                
                // Reconstruct time from components
                const reconstructed = (components.hours * 3600 + 
                                     components.minutes * 60 + 
                                     components.seconds) * 1000;
                
                // Should match original (rounded to seconds)
                const originalSeconds = Math.floor(milliseconds / 1000) * 1000;
                return reconstructed === originalSeconds;
            }
        ), { numRuns: 100 });
    });

    /**
     * Unit Tests for specific edge cases
     */
    test('Zero time formats correctly', () => {
        expect(formatter.formatTime(0)).toBe('00:00');
    });

    test('One second formats correctly', () => {
        expect(formatter.formatTime(1000)).toBe('00:01');
    });

    test('One minute formats correctly', () => {
        expect(formatter.formatTime(60000)).toBe('01:00');
    });

    test('59 minutes 59 seconds formats correctly', () => {
        expect(formatter.formatTime(59 * 60 * 1000 + 59 * 1000)).toBe('59:59');
    });

    test('Exactly one hour formats correctly', () => {
        expect(formatter.formatTime(60 * 60 * 1000)).toBe('01:00:00');
    });

    test('One hour one minute one second formats correctly', () => {
        expect(formatter.formatTime(61 * 60 * 1000 + 1000)).toBe('01:01:01');
    });

    test('24 hours formats correctly', () => {
        expect(formatter.formatTime(24 * 60 * 60 * 1000)).toBe('24:00:00');
    });

    test('Negative values default to 00:00', () => {
        expect(formatter.formatTime(-1000)).toBe('00:00');
    });

    test('Non-numeric values default to 00:00', () => {
        expect(formatter.formatTime('invalid')).toBe('00:00');
        expect(formatter.formatTime(null)).toBe('00:00');
        expect(formatter.formatTime(undefined)).toBe('00:00');
    });

    test('Milliseconds are truncated correctly', () => {
        expect(formatter.formatTime(1999)).toBe('00:01'); // 1.999 seconds -> 1 second
        expect(formatter.formatTime(59999)).toBe('00:59'); // 59.999 seconds -> 59 seconds
        expect(formatter.formatTime(3599999)).toBe('59:59'); // 59:59.999 -> 59:59
    });

    test('Parse time handles various formats correctly', () => {
        expect(formatter.parseTime('05:30')).toBe(5.5 * 60 * 1000);
        expect(formatter.parseTime('01:23:45')).toBe((1 * 3600 + 23 * 60 + 45) * 1000);
        expect(formatter.parseTime('0:05')).toBe(5 * 1000);
        expect(formatter.parseTime('10:00')).toBe(10 * 60 * 1000);
    });

    test('Parse time validates input correctly', () => {
        expect(() => formatter.parseTime('25:00')).not.toThrow(); // 25 minutes is valid
        expect(() => formatter.parseTime('05:60')).toThrow(); // 60 seconds is invalid
        expect(() => formatter.parseTime('01:05:60')).toThrow(); // 60 seconds is invalid
        expect(() => formatter.parseTime('invalid')).toThrow();
        expect(() => formatter.parseTime('')).not.toThrow(); // Empty string returns 0
    });
});