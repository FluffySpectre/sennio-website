import React from 'react';
import './FakeLoadingScreen.css';

class FakeLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      currentStepIndex: -1,
      progress: 0,
      fadeOut: false
    };
    
    this.loadingSteps = [
      { message: 'Loading projects...', duration: 1000 },
      { message: 'Loading skills... None found', duration: 800 },
      { message: 'Searching for bugs...', duration: 500 },
      { message: 'Creating additional bugs...', duration: 300 },
      { message: 'Recalibrating flux capacitor...', duration: 600 },
      { message: 'Applying nostalgia filter...', duration: 500 },
    ];
    
    this.timers = [];
  }
  
  componentDidMount() {
    // Start loading process
    this.startLoading();
  }
  
  componentWillUnmount() {
    // Clean up all timers
    this.timers.forEach(timer => clearTimeout(timer));
  }
  
  startLoading = () => {
    // Delay the first step slightly
    this.timers.push(setTimeout(this.processNextStep, 500));
  }
  
  processNextStep = () => {
    const nextIndex = this.state.currentStepIndex + 1;
    
    if (nextIndex < this.loadingSteps.length) {
      // Update to the next step
      this.setState({
        currentStepIndex: nextIndex,
        progress: ((nextIndex + 1) / this.loadingSteps.length) * 100
      });
      
      // Schedule the next step based on the current step's duration
      const currentStep = this.loadingSteps[nextIndex];
      this.timers.push(setTimeout(this.processNextStep, currentStep.duration));
    } else {
      // All steps completed, wait a moment then start fade out
      this.timers.push(setTimeout(() => {
        this.setState({ fadeOut: true });
        
        // Call the completion callback after animation finishes
        if (this.props.onLoadComplete) {
          this.timers.push(setTimeout(this.props.onLoadComplete, 500));
        }
      }, 1200));
    }
  }
  
  getCurrentMessage() {
    if (this.state.currentStepIndex >= 0 && this.state.currentStepIndex < this.loadingSteps.length) {
      return this.loadingSteps[this.state.currentStepIndex].message;
    }
    return '';
  }
  
  render() {
    const { progress, fadeOut } = this.state;
    const currentMessage = this.getCurrentMessage();
    
    return (
      <div className={`FakeLoadingScreen ${fadeOut ? 'FadeOut' : ''}`}>
        <div className="ScanLines"></div>
        <div className="LoadingContent">
          <h1 className="LoadingTitle">LOADING...</h1>
          
          <div className="ProgressBarContainer PixelBorder">
            <div 
              className="ProgressBar" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="LoadingStep">
            {currentMessage && <span className="StepText"> {currentMessage}</span>}
          </div>
        </div>
      </div>
    );
  }
}

export default FakeLoadingScreen;
