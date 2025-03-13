import React from "react";

class ParticlesBackground extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.particles = [];
    this.animationFrameId = null;
    this.lastFrameTime = 0;
    this.resizeTimeout = null;
    this.isVisible = true;
    this.rafCallbackQueued = false;
    
    this.options = {
      background: {
        color: {
          value: "transparent",
        },
      },
      fpsLimit: 30,
      particles: {
        number: {
          value: 100,
          densityArea: 800 * 600, // Reference area for scaling
          maxCount: 300, // Hard limit on particles
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "out",
          },
          random: true,
          speed: 0.2,
          straight: false,
        },
        opacity: {
          animation: {
            enable: true,
            speed: 0.5,
            sync: false,
          },
          value: { min: 0, max: 0.7 },
        },
        size: {
          value: { min: 2, max: 5 },
        },
        shape: {
          type: "square",
        },
      },
      responsive: {
        enableResize: true,
        delay: 250,
        quality: "medium", // low, medium, high
      },
      performance: {
        reduceOnBlur: true,
        pauseOnHidden: true,
      }
    };

    // Override with custom options if provided
    if (props.options) {
      this.options = this.mergeOptions(this.options, props.options);
    }
    
    // Set quality factors based on the quality setting
    this.setQualityFactors(this.options.responsive.quality);
  }

  // Set factors based on quality level
  setQualityFactors = (quality) => {
    switch(quality) {
      case "low":
        this.pixelRatioLimit = 1;
        this.particleDensityFactor = 0.5;
        break;
      case "medium":
        this.pixelRatioLimit = 1.5;
        this.particleDensityFactor = 0.75;
        break;
      case "high":
        this.pixelRatioLimit = window.devicePixelRatio || 1;
        this.particleDensityFactor = 1;
        break;
      default:
        this.pixelRatioLimit = 1.5;
        this.particleDensityFactor = 0.75;
    }
  }

  mergeOptions = (defaultOptions, customOptions) => {
    const merged = { ...defaultOptions };
    
    Object.keys(customOptions).forEach(key => {
      if (
        typeof customOptions[key] === 'object' && 
        customOptions[key] !== null &&
        !Array.isArray(customOptions[key])
      ) {
        merged[key] = this.mergeOptions(defaultOptions[key] || {}, customOptions[key]);
      } else {
        merged[key] = customOptions[key];
      }
    });
    
    return merged;
  };

  componentDidMount() {
    this.canvas = this.canvasRef.current;
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext("2d", {
      alpha: true,
      desynchronized: true // Enable desynchronized hint for potential performance boost
    });
    
    // Initial setup
    this.setupCanvas();
    
    // Initialize particles
    this.initParticles();
    
    // Add event listeners for visibility and performance management
    if (this.options.performance.pauseOnHidden) {
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
    }
    
    if (this.options.responsive.enableResize) {
      // Use a passive event listener for resize to improve performance
      window.addEventListener("resize", this.debouncedResizeCanvas, { passive: true });
      window.addEventListener("orientationchange", this.handleOrientationChange, { passive: true });
    }
    
    // Start animation loop
    this.startAnimation();
  }

  componentWillUnmount() {
    this.stopAnimation();
    
    // Clean up event listeners
    if (this.options.responsive.enableResize) {
      window.removeEventListener("resize", this.debouncedResizeCanvas);
      window.removeEventListener("orientationchange", this.handleOrientationChange);
    }
    
    if (this.options.performance.pauseOnHidden) {
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }
    
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    
    // Clear references
    this.particles = [];
    this.ctx = null;
    this.canvas = null;
  }
  
  // Handle visibility changes for better performance
  handleVisibilityChange = () => {
    if (document.hidden) {
      this.isVisible = false;
      this.stopAnimation();
    } else {
      this.isVisible = true;
      this.startAnimation();
    }
  };
  
  // Handle orientation changes
  handleOrientationChange = () => {
    this.stopAnimation();
    
    // Wait for the orientation change to complete
    setTimeout(() => {
      this.setupCanvas();
      this.startAnimation();
    }, 300);
  };
  
  // Debounced resize with throttling
  debouncedResizeCanvas = () => {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    
    // Only handle resize if no resize is in progress
    if (!this.isResizing) {
      this.isResizing = true;
      
      // Immediate low-quality resize for responsiveness
      this.setupCanvasSize(true);
      
      // Delayed high-quality resize after user finishes resizing
      this.resizeTimeout = setTimeout(() => {
        this.setupCanvas();
        this.isResizing = false;
      }, this.options.responsive.delay);
    }
  };

  // Quick resize that only updates canvas size but not particles
  setupCanvasSize = (lowQuality = false) => {
    const canvas = this.canvasRef.current;
    if (!canvas) return;
    
    const container = canvas.parentElement;
    if (!container) return;
    
    // Get container dimensions
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    
    // Use a lower pixel ratio during resizing for better performance
    const pixelRatio = lowQuality ? 1 : Math.min(window.devicePixelRatio || 1, this.pixelRatioLimit);
    
    // Update canvas display size
    canvas.style.width = `${containerWidth}px`;
    canvas.style.height = `${containerHeight}px`;
    
    // Update canvas buffer size
    canvas.width = containerWidth * pixelRatio;
    canvas.height = containerHeight * pixelRatio;
    
    // Apply scaling
    const ctx = this.ctx;
    if (ctx) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(pixelRatio, pixelRatio);
    }
    
    // Store dimensions
    this.containerWidth = containerWidth;
    this.containerHeight = containerHeight;
  };

  setupCanvas = () => {
    this.setupCanvasSize();
    
    // If dimensions aren't set yet, exit
    if (!this.containerWidth || !this.containerHeight) return;
    
    // Only reinitialize particles if significant size change
    const particlesDensity = this.calculateParticleCount();
    if (Math.abs(particlesDensity - this.particles.length) > 10) {
      this.initParticles();
    }
  };

  calculateParticleCount = () => {
    if (!this.containerWidth || !this.containerHeight) return 0;
    
    // Calculate particles based on area to maintain consistent density
    const area = this.containerWidth * this.containerHeight;
    const baseArea = this.options.particles.number.densityArea;
    const density = this.options.particles.number.value / baseArea;
    const adjustedCount = Math.ceil(area * density * this.particleDensityFactor);
    
    // Cap particle count to prevent performance issues
    return Math.min(adjustedCount, this.options.particles.number.maxCount);
  };

  getRandomValue = (range) => {
    if (typeof range === 'object' && range !== null) {
      const min = range.min !== undefined ? range.min : 0;
      const max = range.max !== undefined ? range.max : 1;
      return Math.random() * (max - min) + min;
    }
    return range;
  };

  initParticles = () => {
    // Clear existing particles
    this.particles = [];
    
    // If dimensions aren't set yet, exit
    if (!this.containerWidth || !this.containerHeight) return;
    
    const particleCount = this.calculateParticleCount();
    const moveSpeed = this.options.particles.move.speed;
    const opacityRange = this.options.particles.opacity.value;
    const sizeRange = this.options.particles.size.value;
    const opacityAnimEnabled = this.options.particles.opacity.animation.enable;
    const opacityAnimSpeed = this.options.particles.opacity.animation.speed / 100;
    
    // Pre-allocate particles array for better memory management
    this.particles = new Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      const size = this.getRandomValue(sizeRange);
      const opacity = this.getRandomValue(opacityRange);
      
      // Calculate velocity
      let vx = 0;
      let vy = 0;
      
      if (this.options.particles.move.random) {
        const angle = Math.random() * Math.PI * 2;
        const speed = this.options.particles.move.straight ? 
          moveSpeed : 
          moveSpeed * Math.random();
        
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed;
      } else {
        vx = (Math.random() - 0.5) * moveSpeed * 2;
        vy = (Math.random() - 0.5) * moveSpeed * 2;
      }
      
      this.particles[i] = {
        x: Math.random() * this.containerWidth,
        y: Math.random() * this.containerHeight,
        size: size,
        speedX: vx,
        speedY: vy,
        opacity: opacity,
        opacityDirection: Math.random() > 0.5 ? 1 : -1,
        opacitySpeed: opacityAnimEnabled ? opacityAnimSpeed : 0,
      };
    }
  };

  // Reset a particle when it goes out of bounds instead of creating a new one
  resetParticle = (particle) => {
    particle.x = Math.random() * this.containerWidth;
    particle.y = Math.random() * this.containerHeight;
    particle.size = this.getRandomValue(this.options.particles.size.value);
    particle.opacity = this.getRandomValue(this.options.particles.opacity.value);
    particle.opacityDirection = Math.random() > 0.5 ? 1 : -1;
    // Keep the same speed to avoid recalculation
    return particle;
  };

  startAnimation = () => {
    if (!this.rafCallbackQueued && this.isVisible) {
      this.rafCallbackQueued = true;
      this.animationFrameId = requestAnimationFrame(this.animate);
    }
  };
  
  stopAnimation = () => {
    this.rafCallbackQueued = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  };

  animate = (timestamp) => {
    this.rafCallbackQueued = false;
    
    // FPS limiting
    const frameInterval = 1000 / this.options.fpsLimit;
    const elapsed = timestamp - this.lastFrameTime;
    
    if (elapsed < frameInterval) {
      this.startAnimation();
      return;
    }
    
    // Update time tracking with a smoothing factor
    this.lastFrameTime = timestamp - (elapsed % frameInterval);
    
    const ctx = this.ctx;
    
    // Safety check for context and dimensions
    if (!ctx || !this.containerWidth || !this.containerHeight || !this.isVisible) {
      this.startAnimation();
      return;
    }
    
    // Clear canvas - only clear what's needed
    ctx.clearRect(0, 0, this.containerWidth, this.containerHeight);
    
    // Use local variables to reduce property lookups
    const move = this.options.particles.move;
    const opacity = this.options.particles.opacity;
    const opacityMin = opacity.value.min;
    const opacityMax = opacity.value.max;
    const isMovementEnabled = move.enable;
    const isOpacityAnimEnabled = opacity.animation.enable;
    const outMode = move.outModes.default;
    
    // Update and draw particles in a single loop
    const len = this.particles.length;
    for (let i = 0; i < len; i++) {
      const particle = this.particles[i];
      
      // Only move particles if movement is enabled
      if (isMovementEnabled) {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Handle out-of-bounds particles
        if (outMode === "out") {
          if (
            particle.x < -particle.size ||
            particle.x > this.containerWidth + particle.size ||
            particle.y < -particle.size ||
            particle.y > this.containerHeight + particle.size
          ) {
            // Reset particle position instead of creating a new one
            this.resetParticle(particle);
          }
        }
      }
      
      // Update opacity animation if enabled (less frequently for better performance)
      if (isOpacityAnimEnabled && i % 2 === 0) {
        particle.opacity += particle.opacitySpeed * particle.opacityDirection;
        if (particle.opacity > opacityMax) {
          particle.opacity = opacityMax;
          particle.opacityDirection = -1;
        } else if (particle.opacity < opacityMin) {
          particle.opacity = opacityMin;
          particle.opacityDirection = 1;
        }
      }
      
      // Draw square particle - batch drawing would be better but not easily applicable here
      const opacity = Math.max(0, Math.min(particle.opacity, 1)); // Clamp opacity
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      
      // Only calculate half-size once
      const halfSize = particle.size / 2;
      ctx.fillRect(
        particle.x - halfSize,
        particle.y - halfSize,
        particle.size,
        particle.size
      );
    }
    
    // Continue animation loop
    this.startAnimation();
  };

  render() {
    return (
      <canvas
        ref={this.canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          background: this.options.background.color.value,
          pointerEvents: "none"
        }}
      />
    );
  }
}

export default ParticlesBackground;
