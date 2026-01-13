// Lakers Timer App - Lakers Theme System
// Visual theme components with Lakers branding and animations

class LakersTheme {
    constructor() {
        this.isActive = true;
        this.animationsEnabled = true;
        this.effectsLevel = 'full'; // 'minimal', 'standard', 'full'
        
        // Lakers brand assets
        this.assets = {
            colors: {
                purple: '#552583',
                gold: '#FDB927',
                black: '#000000',
                white: '#FFFFFF',
                purpleLight: '#7B4397',
                purpleDark: '#3D1A5B',
                goldLight: '#FFD700',
                goldDark: '#B8860B'
            },
            fonts: {
                primary: 'Oswald, sans-serif',
                secondary: 'Roboto, sans-serif'
            },
            effects: {
                goldGlow: '0 0 20px rgba(253, 185, 39, 0.5)',
                purpleGlow: '0 0 20px rgba(85, 37, 131, 0.5)',
                championshipGlow: '0 0 30px rgba(253, 185, 39, 0.8)'
            }
        };
        
        this.init();
    }

    /**
     * Initialize Lakers theme
     */
    init() {
        this.injectThemeStyles();
        this.setupAnimations();
        this.createVisualEffects();
        this.applyLakersTypography();
    }

    /**
     * Inject Lakers theme CSS variables
     */
    injectThemeStyles() {
        const style = document.createElement('style');
        style.id = 'lakers-theme-styles';
        
        style.textContent = `
            :root {
                --lakers-purple: ${this.assets.colors.purple};
                --lakers-gold: ${this.assets.colors.gold};
                --lakers-black: ${this.assets.colors.black};
                --lakers-white: ${this.assets.colors.white};
                --lakers-purple-light: ${this.assets.colors.purpleLight};
                --lakers-purple-dark: ${this.assets.colors.purpleDark};
                --lakers-gold-light: ${this.assets.colors.goldLight};
                --lakers-gold-dark: ${this.assets.colors.goldDark};
                --lakers-font-primary: ${this.assets.fonts.primary};
                --lakers-font-secondary: ${this.assets.fonts.secondary};
            }
            
            /* Lakers Theme Animations */
            @keyframes lakersGlow {
                0%, 100% { box-shadow: ${this.assets.effects.goldGlow}; }
                50% { box-shadow: ${this.assets.effects.championshipGlow}; }
            }
            
            @keyframes championshipPulse {
                0%, 100% { transform: scale(1); filter: brightness(1); }
                50% { transform: scale(1.05); filter: brightness(1.2); }
            }
            
            @keyframes purpleWave {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            
            @keyframes goldShimmer {
                0% { background-position: -200% center; }
                100% { background-position: 200% center; }
            }
            
            /* Lakers Theme Classes */
            .lakers-glow {
                animation: lakersGlow 2s ease-in-out infinite;
            }
            
            .championship-pulse {
                animation: championshipPulse 1.5s ease-in-out infinite;
            }
            
            .lakers-gradient {
                background: linear-gradient(135deg, var(--lakers-purple) 0%, var(--lakers-purple-dark) 100%);
            }
            
            .gold-shimmer {
                background: linear-gradient(90deg, 
                    var(--lakers-gold) 0%, 
                    var(--lakers-gold-light) 50%, 
                    var(--lakers-gold) 100%);
                background-size: 200% 100%;
                animation: goldShimmer 2s ease-in-out infinite;
            }
            
            .lakers-text-gold {
                color: var(--lakers-gold);
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
                font-family: var(--lakers-font-primary);
                font-weight: 700;
            }
            
            .lakers-text-purple {
                color: var(--lakers-purple);
                text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
                font-family: var(--lakers-font-primary);
                font-weight: 600;
            }
            
            .lakers-button {
                background: linear-gradient(135deg, var(--lakers-purple), var(--lakers-purple-dark));
                border: 2px solid var(--lakers-gold);
                color: var(--lakers-white);
                font-family: var(--lakers-font-primary);
                font-weight: 600;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }
            
            .lakers-button:hover {
                background: var(--lakers-gold);
                color: var(--lakers-purple);
                box-shadow: ${this.assets.effects.goldGlow};
                transform: translateY(-2px);
            }
            
            .lakers-button:active {
                transform: translateY(0);
            }
            
            .lakers-button::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                transition: left 0.5s;
            }
            
            .lakers-button:hover::before {
                left: 100%;
            }
        `;
        
        document.head.appendChild(style);
    }

    /**
     * Setup Lakers-themed animations
     */
    setupAnimations() {
        if (!this.animationsEnabled) return;
        
        // Add entrance animations to key elements
        this.addEntranceAnimations();
        
        // Setup hover effects
        this.setupHoverEffects();
        
        // Setup completion celebrations
        this.setupCompletionEffects();
    }

