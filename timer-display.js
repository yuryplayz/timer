// Lakers Timer App - Timer Display Component
// Large, prominent time display with Lakers styling and animations

class TimerDisplay {
    constructor(containerElement, options = {}) {
        this.container = containerElement;
        this.options = {
            showProgress: true,
            showMilliseconds: false,
            animateChanges: true,
            lakersTheme: true,
            ...options
        };
        
        // Display elements
        this.timeElement = null;
        this.progressRing = null;
        this.progressBar = null;
        this.backgroundRing = null;
        
        // Animation state
        this.currentDisplayTime = 0;
        this.targetDisplayTime = 0;
        this.animationFrameId = null;
        this.isAnimating = false;
        
        // Progress ring properties
        this.progressRadius = 140;
        this.progressCircumference = 2 * Math.PI * this.progressRadius;
        
        // Initialize display
        this.init();
        
        // Bind methods
        this.updateDisplay = this.updateDisplay.bind(this);
        this.animateToTarget = this.animateToTarget.bind(this);
    }

    /**
     * Initialize the timer display
     */
    init() {
        this.createDisplayElements();
        this.setupProgressRing();
        this.applyLakersTheme();
        this.updateDisplay(0, 0, 'countdown');
    }

    /**
     * Create the display elements
     */
    createDisplayElements() {
        // Clear existing content
        this.container.innerHTML = '';
        
        // Create main container
        const displayContainer = document.createElement('div');
        displayContainer.className = 'timer-display-container';
        
        // Create time container with progress ring
        const timeContainer = document.createElement('div');
        timeContainer.className = 'time-container';
        
        // Create SVG progress ring
        if (this.options.showProgress) {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('class', 'progress-svg');
            svg.setAttribute('width', '300');
            svg.setAttribute('height', '300');
            svg.setAttribute('viewBox', '0 0 300 300');
            
            // Background circle
            this.backgroundRing = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            this.backgroundRing.setAttribute('class', 'progress-background');
            this.backgroundRing.setAttribute('cx', '150');
            this.backgroundRing.setAttribute('cy', '150');
            this.backgroundRing.setAttribute('r', this.progressRadius.toString());
            
            // Progress circle
            this.progressBar = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            this.progressBar.setAttribute('class', 'progress-bar');
            this.progressBar.setAttribute('cx', '150');
            this.progressBar.setAttribute('cy', '150');
            this.progressBar.setAttribute('r', this.progressRadius.toString());
            this.progressBar.setAttribute('stroke-dasharray', this.progressCircumference.toString());
            this.progressBar.setAttribute('stroke-dashoffset', this.progressCircumference.toString());
            
            svg.appendChild(this.backgroundRing);
            svg.appendChild(this.progressBar);
            timeContainer.appendChild(svg);
            
            this.progressRing = svg;
        }
        
        // Create time display element
        this.timeElement = document.createElement('div');
        this.timeElement.className = 'time-display';
        this.timeElement.setAttribute('id', 'timeDisplay');
        this.timeElement.setAttribute('aria-live', 'polite');
        this.timeElement.setAttribute('aria-label', 'Timer display');
        this.timeElement.textContent = '00:00';
        
        timeContainer.appendChild(this.timeElement);
        displayContainer.appendChild(timeContainer);
        this.container.appendChild(displayContainer);
    }

    /**
     * Set up progress ring properties
     */
    setupProgressRing() {
        if (!this.progressBar) return;
        
        // Set initial progress ring state
        this.progressBar.style.strokeDasharray = this.progressCircumference;
        this.progressBar.style.strokeDashoffset = this.progressCircumference;
        this.progressBar.style.transition = 'stroke-dashoffset 0.3s ease';
    }

    /**
     * Apply Lakers theme styling
     */
    applyLakersTheme() {
        if (!this.options.lakersTheme) return;
        
        // Add Lakers theme class to container
        this.container.classList.add('lakers-theme');
        
        // Apply Lakers colors to progress ring
        if (this.backgroundRing) {
            this.backgroundRing.style.stroke = '#3D1A5B'; // Purple dark
            this.backgroundRing.style.strokeWidth = '8';
            this.backgroundRing.style.fill = 'none';
        }
        
        if (this.progressBar) {
            this.progressBar.style.stroke = '#FDB927'; // Lakers gold
            this.progressBar.style.strokeWidth = '8';
            this.progressBar.style.strokeLinecap = 'round';
            this.progressBar.style.fill = 'none';
            this.progressBar.style.filter = 'drop-shadow(0 0 10px rgba(253, 185, 39, 0.5))';
        }
        
        // Apply Lakers styling to time display
        if (this.timeElement) {
            this.timeElement.style.fontFamily = 'Oswald, sans-serif';
            this.timeElement.style.fontSize = '3.5rem';
            this.timeElement.style.fontWeight = '700';
            this.timeElement.style.color = '#FDB927';
            this.timeElement.style.textShadow = '2px 2px 8px rgba(0, 0, 0, 0.5)';
            this.timeElement.style.letterSpacing = '2px';
        }
    }

