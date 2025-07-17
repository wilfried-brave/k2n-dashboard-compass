import React, { useState } from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, ShoppingCart, Search, Filter, Calendar } from 'lucide-react';

const Acquisitions = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const mockAcquisitions = [
    {
      id: 'ACQ001',
      item: 'Ordinateurs portables',
      supplier: 'Tech Solutions',
      quantity: 15,
      unitPrice: 750,
      totalPrice: 11250,
      date: '2024-01-15',
      status: 'Terminé',
    },
    {
      id: 'ACQ002',
      item: 'Mobilier bureau',
      supplier: 'Office Design',
      quantity: 8,
      unitPrice: 320,
      totalPrice: 2560,
      date: '2024-01-14',
      status: 'En cours',
    },
    {
      id: 'ACQ003',
      item: 'Logiciels licences',
      supplier: 'Software Corp',
      quantity: 50,
      unitPrice: 120,
      totalPrice: 6000,
      date: '2024-01-13',
      status: 'Terminé',
    },
    {
      id: 'ACQ004',
      item: 'Équipements réseau',
      supplier: 'Network Plus',
      quantity: 5,
      unitPrice: 450,
      totalPrice: 2250,
      date: '2024-01-12',
      status: 'En attente',
    },
  ];

  const totalAcquisitions = mockAcquisitions.reduce((sum, acq) => sum + acq.totalPrice, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Terminé':
        return 'bg-success text-success-foreground';
      case 'En cours':
        return 'bg-warning text-warning-foreground';
      case 'En attente':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background-secondary">
      <DashboardHeader onSearch={setSearchQuery} />
      
      <main className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <ShoppingCart className="w-8 h-8" />
              Acquisitions
            </h1>
            <p className="text-muted-foreground">
              Gestion des achats et acquisitions
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Nouvelle acquisition
          </Button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total acquisitions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAcquisitions.toLocaleString()} €</div>
              <p className="text-xs text-muted-foreground">Ce mois-ci</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Nombre d'acquisitions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAcquisitions.length}</div>
              <p className="text-xs text-muted-foreground">Transactions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">En cours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockAcquisitions.filter(acq => acq.status === 'En cours').length}
              </div>
              <p className="text-xs text-muted-foreground">Acquisitions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Fournisseurs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(mockAcquisitions.map(acq => acq.supplier)).size}
              </div>
              <p className="text-xs text-muted-foreground">Uniques</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filtres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher une acquisition..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filtrer
              </Button>
              <Button variant="outline" className="gap-2">
                <Calendar className="w-4 h-4" />
                Période
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Acquisitions table */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des acquisitions</CardTitle>
            <CardDescription>
              Historique de toutes les acquisitions effectuées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Article</TableHead>
                  <TableHead>Fournisseur</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Prix unitaire</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAcquisitions.map((acquisition) => (
                  <TableRow key={acquisition.id}>
                    <TableCell className="font-medium">{acquisition.id}</TableCell>
                    <TableCell>{acquisition.item}</TableCell>
                    <TableCell>{acquisition.supplier}</TableCell>
                    <TableCell>{acquisition.quantity}</TableCell>
                    <TableCell>{acquisition.unitPrice.toLocaleString()} €</TableCell>
                    <TableCell className="font-medium">
                      {acquisition.totalPrice.toLocaleString()} €
                    </TableCell>
                    <TableCell>{new Date(acquisition.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(acquisition.status)}>
                        {acquisition.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Acquisitions;