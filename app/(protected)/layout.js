import { ProtectedLayout } from "@/components/layouts/protected-layout";

export default function Layout({ children }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
