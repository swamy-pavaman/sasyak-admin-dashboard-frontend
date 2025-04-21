import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MapPin, Calendar, User, Clipboard, ArrowUpRight, LandPlot, Sprout } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useState } from "react";

// Mock data for scouting and land since these weren't included in your API
const mockScoutingEvents = [
  {
    id: 1,
    location: "North Ridge Site",
    date: "2025-03-15",
    assignedTo: "Kevin Clark",
    status: "Completed",
    findings: "Suitable for agricultural development",
    area: 45
  },
  {
    id: 2,
    location: "Riverside Property",
    date: "2025-03-22",
    assignedTo: "Michelle Garcia",
    status: "Completed",
    findings: "Water access issues identified",
    area: 78
  },
  {
    id: 3,
    location: "East Valley Lot",
    date: "2025-03-28",
    assignedTo: "James Harris",
    status: "In Progress",
    findings: "Initial assessment positive",
    area: 120
  },
  {
    id: 4,
    location: "Highland Area",
    date: "2025-04-05",
    assignedTo: "Patricia Young",
    status: "Scheduled",
    findings: "Pending",
    area: 92
  },
  {
    id: 5,
    location: "South Forest Extension",
    date: "2025-04-12",
    assignedTo: "Thomas Martin",
    status: "Scheduled",
    findings: "Pending",
    area: 160
  }
];

// Mock data for land properties
const mockLandProperties = [
  {
    id: 1,
    name: "North Agricultural Zone",
    area: 145,
    status: "Active",
    type: "Agricultural",
    acquisitionDate: "2023-06-10",
    utilization: 85
  },
  {
    id: 2,
    name: "East Commercial Plot",
    area: 78,
    status: "Active",
    type: "Commercial",
    acquisitionDate: "2024-01-15",
    utilization: 60
  },
  {
    id: 3,
    name: "South Residential Development",
    area: 220,
    status: "Planning",
    type: "Residential",
    acquisitionDate: "2024-02-28",
    utilization: 30
  },
  {
    id: 4,
    name: "West Industrial Complex",
    area: 117,
    status: "Active",
    type: "Industrial",
    acquisitionDate: "2023-11-05",
    utilization: 70
  }
];

const Scouting = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredScoutingEvents = mockScoutingEvents.filter(event => 
    event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.status.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredLandProperties = mockLandProperties.filter(property => 
    property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.status.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Calculate total land area
  const totalLandArea = mockLandProperties.reduce((sum, property) => sum + property.area, 0);
  
  // Format date to more readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-green-800">Land & Scouting</h2>
        <div className="relative flex-1 sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search land & scouting..."
            className="pl-8 border-green-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Total Land</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-800">{totalLandArea} acres</div>
            <p className="text-xs text-green-600 mt-1">Across {mockLandProperties.length} properties</p>
          </CardContent>
        </Card>
        
        <Card className="border-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Scouting Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-800">{mockScoutingEvents.length}</div>
            <p className="text-xs text-green-600 mt-1">
              {mockScoutingEvents.filter(e => e.status === "Completed").length} completed,{" "}
              {mockScoutingEvents.filter(e => e.status === "In Progress").length} in progress,{" "}
              {mockScoutingEvents.filter(e => e.status === "Scheduled").length} scheduled
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Potential Land</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-800">
              {mockScoutingEvents.reduce((sum, event) => sum + event.area, 0)} acres
            </div>
            <p className="text-xs text-green-600 mt-1">Under evaluation or scheduled for scouting</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="scouting" className="space-y-6">
        <TabsList className="bg-green-50 border border-green-100">
          <TabsTrigger value="scouting" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800">Scouting Events</TabsTrigger>
          <TabsTrigger value="land" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800">Land Properties</TabsTrigger>
        </TabsList>
        
        <TabsContent value="scouting">
          <Card className="border-green-100">
            <CardHeader className="border-b border-green-100 bg-green-50">
              <CardTitle className="text-green-800 flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-green-600" />
                Scouting Events
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-green-50">
                    <tr className="text-left">
                      <th className="p-4 font-medium text-sm text-green-700">Location</th>
                      <th className="p-4 font-medium text-sm text-green-700">Date</th>
                      <th className="p-4 font-medium text-sm text-green-700">Assigned To</th>
                      <th className="p-4 font-medium text-sm text-green-700">Area (acres)</th>
                      <th className="p-4 font-medium text-sm text-green-700">Status</th>
                      <th className="p-4 font-medium text-sm text-green-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-green-100">
                    {filteredScoutingEvents.length > 0 ? (
                      filteredScoutingEvents.map((event) => (
                        <tr key={event.id} className="hover:bg-green-50/60">
                          <td className="p-4">
                            <div className="flex items-center">
                              <MapPin className="mr-2 h-4 w-4 text-green-500" />
                              {event.location}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center">
                              <Calendar className="mr-2 h-4 w-4 text-green-500" />
                              {formatDate(event.date)}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center">
                              <User className="mr-2 h-4 w-4 text-green-500" />
                              {event.assignedTo}
                            </div>
                          </td>
                          <td className="p-4 text-green-700">{event.area}</td>
                          <td className="p-4">
                            <Badge className={
                              event.status === "Completed" ? "bg-green-100 text-green-800" : 
                              event.status === "In Progress" ? "bg-blue-100 text-blue-800" : 
                              "bg-amber-100 text-amber-800"
                            }>
                              {event.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Button variant="outline" size="sm" className="border-green-200 text-green-700 hover:bg-green-50">
                              <Clipboard className="mr-2 h-3 w-3" />
                              View Report
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-4 text-center text-green-600">
                          No scouting events found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="land">
          <Card className="border-green-100">
            <CardHeader className="border-b border-green-100 bg-green-50">
              <CardTitle className="text-green-800 flex items-center">
                <LandPlot className="mr-2 h-5 w-5 text-green-600" />
                Land Properties
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-green-50">
                    <tr className="text-left">
                      <th className="p-4 font-medium text-sm text-green-700">Property Name</th>
                      <th className="p-4 font-medium text-sm text-green-700">Type</th>
                      <th className="p-4 font-medium text-sm text-green-700">Area (acres)</th>
                      <th className="p-4 font-medium text-sm text-green-700">Acquisition Date</th>
                      <th className="p-4 font-medium text-sm text-green-700">Utilization</th>
                      <th className="p-4 font-medium text-sm text-green-700">Status</th>
                      <th className="p-4 font-medium text-sm text-green-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-green-100">
                    {filteredLandProperties.length > 0 ? (
                      filteredLandProperties.map((property) => (
                        <tr key={property.id} className="hover:bg-green-50/60">
                          <td className="p-4 font-medium text-green-800">{property.name}</td>
                          <td className="p-4 text-green-700">{property.type}</td>
                          <td className="p-4 text-green-700">{property.area}</td>
                          <td className="p-4 text-green-700">{formatDate(property.acquisitionDate)}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Progress value={property.utilization} className="h-2 w-24 bg-green-100" />
                              <span className="text-sm text-green-700">{property.utilization}%</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge className={
                              property.status === "Active" ? "bg-green-100 text-green-800" : 
                              "bg-blue-100 text-blue-800"
                            }>
                              {property.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Button variant="outline" size="sm" className="border-green-200 text-green-700 hover:bg-green-50">
                              <ArrowUpRight className="mr-2 h-3 w-3" />
                              Details
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="p-4 text-center text-green-600">
                          No land properties found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Scouting;