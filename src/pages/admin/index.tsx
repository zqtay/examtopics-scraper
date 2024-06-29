import Accordion from "@/components/ui/accordion";
import InputText from "@/components/ui/inputtext";
import TextArea from "@/components/ui/textarea";
import Toggle from "@/components/ui/toggle";
import { AdminScraperSettings } from "@/types/settings";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";

type AdminScraperInput = {
  access: string;
  whitelistPaths: string;
  allowedRoles: string;
};

const Admin = () => {
  const { data: session, status: sessionStatus } = useSession();
  const [scraper, setScraper] = useState<AdminScraperInput>();
  const [inProgress, setInProgress] = useState<boolean>(false);
  const router = useRouter();

  const handleSave = async () => {
    setInProgress(true);
    try {
      const data = {
        ...scraper!,
        whitelistPaths: JSON.parse(scraper!.whitelistPaths),
        allowedRoles: JSON.parse(scraper!.allowedRoles)
      };
      // Update backend
      await fetch("/api/admin/scraper", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.error(error);
    }
    await fetchData();
    setInProgress(false);
  };

  const fetchData = async () => {
    const res = await fetch("/api/admin/scraper");
    const data = await res.json();
    setScraper({
      ...data,
      whitelistPaths: JSON.stringify(data.whitelistPaths),
      allowedRoles: JSON.stringify(data.allowedRoles)
    });
  };

  useEffect(() => {
    if (sessionStatus === "loading") return;
    if (session?.user?.role !== "admin") return;
    fetchData();
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
      <div className="w-full flex flex-col gap-4">
        <InputText
          label={"Access level"}
          value={scraper?.access}
          onChange={e => setScraper(prev => ({ ...prev!, access: e.target.value }))}
          placeholder="public, restricted, none"
        />
        <TextArea
          label={"Whitelisted URL paths"}
          value={scraper?.whitelistPaths}
          onChange={e => setScraper(prev => ({ ...prev!, whitelistPaths: e.target.value }))}
          placeholder={`["assets"]`}
        />
        <TextArea
          label={"Allowed roles"}
          value={scraper?.allowedRoles}
          onChange={e => setScraper(prev => ({ ...prev!, allowedRoles: e.target.value }))}
          placeholder={`["admin"]`}
        />
      </div>
      <button
        className="button-default mt-4 w-full"
        onClick={handleSave}
        disabled={inProgress}
      >
        Save
      </button>
    </Accordion>
  </div>;
};

export default Admin;