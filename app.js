// Lakers Timer App - Main Application
// Integrates all components and manages the complete timer experience

class LakersTimerApp {
    constructor() {
        // Core components
        this.timerEngine = null;
        this.countdownTimer = null;
        this.stopwatch = null;
        this.timerDisplay = null;
        this.uiController = null;
        this.lakersTheme = null;
        this.lebronContent = null;
        this.notificationSystem = null;
        
        // State
        this.currentMode = 'countdown';
        this.isInitialized = false;
        this.isRunning = false;
        
        // Settings
        this.settings = {
            lebronModeEnabled: false,
            volume: 50,
            soundTheme: 'classic',
            effectsLevel: 'full'
        };
        
        this.init();
    }

    /**
     * Initialize the Lakers Timer App
     */
    async init() {
        try {
            console.log('🏀 Initializing Lakers Timer App...');
            
            // Initialize core components
            await this.initializeComponents();
            
            // Wire components together
            this.wireComponents();
            
            // Load user settings
            this.loadSettings();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Initialize responsive design
            this.initializeResponsiveDesign();
            
            // Mark as initialized
            this.isInitialized = true;
            
            console.log('👑 Lakers Timer App initialized successfully!');
            
            // Show welcome message
            this.showWelcomeMessage();
            
            // Update initial display
            const input = this.uiController.getCurrentInput();
            const initialTime = (input.minutes * 60 + input.seconds) * 1000;
            this.timerDisplay.updateDisplay(initialTime, initialTime, 'countdown');
            
        } catch (error) {
            console.error('Error initializing Lakers Timer App:', error);
            this.showErrorMessage('Failed to initialize the app. Please refresh the page.');
        }
    }

    /**
     * Initialize all core components
     */
    async initializeComponents() {
        // Initialize timer engine
        this.timerEngine = new TimerEngine();
        
        // Initialize specialized timers
        this.countdownTimer = new CountdownTimer(this.timerEngine);
        this.stopwatch = new Stopwatch(this.timerEngine);
        
        // Initialize display - use existing HTML elements instead of recreating
        this.timerDisplay = {
            timeElement: document.getElementById('timeDisplay'),
            progressBar: document.querySelector('.progress-bar'),
            container: document.querySelector('.timer-display'),
            progressCircumference: 2 * Math.PI * 140,
            
            updateDisplay: function(currentTime, targetTime, mode) {
                // Update time text
                if (this.timeElement) {
                    this.timeElement.textContent = this.formatTime(currentTime);
                }
                
                // Update progress ring
                if (this.progressBar && mode === 'countdown' && targetTime > 0) {
                    const progress = Math.max(0, Math.min(1, (targetTime - currentTime) / targetTime));
                    const offset = this.progressCircumference * (1 - progress);
                    this.progressBar.style.strokeDashoffset = offset;
                    
                    // Color changes based on progress
                    if (progress > 0.8) {
                        this.progressBar.style.stroke = '#FF4444';
                    } else if (progress > 0.6) {
                        this.progressBar.style.stroke = '#FF8800';
                    } else {
                        this.progressBar.style.stroke = '#FDB927';
                    }
                } else if (this.progressBar && mode === 'stopwatch') {
                    const maxTime = 60 * 60 * 1000;
                    const progress = Math.min(1, currentTime / maxTime);
                    const offset = this.progressCircumference * (1 - progress);
                    this.progressBar.style.strokeDashoffset = offset;
                    this.progressBar.style.stroke = '#FDB927';
                }
            },
            
            formatTime: function(milliseconds) {
                if (typeof milliseconds !== 'number' || milliseconds < 0) return '00:00';
                const totalSeconds = Math.floor(milliseconds / 1000);
                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;
                if (hours > 0) {
                    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                }
                return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            },
            
            setMode: function(mode) {
                if (this.container) {
                    this.container.setAttribute('data-mode', mode);
                }
            },
            
            showCompletionAnimation: function() {
                if (this.timeElement) {
                    this.timeElement.classList.add('pulse');
                    setTimeout(() => this.timeElement.classList.remove('pulse'), 2000);
                }
            },
            
            showWarningAnimation: function() {
                if (this.timeElement) {
                    this.timeElement.classList.add('shake');
                    setTimeout(() => this.timeElement.classList.remove('shake'), 500);
                }
            },
            
            updateSize: function(size) {
                // Size handled by CSS
            },
            
            destroy: function() {}
        };
        
        // Initialize UI controller
        this.uiController = new UIController();
        
        // Initialize Lakers theme
        this.lakersTheme = new LakersTheme();
        
        // Initialize LeBron content
        this.lebronContent = new LeBronContent();
        
        // Initialize notification system
        this.notificationSystem = new NotificationSystem();
        
        // Make components globally available for cross-component communication
        window.lakersTheme = this.lakersTheme;
        window.lebronContent = this.lebronContent;
        window.notificationSystem = this.notificationSystem;
    }

