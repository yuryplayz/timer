// Lakers Timer App - Notification System
// Audio and visual notifications with Lakers theming

class NotificationSystem {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.volume = 0.5; // 0-1 range
        this.isAudioEnabled = true;
        this.isVisualEnabled = true;
        this.isBrowserNotificationsEnabled = false;
        this.currentSoundTheme = 'classic';
        
        // Sound themes
        this.soundThemes = {
            classic: {
                name: 'Classic Buzzer',
                completion: this.generateBuzzerSound.bind(this),
                warning: this.generateBeepSound.bind(this),
                milestone: this.generateChimeSound.bind(this)
            },
            arena: {
                name: 'Arena Horn',
                completion: this.generateHornSound.bind(this),
                warning: this.generateWhistleSound.bind(this),
                milestone: this.generateFanfareSound.bind(this)
            },
            championship: {
                name: 'Championship Cheer',
                completion: this.generateCelebrationSound.bind(this),
                warning: this.generateDrumSound.bind(this),
                milestone: this.generateTrumpetSound.bind(this)
            }
        };
        
        this.init();
    }

    /**
     * Initialize notification system
     */
    async init() {
        await this.initializeAudioContext();
        this.generateSounds();
        this.requestNotificationPermission();
        this.setupVisualNotifications();
    }

    /**
     * Initialize Web Audio API context
     */
    async initializeAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Resume context if suspended (required by some browsers)
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
        } catch (error) {
            console.warn('Web Audio API not supported:', error);
            this.audioContext = null;
        }
    }

    /**
     * Generate all sound effects
     */
    generateSounds() {
        if (!this.audioContext) return;
        
        Object.keys(this.soundThemes).forEach(theme => {
            this.sounds[theme] = {
                completion: this.soundThemes[theme].completion(),
                warning: this.soundThemes[theme].warning(),
                milestone: this.soundThemes[theme].milestone()
            };
        });
    }

    /**
     * Generate buzzer sound (classic completion)
     */
    generateBuzzerSound() {
        if (!this.audioContext) return null;
        
        const duration = 1.0;
        const buffer = this.audioContext.createBuffer(1, duration * this.audioContext.sampleRate, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / this.audioContext.sampleRate;
            // Create buzzer sound with frequency modulation
            const frequency = 800 + Math.sin(t * 20) * 200;
            data[i] = Math.sin(2 * Math.PI * frequency * t) * Math.exp(-t * 2) * 0.3;
        }
        
        return buffer;
    }

    /**
     * Generate beep sound (warning)
     */
    generateBeepSound() {
        if (!this.audioContext) return null;
        
        const duration = 0.2;
        const buffer = this.audioContext.createBuffer(1, duration * this.audioContext.sampleRate, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / this.audioContext.sampleRate;
            data[i] = Math.sin(2 * Math.PI * 1000 * t) * Math.exp(-t * 10) * 0.2;
        }
        
        return buffer;
    }

    /**
     * Generate chime sound (milestone)
     */
    generateChimeSound() {
        if (!this.audioContext) return null;
        
        const duration = 1.5;
        const buffer = this.audioContext.createBuffer(1, duration * this.audioContext.sampleRate, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        const frequencies = [523.25, 659.25, 783.99]; // C, E, G chord
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / this.audioContext.sampleRate;
            let sample = 0;
            
            frequencies.forEach((freq, index) => {
                const delay = index * 0.2;
                if (t >= delay) {
                    sample += Math.sin(2 * Math.PI * freq * (t - delay)) * Math.exp(-(t - delay) * 2) * 0.1;
                }
            });
            
            data[i] = sample;
        }
        
        return buffer;
    }

    /**
     * Generate horn sound (arena completion)
     */
    generateHornSound() {
        if (!this.audioContext) return null;
        
        const duration = 2.0;
        const buffer = this.audioContext.createBuffer(1, duration * this.audioContext.sampleRate, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / this.audioContext.sampleRate;
            // Create horn sound with harmonics
            const fundamental = 220;
            let sample = 0;
            
            for (let harmonic = 1; harmonic <= 5; harmonic++) {
                const amplitude = 1 / harmonic;
                sample += Math.sin(2 * Math.PI * fundamental * harmonic * t) * amplitude;
            }
            
            data[i] = sample * Math.exp(-t * 0.5) * 0.2;
        }
        
        return buffer;
    }

    /**
     * Generate whistle sound (arena warning)
     */
    generateWhistleSound() {
        if (!this.audioContext) return null;
        
        const duration = 0.5;
        const buffer = this.audioContext.createBuffer(1, duration * this.audioContext.sampleRate, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / this.audioContext.sampleRate;
            const frequency = 2000 + Math.sin(t * 30) * 500;
            data[i] = Math.sin(2 * Math.PI * frequency * t) * Math.exp(-t * 5) * 0.3;
        }
        
        return buffer;
    }

    /**
     * Generate fanfare sound (arena milestone)
     */
    generateFanfareSound() {
        if (!this.audioContext) return null;
        
        const duration = 2.0;
        const buffer = this.audioContext.createBuffer(1, duration * this.audioContext.sampleRate, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        const melody = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, C
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / this.audioContext.sampleRate;
            const noteIndex = Math.floor(t * 4) % melody.length;
            const frequency = melody[noteIndex];
            
            data[i] = Math.sin(2 * Math.PI * frequency * t) * Math.exp(-t * 1) * 0.2;
        }
        
        return buffer;
    }

    /**
     * Generate celebration sound (championship completion)
     */
    generateCelebrationSound() {
        if (!this.audioContext) return null;
        
        const duration = 3.0;
        const buffer = this.audioContext.createBuffer(1, duration * this.audioContext.sampleRate, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / this.audioContext.sampleRate;
            
            // Create celebration sound with multiple frequencies
            let sample = 0;
            const frequencies = [440, 554.37, 659.25, 880]; // A, C#, E, A
            
            frequencies.forEach((freq, index) => {
                const phase = (t + index * 0.1) * freq * 2 * Math.PI;
                sample += Math.sin(phase) * Math.exp(-t * 0.3) * 0.1;
            });
            
            // Add some noise for crowd effect
            sample += (Math.random() - 0.5) * 0.05 * Math.exp(-t * 1);
            
            data[i] = sample;
        }
        
        return buffer;
    }

    /**
     * Generate drum sound (championship warning)
     */
    generateDrumSound() {
        if (!this.audioContext) return null;
        
        const duration = 0.3;
        const buffer = this.audioContext.createBuffer(1, duration * this.audioContext.sampleRate, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / this.audioContext.sampleRate;
            
            // Create drum sound with low frequency and noise
            const lowFreq = Math.sin(2 * Math.PI * 60 * t) * Math.exp(-t * 20);
            const noise = (Math.random() - 0.5) * Math.exp(-t * 10);
            
            data[i] = (lowFreq + noise * 0.5) * 0.4;
        }
        
        return buffer;
    }

    /**
     * Generate trumpet sound (championship milestone)
     */
    generateTrumpetSound() {
        if (!this.audioContext) return null;
        
        const duration = 1.5;
        const buffer = this.audioContext.createBuffer(1, duration * this.audioContext.sampleRate, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / this.audioContext.sampleRate;
            const frequency = 523.25; // C note
            
            // Create trumpet sound with harmonics
            let sample = 0;
            for (let harmonic = 1; harmonic <= 4; harmonic++) {
                const amplitude = 1 / (harmonic * harmonic);
                sample += Math.sin(2 * Math.PI * frequency * harmonic * t) * amplitude;
            }
            
            data[i] = sample * Math.exp(-t * 1) * 0.3;
        }
        
        return buffer;
    }

    /**
     * Play sound effect
     * @param {string} type - Sound type ('completion', 'warning', 'milestone')
     * @param {Object} options - Playback options
     */
    playSound(type, options = {}) {
        if (!this.isAudioEnabled || !this.audioContext || this.volume === 0) return;
        
        const { theme = this.currentSoundTheme, volume = this.volume } = options;
        const soundBuffer = this.sounds[theme]?.[type];
        
        if (!soundBuffer) {
            console.warn(`Sound not found: ${theme}.${type}`);
            return;
        }
        
        try {
            const source = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();
            
            source.buffer = soundBuffer;
            gainNode.gain.value = volume;
            
            source.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            source.start();
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    }

    /**
     * Show visual notification
     * @param {Object} options - Notification options
     */
    showVisualNotification(options = {}) {
        if (!this.isVisualEnabled) return;
        
        const {
            title = "Timer Complete",
            message = "Your timer has finished!",
            icon = "🏆",
            duration = 5000,
            type = 'completion'
        } = options;
        
        // Show overlay notification
        this.showOverlayNotification({ title, message, icon, duration, type });
        
        // Show browser notification if enabled
        if (this.isBrowserNotificationsEnabled) {
            this.showBrowserNotification({ title, message, icon });
        }
    }

    /**
     * Show overlay notification
     * @param {Object} options - Overlay options
     */
    showOverlayNotification(options) {
        const overlay = document.getElementById('notificationOverlay');
        if (!overlay) return;
        
        const { title, message, icon, duration, type } = options;
        
        // Update content
        const titleElement = overlay.querySelector('.notification-title');
        const iconElement = overlay.querySelector('.notification-icon');
        const messageElement = overlay.querySelector('.notification-quote');
        
        if (titleElement) titleElement.textContent = title;
        if (iconElement) iconElement.textContent = icon;
        if (messageElement) messageElement.textContent = message;
        
        // Add type-specific styling
        overlay.className = `notification-overlay active ${type}-notification`;
        
        // Show overlay
        overlay.classList.add('active');
        
        // Auto-hide after duration
        if (duration > 0) {
            setTimeout(() => {
                this.hideVisualNotification();
            }, duration);
        }
    }

    /**
     * Hide visual notification
     */
    hideVisualNotification() {
        const overlay = document.getElementById('notificationOverlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }

    /**
     * Show browser notification
     * @param {Object} options - Browser notification options
     */
    showBrowserNotification(options) {
        if (!('Notification' in window) || Notification.permission !== 'granted') {
            return;
        }
        
        const { title, message, icon } = options;
        
        try {
            const notification = new Notification(title, {
                body: message,
                icon: this.createIconDataURL(icon),
                badge: this.createIconDataURL('🏀'),
                tag: 'lakers-timer',
                requireInteraction: false,
                silent: false
            });
            
            // Auto-close after 5 seconds
            setTimeout(() => {
                notification.close();
            }, 5000);
            
        } catch (error) {
            console.error('Error showing browser notification:', error);
        }
    }

    /**
     * Create data URL for emoji icon
     * @param {string} emoji - Emoji character
     * @returns {string} Data URL
     */
    createIconDataURL(emoji) {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(emoji, 32, 32);
        
        return canvas.toDataURL();
    }

    /**
     * Request browser notification permission
     */
    async requestNotificationPermission() {
        if (!('Notification' in window)) {
            console.warn('Browser notifications not supported');
            return false;
        }
        
        if (Notification.permission === 'default') {
            try {
                const permission = await Notification.requestPermission();
                this.isBrowserNotificationsEnabled = permission === 'granted';
                return permission === 'granted';
            } catch (error) {
                console.error('Error requesting notification permission:', error);
                return false;
            }
        }
        
        this.isBrowserNotificationsEnabled = Notification.permission === 'granted';
        return Notification.permission === 'granted';
    }

    /**
     * Setup visual notification system
     */
    setupVisualNotifications() {
        // Setup close button handler
        const closeButton = document.getElementById('notificationClose');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.hideVisualNotification();
            });
        }
        
        // Setup escape key handler
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideVisualNotification();
            }
        });
    }

    /**
     * Notify timer completion
     * @param {Object} timerData - Timer completion data
     */
    notifyCompletion(timerData = {}) {
        const { mode = 'countdown', duration = 0, lebronMode = false } = timerData;
        
        // Play completion sound
        this.playSound('completion');
        
        // Get appropriate message
        let title, message, icon;
        
        if (lebronMode && window.lebronContent) {
            const completionData = window.lebronContent.getCompletionMessage(mode);
            title = completionData.title;
            message = completionData.quote;
            icon = completionData.icon;
        } else {
            title = mode === 'countdown' ? "Time's Up!" : "Great Session!";
            message = mode === 'countdown' ? 
                "Your countdown timer has completed!" : 
                "Excellent work on your timing session!";
            icon = mode === 'countdown' ? "⏰" : "⏱️";
        }
        
        // Show visual notification
        this.showVisualNotification({
            title,
            message,
            icon,
            type: 'completion'
        });
        
        // Trigger celebration effects if Lakers theme is active
        if (window.lakersTheme) {
            window.lakersTheme.triggerConfetti();
            
            if (lebronMode) {
                window.lakersTheme.triggerChampionshipCelebration();
            }
        }
    }

    /**
     * Notify warning (low time remaining)
     * @param {Object} warningData - Warning data
     */
    notifyWarning(warningData = {}) {
        const { remainingTime = 0, isUrgent = false } = warningData;
        
        // Play warning sound
        this.playSound('warning');
        
        // Show brief visual indicator
        const timerDisplay = document.querySelector('.time-display');
        if (timerDisplay) {
            timerDisplay.classList.add(isUrgent ? 'urgent-warning' : 'warning-flash');
            
            setTimeout(() => {
                timerDisplay.classList.remove('urgent-warning', 'warning-flash');
            }, 500);
        }
        
        // Add warning styles if not present
        if (!document.querySelector('#warning-styles')) {
            const style = document.createElement('style');
            style.id = 'warning-styles';
            style.textContent = `
                .warning-flash {
                    animation: warningFlash 0.5s ease-in-out;
                }
                
                .urgent-warning {
                    animation: urgentFlash 0.5s ease-in-out;
                }
                
                @keyframes warningFlash {
                    0%, 100% { color: #FDB927; }
                    50% { color: #FF8800; }
                }
                
                @keyframes urgentFlash {
                    0%, 100% { color: #FDB927; }
                    50% { color: #FF4444; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Notify milestone reached
     * @param {Object} milestoneData - Milestone data
     */
    notifyMilestone(milestoneData = {}) {
        const { milestone = 0, isLeBronMilestone = false } = milestoneData;
        
        // Play milestone sound
        this.playSound('milestone');
        
        // Show milestone notification if LeBron mode
        if (isLeBronMilestone && window.lebronContent) {
            // LeBron content system handles the visual notification
            return;
        }
        
        // Show generic milestone notification
        this.showVisualNotification({
            title: `${milestone} Minute Milestone!`,
            message: "Keep up the great work! 💪",
            icon: "⭐",
            duration: 2000,
            type: 'milestone'
        });
    }

    /**
     * Set volume level
     * @param {number} volume - Volume level (0-100)
     */
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(100, volume)) / 100;
    }

    /**
     * Set sound theme
     * @param {string} theme - Sound theme name
     */
    setSoundTheme(theme) {
        if (this.soundThemes[theme]) {
            this.currentSoundTheme = theme;
        }
    }

    /**
     * Enable/disable audio notifications
     * @param {boolean} enabled - Whether audio is enabled
     */
    setAudioEnabled(enabled) {
        this.isAudioEnabled = enabled;
    }

    /**
     * Enable/disable visual notifications
     * @param {boolean} enabled - Whether visual notifications are enabled
     */
    setVisualEnabled(enabled) {
        this.isVisualEnabled = enabled;
    }

    /**
     * Enable/disable browser notifications
     * @param {boolean} enabled - Whether browser notifications are enabled
     */
    async setBrowserNotificationsEnabled(enabled) {
        if (enabled) {
            const granted = await this.requestNotificationPermission();
            this.isBrowserNotificationsEnabled = granted;
        } else {
            this.isBrowserNotificationsEnabled = false;
        }
    }

    /**
     * Test notification system
     * @param {string} type - Notification type to test
     */
    test(type = 'completion') {
        switch (type) {
            case 'completion':
                this.notifyCompletion({ mode: 'countdown', lebronMode: false });
                break;
            case 'warning':
                this.notifyWarning({ remainingTime: 10000, isUrgent: false });
                break;
            case 'milestone':
                this.notifyMilestone({ milestone: 5, isLeBronMilestone: false });
                break;
            case 'sound':
                this.playSound('completion');
                break;
        }
    }

    /**
     * Get current settings
     * @returns {Object} Current notification settings
     */
    getSettings() {
        return {
            volume: Math.round(this.volume * 100),
            soundTheme: this.currentSoundTheme,
            audioEnabled: this.isAudioEnabled,
            visualEnabled: this.isVisualEnabled,
            browserNotificationsEnabled: this.isBrowserNotificationsEnabled,
            availableThemes: Object.keys(this.soundThemes),
            hasAudioContext: !!this.audioContext
        };
    }

    /**
     * Destroy notification system and clean up
     */
    destroy() {
        // Close audio context
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
        
        // Clear sounds
        this.sounds = {};
        
        // Hide any active notifications
        this.hideVisualNotification();
        
        // Remove warning styles
        const warningStyles = document.getElementById('warning-styles');
        if (warningStyles) {
            warningStyles.remove();
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotificationSystem;
}