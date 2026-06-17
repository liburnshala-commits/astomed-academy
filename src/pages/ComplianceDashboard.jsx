import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowLeft, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ComplianceStatusBar from "@/components/compliance/ComplianceStatusBar";
import EquipmentTab from "@/components/compliance/EquipmentTab";
import ServiceLogTab from "@/components/compliance/ServiceLogTab";
import StaffCertTab from "@/components/compliance/StaffCertTab";
import DocumentTab from "@/components/compliance/DocumentTab";
import IncidentTab from "@/components/compliance/IncidentTab";

export default function ComplianceDashboard() {
  const { data: equipment = [] } = useQuery({
    queryKey: ["equipment"],
    queryFn: () => base44.entities.Equipment.list(),
  });

  const { data: serviceLogs = [] } = useQuery({
    queryKey: ["serviceLogs"],
    queryFn: () => base44.entities.ServiceLog.list("-service_date"),
  });

  const { data: certifications = [] } = useQuery({
    queryKey: ["certifications"],
    queryFn: () => base44.entities.StaffCertification.list(),
  });

  const { data: documents = [] } = useQuery({
    queryKey: ["complianceDocs"],
    queryFn: () => base44.entities.ComplianceDocument.list(),
  });

  const { data: incidents = [] } = useQuery({
    queryKey: ["incidents"],
    queryFn: () => base44.entities.Incident.list("-incident_date"),
  });

  const openIncidents = incidents.filter((i) => i.status !== "closed").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-primary-foreground" />
              </div>
            </Link>
            <div className="h-6 w-px bg-border" />
            <h1 className="font-heading text-lg font-semibold">Compliance-dashboard</h1>
          </div>
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <ArrowLeft className="w-4 h-4" />
              Till hemsidan
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Status overview */}
        <ComplianceStatusBar
          equipment={equipment}
          serviceLogs={serviceLogs}
          certifications={certifications}
          documents={documents}
          incidents={incidents}
        />

        {/* Tabs */}
        <Tabs defaultValue="equipment">
          <TabsList className="mb-6 flex-wrap h-auto gap-1">
            <TabsTrigger value="equipment">Utrustning ({equipment.length})</TabsTrigger>
            <TabsTrigger value="service">Servicelogg ({serviceLogs.length})</TabsTrigger>
            <TabsTrigger value="staff">Personal ({certifications.length})</TabsTrigger>
            <TabsTrigger value="documents">Dokument ({documents.length})</TabsTrigger>
            <TabsTrigger value="incidents" className="relative">
              Avvikelser ({incidents.length})
              {openIncidents > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-[9px] font-bold rounded-full bg-red-500 text-white">
                  {openIncidents}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="equipment">
            <EquipmentTab equipment={equipment} />
          </TabsContent>
          <TabsContent value="service">
            <ServiceLogTab serviceLogs={serviceLogs} equipment={equipment} />
          </TabsContent>
          <TabsContent value="staff">
            <StaffCertTab certifications={certifications} equipment={equipment} />
          </TabsContent>
          <TabsContent value="documents">
            <DocumentTab documents={documents} />
          </TabsContent>
          <TabsContent value="incidents">
            <IncidentTab incidents={incidents} equipment={equipment} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}