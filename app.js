import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { UserRouter } from './routes/user.routes.js';
import { DMCRouter } from './routes/dmc.routes.js';
import { AdminRouter } from './routes/admin.routes.js';
import { AgentRoutes } from './routes/agent.auth.routes.js';
import { CpRoutes } from './routes/cp.auth.routes.js';
import { Flight } from './routes/flight.routes.js';
import { BusRoutes } from './routes/bus.routes.js';
import { HotelRoutes } from './routes/hotel.routes.js';
import { HolidayRoute } from './routes/holiday.routes.js';
import { SubAdminRoute } from './routes/subadmin.routes.js';
import { SupportRoute } from './routes/support.routes.js';
import { PymentRoute } from './routes/payment.routes.js';
import { AirlinemarkupRoute } from './routes/airmarkup.routes.js';
import { CoupenRoute } from './routes/coupen.routes.js';
import { HotelRouter } from './routes/trip.hotel.routes.js';
const app = express();

app.use(morgan('dev')); // Logging middleware (should be first to log all requests)

app.use(
  cors({
    origin: '*',
    credentials: true,
  })
); // CORS should come before parsing to handle preflight requests

app.use(express.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '200mb' }));
app.use(bodyParser.json({ limit: '200mb' }));

app.use(cookieParser()); // Should be after body parsing so cookies are available

// Routes
app.get('/', (req, res) => {
  res.send('hellowq');
});
// app.use('/flight', flightRouter);
app.use('/user', UserRouter);
app.use('/dmc', DMCRouter);
app.use('/admin', AdminRouter);
app.use('/flight', Flight);
app.use('/AgentAuth', AgentRoutes);
app.use('/CpAuth', CpRoutes);
app.use('/bus', BusRoutes);
app.use('/hotel', HotelRoutes);
app.use('/holiday', HolidayRoute);
app.use('/subadmin', SubAdminRoute);
app.use('/support', SupportRoute);
app.use('/payment', PymentRoute);
app.use('/markup/air', AirlinemarkupRoute);
app.use('/coupen', CoupenRoute);
app.use('/hotel/v1', HotelRouter);

export { app };
