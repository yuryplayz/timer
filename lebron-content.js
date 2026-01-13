// Lakers Timer App - LeBron James Content System
// Quotes, achievements, and King-themed features

class LeBronContent {
    constructor() {
        this.quotes = this.initializeQuotes();
        this.achievements = this.initializeAchievements();
        this.milestones = this.initializeMilestones();
        this.facts = this.initializeFacts();
        
        // State
        this.isEnabled = false;
        this.lastQuoteIndex = -1;
        this.displayedQuotes = new Set();
        
        this.init();
    }

    /**
     * Initialize LeBron quotes collection
     */
    initializeQuotes() {
        return [
            {
                id: 'quote-1',
                text: "I like criticism. It makes you strong.",
                context: "On handling pressure",
                year: 2010
            },
            {
                id: 'quote-2',
                text: "In Northeast Ohio, nothing is given. Everything is earned. You work for what you have.",
                context: "2016 Championship",
                year: 2016
            },
            {
                id: 'quote-3',
                text: "I'm going to use all my tools, my God-given ability, and make the best life I can with it.",
                context: "On maximizing potential",
                year: 2012
            },
            {
                id: 'quote-4',
                text: "You have to be able to accept failure to get better.",
                context: "On learning from losses",
                year: 2011
            },
            {
                id: 'quote-5',
                text: "I think, team first. It allows me to succeed, it allows my team to succeed.",
                context: "On teamwork",
                year: 2013
            },
            {
                id: 'quote-6',
                text: "Don't be afraid of failure. This is the way to succeed.",
                context: "Motivational advice",
                year: 2014
            },
            {
                id: 'quote-7',
                text: "I always believed that I'd return to Cleveland and finish the job.",
                context: "2014 Return to Cleveland",
                year: 2014
            },
            {
                id: 'quote-8',
                text: "Nothing is given. Everything is earned.",
                context: "Work ethic philosophy",
                year: 2016
            },
            {
                id: 'quote-9',
                text: "I'm blessed and I thank God for every day for everything that happens for me.",
                context: "On gratitude",
                year: 2018
            },
            {
                id: 'quote-10',
                text: "You can't be afraid to fail. It's the only way you succeed.",
                context: "On taking risks",
                year: 2019
            },
            {
                id: 'quote-11',
                text: "I'm not going to change who I am. I'm going to continue to be myself.",
                context: "On authenticity",
                year: 2020
            },
            {
                id: 'quote-12',
                text: "Greatness is defined by how much you want to put into what you do.",
                context: "On dedication",
                year: 2021
            }
        ];
    }

    /**
     * Initialize LeBron achievements
     */
    initializeAchievements() {
        return [
            {
                id: 'achievement-1',
                title: 'NBA Championships',
                description: '4 NBA Championships (2012, 2013, 2016, 2020)',
                year: 2020,
                team: 'Multiple',
                category: 'championship',
                icon: '🏆'
            },
            {
                id: 'achievement-2',
                title: 'Finals MVP Awards',
                description: '4 NBA Finals MVP Awards',
                year: 2020,
                team: 'Multiple',
                category: 'award',
                icon: '👑'
            },
            {
                id: 'achievement-3',
                title: 'Regular Season MVP',
                description: '4 NBA MVP Awards (2009, 2010, 2012, 2013)',
                year: 2013,
                team: 'Multiple',
                category: 'award',
                icon: '🏅'
            },
            {
                id: 'achievement-4',
                title: 'All-Star Selections',
                description: '20 NBA All-Star Game selections',
                year: 2024,
                team: 'Multiple',
                category: 'milestone',
                icon: '⭐'
            },
            {
                id: 'achievement-5',
                title: 'All-Time Scoring Leader',
                description: 'NBA All-Time Leading Scorer (40,000+ points)',
                year: 2023,
                team: 'Lakers',
                category: 'record',
                icon: '🎯'
            },
            {
                id: 'achievement-6',
                title: 'Olympic Gold Medals',
                description: '2 Olympic Gold Medals (2008, 2012)',
                year: 2012,
                team: 'Team USA',
                category: 'championship',
                icon: '🥇'
            },
            {
                id: 'achievement-7',
                title: 'Rookie of the Year',
                description: 'NBA Rookie of the Year (2004)',
                year: 2004,
                team: 'Cavaliers',
                category: 'award',
                icon: '🌟'
            },
            {
                id: 'achievement-8',
                title: 'Triple-Double Machine',
                description: '100+ Career Triple-Doubles',
                year: 2023,
                team: 'Multiple',
                category: 'milestone',
                icon: '💯'
            }
        ];
    }

