import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import RegistrationForm from "@/components/academy/RegistrationForm";
import EndpointStatusGrid from "@/components/academy/EndpointStatusGrid";
import RegistrationConsole from "@/components/academy/RegistrationConsole";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import Navbar from "@/components/landing/Navbar";
import { Terminal, FileText } from "lucide-react";

export default function AcademyRegistration() {
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["academy-registrations"] });

  const header = (
    <div className="px-6 pt-4 pb-3">
      <h1 className="text-[32px] leading-[1.2] font-bold text-[#f8fafc] font-display-telemetry">Academy Registration</h1>
      <p className="text-sm text-[#64748b] mt-1 font-body-telemetry">Enterprise telemetry console — live lead forwarding to serviceastomed</p>
    </div>
  );

  if (isMobile) {
    return (
      <div className="min-h-screen bg-[#0b0f17]">
        <Navbar />
        <div className="pt-16">
          {header}
          <Tabs defaultValue="form" className="w-full">
            <TabsList className="mx-4 grid grid-cols-2 bg-[#131a26] border border-[#212d40] rounded-[6px] h-10">
              <TabsTrigger value="form" className="text-[#f8fafc] data-[state=active]:bg-[#00f2fe]/10 data-[state=active]:text-[#00f2fe] font-body-telemetry text-sm">
                <FileText className="w-4 h-4 mr-1.5" /> Formulär
              </TabsTrigger>
              <TabsTrigger value="console" className="text-[#f8fafc] data-[state=active]:bg-[#00f2fe]/10 data-[state=active]:text-[#00f2fe] font-body-telemetry text-sm">
                <Terminal className="w-4 h-4 mr-1.5" /> Leads
              </TabsTrigger>
            </TabsList>
            <TabsContent value="form" className="mt-0 px-4">
              <div className="bg-[#131a26] border border-[#212d40] rounded-[6px] min-h-[60vh] flex flex-col">
                <RegistrationForm onSubmitted={refresh} />
              </div>
            </TabsContent>
            <TabsContent value="console" className="mt-0 px-4 pb-6 space-y-4">
              <EndpointStatusGrid />
              <RegistrationConsole />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f17]">
      <Navbar />
      <div className="pt-16">
        {header}
        <div className="flex gap-4 px-6 pb-6" style={{ height: "calc(100vh - 13rem)" }}>
          <div className="w-[420px] shrink-0 bg-[#131a26] border border-[#212d40] rounded-[6px] overflow-hidden flex flex-col">
            <RegistrationForm onSubmitted={refresh} />
          </div>
          <div className="flex-1 flex flex-col gap-4 min-w-0">
            <div>
              <EndpointStatusGrid />
            </div>
            <div className="flex-1 min-h-0">
              <RegistrationConsole />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}