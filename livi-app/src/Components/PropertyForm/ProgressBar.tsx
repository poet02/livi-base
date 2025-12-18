import styled from 'styled-components';
import { Check } from 'lucide-react';

const ProgressContainer = styled.div`
  background: ${props => props.theme.colors.background.default};
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
`;

const ProgressSteps = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 20px;
    left: 0;
    right: 0;
    height: 2px;
    background: ${props => props.theme.colors.border.light};
    z-index: 0;
  }
`;

const ProgressLine = styled.div<{ progress: number }>`
  position: absolute;
  top: 20px;
  left: 0;
  height: 2px;
  background: ${props => props.theme.colors.primary.main};
  z-index: 1;
  transition: width 0.3s ease;
  width: ${props => props.progress}%;
`;

const Step = styled.button<{ isActive: boolean; isCompleted: boolean; isClickable: boolean }>`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  background: none;
  border: none;
  cursor: ${props => props.isClickable ? 'pointer' : 'default'};
  padding: ${props => props.theme.spacing.sm};
  transition: all ${props => props.theme.transitions.base};

  &:hover {
    ${props => props.isClickable && `
      transform: translateY(-2px);
    `}
  }
`;

const StepCircle = styled.div<{ isActive: boolean; isCompleted: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: ${props => props.theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  font-size: ${props => props.theme.typography.fontSize.sm};
  transition: all ${props => props.theme.transitions.base};
  background: ${props => {
    if (props.isCompleted) return props.theme.colors.primary.main;
    if (props.isActive) return props.theme.colors.primary.main;
    return props.theme.colors.background.paper;
  }};
  color: ${props => {
    if (props.isCompleted || props.isActive) return props.theme.colors.primary.contrast;
    return props.theme.colors.text.secondary;
  }};
  border: 2px solid ${props => {
    if (props.isCompleted || props.isActive) return props.theme.colors.primary.main;
    return props.theme.colors.border.light;
  }};
`;

const StepLabel = styled.span<{ isActive: boolean; isCompleted: boolean }>`
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.isActive ? props.theme.typography.fontWeight.semibold : props.theme.typography.fontWeight.normal};
  color: ${props => {
    if (props.isActive) return props.theme.colors.primary.main;
    if (props.isCompleted) return props.theme.colors.text.primary;
    return props.theme.colors.text.secondary;
  }};
  text-align: center;
  white-space: nowrap;
`;

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

