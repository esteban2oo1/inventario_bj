'use client';
import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, BarChart, ShoppingCart, TrendingUp, Menu } from 'lucide-react'
import { Bar, Line } from 'react-chartjs-2'
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  PointElement 
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement
)

export function InventoryManagerComponent() {
  const [products, setProducts] = useState([])
  const [sales, setSales] = useState([])
  const [newProduct, setNewProduct] = useState({
    name: '',
    brand: '',
    size: '',
    price: 0,
    quantity: 0
  })
  const [newSale, setNewSale] = useState({
    productId: 0,
    quantity: 1
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [activeSection, setActiveSection] = useState('products')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewProduct(
      prev => ({ ...prev, [name]: name === 'price' || name === 'quantity' ? Number(value) : value })
    )
  }

  const addProduct = () => {
    setProducts(prev => [...prev, { ...newProduct, id: Date.now() }])
    setNewProduct({ name: '', brand: '', size: '', price: 0, quantity: 0 })
  }

  const addSale = () => {
    const saleProduct = products.find(p => p.id === newSale.productId)
    if (saleProduct && saleProduct.quantity >= newSale.quantity) {
      setSales(prev => [...prev, { ...newSale, id: Date.now(), date: new Date() }])
      setProducts(prev => prev.map(p => 
        p.id === newSale.productId ? { ...p, quantity: p.quantity - newSale.quantity } : p))
      setNewSale({ productId: 0, quantity: 1 })
    } else {
      alert('No hay suficiente stock para esta venta')
    }
  }

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.size.toLowerCase().includes(searchTerm.toLowerCase()))

  const inventoryChartData = {
    labels: products.map(p => p.name),
    datasets: [
      {
        label: 'Cantidad en stock',
        data: products.map(p => p.quantity),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  }

  const salesChartData = {
    labels: Array.from(new Set(sales.map(s => s.date.toLocaleDateString()))),
    datasets: [
      {
        label: 'Ventas diarias',
        data: Array.from(new Set(sales.map(s => s.date.toLocaleDateString()))).map(date => 
          sales.filter(s => s.date.toLocaleDateString() === date).reduce((acc, s) => acc + s.quantity, 0)),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: 'Gráfico',
      },
    },
    scales: {
      x: {
        type: "category",
        title: {
          display: true,
          text: 'Productos',
        },
      },
      y: {
        type: "linear",
        title: {
          display: true,
          text: 'Cantidad',
        },
        beginAtZero: true,
      },
    },
  }

  return (
    (<div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-white w-64 shadow-lg fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-center h-20 shadow-md">
          <h1 className="text-3xl font-bold text-primary">Boutique Fashion Friends</h1>
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
            className={`flex items-center mt-4 py-2 px-6 ${activeSection === 'inventory' ? 'bg-gray-200 text-gray-700' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'} transition-colors duration-200`}
            href="#"
            onClick={() => setActiveSection('inventory')}>
            <BarChart className="h-5 w-5" />
            <span className="mx-3">Inventario</span>
          </a>
          <a
            className={`flex items-center mt-4 py-2 px-6 ${activeSection === 'sales' ? 'bg-gray-200 text-gray-700' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'} transition-colors duration-200`}
            href="#"
            onClick={() => setActiveSection('sales')}>
            <ShoppingCart className="h-5 w-5" />
            <span className="mx-3">Ventas</span>
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
               activeSection === 'inventory' ? 'Inventario' :
               activeSection === 'sales' ? 'Registro de Ventas' : 'Estadísticas'}
            </h2>
          </div>
          <div className="flex items-center">
            {/* Add any additional header items here */}
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
          {activeSection === 'products' && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Agregar Nuevo Producto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Nombre"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange} />
                  <Input
                    placeholder="Marca"
                    name="brand"
                    value={newProduct.brand}
                    onChange={handleInputChange} />
                  <Input
                    placeholder="Talla"
                    name="size"
                    value={newProduct.size}
                    onChange={handleInputChange} />
                  <Input
                    type="number"
                    placeholder="Precio"
                    name="price"
                    value={newProduct.price}
                    onChange={handleInputChange} />
                  <Input
                    type="number"
                    placeholder="Cantidad"
                    name="quantity"
                    value={newProduct.quantity}
                    onChange={handleInputChange} />
                </div>
                <Button className="mt-4" onClick={addProduct}>Agregar Producto</Button>
              </CardContent>
            </Card>
          )}

          {activeSection === 'sales' && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Registrar Venta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    onValueChange={(value) => setNewSale(prev => ({ ...prev, productId: Number(value) }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar producto" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map(product => (
                        <SelectItem key={product.id} value={product.id.toString()}>{product.name}</SelectItem>
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
          )}

          {(activeSection === 'products' || activeSection === 'inventory') && (
            <Card>
              <CardHeader>
                <CardTitle>{activeSection === 'products' ? 'Lista de Productos' : 'Inventario'}</CardTitle>
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
                      <TableHead>Nombre</TableHead>
                      <TableHead>Marca</TableHead>
                      <TableHead>Talla</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Cantidad</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map(product => (
                      <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.brand}</TableCell>
                        <TableCell>{product.size}</TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {activeSection === 'statistics' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Estado del Inventario</CardTitle>
                </CardHeader>
                <CardContent>
                  <Bar data={inventoryChartData} options={chartOptions} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Ventas Diarias</CardTitle>
                </CardHeader>
                <CardContent>
                  <Line data={salesChartData} options={chartOptions} />
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>)
  );
}