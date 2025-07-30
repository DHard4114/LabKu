export {};

declare global {
  interface Window {
    biodataPrint?: () => void;
    biodataSave?: () => void;
    biodataClear?: () => void;
  }
}
