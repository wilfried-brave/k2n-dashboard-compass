import { useState, useEffect } from 'react';
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
import { Plus, Wallet, Search, Filter, Calendar, ArrowUpRight } from 'lucide-react';

interface FondCreate {
  nomCrediteur: string;
  sommePercue: number;
  dateFonds: string; // YYYY-MM-DD
}

interface FondResponse {
  id: string;
  nom_crediteur: string;
  somme_percue: number;
  date_fonds: string;
  created_at: string;
}

const Fonds = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [fonds, setFonds] = useState<FondResponse[]>([]); // État pour stocker les fonds récupérés
  const [showNewFondForm, setShowNewFondForm] = useState(false);
  const [newFond, setNewFond] = useState<FondCreate>({
    nomCrediteur: '',
    sommePercue: 0,
    dateFonds: '',
  });
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const totalFonds = fonds.reduce((sum, fond) => sum + fond.somme_percue, 0);
  const fondsActifs = fonds.filter(f => f.somme_percue > 0).length;

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

  const handleNewFondChange = (field: keyof FondCreate, value: string | number) => {
    setNewFond(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddNewFond = () => {
    if (!newFond.nomCrediteur || !newFond.dateFonds || newFond.sommePercue <= 0) {
      alert('Veuillez remplir tous les champs correctement.');
      return;
    }
    // Create a new fond object for the mock list
    const newFondEntry = {
      id: `F${(fonds.length + 1).toString().padStart(3, '0')}`,
      nom_crediteur: newFond.nomCrediteur,
      somme_percue: newFond.sommePercue,
      date_fonds: newFond.dateFonds,
      created_at: new Date().toISOString(), // Date actuelle
    };
    setFonds(prev => [...prev, newFondEntry]);
    setShowNewFondForm(false);
    setNewFond({
      nomCrediteur: '',
      sommePercue: 0,
      dateFonds: '',
    });
  };

  useEffect(() => {
    const fetchFonds = async () => {
      try {
        const response = await fetch('http://localhost:9000/api/fonds'); // Remplacez par l'URL de votre API
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des fonds');
        }
        const data: FondResponse[] = await response.json();
        setFonds(data);
      } catch (error) {
        console.error('Erreur:', error);
      }
    };

    fetchFonds();
  }, []);

  // Filtrage des fonds
  const filteredFonds = fonds.filter(fond => {
    const matchesSearch = fond.nom_crediteur.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStartDate = startDate ? new Date(fond.date_fonds) >= new Date(startDate) : true;
    const matchesEndDate = endDate ? new Date(fond.date_fonds) <= new Date(endDate) : true;
    return matchesSearch && matchesStartDate && matchesEndDate;
  });

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
          <Button className="gap-2 bg-green-700 hover:bg-green-900" onClick={() => setShowNewFondForm(true)}>
            <Plus className="w-4 h-4" />
            Nouveau fonds
          </Button>
        </div>

        {showNewFondForm && (
          <Card className="mb-6 p-4 bg-white border border-gray-300 rounded-md max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Ajouter un nouveau fonds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <Input
                  placeholder="Nom du créditeur"
                  value={newFond.nomCrediteur}
                  onChange={(e) => handleNewFondChange('nomCrediteur', e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Somme perçue"
                  value={newFond.sommePercue}
                  onChange={(e) => handleNewFondChange('sommePercue', parseFloat(e.target.value))}
                />
                <Input
                  type="date"
                  placeholder="Date des fonds"
                  value={newFond.dateFonds}
                  onChange={(e) => handleNewFondChange('dateFonds', e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowNewFondForm(false)}>Annuler</Button>
                  <Button onClick={handleAddNewFond}>Ajouter</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
              <p className="text-xs text-muted-foreground">Sur {fonds.length} total</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Fonds principal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {fonds.find(f => f.nom_crediteur === 'Fonds principal')?.somme_percue.toLocaleString()} €
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
                {fonds.find(f => f.nom_crediteur === 'Fonds de réserve')?.somme_percue.toLocaleString()} €
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
              <div className="flex-1 min-w-[200px]">
                <Input
                  type="date"
                  placeholder="Date de début"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <Input
                  type="date"
                  placeholder="Date de fin"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
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
                  <TableHead>Somme perçue</TableHead>
                  <TableHead>Date des fonds</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFonds.map((fond) => (
                  <TableRow key={fond.id}>
                    <TableCell className="font-medium">{fond.id}</TableCell>
                    <TableCell>{fond.nom_crediteur}</TableCell>
                    <TableCell className="font-medium">
                      {fond.somme_percue.toLocaleString()} €
                    </TableCell>
                    <TableCell>{new Date(fond.date_fonds).toLocaleDateString()}</TableCell>
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
