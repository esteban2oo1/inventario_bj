'use client';
import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, BarChart, ShoppingCart, TrendingUp, Menu, Pencil, Trash, Save, Plus, RefreshCw, Truck } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export function InventoryManagerComponent() {
  const [products, setProducts] = useState([])
  const [sales, setSales] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [newProduct, setNewProduct] = useState({
    id: '',
    name: '',
    brand: '',
    size: '',
    price: '',
    quantity: '',
    category: ''
  })
  const [newSale, setNewSale] = useState({
    productId: '',
    quantity: 1
  })
  const [newSupplier, setNewSupplier] = useState({
    id: '',
    name: '',
    contact: '',
    email: '',
    phone: '',
    address: ''
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [activeSection, setActiveSection] = useState('products')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [editingSupplier, setEditingSupplier] = useState(null)

  const handleInputChange = (e, setter) => {
    const { name, value } = e.target
    setter(prev => ({ ...prev, [name]: value }))
  }

  const addProduct = () => {
    if (newProduct.id && !products.some(p => p.id === newProduct.id)) {
      const productToAdd = {
        ...newProduct,
        price: parseFloat(newProduct.price).toFixed(2),
        quantity: parseInt(newProduct.quantity, 10).toString()
      }
      setProducts(prev => [...prev, productToAdd])
      setNewProduct(
        { id: '', name: '', brand: '', size: '', price: '', quantity: '', category: '' }
      )
    } else {
      alert('Por favor, ingrese un ID único para el producto')
    }
  }

  const addSale = () => {
    const saleProduct = products.find(p => p.id === newSale.productId)
    if (saleProduct && parseInt(saleProduct.quantity, 10) >= newSale.quantity) {
      setSales(prev => [...prev, { ...newSale, id: Date.now(), date: new Date() }])
      setProducts(prev => prev.map(p => 
        p.id === newSale.productId ? { ...p, quantity: (parseInt(p.quantity, 10) - newSale.quantity).toString() } : p))
      setNewSale({ productId: '', quantity: 1 })
    } else {
      alert('No hay suficiente stock para esta venta')
    }
  }

  const addSupplier = () => {
    if (newSupplier.id && !suppliers.some(s => s.id === newSupplier.id)) {
      setSuppliers(prev => [...prev, newSupplier])
      setNewSupplier({ id: '', name: '', contact: '', email: '', phone: '', address: '' })
    } else {
      alert('Por favor, ingrese un ID único para el proveedor')
    }
  }

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  const deleteSupplier = (id) => {
    setSuppliers(prev => prev.filter(s => s.id !== id))
  }

  const startEditing = (id, type) => {
    if (type === 'product') {
      setEditingProduct(id)
    } else {
      setEditingSupplier(id)
    }
  }

  const saveEdit = (id, type) => {
    if (type === 'product') {
      setEditingProduct(null)
    } else {
      setEditingSupplier(null)
    }
  }

  const handleEditChange = (e, id, type) => {
    const { name, value } = e.target
    if (type === 'product') {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, [name]: value } : p))
    } else {
      setSuppliers(prev => prev.map(s => s.id === id ? { ...s, [name]: value } : s))
    }
  }

  const updateItem = (id, type) => {
    // Aquí iría la lógica para actualizar el producto o proveedor en la base de datos
    alert(
      `Actualizando ${type === 'product' ? 'producto' : 'proveedor'} con ID: ${id}`
    )
  }

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.size.toLowerCase().includes(searchTerm.toLowerCase()))

  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase()))

  const categories = ['Camisas', 'Pantalones', 'Vestidos', 'Chaquetas', 'Accesorios']

  const dailySalesData = sales.reduce((acc, sale) => {
    const product = products.find(p => p.id === sale.productId)
    if (product) {
      const existingEntry = acc.find(entry => entry.name === product.name)
      if (existingEntry) {
        existingEntry.quantity += sale.quantity
      } else {
        acc.push({ name: product.name, quantity: sale.quantity })
      }
    }
    return acc
  }, [])

  return (
    (<div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-white w-64 shadow-lg fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-center h-20 shadow-md">
          <h1 className="text-3xl font-bold text-primary">BOUTIQUE BFF</h1>
        </div>
        <nav className="mt-10">
          <a
            className={`flex items-center mt-4 py-2 px-6 ${activeSection === 'products' ? 'bg-gray-200 text-gray-700' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'} transition-colors duration-200`}
            href="#"
            onClick={() => setActiveSection('products')}>
            <Package className="h-5 w-5" />
            <span className="mx-3">Productos</span>
          </a>
          <a
            className={`flex items-center mt-4 py-2 px-6 ${activeSection === 'sales' ? 'bg-gray-200 text-gray-700' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'} transition-colors duration-200`}
            href="#"
            onClick={() => setActiveSection('sales')}>
            <ShoppingCart className="h-5 w-5" />
            <span className="mx-3">Ventas</span>
          </a>
          <a
            className={`flex items-center mt-4 py-2 px-6 ${activeSection === 'inventory' ? 'bg-gray-200 text-gray-700' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'} transition-colors duration-200`}
            href="#"
            onClick={() => setActiveSection('inventory')}>
            <BarChart className="h-5 w-5" />
            <span className="mx-3">Inventario</span>
          </a>
          <a
            className={`flex items-center mt-4 py-2 px-6 ${activeSection === 'suppliers' ? 'bg-gray-200 text-gray-700' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'} transition-colors duration-200`}
            href="#"
            onClick={() => setActiveSection('suppliers')}>
            <Truck className="h-5 w-5" />
            <span className="mx-3">Proveedores</span>
          </a>
          <a
            className={`flex items-center mt-4 py-2 px-6 ${activeSection === 'statistics' ? 'bg-gray-200 text-gray-700' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'} transition-colors duration-200`}
            href="#"
            onClick={() => setActiveSection('statistics')}>
            <TrendingUp className="h-5 w-5" />
            <span className="mx-3">Estadísticas</span>
          </a>
        </nav>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header
          className="flex justify-between items-center py-4 px-6 bg-white border-b-4 border-primary">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-500 focus:outline-none lg:hidden">
              <Menu className="h-6 w-6" />
            </button>
          </div>
          <div className="flex items-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              {activeSection === 'products' ? 'Gestión de Productos' : 
               activeSection === 'sales' ? 'Registro de Ventas' :
               activeSection === 'inventory' ? 'Inventario' :
               activeSection === 'suppliers' ? 'Gestión de Proveedores' : 'Estadísticas'}
            </h2>
          </div>
          <div className="flex items-center">
            {/* Add any additional header items here */}
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
          {activeSection === 'products' && (
            <>
              <div className="flex justify-between items-center mb-6">
                <Input
                  placeholder="Buscar por nombre, marca o talla"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm" />
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" /> Nuevo Producto
                    </Button>
                  </DialogTrigger>

                  <DialogContent
                    className="sm:max-w-[425px] bg-white shadow-lg rounded-lg p-4 z-50"
                    style={{ backgroundColor: 'white', opacity: 1 }}
                  >
                    <DialogHeader>
                      <DialogTitle>Agregar Nuevo Producto</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                      <Input
                        placeholder="ID"
                        name="id"
                        value={newProduct.id}
                        onChange={(e) => handleInputChange(e, setNewProduct)} />
                      <Input
                        placeholder="Nombre"
                        name="name"
                        value={newProduct.name}
                        onChange={(e) => handleInputChange(e, setNewProduct)} />
                      <Input
                        placeholder="Marca"
                        name="brand"
                        value={newProduct.brand}
                        onChange={(e) => handleInputChange(e, setNewProduct)} />
                      <Input
                        placeholder="Talla"
                        name="size"
                        value={newProduct.size}
                        onChange={(e) => handleInputChange(e, setNewProduct)} />
                      <Input
                        type="text"
                        placeholder="Precio"
                        name="price"
                        value={newProduct.price}
                        onChange={(e) => handleInputChange(e, setNewProduct)} />
                      <Input
                        type="text"
                        placeholder="Cantidad"
                        name="quantity"
                        value={newProduct.quantity}
                        onChange={(e) => handleInputChange(e, setNewProduct)} />
                      <Select
                        name="category"
                        onValueChange={(value) => setNewProduct(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={addProduct}>Agregar Producto</Button>
                  </DialogContent>
                </Dialog>
              </div>
              <Tabs defaultValue="Camisas">
                <TabsList>
                  
                  {categories.map(category => (
                    <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
                  ))}
                </TabsList>
                {categories.map(category => (
                  <TabsContent key={category} value={category}>
                    <Card>
                      <CardHeader>
                        <CardTitle>{category}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>ID</TableHead>
                              <TableHead>Nombre</TableHead>
                              <TableHead>Marca</TableHead>
                              <TableHead>Talla</TableHead>
                              <TableHead>Precio</TableHead>
                              <TableHead>Cantidad</TableHead>
                              <TableHead>Acciones</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredProducts.filter(product => product.category === category).map(product => (
                              <TableRow key={product.id}>
                                <TableCell>{product.id}</TableCell>
                                <TableCell>
                                  {editingProduct === product.id ? (
                                    <Input
                                      value={product.name}
                                      onChange={(e) => handleEditChange(e, product.id, 'product')}
                                      name="name" />
                                  ) : (
                                    product.name
                                  )}
                                </TableCell>
                                <TableCell>
                                  {editingProduct === product.id ? (
                                    <Input
                                      value={product.brand}
                                      onChange={(e) => handleEditChange(e, product.id, 'product')}
                                      name="brand" />
                                  ) : (
                                    product.brand
                                  )}
                                </TableCell>
                                <TableCell>
                                  {editingProduct === product.id ? (
                                    <Input
                                      value={product.size}
                                      onChange={(e) => handleEditChange(e, product.id, 'product')}
                                      name="size" />
                                  ) : (
                                    product.size
                                  )}
                                </TableCell>
                                <TableCell>
                                  {editingProduct === product.id ? (
                                    <Input
                                      value={product.price}
                                      onChange={(e) => handleEditChange(e, product.id, 'product')}
                                      name="price" />
                                  ) : (
                                    `$${parseFloat(product.price).toFixed(2)}`
                                  )}
                                </TableCell>
                                <TableCell>
                                  {editingProduct === product.id ? (
                                    <Input
                                      value={product.quantity}
                                      onChange={(e) => handleEditChange(e, product.id, 'product')}
                                      name="quantity" />
                                  ) : (
                                    product.quantity
                                  )}
                                </TableCell>
                                <TableCell>
                                  {editingProduct === product.id ? (
                                    <Button onClick={() => saveEdit(product.id, 'product')} size="sm">
                                      <Save className="h-4 w-4" />
                                    </Button>
                                  ) : (
                                    <Button onClick={() => startEditing(product.id, 'product')} size="sm">
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                  )}
                                  <Button
                                    onClick={() => deleteProduct(product.id)}
                                    size="sm"
                                    variant="destructive"
                                    className="ml-2">
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            </>
          )}

          {activeSection === 'sales' && (
            <>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Registrar Venta</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Select
                      onValueChange={(value) => setNewSale(prev => ({ ...prev, productId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar producto" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map(product => (
                          <SelectItem key={product.id} value={product.id}>{product.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      placeholder="Cantidad"
                      value={newSale.quantity}
                      onChange={(e) => setNewSale(prev => ({ ...prev, quantity: Number(e.target.value) }))} />
                  </div>
                  <Button className="mt-4" onClick={addSale}>Registrar Venta</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Ventas del Día</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsBarChart data={dailySalesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="quantity" fill="#8884d8" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          )}

          {activeSection === 'inventory' && (
            <Card>
              <CardHeader>
                <CardTitle>Inventario</CardTitle>
                <Input
                  placeholder="Buscar por nombre, marca o talla"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm" />
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Marca</TableHead>
                      <TableHead>Talla</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map(product => (
                      <TableRow key={product.id}>
                        <TableCell>{product.id}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.brand}</TableCell>
                        <TableCell>{product.size}</TableCell>
                        <TableCell>${parseFloat(product.price).toFixed(2)}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>
                          <Button
                            onClick={() => startEditing(product.id, 'product')}
                            size="sm"
                            className="mr-2">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => deleteProduct(product.id)}
                            size="sm"
                            variant="destructive"
                            className="mr-2">
                            <Trash className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => updateItem(product.id, 'product')}
                            size="sm"
                            variant="outline">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {activeSection === 'suppliers' && (
            <>
              <div className="flex justify-between items-center mb-6">
                <Input
                  placeholder="Buscar por nombre o contacto"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm" />
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" /> Nuevo Proveedor
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    className="sm:max-w-[425px] bg-white shadow-lg rounded-lg p-4 z-50"
                    style={{ backgroundColor: 'white', opacity: 1 }}
                  >
                    <DialogHeader>
                      <DialogTitle>Agregar Nuevo Proveedor</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <Input
                        placeholder="ID"
                        name="id"
                        value={newSupplier.id}
                        onChange={(e) => handleInputChange(e, setNewSupplier)} />
                      <Input
                        placeholder="Nombre"
                        name="name"
                        value={newSupplier.name}
                        onChange={(e) => handleInputChange(e, setNewSupplier)} />
                      <Input
                        placeholder="Contacto"
                        name="contact"
                        value={newSupplier.contact}
                        onChange={(e) => handleInputChange(e, setNewSupplier)} />
                      <Input
                        placeholder="Email"
                        name="email"
                        value={newSupplier.email}
                        onChange={(e) => handleInputChange(e, setNewSupplier)} />
                      <Input
                        placeholder="Teléfono"
                        name="phone"
                        value={newSupplier.phone}
                        onChange={(e) => handleInputChange(e, setNewSupplier)} />
                      <Input
                        placeholder="Dirección"
                        name="address"
                        value={newSupplier.address}
                        onChange={(e) => handleInputChange(e, setNewSupplier)} />
                    </div>
                    <Button onClick={addSupplier}>Agregar Proveedor</Button>
                  </DialogContent>
                </Dialog>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Lista de Proveedores</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Contacto</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Teléfono</TableHead>
                        <TableHead>Dirección</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSuppliers.map(supplier => (
                        <TableRow key={supplier.id}>
                          <TableCell>{supplier.id}</TableCell>
                          <TableCell>
                            {editingSupplier === supplier.id ? (
                              <Input
                                value={supplier.name}
                                onChange={(e) => handleEditChange(e, supplier.id, 'supplier')}
                                name="name" />
                            ) : (
                              supplier.name
                            )}
                          </TableCell>
                          <TableCell>
                            {editingSupplier === supplier.id ? (
                              <Input
                                value={supplier.contact}
                                onChange={(e) => handleEditChange(e, supplier.id, 'supplier')}
                                name="contact" />
                            ) : (
                              supplier.contact
                            )}
                          </TableCell>
                          <TableCell>
                            {editingSupplier === supplier.id ? (
                              <Input
                                value={supplier.email}
                                onChange={(e) => handleEditChange(e, supplier.id, 'supplier')}
                                name="email" />
                            ) : (
                              supplier.email
                            )}
                          </TableCell>
                          <TableCell>
                            {editingSupplier === supplier.id ? (
                              <Input
                                value={supplier.phone}
                                onChange={(e) => handleEditChange(e, supplier.id, 'supplier')}
                                name="phone" />
                            ) : (
                              supplier.phone
                            )}
                          </TableCell>
                          <TableCell>
                            {editingSupplier === supplier.id ? (
                              <Input
                                value={supplier.address}
                                onChange={(e) => handleEditChange(e, supplier.id, 'supplier')}
                                name="address" />
                            ) : (
                              supplier.address
                            )}
                          </TableCell>
                          <TableCell>
                            {editingSupplier === supplier.id ? (
                              <Button onClick={() => saveEdit(supplier.id, 'supplier')} size="sm">
                                <Save className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button onClick={() => startEditing(supplier.id, 'supplier')} size="sm">
                                <Pencil className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              onClick={() => deleteSupplier(supplier.id)}
                              size="sm"
                              variant="destructive"
                              className="ml-2">
                              <Trash className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => updateItem(supplier.id, 'supplier')}
                              size="sm"
                              variant="outline"
                              className="ml-2">
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}

          {activeSection === 'statistics' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Estado del Inventario</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Aquí iría el gráfico de inventario */}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Ventas Diarias</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Aquí iría el gráfico de ventas */}
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>)
  );
}