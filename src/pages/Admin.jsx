import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, ArrowLeft, GraduationCap } from "lucide-react";
import StatsOverview from "@/components/admin/StatsOverview";
import ModuleRow from "@/components/admin/ModuleRow";
import ModuleForm from "@/components/admin/ModuleForm";

export default function Admin() {
  const [showForm, setShowForm] = useState(false);
  const [editModule, setEditModule] = useState(null);
  const queryClient = useQueryClient();

  const { data: modules, isLoading } = useQuery({
    queryKey: ["modules"],
    queryFn: () => base44.entities.Module.list("module_number"),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Module.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules"] });
      setShowForm(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Module.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules"] });
      setShowForm(false);
      setEditModule(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Module.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["modules"] }),
  });

  const handleSave = (data) => {
    if (editModule) {
      updateMutation.mutate({ id: editModule.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleStatusChange = (id, field, value) => {
    updateMutation.mutate({ id, data: { [field]: value } });
  };

  const handleEdit = (module) => {
    setEditModule(module);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditModule(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Admin header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-primary-foreground" />
              </div>
            </Link>
            <div className="h-6 w-px bg-border" />
            <h1 className="font-heading text-lg font-semibold">Produktionspanel</h1>
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
        <StatsOverview modules={modules} />

        {/* Timeline */}
        <div className="bg-card rounded-xl border border-border/50 p-6">
          <h2 className="font-heading text-lg font-semibold mb-4">Tidsplan</h2>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 border border-accent/20">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span className="text-sm font-medium">23 juni: Inspelningsdag</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted border border-border">
              <div className="w-2 h-2 rounded-full bg-muted-foreground/50" />
              <span className="text-sm text-muted-foreground">Lanseringsdatum: TBD</span>
            </div>
          </div>
        </div>

        {/* Modules table */}
        <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
          <div className="p-6 flex items-center justify-between border-b border-border/50">
            <h2 className="font-heading text-lg font-semibold">Moduler</h2>
            <Button
              size="sm"
              className="bg-primary text-primary-foreground gap-2"
              onClick={() => { setEditModule(null); setShowForm(true); }}
            >
              <Plus className="w-4 h-4" />
              Ny modul
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="font-semibold">Modul</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Manus</TableHead>
                  <TableHead className="font-semibold">Inspelning</TableHead>
                  <TableHead className="font-semibold">PDF</TableHead>
                  <TableHead className="font-semibold">Pris</TableHead>
                  <TableHead className="font-semibold w-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <td colSpan={7} className="py-12 text-center text-muted-foreground">Laddar...</td>
                  </TableRow>
                ) : modules.length === 0 ? (
                  <TableRow>
                    <td colSpan={7} className="py-12 text-center text-muted-foreground">
                      Inga moduler ännu. Klicka "Ny modul" för att börja.
                    </td>
                  </TableRow>
                ) : (
                  modules.map((module) => (
                    <ModuleRow
                      key={module.id}
                      module={module}
                      onEdit={handleEdit}
                      onDelete={(id) => deleteMutation.mutate(id)}
                      onStatusChange={handleStatusChange}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {showForm && (
        <ModuleForm
          open={showForm}
          onClose={handleClose}
          onSave={handleSave}
          module={editModule}
        />
      )}
    </div>
  );
}