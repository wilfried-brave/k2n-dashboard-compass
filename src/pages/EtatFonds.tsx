import React, { useState } from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart3, TrendingUp, TrendingDown, Activity, Calendar, Download } from 'lucide-react';

const EtatFonds = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const mockAnalytics = {
    totalFonds: 53500,
    variation: 5.2,
    objectif: 60000,
    repartition: [
      { type: 'Opérationnel', montant: 25000, pourcentage: 46.7, couleur: 'bg-primary' },
      { type: 'Réserve', montant: 15000, pourcentage: 28.0, couleur: 'bg-secondary' },
      { type: 'Investissement', montant: 8500, pourcentage: 15.9, couleur: 'bg-warning' },
      { type: 'Urgence', montant: 5000, pourcentage: 9.3, couleur: 'bg-destructive' },
    ],
    mouvements: [
      { date: '2024-01-15', type: 'Entrée', montant: 2500, description: 'Vente service' },
      { date: '2024-01-14', type: 'Sortie', montant: -450, description: 'Achat équipement' },
      { date: '2024-01-13', type: 'Entrée', montant: 1200, description: 'Facture client' },
      { date: '2024-01-12', type: 'Sortie', montant: -800, description: 'Frais généraux' },
    ],
  };

  const progressObjectif = (mockAnalytics.totalFonds / mockAnalytics.objectif) * 100;

  return (
    <div className="min-h-screen bg-background-secondary">
      <DashboardHeader onSearch={setSearchQuery} />
      
      <main className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="w-8 h-8" />
              État des fonds
            </h1>
            <p className="text-muted-foreground">
              Analyse et suivi des performances financières
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Calendar className="w-4 h-4" />
              Période
            </Button>
            <Button className="gap-2">
              <Download className="w-4 h-4" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Overview cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total des fonds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockAnalytics.totalFonds.toLocaleString()} €</div>
              <div className="flex items-center gap-1 text-sm">
                {mockAnalytics.variation > 0 ? (
                  <TrendingUp className="w-4 h-4 text-success" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-destructive" />
                )}
                <span className={mockAnalytics.variation > 0 ? 'text-success' : 'text-destructive'}>
                  {mockAnalytics.variation > 0 ? '+' : ''}{mockAnalytics.variation}%
                </span>
                <span className="text-muted-foreground">ce mois</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Objectif annuel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockAnalytics.objectif.toLocaleString()} €</div>
              <div className="mt-2">
                <Progress value={progressObjectif} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {progressObjectif.toFixed(1)}% atteint
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Activité récente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-primary" />
                <span className="text-sm">4 mouvements</span>
              </div>
              <div className="text-2xl font-bold">
                {mockAnalytics.mouvements.length}
              </div>
              <p className="text-xs text-muted-foreground">Dernières 24h</p>
            </CardContent>
          </Card>
        </div>

        {/* Répartition des fonds */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Répartition des fonds</CardTitle>
            <CardDescription>
              Distribution par type de fonds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {mockAnalytics.repartition.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-background-tertiary rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${item.couleur}`} />
                      <div>
                        <p className="font-medium">{item.type}</p>
                        <p className="text-sm text-muted-foreground">{item.pourcentage}%</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{item.montant.toLocaleString()} €</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center">
                <div className="w-48 h-48 bg-gradient-secondary rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Graphique circulaire
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mouvements récents */}
        <Card>
          <CardHeader>
            <CardTitle>Mouvements récents</CardTitle>
            <CardDescription>
              Dernières entrées et sorties de fonds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAnalytics.mouvements.map((mouvement, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-background-tertiary rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      mouvement.type === 'Entrée' ? 'bg-success/20' : 'bg-destructive/20'
                    }`}>
                      {mouvement.type === 'Entrée' ? (
                        <TrendingUp className="w-4 h-4 text-success" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-destructive" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{mouvement.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(mouvement.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      mouvement.type === 'Entrée' ? 'text-success' : 'text-destructive'
                    }`}>
                      {mouvement.montant > 0 ? '+' : ''}{mouvement.montant.toLocaleString()} €
                    </p>
                    <Badge variant={mouvement.type === 'Entrée' ? 'default' : 'destructive'}>
                      {mouvement.type}
                    </Badge>
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

export default EtatFonds;