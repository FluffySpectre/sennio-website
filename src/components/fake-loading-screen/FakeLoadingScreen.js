import React from 'react';
import { withTranslation } from 'react-i18next';
import './FakeLoadingScreen.css';

class FakeLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    
    const t = props.t;

    this.state = {
      currentStepIndex: -1,
      progress: 0,
      fadeOut: false
    };
    
    this.loadingSteps = [
      { message: t("fakeLoadingScreen.loadingStep1"), duration: 1000 },
      { message: t("fakeLoadingScreen.loadingStep2"), duration: 800 },
      { message: t("fakeLoadingScreen.loadingStep3"), duration: 500 },
      { message: t("fakeLoadingScreen.loadingStep4"), duration: 300 },
      { message: t("fakeLoadingScreen.loadingStep5"), duration: 600 },
      // { message: t("fakeLoadingScreen.loadingStep6"), duration: 500 },
    ];
    
    this.timers = [];
  }
  
  componentDidMount() {
    this.startLoading();
  }
  
  componentWillUnmount() {
    // cleanup all timers
    this.timers.forEach(timer => clearTimeout(timer));
  }
  
  startLoading = () => {
    // delay the first step slightly
    this.timers.push(setTimeout(this.processNextStep, 100));
  }
  
  processNextStep = () => {
    const nextIndex = this.state.currentStepIndex + 1;
    
    if (nextIndex < this.loadingSteps.length) {
      // update to the next step
      this.setState({
        currentStepIndex: nextIndex,
        progress: ((nextIndex + 1) / this.loadingSteps.length) * 100
      });
      
      // schedule the next step based on the current step's duration
      const currentStep = this.loadingSteps[nextIndex];
      this.timers.push(setTimeout(this.processNextStep, currentStep.duration));
    } else {
      // all steps completed, wait a moment then start fade out
      this.timers.push(setTimeout(() => {
        this.setState({ fadeOut: true });
        
        // call the completion callback after animation finishes
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
          <div className="LoadingTitle">
            {currentMessage && <span>{currentMessage}</span>}
          </div>
          
          <div className="ProgressBarContainer PixelBorder">
            <div 
              className="ProgressBar" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(FakeLoadingScreen);
