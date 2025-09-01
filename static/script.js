class VendorAI {
  constructor() {
    this.currentLocation = null;
    this.trends = [];
    this.chatHistory = [];
    this.isTyping = false;
    
    this.init();
  }

  init() {
    this.loadTrends();
    this.setupEventListeners();
    this.setupChatbot();
    this.startBackgroundAnimations();
  }

  // Event Listeners Setup
  setupEventListeners() {
    // Navigation and main actions
    document.getElementById('startAnalysis')?.addEventListener('click', () => this.startAnalysis());
    document.getElementById('detectLocation')?.addEventListener('click', () => this.showLocationModal());
    document.getElementById('openChatbot')?.addEventListener('click', () => this.toggleChatbot());
    document.getElementById('floatingHelp')?.addEventListener('click', () => this.toggleChatbot());

    // Action cards
    document.querySelectorAll('.action-card').forEach(card => {
      card.addEventListener('click', () => this.handleActionCard(card.dataset.action));
    });

    // Location modal
    document.getElementById('allowLocation')?.addEventListener('click', () => this.detectLocation());
    document.getElementById('cancelLocation')?.addEventListener('click', () => this.hideLocationModal());
    document.getElementById('closeLocationModal')?.addEventListener('click', () => this.hideLocationModal());

    // Language switcher
    document.getElementById('languageSelect')?.addEventListener('change', (e) => this.changeLanguage(e.target.value));

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hideLocationModal();
        this.closeChatbot();
      }
    });
  }

  // Trends Management
  loadTrends() {
    // Simulated real-time trends data
    this.trends = [
      {
        id: 1,
        title: "Cricket World Cup Victory Celebration",
        description: "Massive demand for team merchandise and celebratory snacks",
        category: "Sports",
        impact: "+85% sales",
        isHot: true,
        timestamp: new Date()
      },
      {
        id: 2,
        title: "Monsoon Season Essentials",
        description: "Umbrellas, raincoats, and hot beverages in high demand",
        category: "Weather",
        impact: "+60% sales",
        isHot: true,
        timestamp: new Date()
      },
      {
        id: 3,
        title: "Festival Season Approaching",
        description: "Traditional sweets and decorative items trending",
        category: "Festival",
        impact: "+70% sales",
        isHot: false,
        timestamp: new Date()
      },
      {
        id: 4,
        title: "Health Consciousness Rising",
        description: "Fresh juices and organic snacks gaining popularity",
        category: "Health",
        impact: "+45% sales",
        isHot: false,
        timestamp: new Date()
      }
    ];

    this.renderTrends();
    
    // Simulate real-time updates
    setInterval(() => this.updateTrends(), 30000); // Update every 30 seconds
  }

  renderTrends() {
    const container = document.getElementById('trendsContainer');
    if (!container) return;

    container.innerHTML = this.trends.map(trend => `
      <div class="trend-card fade-in">
        <div class="trend-header">
          <span class="trend-category">${trend.category}</span>
          ${trend.isHot ? '<span class="trend-hot">🔥 HOT</span>' : ''}
        </div>
        <h3 class="trend-title">${trend.title}</h3>
        <p class="trend-description">${trend.description}</p>
        <div class="trend-stats">
          <span class="trend-impact">${trend.impact}</span>
          <span class="trend-time">${this.formatTime(trend.timestamp)}</span>
        </div>
      </div>
    `).join('');
  }

  updateTrends() {
    // Simulate new trend or update existing ones
    const randomTrend = this.trends[Math.floor(Math.random() * this.trends.length)];
    randomTrend.timestamp = new Date();
    
    // Add notification for trend update
    this.showNotification(`📈 Trend Update: ${randomTrend.title}`, 'info');
    this.renderTrends();
  }

  // Location Services
  showLocationModal() {
    const modal = document.getElementById('locationModal');
    if (modal) {
      modal.classList.add('active');
    }
  }

  hideLocationModal() {
    const modal = document.getElementById('locationModal');
    if (modal) {
      modal.classList.remove('active');
    }
  }

  async detectLocation() {
    const statusElement = document.getElementById('locationStatus');
    
    if (!navigator.geolocation) {
      this.updateLocationStatus('❌ Geolocation not supported', 'error');
      return;
    }

    this.updateLocationStatus('🔍 Detecting location...', 'loading');

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        });
      });

      this.currentLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy
      };

      // Simulate reverse geocoding
      const locationName = await this.reverseGeocode(this.currentLocation);
      this.updateLocationStatus(`✅ Location detected: ${locationName}`, 'success');
      
      // Get location-based recommendations
      setTimeout(() => {
        this.hideLocationModal();
        this.showLocationRecommendations(locationName);
      }, 2000);

    } catch (error) {
      console.error('Location detection failed:', error);
      this.updateLocationStatus('❌ Location access denied', 'error');
    }
  }

  updateLocationStatus(message, type) {
    const statusElement = document.getElementById('locationStatus');
    if (statusElement) {
      statusElement.innerHTML = `
        <i class="fas fa-${type === 'loading' ? 'spinner fa-spin' : type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
      `;
    }
  }

  async reverseGeocode(location) {
    // Simulate reverse geocoding - in real app, use Google Maps API or similar
    const areas = [
      'Brigade Road, Bangalore',
      'Commercial Street, Bangalore',
      'MG Road, Bangalore',
      'Koramangala, Bangalore',
      'Indiranagar, Bangalore',
      'Jayanagar, Bangalore'
    ];
    
    return areas[Math.floor(Math.random() * areas.length)];
  }

  showLocationRecommendations(locationName) {
    const recommendations = this.generateLocationRecommendations(locationName);
    this.addChatMessage('bot', `📍 Great! I detected you're near ${locationName}. Here are some personalized recommendations for your area:\n\n${recommendations}`);
    this.toggleChatbot(true);
  }

  generateLocationRecommendations(location) {
    const recommendations = [
      "🍹 Fresh juice stalls perform 40% better in this area",
      "🍿 Evening snacks have peak demand from 5-8 PM here",
      "📱 Mobile accessories show strong weekend sales",
      "🌮 Street food has consistent demand throughout the day",
      "☕ Hot beverages are popular during morning hours"
    ];
    
    return recommendations.slice(0, 3).join('\n');
  }

  // Chatbot System
  setupChatbot() {
    const sendButton = document.getElementById('sendMessage');
    const chatInput = document.getElementById('chatInput');
    const closeButton = document.getElementById('closeChatbot');

    sendButton?.addEventListener('click', () => this.sendMessage());
    chatInput?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
    closeButton?.addEventListener('click', () => this.closeChatbot());
  }

  toggleChatbot(forceOpen = false) {
    const chatbot = document.getElementById('chatbotContainer');
    const floatingHelp = document.getElementById('floatingHelp');
    
    if (chatbot && floatingHelp) {
      const isActive = chatbot.classList.contains('active');
      
      if (forceOpen || !isActive) {
        chatbot.classList.add('active');
        floatingHelp.style.display = 'none';
      } else {
        chatbot.classList.remove('active');
        floatingHelp.style.display = 'flex';
      }
    }
  }

  closeChatbot() {
    const chatbot = document.getElementById('chatbotContainer');
    const floatingHelp = document.getElementById('floatingHelp');
    
    if (chatbot && floatingHelp) {
      chatbot.classList.remove('active');
      floatingHelp.style.display = 'flex';
    }
  }

  async sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (!message) return;

    this.addChatMessage('user', message);
    input.value = '';
    this.showTypingIndicator();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.hideTypingIndicator();
      this.addChatMessage('bot', data.reply);
    } catch (error) {
      console.error('Error sending message:', error);
      this.hideTypingIndicator();
      this.addChatMessage('bot', 'Sorry, I am having trouble connecting to the AI. Please try again later.');
    }
  }

  addChatMessage(sender, message) {
    const messagesContainer = document.getElementById('chatbotMessages');
    if (!messagesContainer) return;

    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}-message fade-in`;
    
    messageElement.innerHTML = `
      <div class="message-avatar">
        <i class="fas fa-${sender === 'bot' ? 'robot' : 'user'}"></i>
      </div>
      <div class="message-content">
        <p>${message.replace(/\n/g, '<br>')}</p>
      </div>
    `;

    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Store in chat history
    this.chatHistory.push({ sender, message, timestamp: new Date() });
  }

  showTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
      indicator.classList.add('active');
    }
  }

  hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
      indicator.classList.remove('active');
    }
  }

  generateAIResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Simple keyword-based responses (in real app, use actual AI API)
    if (message.includes('location') || message.includes('where')) {
      return "🗺️ I can help you find the best locations for your business! Use the location detector to get personalized recommendations based on foot traffic, competition, and local trends.";
    }
    
    if (message.includes('profit') || message.includes('money') || message.includes('earn')) {
      return "💰 Let's calculate your potential profits! The profit simulator can help you estimate earnings based on location, product type, and market conditions. Would you like me to open it for you?";
    }
    
    if (message.includes('trend') || message.includes('popular') || message.includes('selling')) {
      return "📈 Based on current trends, here are hot opportunities:\n\n🏏 Sports merchandise (Cricket season)\n🌧️ Monsoon essentials (Umbrellas, hot drinks)\n🎉 Festival items (Traditional sweets)\n💚 Health products (Fresh juices)\n\nWhich category interests you most?";
    }
    
    if (message.includes('partner') || message.includes('team') || message.includes('collaborate')) {
      return "🤝 Great idea! Partnerships can boost your business. I can help you find vendors who complement your offerings - like someone with a prime location looking for a product supplier, or vice versa. What resources do you have to offer?";
    }
    
    if (message.includes('help') || message.includes('how') || message.includes('start')) {
      return "🚀 I'm here to help you succeed! I can assist with:\n\n📍 Finding optimal locations\n💡 Identifying trending products\n📊 Calculating profit potential\n🤝 Finding business partners\n📋 Creating business plans\n\nWhat would you like to explore first?";
    }
    
    // Default responses
    const defaultResponses = [
      "That's an interesting question! Let me help you explore the best opportunities for your street vendor business. What specific area would you like to focus on?",
      "I understand you're looking to grow your business. Based on current you like to focus on?",
      "I understand you're looking to grow your business. Based on current market data, I can provide personalized recommendations. Tell me more about your current situation.",
      "Great question! As your AI business assistant, I have access to real-time market trends and location data. How can I help optimize your vendor strategy today?",
      "I'm analyzing the latest market trends for you. Street vending has great potential when you have the right location and products. What's your main interest - food, accessories, or services?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }

  // Action Card Handlers
  handleActionCard(action) {
    switch (action) {
      case 'location':
        this.showLocationModal();
        break;
      case 'profit':
        this.openProfitSimulator();
        break;
      case 'trends':
        this.showTrendsAnalysis();
        break;
      case 'partner':
        this.openPartnerMatching();
        break;
    }
  }

  openProfitSimulator() {
    // Create and show profit simulator modal
    this.showNotification('🧮 Profit Simulator coming soon! This will help you calculate potential earnings.', 'info');
    
    // Add to chatbot
    this.addChatMessage('bot', '🧮 Profit Simulator activated! Let me help you calculate potential earnings.\n\nPlease provide:\n• Product type\n• Expected daily customers\n• Price per item\n• Operating hours\n\nI\'ll calculate your profit potential!');
    this.toggleChatbot(true);
  }

  showTrendsAnalysis() {
    // Scroll to trends section
    document.querySelector('.trends-feed')?.scrollIntoView({ behavior: 'smooth' });
    this.showNotification('📈 Check out the live trends below!', 'info');
  }

  openPartnerMatching() {
    this.showNotification('🤝 Partner Matching feature coming soon! Connect with other vendors for collaboration.', 'info');
    
    this.addChatMessage('bot', '🤝 Partner Matching activated! I can help you find:\n\n👥 Vendors with complementary products\n🏪 Location partners (space sharing)\n🚚 Supply chain partners\n💼 Investment partners\n\nWhat type of partnership are you looking for?');
    this.toggleChatbot(true);
  }

  // Analysis and Recommendations
  startAnalysis() {
    this.showNotification('🔍 Starting AI analysis...', 'info');
    
    // Simulate analysis process
    setTimeout(() => {
      const analysis = this.generateMarketAnalysis();
      this.addChatMessage('bot', `🔍 Market Analysis Complete!\n\n${analysis}\n\nWould you like me to dive deeper into any of these insights?`);
      this.toggleChatbot(true);
    }, 2000);
  }

  generateMarketAnalysis() {
    const insights = [
      "📊 Current market shows 23% growth in street food sector",
      "🏆 Top performing categories: Beverages (35%), Snacks (28%), Accessories (18%)",
      "⏰ Peak hours: 8-10 AM, 12-2 PM, 6-8 PM",
      "📍 High-traffic areas have 60% higher profit margins",
      "🌟 Customer retention increases 40% with consistent quality"
    ];
    
    return insights.join('\n');
  }

  // Language Support
  changeLanguage(langCode) {
    // Simulate language change
    this.showNotification(`🌐 Language changed to ${this.getLanguageName(langCode)}`, 'success');
    
    // In real app, this would update all UI text
    console.log(`Language changed to: ${langCode}`);
  }

  getLanguageName(code) {
    const languages = {
      'en': 'English',
      'hi': 'Hindi',
      'kn': 'Kannada',
      'ta': 'Tamil'
    };
    return languages[code] || 'English';
  }

  // Background Animations and Effects
  startBackgroundAnimations() {
    // Add floating particles animation
    this.createFloatingParticles();
    
    // Add scroll-triggered animations
    this.setupScrollAnimations();
  }

  createFloatingParticles() {
    const container = document.querySelector('.floating-particles');
    if (!container) return;

    // Particles are handled by CSS animation
    // This could be enhanced with canvas-based particles for more complex effects
  }

  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
        }
      });
    }, observerOptions);

    // Observe elements for scroll animations
    document.querySelectorAll('.action-card, .trend-card').forEach(el => {
      observer.observe(el);
    });
  }

  // Utility Functions
  formatTime(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return `${Math.floor(minutes / 1440)}d ago`;
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--bg-secondary);
      color: var(--text-primary);
      padding: var(--space-md);
      border-radius: var(--radius-md);
      border-left: 4px solid var(--primary-cyan);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      z-index: 3000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 300px;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 4000);
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  window.vendorAI = new VendorAI();
  console.log('🚀 VendorAI Platform Initialized');
});

// Service Worker Registration for PWA (if needed)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
