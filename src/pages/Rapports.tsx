import React, { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Calendar, Filter, BarChart3, TrendingUp, FileBarChart } from 'lucide-react';

const Rapports = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [rapports, setRapports] = useState([]); // État pour stocker les rapports
  const [isLoading, setIsLoading] = useState(true); // État pour gérer le chargement

  useEffect(() => {
    const fetchRapports = async () => {
      try {
        const response = await fetch('http://localhost:9000/api/sales/rapport'); // Remplacez par l'URL de votre API
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des rapports');
        }
        const data = await response.json();
        setRapports(data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRapports();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Terminé':
        return 'bg-success text-success-foreground';
      case 'En cours':
        return 'bg-warning text-warning-foreground';
      case 'Erreur':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getCategorieColor = (categorie) => {
    switch (categorie) {
      case 'Financier':
        return 'bg-primary text-primary-foreground';
      case 'Ventes':
        return 'bg-success text-success-foreground';
      case 'Inventaire':
        return 'bg-warning text-warning-foreground';
      case 'Achats':
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
            <h1 className="text-3xl font-bold text-green-900 flex items-center gap-2">
              <FileText className="w-8 h-8" />
              Rapports
            </h1>
            <p className="text-muted-foreground">
              Génération et gestion des rapports
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 bg-green-700 hover:bg-green-900">
              <Filter className="w-4 h-4" />
              Filtrer
            </Button>
            <Button variant="outline" className="gap-2 bg-green-700 hover:bg-green-900">
              <Calendar className="w-4 h-4" />
              Période
            </Button>
          </div>
        </div>

        {/* Nouveaux rapports */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Créer un nouveau rapport</CardTitle>
            <CardDescription>
              Sélectionnez le type de rapport que vous souhaitez générer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Remplacez par votre logique de création de rapport */}
            </div>
          </CardContent>
        </Card>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total rapports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rapports.length}</div>
              <p className="text-xs text-muted-foreground">Ce mois-ci</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Terminés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {rapports.filter(r => r.status === 'Terminé').length}
              </div>
              <p className="text-xs text-muted-foreground">Rapports générés</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">En cours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {rapports.filter(r => r.status === 'En cours').length}
              </div>
              <p className="text-xs text-muted-foreground">En génération</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Taille totale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6.3 MB</div>
              <p className="text-xs text-muted-foreground">Stockage utilisé</p>
            </CardContent>
          </Card>
        </div>

        {/* Liste des rapports */}
        <Card>
          <CardHeader>
            <CardTitle>Rapports récents</CardTitle>
            <CardDescription>
              Historique des rapports générés
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Chargement des données...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {rapports.map((rapport) => (
                  <div key={rapport.id} className="flex items-center justify-between p-4 bg-background-tertiary rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{rapport.nom}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getCategorieColor(rapport.categorie)}>
                            {rapport.categorie}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {rapport.type}
                          </span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(rapport.dateCreation).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <Badge className={getStatusColor(rapport.status)}>
                          {rapport.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {rapport.taille}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 bg-green-700 hover:bg-green-900"
                        disabled={rapport.status !== 'Terminé'}
                      >
                        <Download className="w-4 h-4" />
                        Télécharger
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Rapports;
