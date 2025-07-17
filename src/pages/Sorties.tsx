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
import { Plus, ArrowDown, Search, Filter, Calendar } from 'lucide-react';

const Sorties = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const mockSorties = [
    {
      id: 'SO001',
      produit: 'Ordinateurs portables',
      destination: 'Bureau Paris',
      quantite: 5,
      valeur: 3750,
      date: '2024-01-15',
      type: 'Transfert',
      status: 'Terminé',
    },
    {
      id: 'SO002',
      produit: 'Chaises de bureau',
      destination: 'Agence Lyon',
      quantite: 12,
      valeur: 1440,
      date: '2024-01-14',
      type: 'Livraison',
      status: 'En cours',
    },
    {
      id: 'SO003',
      produit: 'Imprimantes',
      destination: 'Client ABC',
      quantite: 3,
      valeur: 840,
      date: '2024-01-13',
      type: 'Vente',
      status: 'Terminé',
    },
  ];

  const totalSorties = mockSorties.reduce((sum, sortie) => sum + sortie.valeur, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Terminé':
        return 'bg-success text-success-foreground';
      case 'En cours':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background-secondary">
      <DashboardHeader onSearch={setSearchQuery} />
      
      <main className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <ArrowDown className="w-8 h-8" />
              Sorties
            </h1>
            <p className="text-muted-foreground">
              Gestion des sorties et mouvements
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Nouvelle sortie
          </Button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Valeur totale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSorties.toLocaleString()} €</div>
              <p className="text-xs text-muted-foreground">Ce mois-ci</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Nombre sorties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockSorties.length}</div>
              <p className="text-xs text-muted-foreground">Mouvements</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">En cours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockSorties.filter(s => s.status === 'En cours').length}
              </div>
              <p className="text-xs text-muted-foreground">Sorties</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Terminées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockSorties.filter(s => s.status === 'Terminé').length}
              </div>
              <p className="text-xs text-muted-foreground">Sorties</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher une sortie..."
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

        {/* Sorties table */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des sorties</CardTitle>
            <CardDescription>
              Historique des mouvements sortants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Produit</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Valeur</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSorties.map((sortie) => (
                  <TableRow key={sortie.id}>
                    <TableCell className="font-medium">{sortie.id}</TableCell>
                    <TableCell>{sortie.produit}</TableCell>
                    <TableCell>{sortie.destination}</TableCell>
                    <TableCell>{sortie.quantite}</TableCell>
                    <TableCell className="font-medium">
                      {sortie.valeur.toLocaleString()} €
                    </TableCell>
                    <TableCell>{new Date(sortie.date).toLocaleDateString()}</TableCell>
                    <TableCell>{sortie.type}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(sortie.status)}>
                        {sortie.status}
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

export default Sorties;