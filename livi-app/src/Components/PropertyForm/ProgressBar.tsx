import styled from 'styled-components';
import { Check } from 'lucide-react';

const ProgressContainer = styled.div`
  background: ${props => props.theme.colors.background.default};
  padding: ${props => props.theme.spacing.sm};
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
  width: 100%;
  overflow-x: hidden;
  
  @media (min-width: ${(props: any) => props.theme.breakpoints.sm}) {
    padding: ${(props: any) => props.theme.spacing.base};
  }
  
  @media (min-width: ${(props: any) => props.theme.breakpoints.md}) {
    padding: ${(props: any) => props.theme.spacing.lg};
  }
`;

const ProgressSteps = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 100%;
  width: 100%;
  margin: 0 auto;
  position: relative;
  padding: 0 ${props => props.theme.spacing.xs};

  &::before {
    content: '';
    position: absolute;
    top: 20px;
    left: ${props => props.theme.spacing.xs};
    right: ${props => props.theme.spacing.xs};
    height: 2px;
    background: ${props => props.theme.colors.border.light};
    z-index: 0;
  }
  
  @media (min-width: ${(props: any) => props.theme.breakpoints.sm}) {
    max-width: 800px;
    padding: 0;
    
    &::before {
      left: 0;
      right: 0;
    }
  }
`;

const ProgressLine = styled.div<{ progress: number }>`
  position: absolute;
  top: 20px;
  left: ${props => props.theme.spacing.xs};
  right: ${props => props.theme.spacing.xs};
  height: 2px;
  background: ${props => props.theme.colors.primary.main};
  z-index: 1;
  transition: width 0.3s ease;
  width: calc(${props => props.progress}% - ${props => props.theme.spacing.xs} * 2);
  
  @media (min-width: ${(props: any) => props.theme.breakpoints.sm}) {
    left: 0;
    right: 0;
    width: ${(props: any) => props.progress}%;
  }
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
  width: 32px;
  height: 32px;
  border-radius: ${props => props.theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  font-size: ${props => props.theme.typography.fontSize.xs};
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
  
  @media (min-width: ${(props: any) => props.theme.breakpoints.sm}) {
    width: 36px;
    height: 36px;
    font-size: ${(props: any) => props.theme.typography.fontSize.sm};
  }
  
  @media (min-width: ${(props: any) => props.theme.breakpoints.md}) {
    width: 40px;
    height: 40px;
  }
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
  
  /* Hide labels on very small screens, show on tablet+ */
  display: none;
  
  @media (min-width: ${(props: any) => props.theme.breakpoints.sm}) {
    display: block;
  }
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

