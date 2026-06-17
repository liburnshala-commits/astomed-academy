import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowLeft, GraduationCap, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ComplianceStatusBar from "@/components/compliance/ComplianceStatusBar";
import EquipmentTab from "@/components/compliance/EquipmentTab";
import ServiceLogTab from "@/components/compliance/ServiceLogTab";
import StaffCertTab from "@/components/compliance/StaffCertTab";

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
        />

        {/* Tabs */}
        <Tabs defaultValue="equipment">
          <TabsList className="mb-6">
            <TabsTrigger value="equipment">Utrustning ({equipment.length})</TabsTrigger>
            <TabsTrigger value="service">Servicelogg ({serviceLogs.length})</TabsTrigger>
            <TabsTrigger value="staff">Personal & behörigheter ({certifications.length})</TabsTrigger>
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
        </Tabs>
      </div>
    </div>
  );
}