import React, { useEffect, useState } from "react";
import axios from "axios";
import EditClientes from "./EditClientes";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import "../Style.css";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const url = "https://stackflowbackend.onrender.com/api/clientes";

const ShowCliente = ({ userData }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [clientes, setClientes] = useState([]);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [cliente, setCliente] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = isSmallScreen ? 5 : 10;

  useEffect(() => {
    getClientes();
  }, []);

  useEffect(() => {
    setFilteredClientes(
      clientes.filter(
        (cliente) =>
          cliente.dni
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          cliente.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cliente.edad?.toString().includes(searchTerm) ||
          cliente.genero?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cliente.telefono
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          cliente.direccion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cliente.razon?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [clientes, searchTerm]);

  const getClientes = async () => {
    try {
      const respuesta = await axios.get(url, {
        headers: {
          rol: "ADMIN",
        },
      });
      const clientesOrdenados = respuesta.data.sort((a, b) => b.id - a.id);
      setClientes(clientesOrdenados);
      setFilteredClientes(clientesOrdenados);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
      setSnackbarMessage("Error de red al cargar los clientes.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const openModal = (
    cliente = {
      dni: "",
      nombre: "",
      edad: "",
      genero: "",
      telefono: "",
      direccion: "",
      razon: "",
    },
    editMode = false
  ) => {
    setCliente(cliente);
    setIsEditMode(editMode);
    setIsModalOpen(true);
    setErrorMessage("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCliente({ ...cliente, [name]: value });
  };

  const saveChanges = async () => {
    if (
      !cliente.dni ||
      !cliente.nombre ||
      !cliente.edad ||
      !cliente.genero ||
      !cliente.telefono ||
      !cliente.direccion ||
      !cliente.razon
    ) {
      setErrorMessage("Por favor, complete todos los campos.");
      return;
    }

    if (isNaN(cliente.dni) || isNaN(cliente.telefono)) {
      setErrorMessage("Cédula y Teléfono deben ser solo números.");
      return;
    }

    setErrorMessage("");

    try {
      if (isEditMode) {
        await axios.put(`${url}/${cliente.id}`, cliente);
        setSnackbarMessage("Cliente editado exitosamente!");
        setSnackbarSeverity("info");
      } else {
        await axios.post(url, cliente);
        setSnackbarMessage("Cliente creado exitosamente!");
        setSnackbarSeverity("success");
      }
      setOpenSnackbar(true);
      getClientes();
      closeModal();
    } catch (error) {
      setErrorMessage("Hubo un error al guardar el cliente.");
    }
  };

  const deleteCliente = (clienteId) => {
    if (userData?.rol !== "Administrador") {
      setSnackbarMessage("Solo el administrador puede eliminar clientes");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
      return;
    }
    setClienteToDelete(clienteId);
    setShowConfirmDelete(true);
  };

  const handleDeleteConfirmation = async () => {
    await axios.delete(`${url}/${clienteToDelete}`);
    setSnackbarMessage("Cliente eliminado exitosamente!");
    setSnackbarSeverity("error");
    setOpenSnackbar(true);
    getClientes();
    setShowConfirmDelete(false);
  };

  const totalPages = Math.ceil(filteredClientes.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredClientes.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <div className="container-fluid show-cliente-container mt-3 mt-sm-5 px-3 px-sm-4 px-md-5">
      <div className="table-wrapper">
        <div className={`table-title d-flex ${isSmallScreen ? 'flex-column align-items-start gap-3' : 'justify-content-start align-items-center'}`}>
          <h3 className="m-0">Tabla de Clientes</h3>
          
          <button
            className={`btn btn-create ${isSmallScreen ? 'w-100' : 'ms-5'}`}
            onClick={() => openModal()}
            style={{
              backgroundColor: "#3f2569",
              color: "white",
              padding: "8px 18px",
              fontSize: isSmallScreen ? "0.9rem" : "0.875rem",
              borderRadius: "22px",
            }}
          >
            Añadir Cliente
          </button>

          <div className={`search-container ${isSmallScreen ? 'w-100 mt-2' : 'ms-3'}`}>
            <div 
              className="input-group"
              style={{
                width: isSmallScreen ? "100%" : "350px",
              }}
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
                  fontSize: isSmallScreen ? "0.9rem" : "1rem"
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
        </div>
        
        <div className="table-responsive mt-3" style={{ overflowX: "auto" }}>
          <table className="table mb-0 custom-table">
            <thead>
              <tr className="table-header-row">
                {!isSmallScreen && <th>Nº</th>}
                <th>Cédula</th>
                <th>Nombre</th>
                {!isSmallScreen && <th>Edad</th>}
                {!isSmallScreen && <th>Género</th>}
                <th>Teléfono</th>
                {!isSmallScreen && <th>Dirección</th>}
                {!isSmallScreen && <th>Razón</th>}
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((cliente, i) => (
                <tr key={cliente.id}>
                  {!isSmallScreen && <td>{indexOfFirstItem + i + 1}</td>}
                  <td>{cliente.dni}</td>
                  <td>{cliente.nombre}</td>
                  {!isSmallScreen && <td>{cliente.edad}</td>}
                  {!isSmallScreen && <td>{cliente.genero}</td>}
                  <td>{cliente.telefono}</td>
                  {!isSmallScreen && <td>{cliente.direccion}</td>}
                  {!isSmallScreen && <td>{cliente.razon}</td>}
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => openModal(cliente, true)}
                        style={{ 
                          minWidth: isSmallScreen ? "36px" : "30px",
                          padding: isSmallScreen ? "0.5rem" : "0.25rem",
                          fontSize: isSmallScreen ? "1rem" : "0.875rem"
                        }}
                        title="Editar"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => deleteCliente(cliente.id)}
                        style={{ 
                          minWidth: isSmallScreen ? "36px" : "30px",
                          padding: isSmallScreen ? "0.5rem" : "0.25rem",
                          fontSize: isSmallScreen ? "1rem" : "0.875rem"
                        }}
                        title={
                          userData?.rol !== "Administrador"
                            ? "Solo el administrador puede eliminar"
                            : "Eliminar"
                        }
                        disabled={userData?.rol !== "Administrador"}
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
                siblingCount={isSmallScreen ? 0 : 1}
              />
            </Stack>
          </div>
        )}
        
        {isModalOpen && (
          <EditClientes
            cliente={cliente}
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
            marginTop: isSmallScreen ? "15%" : "5%",
          }}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity={snackbarSeverity}
            sx={{ 
              width: isSmallScreen ? "90%" : "auto",
              fontSize: isSmallScreen ? "0.9rem" : "1rem"
            }}
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
            marginTop: isSmallScreen ? "25%" : "10%",
          }}
        >
          <Alert
            severity="warning"
            sx={{
              width: isSmallScreen ? "90%" : "400px",
              fontSize: isSmallScreen ? "0.9rem" : "1rem"
            }}
            action={
              <div className="d-flex gap-2 mt-2">
                <button
                  onClick={handleDeleteConfirmation}
                  className="btn btn-outline-danger btn-sm"
                  style={{ 
                    fontSize: isSmallScreen ? "0.8rem" : "0.875rem",
                    padding: isSmallScreen ? "0.25rem 0.5rem" : "0.3rem 0.6rem"
                  }}
                >
                  Eliminar
                </button>
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="btn btn-outline-secondary btn-sm"
                  style={{ 
                    fontSize: isSmallScreen ? "0.8rem" : "0.875rem",
                    padding: isSmallScreen ? "0.25rem 0.5rem" : "0.3rem 0.6rem"
                  }}
                >
                  Cancelar
                </button>
              </div>
            }
          >
            ¿Estás seguro de eliminar este cliente?
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default ShowCliente;