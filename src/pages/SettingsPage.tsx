import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Download, Trash2, Shield, LogOut } from "lucide-react";
import { toast } from "sonner";

const SettingsPage = () => {
  const navigate = useNavigate();

  const handleExport = () => {
    toast.success("Score history exported as CSV!");
  };

  const handleDelete = () => {
    toast("This is a demo — data deletion would happen here.", { description: "GDPR-compliant data removal." });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="container py-6 md:py-8 space-y-6 max-w-2xl mx-auto">
      <h1 className="font-display text-2xl md:text-3xl font-bold">Settings</h1>

      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base font-display">Privacy</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="bias" className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4" /> Bias Neutralization
            </Label>
            <Switch id="bias" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="public" className="text-sm">Make profile public to recruiters</Label>
            <Switch id="public" />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base font-display">Data</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full rounded-full justify-start" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" /> Export Score History (CSV)
          </Button>
          <Button variant="outline" className="w-full rounded-full justify-start text-destructive hover:text-destructive" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2" /> Delete All My Data
          </Button>
        </CardContent>
      </Card>

      <Button variant="outline" className="w-full rounded-full h-11" onClick={handleLogout}>
        <LogOut className="w-4 h-4 mr-2" /> Sign Out
      </Button>
    </div>
  );
};

export default SettingsPage;
