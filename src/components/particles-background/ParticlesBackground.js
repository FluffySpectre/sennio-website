import React from "react";

class ParticlesBackground extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.particles = [];
    this.animationFrameId = null;
    this.lastFrameTime = 0;
    this.resizeTimeout = null;
    this.lastResizeWidth = 0;
    this.lastResizeHeight = 0;
    this.resizeThreshold = 50;
    
    this.options = {
      background: {
        color: {
          value: "transparent",
        },
      },
      fpsLimit: 60,
      particles: {
        number: {
          value: 100,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "out",
          },
          random: true,
          speed: 0.1,
          straight: false,
        },
        opacity: {
          animation: {
            enable: true,
            speed: 1,
            sync: false,
          },
          value: { min: 0, max: 1 },
        },
        size: {
          value: { min: 2, max: 5 },
        },
        shape: {
          type: "square",
        },
      },
    };

    // Override with custom options if provided
    if (props.options) {
      this.options = this.mergeOptions(this.options, props.options);
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
    this.ctx = this.canvas.getContext("2d");
    
    // Initial setup
    this.setupCanvas();
    
    // Add orientationchange listener for mobile devices
    window.addEventListener("orientationchange", this.handleOrientationChange);
    
    // Use a more stable event for resizing
    window.addEventListener("resize", this.debouncedResizeCanvas);
    
    // Initialize particles and start animation
    this.initParticles();
    this.animate(0);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.debouncedResizeCanvas);
    window.removeEventListener("orientationchange", this.handleOrientationChange);
    cancelAnimationFrame(this.animationFrameId);
    
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
  }
  
  // Handle orientation changes explicitly for mobile
  handleOrientationChange = () => {
    // Wait for the orientation change to complete
    setTimeout(() => {
      this.setupCanvas();
      this.initParticles();
    }, 300);
  };
  
  // Debounced resize function to avoid too many calls
  debouncedResizeCanvas = () => {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    
    this.resizeTimeout = setTimeout(() => {
      this.setupCanvas();
    }, 250); // 250ms delay
  };

  setupCanvas = () => {
    const canvas = this.canvasRef.current;
    if (!canvas) return;
    
    const container = canvas.parentElement;
    
    // Get the full container dimensions
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    
    // Check if size has changed significantly
    const widthChanged = Math.abs(containerWidth - this.lastResizeWidth) > this.resizeThreshold;
    const heightChanged = Math.abs(containerHeight - this.lastResizeHeight) > this.resizeThreshold;
    const significantChange = widthChanged || heightChanged;
    
    // Store current dimensions
    this.lastResizeWidth = containerWidth;
    this.lastResizeHeight = containerHeight;
    
    // Get the device pixel ratio for high DPI displays
    const pixelRatio = window.devicePixelRatio || 1;
    
    // Set the canvas size to match the container
    canvas.style.width = `${containerWidth}px`;
    canvas.style.height = `${containerHeight}px`;
    
    // Set the canvas buffer size accounting for pixel ratio
    canvas.width = containerWidth * pixelRatio;
    canvas.height = containerHeight * pixelRatio;
    
    // Scale the context to account for the pixel ratio
    const ctx = this.ctx;
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
    ctx.scale(pixelRatio, pixelRatio);
    
    // Store dimensions for calculations
    this.containerWidth = containerWidth;
    this.containerHeight = containerHeight;
    
    // Only reinitialize particles if there was a significant size change
    if (significantChange && this.particles.length > 0) {
      this.initParticles();
    }
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
    this.particles = [];
    
    // If dimensions aren't set yet, exit
    if (!this.containerWidth || !this.containerHeight) return;
    
    // Calculate particles based on area to maintain consistent density
    const area = this.containerWidth * this.containerHeight;
    const baseArea = 1920 * 1080; // Reference area for default particle count
    const density = this.options.particles.number.value / baseArea;
    const adjustedCount = Math.ceil(area * density);
    
    // Cap particle count to prevent performance issues on very large containers
    const maxParticles = 500;
    const particleCount = Math.min(adjustedCount, maxParticles);
    
    const moveSpeed = this.options.particles.move.speed;
    const opacityRange = this.options.particles.opacity.value;
    const sizeRange = this.options.particles.size.value;
    const opacityAnimEnabled = this.options.particles.opacity.animation.enable;
    const opacityAnimSpeed = this.options.particles.opacity.animation.speed / 100;
    
    for (let i = 0; i < particleCount; i++) {
      const size = this.getRandomValue(sizeRange);
      const opacity = this.getRandomValue(opacityRange);
      
      // Calculate speed based on options
      let vx = 0;
      let vy = 0;
      
      // Random direction if enabled
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
      
      this.particles.push({
        x: Math.random() * this.containerWidth,
        y: Math.random() * this.containerHeight,
        size: size,
        speedX: vx,
        speedY: vy,
        opacity: opacity,
        opacityDirection: Math.random() > 0.5 ? 1 : -1,
        opacitySpeed: opacityAnimEnabled ? opacityAnimSpeed : 0,
      });
    }
  };

  animate = (timestamp) => {
    // FPS limiting
    const frameInterval = 1000 / this.options.fpsLimit;
    if (timestamp - this.lastFrameTime < frameInterval) {
      this.animationFrameId = requestAnimationFrame(this.animate);
      return;
    }
    this.lastFrameTime = timestamp;
    
    const ctx = this.ctx;
    
    // Safety check for context and dimensions
    if (!ctx || !this.containerWidth || !this.containerHeight) {
      this.animationFrameId = requestAnimationFrame(this.animate);
      return;
    }
    
    // Clear canvas
    ctx.clearRect(0, 0, this.containerWidth, this.containerHeight);
    
    // Update and draw particles
    this.particles.forEach((particle, index) => {
      // Only move particles if movement is enabled
      if (this.options.particles.move.enable) {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Handle out-of-bounds particles
        const outMode = this.options.particles.move.outModes.default;
        
        if (outMode === "out") {
          if (
            particle.x < 0 ||
            particle.x > this.containerWidth ||
            particle.y < 0 ||
            particle.y > this.containerHeight
          ) {
            // Reset particle position
            this.particles[index] = {
              x: Math.random() * this.containerWidth,
              y: Math.random() * this.containerHeight,
              size: this.getRandomValue(this.options.particles.size.value),
              speedX: particle.speedX,
              speedY: particle.speedY,
              opacity: this.getRandomValue(this.options.particles.opacity.value),
              opacityDirection: Math.random() > 0.5 ? 1 : -1,
              opacitySpeed: particle.opacitySpeed,
            };
          }
        }
      }
      
      // Update opacity animation if enabled
      if (this.options.particles.opacity.animation.enable) {
        particle.opacity += particle.opacitySpeed * particle.opacityDirection;
        if (particle.opacity > this.options.particles.opacity.value.max) {
          particle.opacity = this.options.particles.opacity.value.max;
          particle.opacityDirection = -1;
        } else if (particle.opacity < this.options.particles.opacity.value.min) {
          particle.opacity = this.options.particles.opacity.value.min;
          particle.opacityDirection = 1;
        }
      }
      
      // Draw square particle
      ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
      const halfSize = particle.size / 2;
      ctx.fillRect(
        particle.x - halfSize,
        particle.y - halfSize,
        particle.size,
        particle.size
      );
    });
    
    // Continue animation loop
    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  render() {
    return (
      <canvas
        ref={this.canvasRef}
        style={{
          position: "absolute",
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
