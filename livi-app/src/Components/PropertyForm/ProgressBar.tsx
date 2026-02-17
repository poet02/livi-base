import { Check } from 'lucide-react';
import {
  ProgressContainer,
  ProgressSteps,
  ProgressLine,
  Step,
  StepCircle,
  StepLabel,
} from './ProgressBar.styled';

interface StepInfo {
  number: number;
  label: string;
}

interface ProgressBarProps {
  steps: StepInfo[];
  currentStep: number;
  completedSteps: number[];
  onStepClick: (step: number) => void;
}

export function ProgressBar({ steps, currentStep, completedSteps, onStepClick }: ProgressBarProps) {
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <ProgressContainer>
      <ProgressSteps>
        <ProgressLine progress={progress} />
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = completedSteps.includes(stepNumber);
          const isClickable = isCompleted || stepNumber < currentStep;

          return (
            <Step
              key={step.number}
              isActive={isActive}
              isCompleted={isCompleted}
              isClickable={isClickable}
              onClick={() => isClickable && onStepClick(stepNumber)}
              type="button"
            >
              <StepCircle isActive={isActive} isCompleted={isCompleted}>
                {isCompleted ? (
                  <Check size={20} />
                ) : (
                  step.number
                )}
              </StepCircle>
              <StepLabel isActive={isActive} isCompleted={isCompleted}>
                {step.label}
              </StepLabel>
            </Step>
          );
        })}
      </ProgressSteps>
    </ProgressContainer>
  );
}