    /**
     * Initialize milestone content for specific timer durations
     */
    initializeMilestones() {
        return {
            6: {
                title: "LeBron's Miami Heat Jersey Number",
                description: "The King wore #6 during his championship years in Miami (2010-2014)",
                content: "🔥 Miami Heat Era: 2 Championships, 4 Finals appearances",
                icon: "🔥",
                color: "#FDB927"
            },
            23: {
                title: "LeBron's Iconic Jersey Number",
                description: "The legendary #23, worn in Cleveland and Los Angeles",
                content: "👑 The King's Number: Inspired by Michael Jordan, made it his own",
                icon: "👑",
                color: "#552583"
            },
            12: {
                title: "Double the Miami Magic",
                description: "Twice the power of LeBron's Miami jersey number",
                content: "🏆 Championship Mindset: Every minute counts toward greatness",
                icon: "🏆",
                color: "#FDB927"
            },
            46: {
                title: "Double the Greatness",
                description: "Twice the legendary #23",
                content: "⚡ Elite Performance: LeBron's dedication doubled",
                icon: "⚡",
                color: "#552583"
            }
        };
    }

    /**
     * Initialize LeBron facts and trivia
     */
    initializeFacts() {
        return [
            "LeBron was drafted straight from high school as the #1 pick in 2003",
            "He's the only player to win Finals MVP with 3 different teams",
            "LeBron has played in 10 NBA Finals (2007, 2011-2018, 2020)",
            "He's the youngest player to reach 30,000 career points",
            "LeBron has recorded a triple-double against all 30 NBA teams",
            "He's appeared in 8 consecutive NBA Finals (2011-2018)",
            "LeBron is the only player with 35,000+ points, 9,000+ rebounds, and 9,000+ assists",
            "He's won championships in three different decades (2010s, 2020s)",
            "LeBron has the most playoff points in NBA history",
            "He's the only player to lead both teams in all major statistical categories in a Finals series"
        ];
    }

    /**
     * Initialize LeBron content system
     */
    init() {
        this.setupQuoteRotation();
        this.setupAchievementDisplay();
        this.setupMilestoneDetection();
    }

    /**
     * Enable LeBron Mode
     */
    enable() {
        this.isEnabled = true;
        this.showLeBronContent();
        this.updatePresets();
        this.emit('lebronModeEnabled');
    }

    /**
     * Disable LeBron Mode
     */
    disable() {
        this.isEnabled = false;
        this.hideLeBronContent();
        this.resetPresets();
        this.emit('lebronModeDisabled');
    }

    /**
     * Get random LeBron quote
     * @param {boolean} avoidRepeats - Whether to avoid recently shown quotes
     * @returns {Object} Quote object
     */
    getRandomQuote(avoidRepeats = true) {
        let availableQuotes = this.quotes;
        
        if (avoidRepeats && this.displayedQuotes.size < this.quotes.length) {
            availableQuotes = this.quotes.filter(quote => !this.displayedQuotes.has(quote.id));
        }
        
        if (availableQuotes.length === 0) {
            // Reset if all quotes have been shown
            this.displayedQuotes.clear();
            availableQuotes = this.quotes;
        }
        
        const randomIndex = Math.floor(Math.random() * availableQuotes.length);
        const selectedQuote = availableQuotes[randomIndex];
        
        this.displayedQuotes.add(selectedQuote.id);
        this.lastQuoteIndex = this.quotes.findIndex(q => q.id === selectedQuote.id);
        
        return selectedQuote;
    }

    /**
     * Get quote for timer completion
     * @returns {Object} Completion quote
     */
    getCompletionQuote() {
        const motivationalQuotes = this.quotes.filter(quote => 
            quote.context.includes('success') || 
            quote.context.includes('work') ||
            quote.context.includes('dedication') ||
            quote.text.includes('succeed') ||
            quote.text.includes('work')
        );
        
        if (motivationalQuotes.length > 0) {
            const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
            return motivationalQuotes[randomIndex];
        }
        
        return this.getRandomQuote();
    }

    /**
     * Get milestone content for specific duration
     * @param {number} minutes - Duration in minutes
     * @returns {Object|null} Milestone content
     */
    getMilestoneContent(minutes) {
        return this.milestones[minutes] || null;
    }

