import React, { useState, useEffect } from "react";
import { Table } from "../../components/ui/Table";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Search, Download } from "lucide-react";

interface Log {
  id: number;
  user_id: number | null;
  action: string;
  timestamp: string;
  ip_address: string | null;
  details: string | null;
  user_name?: string; // optional, joined from users table
}

export function SystemLogs() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch logs from backend
  useEffect(() => {
    fetch("/oceanview-backend/logs") // make sure your servlet or API supports this endpoint
      .then((res) => res.json())
      .then((data) => setLogs(data.logs || []))
      .catch((err) => console.error(err));
  }, []);

  const filteredLogs = logs.filter(
    (log) =>
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.user_name && log.user_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // CSV export
  const exportCSV = (logs: Log[]) => {
    if (!logs.length) return;
    const headers = ["ID", "User", "Action", "Timestamp", "IP", "Details"];
    const rows = logs.map((l) => [
      l.id,
      l.user_name || l.user_id || "N/A",
      l.action,
      l.timestamp,
      l.ip_address || "",
      l.details || "",
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "system_logs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = [
    { header: "ID", accessor: "id" },
    { header: "User", accessor: "user_name" },
    { header: "Action", accessor: "action" },
    { header: "Timestamp", accessor: "timestamp" },
    { header: "IP", accessor: "ip_address" },
    { header: "Details", accessor: "details" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">System Logs</h1>
        <Button
          variant="outline"
          leftIcon={<Download className="h-4 w-4" />}
          onClick={() => exportCSV(filteredLogs)}
        >
          Export CSV
        </Button>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Table data={filteredLogs} columns={columns} pagination totalPages={Math.ceil(filteredLogs.length / 10)} />
    </div>
  );
}
