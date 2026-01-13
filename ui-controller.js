// Lakers Timer App - UI Controller
// Manages all user interface interactions and controls

class UIController {
    constructor() {
        // DOM elements
        this.elements = {
            // Mode controls
            modeButtons: document.querySelectorAll('.mode-btn'),
            
            // Timer display
            timeDisplay: document.getElementById('timeDisplay'),
            progressBar: document.querySelector('.progress-bar'),
            
            // Input controls
            minutesInput: document.getElementById('minutes'),
            secondsInput: document.getElementById('seconds'),
            inputSection: document.getElementById('inputSection'),
            
            // Preset buttons
            presetButtons: document.querySelectorAll('.preset-btn'),
            
            // Control buttons
            startBtn: document.getElementById('startBtn'),
            pauseBtn: document.getElementById('pauseBtn'),
            resetBtn: document.getElementById('resetBtn'),
            
            // LeBron Mode
            lebronModeToggle: document.getElementById('lebronMode'),
            lebronContent: document.getElementById('lebronContent'),
            
            // Notifications
            notificationOverlay: document.getElementById('notificationOverlay'),
            notificationClose: document.getElementById('notificationClose'),
            notificationQuote: document.getElementById('notificationQuote'),
            
            // Settings
            volumeSlider: document.getElementById('volumeSlider'),
            volumeValue: document.getElementById('volumeValue'),
            soundSelect: document.getElementById('soundSelect')
        };
        
        // State
        this.currentMode = 'countdown';
        this.isLeBronModeEnabled = false;
        this.currentPreset = null;
        
        // Initialize
        this.init();
        this.bindEvents();
    }

    /**
     * Initialize UI controller
     */
    init() {
        this.updateModeDisplay();
        this.updateInputVisibility();
        this.updateControlButtons();
        this.setupPresetButtons();
        this.updateLeBronMode();
    }

