import express from 'express';
import SalesRoutes from './routes/sales.routes'
import ProductRoute from './routes/products.routes'
import WarnaRoute from './routes/warna.routes'
import BrandRoute from './routes/brands.routes'
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use('/api/v1/sales', SalesRoutes)
app.use('/api/v1/product', ProductRoute)
app.use('/api/v1/warna', WarnaRoute)
app.use('/api/v1/brands', BrandRoute)

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
