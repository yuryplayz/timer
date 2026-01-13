// Test setup for Lakers Timer App
// This file is run before each test suite

// Mock Web APIs that might not be available in test environment
global.requestAnimationFrame = global.requestAnimationFrame || function(cb) {
    return setTimeout(cb, 16);
};

global.cancelAnimationFrame = global.cancelAnimationFrame || function(id) {
    clearTimeout(id);
};

// Mock Audio API
global.Audio = global.Audio || class {
    constructor() {
        this.volume = 1;
        this.currentTime = 0;
        this.duration = 0;
        this.paused = true;
        this.ended = false;
    }
    
    play() {
        this.paused = false;
        return Promise.resolve();
    }
    
    pause() {
        this.paused = true;
    }
    
    load() {}
    
    addEventListener() {}
    removeEventListener() {}
};

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock Notification API
global.Notification = global.Notification || class {
    constructor(title, options) {
        this.title = title;
        this.options = options;
    }
    
    static requestPermission() {
        return Promise.resolve('granted');
    }
};

// Mock performance.now for high-precision timing
global.performance = global.performance || {
    now: () => Date.now()
};

// Helper function to create DOM elements for testing
global.createMockElement = function(tag, attributes = {}) {
    const element = document.createElement(tag);
    Object.keys(attributes).forEach(key => {
        if (key === 'textContent') {
            element.textContent = attributes[key];
        } else {
            element.setAttribute(key, attributes[key]);
        }
    });
    return element;
};

// Helper to simulate timer progression
global.simulateTimerTick = function(timerEngine, milliseconds) {
    const originalNow = performance.now;
    let currentTime = originalNow();
    
    performance.now = () => currentTime;
    
    // Advance time
    currentTime += milliseconds;
    
    // Trigger timer update
    if (timerEngine && typeof timerEngine.update === 'function') {
        timerEngine.update();
    }
    
    // Restore original function
    performance.now = originalNow;
};

// Lakers color validation helper
global.isLakersColor = function(color) {
    const lakersColors = ['#552583', '#FDB927', '#000000', '#FFFFFF'];
    return lakersColors.some(lakersColor => 
        color.toLowerCase().includes(lakersColor.toLowerCase())
    );
};

// Console setup for cleaner test output
const originalConsoleError = console.error;
console.error = (...args) => {
    // Suppress specific warnings that are expected in tests
    if (args[0] && typeof args[0] === 'string') {
        if (args[0].includes('Warning: ReactDOM.render is deprecated')) {
            return;
        }
        if (args[0].includes('Not implemented: HTMLMediaElement.prototype.load')) {
            return;
        }
    }
    originalConsoleError.apply(console, args);
};