    /**
     * Bind all event listeners
     */
    bindEvents() {
        // Mode switching
        this.elements.modeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.target.dataset.mode;
                this.switchMode(mode);
            });
        });

        // Input controls
        if (this.elements.minutesInput) {
            this.elements.minutesInput.addEventListener('input', () => this.validateInput());
            this.elements.minutesInput.addEventListener('change', () => this.onInputChange());
        }
        
        if (this.elements.secondsInput) {
            this.elements.secondsInput.addEventListener('input', () => this.validateInput());
            this.elements.secondsInput.addEventListener('change', () => this.onInputChange());
        }

        // Preset buttons
        this.elements.presetButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const minutes = parseInt(e.target.dataset.minutes);
                this.setPreset(minutes);
            });
        });

        // Control buttons
        if (this.elements.startBtn) {
            this.elements.startBtn.addEventListener('click', () => this.onStartClick());
        }
        
        if (this.elements.pauseBtn) {
            this.elements.pauseBtn.addEventListener('click', () => this.onPauseClick());
        }
        
        if (this.elements.resetBtn) {
            this.elements.resetBtn.addEventListener('click', () => this.onResetClick());
        }

        // LeBron Mode toggle
        if (this.elements.lebronModeToggle) {
            this.elements.lebronModeToggle.addEventListener('change', (e) => {
                this.toggleLeBronMode(e.target.checked);
            });
        }

        // Notification close
        if (this.elements.notificationClose) {
            this.elements.notificationClose.addEventListener('click', () => {
                this.hideNotification();
            });
        }

        // Settings
        if (this.elements.volumeSlider) {
            this.elements.volumeSlider.addEventListener('input', (e) => {
                this.updateVolume(e.target.value);
            });
        }

        if (this.elements.soundSelect) {
            this.elements.soundSelect.addEventListener('change', (e) => {
                this.updateSoundTheme(e.target.value);
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    /**
     * Switch timer mode
     * @param {string} mode - Timer mode ('countdown' or 'stopwatch')
     */
    switchMode(mode) {
        if (mode === this.currentMode) return;
        
        this.currentMode = mode;
        this.updateModeDisplay();
        this.updateInputVisibility();
        this.updateControlButtons();
        
        // Emit mode change event
        this.emit('modeChanged', { mode });
    }

    /**
     * Update mode display
     */
    updateModeDisplay() {
        this.elements.modeButtons.forEach(btn => {
            if (btn.dataset.mode === this.currentMode) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    /**
     * Update input visibility based on mode
     */
    updateInputVisibility() {
        if (this.elements.inputSection) {
            if (this.currentMode === 'countdown') {
                this.elements.inputSection.style.display = 'flex';
            } else {
                this.elements.inputSection.style.display = 'none';
            }
        }
    }

    /**
     * Set preset timer duration
     * @param {number} minutes - Duration in minutes
     */
    setPreset(minutes) {
        if (this.currentMode !== 'countdown') return;
        
        this.currentPreset = minutes;
        
        // Update input fields
        if (this.elements.minutesInput) {
            this.elements.minutesInput.value = minutes;
        }
        if (this.elements.secondsInput) {
            this.elements.secondsInput.value = 0;
        }
        
        // Update preset button styling
        this.updatePresetButtons(minutes);
        
        // Emit preset change event
        this.emit('presetSelected', { minutes, seconds: 0 });
    }

    /**
     * Setup preset buttons with Lakers theming
     */
    setupPresetButtons() {
        this.elements.presetButtons.forEach(btn => {
            const minutes = parseInt(btn.dataset.minutes);
            
            // Add special styling for LeBron presets
            if (minutes === 6 || minutes === 23) {
                btn.classList.add('lebron-preset');
                if (minutes === 23) {
                    btn.innerHTML = '23 min <span class="crown">👑</span>';
                }
            }
            
            // Ensure touch-friendly sizing
            btn.style.minHeight = '44px';
            btn.style.minWidth = '60px';
        });
    }

    /**
     * Update preset button styling
     * @param {number} selectedMinutes - Currently selected preset
     */
    updatePresetButtons(selectedMinutes) {
        this.elements.presetButtons.forEach(btn => {
            const minutes = parseInt(btn.dataset.minutes);
            if (minutes === selectedMinutes) {
                btn.classList.add('selected');
            } else {
                btn.classList.remove('selected');
            }
        });
    }

    /**
     * Validate input fields
     */
    validateInput() {
        const minutes = parseInt(this.elements.minutesInput?.value || 0);
        const seconds = parseInt(this.elements.secondsInput?.value || 0);
        
        // Validate ranges
        if (this.elements.minutesInput) {
            if (minutes < 0) this.elements.minutesInput.value = 0;
            if (minutes > 1440) this.elements.minutesInput.value = 1440; // 24 hours max
        }
        
        if (this.elements.secondsInput) {
            if (seconds < 0) this.elements.secondsInput.value = 0;
            if (seconds >= 60) this.elements.secondsInput.value = 59;
        }
        
        // Clear preset selection if manual input
        this.currentPreset = null;
        this.updatePresetButtons(-1);
    }

    /**
     * Handle input change
     */
    onInputChange() {
        const minutes = parseInt(this.elements.minutesInput?.value || 0);
        const seconds = parseInt(this.elements.secondsInput?.value || 0);
        
        this.emit('inputChanged', { minutes, seconds });
    }

    /**
     * Get current input values
     * @returns {Object} Current minutes and seconds
     */
    getCurrentInput() {
        return {
            minutes: parseInt(this.elements.minutesInput?.value || 0),
            seconds: parseInt(this.elements.secondsInput?.value || 0)
        };
    }

    /**
     * Handle start button click
     */
    onStartClick() {
        if (this.currentMode === 'countdown') {
            const { minutes, seconds } = this.getCurrentInput();
            if (minutes === 0 && seconds === 0) {
                this.showError('Please set a duration greater than zero');
                return;
            }
        }
        
        this.emit('startTimer', { mode: this.currentMode });
    }

    /**
     * Handle pause button click
     */
    onPauseClick() {
        this.emit('pauseTimer');
    }

    /**
     * Handle reset button click
     */
    onResetClick() {
        this.emit('resetTimer');
    }

    /**
     * Update control button states
     * @param {Object} timerState - Current timer state
     */
    updateControlButtons(timerState = {}) {
        const { isRunning = false, isPaused = false } = timerState;
        
        if (this.elements.startBtn) {
            this.elements.startBtn.disabled = isRunning && !isPaused;
            this.elements.startBtn.querySelector('.btn-text').textContent = 
                isPaused ? 'Resume' : 'Start';
        }
        
        if (this.elements.pauseBtn) {
            this.elements.pauseBtn.disabled = !isRunning || isPaused;
        }
        
        if (this.elements.resetBtn) {
            this.elements.resetBtn.disabled = false; // Always enabled
        }
    }

    /**
     * Toggle LeBron Mode
     * @param {boolean} enabled - Whether to enable LeBron Mode
     */
    toggleLeBronMode(enabled) {
        this.isLeBronModeEnabled = enabled;
        this.updateLeBronMode();
        this.emit('lebronModeChanged', { enabled });
    }

    /**
     * Update LeBron Mode display
     */
    updateLeBronMode() {
        if (this.elements.lebronContent) {
            if (this.isLeBronModeEnabled) {
                this.elements.lebronContent.classList.add('active');
            } else {
                this.elements.lebronContent.classList.remove('active');
            }
        }
        
        // Update preset buttons for LeBron Mode
        if (this.isLeBronModeEnabled) {
            this.addLeBronPresets();
        } else {
            this.removeLeBronPresets();
        }
    }

    /**
     * Add LeBron-specific presets
     */
    addLeBronPresets() {
        // Highlight LeBron presets
        this.elements.presetButtons.forEach(btn => {
            const minutes = parseInt(btn.dataset.minutes);
            if (minutes === 6 || minutes === 23) {
                btn.classList.add('lebron-active');
            }
        });
    }

    /**
     * Remove LeBron-specific preset highlighting
     */
    removeLeBronPresets() {
        this.elements.presetButtons.forEach(btn => {
            btn.classList.remove('lebron-active');
        });
    }

    /**
     * Show notification overlay
     * @param {Object} options - Notification options
     */
    showNotification(options = {}) {
        const {
            title = "Time's Up!",
            quote = "Great job! 🏆",
            icon = "🏆"
        } = options;
        
        if (this.elements.notificationOverlay) {
            // Update content
            const titleElement = this.elements.notificationOverlay.querySelector('.notification-title');
            if (titleElement) titleElement.textContent = title;
            
            const iconElement = this.elements.notificationOverlay.querySelector('.notification-icon');
            if (iconElement) iconElement.textContent = icon;
            
            if (this.elements.notificationQuote) {
                this.elements.notificationQuote.textContent = quote;
            }
            
            // Show overlay
            this.elements.notificationOverlay.classList.add('active');
            
            // Focus on close button for accessibility
            if (this.elements.notificationClose) {
                this.elements.notificationClose.focus();
            }
        }
    }

    /**
     * Hide notification overlay
     */
    hideNotification() {
        if (this.elements.notificationOverlay) {
            this.elements.notificationOverlay.classList.remove('active');
        }
    }

    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        // Simple error display - could be enhanced with toast notifications
        alert(message);
    }

    /**
     * Update volume display
     * @param {number} volume - Volume level (0-100)
     */
    updateVolume(volume) {
        if (this.elements.volumeValue) {
            this.elements.volumeValue.textContent = `${volume}%`;
        }
        
        this.emit('volumeChanged', { volume: parseInt(volume) });
    }

    /**
     * Update sound theme
     * @param {string} theme - Sound theme
     */
    updateSoundTheme(theme) {
        this.emit('soundThemeChanged', { theme });
    }

    /**
     * Handle keyboard shortcuts
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleKeyboard(e) {
        // Ignore if user is typing in input fields
        if (e.target.tagName === 'INPUT') return;
        
        switch (e.key.toLowerCase()) {
            case ' ':
            case 'enter':
                e.preventDefault();
                if (this.elements.startBtn && !this.elements.startBtn.disabled) {
                    this.onStartClick();
                } else if (this.elements.pauseBtn && !this.elements.pauseBtn.disabled) {
                    this.onPauseClick();
                }
                break;
                
            case 'r':
                e.preventDefault();
                this.onResetClick();
                break;
                
            case 'c':
                e.preventDefault();
                this.switchMode('countdown');
                break;
                
            case 's':
                e.preventDefault();
                this.switchMode('stopwatch');
                break;
                
            case 'l':
                e.preventDefault();
                if (this.elements.lebronModeToggle) {
                    this.elements.lebronModeToggle.checked = !this.elements.lebronModeToggle.checked;
                    this.toggleLeBronMode(this.elements.lebronModeToggle.checked);
                }
                break;
                
            case 'escape':
                this.hideNotification();
                break;
        }
    }

    /**
     * Update responsive design
     */
    updateResponsiveDesign() {
        const width = window.innerWidth;
        
        if (width < 480) {
            document.body.classList.add('mobile-small');
            document.body.classList.remove('mobile-large', 'tablet', 'desktop');
        } else if (width < 768) {
            document.body.classList.add('mobile-large');
            document.body.classList.remove('mobile-small', 'tablet', 'desktop');
        } else if (width < 1024) {
            document.body.classList.add('tablet');
            document.body.classList.remove('mobile-small', 'mobile-large', 'desktop');
        } else {
            document.body.classList.add('desktop');
            document.body.classList.remove('mobile-small', 'mobile-large', 'tablet');
        }
    }

    /**
     * Event emitter functionality
     */
    emit(eventName, data) {
        const event = new CustomEvent(eventName, { detail: data });
        document.dispatchEvent(event);
    }

    /**
     * Add event listener
     * @param {string} eventName - Event name
     * @param {Function} callback - Callback function
     */
    on(eventName, callback) {
        document.addEventListener(eventName, (e) => callback(e.detail));
    }

    /**
     * Get current UI state
     * @returns {Object} Current UI state
     */
    getState() {
        return {
            currentMode: this.currentMode,
            isLeBronModeEnabled: this.isLeBronModeEnabled,
            currentPreset: this.currentPreset,
            currentInput: this.getCurrentInput()
        };
    }

    /**
     * Initialize responsive design
     */
    initResponsive() {
        this.updateResponsiveDesign();
        window.addEventListener('resize', () => this.updateResponsiveDesign());
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.updateResponsiveDesign(), 100);
        });
    }

    /**
     * Destroy UI controller and clean up
     */
    destroy() {
        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeyboard);
        window.removeEventListener('resize', this.updateResponsiveDesign);
        window.removeEventListener('orientationchange', this.updateResponsiveDesign);
        
        // Clear references
        this.elements = {};
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIController;
}