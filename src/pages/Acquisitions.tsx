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
import { Plus, ShoppingCart, Search, Filter, Calendar, X, Table } from 'lucide-react';
import { TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

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
  const [acquisitions, setAcquisitions] = useState<Acquisition[]>([]);

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

  // Récupération des données d'acquisition depuis l'API
  useEffect(() => {
    const fetchAcquisitions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/acquisitions'); // Remplacez par l'URL de votre API
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des acquisitions');
        }
        const data: Acquisition[] = await response.json();
        setAcquisitions(data);
      } catch (error) {
        console.error('Erreur:', error);
        setError('Erreur lors de la récupération des acquisitions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAcquisitions();
  }, []);

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
  e:
    | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    | { target: { name: string; value: string } }
) {
  if ("target" in e && "type" in e.target) {
    // Cas d'un vrai événement React (input, select...)
    const { name, value, type } = e.target;
    const parsedValue = type === "number" ? (value === "" ? 0 : parseFloat(value)) : value;
    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
  } else {
    // Cas d'un objet personnalisé (comme onValueChange des Select shadcn)
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }
}


function handleSelectChange(name: string, value: string) {
  setFormData((prev) => ({ ...prev, [name]: value }));
}
  // Soumission du formulaire
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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

      // Ajout à la liste locale
      setAcquisitions(prev => [newAcquisition, ...prev]);
      setSuccessMessage("Acquisition enregistrée avec succès !");
      
      // Réinitialiser le formulaire
      resetForm();

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
    resetForm();
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
                    <TableCell className="font-medium">{acquisition.total_frais.toLocaleString()} €</TableCell>
                    <TableCell>{new Date(acquisition.date_acquisition).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Modal pour nouvelle acquisition */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-green-800">Nouvelle Acquisition</DialogTitle>
              <DialogDescription className="text-green-600">
                Enregistrez une nouvelle acquisition dans le système
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
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

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Responsable de l'Acquisition *
                </label>
                <Input
                  type="text"
                  name="responsableAcquisition"
                  value={formData.responsableAcquisition}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nature du Produit Acquis *
                </label>
                <Input
                  type="text"
                  name="natureAcquisition"
                  value={formData.natureAcquisition}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantité Acquise *
                </label>
                <Input
                  type="number"
                  name="quantiteAcquise"
                  value={formData.quantiteAcquise}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix Unitaire (€) *
                </label>
                <Input
                  type="number"
                  name="prixUnitaire"
                  value={formData.prixUnitaire}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frais Connexes (€)
                </label>
                <Input
                  type="number"
                  name="fraisConnexes"
                  value={formData.fraisConnexes}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type d'Acquisition *
                </label>
                <Select
                  value={formData.typeAcquisition}
                  onValueChange={(value) => handleChange({ target: { name: 'typeAcquisition', value } })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type d'acquisition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="totale">Totale</SelectItem>
                    <SelectItem value="tranches">En Tranches</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date d'Acquisition *
                </label>
                <Input
                  type="date"
                  name="dateAcquisition"
                  value={formData.dateAcquisition}
                  onChange={handleChange}
                  required
                />
              </div>

              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Enregistrer
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Acquisitions;
function resetForm() {
  throw new Error('Function not implemented.');
}

