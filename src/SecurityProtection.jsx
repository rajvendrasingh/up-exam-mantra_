import { useEffect } from 'react';

export default function SecurityProtection({ isAdmin }) {
  useEffect(() => {
    // Admin ke liye security disable
    if (isAdmin) {
      console.log("🔓 Security disabled for admin");
      
      // Remove all security CSS for admin
      const adminStyle = document.createElement('style');
      adminStyle.id = 'admin-override-style';
      adminStyle.textContent = `
        body.admin-mode *,
        body.admin-mode input,
        body.admin-mode textarea,
        body.admin-mode div,
        body.admin-mode span,
        body.admin-mode p,
        body.admin-mode h1,
        body.admin-mode h2,
        body.admin-mode h3,
        body.admin-mode h4,
        body.admin-mode h5,
        body.admin-mode h6 {
          user-select: text !important;
          -webkit-user-select: text !important;
          -moz-user-select: text !important;
          -ms-user-select: text !important;
          -webkit-touch-callout: default !important;
        }
      `;
      document.head.appendChild(adminStyle);
      
      return () => {
        const style = document.getElementById('admin-override-style');
        if (style) style.remove();
      };
    }

    console.log("🔒 Security protection enabled");

    // 1. Disable Right Click
    const handleContextMenu = (e) => {
      e.preventDefault();
      showSecurityAlert("Right-click is disabled for security reasons");
      return false;
    };

    // 2. Disable Copy/Cut/Paste
    const handleCopy = (e) => {
      e.preventDefault();
      showSecurityAlert("Copy is disabled for security reasons");
      return false;
    };

    const handleCut = (e) => {
      e.preventDefault();
      showSecurityAlert("Cut is disabled for security reasons");
      return false;
    };

    const handlePaste = (e) => {
      e.preventDefault();
      return false;
    };

    // 3. Disable Text Selection
    const handleSelectStart = (e) => {
      e.preventDefault();
      return false;
    };

    // 4. Disable DevTools (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U)
    const handleKeyDown = (e) => {
      // F12
      if (e.keyCode === 123) {
        e.preventDefault();
        showSecurityAlert("Developer tools are disabled");
        return false;
      }
      
      // Ctrl+Shift+I (Inspect)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        e.preventDefault();
        showSecurityAlert("Developer tools are disabled");
        return false;
      }
      
      // Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
        e.preventDefault();
        showSecurityAlert("Developer tools are disabled");
        return false;
      }
      
      // Ctrl+Shift+C (Inspect Element)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
        e.preventDefault();
        showSecurityAlert("Developer tools are disabled");
        return false;
      }
      
      // Ctrl+U (View Source)
      if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
        showSecurityAlert("View source is disabled");
        return false;
      }

      // Ctrl+S (Save Page)
      if (e.ctrlKey && e.keyCode === 83) {
        e.preventDefault();
        showSecurityAlert("Save page is disabled");
        return false;
      }

      // Ctrl+P (Print)
      if (e.ctrlKey && e.keyCode === 80) {
        e.preventDefault();
        showSecurityAlert("Print is disabled");
        return false;
      }

      // Ctrl+C (Copy)
      if (e.ctrlKey && e.keyCode === 67) {
        e.preventDefault();
        showSecurityAlert("Copy is disabled");
        return false;
      }

      // Ctrl+X (Cut)
      if (e.ctrlKey && e.keyCode === 88) {
        e.preventDefault();
        showSecurityAlert("Cut is disabled");
        return false;
      }

      // Print Screen
      if (e.keyCode === 44) {
        e.preventDefault();
        showSecurityAlert("Screenshot is disabled");
        return false;
      }
    };

    // 5. Disable Drag and Drop
    const handleDragStart = (e) => {
      e.preventDefault();
      return false;
    };

    // 6. Detect DevTools Opening (Less aggressive)
    const detectDevTools = () => {
      const threshold = 200; // Increased threshold to reduce false positives
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      // Only trigger if BOTH conditions are met (more strict)
      if (widthThreshold && heightThreshold) {
        // Show warning instead of blocking completely
        const existingWarning = document.getElementById('devtools-warning');
        if (!existingWarning) {
          const warning = document.createElement('div');
          warning.id = 'devtools-warning';
          warning.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
            padding: 15px;
            text-align: center;
            z-index: 999999;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
          `;
          warning.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
              <span style="font-size: 1.2rem;">⚠️</span>
              <span>Developer tools detected. Please close them for better experience.</span>
              <button onclick="this.parentElement.parentElement.remove()" style="
                background: white;
                color: #ef4444;
                border: none;
                padding: 5px 15px;
                border-radius: 5px;
                cursor: pointer;
                font-weight: 600;
                margin-left: 10px;
              ">Dismiss</button>
            </div>
          `;
          document.body.appendChild(warning);
        }
      }
    };

    // Show security alert
    const showSecurityAlert = (message) => {
      // Create alert element
      const alert = document.createElement('div');
      alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
        z-index: 999999;
        font-weight: 600;
        animation: slideIn 0.3s ease-out;
        display: flex;
        align-items: center;
        gap: 10px;
      `;
      alert.innerHTML = `
        <span style="font-size: 1.2rem;">🔒</span>
        <span>${message}</span>
      `;
      document.body.appendChild(alert);
      
      setTimeout(() => {
        alert.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => alert.remove(), 300);
      }, 3000);
    };

    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
      * {
        user-select: none !important;
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        -webkit-touch-callout: none !important;
      }
      input, textarea {
        user-select: text !important;
        -webkit-user-select: text !important;
      }
      body {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
      }
      /* Mobile Screenshot Protection */
      @media screen {
        body::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: -1;
        }
      }
      /* Prevent screenshot on mobile */
      html {
        -webkit-user-select: none;
        -webkit-touch-callout: none;
        -webkit-tap-highlight-color: transparent;
      }
    `;
    document.head.appendChild(style);

    // Add all event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCut);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);

    // Mobile Screenshot Detection (Less aggressive)
    let lastVisibilityChange = Date.now();
    const handleVisibilityChange = () => {
      if (document.hidden) {
        lastVisibilityChange = Date.now();
      } else {
        const timeDiff = Date.now() - lastVisibilityChange;
        // Only trigger if very quick (< 50ms) and not first load
        if (timeDiff < 50 && timeDiff > 0 && lastVisibilityChange > 0) {
          showSecurityAlert("Screenshot attempt detected!");
          // Blur the content temporarily
          document.body.style.filter = 'blur(10px)';
          setTimeout(() => {
            document.body.style.filter = 'none';
          }, 1000);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Detect screenshot on mobile using touch events (Less aggressive)
    let touchStartTime = 0;
    let touchCount = 0;
    const handleTouchStart = (e) => {
      touchStartTime = Date.now();
      touchCount++;
      // Only prevent if 3+ touches (very unlikely normal usage)
      if (e.touches.length >= 3) {
        e.preventDefault();
        showSecurityAlert("Multi-touch detected!");
      }
    };

    const handleTouchEnd = () => {
      // Removed aggressive detection
      touchCount = 0;
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    // Prevent long press on mobile (Less aggressive)
    const handleTouchMove = (e) => {
      // Only prevent if 3+ touches
      if (e.touches.length >= 3) {
        e.preventDefault();
      }
    };
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    // Disable screenshot via CSS on mobile browsers
    document.body.style.cssText += `
      -webkit-user-select: none;
      -webkit-touch-callout: none;
      -webkit-tap-highlight-color: transparent;
    `;

    // Check for DevTools every 3 seconds (less frequent)
    const devToolsInterval = setInterval(detectDevTools, 3000);

    // Disable console (but keep errors visible for debugging)
    if (!isAdmin) {
      const originalLog = console.log;
      const originalWarn = console.warn;
      const originalInfo = console.info;
      const originalDebug = console.debug;
      
      console.log = () => {};
      console.warn = () => {};
      console.info = () => {};
      console.debug = () => {};
      // Keep console.error for critical issues
    }

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCut);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      clearInterval(devToolsInterval);
      style.remove();
    };
  }, [isAdmin]);

  return null;
}
