import styled from 'styled-components';
import { Section as BaseSection, SectionTitle as BaseSectionTitle, Button as BaseButton } from '../styles/common';
import type { Theme } from '../theme/theme';

export const Container = styled.div`
  height: 95vh;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  max-width: 100%;
  background: ${props => props.theme.colors.background.default};
  color: ${props => props.theme.colors.text.primary};
`;

export const Header = styled.div`
  position: relative;
  height: 400px;
  overflow: hidden;
  cursor: pointer;
`;

export const BackButton = styled.button`
  position: absolute;
  top: ${props => props.theme.spacing.base};
  left: ${props => props.theme.spacing.base};
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: ${props => props.theme.borderRadius.full};
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all ${props => props.theme.transitions.base};

  &:hover {
    background: white;
    transform: scale(1.05);
  }

  svg {
    width: 24px;
    height: 24px;
    color: ${props => props.theme.colors.text.primary};
  }
`;

export const PropertyImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform ${props => props.theme.transitions.slow};

  &:hover {
    transform: scale(1.02);
  }
`;

export const ImageOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  padding: ${props => props.theme.spacing.xl} ${props => props.theme.spacing.lg} ${props => props.theme.spacing.lg};
  color: white;
  pointer-events: none;
`;

export const Price = styled.h1`
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
  font-size: ${props => props.theme.typography.fontSize['3xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
`;

export const Title = styled.h2`
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
`;

export const Address = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.typography.fontSize.base};
  opacity: 0.9;

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const Content = styled.div`
  padding: ${props => props.theme.responsive.spacing.containerPadding.mobile};
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  
  @media (min-width: ${(props: { theme: Theme }) => props.theme.breakpoints.sm}) {
    padding: ${(props: { theme: Theme }) => props.theme.responsive.spacing.containerPadding.tablet};
  }
  
  @media (min-width: ${(props: { theme: Theme }) => props.theme.breakpoints.md}) {
    padding: ${(props: { theme: Theme }) => props.theme.spacing.xl} ${(props: { theme: Theme }) => props.theme.spacing.lg};
  }
`;

export const Section = styled(BaseSection)`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

export const SectionTitle = styled(BaseSectionTitle)`
  margin: 0 0 ${props => props.theme.spacing.base} 0;
  font-size: ${props => props.theme.typography.fontSize.xl};
`;

export const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${(props: { theme: Theme }) => props.theme.spacing.sm};
  margin-bottom: ${(props: { theme: Theme }) => props.theme.spacing.xl};
  width: 100%;

  @media (min-width: ${(props: { theme: Theme }) => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(4, 1fr);
    gap: ${(props: { theme: Theme }) => props.theme.spacing.base};
  }
`;

export const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${props => props.theme.spacing.base};
  background: ${props => props.theme.colors.grey[50]};
  border-radius: ${props => props.theme.borderRadius.md};
  text-align: center;
`;

export const DetailIcon = styled.div`
  color: ${props => props.theme.colors.primary.main};
  margin-bottom: ${props => props.theme.spacing.sm};

  svg {
    width: 24px;
    height: 24px;
  }
`;

export const DetailValue = styled.span`
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  font-size: ${props => props.theme.typography.fontSize.lg};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

export const DetailLabel = styled.span`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
`;

export const Description = styled.p`
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
  color: ${props => props.theme.colors.text.secondary};
  margin: 0;
`;

export const AmenitiesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${(props: { theme: Theme }) => props.theme.spacing.sm};
  width: 100%;

  @media (min-width: ${(props: { theme: Theme }) => props.theme.breakpoints.sm}) {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: ${(props: { theme: Theme }) => props.theme.spacing.base};
  }
  
  @media (min-width: ${(props: { theme: Theme }) => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: ${(props: { theme: Theme }) => props.theme.spacing.md};
  }
`;

export const AmenityItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} 0;
`;

export const ActionBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${props => props.theme.colors.background.default};
  border-top: 1px solid ${props => props.theme.colors.border.light};
  padding: ${props => props.theme.spacing.base} ${props => props.theme.spacing.lg};
  display: flex;
  gap: ${props => props.theme.spacing.base};
  z-index: ${props => props.theme.zIndex.fixed};
`;

export const ActionButton = styled(BaseButton)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.colors.background.default};
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.md};
  width: 48px;
  height: 48px;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};

  &:hover {
    background: ${props => props.theme.colors.grey[100]};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const GalleryModal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: ${props => props.theme.zIndex.modal};
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const CloseGalleryButton = styled.button`
  position: absolute;
  top: ${props => props.theme.spacing.xl};
  right: ${props => props.theme.spacing.xl};
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: ${props => props.theme.borderRadius.full};
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: ${props => props.theme.zIndex.modal + 1};
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  transition: all ${props => props.theme.transitions.base};

  &:hover {
    background: white;
    transform: scale(1.05);
  }
`;

export const GalleryContainer = styled.div`
  width: 90%;
  max-width: 1200px;
  height: 90vh;

  .image-gallery {
    height: 100%;
  }

  .image-gallery-slide-wrapper {
    height: calc(100% - 100px);
  }

  .image-gallery-slide {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .image-gallery-image {
    max-height: 80vh;
    object-fit: contain;
  }

  .image-gallery-thumbnails-wrapper {
    height: 100px;
  }
`;