    /**
     * Wire all components together
     */
    wireComponents() {
        // Timer engine events
        this.timerEngine.addEventListener('tick', (data) => {
            this.onTimerTick(data);
        });
        
        this.timerEngine.addEventListener('complete', (data) => {
            this.onTimerComplete(data);
        });
        
        this.timerEngine.addEventListener('start', (data) => {
            this.onTimerStart(data);
        });
        
        this.timerEngine.addEventListener('pause', (data) => {
            this.onTimerPause(data);
        });
        
        this.timerEngine.addEventListener('reset', (data) => {
            this.onTimerReset(data);
        });
        
        // UI controller events
        this.uiController.on('startTimer', (data) => {
            this.startTimer(data);
        });
        
        this.uiController.on('pauseTimer', () => {
            this.pauseTimer();
        });
        
        this.uiController.on('resetTimer', () => {
            this.resetTimer();
        });
        
        this.uiController.on('modeChanged', (data) => {
            this.switchMode(data.mode);
        });
        
        this.uiController.on('lebronModeChanged', (data) => {
            this.toggleLeBronMode(data.enabled);
        });
        
        this.uiController.on('volumeChanged', (data) => {
            this.updateVolume(data.volume);
        });
        
        this.uiController.on('soundThemeChanged', (data) => {
            this.updateSoundTheme(data.theme);
        });
        
        // Countdown timer events
        this.countdownTimer.onCompletion((data) => {
            this.onCountdownComplete(data);
        });
        
        this.countdownTimer.onWarning((data) => {
            this.onCountdownWarning(data);
        });
        
        this.countdownTimer.onMilestone((data) => {
            this.onMilestone(data);
        });
        
        // Stopwatch events
        this.stopwatch.onMilestone((data) => {
            this.onMilestone(data);
        });
        
        // LeBron content events
        document.addEventListener('lebronMilestoneReached', (e) => {
            this.onLeBronMilestone(e.detail);
        });
    }

    /**
     * Setup global event listeners
     */
    setupEventListeners() {
        // Window events
        window.addEventListener('beforeunload', () => {
            this.saveSettings();
        });
        
        window.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
        
        // Keyboard shortcuts (global)
        document.addEventListener('keydown', (e) => {
            this.handleGlobalKeyboard(e);
        });
    }

    /**
     * Initialize responsive design
     */
    initializeResponsiveDesign() {
        if (this.uiController) {
            this.uiController.initResponsive();
        }
        
        // Update timer display size based on screen
        this.updateDisplaySize();
        
        window.addEventListener('resize', () => {
            this.updateDisplaySize();
        });
    }

    /**
     * Update display size based on screen dimensions
     */
    updateDisplaySize() {
        if (!this.timerDisplay) return;
        
        const width = window.innerWidth;
        let size = 'medium';
        
        if (width < 480) {
            size = 'small';
        } else if (width >= 1024) {
            size = 'large';
        }
        
        this.timerDisplay.updateSize(size);
    }

    /**
     * Start timer based on current mode
     * @param {Object} data - Start timer data
     */
    startTimer(data) {
        const { mode } = data;
        
        try {
            if (mode === 'countdown') {
                const input = this.uiController.getCurrentInput();
                this.countdownTimer.setDuration(input.minutes, input.seconds);
                this.countdownTimer.start();
            } else if (mode === 'stopwatch') {
                this.stopwatch.start();
            }
            
            this.isRunning = true;
            this.updateUIState();
            
        } catch (error) {
            console.error('Error starting timer:', error);
            this.uiController.showError(error.message);
        }
    }

    /**
     * Pause current timer
     */
    pauseTimer() {
        if (this.currentMode === 'countdown') {
            this.countdownTimer.pause();
        } else {
            this.stopwatch.pause();
        }
        
        this.updateUIState();
    }

    /**
     * Reset current timer
     */
    resetTimer() {
        if (this.currentMode === 'countdown') {
            this.countdownTimer.reset();
        } else {
            this.stopwatch.reset();
        }
        
        this.isRunning = false;
        this.updateUIState();
    }

    /**
     * Switch timer mode
     * @param {string} mode - New timer mode
     */
    switchMode(mode) {
        if (mode === this.currentMode) return;
        
        // Stop current timer if running
        if (this.isRunning) {
            this.resetTimer();
        }
        
        this.currentMode = mode;
        this.timerEngine.setMode(mode);
        
        // Update display mode
        if (this.timerDisplay) {
            this.timerDisplay.setMode(mode);
        }
        
        this.updateUIState();
    }

