import { useEffect } from "react";

export const UmamiAnalytics = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cloud.umami.is/script.js";
    script.async = true;
    script.setAttribute("data-website-id", "2c292220-ba5e-498c-a3f8-f0f77ca71134");

    document.body.appendChild(script);

    // Cleanup
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
}