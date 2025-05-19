import React, { useEffect, useState } from "react";
import axios from "axios";
import EditProveedores from "./EditProveedores";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import "../Style.css";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const url = "http://localhost:8080/api/proveedores";

const ShowProveedores = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [proveedores, setProveedores] = useState([]);
  const [filteredProveedores, setFilteredProveedores] = useState([]);
  const [proveedor, setProveedor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [proveedorToDelete, setProveedorToDelete] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = isSmallScreen ? 10 : 10;

  useEffect(() => {
    getProveedores();
  }, []);

  useEffect(() => {
    setFilteredProveedores(
      proveedores.filter(
        (proveedor) =>
          proveedor.ruc
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          proveedor.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          proveedor.telefono
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          proveedor.direccion
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          proveedor.razon?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [proveedores, searchTerm]);

  const getProveedores = async () => {
    const respuesta = await axios.get(url);
    const proveedoresOrdenados = respuesta.data.sort((a, b) => b.id - a.id);
    setProveedores(proveedoresOrdenados);
    setFilteredProveedores(proveedoresOrdenados);
  };

  const openModal = (
    proveedor = { ruc: "", nombre: "", telefono: "", direccion: "", razon: "" },
    editMode = false
  ) => {
    setProveedor(proveedor);
    setIsEditMode(editMode);
    setIsModalOpen(true);
    setErrorMessage("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProveedor({ ...proveedor, [name]: value });
  };

  const saveChanges = async () => {
    if (
      !proveedor.ruc ||
      !proveedor.nombre ||
      !proveedor.telefono ||
      !proveedor.direccion ||
      !proveedor.razon
    ) {
      setErrorMessage("Por favor, complete todos los campos.");
      return;
    }
    if (isNaN(proveedor.ruc) || isNaN(proveedor.telefono)) {
      setErrorMessage("RUC y Teléfono deben ser solo números.");
      return;
    }

    setErrorMessage("");

    try {
      if (isEditMode) {
        await axios.put(`${url}/${proveedor.id}`, proveedor);
        setSnackbarMessage("Proveedor editado exitosamente!");
        setSnackbarSeverity("info");
      } else {
        await axios.post(url, proveedor);
        setSnackbarMessage("Proveedor creado exitosamente!");
        setSnackbarSeverity("success");
      }
      setOpenSnackbar(true);
      getProveedores();
      closeModal();
    } catch (error) {
      setErrorMessage("Hubo un error al guardar el proveedor.");
    }
  };

  const deleteProveedor = (proveedorId) => {
    setProveedorToDelete(proveedorId);
    setShowConfirmDelete(true);
  };

  const handleDeleteConfirmation = async () => {
    await axios.delete(`${url}/${proveedorToDelete}`);
    setSnackbarMessage("Proveedor eliminado exitosamente!");
    setSnackbarSeverity("error");
    setOpenSnackbar(true);
    getProveedores();
    setShowConfirmDelete(false);
  };

  const totalPages = Math.ceil(filteredProveedores.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProveedores.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <div className="container-fluid show-proveedor-container mt-5 mt-md-5 px-2 px-md-4">
      <div className="table-wrapper">
        <div className="table-title d-flex justify-content-start align-items-center">
          <h3 className="m-0">Tabla de Proveedores</h3>
          <button
            className="btn btn-create ms-5"
            onClick={() => openModal()}
            style={{
              backgroundColor: "#3f2569",
              color: "white",
              padding: "8px 18px",
              fontSize: "14px",
              borderRadius: "22px",
              width: isSmallScreen ? "100%" : "auto"
            }}
          >
            Añadir Proveedor
          </button>
          <div className="mb-3 ms-1" style={{ flexGrow: 1 }}></div>
          <div
            className="input-group"
            style={{ width: "400px", marginLeft: "20px" }}
          >
            <input
              type="text"
              placeholder="Buscar..."
              className="form-control"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                borderRadius: "25px",
                color: "black",
                border: "1px solid #6c757d",
                paddingRight: "40px",
              }}
            />
            <span
              className="input-group-text"
              style={{
                borderRadius: "25px",
                border: "none",
                backgroundColor: "white",
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              <i className="bi bi-search"></i>
            </span>
          </div>
        </div>
        
        <div className="table-responsive" style={{ overflowX: "auto" }}>
          <table className="table mb-0 custom-table">
            <thead>
              <tr className="table-header-row">
                {!isSmallScreen && <th>Nº</th>}
                <th>RUC</th>
                <th>Nombre</th>
                {!isSmallScreen && <th>Teléfono</th>}
                {!isSmallScreen && <th>Dirección</th>}
                {!isSmallScreen && <th>Razón</th>}
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((proveedor, i) => (
                <tr key={proveedor.id}>
                  {!isSmallScreen && <td>{indexOfFirstItem + i + 1}</td>}
                  <td>{proveedor.ruc}</td>
                  <td>{proveedor.nombre}</td>
                  {!isSmallScreen && <td>{proveedor.telefono}</td>}
                  {!isSmallScreen && <td>{proveedor.direccion}</td>}
                  {!isSmallScreen && <td>{proveedor.razon}</td>}
                  <td>
                    <div className="d-flex gap-1">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => openModal(proveedor, true)}
                        style={{ minWidth: "30px" }}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => deleteProveedor(proveedor.id)}
                        style={{ minWidth: "30px" }}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className="d-flex justify-content-center align-items-center mt-3 mb-3">
            <Stack spacing={1}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(e, page) => setCurrentPage(page)}
                color="secondary"
                shape="rounded"
                size={isSmallScreen ? "small" : "medium"}
              />
            </Stack>
          </div>
        )}
        
        {isModalOpen && (
          <EditProveedores
            proveedor={proveedor}
            handleInputChange={handleInputChange}
            closeModal={closeModal}
            saveChanges={saveChanges}
            isEditMode={isEditMode}
            errorMessage={errorMessage}
            isSmallScreen={isSmallScreen}
          />
        )}

        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          sx={{
            marginTop: isSmallScreen ? "20%" : "5%",
          }}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity={snackbarSeverity}
            sx={{ width: isSmallScreen ? "90%" : "auto" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>

        <Snackbar
          open={showConfirmDelete}
          autoHideDuration={null}
          onClose={() => setShowConfirmDelete(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          sx={{
            marginTop: isSmallScreen ? "30%" : "15%",
          }}
        >
          <Alert
            severity="warning"
            action={
              <div className="d-flex gap-1">
                <button
                  onClick={handleDeleteConfirmation}
                  className="btn btn-outline-danger btn-sm"
                  style={{ fontSize: isSmallScreen ? "12px" : "14px" }}
                >
                  Eliminar
                </button>
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="btn btn-outline-secondary btn-sm"
                  style={{ fontSize: isSmallScreen ? "12px" : "14px" }}
                >
                  Cancelar
                </button>
              </div>
            }
          >
            ¿Estás seguro de eliminar este proveedor? Puede estar asociado a un producto.
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default ShowProveedores;