    /**
     * Toggle LeBron Mode
     * @param {boolean} enabled - Whether to enable LeBron Mode
     */
    toggleLeBronMode(enabled) {
        this.settings.lebronModeEnabled = enabled;
        
        if (enabled) {
            this.lebronContent.enable();
        } else {
            this.lebronContent.disable();
        }
        
        this.saveSettings();
    }

    /**
     * Update volume setting
     * @param {number} volume - Volume level (0-100)
     */
    updateVolume(volume) {
        this.settings.volume = volume;
        this.notificationSystem.setVolume(volume);
        this.saveSettings();
    }

    /**
     * Update sound theme
     * @param {string} theme - Sound theme name
     */
    updateSoundTheme(theme) {
        this.settings.soundTheme = theme;
        this.notificationSystem.setSoundTheme(theme);
        this.saveSettings();
    }

    /**
     * Handle timer tick events
     * @param {Object} data - Timer tick data
     */
    onTimerTick(data) {
        // Update display
        if (this.timerDisplay) {
            const targetTime = this.currentMode === 'countdown' ? 
                this.timerEngine.getState().targetTime : 0;
            
            this.timerDisplay.updateDisplay(
                data.currentTime, 
                targetTime, 
                data.mode
            );
        }
        
        // Emit custom event for other components
        const event = new CustomEvent('timerTick', { detail: data });
        document.dispatchEvent(event);
    }

    /**
     * Handle timer completion
     * @param {Object} data - Completion data
     */
    onTimerComplete(data) {
        this.isRunning = false;
        this.updateUIState();
        
        // Show completion animation
        if (this.timerDisplay) {
            this.timerDisplay.showCompletionAnimation();
        }
        
        // Notify completion
        this.notificationSystem.notifyCompletion({
            mode: data.mode,
            duration: data.finalTime,
            lebronMode: this.settings.lebronModeEnabled
        });
    }

    /**
     * Handle countdown-specific completion
     * @param {Object} data - Countdown completion data
     */
    onCountdownComplete(data) {
        console.log('🏆 Countdown completed!', data);
    }

    /**
     * Handle countdown warnings
     * @param {Object} data - Warning data
     */
    onCountdownWarning(data) {
        this.notificationSystem.notifyWarning(data);
        
        // Show warning animation on display
        if (this.timerDisplay) {
            this.timerDisplay.showWarningAnimation();
        }
    }

    /**
     * Handle milestone events
     * @param {Object} data - Milestone data
     */
    onMilestone(data) {
        this.notificationSystem.notifyMilestone(data);
        
        console.log('⭐ Milestone reached:', data);
    }

    /**
     * Handle LeBron-specific milestones
     * @param {Object} data - LeBron milestone data
     */
    onLeBronMilestone(data) {
        if (this.settings.lebronModeEnabled) {
            console.log('👑 LeBron milestone reached:', data);
            
            // Trigger special celebration for LeBron milestones
            if (this.lakersTheme) {
                this.lakersTheme.triggerChampionshipCelebration();
            }
        }
    }

    /**
     * Handle timer start events
     * @param {Object} data - Start data
     */
    onTimerStart(data) {
        this.isRunning = true;
        this.updateUIState();
        console.log('▶️ Timer started:', data);
    }

    /**
     * Handle timer pause events
     * @param {Object} data - Pause data
     */
    onTimerPause(data) {
        this.isRunning = false;
        this.updateUIState();
        console.log('⏸️ Timer paused:', data);
    }

    /**
     * Handle timer reset events
     * @param {Object} data - Reset data
     */
    onTimerReset(data) {
        this.isRunning = false;
        this.updateUIState();
        console.log('⏹️ Timer reset:', data);
    }

    /**
     * Update UI state based on timer state
     */
    updateUIState() {
        const timerState = this.timerEngine.getState();
        
        // Update control buttons
        if (this.uiController) {
            this.uiController.updateControlButtons(timerState);
        }
    }

    /**
     * Handle visibility change (tab switching)
     */
    handleVisibilityChange() {
        if (document.hidden) {
            // App is now hidden
            console.log('App hidden');
        } else {
            // App is now visible
            console.log('App visible');
            
            // Update display when returning to tab
            if (this.isRunning && this.timerDisplay) {
                const state = this.timerEngine.getState();
                const targetTime = this.currentMode === 'countdown' ? state.targetTime : 0;
                this.timerDisplay.updateDisplay(state.currentTime, targetTime, state.mode);
            }
        }
    }

