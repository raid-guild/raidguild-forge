import localFont from "next/font/local";

export const maziusReview = localFont({
  src: "../../public/fonts/MAZIUSREVIEW20.09-Regular.woff",
  variable: "--font-display-review",
  display: "swap",
});

export const maziusDisplay = localFont({
  src: "../../public/fonts/MaziusDisplay-Bold.otf",
  variable: "--font-display",
  display: "swap",
});

export const ebGaramond = localFont({
  src: [
    {
      path: "../../public/fonts/EBGaramond-VariableFont_wght.ttf",
      style: "normal",
    },
    {
      path: "../../public/fonts/EBGaramond-Italic-VariableFont_wght.ttf",
      style: "italic",
    },
  ],
  variable: "--font-body",
  display: "swap",
});
