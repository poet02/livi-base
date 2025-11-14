import styled from "styled-components";

// ----- Styled Components -----
export const Container = styled.div`
  font-family: sans-serif;
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

export const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  gap: 16px;
  padding: 20px;
`;

export const Input = styled.input`
  padding: 12px;
  width: 100%;
  max-width: 300px;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

export const Button = styled.button`
  padding: 12px;
  width: 100%;
  max-width: 300px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

export const Page = styled.div`
  flex: 1;
  padding: 20px;
`;

export const BottomTabs = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  border-top: 1px solid #ddd;
`;

export const Tab = styled.div`
  flex: 1;
  text-align: center;
  cursor: pointer;
  padding: 10px;
`;