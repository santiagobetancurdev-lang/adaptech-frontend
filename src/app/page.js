  "use client";

  // =========================================================================
  // MÓDULO 1: IMPORTACIONES Y DATOS GLOBALES
  // =========================================================================

  import "bootstrap/dist/css/bootstrap.min.css";

  import React from 'react';

  // Importaciones de Componentes de React Bootstrap (para la estructura y UI)
  import Button from "react-bootstrap/Button";
  import Container from "react-bootstrap/Container";
  import Form from "react-bootstrap/Form";
  import Nav from "react-bootstrap/Nav";
  import Navbar from "react-bootstrap/Navbar";
  import NavDropdown from "react-bootstrap/NavDropdown";
  import { NavbarBrand, NavLink, NavbarToggle, NavbarCollapse } from "react-bootstrap";
  import Carousel from "react-bootstrap/Carousel";
  import Card from "react-bootstrap/Card";
  import Row from "react-bootstrap/Row";
  import Col from "react-bootstrap/Col";  
  import Dropdown from "react-bootstrap/Dropdown";
  import InputGroup from "react-bootstrap/InputGroup"; 
  import { useState, useEffect, useMemo } from "react";

  // URL del Api
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";


  // =========================================================================
  // MÓDULO 2: PESTAÑAS DE LA PAGINA
  // =========================================================================

  // MÓDULO 2.1: RegisterScreen (Registro de Usuario)

  const RegisterScreen = ({ setViewMode, API_BASE_URL }) => {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [correo, setCorreo] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [confirmarContraseña, setConfirmarContraseña] = useState('');
    const [tipousuario, setTipousuario] = useState('Comprador'); // Valor por defecto
    const [nombretienda, setNombretienda] = useState(''); // Solo para vendedores

    const handleRegisterSubmit = async (e) => {
      e.preventDefault();

      let dataToSend = {
          nombre, apellido, correo, contraseña, tipousuario
      };

      // Si el usuario es Vendedor se usa nombretienda
      if (tipousuario === 'Vendedor') {
          if (!nombretienda) {
              alert("El nombre de la tienda es obligatorio para vendedores.");
              return;
          }
          dataToSend.nombretienda = nombretienda;
      }
      
      // Validar contraseña
      if (contraseña !== confirmarContraseña) {
          alert("Las contraseñas no coinciden.");
          return;
      }

      try {
          // 1. Registrar el usuario en la tabla usuario
          const response = await fetch(`${API_BASE_URL}/usuario`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(dataToSend),
          });

          if (response.ok) {
              const usuarioCreado = await response.json();
              const idUsuario = usuarioCreado.idusuario; // O el campo que devuelva tu API

              // 2. Si el usuario es Administrador, crear registro en tabla administrador
              if (tipousuario === 'Administrador') {
                  try {
                      const adminResponse = await fetch(`${API_BASE_URL}/administrador`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                              idusuario: idUsuario
                              // idadmin se auto-generará en la base de datos
                          }),
                      });

                      if (!adminResponse.ok) {
                          const errorText = await adminResponse.text();
                          console.error("Error al crear administrador:", errorText);
                          // Continuamos aunque falle la creación del administrador
                      } else {
                          console.log("Administrador creado exitosamente en ambas tablas");
                      }
                  } catch (adminError) {
                      console.error("Error en creación de administrador:", adminError);
                      // Continuamos aunque falle la creación del administrador
                  }
              }

              alert(`Registro exitoso como ${tipousuario}. ¡Ahora puedes iniciar sesión!`);
              setViewMode('login');
          } else {
              const errorText = await response.text();
              alert(`Error en el registro: ${errorText}`);
          }
      } catch (error) {
          alert("Error de conexión con el servidor al registrar.");
      }
    };

    return (
      <Container className="my-5 p-4 border rounded shadow-lg" style={{ maxWidth: '500px' }}>
        <h2 className="text-center text-blue-700 mb-4">Registro de Usuario</h2>
        <Form onSubmit={handleRegisterSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridApellido">
              <Form.Label>Apellido</Form.Label>
              <Form.Control type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} required />
            </Form.Group>
          </Row>

          <Form.Group className="mb-3" controlId="formGridCorreo">
            <Form.Label>Correo Electrónico</Form.Label>
            <Form.Control type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
          </Form.Group>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridContraseña">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control type="password" value={contraseña} onChange={(e) => setContraseña(e.target.value)} required />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridConfirmarContraseña">
              <Form.Label>Confirmar Contraseña</Form.Label>
              <Form.Control type="password" value={confirmarContraseña} onChange={(e) => setConfirmarContraseña(e.target.value)} required />
            </Form.Group>
          </Row>

          <Form.Group className="mb-3" controlId="formGridTipoUsuario">
            <Form.Label>Tipo de Usuario</Form.Label>
            <InputGroup>
              <Form.Select value={tipousuario} onChange={(e) => setTipousuario(e.target.value)}>
                <option value="Comprador">Comprador</option>
                <option value="Vendedor">Vendedor</option>
                <option value="Administrador">Administrador</option>
              </Form.Select>
            </InputGroup>
          </Form.Group>

          {/* Campo de Nombre de Tienda (Solo para Vendedor) */}
          {tipousuario === 'Vendedor' && (
            <Form.Group className="mb-3" controlId="formGridNombreTienda">
              <Form.Label>Nombre de la Tienda</Form.Label>
              <Form.Control type="text" value={nombretienda} onChange={(e) => setNombretienda(e.target.value)} required />
            </Form.Group>
          )}

          <div className="d-grid gap-2">
            <Button variant="primary" type="submit" className="bg-blue-600 hover:bg-blue-700">
              Registrarme
            </Button>
          </div>
          <p className="text-center mt-3">
            ¿Ya tienes cuenta? <span className="text-blue-500 cursor-pointer" onClick={() => setViewMode('login')}>Inicia Sesión</span>
          </p>
        </Form>
      </Container>
    );
  };

  // MÓDULO 2.2: LoginScreen (Inicio de Sesión)

  const LoginScreen = ({ setViewMode, handleLoginSuccess, API_BASE_URL }) => {
    const [correo, setCorreo] = useState('');
    const [contraseña, setContraseña] = useState('');

   
    const handleLoginSubmit = async (e) => {
      e.preventDefault();
      try {
          const response = await fetch(`${API_BASE_URL}/usuario/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ correo, contraseña }),
          });

          if (response.ok) {
              const userData = await response.json();
              // Pasa el objeto completo de datos del usuario al componente Home
              handleLoginSuccess(userData); 
          } else {
              // Manejo de errores 401 
              const errorText = await response.text();
              alert(`Error al iniciar sesión: ${errorText}`);
          }
      } catch (error) {
          alert("Error de conexión con el servidor.");
      }
    };

    return (
      <Container className="my-5 p-4 border rounded shadow-lg" style={{ maxWidth: '400px' }}>
        <h2 className="text-center text-blue-700 mb-4">Iniciar Sesión</h2>
        <Form onSubmit={handleLoginSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Correo Electrónico</Form.Label>
            <Form.Control type="email" placeholder="Ingresa correo" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-4" controlId="formBasicPassword">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control type="password" placeholder="Contraseña" value={contraseña} onChange={(e) => setContraseña(e.target.value)} required />
          </Form.Group>

          <div className="d-grid gap-2">
            <Button variant="primary" type="submit" className="bg-blue-600 hover:bg-blue-700">
              Ingresar
            </Button>
          </div>
          <p className="text-center mt-3">
            ¿No tienes cuenta? <span className="text-blue-500 cursor-pointer" onClick={() => setViewMode('register')}>Regístrate</span>
          </p>
        </Form>
      </Container>
    );
  };


// MÓDULO 2.3: ProfileScreen (Perfil de Usuario)

const ProfileScreen = ({ setViewMode, userData, handleLogout }) => {
  const isVendor = userData.userType === 'Vendedor';
  const isAdmin = userData.userType === 'Administrador';

  return (
    <Container className="my-5 p-5 border rounded shadow-lg bg-white" style={{ maxWidth: '800px' }}>
      <h2 className="text-center text-blue-700 mb-5">Mi Perfil</h2>
      
      <Row className="mb-5 d-flex align-items-center">
        <Col md={4} className="text-center">
          <img 
            src={userData.profilePic || "/default-profile.png"} 
            alt="Foto de Perfil" 
            className="rounded-circle border border-primary p-1 shadow-sm"
            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
          />
        </Col>
        <Col md={8}>
          <h3 className="text-3xl font-bold text-gray-800">{userData.nombre} {userData.apellido}</h3>
          <p className="text-lg text-gray-600 mb-1">
            <strong className="text-blue-600">Correo:</strong> {userData.email}
          </p>
          <p className="text-lg text-gray-600">
            <strong className="text-blue-600">Rol:</strong> {userData.userType}
          </p>
          {isVendor && (
            <p className="text-lg text-gray-600">
              <strong className="text-blue-600">Tienda:</strong> {userData.nombreTienda}
            </p>
          )}
        </Col>
      </Row>

      <hr />

      {/* OPCIONES ESPECÍFICAS POR ROL */}
      <h3 className="text-xl font-bold text-blue-700 mt-6 mb-4">
        {isAdmin ? "Opciones de Administrador" : "Opciones de Vendedor"}
      </h3>
      
      <div className="d-grid gap-3">
        {/* OPCIONES PARA VENDEDOR - SOLO CREAR Y ADMINISTRAR SUS PRODUCTOS */}
        {isVendor && (<>
          <Button 
            variant="info" 
            className="text-white hover:bg-info-dark transition"
            onClick={() => setViewMode('addProduct')}
          >
            <span className="font-semibold">📦 Crear Nuevo Producto</span>
          </Button>
          <Button 
            variant="secondary" 
            className="hover:bg-secondary-dark transition"
            onClick={() => setViewMode('manageProducts')}
          >
            <span className="font-semibold">⚙️ Administrar Mis Productos</span>
          </Button>
        </>)}

        {/* OPCIONES PARA ADMINISTRADOR - ADMINISTRAR TODOS LOS PRODUCTOS */}
        {isAdmin && (
          <Button 
            variant="warning" 
            className="text-white hover:bg-warning-dark transition"
            onClick={() => setViewMode('manageProducts')}
          >
            <span className="font-semibold">👑 Administrar Todos los Productos</span>
          </Button>
        )}

        {/* BOTÓN GENERAL DE CERRAR SESIÓN */}
        <Button 
          variant="danger" 
          className="mt-4 bg-red-600 hover:bg-red-700 transition"
          onClick={handleLogout}
        >
          <span className="font-semibold">🚪 Cerrar Sesión</span>
        </Button>
      </div>
      
      <p className="text-center mt-5">
        <span className="text-blue-500 cursor-pointer" onClick={() => setViewMode('home')}>← Volver a la página principal</span>
      </p>
    </Container>
  );
};
  // =========================================================================
  // MÓDULOS 3: ADMINISTRACIÓN DE PRODUCTOS (VENDEDOR Y ADMINISTRADOR)
  // =========================================================================

  // MÓDULO 3.1: ManageProductsScreen (Listar, Modificar, Eliminar)
const ManageProductsScreen = ({ setViewMode, userData, API_BASE_URL, allProducts, fetchProductos, setEditingProduct }) => {
  
  // Filtrar productos: vendedor ve solo sus productos, administrador ve todos
  const isAdmin = userData.userType === 'Administrador';
  const isVendor = userData.userType === 'Vendedor';
  
  const displayedProducts = isAdmin 
    ? allProducts // Administrador ve todos los productos
    : allProducts.filter(p => p.idvendedor === userData.idrol); // Vendedor ve solo sus productos

  const handleDelete = async (idproducto, productName, vendorName) => {
    const confirmMessage = isAdmin 
      ? `¿Estás seguro de que quieres eliminar el producto "${productName}" del vendedor ${vendorName}? Esta acción es irreversible.`
      : `¿Estás seguro de que quieres eliminar tu producto "${productName}"? Esta acción es irreversible.`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/producto/idproducto/${idproducto}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert(isAdmin 
          ? `Producto "${productName}" eliminado exitosamente.` 
          : "Producto eliminado exitosamente."
        );
        fetchProductos(); // Recargar la lista de productos
      } else {
        const errorText = await response.text();
        alert(`Error al eliminar producto: ${errorText}`);
      }
    } catch (error) {
      alert("Error de conexión con el servidor al eliminar el producto.");
    }
  };
  
  const handleModifyClick = (product) => {
    // Vendedor solo puede modificar sus productos, administrador puede modificar todos
    if ((isVendor && product.idvendedor === userData.idrol) || isAdmin) {
      setEditingProduct(product);
      setViewMode('modifyProductDetails');
    } else {
      alert("No tienes permisos para modificar este producto.");
    }
  }

  return (
    <Container className="my-5 p-5 border rounded shadow-lg bg-white" style={{ maxWidth: '1000px' }}>
      <h2 className="text-center text-blue-700 mb-5">
        {isAdmin ? "👑 Administrar Todos los Productos" : `⚙️ Administrar Mis Productos (${userData.nombreTienda})`}
      </h2>
      
      {/* Solo vendedores pueden crear productos */}
      {isVendor && (
        <div className="d-flex justify-content-end mb-4">
          <Button 
            variant="success" 
            onClick={() => setViewMode('addProduct')}
          >
            ➕ Crear Nuevo Producto
          </Button>
        </div>
      )}

      {displayedProducts.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          {isAdmin ? "No hay productos registrados en el sistema." : "Aún no tienes productos registrados."}
        </p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                {isAdmin && <th>Vendedor</th>}
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {displayedProducts.map(p => (
                <tr key={p.idproducto}>
                  <td>{p.idproducto}</td>
                  <td>{p.nombreproducto}</td>
                  <td>${p.precio}</td>
                  <td>{p.stock}</td>
                  {isAdmin && <td>{p.nombreVendedor || `Vendedor ID: ${p.idvendedor}`}</td>}
                  <td>{p.estado}</td>
                  <td style={{ minWidth: '160px' }}>
                    {/* Botón Editar - Disponible para ambos roles en sus respectivos productos */}
                    <Button 
                      variant="warning" 
                      size="sm" 
                      className="me-2 text-white"
                      onClick={() => handleModifyClick(p)}
                    >
                      ✏️ Editar
                    </Button>
                    {/* Botón Eliminar - Disponible para ambos roles en sus respectivos productos */}
                    <Button 
                      variant="danger" 
                      size="sm" 
                      onClick={() => handleDelete(p.idproducto, p.nombreproducto, p.nombreVendedor || `Vendedor ID: ${p.idvendedor}`)}
                    >
                      🗑️ Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-center mt-5">
        <span className="text-blue-500 cursor-pointer" onClick={() => setViewMode('profile')}>← Volver al Perfil</span>
      </p>
    </Container>
  );
};

  // MÓDULO 3.2: ModifyProductScreen (Modificar un Producto Existente)
  const ModifyProductScreen = ({ setViewMode, userData, API_BASE_URL, editingProduct, setEditingProduct, fetchProductos }) => {
      
      // Estado inicial pre-llenado con los datos del producto
      const [idproducto] = useState(editingProduct.idproducto);
      const [nombre, setNombre] = useState(editingProduct.nombreproducto);
      const [descripcion, setDescripcion] = useState(editingProduct.descripcion);
      const [precio, setPrecio] = useState(editingProduct.precio.toString());
      const [stock, setStock] = useState(editingProduct.stock.toString());
      const [imagen, setImagen] = useState(editingProduct.imagen); 
      const [estado, setEstado] = useState(editingProduct.estado); 
      const [idcategoria] = useState(editingProduct.idcategoria);
      
      const categoriasSimuladas = ["Tecnología", "Audio", "Fotografía", "Libros", "Hogar", "Otros"]; 
      // El campo de categoría está simplificado, usando solo el ID del producto original.

      const handleUpdateProductSubmit = async (e) => {
          e.preventDefault();

          if (!nombre || !descripcion || !precio || !stock) {
              alert("Por favor, complete todos los campos requeridos.");
              return;
          }

          const productData = {
              idproducto: idproducto,
              idvendedor: editingProduct.idvendedor,
              idcategoria: idcategoria, 
              nombreproducto: nombre,
              descripcion: descripcion,
              precio: parseFloat(precio),
              stock: parseInt(stock, 10),
              imagen: imagen || "/default-product.png",
              estado: estado,
          };
          
          try {
              
              const response = await fetch(`${API_BASE_URL}/producto`, {
                  method: 'PUT', 
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(productData),
              });

              if (response.ok) {
                  alert(`Producto "${nombre}" actualizado exitosamente.`);
                  fetchProductos(); 
                  setEditingProduct(null);
                  setViewMode('manageProducts'); 
              } else {
                  const errorText = await response.text();
                  alert(`Error al actualizar producto: ${errorText}. Asegúrate de que tu backend Spring Boot soporta el método PUT en /producto.`);
              }
          } catch (error) {
              alert("Error de conexión con el servidor al actualizar el producto.");
          }
      };

      return (
          <Container className="my-5 p-4 border rounded shadow-lg" style={{ maxWidth: '600px' }}>
              <h2 className="text-center text-blue-700 mb-4">Editar Producto: {editingProduct.nombreproducto}</h2>
              
              <Form onSubmit={handleUpdateProductSubmit}>
                  <Form.Group className="mb-3" controlId="formNombreProducto">
                      <Form.Label>Nombre del Producto</Form.Label>
                      <Form.Control type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formDescripcion">
                      <Form.Label>Descripción</Form.Label>
                      <Form.Control as="textarea" rows={3} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
                  </Form.Group>

                  <Row className="mb-3">
                      <Form.Group as={Col} controlId="formPrecio">
                          <Form.Label>Precio ($)</Form.Label>
                          <Form.Control type="number" step="0.01" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
                      </Form.Group>

                      <Form.Group as={Col} controlId="formStock">
                          <Form.Label>Stock</Form.Label>
                          <Form.Control type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
                      </Form.Group>
                  </Row>

                  <Form.Group className="mb-3" controlId="formEstado">
                      <Form.Label>Estado</Form.Label>
                      <Form.Select value={estado} onChange={(e) => setEstado(e.target.value)}>
                          <option value="Activo">Activo</option>
                          <option value="Inactivo">Inactivo</option>
                      </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="formImagen">
                      <Form.Label>URL/Ruta de Imagen (Opcional)</Form.Label>
                      <Form.Control type="text" value={imagen} onChange={(e) => setImagen(e.target.value)} />
                  </Form.Group>

                  <div className="d-grid gap-2">
                      <Button variant="primary" type="submit" className="bg-blue-600 hover:bg-blue-700">
                          Guardar Cambios
                      </Button>
                  </div>
                  <p className="text-center mt-3">
                      <span className="text-blue-500 cursor-pointer" onClick={() => setViewMode('manageProducts')}>← Volver a Administrar Productos</span>
                  </p>
              </Form>
          </Container>
      );
  };


  // MÓDULO 3.3: AddProductScreen (Agregar Producto) 

  const AddProductScreen = ({ setViewMode, userData, API_BASE_URL, fetchProductos, categorias }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [idcategoria, setIdCategoria] = useState('');
  const [imagen, setImagen] = useState('');

 
  const categoriasDisponibles = categorias || [
    { idcategoria: 1, nombrecategoria: "Tecnologia" },
    { idcategoria: 2, nombrecategoria: "Moda" },
    { idcategoria: 3, nombrecategoria: "Hogar" },
    { idcategoria: 4, nombrecategoria: "Libros" },
    { idcategoria: 5, nombrecategoria: "Deportes" },
    { idcategoria: 6, nombrecategoria: "Electrónica" },
    { idcategoria: 7, nombrecategoria: "Juguetes" },
    { idcategoria: 8, nombrecategoria: "Belleza" },
    { idcategoria: 9, nombrecategoria: "Salud" },
    { idcategoria: 10, nombrecategoria: "Mascotas" }
  ];

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !descripcion || !precio || !stock || !idcategoria) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    const productData = {
      idvendedor: userData.idrol,
      idcategoria: parseInt(idcategoria),
      nombreproducto: nombre,
      descripcion: descripcion,
      precio: parseFloat(precio),
      stock: parseInt(stock, 10),
      imagen: imagen || "/default-product.png",
      estado: "Activo"
    };
    
    try {
      const response = await fetch(`${API_BASE_URL}/producto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        alert(`Producto "${nombre}" agregado exitosamente.`);
        fetchProductos();
        setViewMode('manageProducts');
      } else {
        const errorText = await response.text();
        alert(`Error al agregar producto: ${errorText}`);
      }
    } catch (error) {
      alert("Error de conexión con el servidor al guardar el producto.");
    }
  };

  return (
    <Container className="my-5 p-4 border rounded shadow-lg" style={{ maxWidth: '600px' }}>
      <h2 className="text-center text-blue-700 mb-4">Añadir Producto ({userData.nombreTienda})</h2>
      
      <Form onSubmit={handleAddProductSubmit}>
        <Form.Group className="mb-3" controlId="formNombreProducto">
          <Form.Label>Nombre del Producto</Form.Label>
          <Form.Control type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formDescripcion">
          <Form.Label>Descripción</Form.Label>
          <Form.Control as="textarea" rows={3} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
        </Form.Group>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="formPrecio">
            <Form.Label>Precio ($)</Form.Label>
            <Form.Control type="number" step="0.01" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
          </Form.Group>

          <Form.Group as={Col} controlId="formStock">
            <Form.Label>Stock</Form.Label>
            <Form.Control type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
          </Form.Group>
        </Row>

        <Form.Group className="mb-3" controlId="formCategoria">
          <Form.Label>Categoría</Form.Label>
          <Form.Select 
            value={idcategoria} 
            onChange={(e) => setIdCategoria(e.target.value)} 
            required
            className="text-dark"
            style={{ color: '#000 !important' }}
          >
            <option value="" style={{ color: '#6c757d' }}>Seleccione una categoría</option>
            {categoriasDisponibles.map(cat => (
              <option 
                key={cat.idcategoria} 
                value={cat.idcategoria}
                style={{ color: '#000' }}
              >
                {cat.nombrecategoria || `Categoría ${cat.idcategoria}`}
              </option>
            ))}
          </Form.Select>
          
          
          {idcategoria && (
            <div className="alert alert-info mt-2 p-2">
              <strong>Categoría seleccionada:</strong> {
                categoriasDisponibles.find(c => c.idcategoria === parseInt(idcategoria))?.nombrecategoria || `ID: ${idcategoria}`
              }
            </div>
          )}
        </Form.Group>

        <Form.Group className="mb-4" controlId="formImagen">
          <Form.Label>URL/Ruta de Imagen (Opcional)</Form.Label>
          <Form.Control type="text" value={imagen} onChange={(e) => setImagen(e.target.value)} />
        </Form.Group>

        <div className="d-grid gap-2">
          <Button variant="success" type="submit" className="bg-green-600 hover:bg-green-700">
            Guardar Producto
          </Button>
        </div>
        <p className="text-center mt-3">
          <span className="text-blue-500 cursor-pointer" onClick={() => setViewMode('profile')}>← Volver al Perfil</span>
        </p>
      </Form>
    </Container>
  );
};


  // MÓDULO 3.4: CarritoScreen (Carrito de Compras)

  const CarritoScreen = ({ setViewMode }) => {
      return (
          <Container className="my-5 p-5 border rounded shadow-lg bg-white" style={{ maxWidth: '800px' }}>
              <h2 className="text-center text-blue-700 mb-5">🛒 Mi Carrito de Compras</h2>
              <p className="text-center text-gray-600">
                  Aquí se mostrarán los productos que has añadido a tu carrito. Esta funcionalidad está en desarrollo.
              </p>
              <div className="d-grid gap-2 mt-4">
                  <Button 
                      variant="primary" 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => setViewMode('home')}
                  >
                      Continuar Comprando
                  </Button>
              </div>
          </Container>
      );
  };


  // =========================================================================
  // MÓDULO 4: HomeScreen (Catálogo y Productos)
  // =========================================================================

  const HomeScreen = ({ productos, setViewMode, categorias, categoriaSeleccionada }) => {

    // Lógica para filtrar los productos:
      const productosFiltrados = useMemo(() => {
          if (!categoriaSeleccionada) {
            return productos; // Si no hay ID seleccionado, muestra todos
          }

          // Filtra los productos cuya idcategoria coincide con la seleccionada
          return productos.filter(p => p.idcategoria === categoriaSeleccionada);
        }, [productos, categoriaSeleccionada]); // Recalcula solo cuando cambian productos o la categoría
        
      // Buscar el nombre de la categoría seleccionada para el encabezado
      const nombreCategoria = categoriaSeleccionada
          ? categorias.find(c => c.idcategoria === categoriaSeleccionada)?.nombrecategoria
          : 'Explora Nuestros Productos';

      return (
      <Container className="my-5">
        <h2 className="text-center text-blue-700 mb-5 font-bold">
          {nombreCategoria} 
        </h2>
        
        {/* El Carrusel solo se muestra si NO hay categoría seleccionada.*/}
        {!categoriaSeleccionada && ( 
            <Carousel className="mb-5 shadow-xl rounded-lg overflow-hidden">
              <Carousel.Item>
                {/* RUTA DE IMAGEN 1 */}
                <img className="d-block w-50 mx-auto"src="/CarruselCategorias/carrusel1.avif" alt="Primer slide"/>
                <Carousel.Caption className="p-0">
                  <div className="bg-black bg-opacity-50 p-6 rounded fs-6 w-50 mx-auto">
                    <h3>Nuevos Lanzamientos en Tecnología</h3>
                    <p>Descubre los últimos gadgets y dispositivos inteligentes.</p>
                  </div>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                {/* RUTA DE IMAGEN 2 */}
                <img className="d-block w-50 mx-auto" src="/CarruselCategorias/carrusel3.jpg" alt="Segundo slide" />
                <Carousel.Caption className="p-0">
                  <div className="bg-black bg-opacity-50 p-6 rounded fs-6 w-50 mx-auto">
                    <h3>Lo ultimo en moda</h3>
                    <p>Descubre nuestro amplio catalogo.</p>
                  </div>
                </Carousel.Caption>
              </Carousel.Item>
            </Carousel>
        )}

        {/* Grid de Productos */}
        <Row xs={1} md={2} lg={4} className="g-4">
          {productosFiltrados.length > 0 ? ( // Usa la lista filtrada
            productosFiltrados.map((producto) => ( // Usa la lista filtrada

              <Col key={producto.idproducto}> 
                <Card className="h-100 shadow-sm hover:shadow-lg transition duration-300">
                  <Card.Img 
                    variant="top" 
                    src={producto.imagen || "/default-product.png"} // Usa el campo imagen de la BD
                    className="p-3" 
                    style={{ height: '200px', objectFit: 'contain' }}
                  />
                  <Card.Body className="d-flex flex-column">
                    {/* Usa el campo nombreproducto de la BD */}
                    <Card.Title className="text-blue-700 font-bold">{producto.nombreproducto}</Card.Title>
                    <Card.Text className="text-sm text-gray-600 flex-grow-1">
                      {producto.descripcion.substring(0, 50)}...
                    </Card.Text>
                    <div className="mt-auto">
                        {/* Usa el campo precio de la BD */}
                        <p className="text-2xl font-extrabold text-green-600 mb-2">
                            ${producto.precio}
                        </p>
                        <Button variant="primary" className="w-100 bg-blue-600 hover:bg-blue-700">
                            Ver Detalle
                        </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col xs={12} className="text-center">
              <p className="text-gray-500 text-lg">No se encontraron productos disponibles en esta categoría.</p>
            </Col>
          )}
        </Row>
        <p className="text-center mt-5 text-gray-500">
            Mostrando {productosFiltrados.length} resultados. {/* Usa el conteo de la lista filtrada */}
        </p>
      </Container>
    );
    };


  // =========================================================================
  // MÓDULO 5: COMPONENTE PRINCIPAL 'HOME' Y LÓGICA DE NAVEGACIÓN 
  // =========================================================================

  export default function Home() {

    
    const [viewMode, setViewMode] = useState('home'); 
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [categorias, setCategorias] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
    const [productos, setProductos] = useState([]); 
    const [editingProduct, setEditingProduct] = useState(null); // Estado para el producto que se está editando

    const [userData, setUserData] = useState({
        idusuario: null, 
        idrol: null,
        nombre: 'Invitado',
        apellido: '',
        email: '',
        userType: 'Comprador', 
        nombreTienda: null,
        profilePic: null,
    });

    // FUNCIÓN PARA OBTENER DATOS DE SESIÓN 
    const getSessionData = () => {
      const profileJson = sessionStorage.getItem("userProfile");
      const loggedIn = sessionStorage.getItem("isLoggedIn") === "true";
      
      if (loggedIn && profileJson) {
          return JSON.parse(profileJson);
      }
      return null; 
    };
   

    // FUNCIÓN PARA CARGAR PRODUCTOS DESDE LA API 
    const fetchProductos = async () => {
      try {
          const response = await fetch(`${API_BASE_URL}/producto`);
          if (response.ok) {
              const data = await response.json();
              setProductos(data); 
          } else {
              console.error("Error al cargar productos desde la API:", response.statusText);
              setProductos([]); // Dejar vacío si falla la carga
          }
      } catch (error) {
          console.error("Error de conexión al obtener productos:", error);
          setProductos([]);
      }
    };

    // --------------------------------------------------

    const fetchCategorias = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/categoria`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCategorias(data);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };
    // --------------------------------------------------


    // EFECTO PARA RESTAURAR LA SESIÓN Y CARGAR PRODUCTOS AL INICIO 
    useEffect(() => {
        const sessionProfile = getSessionData();
        if (sessionProfile) {
            setIsLoggedIn(true);
            setUserData(sessionProfile);
        }
        fetchProductos(); // Cargar productos de la API         
        fetchCategorias();
    }, []);

    
    // --------------------------------------------------

    const handleLoginSuccess = (usuarioData) => { 
        const userProfile = { 
            idusuario: usuarioData.idusuario,
            idrol: usuarioData.idvendedor || usuarioData.idcomprador || null, 
            nombre: usuarioData.nombre, 
            apellido: usuarioData.apellido,
            email: usuarioData.correo, 
            userType: usuarioData.tipousuario, 
            nombreTienda: usuarioData.nombretienda || null, 
            profilePic: null, 
        };

        setIsLoggedIn(true);
        setUserData(userProfile);
        
        sessionStorage.setItem("userProfile", JSON.stringify(userProfile));
        sessionStorage.setItem("isLoggedIn", "true"); 
        
        setViewMode('home'); 
    };

    const handleLogout = () => {
        sessionStorage.removeItem("userProfile");
        sessionStorage.removeItem("isLoggedIn");
        
        setIsLoggedIn(false);
        setUserData({
            idusuario: null, 
            idrol: null,
            nombre: 'Invitado',
            apellido: '',
            email: '',
            userType: 'Comprador',
            nombreTienda: null,
            profilePic: null,
        });
        setViewMode('home');
    };


    const handleSearchChange = (e) => {
      setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e) => {
      e.preventDefault();
      if (searchTerm) {
        
        const filtered = productos.filter(p =>
          
          p.nombreproducto.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setProductos(filtered); 
      } else {
        fetchProductos(); // Recargar todos si se borra el filtro
      }
      setViewMode('home'); 
    };

    const renderMainContent = () => {
      switch (viewMode) {
        case 'home':
          return <HomeScreen productos={productos} setViewMode={setViewMode} categorias={categorias} categoriaSeleccionada={categoriaSeleccionada}  />;
        case 'catalogo': 
          return (
            <HomeScreen 
              productos={productos} 
              setViewMode={setViewMode} 
              categorias={categorias} 
              categoriaSeleccionada={categoriaSeleccionada} 
            />
          );
          case 'login':
          return <LoginScreen setViewMode={setViewMode} handleLoginSuccess={handleLoginSuccess} API_BASE_URL={API_BASE_URL} />;
        case 'register':
          return <RegisterScreen setViewMode={setViewMode} API_BASE_URL={API_BASE_URL} />;
        case 'profile':
          return <ProfileScreen setViewMode={setViewMode} userData={userData} handleLogout={handleLogout} />;
        case 'addProduct':
          return <AddProductScreen setViewMode={setViewMode} userData={userData} API_BASE_URL={API_BASE_URL} fetchProductos={fetchProductos} categorias={categorias}/>;
        case 'manageProducts': 
          return <ManageProductsScreen 
                    setViewMode={setViewMode} 
                    userData={userData} 
                    API_BASE_URL={API_BASE_URL}
                    allProducts={productos} 
                    fetchProductos={fetchProductos} 
                    setEditingProduct={setEditingProduct} 
                />;
        case 'modifyProductDetails': 
        
          if (!editingProduct) {
              setViewMode('manageProducts');
              return <h2 className='text-center my-5 text-red-600'>Error: No se seleccionó ningún producto para editar.</h2>;
          }
          return <ModifyProductScreen
                    setViewMode={setViewMode} 
                    userData={userData} 
                    API_BASE_URL={API_BASE_URL}
                    editingProduct={editingProduct} 
                    setEditingProduct={setEditingProduct}
                    fetchProductos={fetchProductos}
                />;
        case 'carrito': 
          return <CarritoScreen setViewMode={setViewMode} />;
        default:
          return <HomeScreen 
                  productos={productos} 
                  setViewMode={setViewMode} 
                  categorias={categorias} 
                  categoriaSeleccionada={categoriaSeleccionada} 
              /> 
      }
    };

    return (
      <div>
        {/* Barra de Navegación */}
        <Navbar bg="light" expand="lg" className="shadow-md sticky-top">
          <Container>
            <NavbarBrand className="text-blue-700 font-extrabold text-2xl cursor-pointer" onClick={() => { setViewMode('home'); setCategoriaSeleccionada(null); }}
              style={{ cursor: 'pointer' }}>
              
              {/* RUTA DE IMAGEN DEL LOGO */}
              <img src="/Logo.png" height= "35" width= "150" alt="Adaptech Logo"  /> 
            
            </NavbarBrand>
            <NavbarToggle aria-controls="basic-navbar-nav" />
            <NavbarCollapse id="basic-navbar-nav">
              
              <Nav className="me-auto">
                <NavLink 
                      onClick={() => {
                          setViewMode('home');
                          setCategoriaSeleccionada(null); // Limpia el filtro al ir a Home
                      }}
                  >
                      Inicio
                  </NavLink>

                  {/* Menú de Categorías (NavDropdown) */}
                  <NavDropdown title="Categorías" id="basic-nav-dropdown">
                      {/* Opción para mostrar todos los productos */}
                      <NavDropdown.Item 
                          onClick={() => {
                              setCategoriaSeleccionada(null); // Limpia el filtro
                              setViewMode('home');
                          }}
                      >
                          🏠 Todas las Categorías
                      </NavDropdown.Item>

                      <NavDropdown.Divider />

                      {/* Mapear las categorías obtenidas de la API */}
                      {categorias.map((cat) => (
                          <NavDropdown.Item
                              key={cat.idcategoria}
                              onClick={() => {
                                  setCategoriaSeleccionada(cat.idcategoria); // Establece el filtro
                                  setViewMode('catalogo');
                              }}
                          >
                              {cat.nombrecategoria}
                          </NavDropdown.Item>
                      ))}
                  </NavDropdown>

              </Nav>
              
              {/* Opciones de Búsqueda */}
              {(viewMode === 'home' || viewMode === 'search') && (
                <Form className="d-flex align-items-center" onSubmit={handleSearchSubmit}>
                  <Form.Control
                    type="search"
                    placeholder="Buscar productos..."
                    className="me-2 rounded-lg border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    style={{ minWidth: '200px' }}
                  />
                  <Button
                    variant="outline-primary"
                    className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition"
                    type="submit"
                  >
                    Buscar
                  </Button>
                </Form>
              )}

              {/* Opciones de Usuario y Carrito */}
              <Nav className="ms-auto d-flex align-items-center">
                  
                  {/* BOTÓN DE CARRITO */}
                  <Button
                      variant="outline-primary"
                      className="me-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition"
                      onClick={() => setViewMode('carrito')}
                  >
                      🛒 Carrito
                  </Button>

                  {isLoggedIn ? (
                      <NavDropdown 
                          title={`Hola, ${userData.nombre}`} 
                          id="user-nav-dropdown" 
                          align="end" 
                          className="ms-2"
                      >
                          <NavDropdown.Item onClick={() => setViewMode('profile')}>
                              👤 Mi Perfil ({userData.userType})
                          </NavDropdown.Item>
                          {userData.userType === 'Vendedor' && (
                              <NavDropdown.Item onClick={() => setViewMode('manageProducts')}>
                                  ⚙️ Administrar Productos
                              </NavDropdown.Item>
                          )}
                          <NavDropdown.Divider />
                          <NavDropdown.Item onClick={handleLogout}>
                              🚪 Cerrar Sesión
                          </NavDropdown.Item>
                      </NavDropdown>
                  ) : (
                      <Button 
                          variant="primary" 
                          className="ms-2 bg-blue-600 hover:bg-blue-700"
                          onClick={() => setViewMode('login')}
                      >
                          Ingresar
                      </Button>
                  )}
              </Nav>

            </NavbarCollapse>
          </Container>
        </Navbar>

        {/* Area de Contenido Principal, Aqui se llama a la funcion de enrutamiento */}
        {renderMainContent()}
        
        {/* Pie de pagina */}
        <footer className="bg-blue-100 text-center text-gray-700 mt-8 py-6 shadow-inner">
          <Container>
            <p className="mb-1 font-medium">
              © 2025 Adaptech — Todos los derechos reservados
            </p>
            <small className="text-gray-500">
              Desarrollado por <strong>Santiago Betancur</strong>
            </small>
          </Container>
        </footer>
      </div>
    );
  }