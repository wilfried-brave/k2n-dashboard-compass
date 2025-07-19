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
import { Plus, TrendingUp, Search, Filter, Calendar } from 'lucide-react';

const Ventes = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const mockVentes = [
    {
      id: 'V001',
      client: 'Entreprise ABC',
      produit: 'Service consulting',
      quantity: 1,
      unitPrice: 2500,
      totalPrice: 2500,
      date: '2024-01-15',
      status: 'Payé',
    },
    {
      id: 'V002',
      client: 'Société XYZ',
      produit: 'Formation équipe',
      quantity: 12,
      unitPrice: 150,
      totalPrice: 1800,
      date: '2024-01-14',
      status: 'En attente',
    },
    {
      id: 'V003',
      client: 'Start-up DEF',
      produit: 'Audit système',
      quantity: 1,
      unitPrice: 1200,
      totalPrice: 1200,
      date: '2024-01-13',
      status: 'Payé',
    },
    {
      id: 'V004',
      client: 'Corporation GHI',
      produit: 'Maintenance annuelle',
      quantity: 1,
      unitPrice: 3500,
      totalPrice: 3500,
      date: '2024-01-12',
      status: 'Facturé',
    },
  ];

  const totalVentes = mockVentes.reduce((sum, vente) => sum + vente.totalPrice, 0);
  const ventesPayees = mockVentes.filter(v => v.status === 'Payé').reduce((sum, vente) => sum + vente.totalPrice, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Payé':
        return 'bg-success text-success-foreground';
      case 'Facturé':
        return 'bg-primary text-primary-foreground';
      case 'En attente':
        return 'bg-warning text-warning-foreground';
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
            <h1 className="text-3xl font-bold text-green-900 flex items-center gap-2">
              <TrendingUp className="w-8 h-8" />
              Ventes
            </h1>
            <p className="text-muted-foreground">
              Suivi des ventes et revenus
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Nouvelle vente
          </Button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Chiffre d'affaires</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalVentes.toLocaleString()} €</div>
              <p className="text-xs text-muted-foreground">Ce mois-ci</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Encaissé</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ventesPayees.toLocaleString()} €</div>
              <p className="text-xs text-muted-foreground">Paiements reçus</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Nombre de ventes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockVentes.length}</div>
              <p className="text-xs text-muted-foreground">Transactions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(mockVentes.map(v => v.client)).size}
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
                    placeholder="Rechercher une vente..."
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

        {/* Ventes table */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des ventes</CardTitle>
            <CardDescription>
              Historique de toutes les ventes effectuées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Produit/Service</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Prix unitaire</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockVentes.map((vente) => (
                  <TableRow key={vente.id}>
                    <TableCell className="font-medium">{vente.id}</TableCell>
                    <TableCell>{vente.client}</TableCell>
                    <TableCell>{vente.produit}</TableCell>
                    <TableCell>{vente.quantity}</TableCell>
                    <TableCell>{vente.unitPrice.toLocaleString()} €</TableCell>
                    <TableCell className="font-medium">
                      {vente.totalPrice.toLocaleString()} €
                    </TableCell>
                    <TableCell>{new Date(vente.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(vente.status)}>
                        {vente.status}
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

export default Ventes;