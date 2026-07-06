// Inventory Dashboard page
// This page coordinates the full inventory management workflow.

import { useEffect, useMemo, useState } from "react";
import {
  getInventoryItems,
  getDashboardSummary,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  increaseStock,
  decreaseStock,
} from "../services/inventoryService";

import Navbar from "../components/Navbar";
import SummaryCards from "../components/inventory/SummaryCards";
import InventoryToolbar from "../components/inventory/InventoryToolbar";
import InventoryTable from "../components/inventory/InventoryTable";
import InventoryModal from "../components/inventory/InventoryModal";

function Dashboard() {
  // Default empty inventory form object.
  // This is used when adding a new item and when resetting the modal form.
  const emptyForm = {
    item_name: "",
    sku: "",
    category: "",
    description: "",
    quantity: "",
    storage_zone: "",
    minimum_temperature: "",
    maximum_temperature: "",
    expiry_date: "",
  };

  // Stores all inventory items returned from the backend.
  const [inventory, setInventory] = useState([]);

  // Stores summary values shown in the dashboard cards.
  const [summary, setSummary] = useState(null);

  // Stores form values used by the add/edit modal.
  const [formData, setFormData] = useState(emptyForm);

  // Stores the ID of the item being edited.
  // Null means the modal is being used to add a new item.
  const [editingItemId, setEditingItemId] = useState(null);

  // Stores temporary stock adjustment values per item.
  const [stockAdjustments, setStockAdjustments] = useState({});

  // Stores search and filter values.
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Stores page and action loading states.
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Controls whether the add/edit modal is visible.
  const [showModal, setShowModal] = useState(false);

  // Stores user feedback messages.
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Load inventory data when the dashboard first opens.
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Automatically clear feedback messages after a few seconds.
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setError("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  // Fetch inventory items and dashboard summary values from the backend.
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const inventoryData = await getInventoryItems();
      const summaryData = await getDashboardSummary();

      setInventory(inventoryData);
      setSummary(summaryData);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  // Open the modal in add mode.
  const openAddModal = () => {
    setEditingItemId(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  // Open the modal in edit mode and populate the form with the selected item.
  const openEditModal = (item) => {
    setEditingItemId(item.id);

    setFormData({
      item_name: item.item_name || "",
      sku: item.sku || "",
      category: item.category || "",
      description: item.description || "",
      quantity: item.quantity ?? "",
      storage_zone: item.storage_zone || "",
      minimum_temperature: item.minimum_temperature ?? "",
      maximum_temperature: item.maximum_temperature ?? "",
      expiry_date: item.expiry_date ? item.expiry_date.split("T")[0] : "",
    });

    setShowModal(true);
  };

  // Close the modal and reset form-related state.
  const closeModal = () => {
    setShowModal(false);
    setEditingItemId(null);
    setFormData(emptyForm);
  };

  // Save a new inventory item or update an existing one.
  const handleSaveItem = async (e) => {
    e.preventDefault();

    try {
      setActionLoading(true);
      setError("");
      setSuccessMessage("");

      // Convert numeric form fields before sending data to FastAPI.
      const payload = {
        ...formData,
        description: "",
        quantity: Number(formData.quantity),
        minimum_temperature: Number(formData.minimum_temperature),
        maximum_temperature: Number(formData.maximum_temperature),
        expiry_date: formData.expiry_date || null,
      };

      if (editingItemId) {
        await updateInventoryItem(editingItemId, payload);
        setSuccessMessage("Inventory item updated successfully.");
      } else {
        await createInventoryItem(payload);
        setSuccessMessage("Inventory item added successfully.");
      }

      closeModal();
      await loadDashboardData();
    } catch (err) {
      setError(err.message || "Failed to save inventory item.");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete an inventory item after confirmation.
  const handleDeleteItem = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this inventory item?"
    );

    if (!confirmDelete) return;

    try {
      setActionLoading(true);
      setError("");
      setSuccessMessage("");

      await deleteInventoryItem(id);

      setSuccessMessage("Inventory item deleted successfully.");
      await loadDashboardData();
    } catch (err) {
      setError(err.message || "Failed to delete inventory item.");
    } finally {
      setActionLoading(false);
    }
  };

  // Update the stock adjustment input for a selected item.
  const handleStockInputChange = (id, value) => {
    setStockAdjustments({
      ...stockAdjustments,
      [id]: value,
    });
  };

  // Increase stock for a selected item.
  const handleIncreaseStock = async (id) => {
    const quantity = Number(stockAdjustments[id]);

    if (!quantity || quantity <= 0) {
      setError("Please enter a valid stock quantity greater than zero.");
      return;
    }

    try {
      setActionLoading(true);
      setError("");
      setSuccessMessage("");

      await increaseStock(id, quantity);

      setSuccessMessage("Stock increased successfully.");
      setStockAdjustments({ ...stockAdjustments, [id]: "" });

      await loadDashboardData();
    } catch (err) {
      setError(err.message || "Failed to increase stock.");
    } finally {
      setActionLoading(false);
    }
  };

  // Decrease stock for a selected item.
  const handleDecreaseStock = async (id) => {
    const quantity = Number(stockAdjustments[id]);

    if (!quantity || quantity <= 0) {
      setError("Please enter a valid stock quantity greater than zero.");
      return;
    }

    const confirmDecrease = window.confirm(
      "Are you sure you want to decrease stock for this item?"
    );

    if (!confirmDecrease) return;

    try {
      setActionLoading(true);
      setError("");
      setSuccessMessage("");

      await decreaseStock(id, quantity);

      setSuccessMessage("Stock decreased successfully.");
      setStockAdjustments({ ...stockAdjustments, [id]: "" });

      await loadDashboardData();
    } catch (err) {
      setError(err.message || "Failed to decrease stock.");
    } finally {
      setActionLoading(false);
    }
  };

  // Build category filter options from the inventory list.
  const categories = useMemo(() => {
    return [...new Set(inventory.map((item) => item.category).filter(Boolean))];
  }, [inventory]);

  // Filter inventory by search text and category.
  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const searchText = searchTerm.toLowerCase();

      const matchesSearch =
        item.item_name?.toLowerCase().includes(searchText) ||
        item.sku?.toLowerCase().includes(searchText) ||
        item.category?.toLowerCase().includes(searchText) ||
        item.storage_zone?.toLowerCase().includes(searchText);

      const matchesCategory =
        categoryFilter === "" || item.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [inventory, searchTerm, categoryFilter]);

  // Export the currently visible inventory table to CSV.
  const handleExportCsv = () => {
    const headers = [
      "ID",
      "SKU",
      "Item Name",
      "Category",
      "Storage Zone",
      "Quantity",
      "Minimum Temperature",
      "Maximum Temperature",
      "Expiry Date",
    ];

    const rows = filteredInventory.map((item) => [
      item.id,
      item.sku,
      item.item_name,
      item.category,
      item.storage_zone,
      item.quantity,
      item.minimum_temperature,
      item.maximum_temperature,
      item.expiry_date ? item.expiry_date.split("T")[0] : "",
    
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((value) => `"${value ?? ""}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "coldguard_inventory.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="container-fluid px-2 px-xl-4 mt-3">
        <Navbar />

        <div className="d-flex justify-content-center align-items-center mt-5">
          <div className="spinner-border me-3" role="status"></div>
          <span>Loading inventory dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-2 px-xl-4 mt-3">
      <Navbar />

      <div className="text-center mb-4">
        <h1 className="mb-1">Inventory Dashboard</h1>
        <p className="text-muted mb-0">
          Manage warehouse inventory, stock levels and cold storage zones.
        </p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      {actionLoading && (
        <div className="alert alert-info">Processing request...</div>
      )}

      <SummaryCards summary={summary} />

      <InventoryToolbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        categories={categories}
        openAddModal={openAddModal}
        handleExportCsv={handleExportCsv}
      />

      <InventoryTable
        inventory={filteredInventory}
        totalInventoryCount={inventory.length}
        stockAdjustments={stockAdjustments}
        actionLoading={actionLoading}
        handleStockInputChange={handleStockInputChange}
        handleIncreaseStock={handleIncreaseStock}
        handleDecreaseStock={handleDecreaseStock}
        openEditModal={openEditModal}
        handleDeleteItem={handleDeleteItem}
      />

      <InventoryModal
        showModal={showModal}
        editingItemId={editingItemId}
        formData={formData}
        setFormData={setFormData}
        closeModal={closeModal}
        handleSaveItem={handleSaveItem}
        actionLoading={actionLoading}
      />
    </div>
  );
}

export default Dashboard;