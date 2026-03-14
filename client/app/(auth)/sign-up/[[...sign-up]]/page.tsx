import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <SignUp
      appearance={{
        variables: {
          colorBackground:        "#0f0f0f",
          colorText:              "#e8e6e1",
          colorPrimary:           "#e8ff47",
          colorInputBackground:   "#1a1a1a",
          colorInputText:         "#e8e6e1",
          borderRadius:           "2px",
          fontFamily:             "var(--font-syne)",
        },
        elements: {
          card:              "border border-[#1e1e1e] shadow-none",
          headerTitle:       "text-[#e8e6e1] font-display",
          headerSubtitle:    "text-[#555]",
          formButtonPrimary: "bg-[#e8ff47] text-[#0a0a0a] hover:bg-[#d4eb3a] font-bold",
          footerActionLink:  "text-[#e8ff47] hover:text-[#d4eb3a]",
        },
      }}
    />
  );
}