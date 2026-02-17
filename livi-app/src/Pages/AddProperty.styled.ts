import styled, { css } from 'styled-components';
import { Button as BaseButton } from '../styles/common';
import { mobileFirst } from '../styles/responsive';
import type { Theme } from '../theme/theme';

export const Container = styled.div`
  height: 95vh;
  background: ${props => props.theme.colors.background.paper};
  padding-bottom: ${props => props.theme.spacing.xl};
  overflow-y: auto;
  overflow-x: hidden; /* Prevent horizontal scrolling */
  width: 100%;
  max-width: 100%;
  color: ${props => props.theme.colors.text.primary};
`;

export const Header = styled.div`
  background: ${props => props.theme.colors.background.default};
  padding: ${props => props.theme.spacing.base} ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.base};
`;

export const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: ${props => props.theme.borderRadius.full};
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color ${props => props.theme.transitions.base};

  &:hover {
    background: ${props => props.theme.colors.grey[100]};
  }

  svg {
    width: 24px;
    height: 24px;
    color: ${props => props.theme.colors.text.primary};
  }
`;

export const Title = styled.h1`
  margin: 0;
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
`;

export const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.lg};
`;

export const Form = styled.form`
  background: ${props => props.theme.colors.background.default};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.base};
  margin-top: ${props => props.theme.spacing.xl};
  padding: ${props => props.theme.spacing.xl};
  transition: ${props => props.theme.transitions.base};
`;

export const FormActions = styled.div`
  display: flex;
  gap: ${(props: { theme: Theme }) => props.theme.spacing.sm}; /* Smaller gap on mobile */
  justify-content: space-between;
  margin-top: ${(props: { theme: Theme }) => props.theme.spacing.lg}; /* Smaller margin on mobile */
  padding-top: ${(props: { theme: Theme }) => props.theme.spacing.lg}; /* Smaller padding on mobile */
  border-top: 1px solid ${(props: { theme: Theme }) => props.theme.colors.border.light};
  flex-wrap: wrap; /* Allow buttons to wrap on very small screens */
  
  ${mobileFirst.tablet(css`
    gap: ${(props: { theme: Theme }) => props.theme.spacing.base};
    margin-top: ${(props: { theme: Theme }) => props.theme.spacing.xl};
    padding-top: ${(props: { theme: Theme }) => props.theme.spacing.xl};
    flex-wrap: nowrap;
  `)}
`;

export const Button = styled(BaseButton)`
  padding: ${(props: { theme: Theme }) => props.theme.spacing.sm} ${(props: { theme: Theme }) => props.theme.spacing.base}; /* Smaller padding on mobile */
  font-size: ${(props: { theme: Theme }) => props.theme.typography.fontSize.sm}; /* Smaller font on mobile */
  min-height: 40px; /* Smaller min-height on mobile */
  
  ${mobileFirst.tablet(css`
    padding: ${(props: { theme: Theme }) => props.theme.spacing.md} ${(props: { theme: Theme }) => props.theme.spacing.lg};
    font-size: ${(props: { theme: Theme }) => props.theme.typography.fontSize.base};
    min-height: 44px;
  `)}
  
  ${mobileFirst.desktop(css`
    padding: ${(props: { theme: Theme }) => props.theme.spacing.md} ${(props: { theme: Theme }) => props.theme.spacing.xl};
    min-height: 48px;
  `)}
`;

export const SuccessMessage = styled.div`
  background: ${props => props.theme.colors.success.main};
  color: ${props => props.theme.colors.success.contrast};
  padding: ${props => props.theme.spacing.base};
  border-radius: ${props => props.theme.borderRadius.base};
  margin-bottom: ${props => props.theme.spacing.base};
  text-align: center;
`;

export const UploadProgress = styled.div`
  background: ${props => props.theme.colors.primary.main}15;
  border: 1px solid ${props => props.theme.colors.primary.main}40;
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.base};
  margin-bottom: ${props => props.theme.spacing.base};
  text-align: center;
  color: ${props => props.theme.colors.text.primary};
`;

export const ProgressBarContainer = styled.div`
  margin-top: ${props => props.theme.spacing.sm};
  width: 100%;
`;

export const ProgressBarFill = styled.div<{ progress: number }>`
  width: 100%;
  height: 8px;
  background: ${props => props.theme.colors.grey[200]};
  border-radius: ${props => props.theme.borderRadius.full};
  overflow: hidden;
  margin-top: ${props => props.theme.spacing.xs};

  &::after {
    content: '';
    display: block;
    width: ${props => props.progress}%;
    height: 100%;
    background: ${props => props.theme.colors.primary.main};
    transition: width 0.3s ease;
  }
`;

export const StatusStep = styled.div<{ completed: boolean; active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.xs};
  color: ${props => {
    if (props.completed) return props.theme.colors.success.main;
    if (props.active) return props.theme.colors.primary.main;
    return props.theme.colors.text.secondary;
  }};
  font-size: ${props => props.theme.typography.fontSize.sm};
`;

export const UploadError = styled.div`
  background: ${props => props.theme.colors.error.main}15;
  border: 1px solid ${props => props.theme.colors.error.main}40;
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.base};
  margin-bottom: ${props => props.theme.spacing.base};
  text-align: center;
  color: ${props => props.theme.colors.error.main};
`;

export const ProgressContainer = styled.div`
  background: ${props => props.theme.colors.background.default};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.base};
  margin-top: ${props => props.theme.spacing.xl};
  padding: ${props => props.theme.spacing.xl};
  text-align: center;
  color: ${props => props.theme.colors.text.primary};
`;

export const ProgressStep = styled.div<{ $active: boolean; $completed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.md};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.$completed ? props.theme.colors.success.main : (props.$active ? props.theme.colors.primary.main : props.theme.colors.text.disabled)};
  svg {
    color: ${props => props.$completed ? props.theme.colors.success.main : (props.$active ? props.theme.colors.primary.main : props.theme.colors.grey[400])};
  }
`;

export const ProgressBarBackground = styled.div`
  height: 8px;
  background-color: ${props => props.theme.colors.grey[200]};
  border-radius: 4px;
  margin-top: ${props => props.theme.spacing.sm};
`;