    /**
     * Add entrance animations to elements
     */
    addEntranceAnimations() {
        const animatedElements = [
            { selector: '.app-title', delay: 0 },
            { selector: '.timer-display', delay: 200 },
            { selector: '.control-panel', delay: 400 },
            { selector: '.preset-buttons', delay: 600 }
        ];
        
        animatedElements.forEach(({ selector, delay }) => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                element.style.transition = 'all 0.6s ease';
                
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, delay);
            }
        });
    }

    /**
     * Setup hover effects for interactive elements
     */
    setupHoverEffects() {
        // Apply Lakers button styling to all buttons
        const buttons = document.querySelectorAll('button:not(.mode-btn)');
        buttons.forEach(button => {
            button.classList.add('lakers-button');
        });
        
        // Special effects for preset buttons
        const presetButtons = document.querySelectorAll('.preset-btn');
        presetButtons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                if (this.effectsLevel === 'full') {
                    button.classList.add('lakers-glow');
                }
            });
            
            button.addEventListener('mouseleave', () => {
                button.classList.remove('lakers-glow');
            });
        });
        
        // Special effects for LeBron presets
        const lebronPresets = document.querySelectorAll('.lebron-preset');
        lebronPresets.forEach(button => {
            button.addEventListener('mouseenter', () => {
                if (this.effectsLevel === 'full') {
                    button.classList.add('championship-pulse');
                }
            });
            
            button.addEventListener('mouseleave', () => {
                button.classList.remove('championship-pulse');
            });
        });
    }

    /**
     * Setup completion celebration effects
     */
    setupCompletionEffects() {
        // Create confetti effect for timer completion
        this.createConfettiSystem();
        
        // Setup championship celebration
        this.setupChampionshipCelebration();
    }

    /**
     * Create visual effects system
     */
    createVisualEffects() {
        // Add Lakers gradient background
        document.body.classList.add('lakers-gradient');
        
        // Create floating Lakers elements
        if (this.effectsLevel === 'full') {
            this.createFloatingElements();
        }
        
        // Add Lakers logo watermark
        this.addLakersWatermark();
    }

    /**
     * Create floating Lakers-themed elements
     */
    createFloatingElements() {
        const floatingContainer = document.createElement('div');
        floatingContainer.className = 'floating-elements';
        floatingContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            overflow: hidden;
        `;
        
        // Create floating basketballs and crowns
        const elements = ['🏀', '👑', '🏆'];
        
        for (let i = 0; i < 6; i++) {
            const element = document.createElement('div');
            element.textContent = elements[i % elements.length];
            element.style.cssText = `
                position: absolute;
                font-size: ${20 + Math.random() * 20}px;
                opacity: 0.1;
                animation: float ${10 + Math.random() * 10}s linear infinite;
                left: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 10}s;
            `;
            
            floatingContainer.appendChild(element);
        }
        
        // Add floating animation
        const floatingStyle = document.createElement('style');
        floatingStyle.textContent = `
            @keyframes float {
                0% { transform: translateY(100vh) rotate(0deg); }
                100% { transform: translateY(-100px) rotate(360deg); }
            }
        `;
        document.head.appendChild(floatingStyle);
        
        document.body.appendChild(floatingContainer);
    }

    /**
     * Add Lakers logo watermark
     */
    addLakersWatermark() {
        const watermark = document.createElement('div');
        watermark.className = 'lakers-watermark';
        watermark.innerHTML = '🏀 LAKERS';
        watermark.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            font-family: ${this.assets.fonts.primary};
            font-weight: 700;
            font-size: 12px;
            color: ${this.assets.colors.gold};
            opacity: 0.3;
            pointer-events: none;
            z-index: 1000;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
        `;
        
        document.body.appendChild(watermark);
    }

    /**
     * Apply Lakers typography throughout the app
     */
    applyLakersTypography() {
        // Apply primary font to headings
        const headings = document.querySelectorAll('h1, h2, h3, .app-title');
        headings.forEach(heading => {
            heading.style.fontFamily = this.assets.fonts.primary;
            heading.classList.add('lakers-text-gold');
        });
        
        // Apply secondary font to body text
        const bodyElements = document.querySelectorAll('p, span, label, button');
        bodyElements.forEach(element => {
            if (!element.style.fontFamily) {
                element.style.fontFamily = this.assets.fonts.secondary;
            }
        });
        
        // Special styling for timer display
        const timerDisplay = document.querySelector('.time-display');
        if (timerDisplay) {
            timerDisplay.classList.add('lakers-text-gold');
            timerDisplay.style.fontSize = '3.5rem';
            timerDisplay.style.letterSpacing = '2px';
        }
    }

    /**
     * Create confetti system for celebrations
     */
    createConfettiSystem() {
        this.confettiSystem = {
            container: null,
            particles: [],
            isActive: false
        };
        
        // Create confetti container
        const container = document.createElement('div');
        container.className = 'confetti-container';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
            overflow: hidden;
        `;
        
        document.body.appendChild(container);
        this.confettiSystem.container = container;
    }

    /**
     * Trigger confetti celebration
     */
    triggerConfetti() {
        if (!this.confettiSystem.container || this.effectsLevel === 'minimal') return;
        
        this.confettiSystem.isActive = true;
        
        // Create confetti particles
        for (let i = 0; i < 50; i++) {
            this.createConfettiParticle();
        }
        
        // Stop confetti after 3 seconds
        setTimeout(() => {
            this.stopConfetti();
        }, 3000);
    }

    /**
     * Create individual confetti particle
     */
    createConfettiParticle() {
        const particle = document.createElement('div');
        const colors = [this.assets.colors.gold, this.assets.colors.purple, this.assets.colors.white];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.cssText = `
            position: absolute;
            width: 8px;
            height: 8px;
            background: ${color};
            top: -10px;
            left: ${Math.random() * 100}%;
            animation: confettiFall ${2 + Math.random() * 3}s linear forwards;
            transform: rotate(${Math.random() * 360}deg);
        `;
        
        // Add confetti animation if not exists
        if (!document.querySelector('#confetti-animation')) {
            const style = document.createElement('style');
            style.id = 'confetti-animation';
            style.textContent = `
                @keyframes confettiFall {
                    0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        this.confettiSystem.container.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 5000);
    }

    /**
     * Stop confetti effect
     */
    stopConfetti() {
        this.confettiSystem.isActive = false;
        if (this.confettiSystem.container) {
            this.confettiSystem.container.innerHTML = '';
        }
    }

    /**
     * Setup championship celebration for special achievements
     */
    setupChampionshipCelebration() {
        this.championshipEffects = {
            isActive: false,
            duration: 5000
        };
    }

    /**
     * Trigger championship celebration
     */
    triggerChampionshipCelebration() {
        if (this.championshipEffects.isActive) return;
        
        this.championshipEffects.isActive = true;
        
        // Add championship glow to main elements
        const mainElements = document.querySelectorAll('.timer-display, .app-title');
        mainElements.forEach(element => {
            element.classList.add('championship-pulse');
        });
        
        // Trigger confetti
        this.triggerConfetti();
        
        // Add championship background effect
        document.body.style.background = `
            linear-gradient(45deg, 
                ${this.assets.colors.purple} 0%, 
                ${this.assets.colors.gold} 50%, 
                ${this.assets.colors.purple} 100%)
        `;
        document.body.style.backgroundSize = '400% 400%';
        document.body.style.animation = 'purpleWave 3s ease infinite';
        
        // Reset after duration
        setTimeout(() => {
            this.resetChampionshipEffects();
        }, this.championshipEffects.duration);
    }

    /**
     * Reset championship effects
     */
    resetChampionshipEffects() {
        this.championshipEffects.isActive = false;
        
        // Remove championship classes
        const elements = document.querySelectorAll('.championship-pulse');
        elements.forEach(element => {
            element.classList.remove('championship-pulse');
        });
        
        // Reset background
        document.body.classList.add('lakers-gradient');
        document.body.style.background = '';
        document.body.style.backgroundSize = '';
        document.body.style.animation = '';
        
        this.stopConfetti();
    }

    /**
     * Set effects level
     * @param {string} level - Effects level ('minimal', 'standard', 'full')
     */
    setEffectsLevel(level) {
        this.effectsLevel = level;
        
        if (level === 'minimal') {
            this.disableAnimations();
        } else {
            this.enableAnimations();
        }
    }

    /**
     * Enable animations
     */
    enableAnimations() {
        this.animationsEnabled = true;
        document.body.classList.remove('no-animations');
    }

    /**
     * Disable animations
     */
    disableAnimations() {
        this.animationsEnabled = false;
        document.body.classList.add('no-animations');
        
        // Add no-animations CSS
        if (!document.querySelector('#no-animations-style')) {
            const style = document.createElement('style');
            style.id = 'no-animations-style';
            style.textContent = `
                .no-animations * {
                    animation-duration: 0s !important;
                    transition-duration: 0s !important;
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Get current theme state
     * @returns {Object} Theme state
     */
    getState() {
        return {
            isActive: this.isActive,
            animationsEnabled: this.animationsEnabled,
            effectsLevel: this.effectsLevel,
            championshipActive: this.championshipEffects?.isActive || false,
            confettiActive: this.confettiSystem?.isActive || false
        };
    }

    /**
     * Destroy theme and clean up
     */
    destroy() {
        // Remove theme styles
        const themeStyle = document.getElementById('lakers-theme-styles');
        if (themeStyle) {
            themeStyle.remove();
        }
        
        // Remove floating elements
        const floatingElements = document.querySelector('.floating-elements');
        if (floatingElements) {
            floatingElements.remove();
        }
        
        // Remove watermark
        const watermark = document.querySelector('.lakers-watermark');
        if (watermark) {
            watermark.remove();
        }
        
        // Remove confetti container
        if (this.confettiSystem?.container) {
            this.confettiSystem.container.remove();
        }
        
        // Reset body classes
        document.body.classList.remove('lakers-gradient', 'no-animations');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LakersTheme;
}