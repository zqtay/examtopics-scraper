import Accordion from "@/components/ui/accordion";
import Toggle from "@/components/ui/toggle";
import { AdminScraperSettings } from "@/types/settings";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";

const Admin = () => {
  const { data: session, status: sessionStatus } = useSession();
  const [scraper, setScraper] = useState<AdminScraperSettings>();
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const updated = { ...scraper, enabled: e.target.checked };
    // Update backend
    fetch("/api/admin/scraper", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updated)
    });
    setScraper(updated);
  };

  useEffect(() => {
    if (sessionStatus === "loading") return;
    if (session?.user?.role !== "admin") return;
    fetch("/api/admin/scraper").then(res => res.json()).then(setScraper);
  }, [sessionStatus, session]);

  if (sessionStatus === "loading") {
    return <></>;
  } else if (!session) {
    router.push("/api/auth/signin?callbackUrl=/admin");
    return <></>;
  } if (session?.user?.role !== "admin") {
    return <>Unauthorized</>;
  }

  return <div>
    <div className="text-xl font-semibold mb-2">Admin</div>
    <Accordion label={"Scraper"}>
      <div className="w-full">
        <Toggle
          label={"Enable scraper"}
          checked={scraper?.enabled}
          onChange={handleChange}
        />
      </div>
    </Accordion>
  </div>;
};

export default Admin;