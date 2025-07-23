import { notify } from "./helpers";

// Country service for fetching country data with dial codes
export class CountryService {
  static async getCountries() {
    try {
      const response = await fetch(
        "https://restcountries.com/v3.1/all?fields=name,cca2,cca3,idd,flag,flags"
      );
      const data = await response.json();

      // Filter and format countries with dial codes
      const countries = data
        .filter(
          (country) => country.idd?.root && country.idd?.suffixes?.length > 0
        )
        .map((country) => ({
          code: country.cca2,
          name: country.name.common,
          dialCode: country.idd.root + (country.idd.suffixes[0] || ""),
          flag: country.flag,
          flagUrl: country.flags.png,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      return countries;
    } catch (error) {
      console.error("Error fetching countries:", error);
      notify.error("Failed to load countries. Please refresh the page.");
      return [];
    }
  }

  static getCountryByCode(countries, code) {
    return countries.find((country) => country.code === code);
  }

  static formatPhoneNumber(countryCode, phoneNumber) {
    const country = countryCode;
    return `${country}${phoneNumber}`;
  }
}

// OTP service for simulating OTP operations
export class OTPService {
  static otpStorage = new Map();

  static async sendOTP(phoneNumber) {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        try {
          // Generate 6-digit OTP
          const otp = Math.floor(100000 + Math.random() * 900000).toString();

          // Store OTP with expiration (5 minutes)
          const expiresAt = Date.now() + 5 * 60 * 1000;
          this.otpStorage.set(phoneNumber, { otp, expiresAt });

          // In a real app, this would send SMS
          console.log(`OTP for ${phoneNumber}: ${otp}`); // For development

          // Show success toast with OTP for testing
          notify.success(`OTP sent to ${phoneNumber}`, {
            duration: 3000,
          });

          // Show a separate toast with the OTP for testing purposes
          setTimeout(() => {
            notify.custom(
              (t) => (
                <div className="bg-white text-info-foreground rounded-3xl p-4 shadow-elevation-3 border border-outline-variant max-w-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-info-foreground/20 flex items-center justify-center">
                      <span className="text-sm font-mono">🔑</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Test OTP Code</p>
                      <p className="text-xs opacity-90">For development only</p>
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-info-foreground/10 rounded-2xl">
                    <p className="text-center font-mono text-lg font-bold tracking-widest">
                      {otp}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(otp);
                      notify.success("OTP copied to clipboard!", {
                        duration: 1500,
                      });
                    }}
                    className="w-full mt-3 text-xs bg-info-foreground/20 hover:bg-info-foreground/30 rounded-xl py-2 transition-colors"
                  >
                    Click to copy
                  </button>
                </div>
              ),
              {
                duration: 8000,
                position: "bottom-left",
              }
            );
          }, 500);

          resolve({
            success: true,
            message: "OTP sent successfully",
            // In development, we'll return the OTP for testing
            ...(process.env.NODE_ENV === "development" && { otp }),
          });
        } catch (error) {
          reject({
            success: false,
            message: "Failed to send OTP",
          });
        }
      }, 1500); // Simulate network delay
    });
  }

  static async verifyOTP(phoneNumber, otp) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const storedData = this.otpStorage.get(phoneNumber);

          if (!storedData) {
            reject({
              success: false,
              message: "No OTP found. Please request a new one.",
            });
            return;
          }

          if (Date.now() > storedData.expiresAt) {
            this.otpStorage.delete(phoneNumber);
            reject({
              success: false,
              message: "OTP has expired. Please request a new one.",
            });
            return;
          }

          if (storedData.otp !== otp) {
            reject({
              success: false,
              message: "Invalid OTP. Please try again.",
            });
            return;
          }

          // OTP verified successfully
          this.otpStorage.delete(phoneNumber);

          resolve({
            success: true,
            message: "OTP verified successfully",
          });
        } catch (error) {
          reject({
            success: false,
            message: "Verification failed. Please try again.",
          });
        }
      }, 1000);
    });
  }

  static async resendOTP(phoneNumber) {
    // Clear existing OTP
    this.otpStorage.delete(phoneNumber);

    // Send new OTP
    return this.sendOTP(phoneNumber);
  }

  static clearOTP(phoneNumber) {
    this.otpStorage.delete(phoneNumber);
  }
}

// Authentication service for simulating user operations
export class AuthService {
  static users = new Map(); // Simulate user database

  static async checkUserExists(phoneNumber) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const exists = this.users.has(phoneNumber);
        resolve({ exists });
      }, 500);
    });
  }

  static async registerUser(userData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const { countryCode, phoneNumber, firstName, lastName, email } =
            userData;
          const fullPhoneNumber = `${countryCode}${phoneNumber}`;

          if (this.users.has(fullPhoneNumber)) {
            reject({
              success: false,
              message: "User already exists with this phone number",
            });
            return;
          }

          const user = {
            id: Date.now().toString(),
            phoneNumber: fullPhoneNumber,
            firstName,
            lastName,
            email: email || null,
            createdAt: new Date().toISOString(),
            isVerified: true,
          };

          this.users.set(fullPhoneNumber, user);

          resolve({
            success: true,
            message: "Account created successfully",
            user,
          });
        } catch (error) {
          reject({
            success: false,
            message: "Registration failed. Please try again.",
          });
        }
      }, 1000);
    });
  }

  static async loginUser(phoneNumber) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const user = this.users.get(phoneNumber);

          if (!user) {
            reject({
              success: false,
              message: "No account found with this phone number",
            });
            return;
          }

          resolve({
            success: true,
            message: "Login successful",
            user,
          });
        } catch (error) {
          reject({
            success: false,
            message: "Login failed. Please try again.",
          });
        }
      }, 1000);
    });
  }

  static async logout() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "Logged out successfully",
        });
      }, 500);
    });
  }
}