    /**
     * Check if duration is a LeBron milestone
     * @param {number} minutes - Duration in minutes
     * @returns {boolean} True if milestone
     */
    isMilestone(minutes) {
        return this.milestones.hasOwnProperty(minutes);
    }

    /**
     * Get random LeBron fact
     * @returns {string} Random fact
     */
    getRandomFact() {
        const randomIndex = Math.floor(Math.random() * this.facts.length);
        return this.facts[randomIndex];
    }

    /**
     * Get achievements by category
     * @param {string} category - Achievement category
     * @returns {Array} Filtered achievements
     */
    getAchievementsByCategory(category) {
        return this.achievements.filter(achievement => achievement.category === category);
    }

    /**
     * Setup quote rotation system
     */
    setupQuoteRotation() {
        // Update quote display every 30 seconds when enabled
        setInterval(() => {
            if (this.isEnabled) {
                this.updateQuoteDisplay();
            }
        }, 30000);
    }

    /**
     * Setup achievement display
     */
    setupAchievementDisplay() {
        const achievementsSection = document.getElementById('achievementsSection');
        if (achievementsSection) {
            this.renderAchievements(achievementsSection);
        }
    }

    /**
     * Setup milestone detection
     */
    setupMilestoneDetection() {
        // Listen for timer events to detect milestones
        document.addEventListener('timerTick', (e) => {
            if (this.isEnabled) {
                this.checkForMilestones(e.detail);
            }
        });
    }

    /**
     * Show LeBron content
     */
    showLeBronContent() {
        const lebronContent = document.getElementById('lebronContent');
        if (lebronContent) {
            lebronContent.classList.add('active');
            this.updateQuoteDisplay();
        }
    }

    /**
     * Hide LeBron content
     */
    hideLeBronContent() {
        const lebronContent = document.getElementById('lebronContent');
        if (lebronContent) {
            lebronContent.classList.remove('active');
        }
    }

    /**
     * Update quote display
     */
    updateQuoteDisplay() {
        const quoteElement = document.getElementById('lebronQuote');
        if (quoteElement) {
            const quote = this.getRandomQuote();
            quoteElement.textContent = `"${quote.text}"`;
            quoteElement.setAttribute('title', `${quote.context} (${quote.year})`);
            
            // Add fade animation
            quoteElement.style.opacity = '0';
            setTimeout(() => {
                quoteElement.style.opacity = '1';
            }, 300);
        }
    }

    /**
     * Render achievements in the UI
     * @param {HTMLElement} container - Container element
     */
    renderAchievements(container) {
        const achievementGrid = container.querySelector('.achievement-grid');
        if (!achievementGrid) return;
        
        // Clear existing content
        achievementGrid.innerHTML = '';
        
        // Show top achievements
        const topAchievements = [
            this.achievements.find(a => a.title === 'NBA Championships'),
            this.achievements.find(a => a.title === 'Finals MVP Awards'),
            this.achievements.find(a => a.title === 'All-Star Selections')
        ].filter(Boolean);
        
        topAchievements.forEach(achievement => {
            const achievementElement = document.createElement('div');
            achievementElement.className = 'achievement-item';
            achievementElement.innerHTML = `
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-number">${this.extractNumber(achievement.description)}</div>
                <div class="achievement-label">${achievement.title}</div>
            `;
            
            achievementElement.setAttribute('title', achievement.description);
            achievementGrid.appendChild(achievementElement);
        });
    }

    /**
     * Extract number from achievement description
     * @param {string} description - Achievement description
     * @returns {string} Extracted number
     */
    extractNumber(description) {
        const match = description.match(/(\d+)/);
        return match ? match[1] : '∞';
    }

    /**
     * Update presets for LeBron Mode
     */
    updatePresets() {
        const presetButtons = document.querySelectorAll('.preset-btn');
        presetButtons.forEach(button => {
            const minutes = parseInt(button.dataset.minutes);
            if (minutes === 6 || minutes === 23) {
                button.classList.add('lebron-active');
                
                // Add special content
                if (minutes === 6) {
                    button.innerHTML = '6 min <span class="heat-fire">🔥</span>';
                } else if (minutes === 23) {
                    button.innerHTML = '23 min <span class="king-crown">👑</span>';
                }
            }
        });
    }

