import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, TrendingUp, Search, Filter, Calendar, Save, X } from 'lucide-react';
import { Label } from "@/components/ui/label";

const Ventes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewVenteDialog, setShowNewVenteDialog] = useState(false);
  const [ventes, setVentes] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // État du formulaire de nouvelle vente
  const [formData, setFormData] = useState({
    responsable: '',
    client: '',
    produit: '',
    quantite: '',
    prixUnitaire: '',
    montantRecu: '',
    modePaiement: '',
    dateVente: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    const fetchVentes = async () => {
      try {
        const response = await fetch('http://localhost:9000/api/sales'); // Remplacez par l'URL de votre API
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des ventes');
        }
        const data = await response.json();
        setVentes(data);
      } catch (error) {
        console.error('Erreur:', error);
      }
    };

    fetchVentes();
  }, []);

  // Filtrage des ventes basé sur la recherche et la période
  const filteredVentes = ventes.filter(vente => {
    const matchesSearch = vente.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          vente.produit.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          vente.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          vente.responsable.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStartDate = startDate ? new Date(vente.date) >= new Date(startDate) : true;
    const matchesEndDate = endDate ? new Date(vente.date) <= new Date(endDate) : true;

    return matchesSearch && matchesStartDate && matchesEndDate;
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation basique
    if (!formData.responsable || !formData.client || !formData.produit || 
        !formData.quantite || !formData.prixUnitaire || !formData.modePaiement) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      // Création de la nouvelle vente
      const nouvelleVente = {
        id: `V${ventes.length + 1}`, // Génération d'un ID simple
        client: formData.client,
        produit: formData.produit,
        quantity: parseInt(formData.quantite),
        unitPrice: parseFloat(formData.prixUnitaire),
        totalPrice: parseInt(formData.quantite) * parseFloat(formData.prixUnitaire),
        date: formData.dateVente,
        status: 'En attente', // Statut par défaut
        responsable: formData.responsable,
        modePaiement: formData.modePaiement,
      };

      // Préparation des données pour l'API
      const venteData = {
        responsable: formData.responsable,
        client: formData.client,
        produit: formData.produit,
        quantite: parseInt(formData.quantite),
        prixUnitaire: parseFloat(formData.prixUnitaire),
        montantRecu: parseFloat(formData.montantRecu || '0'),
        modePaiement: formData.modePaiement,
        dateVente: formData.dateVente,
      };

      // Tentative d'appel API
      const response = await fetch('http://localhost:9000/api/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(venteData),
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Vente enregistrée avec succès:', result);
        setVentes(prev => [nouvelleVente, ...prev]); // Ajout à la liste locale
        setShowNewVenteDialog(false);
        resetForm();
        alert(`Vente ${nouvelleVente.id} enregistrée avec succès!`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      alert('Erreur lors de l\'enregistrement de la vente');
    }
  };

  const resetForm = () => {
    setFormData({
      responsable: '',
      client: '',
      produit: '',
      quantite: '',
      prixUnitaire: '',
      montantRecu: '',
      modePaiement: '',
      dateVente: new Date().toISOString().split('T')[0],
    });
  };

  function getStatusColor(status: any): string {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="min-h-screen bg-green-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-green-900 flex items-center gap-2">
            <TrendingUp className="w-8 h-8" />
            Ventes
          </h1>
          <p className="text-green-700">
            Suivi des ventes et revenus
          </p>
        </div>
        <Button 
          className="gap-2 bg-green-600 hover:bg-green-700 text-white"
          onClick={() => setShowNewVenteDialog(true)}
        >
          <Plus className="w-4 h-4" />
          Nouvelle vente
        </Button>
      </div>

      {/* Filters and search */}
      <Card className="mb-6 border-green-200">
        <CardHeader>
          <CardTitle className="text-lg text-green-800">Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-600" />
                <Input
                  placeholder="Rechercher une vente..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-green-300 focus:border-green-500"
                />
              </div>
            </div>
            <div className="flex-1 min-w-[200px]">
              <Input
                type="date"
                placeholder="Date de début"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border-green-300 focus:border-green-500"
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <Input
                type="date"
                placeholder="Date de fin"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border-green-300 focus:border-green-500"
              />
            </div>
            <Button variant="outline" className="gap-2 border-green-300 text-green-700 hover:bg-green-100">
              <Filter className="w-4 h-4" />
              Filtrer
            </Button>
            <Button variant="outline" className="gap-2 border-green-300 text-green-700 hover:bg-green-100">
              <Calendar className="w-4 h-4" />
              Période
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Ventes table */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">Liste des ventes ({filteredVentes.length})</CardTitle>
          <CardDescription className="text-green-600">
            Historique de toutes les ventes effectuées
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-green-200">
                  <th className="text-left p-2 text-green-800 font-semibold">ID</th>
                  <th className="text-left p-2 text-green-800 font-semibold">Client</th>
                  <th className="text-left p-2 text-green-800 font-semibold">Produit/Service</th>
                  <th className="text-left p-2 text-green-800 font-semibold">Responsable</th>
                  <th className="text-left p-2 text-green-800 font-semibold">Quantité</th>
                  <th className="text-left p-2 text-green-800 font-semibold">Prix unitaire</th>
                  <th className="text-left p-2 text-green-800 font-semibold">Total</th>
                  <th className="text-left p-2 text-green-800 font-semibold">Date</th>
                  <th className="text-left p-2 text-green-800 font-semibold">Statut</th>
                </tr>
              </thead>
              <tbody>
                {filteredVentes.map((vente) => (
                  <tr key={vente.id} className="border-b border-green-100 hover:bg-green-50">
                    <td className="p-2 font-medium text-green-700">{vente.id}</td>
                    <td className="p-2">{vente.client}</td>
                    <td className="p-2">{vente.produit}</td>
                    <td className="p-2 text-sm text-gray-600">{vente.responsable}</td>
                    <td className="p-2">{vente.quantity}</td>
                    <td className="p-2">{vente.unitPrice.toLocaleString()} €</td>
                    <td className="p-2 font-medium">{vente.totalPrice.toLocaleString()} €</td>
                    <td className="p-2">{new Date(vente.date).toLocaleDateString()}</td>
                    <td className="p-2">
                      <Badge className={getStatusColor(vente.status)}>
                        {vente.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredVentes.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Aucune vente trouvée
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog pour nouvelle vente */}
      <Dialog open={showNewVenteDialog} onOpenChange={setShowNewVenteDialog}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-green-800">Nouvelle Vente</DialogTitle>
            <DialogDescription className="text-green-600">
              Enregistrez une nouvelle vente dans le système
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="responsable" className="text-green-800">
                Responsable <span className="text-red-500">*</span>
              </Label>
              <Input
                id="responsable"
                type="text"
                placeholder="Nom du vendeur"
                value={formData.responsable}
                onChange={(e) => handleInputChange('responsable', e.target.value)}
                className="border-green-300 focus:border-green-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="client" className="text-green-800">
                Client <span className="text-red-500">*</span>
              </Label>
              <Input
                id="client"
                type="text"
                placeholder="Nom du client"
                value={formData.client}
                onChange={(e) => handleInputChange('client', e.target.value)}
                className="border-green-300 focus:border-green-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="produit" className="text-green-800">
                Produit/Service <span className="text-red-500">*</span>
              </Label>
              <Input
                id="produit"
                type="text"
                placeholder="Description du produit ou service"
                value={formData.produit}
                onChange={(e) => handleInputChange('produit', e.target.value)}
                className="border-green-300 focus:border-green-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantite" className="text-green-800">
                Quantité <span className="text-red-500">*</span>
              </Label>
              <Input
                id="quantite"
                type="number"
                min="1"
                placeholder="Quantité vendue"
                value={formData.quantite}
                onChange={(e) => handleInputChange('quantite', e.target.value)}
                className="border-green-300 focus:border-green-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prixUnitaire" className="text-green-800">
                Prix Unitaire <span className="text-red-500">*</span>
              </Label>
              <Input
                id="prixUnitaire"
                type="number"
                step="0.01"
                min="0"
                placeholder="Prix par unité"
                value={formData.prixUnitaire}
                onChange={(e) => handleInputChange('prixUnitaire', e.target.value)}
                className="border-green-300 focus:border-green-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="montantRecu" className="text-green-800">
                Montant Reçu
              </Label>
              <Input
                id="montantRecu"
                type="number"
                step="0.01"
                min="0"
                placeholder="Montant payé par le client"
                value={formData.montantRecu}
                onChange={(e) => handleInputChange('montantRecu', e.target.value)}
                className="border-green-300 focus:border-green-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="modePaiement" className="text-green-800">
                Mode de Paiement <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.modePaiement}
                onValueChange={(value) => handleInputChange('modePaiement', value)}
                required
              >
                <SelectTrigger className="border-green-300 focus:border-green-500">
                  <SelectValue placeholder="Sélectionner le mode de paiement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Espèces">Espèces</SelectItem>
                  <SelectItem value="Mobile Money">Mobile Money</SelectItem>
                  <SelectItem value="Virement bancaire">Virement bancaire</SelectItem>
                  <SelectItem value="Chèque">Chèque</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateVente" className="text-green-800">
                Date de Vente <span className="text-red-500">*</span>
              </Label>
              <Input
                id="dateVente"
                type="date"
                value={formData.dateVente}
                onChange={(e) => handleInputChange('dateVente', e.target.value)}
                className="border-green-300 focus:border-green-500"
                required
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowNewVenteDialog(false);
                resetForm();
              }}
              className="border-green-300 text-green-700 hover:bg-green-100"
            >
              <X className="w-4 h-4 mr-2" />
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Ventes;
