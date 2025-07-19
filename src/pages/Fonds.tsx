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
import { Plus, Wallet, Search, Filter, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Fonds = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const mockFonds = [
    {
      id: 'F001',
      nom: 'Fonds principal',
      type: 'Opérationnel',
      solde: 25000,
      devise: 'EUR',
      derniereMaj: '2024-01-15',
      status: 'Actif',
    },
    {
      id: 'F002',
      nom: 'Fonds de réserve',
      type: 'Réserve',
      solde: 15000,
      devise: 'EUR',
      derniereMaj: '2024-01-14',
      status: 'Actif',
    },
    {
      id: 'F003',
      nom: 'Fonds investissement',
      type: 'Investissement',
      solde: 8500,
      devise: 'EUR',
      derniereMaj: '2024-01-13',
      status: 'Bloqué',
    },
    {
      id: 'F004',
      nom: 'Fonds urgence',
      type: 'Urgence',
      solde: 5000,
      devise: 'EUR',
      derniereMaj: '2024-01-12',
      status: 'Actif',
    },
  ];

  const totalFonds = mockFonds.reduce((sum, fond) => sum + fond.solde, 0);
  const fondsActifs = mockFonds.filter(f => f.status === 'Actif').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Actif':
        return 'bg-success text-success-foreground';
      case 'Bloqué':
        return 'bg-destructive text-destructive-foreground';
      case 'En attente':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Opérationnel':
        return 'bg-primary text-primary-foreground';
      case 'Réserve':
        return 'bg-secondary text-secondary-foreground';
      case 'Investissement':
        return 'bg-warning text-warning-foreground';
      case 'Urgence':
        return 'bg-destructive text-destructive-foreground';
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
              <Wallet className="w-8 h-8" />
              Fonds
            </h1>
            <p className="text-muted-foreground">
              Gestion des fonds et comptes
            </p>
          </div>
          <Button className="gap-2 bg-green-700 hover:bg-green-900">
            <Plus className="w-4 h-4" />
            Nouveau fonds
          </Button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total des fonds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalFonds.toLocaleString()} €</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3 text-success" />
                +5.2% ce mois
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Fonds actifs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{fondsActifs}</div>
              <p className="text-xs text-muted-foreground">Sur {mockFonds.length} total</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Fonds principal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockFonds.find(f => f.nom === 'Fonds principal')?.solde.toLocaleString()} €
              </div>
              <p className="text-xs text-muted-foreground">Disponible</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Fonds de réserve</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockFonds.find(f => f.nom === 'Fonds de réserve')?.solde.toLocaleString()} €
              </div>
              <p className="text-xs text-muted-foreground">Sécurisé</p>
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
                    placeholder="Rechercher un fonds..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button variant="outline" className="gap-2 bg-green-700 hover:bg-green-900">
                <Filter className="w-4 h-4" />
                Filtrer
              </Button>
              <Button variant="outline" className="gap-2 bg-green-700 hover:bg-green-900">
                <Calendar className="w-4 h-4" />
                Période
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Fonds table */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des fonds</CardTitle>
            <CardDescription>
              Aperçu de tous les fonds gérés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nom du fonds</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Solde</TableHead>
                  <TableHead>Devise</TableHead>
                  <TableHead>Dernière MAJ</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockFonds.map((fond) => (
                  <TableRow key={fond.id}>
                    <TableCell className="font-medium">{fond.id}</TableCell>
                    <TableCell>{fond.nom}</TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(fond.type)}>
                        {fond.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {fond.solde.toLocaleString()} €
                    </TableCell>
                    <TableCell>{fond.devise}</TableCell>
                    <TableCell>{new Date(fond.derniereMaj).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(fond.status)}>
                        {fond.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Gérer
                      </Button>
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

export default Fonds;