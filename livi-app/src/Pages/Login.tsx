import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, LoginContainer } from "./styles";
import { useAuth } from "../context/AuthContext";
import styled from "styled-components";

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error.main};
  font-size: ${props => props.theme.typography.fontSize.sm};
  margin-top: ${props => props.theme.spacing.sm};
  text-align: center;
`;

const InfoMessage = styled.div`
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  margin-top: ${props => props.theme.spacing.sm};
  text-align: center;
`;

const OTPInput = styled(Input)`
  text-align: center;
  letter-spacing: 0.5em;
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
`;

export function Login() {
  const navigate = useNavigate();
  const { requestOTP, verifyOTP, isLoading } = useAuth();
  
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const handleRequestOTP = async () => {
    if (mobile.trim().length < 9) {
      setError("Please enter a valid mobile number");
      return;
    }

    setError("");
    setInfo("");
    
    try {
      await requestOTP(mobile);
      setStep("otp");
      setInfo("OTP sent! Use 123456 for development.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send OTP. Please try again.";
      setError(message);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.trim().length !== 6) {
      setError("Please enter a 6-digit OTP");
      return;
    }

    setError("");
    setInfo("");

    try {
      await verifyOTP(mobile, otp);
      // Navigate to app after successful login
      navigate("/properties");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid OTP. Please try again.";
      setError(message);
    }
  };

  const handleBack = () => {
    setStep("mobile");
    setOtp("");
    setError("");
    setInfo("");
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") {
      action();
    }
  };

  return (
    <LoginContainer>
      <h2>Login</h2>
      
      {step === "mobile" ? (
        <>
          <Input
            type="tel"
            placeholder="Enter mobile number"
            value={mobile}
            onChange={(e) => {
              setMobile(e.target.value);
              setError("");
            }}
            onKeyPress={(e) => handleKeyPress(e, handleRequestOTP)}
            disabled={isLoading}
          />
          <Button 
            onClick={handleRequestOTP}
            disabled={isLoading || mobile.trim().length < 9}
          >
            {isLoading ? "Sending OTP..." : "Request OTP"}
          </Button>
        </>
      ) : (
        <>
          <InfoMessage>
            OTP sent to {mobile}
          </InfoMessage>
          <OTPInput
            type="text"
            placeholder="000000"
            value={otp}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 6);
              setOtp(value);
              setError("");
            }}
            onKeyPress={(e) => handleKeyPress(e, handleVerifyOTP)}
            disabled={isLoading}
            maxLength={6}
          />
          <Button 
            onClick={handleVerifyOTP}
            disabled={isLoading || otp.length !== 6}
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </Button>
          <Button 
            onClick={handleBack}
            disabled={isLoading}
            style={{ marginTop: "8px", background: "transparent", color: "inherit" }}
          >
            Change Mobile Number
          </Button>
        </>
      )}

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {info && <InfoMessage>{info}</InfoMessage>}
    </LoginContainer>
  );
}
