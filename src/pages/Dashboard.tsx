import React, { useState } from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  TrendingUp,
  Users,
  Package,
  ShoppingCart,
  Wallet,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from 'lucide-react';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implementer la logique de recherche ici
  };

  const stats = [
    {
      title: 'Ventes totales',
      value: '42,350 €',
      change: '+12.5%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-success',
    },
    {
      title: 'Acquisitions',
      value: '1,234',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'text-primary',
    },
    {
      title: 'Fonds disponibles',
      value: '28,500 €',
      change: '-2.1%',
      trend: 'down',
      icon: Wallet,
      color: 'text-warning',
    },
    {
      title: 'Stocks',
      value: '567',
      change: '+5.4%',
      trend: 'up',
      icon: Package,
      color: 'text-muted-foreground',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'vente',
      description: 'Vente produit #1234',
      amount: '+1,250 €',
      time: 'Il y a 2h',
      status: 'completed',
    },
    {
      id: 2,
      type: 'acquisition',
      description: 'Achat matériel bureau',
      amount: '-450 €',
      time: 'Il y a 4h',
      status: 'pending',
    },
    {
      id: 3,
      type: 'stock',
      description: 'Mise à jour stock',
      amount: '+25 unités',
      time: 'Il y a 6h',
      status: 'completed',
    },
  ];

  return (
    <div className="min-h-screen bg-background-secondary">
      <DashboardHeader onSearch={handleSearch} />
      
      <main className="p-6">
        {/* Welcome section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Tableau de bord
          </h1>
          <p className="text-muted-foreground">
            Bienvenue dans votre espace de gestion K2NService
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-k2n-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4 text-success mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-destructive mr-1" />
                  )}
                  {stat.change} depuis le mois dernier
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick actions */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Actions rapides
              </CardTitle>
              <CardDescription>
                Accédez rapidement à vos fonctionnalités les plus utilisées
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { name: 'Nouvelle vente', icon: TrendingUp, href: '/dashboard/ventes' },
                  { name: 'Acquisition', icon: ShoppingCart, href: '/dashboard/acquisitions' },
                  { name: 'Gérer fonds', icon: Wallet, href: '/dashboard/fonds' },
                  { name: 'Voir stocks', icon: Package, href: '/dashboard/stocks' },
                  { name: 'Rapport', icon: FileText, href: '/dashboard/rapports' },
                  { name: 'Enregistrer', icon: Users, href: '/dashboard/enregistrement' },
                ].map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-20 flex-col gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <action.icon className="w-6 h-6" />
                    <span className="text-xs">{action.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent activities */}
          <Card>
            <CardHeader>
              <CardTitle>Activité récente</CardTitle>
              <CardDescription>
                Dernières opérations effectuées
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'}>
                        {activity.status === 'completed' ? 'Terminé' : 'En cours'}
                      </Badge>
                      <span className="text-sm font-medium">
                        {activity.amount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Aperçu des performances
            </CardTitle>
            <CardDescription>
              Évolution des ventes et acquisitions sur les 30 derniers jours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-secondary rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Graphique des performances
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Connectez votre backend pour voir les données en temps réel
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;