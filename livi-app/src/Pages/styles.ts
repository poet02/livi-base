import styled from "styled-components";
import { Input as BaseInput, Button as BaseButton } from "../styles/common";
import { media } from "../styles/common";

// ----- Styled Components -----
export const Container = styled.div`
  font-family: ${props => props.theme.typography.fontFamily.primary};
  display: flex;
  flex-direction: column;
`;

export const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  gap: ${props => props.theme.spacing.base};
  padding: ${props => props.theme.spacing.xl};
`;

// Use common Input component with customization
export const Input = styled(BaseInput)`
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.md};
`;

export const SearchAdress = styled(BaseInput)`
  padding: ${props => props.theme.spacing.md};
  width: 100%;
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.md};
`;

// Use common Button component with customization
export const Button = styled(BaseButton)`
  width: 100%;
  max-width: 300px;
`;

export const Page = styled.div`
  flex: 1;
  justify-content: center;
  justify-items: center;
  color: ${props => props.theme.colors.text.primary};
`;

export const BottomTabs = styled.div`
  display: flex;
  justify-content: space-around;
  border-top: 1px solid ${props => props.theme.colors.border.light};
`;

export const Tab = styled.div`
  flex: 1;
  text-align: center;
  cursor: pointer;
`;

export const PageContainer = styled.div`
  height: 100vh;
  overflow-y: auto;
`;

export const PageHeader = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
  text-align: center;
`;

export const PageTitle = styled.h1`
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.typography.fontSize['4xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
`;

export const PageSubtitle = styled.p`
  margin: 0;
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.lg};
`;

export const TilesGrid = styled.div<{
  columns: number;
  gap: string;
}>`
  display: grid;
  grid-template-columns: repeat(${props => props.columns}, 1fr);
  gap: ${props => props.gap};
  max-width: 1200px;
  margin: 0 auto;

  ${media.lg`
    grid-template-columns: repeat(3, 1fr);
  `}

  ${media.md`
    grid-template-columns: repeat(2, 1fr);
  `}

  ${media.xs`
    grid-template-columns: 1fr;
  `}
`;

export const Icon = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.text.primary};
  border-radius: ${props => props.theme.borderRadius.full};
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color ${props => props.theme.transitions.base};

  &:hover {
    background: ${props => props.theme.colors.grey[100]};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;