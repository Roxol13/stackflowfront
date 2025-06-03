import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import "../Style.css";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const ShowDetalleVenta = () => {
  const [detallesVenta, setDetallesVenta] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDetallesVenta, setFilteredDetallesVenta] = useState([]);
  const [contadorExportaciones, setContadorExportaciones] = useState(
    parseInt(localStorage.getItem("contadorExportaciones") || "1", 10)
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchDetallesVenta = async () => {
      try {
        const response = await axios.get(
          "https://stackflowbackend.onrender.com/detalleventa/listar"
        );
        const ventasOrdenadas = response.data.sort(
          (a, b) => new Date(b.fecha) - new Date(a.fecha)
        );
        setDetallesVenta(ventasOrdenadas);
      } catch (error) {
        console.error("Error al obtener los detalles de la venta:", error);
      }
    };

    fetchDetallesVenta();
  }, []);

  useEffect(() => {
    setFilteredDetallesVenta(
      detallesVenta.filter(
        (detalle) =>
          detalle.cod_pro
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          detalle.nompro?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          detalle.cantidad
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          detalle.satisfactionScore
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          detalle.precio
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      )
    );
  }, [detallesVenta, searchTerm]);

  const totalPages = Math.ceil(filteredDetallesVenta.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDetallesVenta.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  

  const exportarAExcel = () => {
    const libroDeTrabajo = XLSX.utils.book_new();
  
    const datosParaExportar = filteredDetallesVenta.map((detalle) => ({
      "ID Producto": detalle.cod_pro,
      "Nombre del Producto": detalle.nompro,
      "Cantidad Vendida": detalle.cantidad,
      "Precio Unitario": detalle.precio, // sin formatear, para aplicar formato Excel
      "Satisfacción del cliente": detalle.satisfactionScore,
      "Fecha de Venta": new Date(detalle.fecha), // convertir a objeto Date
    }));
  
    const hojaDeTrabajo = XLSX.utils.json_to_sheet(datosParaExportar, {
      header: [
        "ID Producto",
        "Nombre del Producto",
        "Cantidad Vendida",
        "Precio Unitario",
        "Satisfacción del cliente",
        "Fecha de Venta",
      ],
      skipHeader: false,
    });
  
    // Agregar título y fila vacía al principio
    const fechaActual = new Date().toLocaleDateString();
    XLSX.utils.sheet_add_aoa(
      hojaDeTrabajo,
      [[`Reporte de Detalle de Ventas - ${fechaActual}`], []],
      { origin: "A1" }
    );
  
    // Ancho de columnas
    hojaDeTrabajo["!cols"] = [
      { wch: 15 },
      { wch: 40 },
      { wch: 20 },
      { wch: 18 },
      { wch: 25 },
      { wch: 20 },
    ];
  
    // Aplicar estilos
    const range = XLSX.utils.decode_range(hojaDeTrabajo["!ref"]);
    const offset = 2; // por el título y la fila vacía
  
    const headerStyle = {
      fill: { fgColor: { rgb: "908DC7" } },
      font: { bold: true, color: { rgb: "FFFFFF" }, sz: 12 },
      alignment: { horizontal: "center", vertical: "center" },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
      },
    };
  
    const dataStyle = {
      font: { sz: 11 },
      alignment: { horizontal: "center", vertical: "center" },
      border: {
        top: { style: "thin", color: { rgb: "D3D3D3" } },
        bottom: { style: "thin", color: { rgb: "D3D3D3" } },
        left: { style: "thin", color: { rgb: "D3D3D3" } },
        right: { style: "thin", color: { rgb: "D3D3D3" } },
      },
    };
  
    for (let R = range.s.r + offset; R <= range.e.r; R++) {
      for (let C = range.s.c; C <= range.e.c; C++) {
        const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = hojaDeTrabajo[cellRef];
        if (!cell) continue;
  
        // Formato numérico y fecha
        if (C === 3) cell.z = "$#,##0.00"; // Precio
        if (C === 5) cell.z = "dd/mm/yyyy"; // Fecha
  
        cell.s = dataStyle;
      }
    }
  
    // Aplicar estilos a encabezados
    for (let C = range.s.c; C <= range.e.c; C++) {
      const cellRef = XLSX.utils.encode_cell({ r: range.s.r + offset, c: C });
      if (hojaDeTrabajo[cellRef]) hojaDeTrabajo[cellRef].s = headerStyle;
    }
  
    // Nombre del archivo con timestamp y contador
    const now = new Date();
    const timestamp = now
      .toLocaleString("sv-SE", { timeZone: "America/Lima" })
      .replace(/[: ]/g, "-");
  
    const nombreArchivo = `Reporte_DetalleVenta_${contadorExportaciones}_${timestamp}.xlsx`;
  
    XLSX.utils.book_append_sheet(libroDeTrabajo, hojaDeTrabajo, "Detalle Ventas");
    XLSX.writeFile(libroDeTrabajo, nombreArchivo);
  
    // Guardar contador
    const nuevoContador = contadorExportaciones + 1;
    setContadorExportaciones(nuevoContador);
    localStorage.setItem("contadorExportaciones", nuevoContador.toString());
  };
  

  return (
    <div className="container-fluid show-ventas-container mt-5">
      <div className="table-wrapper">
        <div className="table-title d-flex justify-content-start align-items-center">
          <h3 className="m-0">Tabla de Detalle Ventas</h3>
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
          <button
            className="btn btn-create ms-5"
            onClick={exportarAExcel}
            style={{
              backgroundColor: "#908dc7",
              color: "white",
              padding: "8px 18px",
              fontSize: "14px",
              border: "2px solid #6c63ff",
              borderRadius: "22px",
              marginRight: "10px",
            }}
          >
            Exportar a Excel
          </button>
        </div>
        <div className="table-responsive custom-table">
          <table className="table mb-0">
            <thead>
              <tr className="table-header-row">
                <th>ID</th>
                <th>Código Del producto</th>
                <th>Nombre Del producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Satisfacion del cliente</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((detalleVenta, i) => (
                <tr key={detalleVenta.id}>
                  <td>{indexOfFirstItem + i + 1}</td>
                  <td>{detalleVenta.cod_pro}</td>
                  <td>{detalleVenta.nompro}</td>
                  <td>{detalleVenta.cantidad}</td>
                  <td>{detalleVenta.precio}</td>a
                  <td>{detalleVenta.satisfactionScore}</td>
                  <td>{detalleVenta.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="d-flex justify-content-center align-items-center mt-4 mb-4">
            <Stack spacing={1}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(e, page) => setCurrentPage(page)}
                color="secondary"
                shape="rounded"
              />
            </Stack>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowDetalleVenta;
