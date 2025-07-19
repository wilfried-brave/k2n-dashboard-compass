import React, { useState, useEffect } from 'react';
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
import { Plus, ShoppingCart, Search, Filter, Calendar, X } from 'lucide-react';

// Types pour les données d'acquisition
type TrancheData = {
  date: string;
  montant: number;
};

type Acquisition = {
  id: string;
  responsable_acquisition: string;
  nature_acquisition: string;
  quantite_acquise: number;
  prix_unitaire: number;
  frais_acquisition: number;
  frais_connexes: number;
  total_frais: number;
  type_acquisition: string;
  date_acquisition: string;
  dates_acquisition_tranches: TrancheData[] | null;
  details: string | null;
  commentaires: string | null;
  last_modified_at: string;
};

type FormData = {
  responsableAcquisition: string;
  natureAcquisition: string;
  quantiteAcquise: number;
  prixUnitaire: number;
  fraisAcquisition: number;
  fraisConnexes: number;
  totalFrais: number;
  typeAcquisition: string;
  dateAcquisition: string;
  datesAcquisitionTranches: TrancheData[];
  details: string;
  commentaires: string;
};

const Acquisitions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Données d'acquisitions avec état
  const [acquisitions, setAcquisitions] = useState<Acquisition[]>([
    {
      id: 'ACQ001',
      responsable_acquisition: 'Jean Dupont',
      nature_acquisition: 'Ordinateurs portables',
      quantite_acquise: 15,
      prix_unitaire: 750,
      frais_acquisition: 11250,
      frais_connexes: 0,
      total_frais: 11250,
      type_acquisition: 'totale',
      date_acquisition: '2024-01-15',
      dates_acquisition_tranches: null,
      details: 'Ordinateurs Dell Latitude 7420',
      commentaires: 'Pour le département IT',
      last_modified_at: '2024-01-15T10:00:00Z',
    },
    {
      id: 'ACQ002',
      responsable_acquisition: 'Marie Martin',
      nature_acquisition: 'Mobilier bureau',
      quantite_acquise: 8,
      prix_unitaire: 320,
      frais_acquisition: 2560,
      frais_connexes: 200,
      total_frais: 2760,
      type_acquisition: 'tranches',
      date_acquisition: '2024-01-14',
      dates_acquisition_tranches: [
        { date: '2024-01-14', montant: 1380 },
        { date: '2024-01-28', montant: 1380 }
      ],
      details: 'Bureaux ergonomiques ajustables',
      commentaires: 'Livraison en 2 fois',
      last_modified_at: '2024-01-14T14:30:00Z',
    }
  ]);

  // État du formulaire
  const [formData, setFormData] = useState<FormData>({
    responsableAcquisition: "",
    natureAcquisition: "",
    quantiteAcquise: 0,
    prixUnitaire: 0,
    fraisAcquisition: 0,
    fraisConnexes: 0,
    totalFrais: 0,
    typeAcquisition: "",
    dateAcquisition: "",
    datesAcquisitionTranches: [{ date: "", montant: 0 }],
    details: "",
    commentaires: "",
  });

  const showTranches = formData.typeAcquisition === "tranches";

  // Calcul automatique des frais
  useEffect(() => {
    const calculatedFraisAcquisition = Math.round(formData.quantiteAcquise * formData.prixUnitaire);
    const total = calculatedFraisAcquisition + formData.fraisConnexes;
    setFormData((fd) => ({
      ...fd,
      fraisAcquisition: calculatedFraisAcquisition,
      totalFrais: total,
    }));
  }, [formData.quantiteAcquise, formData.prixUnitaire, formData.fraisConnexes]);

  // Filtrage des acquisitions
  const filteredAcquisitions = acquisitions.filter(acq =>
    acq.nature_acquisition.toLowerCase().includes(searchQuery.toLowerCase()) ||
    acq.responsable_acquisition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalAcquisitions = filteredAcquisitions.reduce((sum, acq) => sum + acq.total_frais, 0);

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'totale':
        return 'bg-green-100 text-green-800';
      case 'tranches':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Gestion des changements de formulaire
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value, type } = e.target;
    setFormData((prev) => {
      let parsedValue: string | number;
      if (type === "number") {
        if (name === "quantiteAcquise") {
          parsedValue = value === "" ? 0 : parseFloat(value);
        } else {
          parsedValue = value === "" ? 0 : parseInt(value, 10);
        }
      } else {
        parsedValue = value;
      }
      return { ...prev, [name]: parsedValue };
    });
  }

  // Gestion des tranches
  function ajouterDateTranche() {
    setFormData((prev) => ({
      ...prev,
      datesAcquisitionTranches: [...prev.datesAcquisitionTranches, { date: "", montant: 0 }],
    }));
  }

  function handleTrancheChange(index: number, field: 'date' | 'montant', value: string | number) {
    setFormData((prev) => {
      const newTranches = [...prev.datesAcquisitionTranches];
      if (field === 'montant') {
        newTranches[index] = { ...newTranches[index], [field]: parseInt(value as string, 10) || 0 };
      } else {
        newTranches[index] = { ...newTranches[index], [field]: value as string };
      }
      return { ...prev, datesAcquisitionTranches: newTranches };
    });
  }

  function supprimerTranche(index: number) {
    if (formData.datesAcquisitionTranches.length > 1) {
      setFormData((prev) => ({
        ...prev,
        datesAcquisitionTranches: prev.datesAcquisitionTranches.filter((_, i) => i !== index),
      }));
    }
  }

  // Validation du formulaire
  function validate(): boolean {
    if (!formData.responsableAcquisition.trim()) {
      setError("Veuillez entrer le nom du responsable de l'acquisition.");
      return false;
    }
    if (!formData.natureAcquisition.trim()) {
      setError("Veuillez entrer la nature du produit acquis.");
      return false;
    }
    if (formData.quantiteAcquise <= 0) {
      setError("Veuillez entrer une quantité acquise valide (> 0).");
      return false;
    }
    if (formData.prixUnitaire <= 0) {
      setError("Veuillez entrer un prix unitaire valide (> 0).");
      return false;
    }
    if (!formData.typeAcquisition) {
      setError("Veuillez sélectionner le type d'acquisition.");
      return false;
    }
    if (!formData.dateAcquisition) {
      setError("Veuillez entrer la date d'acquisition.");
      return false;
    }
    if (showTranches) {
      for (let i = 0; i < formData.datesAcquisitionTranches.length; i++) {
        const tranche = formData.datesAcquisitionTranches[i];
        if (!tranche.date) {
          setError(`Veuillez remplir la date de la tranche ${i + 1}.`);
          return false;
        }
        if (tranche.montant <= 0) {
          setError(`Veuillez entrer un montant valide (> 0) pour la tranche ${i + 1}.`);
          return false;
        }
      }
    }
    setError(null);
    return true;
  }

  // Soumission du formulaire
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setSuccessMessage(null);
    setError(null);

    try {
      // Simulation de l'ajout (ici vous feriez l'appel API)
      const newAcquisition: Acquisition = {
        id: `ACQ${String(acquisitions.length + 1).padStart(3, '0')}`,
        responsable_acquisition: formData.responsableAcquisition,
        nature_acquisition: formData.natureAcquisition,
        quantite_acquise: formData.quantiteAcquise,
        prix_unitaire: formData.prixUnitaire,
        frais_acquisition: formData.fraisAcquisition,
        frais_connexes: formData.fraisConnexes,
        total_frais: formData.totalFrais,
        type_acquisition: formData.typeAcquisition,
        date_acquisition: formData.dateAcquisition,
        dates_acquisition_tranches: showTranches ? formData.datesAcquisitionTranches : null,
        details: formData.details || null,
        commentaires: formData.commentaires || null,
        last_modified_at: new Date().toISOString(),
      };

      setAcquisitions(prev => [newAcquisition, ...prev]);
      setSuccessMessage("Acquisition enregistrée avec succès !");
      
      // Réinitialiser le formulaire
      setFormData({
        responsableAcquisition: "",
        natureAcquisition: "",
        quantiteAcquise: 0,
        prixUnitaire: 0,
        fraisAcquisition: 0,
        fraisConnexes: 0,
        totalFrais: 0,
        typeAcquisition: "",
        dateAcquisition: "",
        datesAcquisitionTranches: [{ date: "", montant: 0 }],
        details: "",
        commentaires: "",
      });

      // Fermer le modal après un délai
      setTimeout(() => {
        setShowModal(false);
        setSuccessMessage(null);
      }, 2000);

    } catch (err) {
      console.error("Erreur lors de l'enregistrement de l'acquisition:", err);
      setError("Échec de l'enregistrement de l'acquisition. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  }

  // Fermer le modal et réinitialiser
  function closeModal() {
    setShowModal(false);
    setError(null);
    setSuccessMessage(null);
    setFormData({
      responsableAcquisition: "",
      natureAcquisition: "",
      quantiteAcquise: 0,
      prixUnitaire: 0,
      fraisAcquisition: 0,
      fraisConnexes: 0,
      totalFrais: 0,
      typeAcquisition: "",
      dateAcquisition: "",
      datesAcquisitionTranches: [{ date: "", montant: 0 }],
      details: "",
      commentaires: "",
    });
  }

  return (
    <div className="min-h-screen bg-background-secondary">      
      <main className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <ShoppingCart className="w-8 h-8" />
              Acquisitions
            </h1>
            <p className="text-muted-foreground">
              Gestion des achats et acquisitions
            </p>
          </div>
          <Button onClick={() => setShowModal(true)} className="gap-2 bg-green-700 hover:bg-green-900">
            <Plus className="w-4 h-4" />
            Nouvelle acquisition
          </Button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total acquisitions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAcquisitions.toLocaleString()} €</div>
              <p className="text-xs text-muted-foreground">Ce mois-ci</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Nombre d'acquisitions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredAcquisitions.length}</div>
              <p className="text-xs text-muted-foreground">Transactions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">En tranches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredAcquisitions.filter(acq => acq.type_acquisition === 'tranches').length}
              </div>
              <p className="text-xs text-muted-foreground">Acquisitions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Responsables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(filteredAcquisitions.map(acq => acq.responsable_acquisition)).size}
              </div>
              <p className="text-xs text-muted-foreground">Uniques</p>
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
                    placeholder="Rechercher une acquisition..."
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

        {/* Acquisitions table */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des acquisitions</CardTitle>
            <CardDescription>
              Historique de toutes les acquisitions effectuées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Responsable</TableHead>
                  <TableHead>Article</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Prix unitaire</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAcquisitions.map((acquisition) => (
                  <TableRow key={acquisition.id}>
                    <TableCell className="font-medium">{acquisition.id}</TableCell>
                    <TableCell>{acquisition.responsable_acquisition}</TableCell>
                    <TableCell>{acquisition.nature_acquisition}</TableCell>
                    <TableCell>{acquisition.quantite_acquise}</TableCell>
                    <TableCell>{acquisition.prix_unitaire.toLocaleString()} €</TableCell>
                    <TableCell className="font-medium">
                      {acquisition.total_frais.toLocaleString()} €
                    </TableCell>
                    <TableCell>{new Date(acquisition.date_acquisition).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(acquisition.type_acquisition)}>
                        {acquisition.type_acquisition}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Modal pour nouvelle acquisition */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Nouvelle Acquisition</h2>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={closeModal}
                  className="p-2 bg-green-900"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Messages de succès/erreur */}
                {successMessage && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    {successMessage}
                  </div>
                )}
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Colonne gauche - Informations produit */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-green-700 border-b pb-2">
                      Informations Produit
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Responsable de l'Acquisition *
                      </label>
                      <Input
                        type="text"
                        name="responsableAcquisition"
                        value={formData.responsableAcquisition}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nature du Produit Acquis *
                      </label>
                      <Input
                        type="text"
                        name="natureAcquisition"
                        value={formData.natureAcquisition}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantité Acquise *
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        name="quantiteAcquise"
                        value={formData.quantiteAcquise}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prix Unitaire (€) *
                      </label>
                      <Input
                        type="number"
                        min="0"
                        name="prixUnitaire"
                        value={formData.prixUnitaire}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Détails
                      </label>
                      <textarea
                        name="details"
                        value={formData.details}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Commentaires
                      </label>
                      <textarea
                        name="commentaires"
                        value={formData.commentaires}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Colonne droite - Détails acquisition */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-green-700 border-b pb-2">
                      Détails de l'Acquisition
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Frais d'Acquisition (€)
                      </label>
                      <Input
                        type="number"
                        value={formData.fraisAcquisition}
                        readOnly
                        className="bg-gray-100 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Frais Connexes (€)
                      </label>
                      <Input
                        type="number"
                        min="0"
                        name="fraisConnexes"
                        value={formData.fraisConnexes}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Total des Frais (€)
                      </label>
                      <Input
                        type="number"
                        value={formData.totalFrais}
                        readOnly
                        className="bg-gray-100 cursor-not-allowed font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type d'Acquisition *
                      </label>
                      <select
                        name="typeAcquisition"
                        value={formData.typeAcquisition}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        disabled={isLoading}
                      >
                        <option value="">Sélectionner...</option>
                        <option value="totale">Totale</option>
                        <option value="tranches">En Tranches</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date d'Acquisition *
                      </label>
                      <Input
                        type="date"
                        name="dateAcquisition"
                        value={formData.dateAcquisition}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                      />
                    </div>

                    {/* Section tranches */}
                    {showTranches && (
                      <div className="border-t pt-4">
                        <label className="block mb-2 font-medium text-gray-700">
                          Dates et Montants des Tranches (€) *
                        </label>
                        {formData.datesAcquisitionTranches.map((tranche, index) => (
                          <div key={index} className="flex gap-2 mb-2">
                            <Input
                              type="date"
                              className="flex-1"
                              value={tranche.date}
                              onChange={(e) =>
                                handleTrancheChange(index, "date", e.target.value)
                              }
                              required
                              disabled={isLoading}
                            />
                            <Input
                              type="number"
                              min="0"
                              className="w-32"
                              value={tranche.montant}
                              onChange={(e) =>
                                handleTrancheChange(index, "montant", e.target.value)
                              }
                              required
                              disabled={isLoading}
                            />
                            {formData.datesAcquisitionTranches.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => supprimerTranche(index)}
                                className="px-3"
                                disabled={isLoading}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={ajouterDateTranche}
                          className="mt-2"
                          disabled={isLoading}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Ajouter Tranche
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex justify-end gap-4 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeModal}
                    disabled={isLoading}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isLoading ? "Enregistrement..." : "Enregistrer l'Acquisition"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Acquisitions;