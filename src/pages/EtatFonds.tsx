import React, { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart3, TrendingUp, TrendingDown, Activity, Calendar, Download } from 'lucide-react';

const EtatFonds = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [analytics, setAnalytics] = useState(null); // État pour stocker les données récupérées
  const [isLoading, setIsLoading] = useState(true); // État pour gérer le chargement

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('http://localhost:9000/api/etat_fonds'); // Remplacez par l'URL de votre API
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }
        const data = await response.json();
        setAnalytics(data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return <div>Chargement des données...</div>; // Affiche un message de chargement
  }

  if (!analytics) {
    return <div>Aucune donnée disponible.</div>; // Affiche un message si aucune donnée n'est disponible
  }

  const progressObjectif = (analytics.totalFonds / analytics.objectif) * 100;

  return (
    <div className="min-h-screen bg-background-secondary">
      <DashboardHeader onSearch={setSearchQuery} />
      
      <main className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-green-900 flex items-center gap-2">
              <BarChart3 className="w-8 h-8" />
              État des fonds
            </h1>
            <p className="text-muted-foreground">
              Analyse et suivi des performances financières
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 bg-green-700 hover:bg-green-900">
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
              <div className="text-3xl font-bold">{analytics.totalFonds.toLocaleString()} €</div>
              <div className="flex items-center gap-1 text-sm">
                {analytics.variation > 0 ? (
                  <TrendingUp className="w-4 h-4 text-success" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-destructive" />
                )}
                <span className={analytics.variation > 0 ? 'text-success' : 'text-destructive'}>
                  {analytics.variation > 0 ? '+' : ''}{analytics.variation}%
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
              <div className="text-3xl font-bold">{analytics.objectif.toLocaleString()} €</div>
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
                <span className="text-sm">{analytics.mouvements.length} mouvements</span>
              </div>
              <div className="text-2xl font-bold">
                {analytics.mouvements.length}
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
                {analytics.repartition.map((item, index) => (
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
              {analytics.mouvements.map((mouvement, index) => (
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
