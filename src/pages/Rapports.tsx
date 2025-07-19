import React, { useState } from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Calendar, Filter, BarChart3, TrendingUp, FileBarChart } from 'lucide-react';

const Rapports = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const mockRapports = [
    {
      id: 'R001',
      nom: 'Rapport mensuel - Janvier 2024',
      type: 'Mensuel',
      categorie: 'Financier',
      dateCreation: '2024-01-31',
      taille: '2.4 MB',
      status: 'Terminé',
    },
    {
      id: 'R002',
      nom: 'Analyse des ventes Q1',
      type: 'Trimestriel',
      categorie: 'Ventes',
      dateCreation: '2024-01-30',
      taille: '1.8 MB',
      status: 'En cours',
    },
    {
      id: 'R003',
      nom: 'État des stocks',
      type: 'Hebdomadaire',
      categorie: 'Inventaire',
      dateCreation: '2024-01-29',
      taille: '890 KB',
      status: 'Terminé',
    },
    {
      id: 'R004',
      nom: 'Rapport d\'acquisitions',
      type: 'Mensuel',
      categorie: 'Achats',
      dateCreation: '2024-01-28',
      taille: '1.2 MB',
      status: 'Terminé',
    },
  ];

  const rapportTypes = [
    { nom: 'Rapport financier', description: 'Analyse des revenus et dépenses', icon: BarChart3 },
    { nom: 'Rapport de ventes', description: 'Suivi des performances commerciales', icon: TrendingUp },
    { nom: 'Rapport d\'inventaire', description: 'État des stocks et mouvements', icon: FileBarChart },
    { nom: 'Rapport personnalisé', description: 'Créer un rapport sur mesure', icon: FileText },
  ];

  const getStatusColor = (status: string) => {
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

  const getCategorieColor = (categorie: string) => {
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
              {rapportTypes.map((type, index) => (
                <Card key={index} className="cursor-pointer hover:bg-card-hover transition-colors">
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center text-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <type.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{type.nom}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {type.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
              <div className="text-2xl font-bold">{mockRapports.length}</div>
              <p className="text-xs text-muted-foreground">Ce mois-ci</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Terminés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockRapports.filter(r => r.status === 'Terminé').length}
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
                {mockRapports.filter(r => r.status === 'En cours').length}
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
            <div className="space-y-4">
              {mockRapports.map((rapport) => (
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
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Rapports;