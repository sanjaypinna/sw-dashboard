import { Dashboard } from "@/components/dashboard";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export default function Home() {
  return (
    <main>
      <Suspense
        fallback={
          <div className="m-auto w-full h-full">
            {" "}
            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />.
          </div>
        }
      >
        <Dashboard />
      </Suspense>
    </main>
  );
}
