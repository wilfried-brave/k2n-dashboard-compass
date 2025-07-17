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
import { Plus, Package, Search, Filter, AlertTriangle, CheckCircle } from 'lucide-react';

const Stocks = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const mockStocks = [
    {
      id: 'S001',
      nom: 'Ordinateurs portables',
      categorie: 'Électronique',
      quantite: 45,
      seuilMin: 10,
      seuilMax: 100,
      prix: 750,
      emplacement: 'Entrepôt A',
      dateUpdate: '2024-01-15',
      status: 'OK',
    },
    {
      id: 'S002',
      nom: 'Chaises de bureau',
      categorie: 'Mobilier',
      quantite: 8,
      seuilMin: 15,
      seuilMax: 50,
      prix: 120,
      emplacement: 'Entrepôt B',
      dateUpdate: '2024-01-14',
      status: 'Faible',
    },
    {
      id: 'S003',
      nom: 'Imprimantes laser',
      categorie: 'Électronique',
      quantite: 25,
      seuilMin: 5,
      seuilMax: 30,
      prix: 280,
      emplacement: 'Entrepôt A',
      dateUpdate: '2024-01-13',
      status: 'OK',
    },
    {
      id: 'S004',
      nom: 'Fournitures bureau',
      categorie: 'Consommables',
      quantite: 2,
      seuilMin: 20,
      seuilMax: 100,
      prix: 45,
      emplacement: 'Entrepôt C',
      dateUpdate: '2024-01-12',
      status: 'Critique',
    },
  ];

  const totalValeur = mockStocks.reduce((sum, stock) => sum + (stock.quantite * stock.prix), 0);
  const stocksFaibles = mockStocks.filter(s => s.status === 'Faible' || s.status === 'Critique').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OK':
        return 'bg-success text-success-foreground';
      case 'Faible':
        return 'bg-warning text-warning-foreground';
      case 'Critique':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OK':
        return <CheckCircle className="w-4 h-4" />;
      case 'Faible':
      case 'Critique':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return null;
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
              <Package className="w-8 h-8" />
              Stocks
            </h1>
            <p className="text-muted-foreground">
              Gestion et suivi des stocks
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Ajouter un produit
          </Button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Valeur totale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalValeur.toLocaleString()} €</div>
              <p className="text-xs text-muted-foreground">En stock</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Produits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStocks.length}</div>
              <p className="text-xs text-muted-foreground">Références</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Stocks faibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stocksFaibles}</div>
              <p className="text-xs text-muted-foreground">Nécessitent attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Emplacements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(mockStocks.map(s => s.emplacement)).size}
              </div>
              <p className="text-xs text-muted-foreground">Entrepôts</p>
            </CardContent>
          </Card>
        </div>

        {/* Alertes stocks */}
        {stocksFaibles > 0 && (
          <Card className="mb-6 border-warning">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-warning">
                <AlertTriangle className="w-5 h-5" />
                Alertes stock
              </CardTitle>
              <CardDescription>
                Produits nécessitant un réapprovisionnement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockStocks.filter(s => s.status === 'Faible' || s.status === 'Critique').map((stock) => (
                  <div key={stock.id} className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(stock.status)}
                      <div>
                        <p className="font-medium">{stock.nom}</p>
                        <p className="text-sm text-muted-foreground">
                          Stock actuel: {stock.quantite} / Seuil minimum: {stock.seuilMin}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Commander
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

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
                    placeholder="Rechercher un produit..."
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
            </div>
          </CardContent>
        </Card>

        {/* Stocks table */}
        <Card>
          <CardHeader>
            <CardTitle>Inventaire</CardTitle>
            <CardDescription>
              Liste complète des produits en stock
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Produit</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Prix unitaire</TableHead>
                  <TableHead>Valeur totale</TableHead>
                  <TableHead>Emplacement</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockStocks.map((stock) => (
                  <TableRow key={stock.id}>
                    <TableCell className="font-medium">{stock.id}</TableCell>
                    <TableCell>{stock.nom}</TableCell>
                    <TableCell>{stock.categorie}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{stock.quantite}</span>
                        <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              stock.quantite <= stock.seuilMin ? 'bg-destructive' : 
                              stock.quantite <= stock.seuilMin * 1.5 ? 'bg-warning' : 
                              'bg-success'
                            }`}
                            style={{ width: `${Math.min((stock.quantite / stock.seuilMax) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{stock.prix.toLocaleString()} €</TableCell>
                    <TableCell className="font-medium">
                      {(stock.quantite * stock.prix).toLocaleString()} €
                    </TableCell>
                    <TableCell>{stock.emplacement}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(stock.status)}>
                        {stock.status}
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

export default Stocks;