    /**
     * Reset presets when LeBron Mode is disabled
     */
    resetPresets() {
        const presetButtons = document.querySelectorAll('.preset-btn');
        presetButtons.forEach(button => {
            button.classList.remove('lebron-active');
            const minutes = parseInt(button.dataset.minutes);
            button.innerHTML = `${minutes} min`;
        });
    }

    /**
     * Check for milestones during timer operation
     * @param {Object} timerData - Timer event data
     */
    checkForMilestones(timerData) {
        const { currentTime, mode } = timerData;
        const minutes = Math.floor(currentTime / (1000 * 60));
        
        if (this.isMilestone(minutes)) {
            this.showMilestoneContent(minutes);
        }
    }

    /**
     * Show milestone content
     * @param {number} minutes - Milestone minutes
     */
    showMilestoneContent(minutes) {
        const milestone = this.getMilestoneContent(minutes);
        if (!milestone) return;
        
        // Create milestone notification
        this.showMilestoneNotification(milestone);
        
        // Emit milestone event
        this.emit('milestoneReached', { minutes, milestone });
    }

    /**
     * Show milestone notification
     * @param {Object} milestone - Milestone data
     */
    showMilestoneNotification(milestone) {
        // Create temporary milestone display
        const notification = document.createElement('div');
        notification.className = 'milestone-notification';
        notification.innerHTML = `
            <div class="milestone-icon">${milestone.icon}</div>
            <div class="milestone-title">${milestone.title}</div>
            <div class="milestone-content">${milestone.content}</div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #552583, #3D1A5B);
            border: 3px solid ${milestone.color};
            border-radius: 20px;
            padding: 2rem;
            text-align: center;
            color: white;
            font-family: 'Oswald', sans-serif;
            z-index: 10000;
            animation: milestoneAppear 0.5s ease-out;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        `;
        
        // Add animation styles
        if (!document.querySelector('#milestone-animations')) {
            const style = document.createElement('style');
            style.id = 'milestone-animations';
            style.textContent = `
                @keyframes milestoneAppear {
                    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
                    100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                }
                
                .milestone-notification .milestone-icon {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                }
                
                .milestone-notification .milestone-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin-bottom: 0.5rem;
                    color: #FDB927;
                }
                
                .milestone-notification .milestone-content {
                    font-size: 1rem;
                    opacity: 0.9;
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'milestoneAppear 0.5s ease-out reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 3000);
    }

    /**
     * Get LeBron-themed completion message
     * @param {string} mode - Timer mode
     * @returns {Object} Completion message
     */
    getCompletionMessage(mode) {
        const quote = this.getCompletionQuote();
        const messages = {
            countdown: [
                "Time's up! The King would be proud! 👑",
                "Mission accomplished, just like LeBron in the clutch! 🏆",
                "You finished strong, championship mentality! 💪"
            ],
            stopwatch: [
                "Great session! LeBron-level dedication! ⭐",
                "Time well spent, King-worthy effort! 👑",
                "Excellence achieved, Lakers pride! 💜💛"
            ]
        };
        
        const modeMessages = messages[mode] || messages.countdown;
        const randomMessage = modeMessages[Math.floor(Math.random() * modeMessages.length)];
        
        return {
            title: randomMessage,
            quote: quote.text,
            icon: mode === 'countdown' ? '🏆' : '⭐'
        };
    }

    /**
     * Event emitter
     * @param {string} eventName - Event name
     * @param {Object} data - Event data
     */
    emit(eventName, data = {}) {
        const event = new CustomEvent(`lebron${eventName}`, { detail: data });
        document.dispatchEvent(event);
    }

    /**
     * Get current state
     * @returns {Object} Current state
     */
    getState() {
        return {
            isEnabled: this.isEnabled,
            totalQuotes: this.quotes.length,
            displayedQuotes: this.displayedQuotes.size,
            lastQuoteIndex: this.lastQuoteIndex,
            availableMilestones: Object.keys(this.milestones).map(Number),
            totalAchievements: this.achievements.length
        };
    }

    /**
     * Destroy and clean up
     */
    destroy() {
        this.disable();
        this.displayedQuotes.clear();
        
        // Remove milestone styles
        const milestoneStyles = document.getElementById('milestone-animations');
        if (milestoneStyles) {
            milestoneStyles.remove();
        }
        
        // Remove any active milestone notifications
        const notifications = document.querySelectorAll('.milestone-notification');
        notifications.forEach(notification => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        });
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LeBronContent;
}