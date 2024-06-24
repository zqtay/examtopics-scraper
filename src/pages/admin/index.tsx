import Accordion from "@/components/ui/accordion";
import Toggle from "@/components/ui/toggle";
import { ChangeEvent, useEffect, useState } from "react";

const Admin = () => {
  const [scraper, setScraper] = useState<any>();

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
    fetch("/api/admin/scraper").then(res => res.json()).then(setScraper);
  }, []);

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