    /**
     * Update the timer display
     * @param {number} currentTime - Current time in milliseconds
     * @param {number} targetTime - Target time for countdown (optional)
     * @param {string} mode - Timer mode ('countdown' or 'stopwatch')
     */
    updateDisplay(currentTime, targetTime = 0, mode = 'countdown') {
        // Update time display
        this.updateTimeDisplay(currentTime);
        
        // Update progress ring
        if (this.options.showProgress) {
            this.updateProgressRing(currentTime, targetTime, mode);
        }
        
        // Update accessibility
        this.updateAccessibility(currentTime, mode);
        
        // Trigger animations if enabled
        if (this.options.animateChanges) {
            this.triggerChangeAnimation();
        }
    }

    /**
     * Update the time display text
     * @param {number} milliseconds - Time in milliseconds
     */
    updateTimeDisplay(milliseconds) {
        if (!this.timeElement) return;
        
        const formatted = this.formatTime(milliseconds);
        
        if (this.options.animateChanges && this.timeElement.textContent !== formatted) {
            this.animateTimeChange(formatted);
        } else {
            this.timeElement.textContent = formatted;
        }
    }

    /**
     * Format time for display
     * @param {number} milliseconds - Time in milliseconds
     * @returns {string} Formatted time string
     */
    formatTime(milliseconds) {
        if (typeof milliseconds !== 'number' || milliseconds < 0) {
            return '00:00';
        }

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
     * Update progress ring
     * @param {number} currentTime - Current time in milliseconds
     * @param {number} targetTime - Target time in milliseconds
     * @param {string} mode - Timer mode
     */
    updateProgressRing(currentTime, targetTime, mode) {
        if (!this.progressBar) return;
        
        let progress = 0;
        
        if (mode === 'countdown' && targetTime > 0) {
            // For countdown: progress from 0 to 1 as time decreases
            progress = Math.max(0, Math.min(1, (targetTime - currentTime) / targetTime));
        } else if (mode === 'stopwatch') {
            // For stopwatch: progress based on elapsed time (up to 1 hour for visual purposes)
            const maxDisplayTime = 60 * 60 * 1000; // 1 hour
            progress = Math.min(1, currentTime / maxDisplayTime);
        }
        
        // Calculate stroke-dashoffset
        const offset = this.progressCircumference * (1 - progress);
        this.progressBar.style.strokeDashoffset = offset.toString();
        
        // Add visual effects based on progress
        this.updateProgressEffects(progress, mode);
    }

    /**
     * Update progress ring visual effects
     * @param {number} progress - Progress value (0-1)
     * @param {string} mode - Timer mode
     */
    updateProgressEffects(progress, mode) {
        if (!this.progressBar) return;
        
        if (mode === 'countdown') {
            // Change color based on remaining time
            if (progress > 0.8) {
                // Less than 20% remaining - red warning
                this.progressBar.style.stroke = '#FF4444';
                this.progressBar.style.filter = 'drop-shadow(0 0 15px rgba(255, 68, 68, 0.7))';
            } else if (progress > 0.6) {
                // Less than 40% remaining - orange warning
                this.progressBar.style.stroke = '#FF8800';
                this.progressBar.style.filter = 'drop-shadow(0 0 12px rgba(255, 136, 0, 0.6))';
            } else {
                // Normal state - Lakers gold
                this.progressBar.style.stroke = '#FDB927';
                this.progressBar.style.filter = 'drop-shadow(0 0 10px rgba(253, 185, 39, 0.5))';
            }
        } else {
            // Stopwatch mode - always Lakers gold
            this.progressBar.style.stroke = '#FDB927';
            this.progressBar.style.filter = 'drop-shadow(0 0 10px rgba(253, 185, 39, 0.5))';
        }
    }

    /**
     * Animate time change
     * @param {string} newTime - New time string
     */
    animateTimeChange(newTime) {
        if (!this.timeElement) return;
        
        // Add change animation class
        this.timeElement.classList.add('time-changing');
        
        // Update text after brief delay
        setTimeout(() => {
            this.timeElement.textContent = newTime;
            this.timeElement.classList.remove('time-changing');
        }, 150);
    }

    /**
     * Trigger change animation
     */
    triggerChangeAnimation() {
        if (!this.timeElement) return;
        
        // Add pulse effect for significant changes
        this.timeElement.classList.add('pulse');
        
        setTimeout(() => {
            this.timeElement.classList.remove('pulse');
        }, 300);
    }

    /**
     * Update accessibility attributes
     * @param {number} currentTime - Current time in milliseconds
     * @param {string} mode - Timer mode
     */
    updateAccessibility(currentTime, mode) {
        if (!this.timeElement) return;
        
        const formatted = this.formatTime(currentTime);
        const accessibleTime = this.formatTimeForAccessibility(currentTime);
        
        this.timeElement.setAttribute('aria-label', 
            `${mode === 'countdown' ? 'Countdown' : 'Stopwatch'} timer: ${accessibleTime}`);
        
        // Update title for tooltip
        this.timeElement.setAttribute('title', 
            `${mode === 'countdown' ? 'Time remaining' : 'Elapsed time'}: ${formatted}`);
    }

    /**
     * Format time for accessibility (screen readers)
     * @param {number} milliseconds - Time in milliseconds
     * @returns {string} Accessibility-friendly time description
     */
    formatTimeForAccessibility(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
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
     * Set display mode
     * @param {string} mode - Display mode ('countdown' or 'stopwatch')
     */
    setMode(mode) {
        if (this.container) {
            this.container.setAttribute('data-mode', mode);
            
            // Update visual styling based on mode
            if (mode === 'countdown') {
                this.container.classList.add('countdown-mode');
                this.container.classList.remove('stopwatch-mode');
            } else {
                this.container.classList.add('stopwatch-mode');
                this.container.classList.remove('countdown-mode');
            }
        }
    }

    /**
     * Show completion animation
     */
    showCompletionAnimation() {
        if (!this.timeElement) return;
        
        // Add completion animation classes
        this.timeElement.classList.add('completion-animation');
        this.container.classList.add('timer-completed');
        
        // Add pulsing effect to progress ring
        if (this.progressRing) {
            this.progressRing.classList.add('completion-pulse');
        }
        
        // Remove animation after duration
        setTimeout(() => {
            this.timeElement.classList.remove('completion-animation');
            this.container.classList.remove('timer-completed');
            if (this.progressRing) {
                this.progressRing.classList.remove('completion-pulse');
            }
        }, 2000);
    }

    /**
     * Show warning animation for low time
     */
    showWarningAnimation() {
        if (!this.timeElement) return;
        
        this.timeElement.classList.add('warning-flash');
        
        setTimeout(() => {
            this.timeElement.classList.remove('warning-flash');
        }, 500);
    }

    /**
     * Update display size for responsive design
     * @param {string} size - Size ('small', 'medium', 'large')
     */
    updateSize(size) {
        if (!this.container) return;
        
        // Remove existing size classes
        this.container.classList.remove('size-small', 'size-medium', 'size-large');
        
        // Add new size class
        this.container.classList.add(`size-${size}`);
        
        // Update font size based on size
        if (this.timeElement) {
            const fontSizes = {
                small: '2.5rem',
                medium: '3.5rem',
                large: '4.5rem'
            };
            
            this.timeElement.style.fontSize = fontSizes[size] || fontSizes.medium;
        }
        
        // Update SVG size
        if (this.progressRing) {
            const sizes = {
                small: { width: 200, height: 200, radius: 90 },
                medium: { width: 300, height: 300, radius: 140 },
                large: { width: 400, height: 400, radius: 190 }
            };
            
            const sizeConfig = sizes[size] || sizes.medium;
            
            this.progressRing.setAttribute('width', sizeConfig.width.toString());
            this.progressRing.setAttribute('height', sizeConfig.height.toString());
            this.progressRing.setAttribute('viewBox', `0 0 ${sizeConfig.width} ${sizeConfig.height}`);
            
            // Update circle positions and radius
            const center = sizeConfig.width / 2;
            this.backgroundRing.setAttribute('cx', center.toString());
            this.backgroundRing.setAttribute('cy', center.toString());
            this.backgroundRing.setAttribute('r', sizeConfig.radius.toString());
            
            this.progressBar.setAttribute('cx', center.toString());
            this.progressBar.setAttribute('cy', center.toString());
            this.progressBar.setAttribute('r', sizeConfig.radius.toString());
            
            // Update circumference
            this.progressRadius = sizeConfig.radius;
            this.progressCircumference = 2 * Math.PI * this.progressRadius;
            this.progressBar.setAttribute('stroke-dasharray', this.progressCircumference.toString());
        }
    }

    /**
     * Get current display state
     * @returns {Object} Current display state
     */
    getState() {
        return {
            currentTime: this.currentDisplayTime,
            isVisible: this.container && this.container.style.display !== 'none',
            mode: this.container ? this.container.getAttribute('data-mode') : null,
            hasProgress: !!this.progressRing
        };
    }

    /**
     * Destroy the display and clean up resources
     */
    destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        
        if (this.container) {
            this.container.innerHTML = '';
        }
        
        this.timeElement = null;
        this.progressRing = null;
        this.progressBar = null;
        this.backgroundRing = null;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TimerDisplay;
}