    /**
     * Handle global keyboard shortcuts
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleGlobalKeyboard(e) {
        // Only handle if not typing in inputs
        if (e.target.tagName === 'INPUT') return;
        
        // Additional global shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
                case 't':
                    e.preventDefault();
                    this.notificationSystem.test('completion');
                    break;
            }
        }
    }

    /**
     * Show welcome message
     */
    showWelcomeMessage() {
        setTimeout(() => {
            if (this.notificationSystem) {
                this.notificationSystem.showVisualNotification({
                    title: "Welcome to Lakers Timer! 🏀",
                    message: "Ready to time like a champion? Let's go Lakers! 💜💛",
                    icon: "👑",
                    duration: 3000,
                    type: 'welcome'
                });
            }
        }, 1000);
    }

    /**
     * Show error message
     * @param {string} message - Error message
     */
    showErrorMessage(message) {
        if (this.notificationSystem) {
            this.notificationSystem.showVisualNotification({
                title: "Error",
                message: message,
                icon: "⚠️",
                duration: 5000,
                type: 'error'
            });
        } else {
            alert(message);
        }
    }

    /**
     * Load user settings from localStorage
     */
    loadSettings() {
        try {
            const saved = localStorage.getItem('lakersTimerSettings');
            if (saved) {
                const settings = JSON.parse(saved);
                this.settings = { ...this.settings, ...settings };
                
                // Apply loaded settings
                this.applySettings();
            }
        } catch (error) {
            console.warn('Error loading settings:', error);
        }
    }

    /**
     * Save user settings to localStorage
     */
    saveSettings() {
        try {
            localStorage.setItem('lakersTimerSettings', JSON.stringify(this.settings));
        } catch (error) {
            console.warn('Error saving settings:', error);
        }
    }

    /**
     * Apply current settings to components
     */
    applySettings() {
        // Apply LeBron Mode
        if (this.settings.lebronModeEnabled) {
            this.lebronContent.enable();
            if (this.uiController.elements.lebronModeToggle) {
                this.uiController.elements.lebronModeToggle.checked = true;
            }
        }
        
        // Apply volume
        this.notificationSystem.setVolume(this.settings.volume);
        if (this.uiController.elements.volumeSlider) {
            this.uiController.elements.volumeSlider.value = this.settings.volume;
        }
        
        // Apply sound theme
        this.notificationSystem.setSoundTheme(this.settings.soundTheme);
        if (this.uiController.elements.soundSelect) {
            this.uiController.elements.soundSelect.value = this.settings.soundTheme;
        }
        
        // Apply effects level
        if (this.lakersTheme) {
            this.lakersTheme.setEffectsLevel(this.settings.effectsLevel);
        }
    }

    /**
     * Get current app state
     * @returns {Object} Current app state
     */
    getState() {
        return {
            isInitialized: this.isInitialized,
            isRunning: this.isRunning,
            currentMode: this.currentMode,
            settings: { ...this.settings },
            timerState: this.timerEngine ? this.timerEngine.getState() : null,
            uiState: this.uiController ? this.uiController.getState() : null,
            lebronState: this.lebronContent ? this.lebronContent.getState() : null,
            themeState: this.lakersTheme ? this.lakersTheme.getState() : null
        };
    }

    /**
     * Destroy app and clean up all resources
     */
    destroy() {
        console.log('🏀 Destroying Lakers Timer App...');
        
        // Save settings before destroying
        this.saveSettings();
        
        // Destroy all components
        if (this.timerEngine) this.timerEngine.destroy();
        if (this.countdownTimer) this.countdownTimer.destroy();
        if (this.stopwatch) this.stopwatch.destroy();
        if (this.timerDisplay) this.timerDisplay.destroy();
        if (this.uiController) this.uiController.destroy();
        if (this.lakersTheme) this.lakersTheme.destroy();
        if (this.lebronContent) this.lebronContent.destroy();
        if (this.notificationSystem) this.notificationSystem.destroy();
        
        // Clear global references
        window.lakersTheme = null;
        window.lebronContent = null;
        window.notificationSystem = null;
        
        // Remove event listeners
        window.removeEventListener('beforeunload', this.saveSettings);
        window.removeEventListener('visibilitychange', this.handleVisibilityChange);
        
        this.isInitialized = false;
        
        console.log('👑 Lakers Timer App destroyed');
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🏀 DOM loaded, initializing Lakers Timer App...');
    
    // Create global app instance
    window.lakersTimerApp = new LakersTimerApp();
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.lakersTimerApp) {
        window.lakersTimerApp.destroy();
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LakersTimerApp;
}