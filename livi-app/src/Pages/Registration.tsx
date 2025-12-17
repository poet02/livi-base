import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button, Input, LoginContainer } from "./styles";
import { createUser } from "../helpers/apis";

interface RegistrationFormData {
  name: string;
  surname: string;
  email: string;
  mobile: string;
  password: string;
  confirm_password: string;
  country: string;
  country_code: string;
}

interface Country {
  name: string;
  code: string;
  dialingCode: string;
}

const COUNTRIES: Country[] = [
  { name: "South Africa", code: "ZA", dialingCode: "+27" },
];

export function Registration() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string>("");

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors }
  } = useForm<RegistrationFormData>({
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      mobile: "",
      password: "",
      confirm_password: "",
      country: "South Africa",
      country_code: "+27",
    },
    mode: "onChange"
  });

  const handleCountryChange = (countryName: string) => {
    const selectedCountry = COUNTRIES.find((c) => c.name === countryName);
    if (selectedCountry) {
      setValue("country", selectedCountry.name);
      setValue("country_code", selectedCountry.dialingCode);
    }
  };

  const onSubmit = async (data: RegistrationFormData) => {
    setLoading(true);
    setApiError("");

    try {
      const response = await createUser({
        name: data.name,
        surname: data.surname,
        // email: data.email,
        mobile: data.mobile,
        // password: data.password,
        // confirm_password: data.confirm_password,
        // country: data.country,
        countryCode: data.country_code,
      });

      if (response && response.accessToken) {
        localStorage.setItem("authToken", response.accessToken);
        navigate("/places");
      }
    } catch (err: any) {
      setApiError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <h2>Registration</h2>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%", maxWidth: "300px" }}>
        <div>
          <Input
            type="text"
            placeholder="Enter name"
            {...register("name", {
              required: "Name is required",
              minLength: { value: 3, message: "Name must be at least 3 characters" }
            })}
          />
          {errors.name && (
            <div style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
              {errors.name.message}
            </div>
          )}
        </div>

        <div>
          <Input
            type="text"
            placeholder="Enter surname"
            {...register("surname", {
              required: "Surname is required",
              minLength: { value: 2, message: "Surname must be at least 2 characters" }
            })}
          />
          {errors.surname && (
            <div style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
              {errors.surname.message}
            </div>
          )}
        </div>

        <div>
          <select
            {...register("country")}
            onChange={(e) => handleCountryChange(e.target.value)}
            style={{
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              width: "100%",
              fontSize: "16px",
              backgroundColor: "white",
              cursor: "pointer",
            }}
          >
            {COUNTRIES.map((country) => (
              <option key={country.code} value={country.name}>
                {country.name} ({country.dialingCode})
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", gap: "8px", width: "100%" }}>
          <Input
            type="text"
            {...register("country_code")}
            readOnly
            style={{ width: "80px", backgroundColor: "#f5f5f5" }}
          />
          <div style={{ flex: 1 }}>
            <Input
              type="tel"
              placeholder="Enter mobile"
              {...register("mobile", {
                required: "Mobile number is required",
                minLength: { value: 10, message: "Mobile number must be at least 10 digits" },
                pattern: { value: /^[0-9]+$/, message: "Mobile number must contain only digits" }
              })}
              style={{ width: "100%" }}
            />

          </div>
        </div>
        {errors.mobile && (
          <div style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
            {errors.mobile.message}
          </div>
        )}
        {apiError && (
          <div style={{ color: "red", fontSize: "14px", marginTop: "-8px" }}>
            {apiError}
          </div>
        )}

        <Button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </Button>
      </form>

      <div style={{ marginTop: "16px", fontSize: "14px" }}>
        Already have an account?{" "}
        <span
          onClick={() => navigate("/")}
          style={{ color: "#007bff", cursor: "pointer", textDecoration: "underline" }}
        >
          Login here
        </span>
      </div>
    </LoginContainer>
  );
}
